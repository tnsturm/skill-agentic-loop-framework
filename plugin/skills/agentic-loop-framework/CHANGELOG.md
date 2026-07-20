# Changelog — agentic-loop-framework

## 0.1.19 (2026-07-20)

- **Extension Hygiene** — new CLAUDE.md §5 block covering third-party skills, agents, hooks and
  MCP servers, the sibling of the existing Dependency Hygiene rule. Motivated by two independent
  security labs (Reversec 06/2026, Datadog 05/2026) with working PoCs: skills exfiltrate
  credentials, and `` !`cmd` `` dynamic-context blocks execute during preprocessing — before the
  model can refuse. Skills also need no install step (a cloned repo's `.claude/skills/` loads on
  workspace trust).
- **Fixed an unreviewed third-party code path in our own checkpoint**: `milestone-checkpoint`
  step 3 / Pattern A used to `git pull` external skill repos and copy them into
  `~/.claude/skills/` automatically, explicitly "no confirmation needed". It now reviews the
  incoming diff against the §5 checklist (mechanical `grep` pre-filter for dynamic-context,
  `allowed-tools`, network, credential paths, `eval`/base64, postinstall) and blocks on any hit,
  leaving the older version in place. A stale skill beats an unreviewed one.
- `disableSkillShellExecution: true` added to `templates/.claude/settings.json`. Verified
  2026-07-20 that no framework template, no VioletApp skill, and no installed plugin skill body
  uses dynamic context, so this breaks nothing today; bundled/managed skills are out of scope
  per the docs.
- **Step 6 is now "Framework reconciliation"** with two directions: 6a the existing drift check
  (project → framework), 6b a new **native-feature review** (framework → platform) asking which
  of our own instructions/skills/hooks/agents Claude Code now does natively. Carried by a new
  ledger template `templates/docs/dashboard/native-feature-review.md`, seeded with today's
  verdicts (auto memory vs. our memory convention, `/code-review` vs. §9, etc.). Bias: keep
  mechanically-enforcing artifacts, retire prose rules the platform now satisfies by default.
  No step renumbering — 7 (dashboard) and 8 (handover) are unchanged.

## 0.1.18 (2026-07-15)

- Fixed a hook-telemetry pollution bug found live during VioletApp's M6.0 checkpoint
  workflow retro: hook test suites that spawn a hook subprocess without an isolated
  `cwd` cause the hook's own `input.cwd || process.cwd()` fallback to resolve to the
  REAL project repo, so every `logHook()` call in the test run writes a fake decision
  record into the real (gitignored) `hook-log.jsonl` — up to hundreds of entries per
  full test run for a hook with many block-path test cases. The M4.8 fixture-safety
  fix in `templates/.claude/hooks/lib/log.js` only covered an explicitly-undefined
  `cwd`, not this fallback case. Added a `HOOK_LOG_DISABLE` test-only env opt-out to
  `logHook()` (dev telemetry only — the block DECISION itself is unaffected either
  way) and wired it into all four hook-spawn call sites of
  `templates/test/hooks/package-guard.test.js` (its own helper functions plus two
  standalone `spawnSync` calls that bypassed them).
- `homey/README.md`: documented the `changelog-lang-guard` hook (installation table +
  Phase 3 add-on section) — the hook file and its test already shipped in
  `homey/hooks/`/`homey/test/hooks/` since 0.1.x, but the README never listed it, so a
  project bootstrapped from this module's Phase-1 instructions never actually adopted
  it. Found via a stale `loop-dev-roadmap` memory note in VioletApp, re-verified live.

## 0.1.17 (2026-07-14)

- Checkpoint naming convention renamed (mirror of VioletApp, 2026-07-14): between-milestone
  checkpoint entries are now `id: "Mx.0"`, `title: "Housekeeping Agentic Loop"` (previously
  `id: "→Mx"`, `title: "Zwischen-Check"`), and the implementation milestone a checkpoint
  gates is numbered `Mx.1`. Updated in `templates/CLAUDE.md` §7 point 4,
  `templates/.claude/skills/milestone-checkpoint/SKILL.md`, and this plugin's `SKILL.md`
  (Phases 5/7, standing rules). Historical `→Mx` mentions in code comments and old
  changelog entries are left as-is.
- New first checkpoint action (before running the milestone-checkpoint skill):
  branch/worktree cleanup — check locally and on origin for no-longer-needed branches
  and worktrees, show a short explanation per candidate, offer selectable deletion,
  then delete the selected branches (local + origin) and worktrees (git + disk).
  Anchored in `templates/CLAUDE.md` §7 point 4; projects add it as the first
  `steps[]` label ("Branch-/Worktree-Cleanup") and as ACTION 1 of their checkpoint
  resume prompts.

## 0.1.16 (2026-07-14)

- Hardened `parseInstallCommand` against two gate-bypasses found in the M5.9 security
  review: a leading `VAR=val` env-assignment prefix no longer hides an install from the
  parser (`CI=true npm i <fake>` is now caught), and `npx`/`npm exec` `-p`/`--package X`
  (and `--package=X`) now verify X — the package npx actually fetches and executes —
  instead of the command name. Ephemeral positional detection is per-segment.
- New `package-guard` PreToolUse hook (slopsquatting defense) — mirror of VioletApp M5.9:
  blocks agent-initiated npm installs (`npm install|i|add|exec`, `npx`, `yarn add`,
  `pnpm add`; Bash AND PowerShell) and `package.json` edits (all dep blocks incl.
  recursive `overrides` and `npm:` alias TARGETS) that name unverified packages —
  nonexistent on the registry, first published < 90 days ago, < 500 weekly downloads,
  or unverifiable (registry unreachable → fail CLOSED; harness-input parse errors fail
  open per house convention). Pure logic in `templates/.claude/hooks/lib/package-specs.js`
  (parse/resolve/diff/verdict, fully offline-testable), IO shell in
  `templates/.claude/hooks/package-guard.js`, tests with a local `node:http` stub registry
  in `templates/test/hooks/package-guard.test.js` (no real network). Registered in
  `templates/.claude/settings.json` (both PreToolUse matcher groups). New CLAUDE.md §5
  block "Dependency Hygiene": existence proof for new deps in specs/plans,
  `--ignore-scripts` for agent installs. Template divergence from the VioletApp origin
  (the only one, noted in both headers): `BLOCK_RUNTIME_DEPS = false` (generic projects
  have runtime deps; Violet freezes `dependencies` at `{}`). Origin: VioletApp M5.9
  threat model (STRIDE, SR-01..SR-10) + spec 2026-07-14.

## 0.1.15 (2026-07-13)

- Full English i18n of the plugin's German-language artifacts — the repo now ships in
  English throughout, except the intentionally bilingual German halves `README.md` and
  `assets/struktur.svg`. Translated: `SKILL.md` (body + frontmatter — also fixed a GitHub
  YAML error by single-quoting the `description`, whose unquoted `Trigger: ` colon was
  parsed as a mapping); the `plugin.json` + `.claude-plugin/marketplace.json` descriptions;
  the `templates/` tree (`CLAUDE.md` tail, `docs/dashboard/{triage-inbox,versions}.md`,
  `docs/dashboard/dashboard.html` UI strings + `lang`, `.claude/skills/milestone-checkpoint/SKILL.md`
  body); the `homey/` module (`HOMEY.md`, `README.md`, `agents/release-readiness.md`,
  `allowlist.json` comment); the previously-German 0.1.0–0.1.2 changelog entries below; and
  the German header comments across the gate/guard hooks, `lib/` helpers, and smoke tests.
  Added an English structure diagram `assets/struktur.en.svg` (referenced from `README.en.md`;
  the German `README.md` keeps `assets/struktur.svg`); both diagrams' `plugin.json` version
  label refreshed to 0.1.15. Where code was involved the change is
  comment/string-only — no hook logic, dashboard renderer logic, or `window.DASHBOARD_STATUS`
  structure was altered. Every substantive file was verified meaning-equivalent by a second
  bilingual instance; `dashboard.html`/`struktur.en.svg` additionally checked for
  structural/behavioral parity. Origin: user request 2026-07-13.

## 0.1.14 (2026-07-09)

- New dashboard field `recommendedModel: {model, effort, why}` on every open milestone —
  a per-milestone Claude model/reasoning-effort recommendation, distinct from §11's
  existing subagent tiering. `templates/docs/dashboard/dashboard.html` renders it (new
  `.modelrec` CSS class + renderer block, mirroring the `.cur`/currentActivity pattern).
  `CLAUDE.md` §11 renamed "Model Tiering (Subagents & Milestones)" with a new "Milestones
  (main-loop sessions)" subsection defining the tiering heuristic (mechanical/checklist →
  mid-tier low/medium; open design/research → mid-tier medium; high-stakes judgment calls,
  e.g. GO/NO-GO decisions, untested-crash-surface work, correctness-critical domain logic,
  or anything with its own threat-model → flagship model, high/xhigh). §7's field list and
  rules updated to require setting it at milestone-creation time. `milestone-checkpoint`
  SKILL.md step 7 now checks/sets it for every open milestone during the dashboard update,
  and step 8 (Handover) backfills it for the next milestone if missing before the push
  notification goes out. Origin: Violet Homey App session 2026-07-09 (user asked for a
  model/effort recommendation on every open milestone + for this to become standard
  practice for future milestones/projects).

- `SKILL.md` Phase 0 (Preflight) gains a GitHub-MCP-Server entry in the tool-check list:
  create a fine-grained PAT (direct link to
  https://github.com/settings/personal-access-tokens) scoped to Contents/Pull
  requests/Issues read-write, register it via `claude mcp add-json github '{"type":"http",
  "url":"https://api.githubcopilot.com/mcp","headers":{"Authorization":"Bearer
  YOUR_GITHUB_PAT"}}'`, then smoke-test with a real read call — "Connected" alone doesn't
  prove the token or session actually works (full pitfalls: milestone-checkpoint SKILL.md,
  step 2). Fallback: git/gh CLI, no bootstrap blocker.
- `templates/.claude/skills/milestone-checkpoint/SKILL.md` gets a much shorter "Step 0:
  Check the GitHub MCP connection" instead — just a connection + smoke-test check, pointing to
  the bootstrap skill's Phase 0 for actual setup. (Supersedes the full walkthrough
  mistakenly added there in an unpublished 0.1.13 draft — moved to the right place.)

## 0.1.12 (2026-07-09)

- `templates/.claude/skills/milestone-checkpoint/SKILL.md` step 2, MCP-server handling
  extended with three gotchas learned verifying a standalone GitHub MCP server
  end-to-end: **(1)** `claude mcp add` defaults to `--scope local` (bound to whatever
  directory the command ran in) — use `--scope user` for cross-project availability.
  **(2)** A newly connected server's tools do NOT load into an already-running session
  even once `claude mcp get <name>` shows "Connected" — only a fresh session picks them
  up via `ToolSearch`. **(3)** "Connected" only proves the handshake, not that the token
  can do anything: a fine-grained PAT with no repo access 404s on every repo call; one
  with read-only access 403s on write calls (`create_branch`, `push_files`, …) —
  `get_me` succeeds in both broken states, so it's not a reliable health check. Verified
  live end-to-end: created a local branch + commit, pushed it via `push_files`, confirmed
  the commit on GitHub via `get_commit`, then cleaned up both sides. Documents the
  required repo permissions for the GitHub MCP server: Contents (R/W), Pull requests
  (R/W), Issues (R/W).

## 0.1.11 (2026-07-09)

- `templates/.claude/skills/milestone-checkpoint/SKILL.md` step 2, MCP-server handling
  refined: a recommender hit for `plugin:<category>:<name>` (e.g. `plugin:engineering:github`)
  is a role-based **Cowork plugin bundle** — its auth/activation only goes through Cowork's
  own settings (`setup-cowork`/`cowork-plugin-management` skills), never through
  `claude plugin`/`claude mcp` from inside a session; document + point the user there
  instead of attempting it. Separately, a standalone plugin with a plain name in the
  `claude-plugins-official` marketplace manifest (verified locally: `github` exists there,
  independent of the Cowork bundle) IS directly installable via `claude plugin install
  <name>` — the install itself needs no OAuth, but the MCP server behind it can still need
  its own auth step afterward (check `claude mcp list`, report "Failed to connect" honestly
  rather than assuming success). Learned live: `plugin:engineering:github` couldn't be
  toggled from a session, but `claude plugin install github` (the standalone marketplace
  plugin) worked immediately.

## 0.1.10 (2026-07-09)

- `homey/hooks/release-gate.js` + `homey/test/hooks/release-gate.test.js` (13 tests) —
  ports VioletApp's `.claude/hooks/release-gate.js` (blocks `homey app install|publish`
  on an incomplete release checklist), reusing the shared `lib/changelog.js` completeness
  check. One part genericized: VioletApp's credential-rotation check (part c) is
  unconditional (it always manages a device credential); the generic version only
  enforces it once a `docs/superpowers/security/credential-rotation.md` already exists,
  so apps without device credentials are never forced to create one. README updated
  (install table + Phase-3 hook list) to document the new hook and the genericization.
  Verified against a simulated merged install of templates/+homey/.

## 0.1.9 (2026-07-09)

- `homey/test/hooks/secrets-guard.test.js` (9 tests) — ported from VioletApp's
  test/hooks/secrets-guard.test.js, updated for the one intentional drift between the
  two hooks: the known-secret env var is `DEVICE_WRITE_PASSWORD` here, not
  `VIOLET_WRITE_PASSWORD` (already genericized in homey/hooks/secrets-guard.js itself).
  No other logic drift found. Verified against a simulated merged install of
  templates/+homey/. All 4 pre-existing homey hooks now have smoke-test coverage.

## 0.1.8 (2026-07-09)

- `homey/test/hooks/json-guard.test.js` (5 tests) — ported unchanged (besides the HOOK
  location) from VioletApp's test/hooks/json-guard.test.js. No logic drift found between
  the VioletApp and homey/ generic hook. Verified against a simulated merged install of
  templates/+homey/.

## 0.1.7 (2026-07-09)

- `homey/test/hooks/compose-guard.test.js` (16 tests) — ported from VioletApp's
  test/hooks/compose-guard.test.js (path unchanged apart from the HOOK location and one
  example filename genericized: lib/VioletClient.js → lib/DeviceClient.js). No logic
  drift found between the VioletApp and homey/ hook. Verified against a simulated
  merged install of templates/+homey/.

## 0.1.6 (2026-07-09)

- `homey/test/hooks/check-version-sync.test.js` (7 tests) — first smoke test for this
  hook; no VioletApp test/hooks/check-version-sync.test.js exists to port from, so this
  was written directly against homey/hooks/check-version-sync.js, mirroring the sibling
  hook tests' style. Verified against a simulated merged install of templates/+homey/.

## 0.1.5 (2026-07-09)

- `homey/hooks/changelog-lang-guard.js` + `homey/hooks/lib/changelog.js` (shared with a
  future release-gate-equivalent hook in this module) + `homey/test/hooks/changelog-lang-guard.test.js`
  (6 tests, verified against a simulated merged install of templates/+homey/) — mirrors
  VioletApp's edit-time changelog-completeness guard. First smoke test to ship under
  `homey/test/hooks/` (the 4 pre-existing homey hooks — check-version-sync, compose-guard,
  json-guard, secrets-guard — still have none; flagged as a follow-up, not fixed here).

## 0.1.4 (2026-07-09)

- `templates/.claude/skills/milestone-checkpoint/SKILL.md`: new step 2 — the
  `/claude-automation-recommender` output (read-only by design) is now summarized as a
  short numbered list and offered back via `AskUserQuestion` (multiSelect) for direct
  same-session implementation (Hook → same pattern as step 4 with a smoke test; MCP
  server → `claude mcp add` if addable without OAuth, else just register + point the
  user at the auth step; Skill/Subagent → file + smoke-test; Plugin → only after
  explicit consent). Deselected recommendations get a one-line note in the `→Mx` log
  instead of silently disappearing. Source: VioletApp →M5-checkpoint follow-up request.

## 0.1.3 (2026-07-09)

- `templates/.claude/hooks/dashboard-guard.js` + `templates/test/hooks/dashboard-guard.test.js`
  (5 Tests), wired into `templates/.claude/settings.json` PostToolUse Edit|Write — validates
  the `window.DASHBOARD_STATUS` data block (`script#status-data`) via a sandboxed `vm` eval
  after every edit to `docs/dashboard/dashboard.html`, blocking (exit 2) on a syntax error the
  same way `test-gate.js` blocks a red suite. Closes a gap a plain JSON guard can't cover
  (the data block is a JS object literal embedded in HTML). Source: VioletApp →M5-Checkpoint
  workflow retro (step 4) — the same smart-quote delimiter bug class hit `dashboard.html`
  a 4th time, previously only flagged, never codified into a hook.

## 0.1.2 (2026-07-09)

- README substantially expanded (de) + new `README.en.md` (en): what the framework does
  (the four verification loops), structure diagram (`assets/struktur.svg`), installation
  (incl. note: marketplace add accepts the GitHub shorthand, git URLs, and local paths)
  and the copy-paste initiation prompt (with and without plugin installation).

## 0.1.1 (2026-07-09)

- Removed the seed prompts from the settings repo (user decision): this repo is the ONLY
  living source; seed references in SKILL.md/README switched to the git history
  (`skill-ClaudeCode-general-settings@fcbda47`).
- README: entry line for bootstrapping WITHOUT plugin installation (clone the repo → point
  the session at the SKILL.md) — replaces the copy-paste use case of the old seed prompts.

## 0.1.0 (2026-07-09)

Initial extraction from the VioletApp project (M0–M4.8), milestone M4.9 of the
loop-hardening series. Sources per artifact:

- `SKILL.md` ← `skill-ClaudeCode-general-settings/prompts/agentic-loop-bootstrap.de.md`
  (as of 2026-07-07), generalized from a copy-paste prompt into a skill guide; the phases
  now reference the bundled `templates/` tree.
- `templates/CLAUDE.md` ← VioletApp `CLAUDE.md` (§0–§11; Karpathy core §1–§4 via
  github.com/multica-ai/andrej-karpathy-skills; §7 incl. the FRICTION + triage-inbox rule
  from M4.8; §10 permission strategy; §11 subagent tiering), project extensions →
  placeholders.
- `templates/docs/dashboard/dashboard.html` ← VioletApp dashboard (renderer 1:1,
  data block emptied); `versions.md` and `triage-inbox.md` skeletons ← M4.8 formats.
- `templates/.claude/settings.json` ← VioletApp scaffold, reduced to be platform-free
  (matcher lesson M4.6: `Bash|PowerShell`).
- `templates/.claude/hooks/test-gate.js` ← VioletApp M4.6 (incl. the NODE_TEST_CONTEXT lesson);
  `lib/log.js` + `lib/spawn-env.js` ← M4.8 (telemetry, explicit cwd);
  `test/hooks/test-gate.test.js` ← M4.6 smoke-test pattern.
- `templates/.claude/skills/milestone-checkpoint/SKILL.md` ← VioletApp state after M4.8/M4.9
  (steps: retro with hook-log signal, memory consolidation, framework-drift check,
  handover); skill-sources section → placeholder.
- `homey/` ← VioletApp: `HOMEY.md`, guard hooks `compose-guard`/`json-guard`/
  `check-version-sync`/`secrets-guard` (M3–M4.5; secrets-guard phrased app-neutrally,
  env `DEVICE_WRITE_PASSWORD`), Homey allowlist block, `release-readiness` subagent
  (M4 state + M4.7 live-smoke point as a project-specific pattern + M4.8 triage line);
  `README.md` ← bootstrap prompt B as the install guide.
