'use strict';

// PreToolUse hook (matcher: Bash|PowerShell) — blocks `homey app install|publish` when
// the release checklist (HOMEY.md) is provably incomplete:
//   (a) .homeychangelog.json lacks a non-empty en AND de entry for the version
//       in .homeycompose/app.json (the compose manifest is the source of truth),
//   (b) that version is already logged in docs/dashboard/versions.md — a
//       forgotten bump would silently double-release under the same number,
//   (c) publish only, if the app already tracks credential rotation (a
//       docs/superpowers/security/credential-rotation.md exists): that file has no
//       YYYY-MM-DD rotation date, i.e. rotation was started but never proven.
// All violations are collected and reported together (one fix round instead of
// three). Pattern mirrors check-version-sync.js: fail open on our own errors
// (no compose manifest -> not ours to gate), exit 2 only on real findings.
//
// Extracted from VioletApp M4.6 (see the framework CHANGELOG) — part (c) genericized:
// VioletApp's original enforces rotation proof unconditionally for every publish
// (it always manages a device credential); here it only fires once a
// credential-rotation.md already exists, so apps without device credentials are
// never forced to create one just to satisfy this gate.

const fs = require('fs');
const path = require('path');
const { logHook } = require('./lib/log');
const { isChangelogEntryComplete } = require('./lib/changelog');

let payload = '';
process.stdin.on('data', (chunk) => { payload += chunk; });
process.stdin.on('end', () => {
  let input;
  try {
    input = JSON.parse(payload);
  } catch {
    process.exit(0); // can't parse -> fail open, don't block on our own error
  }

  const command = (input.tool_input && input.tool_input.command) || '';
  const m = command.match(/\b(?:npx\s+)?homey\s+app\s+(install|publish)\b/);
  if (!m) {
    process.exit(0); // only care about releases
  }
  const action = m[1];

  const cwd = input.cwd || process.cwd();
  let version;
  try {
    version = JSON.parse(fs.readFileSync(path.join(cwd, '.homeycompose', 'app.json'), 'utf8')).version;
  } catch {
    process.exit(0); // no compose manifest -> not a Homey compose repo, not ours to gate
  }
  if (!version) {
    process.exit(0);
  }

  const problems = [];

  // (a) changelog must have a complete en+de entry for this version
  let changelog = null;
  try {
    changelog = JSON.parse(fs.readFileSync(path.join(cwd, '.homeychangelog.json'), 'utf8'));
  } catch {
    problems.push(
      `.homeychangelog.json is missing or invalid JSON — add the ${version} entry (en+de) `
      + 'programmatically (HOMEY.md: build JSON via node + JSON.stringify, never hand-type delimiters).'
    );
  }
  if (changelog) {
    const entry = changelog[version];
    if (!isChangelogEntryComplete(entry)) {
      problems.push(
        `.homeychangelog.json has no complete en+de entry for ${version} — `
        + 'write both languages before releasing (HOMEY.md release checklist step 3).'
      );
    }
  }

  // (b) the version must not already be logged: forgotten bump = double release.
  // Only table rows count (line starts with "| `X.Y.Z`") — versions.md also
  // mentions the PLANNED next version in prose ("Naechster Upload: `X.Y.Z`"),
  // which must not block the very release it announces.
  try {
    const log = fs.readFileSync(path.join(cwd, 'docs', 'dashboard', 'versions.md'), 'utf8');
    if (new RegExp('^\\|\\s*`' + version.replace(/\./g, '\\.') + '`', 'm').test(log)) {
      problems.push(
        `version ${version} is already logged in docs/dashboard/versions.md — `
        + 'bump first ("npx homey app version patch|minor", HOMEY.md) so every release gets a fresh number.'
      );
    }
  } catch {
    // no versions log -> nothing to double-release against, skip this check
  }

  // (c) publish only, and only if this app already tracks credential rotation:
  // an EXISTING but undated credential-rotation.md means rotation was started but
  // not proven — block. A MISSING file means this app has no device credential to
  // rotate — skip (don't force apps without credentials to create the file).
  if (action === 'publish') {
    const rotationPath = path.join(cwd, 'docs', 'superpowers', 'security', 'credential-rotation.md');
    if (fs.existsSync(rotationPath)) {
      let proof = '';
      try {
        proof = fs.readFileSync(rotationPath, 'utf8');
      } catch {
        // unreadable existing file is handled by the date check below
      }
      if (!/\b\d{4}-\d{2}-\d{2}\b/.test(proof)) {
        problems.push(
          'no credential-rotation proof: docs/superpowers/security/credential-rotation.md exists '
          + 'but has no YYYY-MM-DD rotation date — record the date this app\'s device write '
          + 'credential was rotated before publish.'
        );
      }
    }
  }

  if (problems.length > 0) {
    logHook('release-gate', 'block', cwd);
    console.error(
      `release-gate: blocking "homey app ${action}" for version ${version}:\n- ${problems.join('\n- ')}`
    );
    process.exit(2); // block the release
  }

  logHook('release-gate', 'pass', cwd);
  process.exit(0);
});
