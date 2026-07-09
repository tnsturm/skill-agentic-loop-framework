'use strict';

// Smoke test for homey/hooks/check-version-sync.js (PreToolUse Bash|PowerShell, install
// into a project's .claude/hooks/) — blocks `git commit` (exit 2) when app.json and
// .homeycompose/app.json disagree on version, and passes through otherwise (including
// non-commit commands and unreadable manifests, which fail open). No VioletApp
// test/hooks/check-version-sync.test.js exists to port from (flagged as a gap in
// CHANGELOG 0.1.5); written directly against homey/hooks/check-version-sync.js,
// mirroring the sibling hook tests in this directory.

const { test } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const HOOK = path.join(__dirname, '..', '..', 'hooks', 'check-version-sync.js');

// Throwaway Homey-compose project. Pass undefined for either version to omit that
// manifest entirely (simulates an unreadable/missing file).
function makeProject(rootVersion, composeVersion) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'check-version-sync-'));
  if (rootVersion !== undefined) {
    fs.writeFileSync(path.join(dir, 'app.json'), JSON.stringify({ version: rootVersion }));
  }
  if (composeVersion !== undefined) {
    fs.mkdirSync(path.join(dir, '.homeycompose'), { recursive: true });
    fs.writeFileSync(path.join(dir, '.homeycompose', 'app.json'), JSON.stringify({ version: composeVersion }));
  }
  return dir;
}

function runHook(command, cwd, raw) {
  const payload = raw !== undefined
    ? raw
    : JSON.stringify({ tool_name: 'Bash', cwd, tool_input: { command } });
  const r = spawnSync(process.execPath, [HOOK], { input: payload, encoding: 'utf8' });
  return { code: r.status, err: (r.stderr || '').trim() };
}

test('check-version-sync: matching versions, git commit → PASS', () => {
  const dir = makeProject('0.3.0', '0.3.0');
  const { code, err } = runHook('git commit -m "release"', dir);
  assert.strictEqual(code, 0, err);
});

test('check-version-sync: mismatched versions, git commit → BLOCK naming both versions', () => {
  const dir = makeProject('0.3.0', '0.3.1');
  const { code, err } = runHook('git commit -m "release"', dir);
  assert.strictEqual(code, 2);
  assert.match(err, /0\.3\.0/);
  assert.match(err, /0\.3\.1/);
});

test('check-version-sync: mismatched versions, non-commit command → PASS', () => {
  const dir = makeProject('0.3.0', '0.3.1');
  const { code } = runHook('git status', dir);
  assert.strictEqual(code, 0);
});

test('check-version-sync: mismatched versions, git commit embedded in a longer command → BLOCK', () => {
  const dir = makeProject('0.3.0', '0.3.1');
  const { code } = runHook('npx homey app build && git commit -am "wip"', dir);
  assert.strictEqual(code, 2);
});

test('check-version-sync: missing root app.json → PASS (fail-open)', () => {
  const dir = makeProject(undefined, '0.3.0');
  const { code } = runHook('git commit -m "release"', dir);
  assert.strictEqual(code, 0);
});

test('check-version-sync: missing .homeycompose/app.json → PASS (fail-open, not a compose repo)', () => {
  const dir = makeProject('0.3.0', undefined);
  const { code } = runHook('git commit -m "release"', dir);
  assert.strictEqual(code, 0);
});

test('check-version-sync: malformed stdin → PASS (fail-open)', () => {
  const { code } = runHook(null, undefined, 'not json{');
  assert.strictEqual(code, 0);
});
