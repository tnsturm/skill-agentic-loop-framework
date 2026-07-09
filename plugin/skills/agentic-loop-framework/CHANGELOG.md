# Changelog — agentic-loop-framework

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
