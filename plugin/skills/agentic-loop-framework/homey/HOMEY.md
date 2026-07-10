# HOMEY.md

Homey-app-specific development conventions. Reusable across Homey app projects as-is — pairs with `CLAUDE.md` (general engineering guidelines; §6–8 define the platform-file mechanism and the generic dashboard/versioning protocol this file plugs into).

## Looking up the SDK docs

The `homey-app` skill covers the Homey Apps SDK v3 basics (Compose, core classes, CLI). For details that are missing or possibly outdated there (a new SDK version, an edge-case API, Compose merge behavior), use the `context7` MCP server (see `.mcp.json`) for a live docs lookup instead of guessing.

## Versioning commands

| Occasion | Command | Effect |
|---|---|---|
| New build within the same milestone | `npx homey app version patch` | `0.1.0 → 0.1.1` (Y +1) |
| New milestone (first build) | `npx homey app version minor` | `0.1.x → 0.2.0` (X +1, Y reset to 0) |

Both commands update `.homeycompose/app.json`; the generated root `app.json` is pulled along on the next `build`/`run`/`validate` — both must be identical before the commit.

`homey app run` (ephemeral dev mode, removed again on stop) does **not** count as a release and needs no bump/log entry. Only `homey app install` and a Store publish count as a release in the sense of CLAUDE.md §8.

## Changelog

Fill `.homeychangelog.json` for every new version with a clear, user-understandable change note — **en + de**.

**JSON authoring rule (proven — the same class of bug hit the original project 4×):** `.homeychangelog.json` and the manifests are **strict JSON**. When editing by hand, the ASCII `"` string delimiters easily turn into typographic "smart quotes" (`" "`) → invalid JSON that `homey app validate` (leniently) lets through until the commit. Therefore: build JSON files **programmatically** (`node` + `JSON.stringify`; German inner quotation marks as `„…"` = U+201E/U+201C), **never type the delimiters by hand**, and check with `JSON.parse` before the commit. The `json-guard` PostToolUse hook (`.claude/hooks/json-guard.js`) enforces this automatically for manifest/changelog JSON.

## Release checklist (implementing CLAUDE.md §8 for Homey)

1. Commit the code state.
2. Bump: `npx homey app version patch` (new build within the same milestone) or `npx homey app version minor` at the milestone start.
3. Fill `.homeychangelog.json` for the new version (en + de).
4. Check the generated `app.json` (version == `.homeycompose/app.json`); commit the bump + changelog together.
5. Upload (`npx homey app install` or Store publish).
6. Add a line to the project version log (version, date, commit, target, note) — see e.g. `docs/dashboard/versions.md`.
