# Native-Feature-Review

Ledger für `milestone-checkpoint` Step 7b: Welche eigenen Artefakte (CLAUDE.md-Regeln, Skills,
Hooks, Agents) sind inzwischen durch native Claude-Code-Funktionen ersetzbar?

Verdikt: **replace** (native deckt es vollständig ab) · **keep + note** (Teilüberlappung, Notiz
sagt was native NICHT kann) · **keep** (kein Äquivalent). Nur Zeilen neu bewerten, deren
`Zuletzt geprüft` älter ist als die aktuellen Release Notes.

| Artefakt | Art | Natives Äquivalent | Verdikt | Zuletzt geprüft | Notiz |
|---|---|---|---|---|---|
| Memory-Dateien + MEMORY.md-Index | Konvention | Auto-Memory (default an, `/memory`) | keep + note | 2026-07-20 | Nativ deckt Erfassung+Injection ab; unsere Index-Disziplin bleibt nötig wegen Startup-Limit (erste 200 Zeilen / 25 KB) und weil Auto-Memory maschinenlokal ist. Dritt-Tools (claude-mem) NICHT nötig. |
| §9 Finishing a Branch | Prozessregel | `/code-review` | keep + note | 2026-07-20 | Der Review selbst ist nativ; unsere Regel steuert WANN + die Zwei-Optionen-Frage. Nur der Review-Teil ist ersetzt. |
| §10 Permission Strategy | Prozessregel | `/fewer-permission-prompts`, Auto Mode | keep + note | 2026-07-20 | Nativ liefert Werkzeuge, nicht die 3-Schichten-Doktrin. |
| Gate-/Guard-Hooks (test-gate, package-guard, …) | Hooks | — | keep | 2026-07-20 | Fail-closed mechanische Gates; kein natives Äquivalent, Modell-Sorgfalt ist keins. |
| Dashboard-Protokoll (§7) | Konvention | — | keep | 2026-07-20 | Kein natives Milestone-Tracking. |
| Skill-Sources-Check (Step 3) | Skill-Schritt | — | keep | 2026-07-20 | Kein natives Skill-Vetting; `disableSkillShellExecution` deckt nur die Dynamic-Context-Klasse. |
| Checkpoint-Steps 2/6/7b (Allowlist, CLAUDE.md-Pflege, Versionscheck) | Skill-Schritte | `/doctor` (Alias `/checkup`, nativ seit ~2.1.2xx; Checks 0–9) | keep + note | 2026-07-27 | /doctor deckt ab: CLAUDE.md-Dedup/-Kürzung/-Lazy-Migration (Checks 2–4 → Step 6 auf Memory-Ordner verengt), Versions-Aktualität (Check 7 → aus 7b entfernt), langsame Hooks, Unused-Extensions. NICHT ersetzt: Memory-Ordner-Konsolidierung, projekt-scope Allowlist (`/fewer-permission-prompts`; /doctor Check 9 schreibt nur local), Native-Feature-Review, Retro. Check 8 (Auto-Default) kollidiert mit §10 → am Gate ablehnen. `disableModelInvocation` → Nutzer muss /doctor selbst tippen (Step 2b). |
