---
name: agentic-loop-framework
description: 'Bootstrap a loop-driven agentic development framework in any repo — verified, self-correcting loops (gate hooks, progress dashboard, milestone checkpoints, hook telemetry) instead of prompt-by-prompt work. Triggers: "set up an agentic loop", "framework bootstrap", "set up verified loops", "convert a project to milestone loops" — for new AND existing projects.'
---

# Agentic-Loop-Framework — Bootstrap

Sets up a loop-driven agentic development framework in a repository.
Core: machine-verified loops (tests + gates), a self-documenting dashboard,
checkpoints that improve the framework itself, and telemetry as the retrospective data basis.

**Artifact sources:** Rather than reinventing files, copy the bundled tree
[`templates/`](templates/) and adapt the placeholders (angle brackets `<…>`).
For Homey apps additionally [`homey/README.md`](homey/README.md) (platform add-on block).
Historical seed: the bootstrap prompts (de/en, as of 2026-07-07) — since 2026-07-09 only
in the git history of the repo `skill-ClaudeCode-general-settings` (commit `fcbda47`);
this repo is the single living source.

## Clarify up front (if not stated in the task)

1. Project: NEW (purpose, language/stack) or EXISTING (so far without Claude)?
2. Team: solo or shared (the framework skill is then distributed as a plugin)?
3. Language of all generated artifacts (CLAUDE.md, dashboard, changelogs): de or en?
4. Bootstrap commits: directly on main (solo/new repo) or branch `bootstrap/agentic-loop`?

## Rules for the entire bootstrap

- Phases strictly in sequence; commit separately after each phase.
- If a platform add-on follows (e.g. `homey/`): read EVERYTHING first; each "Phase-N add-on"
  runs together with Phase N, context/standing-rule add-ons apply from Phase 0.
- Simplicity First: only automation that addresses recurring pain — nothing speculative.
- Ask questions only at the marked DECISION POINTS — otherwise work autonomously.
- The bootstrap's phase commits are exempt from the §9 review gate; §9 applies from Phase 7.
- Context hygiene: track the bootstrap from Phase 1 as its own dashboard entry
  (id "B0", steps = phases 0–7). After Phase 2 and Phase 5: commit, update B0, output a
  resume prompt for the next phase — the user decides whether a fresh session takes over.

## Phase 0 — Preflight & inventory

1. Check tools, classify each result as AVAILABLE / MISSING-BLOCKING /
   MISSING-DEGRADABLE:
   - BLOCKING (without them, stop + name the installation path): git (repo present? otherwise
     git init + a stack-typical .gitignore), superpowers skills (brainstorming, writing-plans,
     test-driven-development, systematic-debugging, verification-before-completion),
     /code-review.
   - DEGRADABLE (omit + document a fallback in CLAUDE.md):
     /claude-automation-recommender, /fewer-permission-prompts,
     /goal (fallback: DONE CONDITIONS as a numbered plain-text checklist in the prompt),
     /remote-control (fallback: omit the line), /security-review,
     security-requirement-extraction (fallback: STRIDE manually — assets/trust boundaries/
     threats → testable requirements),
     context7 MCP (fallback: official docs via WebFetch — never from memory),
     Auto-Memory (fallback: docs/memory/*.md + docs/memory/MEMORY.md as index),
     GitHub MCP server (PR/issue/branch operations directly from the session) —
     set up if desired:
     1. Fine-grained PAT: https://github.com/settings/personal-access-tokens — select
        repo(s), set Permissions Contents/Pull requests/Issues each to Read-and-write.
     2. `claude mcp add-json github '{"type":"http","url":"https://api.githubcopilot.com/mcp","headers":{"Authorization":"Bearer YOUR_GITHUB_PAT"}}'`
        run in the project directory.
     3. Smoke test: one real read call against the repo (e.g. `list_branches`) — "Connected"
        alone is not enough (details/pitfalls: milestone-checkpoint SKILL.md, step 2).
        If the test fails: restart Claude Desktop, then test again.
     Fallback without MCP: use the git/gh CLI directly — not a blocker for the bootstrap.
2. For an existing project: analyze stack, build/test system (incl. suite RUNTIME!), CI,
   git history, open TODOs; summarize the current state in max. 10 lines.

→ verify: tool table (name | status | fallback if any) + current-state summary in chat.

## Phase 1 — Foundation: state on disk

Copy from [`templates/`](templates/) and adapt (NEVER overwrite existing files —
merge carefully for existing projects):

1. `templates/CLAUDE.md` → repo root. Contains §0 mandatory skills, §1–§4 Karpathy core
   (original: github.com/multica-ai/andrej-karpathy-skills, incl. the tradeoff note and
   closing paragraph), §4 add-on todo-test convention, §5 Security by Design (STRIDE),
   §6 `<PLATFORM>.md` mechanism, §7 dashboard protocol (incl. FRICTION and
   triage-inbox rule), §8 versioning 0.X.Y, §9 branch gate, §10 permission strategy
   (3 layers), §11 subagent tiering, source-of-truth section. Fill the placeholders;
   in Phase 1 add the §7 note: "the milestone-checkpoint skill is set up in Phase 5
   of this bootstrap" (removed in Phase 5).
2. `templates/docs/dashboard/` → `docs/dashboard/` (dashboard.html with an empty data block —
   the renderer beneath it is NEVER edited; versions.md skeleton; triage-inbox.md skeleton;
   native-feature-review.md ledger, seeded — read by the checkpoint's step 6b).
   Put the B0 bootstrap entry into the data block.
3. `templates/.claude/settings.json` → `.claude/settings.json` (empty hook scaffold by
   events + minimal read-only allowlist + `disableSkillShellExecution: true`, the §5
   Extension-Hygiene default posture). §10 short form: (i) Hooks = "must NEVER
   happen", apply in every permission mode; (ii) project allowlist = "is ALWAYS ok",
   git-portable, curated via /fewer-permission-prompts; (iii) Auto Mode
   (claude --permission-mode auto) only for autonomous loop sessions; bypassPermissions NEVER locally.
4. Memory: first project memories (project goal, stack decisions, conventions) + index —
   into the Auto-Memory directory if available, otherwise docs/memory/ (document the
   location in CLAUDE.md).

→ verify: everything committed; a node one-liner extracts window.DASHBOARD_STATUS from
dashboard.html and parses it without error.

## Phase 2 — Milestone plan (define the loop iterations)  [interactive]

1. DECISION POINT: superpowers:brainstorming with the user — what is M0 (foundation),
   what are M1..Mn? Result as a design spec under docs/superpowers/specs/.
2. superpowers:writing-plans for M0 (docs/superpowers/plans/).
3. Fill the dashboard: each milestone with a full resume prompt; each prompt contains
   (a) the machine-checkable done condition — /goal line or DONE CONDITIONS checklist
   (fallback from Phase 0), transcript-verifiable ("test runner shows 0 failures AND
   build/validate shows PASS — outputs shown in chat");
   (b) the start-mode note per §10 (autonomous run via claude --permission-mode auto;
   everyday session in default mode);
   (c) the triage-inbox line ("Read docs/dashboard/triage-inbox.md first, §7");
   (d) as the last line /remote-control <id> — <title> (if available).

→ verify: dashboard shows all milestones, each unfinished one with a full prompt.
Then: commit, update B0, output the resume prompt for Phase 3.

## Phase 3 — Inner loop: mechanical verification

1. If no test runner exists: set up the lightest stack-typical one
   (goal: seconds runtime, minimal dependencies) + a first smoke test.
2. Adopt `templates/.claude/hooks/test-gate.js` + `templates/.claude/hooks/lib/` +
   `templates/test/hooks/test-gate.test.js` and register it in settings.json
   (matcher `Bash|PowerShell` — Windows sessions commit via the PowerShell tool!).
   The hook reads the test command from `package.json scripts.test`; for non-npm stacks
   adapt the spot documented in the hook header. Runtime budget ≤30 s
   (DECISION POINT for an existing project with a slow suite: which fast subset? The full
   suite then runs in the CI/review gate).
3. Hook-loading reality: settings.json hooks can take effect immediately OR only at the next
   session start (varies by version) — therefore ALWAYS do in-session verify via
   direct call with fixture stdin (red case exit 2, green exit 0); the
   end-to-end check (a real commit gets blocked) is the documented first step
   of the follow-up session.
4. Anchor in CLAUDE.md: ALWAYS look up framework/library questions via context7 (or
   WebFetch fallback) instead of from memory.

→ verify: both direct calls of the hook script return the specified exit codes.

## Phase 4 — Automation pass (repo-specific instead of generic)

1. Run /claude-automation-recommender. Skip criterion: no production code yet
   beyond the Phase 1 scaffold or no runnable test → skip and note it as the first
   step of the first →M0 checkpoint.
2. Present the recommendations prioritized (recurring pain × effort).
   DECISION POINT: the user chooses.
3. Implement the chosen ones: hooks each with smoke test + direct-call verify (Phase 3.3); skills;
   subagents (e.g. a read-only release-readiness checker with a PASS/FAIL checklist) with
   model/effort frontmatter per the tiering rule: mechanical checklist/extraction
   agents → model: haiku/sonnet + effort: low/medium; review/judge/security agents →
   model: inherit (NEVER economize on the checker — feedback quality is the loop bottleneck).

→ verify: each new hook checked via direct call.

## Phase 5 — Meta-loop: the framework improves itself

Adopt `templates/.claude/skills/milestone-checkpoint/SKILL.md` → `.claude/skills/
milestone-checkpoint/SKILL.md`; fill the skill-sources placeholder (step 3) with
the project's real external sources. The checkpoint runs after every
milestone "done" (its own `Mx.0` "Housekeeping Agentic Loop" dashboard entry; the
implementation milestone it gates is numbered `Mx.1`) and covers: branch/worktree
cleanup (first action, before the skill), workflow retro (reads
FRICTION entries + hook-log.jsonl block counts), /fewer-permission-prompts,
/claude-automation-recommender, skill-source vetting (review before update — §5 Extension
Hygiene), memory consolidation (as a diff only!), framework reconciliation (6a drift against
this skill, 6b native-feature review via docs/dashboard/native-feature-review.md),
dashboard update, handover (push + start question).

Then remove the Phase 1 note in CLAUDE.md §7. Commit, update B0, output the
resume prompt for Phase 6.

→ verify: skill exists; CLAUDE.md §7 names the checkpoint as a mandatory step, without the note.

## Phase 6 — Anchor the source of truth

This repo already IS the portable skill — in the project just anchor it:

1. Source-of-truth rule in CLAUDE.md (template in `templates/CLAUDE.md`): EVERY generic
   framework change (gate/guard hooks, protocol rules, checkpoint flow, templates)
   is mirrored here IN THE SAME SESSION + a CHANGELOG entry; project/stack-specific
   things stay in the project. Rule of thumb: "useful in every project?" → skill;
   "only here?" → project.
2. Telemetry: `.claude/hooks/lib/log.js` is included in the template tree — every new hook
   logs block/pass at its decision points (pattern in test-gate.js).

→ verify (dry test): copy templates/ into a temp directory — the dashboard.html
data block parses, settings.json parses, `node --test test/hooks/test-gate.test.js` green.

## Phase 7 — Trial run of the whole loop (§9 applies from here)

1. Take one deliberately small, real task from M0 through the complete loop:
   TDD → gates → dashboard maintenance → /code-review → §9 question to the user.
2. Log every friction immediately as a FRICTION: entry in the dashboard log — first retro fuel for
   the M0.0 checkpoint.

→ verify: task merged OR open as a PR; dashboard and memory up to date.

## Standing rules (anchored in CLAUDE.md; apply from now on)

- Keep the active milestone's dashboard entry current in every session.
- Friction IMMEDIATELY as a `FRICTION:` log entry in the active milestone — the retro reads it.
- After every milestone "done" and before the next start: milestone-checkpoint (its own
  Mx.0 dashboard entry).
- Every deployed/installed state: bump the version + a versions.md line (§8).
- New durable insights immediately as a memory file + an index line.
- Freeze known defects immediately as a `{ todo: true }` test with the CORRECT expectation.
- Bugs: superpowers:systematic-debugging first. Completion reports: superpowers:verification-before-completion first.
- Permission strategy per §10: hooks always; allowlist for everyday; Auto Mode only for
  autonomous loop sessions; bypassPermissions never locally.
- Third-party skills/agents/hooks/MCP: never adopt or update unreviewed (§5 Extension Hygiene);
  `disableSkillShellExecution: true` stays on unless a named skill needs otherwise.
- Subagent model tiering: mechanical → haiku/sonnet + lower effort; judging →
  inherit; in workflows steer effort per stage.
- Ask questions only at DECISION POINTS or §9 gates — otherwise autonomous.
