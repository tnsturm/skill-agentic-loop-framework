'use strict';

// Hook telemetry (pure helper) — extracted from VioletApp M4.8
// (see the agentic-loop-framework CHANGELOG).
// One JSONL decision record per hook decision, appended to the guarded repo's
// .claude/hooks/hook-log.jsonl (gitignored). Resolution is cwd-based on purpose:
// hook smoke tests spawn hooks with fixture cwds that have no .claude/hooks/
// dir, so those runs skip silently instead of polluting the real log (or the
// fixture). Strictly fail-silent — telemetry must never break a hook.

const fs = require('fs');
const path = require('path');

/**
 * Append one decision record ({ts, hook, decision}) to the repo-local hook log.
 * Never throws (spec D1); no-op when cwd is missing or <cwd>/.claude/hooks/ does
 * not exist (D2). cwd must be the EXPLICIT hook-input cwd — no process.cwd()
 * fallback: hook smoke tests spawn hooks without a payload cwd while the suite
 * itself runs in the real repo, and a fallback made those fixture decisions
 * pollute the real log (found live during the M4.8 E2E verify).
 *
 * That fix only covers callers that pass `cwd` straight through: several hooks'
 * own `main()` computes `input.cwd || process.cwd()` BEFORE calling logHook, so
 * an unset payload cwd silently resolves to the real repo again — confirmed live
 * (VioletApp M6.0 retro): a hook's own test suite alone wrote hundreds of fake
 * "block" records into the real hook-log.jsonl this way. `HOOK_LOG_DISABLE` is
 * the explicit test-only opt-out for exactly that case (dev telemetry, not a
 * security/audit log — the block DECISION itself is unaffected either way):
 * hook test harnesses set it so any cwd a hook computes internally still can't
 * produce telemetry.
 * @param {string} hook Hook name, e.g. `test-gate`.
 * @param {'block'|'pass'} decision Outcome at a real decision point (D3).
 * @param {string|undefined} cwd Guarded repo root (the hook-input cwd), or undefined to skip.
 */
function logHook(hook, decision, cwd) {
  if (!cwd || process.env.HOOK_LOG_DISABLE) return; // fixture safety, D2 + M6.0 retro
  try {
    fs.appendFileSync(
      path.join(cwd, '.claude', 'hooks', 'hook-log.jsonl'),
      `${JSON.stringify({ ts: new Date().toISOString(), hook, decision })}\n`
    );
  } catch {
    // telemetry must never break a hook (spec D1)
  }
}

module.exports = { logHook };
