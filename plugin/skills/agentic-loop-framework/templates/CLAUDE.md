# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 0. Always-On Skills

**These two skill sets are mandatory for this project — apply them by default, not on request.**

- **Superpowers workflow skills** (`superpowers:*`): use them as the standard way of working — `brainstorming` before any creative/feature work, `writing-plans` before multi-step code, `subagent-driven-development` to execute a written plan (`executing-plans` instead when the tasks share toolchain state or one common error list, so fresh-context subagents don't pay off — name which one and why in the plan header), `test-driven-development` for features/bugfixes, `systematic-debugging` for bugs, and `verification-before-completion` before any "done"/"passing" claim (code review itself runs through `/code-review`, §9). When in doubt whether one applies, invoke it (see `using-superpowers`).
- **`/documenting-code`** (optional project skill — create it once the project keeps specs under `docs/superpowers/`): apply whenever you write or modify a source file — add the spec-referenced file header, decision-point comments with §-refs, and JSDoc on pure library exports. Until the skill exists, follow the same three rules manually.

These override the default "just write the code" behavior; user instructions still take precedence over both.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

During brainstorming, before converging on a design:

- **Hunt unknown unknowns:** bring your own domain knowledge to the table — name risks, constraints, and pitfalls in this territory the user hasn't mentioned, don't only extract what they already know.
- **Architecture changers first:** order clarifying questions by impact — questions whose answers would change the architecture come before detail questions.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

Known defects are frozen immediately as `{ todo: true }` tests encoding the CORRECT
expectation — every run lists them without going red; the fixing session removes the flag.

Red-to-green iteration gets a **budget**: if the suite is still red after ~10 rounds, stop trying —
`git bisect` to the introducing commit and report, instead of more attempts. And **state explicitly
what was fixed by suppression rather than by understanding** (timeout raised, test skipped, warning
silenced). Such a fix is a valid intermediate result — but only when it is named as one.

Counting and grep checks over repo files must be **CRLF-safe** on Windows checkouts: a `sed`/`grep`
pattern with a `$` anchor silently counts zero on CRLF files — and a silent zero reads like "clean".

Generated visualizations are **static/precomputed by default**. A `requestAnimationFrame` or
`setInterval` loop without an explicit termination condition or frame cap does not ship.

## 5. Security by Design

**Derive security requirements before writing the plan — not after the bug.**

When a milestone adds a new attack surface — write/control paths, network listeners, credential handling, or any untrusted external input — invoke the `security-requirement-extraction` skill during **brainstorming/design** and **writing-plans** to:

- Build a short STRIDE threat model for the new surface (assets, trust boundaries, threats).
- Derive concrete, **testable** security requirements — each traced to a threat, with acceptance criteria.
- Record both in `docs/superpowers/security/<date>-<milestone>-threat-model.md` (the M3 doc is the pattern).

Then carry those requirements into the plan as explicit verification steps (§4) and TDD cases where testable, and re-run `/security-review` on the resulting diff before merge.

Skip only for changes with no new attack surface (pure reads, docs, refactors, UI copy). When in doubt, do the threat model — it is cheap relative to a shipped vulnerability.

### Dependency Hygiene (slopsquatting defense)

LLM-hallucinated package names are a supply-chain attack vector (attackers pre-register them). Therefore:

- No new dependency — runtime or dev, **including `npm:` alias targets** — enters a spec/plan without an **existence proof**: a registry lookup or context7 doc hit, recorded in the plan's Tech Stack/Global Constraints.
- Agent-run installs use `--ignore-scripts`.
- The `package-guard` hook (`.claude/hooks/package-guard.js`) enforces registry existence + freshness/adoption at install/manifest time (fail closed). Its override path is a human terminal install — never weaken the hook to get past it.

### Extension Hygiene (third-party skills, agents, hooks, MCP)

A skill is more privileged than a dependency: `` !`cmd` `` dynamic-context blocks in a SKILL.md execute during preprocessing — **before the model sees the skill** — so no amount of model-side judgment can stop them. Skills also arrive without an install step: `.claude/skills/` in a cloned repo loads once the workspace is trusted. Therefore:

- **No external skill, agent, command, hook, or MCP server enters this project or `~/.claude/` without a read of its actual source** — first adoption AND every update. Read the diff, not the README.
- **Review checklist** (block on any hit, ask the user): `` !`…` `` / ```` ```! ```` dynamic-context blocks · `allowed-tools` frontmatter granting Bash/Write/network · outbound network calls (`curl`, `fetch`, webhooks, telemetry) · credential paths (`~/.ssh`, `~/.aws`, `gh auth`, `.env`, keychain) · install/postinstall scripts · obfuscation (base64, `eval`, minified blobs) · bundled hooks that self-register into `settings.json`.
- **`disableSkillShellExecution: true` is the default posture** in `.claude/settings.json` (§10 layer 2). It neutralizes the whole dynamic-context attack class. Turn it off only deliberately, for a named skill that needs it, and record why.
- **Cloning a repo is an adoption decision.** Before working in a foreign checkout, check whether it carries `.claude/skills/`, `.claude/agents/`, or `.claude/hooks/`, and apply the checklist to those files before trusting the workspace.
- Curated indexes (awesome-lists, marketplaces) are **discovery aids, not trust signals** — listing implies no review. The checklist applies unchanged to anything found through them.

The `milestone-checkpoint` skill enforces this at update time (its step 3).

## 6. Platform-Specific Conventions

**Check for a `<PLATFORM>.md` at the project root before assuming generic tooling.**

If this repo targets a specific platform or SDK (e.g. a smart-home hub, iOS, a cloud provider's CLI), a root-level `<PLATFORM>.md` (e.g. `IOS.md`) holds the CLI commands, artifact-sync rules, and release mechanics specific to that platform. This file only covers conventions that hold regardless of platform — defer to the platform file wherever §7–8 say "see the platform file".

## 7. Progress Dashboard Protocol

**For multi-milestone projects, track progress in a self-contained dashboard artifact.**

Use a single-file `dashboard.html` (or equivalent): opens directly in a browser, no server/build step. It shows every milestone's status and, for each unfinished milestone, the full prompt needed to resume it.

**Single source of truth:** one data block near the top (e.g. `window.DASHBOARD_STATUS`). Edit only that block; never touch the renderer beneath it.

**Protocol per milestone session** — when working on milestone `Mx`, maintain its entry in the same run:
1. **At start:** `status: "active"`, `startedAt: "<YYYY-MM-DD>"`, append a `log` entry ("Brainstorming/Design started"), bump the top-level `updatedAt`.
2. **During the run:** tick off `steps[].done` as completed (fixed workflow: **Brainstorming → Spec → Plan → Implementation (TDD/SDD) → Validate + Release**); keep `currentActivity` current (or `null`); append coarse-grained entries to `log`; before every deployable release, bump the version and log it (§8 — see the platform file for the exact command).
3. **At the end:** `status: "done"`, `finishedAt`, `commit: "<short-sha>"`, all `steps[].done = true`, `currentActivity: null`, bump `updatedAt`.
4. **Between milestones:** once a milestone is closed and before starting the next, run the project's `milestone-checkpoint` skill (its step 1 is a branch/worktree cleanup — check locally and on origin for no-longer-needed branches and worktrees, show a short explanation per candidate, offer selectable deletion, then delete the selected branches (local + origin) and worktrees (git + disk) — followed by `/fewer-permission-prompts`, `/claude-automation-recommender`, and a check of this project's third-party skill sources). Track this as its own checkpoint entry in the milestones list (same object shape as a milestone, `id: "Mx.0"`, `title: "Housekeeping Agentic Loop"`; the implementation milestone it gates is numbered `Mx.1`), not just prose.

**Fields per milestone:** `id`, `title`, `status` (`done`|`active`|`todo`), `startedAt`/`finishedAt`, `commit`, `summary`, `steps[]` (`{label, done}`), `currentActivity`, `runtime`, `log[]` (`{at, note}`), `prompt` (full resume prompt; `null` once done), `recommendedModel` (`{model, effort, why}` — see §11; set for every open milestone, drop once `status` is `done`).

**Rules:**
- Every new milestone (or checkpoint) entered into the dashboard gets a `recommendedModel` at creation time, not as an afterthought — assign it per §11 before the entry is committed.
- Every resume prompt (milestone or checkpoint) ends with `/remote-control <id> — <title>` so the spawned session is reachable from the Claude mobile app.
- Resume prompts state the **goal and the machine-checkable done condition**, never a step-by-step procedure. For flagship sessions (§11 palette) this is load-bearing, not stylistic: over-prescriptive prompts measurably reduce flagship output quality. Give the full task spec up front and let the session plan its own path.
- Every closing report and every handover ends with two lines: **what was actually run and
  verified** (with the command and its result) and **what was assumed** without checking. A step an
  unattended run skipped belongs in the second line, not silently in the first. Unverified
  completion claims are the one friction class users react to worst — worse than bugs.
- Log friction the moment it occurs: append a `log[]` entry prefixed `FRICTION:` to the active milestone (repeated errors, blocked tools, wrong assumptions, rework). The workflow retro in `milestone-checkpoint` reads these entries as its primary signal source — unlogged friction is invisible to it.
- New milestone sessions and the release-readiness subagent read `docs/dashboard/triage-inbox.md`
  FIRST (when present) — surface open findings before starting new work.
- Keep edits surgical — only the data block, only the one milestone's (or checkpoint's) object.
- Commit the file — other sessions and fresh worktrees read it (e.g. via "Start Mx…" chips).
- The progress bar derives automatically from `steps[].done` — don't maintain it by hand.
- View in a browser for the reliable full view (always shows every prompt in full); it can also be re-rendered inline in chat.

**Inline chat rendering:** inline widgets are recreated per session and do NOT auto-load the dashboard file. When rendering it in chat, build it 1:1 from the status data block and include, for every unfinished milestone, its **full** prompt (collapsed under a "show prompt" toggle). Never truncate or omit prompts — that's exactly how they end up feeling "lost".

## 8. Versioning & Release Log

**Every real release gets a version bump and a log entry mapping it to a commit.**

Version scheme `0.X.Y`: **X = milestone number**, **Y = build number within that milestone** (resets to 0 at each new milestone). Major stays `0` until the first public 1.0 release.

Any build that is actually deployed/installed/published — not a throwaway dev run — gets its own version number and a line in a committed version log (e.g. `versions.md`):

| Version | Date | Commit | Target | Milestone | Note |

Per release:
1. Commit the code being deployed.
2. Bump the version (see the platform file, §6, for the exact command — new build within a milestone vs. a new milestone).
3. Write a changelog entry for the new version, in the language(s) the project's users see.
4. Verify any generated/derived manifest is in sync with its source; commit the bump + changelog together.
5. Deploy/publish, then append the log line (version, date, commit, target, note).

An ephemeral dev-run command (one that tears itself down on stop) is not a release and needs no bump/log entry.

## 9. Branch Lifecycle

### Starting: one worktree per session

**A milestone or feature session works in its own git worktree — never in a checkout another session may be using.**

Use the native path first — `claude --worktree <name>` at launch, or the `EnterWorktree` tool mid-session (`/fork` gets its own worktree too); only the native path also isolates Bash/git from the main checkout. `superpowers:using-git-worktrees` stays the fallback. Exempt: short read-only or single-file sessions (a nightly routine, a dashboard edit, a quick doc fix) and checkpoint sessions that must delete worktrees — they stay in the primary checkout.

Why: two agent sessions sharing one working directory collide in ways git cannot arbitrate. The failure mode is not a merge conflict but a silent one — `git status` shows foreign changes that must be reasoned about before every commit, and one session's `git push` ships another session's finished-but-unpushed commits that nobody decided to release. Isolation is cheap; untangling a shared tree is not. The `milestone-checkpoint` skill already cleans worktrees up afterwards (§7, its step 1).

Corollary for automations: a routine that writes **only its own ledger file** (e.g. a nightly triage writing its findings inbox) commits it directly on the main branch — those findings must be readable on the main branch, because every new milestone session reads them first (§7). Routing them through a PR queue hides them behind a merge nobody performs. The moment an automation touches anything beyond that ledger — code, version bumps, shared docs — it needs a branch and a PR.

### Finishing: review, then ask

**Before any git action on a finished branch, run `/code-review` — then ask how to proceed.**

Once a branch/worktree's change is complete and a git action (commit/push/merge) is next:

1. Proactively start `/code-review` on the diff against the base branch — don't wait to be asked.
   **Always name the level**, never call it bare: without one the command reuses the last level
   you typed, across sessions. `medium` for a task review inside `subagent-driven-development`
   (few, high-confidence findings), `xhigh` for the whole-branch review here, `ultra` (Cloud
   multi-agent, costs credits — a per-case decision) plus `/security-review high` for a milestone
   with its own threat model (§5). `--fix` only at `medium`; its edits sit outside `/rewind`
   checkpoints, so undo them with git.
   When the diff touches runtime resources (timers, listeners, handles), an HTTP/API call, or
   platform-dependent paths and shell invocations, run the matching lens agents from
   `.claude/agents/` **in parallel** alongside it — `runtime-resource-reviewer`,
   `api-contract-reviewer`, `cross-platform-reviewer`, fanned out via
   `superpowers:dispatching-parallel-agents`. Leave out the lenses the diff doesn't touch. These
   three classes are where defects most reliably survive review and surface in the user's own
   manual testing.
2. Based on the result, ask (don't decide silently):
   - **Trivial change (no Critical Issues):** ask whether to push directly to `origin/main` and pull the local `main` checkout up to date — skipping a PR.
   - **Otherwise:** ask whether to push the branch and open a Pull Request.

Always wait for an explicit yes before pushing or merging — this section only saves re-explaining the two options each time, not the confirmation itself.

## 10. Permission Strategy (2 Layers)

**Hooks define what must never happen; the Auto Mode classifier judges everything else.**

1. **Hooks = "must NEVER happen"** — deterministic exit-2 guards (PreToolUse). They apply in every permission mode; neither Auto Mode nor `bypassPermissions` can override them.
2. **Auto Mode = the normal case**, not situational autonomy: it is the Pro/Max product default from v2.1.228 (v2.1.233 on native Windows), and `permissions.defaultMode: "auto"` sets it everywhere else. Hooks stay in force underneath. Never use `bypassPermissions` locally.

Two boundaries the classifier must not clear on its own — both evaluated **before** it:
- **`permissions.ask`** = human checkpoint, always prompts. For actions that are legitimate but must never be auto-approved (`Bash(git push --force*)`, a store/registry publish).
- **`autoMode.hard_deny`** = prose rules no user intent or `allow` entry can clear. Keep `"$defaults"` in the array or the built-in exfiltration rule is silently replaced. Read **only** from `~/.claude/settings.json`, never from a repo's `.claude/settings.json` — so tool-pattern boundaries for one repo belong in `permissions.ask`/`deny` instead.

`permissions.allow` is no longer curated per checkpoint; it documents read-only everyday commands and keeps non-auto sessions usable. Global vs. project split: see "Claude Code Settings: Skill = Source of Truth" below.

### Hook start conditions (`if` filters)

A hook entry takes an optional `if` holding **exactly one** permission rule; Claude Code evaluates it before spawning the process, so a guard that would have exited early never starts at all. Two rules for using it without weakening the net:

- The filter must be a genuine **superset** of the hook's own predicate. One `if` cannot express "Edit OR Write", so register the hook once per tool name (`Edit(lib/**)` and `Write(lib/**)`).
- **Do not filter Bash gates on a subcommand pattern.** A permission rule must match *every* subcommand of a compound command, so `if: "Bash(git commit *)"` does not match `git add . && git commit -m …` — the gate would silently stop firing exactly where it matters most. Path-based `Edit`/`Write` guards have no such problem.

## 11. Model Tiering (Subagents & Milestones)

**Don't pay flagship prices for mechanical work — and never economize on the checker or on high-risk judgment calls.**

**Current palette:** *workhorse* = Claude Sonnet 5, *implementer* = Claude Opus 5, *flagship* = Claude Fable 5. The tier rules below reference these roles, not model names — when the palette changes, edit only this line. Milestone sessions still know only two tiers (workhorse/flagship); the implementer exists as a delegation target inside flagship sessions (see Flagship orchestration below). Within a tier, tune `effort` before switching models; the model switch happens only at the judgment boundary.

### Subagents

Subagents inherit the session model by default. Assign tiers explicitly via frontmatter in `.claude/agents/*.md` (`model:` + `effort:`):

- **Mechanical/checklist/extraction agents** (run commands, compare outputs, grep & report — e.g. `release-readiness`): workhorse, `effort: low`/`medium`.
- **Review/judge/security agents** (e.g. `security-reviewer`): `model: inherit` **plus `effort: high`** — feedback quality is the loop bottleneck (§4), and a weak verifier defeats the maker/checker split. In a flagship session the checker inherits the flagship — that is the point, not a cost bug.
- In multi-agent workflows, set effort per stage: low for finder/collector stages, high only for verify/judge stages.
- **Implementers are dispatched as `subagent_type: general-purpose`, never `fork`.** Subagents run background-by-default and `fork` (parent context inherited) is the Agent tool's default, but `subagent-driven-development` lives on the *fresh* context per implementer and names no type of its own. For review agents `fork` is welcome — they should know the task context and inherit the model.
- `TodoWrite`/`TaskCreate` are off on current models while `using-superpowers` still asks for "a todo per item". Do **not** set `CLAUDE_CODE_ENABLE_TODO_TOOLS=1` — checklists live in plan files and the dashboard.
- Global session-wide override if ever needed: `CLAUDE_CODE_SUBAGENT_MODEL`.

### Milestones (main-loop sessions)

Every open milestone in the dashboard (§7) carries a `recommendedModel: { model, effort, why }` — a suggestion for which Claude model/tier and reasoning effort best fits *that milestone's own* main-loop session (distinct from the subagents it spawns internally). Set it when the milestone entry is created (checkpoint or milestone-planning session), and re-derive it if the milestone's scope changes materially.

Judge by the nature of the remaining work, not by project phase or milestone number:
- **Mechanical/checklist work** (checkpoints, scoped reads-milestones with brainstorming/spec already done): workhorse, `effort: low`/`medium`.
- **Open design/brainstorming, external-integration research, or moderate ambiguity**: workhorse, `effort: medium`/`high`.
- **High-stakes judgment calls** (GO/NO-GO decisions against measurable criteria, touching the one untested/production-crash-prone code path, correctness-critical domain logic feeding user-facing decisions, or any milestone with its own threat-model/security-review): flagship, `effort: high`/`xhigh` — judgment quality outweighs speed or cost here (`max` only for single correctness-critical decisions where cost is irrelevant).
- One-line `why` always states *what about this milestone's remaining work* drives the tier — and, with the role-based palette, what drives the effort level within it.

**Security milestones on the flagship:** safety classifiers may refuse benign adversarial work (STRIDE modeling, exploit-shaped test cases, credential-path review). Log each refusal as a `FRICTION:` entry (§7), rephrase toward the defensive intent, and only drop the affected sub-step to the workhorse if it persists — the milestone itself stays on the flagship.

**Autonomous loops default to the workhorse:** scheduled routines and long unattended loops (nightly triage, `/goal` sessions) run on the workhorse unless the loop's core is a judgment call — flagship turns can run many minutes at flagship rates, and both compound unattended. A flagship autonomous loop is a deliberate per-case decision recorded in the milestone's `why`.

This is a recommendation surfaced to whoever starts that milestone session (human or automation deciding which model to launch it with) — not an enforced gate.

### Flagship orchestration

In a flagship milestone session, the main loop acts as **orchestrator** — that is `superpowers:subagent-driven-development` (fresh implementer per task, task review after each, whole-branch review at the end); follow the skill rather than a paraphrase of it, and use `superpowers:dispatching-parallel-agents` for the fan-out when 2+ tasks are genuinely independent. What the flagship tier adds is the **model choice per subagent**: *implementer* (via the Agent tool's `model` parameter or agent frontmatter) for complex or ambiguous implementation work, *workhorse* for mechanical work; review subagents stay `model: inherit`, so they inherit the flagship. **Delegation is the default, not a ban:** trivial edits and short verification commands the orchestrator does itself — for a one-line fix, handing over context costs more flagship tokens than the fix. This pattern applies only to flagship sessions; workhorse sessions implement directly. It lives here as a standing rule, not in resume prompts — those stay goal + done condition (§7).

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

Based on: https://github.com/multica-ai/andrej-karpathy-skills

---

## Project Extensions

<!-- Project extensions: reference the platform file per §6, e.g. @<PLATFORM>.md -->

## Claude Code Settings: Skill = Source of Truth

**Global** Claude Code settings changes (meant to apply on every machine — `permissions.allow` patterns that are useful everywhere, global hooks, `model`, notification flags, plugins/marketplaces) belong in a private settings-skill repo (`<your-settings-skill-repo>`) as the **source of truth**, not only in the live `~/.claude/settings.json`:

1. Put it in the skill repo first, then **mirror** it into the live `~/.claude/settings.json` — never change only the live file (otherwise the change is lost when you switch machines).
2. **Project/platform-specific** settings (e.g. platform-specific allowlist entries or guard hooks) stay in **this repo's `.claude/settings.json`** — they are already portable there (a `git clone` brings them along) and do not belong in the global skill.

Rule of thumb: "useful in every project?" → global (skill). "only here / only for this platform?" → project-local (this repo).

**Framework artifacts**: every GENERIC change to gate/guard hooks,
CLAUDE.md protocol rules, the checkpoint flow, or the dashboard/template formats is
mirrored **in the same session** into the framework repo `skill-agentic-loop-framework`
(`plugin/skills/agentic-loop-framework/templates/` or the platform modules) + its
CHANGELOG updated. Project-specific things (concrete allowlist entries, project-specific
scripts) stay here. The milestone-checkpoint checks for drift (step 6).