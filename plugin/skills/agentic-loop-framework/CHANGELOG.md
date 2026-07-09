# Changelog — agentic-loop-framework

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
  Schritt 2). Fallback: git/gh CLI, no bootstrap blocker.
- `templates/.claude/skills/milestone-checkpoint/SKILL.md` gets a much shorter "Schritt 0:
  GitHub-MCP-Verbindung prüfen" instead — just a connection + smoke-test check, pointing to
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

- README grundlegend erweitert (de) + neues `README.en.md` (en): Was das Framework tut
  (die vier Verifikations-Loops), Struktur-Grafik (`assets/struktur.svg`), Installation
  (inkl. Hinweis: marketplace add akzeptiert GitHub-Kurzform, Git-URLs und lokale Pfade)
  und der Copy-Paste-Initiierungs-Prompt (mit und ohne Plugin-Installation).

## 0.1.1 (2026-07-09)

- Seed-Prompts im Settings-Repo entfernt (User-Entscheid): dieses Repo ist die EINZIGE
  lebende Quelle; Seed-Referenzen in SKILL.md/README auf die Git-Historie
  (`skill-ClaudeCode-general-settings@fcbda47`) umgestellt.
- README: Einstiegszeile für Bootstrap OHNE Plugin-Installation (Repo klonen → Session
  auf die SKILL.md zeigen) — ersetzt den Copy-Paste-Use-Case der alten Seed-Prompts.

## 0.1.0 (2026-07-09)

Initiale Extraktion aus dem VioletApp-Projekt (M0–M4.8), Milestone M4.9 der
Loop-Hardening-Reihe. Quellen je Artefakt:

- `SKILL.md` ← `skill-ClaudeCode-general-settings/prompts/agentic-loop-bootstrap.de.md`
  (Stand 2026-07-07), von Copy-Paste-Prompt zu Skill-Anleitung generalisiert; Phasen
  verweisen jetzt auf den mitgelieferten `templates/`-Baum.
- `templates/CLAUDE.md` ← VioletApp `CLAUDE.md` (§0–§11; Karpathy-Kern §1–§4 via
  github.com/multica-ai/andrej-karpathy-skills; §7 inkl. FRICTION- + Triage-Inbox-Regel
  aus M4.8; §10 Permission-Strategie; §11 Subagent-Tiering), Projekt-Extensions →
  Platzhalter.
- `templates/docs/dashboard/dashboard.html` ← VioletApp-Dashboard (Renderer 1:1,
  Datenblock geleert); `versions.md`- und `triage-inbox.md`-Skelette ← M4.8-Formate.
- `templates/.claude/settings.json` ← VioletApp-Gerüst, plattformfrei reduziert
  (Matcher-Lesson M4.6: `Bash|PowerShell`).
- `templates/.claude/hooks/test-gate.js` ← VioletApp M4.6 (inkl. NODE_TEST_CONTEXT-Lesson);
  `lib/log.js` + `lib/spawn-env.js` ← M4.8 (Telemetrie, explizites cwd);
  `test/hooks/test-gate.test.js` ← M4.6-Smoke-Test-Muster.
- `templates/.claude/skills/milestone-checkpoint/SKILL.md` ← VioletApp-Stand nach M4.8/M4.9
  (Schritte: Retro mit hook-log-Signal, Memory-Konsolidierung, Framework-Drift-Check,
  Handover); Skill-Quellen-Abschnitt → Platzhalter.
- `homey/` ← VioletApp: `HOMEY.md`, Guard-Hooks `compose-guard`/`json-guard`/
  `check-version-sync`/`secrets-guard` (M3–M4.5; secrets-guard app-neutral formuliert,
  Env `DEVICE_WRITE_PASSWORD`), Homey-Allowlist-Block, `release-readiness`-Subagent
  (M4-Stand + M4.7-Live-Smoke-Punkt als projektspezifisches Muster + M4.8-Triage-Zeile);
  `README.md` ← Bootstrap Prompt B als Einbau-Anleitung.
