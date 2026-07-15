# Homey module (platform add-on block)

Platform building blocks for Homey apps (Apps SDK v3, Homey Pro) — complements the generic
bootstrap in `../SKILL.md`. Each "Phase-N add-on" runs together with Phase N of the SKILL.md;
context/standing-rule add-ons apply from Phase 0. (Extracted from the VioletApp project —
see `../CHANGELOG.md`.)

## Installation (which file goes where)

| Building block | Target in the project | Registration |
|---|---|---|
| `HOMEY.md` | repo root (fills CLAUDE.md §6) | `@HOMEY.md` reference in the CLAUDE.md extensions block |
| `hooks/compose-guard.js` | `.claude/hooks/` | settings.json PreToolUse, matcher `Edit\|Write` |
| `hooks/secrets-guard.js` | `.claude/hooks/` | settings.json PreToolUse, matcher `Edit\|Write` |
| `hooks/json-guard.js` | `.claude/hooks/` | settings.json PostToolUse, matcher `Edit\|Write` |
| `hooks/changelog-lang-guard.js` | `.claude/hooks/` | settings.json PostToolUse, matcher `Edit\|Write` |
| `hooks/check-version-sync.js` | `.claude/hooks/` | settings.json PreToolUse, matcher `Bash\|PowerShell` |
| `hooks/release-gate.js` | `.claude/hooks/` | settings.json PreToolUse, matcher `Bash\|PowerShell` |
| `allowlist.json` | entries → `permissions.allow` in `.claude/settings.json` | — |
| `agents/release-readiness.md` | `.claude/agents/` | — (subagent, keep the model/effort frontmatter) |

The hooks require `templates/.claude/hooks/lib/log.js` (telemetry — part of the
generic tree). Each hook brings its own smoke-test pattern
(`templates/test/hooks/test-gate.test.js` as a template; direct-call verify: red case
exit 2, green exit 0).

## Phase 0 add-on (preflight)

- Homey CLI: `homey whoami` successful? If the CLI is missing: `npm i -g homey`;
  `homey login` is interactive → the user does it themselves (BLOCKING until done).
- Skills `homey-app` (SDK basics, Compose, CLI) and `homey-cli`
  (`homey api <manager> <op>`) available? DEGRADABLE — fallback: context7 lookup
  "Homey Apps SDK v3" + the official Athom docs via WebFetch.
- Test query: does context7 (or WebFetch) return Homey SDK v3 docs?

## Phase 1 add-on — HOMEY.md as the platform file

1. For NEW: DECISION POINT app scaffold — app ID, name, category; scaffold via the
   homey-app skill or `homey app create`.
2. Adopt `HOMEY.md` from this module (SDK docs rule, versioning
   patch/minor, run≠release, changelog requirement en+de, JSON authoring rule,
   release checklist; Store asset sizes: app 250x175/500x350/1000x700, driver
   75x75/500x500/1000x1000; icons as transparent monochrome line SVGs — Homey
   masks icons into single-color silhouettes, a full-bleed background becomes a
   white square).
3. Adopt the initial allowlist from `allowlist.json` into `.claude/settings.json`.

## Phase 2 add-on — done conditions

Every /goal condition (or DONE CONDITIONS checklist) of every milestone contains:
"npx homey app validate --level publish → PASS, output shown in chat".
validate --level publish is the project's ground truth — anchor it as such in
CLAUDE.md/HOMEY.md too.

## Phase 3 add-on — Homey gates (each via TDD, each with a smoke test, verified via direct call)

- `compose-guard` (PreToolUse Edit|Write): blocks hand-edits to the GENERATED root app.json,
  points to the .homeycompose/ source.
- `json-guard` (PostToolUse Edit|Write): JSON.parse on manifests/changelog/locales;
  on error exit 2 with a fix hint (smart-quote bug class).
- `changelog-lang-guard` (PostToolUse Edit|Write): after an edit to `.homeychangelog.json`,
  blocks (exit 2) if the entry for the current compose-manifest version is missing its en
  or de half — shifts `release-gate`'s same check left to the edit itself, sharing the
  completeness check via `hooks/lib/changelog.js` so the logic isn't duplicated.
- `check-version-sync` (PreToolUse Bash|PowerShell): blocks git commit when app.json and
  .homeycompose/app.json carry different versions.
- `secrets-guard` (PreToolUse Edit|Write), if device credentials are involved: blocks
  cleartext credentials in tracked files; the error message NEVER quotes the match
  (the exact password optionally out-of-band via env `DEVICE_WRITE_PASSWORD`).
- `release-gate` (PreToolUse Bash|PowerShell): blocks `homey app install|publish` when
  (a) `.homeychangelog.json` has no complete en+de entry for the compose version,
  (b) the version is already logged in `docs/dashboard/versions.md` (a forgotten bump
  = a duplicate release), or (c) — only on publish, and only if a
  `docs/superpowers/security/credential-rotation.md` already exists — that file has no
  dated rotation date. Part (c) is deliberately softer than the
  VioletApp original: if the file is missing entirely, the app has no device credential to
  rotate and the check does not apply (VioletApp itself always manages a
  device credential and requires the file unconditionally).

## Phase 4 note

Expect Homey-typical recommender recommendations — in particular the read-only
`release-readiness` subagent (`agents/release-readiness.md`: PASS/FAIL for version sync,
changelog en+de, validate, Store assets, versions.md hash, dashboard state, triage inbox,
live smoke).

## Phase 7 add-on — trial run

The trial run ends with a read-only live check against the real Homey
(allowlisted `homey api … get-*`; append `--json` — without the flag the CLI returns a
box-drawing table).

## Standing-rules add-on (→ carry over into HOMEY.md/CLAUDE.md)

- Read-only live checks against the real device are a fixed verify step of every milestone.
- NEVER write to real hardware unattended: the first live write together with the user,
  with auto-revert; `homey app install` and Store publish remain §9 human gates.
- For write/network milestones: CLAUDE.md §5 (STRIDE + security-requirement-extraction
  or fallback) BEFORE the plan; /security-review on the diff before the merge (if available).
