---
name: milestone-checkpoint
description: Between-milestone housekeeping for this project - tightens tool permissions, checks for new automation opportunities, checks/updates the external skill sources this project depends on, and runs a workflow retrospective that codifies recurring friction into hooks/docs/memory. Run between milestones per CLAUDE.md §7 point 4 / the dashboard's Mx.0 "Housekeeping Agentic Loop" checkpoint entries.
disable-model-invocation: true
---

# Milestone Checkpoint

Runs the between-milestone housekeeping from CLAUDE.md §7 point 4 in one go, instead of
calling several skills individually.

## Step 0: Check the GitHub MCP connection

`claude mcp get github` → "Connected"? Additionally a real read call (e.g. `list_branches`
against a repo) — status alone is not enough (pitfalls: step 2). No server or
error → setup runs via the agentic-loop-framework bootstrap (Phase 0), not here.

## Steps

1. Run `/fewer-permission-prompts`.
2. Run `/claude-automation-recommender`, offer the results for direct implementation (see below).
3. Check the skill sources (see below).
4. Run the **workflow retrospective / optimizer** (see below) — turn recurring friction from the
   completed milestone into a durable safeguard.
5. **Memory consolidation** (see below) — condense the memory files, present the result as a diff only.
6. **Check for framework drift** (see below) — reconcile the project framework vs. skill-agentic-loop-framework.
7. Update the active `Mx.0` checkpoint entry in `docs/dashboard/dashboard.html`:
   `status: "done"`, `finishedAt` = today, all steps ticked off, one `log[]` entry each with
   a short summary of steps 1–6. In doing so, for EVERY still-open milestone in the
   data block check/set `recommendedModel` (CLAUDE.md §11) — if it is missing (new entry)
   or the remaining scope has become noticeably different since the last assessment,
   re-derive it now; otherwise leave it unchanged.
8. **Handover** (see below) — hand off the next milestone as a push to the phone.

## Step 2: Offer /claude-automation-recommender results

The recommender is read-only (it only suggests). So that the suggestions don't fizzle out in the
chat without consequence, directly afterwards:

1. Summarize the 1–2 recommendations per category (MCP server, skill, hook, subagent, plugin) from
   the recommender report as a short numbered list (category + name +
   one-sentence rationale — no fresh prose).
2. Via `AskUserQuestion` (multiSelect) offer exactly this list as options: "Which
   recommendations to implement directly now?" — plus the implicit option to select none.
3. For each selected recommendation **implement it directly in the same session**, matching the type:
   - **Hook**: same pattern as step 4 (hook file + smoke test, wired into `.claude/settings.json`,
     suite verified green, its own commit); if the change is generic,
     step 6 (framework drift) applies to it as well.
   - **MCP server**: first distinguish WHICH registration is meant — a
     `plugin:<category>:<name>` entry (e.g. `plugin:engineering:github`) is a
     role-based **Cowork plugin bundle** whose auth/activation runs ONLY via the
     Cowork settings (`setup-cowork`/`cowork-plugin-management` skills),
     NOT via `claude plugin`/`claude mcp` from the session — only document that
     + point the user there. If, alongside it, a **standalone** plugin exists with a
     simple name in the `claude-plugins-official` marketplace (e.g. `github`, checkable via
     the local `marketplace.json` manifest), that one is independent of the bundle and directly
     installable: `claude plugin install <name>` (no OAuth needed for the install step
     itself; the MCP server behind it may still need a separate auth step —
     check `claude mcp list` afterwards, report a "Failed to connect"/"Needs authentication"
     status to the user instead of silently booking it as done).
     Additional pitfalls for a standalone MCP server newly registered via `claude mcp add`
     (not a Cowork bundle), findings from 2026-07-09
     (GitHub MCP server): **(1) Scope default**: `claude mcp add` without a
     `--scope` flag defaults to `--scope local` (usable only in that project directory
     at the time) — for cross-project use specify `--scope user`. **(2)
     Session restart needed**: an already-running session does NOT reload the tools of a
     just-connected server, even if `claude mcp get <name>`
     shows "Connected" immediately — only a new session sees them via `ToolSearch`.
     **(3) "Connected" ≠ usable**: the connection status only checks the handshake,
     not the token permissions. A fine-grained PAT without repo access returns 404 on
     every repo call; with read access but no write rights it returns 403 on
     write actions (`create_branch`, `push_files`, …) — `get_me` passes cleanly in both
     broken states and is therefore **not** a reliable
     health check. Before trusting a new MCP server, smoke-test at least one
     real write call (create a branch + push a file + delete it again),
     not just status/`get_me`. For the GitHub MCP server specifically:
     set repo permissions **Contents (R/W), Pull requests (R/W), Issues (R/W)**
     (Metadata R is the mandatory default).
   - **Skill/subagent**: create the file under `.claude/skills/<name>/SKILL.md` or
     `.claude/agents/<name>.md`, smoke-test briefly (e.g. a dry-run call).
   - **Plugin**: `claude plugin marketplace add`/`claude plugin install` only after explicit
     consent (marketplace changes are not a pure read operation).
4. Do NOT silently drop unselected recommendations — note briefly in the `Mx.0` `log[]`
   what was implemented and what was deliberately deferred.

## Step 3: Check the skill sources

<!-- FILL IN PER PROJECT: list this project's external skill/reference sources.
     Document the appropriate update path per source — two proven patterns: -->

### Pattern A: Git-checkout source (skill repo without a plugin manifest)

```bash
git -C /tmp/<skill-repo> fetch --quiet
git -C /tmp/<skill-repo> log HEAD..origin/HEAD --oneline
```

If `/tmp/<skill-repo>` does not exist, clone it fresh. If the output is **not empty**
(an update exists), pull it in automatically — no confirmation needed:

```bash
git -C /tmp/<skill-repo> pull --quiet
rm -rf ~/.claude/skills/<skill-name>/*
cp -r /tmp/<skill-repo>/* ~/.claude/skills/<skill-name>/
```

### Pattern B: Marketplace plugin (e.g. Superpowers)

**Not automatable from the session.** The only update path is
`claude plugin update <plugin>`, which needs a restart. Only report:
`claude plugin list` (installed version), and ask the user to run the update themselves
when needed in an interactive session.

## Step 4: Workflow retrospective (optimizer)

Turn recurring, similar mistakes into a durable safeguard so they don't
happen again.

1. **Collect signal** for the completed milestone: `feedback` memories (memory folder),
   `FRICTION:` entries in the dashboard `log[]`, and the git history (repeated `fix:`/`revert:`
   commits, a commit that corrects the immediately preceding one, ≥2 similar fix commits to the same file).
   Additionally read `.claude/hooks/hook-log.jsonl` (block counts per hook since the last
   checkpoint instead of memory — M4.8; many blocks from the same hook = a recurring friction class).
2. **Cluster** into distinct problems; count frequency. **In scope only: seen ≥2× OR flagged by the
   user** ("again", "for the third time"). Skip one-offs (YAGNI).
3. **Root cause** per problem (three "whys": happens · repeats · not caught before the commit).
4. **Choose the codification level** — most reliable first; a problem may get several:
   **a. Hook** (mechanically checkable → automatic guard; unforgettable) ·
   **b. CLAUDE.md / <PLATFORM>.md** (process/convention rule) ·
   **c. `feedback` memory** (cross-session guidance) ·
   **d. Skill edit** (a skill step is itself wrong).
   Prefer the highest level that covers the problem *completely*. Every new hook brings its own
   smoke test (like `secrets-guard` / `json-guard`) and is wired into `.claude/settings.json`.
5. **Apply + verify** (hook smoke test green; rule/memory lands). A small, reversible
   change, its own commit.
6. **Log** in the `Mx.0` `log[]`: `problem → root cause → level → change → verified`.

If the signal is empty (nothing repeated), this step is a no-op — just note it briefly.

## Step 5: Memory consolidation (dreaming pattern, M4.8)

Review the sessions since the last checkpoint (`search_session_transcripts`, if available —
otherwise the dashboard `log[]` and `git log` as sources), then consolidate the files in the
memory folder (`MEMORY.md` + individual files):

- **Deduplicate/shorten**: condense finished items (e.g. `project-status` carries full
  detail histories of completed milestones that could be one line + a reference).
- **Resolve contradictions**: correct stale statements (e.g. "active from the next session",
  when it has long been live).
- **HARD RULES**: ALWAYS present the result as a diff for review, NEVER apply it directly;
  NEVER delete open follow-ups and security notes; when in doubt, keep it.

## Step 6: Check for framework drift (M4.9)

Review `git log --since=<last checkpoint> --oneline -- .claude/hooks .claude/skills CLAUDE.md`
in the project: is any of the changes GENERIC (useful in every project)? If so, in the
local checkout of `skill-agentic-loop-framework` update the corresponding template
(`templates/` or the platform module) + a CHANGELOG entry; commit there after
§9 approval. No drift → note it briefly.

## Step 8: Handover (M4.8)

1. From the `DASHBOARD_STATUS` block read the NEXT milestone with `status: "todo"` (first in
   list order). If it has no `recommendedModel` (see step 7), add it now,
   before the push notification goes out — the handover is the moment when
   someone decides which model the next session starts with.
2. Send a push notification to the phone (PushNotification): title `Next milestone: <id>
   — <title>`, text = short form (first prompt lines) + the note `Start via /remote-control
   <id>` (the full prompt is in the dashboard; push has length limits). No push channel
   available → show the prompt header in chat and note that in the log.
3. Ask whether the milestone should be started directly in this session.

## Report

At the end, summarize briefly: what was updated (skill sources, if applicable),
installed plugin versions (without any statement about whether they are outdated — that cannot be
determined from here), which recommender recommendations were implemented or deferred,
and the result of the workflow retrospective (which recurring problems were codified into which
level, or "no new friction").
