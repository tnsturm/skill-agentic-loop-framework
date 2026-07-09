# skill-agentic-loop-framework

Portabler Claude-Code-Skill: **Bootstrap eines loop-getriebenen agentischen
Entwicklungs-Frameworks** in einem beliebigen Repo — verifizierte, selbstkorrigierende
Loops (Gate-Hooks, Progress-Dashboard, Milestone-Checkpoints, Hook-Telemetrie) statt
Prompt-für-Prompt-Arbeit.

Extrahiert aus dem VioletApp-Projekt (Loop-Hardening-Reihe M4.6–M4.9, 2026-07).

## Installation

```
claude plugin marketplace add tnsturm/skill-agentic-loop-framework
claude plugin install agentic-loop-framework
```

## Inhalt

- `plugin/skills/agentic-loop-framework/SKILL.md` — die Bootstrap-Anleitung (Phasen 0–7 + Dauerregeln).
- `plugin/skills/agentic-loop-framework/templates/` — kopierfähiger generischer Projektbaum
  (CLAUDE.md-Basis, Dashboard, settings.json-Gerüst, test-gate-Hook + Telemetrie-Helper +
  Smoke-Test, milestone-checkpoint-Skill).
- `plugin/skills/agentic-loop-framework/homey/` — Plattform-Modul für Homey-Apps
  (HOMEY.md, 4 Guard-Hooks, Allowlist, release-readiness-Subagent).
- `plugin/skills/agentic-loop-framework/CHANGELOG.md` — Versionen + Quellen.

Historischer Seed: die Bootstrap-Prompts in `skill-ClaudeCode-general-settings/prompts/`
(dort als superseded markiert — die lebende Quelle ist dieses Repo).
