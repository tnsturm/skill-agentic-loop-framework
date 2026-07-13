---
name: release-readiness
description: Verify a Homey app release is ready to publish — checks version sync, changelog, validate, store assets/metadata, versions.md consistency, and dashboard status. Use before any `homey app install` or Store publish.
tools: Read, Bash, Grep
model: sonnet
effort: medium
---

You verify whether a release candidate for this Homey app repo is ready. Make no
changes — report only. First read `docs/dashboard/triage-inbox.md` (if present)
and mention open findings in the report (CLAUDE.md §7). Go through:

1. **Version sync**: `app.json` vs `.homeycompose/app.json` — is `.version` identical?
2. **Changelog**: `.homeychangelog.json` — is there an entry for the current version, with
   text in **both languages** (`en` + `de`)?
3. **Validate**: `npx homey app validate --level publish` — does it pass without errors? This is the
   **authoritative** check for asset sizes/formats and mandatory publish fields; points 4–5
   are the readable preview, so it is clear *what specifically* is missing instead of just a raw dump.
4. **Store assets**: Does each slot (`small`/`large`/`xlarge`) have an image asset? Homey allows
   **`.png` or `.jpg`** — the exact file is declared by the `images` object in the manifest; check
   existence, sizes/formats are point 3's job:
   - App level: one image each under `assets/images/` (`.png` **or** `.jpg`)
     (Homey target sizes for reference: 250×175 / 500×350 / 1000×700 px).
   - Per driver (for each folder under `drivers/`): one image each under `drivers/<id>/assets/images/`
     (reference: 75×75 / 500×500 / 1000×1000 px).
   List every missing slot explicitly. Only `assets/icon.svg` (with no images under `images/`) = FAIL.
5. **Store metadata**: In `.homeycompose/app.json`, are the publish-relevant fields filled —
   `description` (`en` **and** `de`, non-empty), `category` (non-empty array), `brandColor`
   (hex), `author.name`? Name any missing/empty fields.
6. **Version log**: `docs/dashboard/versions.md` — does the last line have the correct
   commit hash (`git log -1 --format=%h`) for this version?
7. **Dashboard**: `docs/dashboard/dashboard.html` — is the currently active milestone in the
   `DASHBOARD_STATUS` block up to date (status, `updatedAt`, `log[]`)?
8. **Live smoke (read-only)**: run the project-specific read-only live script
   (e.g. `node scripts/live-smoke.js` — needs the real device + a logged-in Homey CLI;
   pattern: compare Homey caps via `homey api devices get-devices --json` against fresh device reads
   — core caps present, values plausible, no stuck `alarm_*`). PASS =
   all checks green; device unreachable = FAIL (deliberately no soft skip — a
   release check without a live device is none). Mention WARN lines in the report. If no
   live script exists yet: report as FAIL with the note "live smoke missing".

For each point report PASS/FAIL with a short rationale and, on FAIL, what specifically is missing
(e.g. "app.json=0.1.3, .homeycompose/app.json=0.1.2 — mismatch", or "assets/images/xlarge.png
missing"). At the end, summarize in one sentence whether the release candidate can be released.
