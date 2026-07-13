'use strict';

// PreToolUse hook (matcher: Bash|PowerShell) — blocks `git commit` while the repo's own
// test suite is red, so failing tests can't land in history (extracted from
// VioletApp M4.6 — see the agentic-loop-framework CHANGELOG).
// Register it ALONGSIDE other gates, not merged: Claude Code runs matching
// hooks in parallel, so commit latency is max(gates) instead of the sum, and
// each gate stays single-purpose and fail-open. The test command comes from
// package.json scripts.test: no npm/npm.cmd startup detour on Windows, and the
// command stays project-defined. Repos without a test script are never blocked.
// Fail open on our own errors, exit 2 only on a real finding.
//
// NON-NPM STACKS: replace the scripts.test resolution below with the project's
// own FAST test command (runtime budget <= 30 s; the full suite belongs in the
// CI/review gate, not in the commit path).

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { logHook } = require('./lib/log');
const { spawnEnv } = require('./lib/spawn-env');

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
  if (!/\bgit\s+commit\b/.test(command)) {
    process.exit(0); // only care about commits
  }

  const cwd = input.cwd || process.cwd();
  let testScript;
  try {
    testScript = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8')).scripts.test;
  } catch {
    process.exit(0); // no readable package.json/scripts -> not ours to gate
  }
  if (!testScript) {
    process.exit(0); // no test script -> nothing to gate
  }

  // shell:true because scripts.test is a shell command line (like npm run);
  // spawnEnv strips the node:test child markers (lib/spawn-env.js — M4.6/M4.7 lesson).
  const r = spawnSync(testScript, { cwd, shell: true, encoding: 'utf8', env: spawnEnv() });
  if (r.status === 0) {
    logHook('test-gate', 'pass', cwd);
    process.exit(0); // green
  }
  if (r.status === null) {
    process.exit(0); // the suite failed to spawn -> fail open (nothing was checked)
  }

  logHook('test-gate', 'block', cwd);
  console.error(
    `test-gate: test suite ("${testScript}") failed — fix the failing tests below `
    + '(or run "npm test") before committing.\n'
    + [r.stdout, r.stderr].filter(Boolean).join('\n').trim()
  );
  process.exit(2); // block the commit
});
