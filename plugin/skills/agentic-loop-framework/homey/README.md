# Homey-Modul (Plattform-Zusatzblock)

Plattform-Bausteine für Homey-Apps (Apps SDK v3, Homey Pro) — ergänzt den generischen
Bootstrap aus `../SKILL.md`. Jeder „Phase-N-Zusatz" läuft zusammen mit Phase N der SKILL.md;
Kontext-/Dauerregel-Zusätze gelten ab Phase 0. (Extrahiert aus dem VioletApp-Projekt —
siehe `../CHANGELOG.md`.)

## Einbau (welche Datei wohin)

| Baustein | Ziel im Projekt | Registrierung |
|---|---|---|
| `HOMEY.md` | Repo-Root (füllt CLAUDE.md §6) | `@HOMEY.md`-Referenz im CLAUDE.md-Extensions-Block |
| `hooks/compose-guard.js` | `.claude/hooks/` | settings.json PreToolUse, Matcher `Edit\|Write` |
| `hooks/secrets-guard.js` | `.claude/hooks/` | settings.json PreToolUse, Matcher `Edit\|Write` |
| `hooks/json-guard.js` | `.claude/hooks/` | settings.json PostToolUse, Matcher `Edit\|Write` |
| `hooks/check-version-sync.js` | `.claude/hooks/` | settings.json PreToolUse, Matcher `Bash\|PowerShell` |
| `allowlist.json` | Einträge → `permissions.allow` in `.claude/settings.json` | — |
| `agents/release-readiness.md` | `.claude/agents/` | — (Subagent, model/effort-Frontmatter beibehalten) |

Die Hooks setzen `templates/.claude/hooks/lib/log.js` voraus (Telemetrie — Teil des
generischen Baums). Jeder Hook bringt sein Smoke-Test-Muster mit
(`templates/test/hooks/test-gate.test.js` als Vorlage; Direktaufruf-Verify: roter Fall
exit 2, grüner exit 0).

## Phase-0-Zusatz (Preflight)

- Homey-CLI: `homey whoami` erfolgreich? Fehlt die CLI: `npm i -g homey`;
  `homey login` ist interaktiv → macht der Nutzer selbst (BLOCKIEREND, bis erledigt).
- Skills `homey-app` (SDK-Grundlagen, Compose, CLI) und `homey-cli`
  (`homey api <manager> <op>`) verfügbar? DEGRADIERBAR — Fallback: context7-Lookup
  „Homey Apps SDK v3" + offizielle Athom-Doku per WebFetch.
- Testabfrage: liefert context7 (bzw. WebFetch) Homey-SDK-v3-Doku?

## Phase-1-Zusatz — HOMEY.md als Plattform-Datei

1. Bei NEU: ENTSCHEIDUNGSPUNKT App-Gerüst — App-ID, Name, Kategorie; Scaffold per
   homey-app-Skill bzw. `homey app create`.
2. `HOMEY.md` aus diesem Modul übernehmen (SDK-Doku-Regel, Versionierung
   patch/minor, run≠Release, Changelog-Pflicht en+de, JSON-Authoring-Regel,
   Release-Checkliste; Store-Asset-Maße: App 250x175/500x350/1000x700, Driver
   75x75/500x500/1000x1000; Icons als transparente monochrome Linien-SVGs — Homey
   maskiert Icons zu einfarbigen Silhouetten, vollflächiger Hintergrund wird zum
   weißen Quadrat).
3. Initiale Allowlist aus `allowlist.json` in `.claude/settings.json` übernehmen.

## Phase-2-Zusatz — Done-Bedingungen

Jede /goal-Bedingung (bzw. DONE-BEDINGUNGEN-Checkliste) jedes Milestones enthält:
„npx homey app validate --level publish → PASS, Output im Chat gezeigt".
validate --level publish ist die Ground Truth des Projekts — auch so in
CLAUDE.md/HOMEY.md verankern.

## Phase-3-Zusatz — Homey-Gates (je per TDD, je mit Smoke-Test, Verify per Direktaufruf)

- `compose-guard` (PreToolUse Edit|Write): blockt Hand-Edits am GENERIERTEN Root-app.json,
  verweist auf die .homeycompose/-Quelle.
- `json-guard` (PostToolUse Edit|Write): JSON.parse auf Manifeste/Changelog/locales;
  bei Fehler exit 2 mit Fix-Hinweis (Smart-Quote-Fehlerklasse).
- `check-version-sync` (PreToolUse Bash|PowerShell): blockt git commit, wenn app.json und
  .homeycompose/app.json unterschiedliche Versionen tragen.
- `secrets-guard` (PreToolUse Edit|Write), falls Geräte-Credentials im Spiel: blockt
  Klartext-Credentials in getrackten Dateien; die Fehlermeldung zitiert den Treffer NIE
  (exaktes Passwort optional out-of-band via Env `DEVICE_WRITE_PASSWORD`).

## Phase-4-Hinweis

Erwarte Homey-typische Recommender-Empfehlungen — insbesondere den read-only
`release-readiness`-Subagent (`agents/release-readiness.md`: PASS/FAIL für Versions-Sync,
Changelog en+de, validate, Store-Assets, versions.md-Hash, Dashboard-Stand, Triage-Inbox,
Live-Smoke).

## Phase-7-Zusatz — Probelauf

Der Probelauf endet mit einem read-only Live-Check gegen den echten Homey
(allowlistete `homey api … get-*`; `--json` anhängen — ohne Flag liefert die CLI eine
Box-Drawing-Tabelle).

## Dauerregeln-Zusatz (→ in HOMEY.md/CLAUDE.md übernehmen)

- Read-only-Live-Checks gegen das echte Gerät sind fester Verify-Schritt jedes Milestones.
- Writes an echte Hardware NIE unbeaufsichtigt: erster Live-Write gemeinsam mit dem Nutzer,
  mit Auto-Revert; `homey app install` und Store-Publish bleiben §9-Human-Gates.
- Bei Write-/Netzwerk-Milestones: CLAUDE.md §5 (STRIDE + security-requirement-extraction
  bzw. Fallback) VOR dem Plan; /security-review auf den Diff vor dem Merge (falls verfügbar).
