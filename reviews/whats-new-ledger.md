# What's-New-Ledger — claude-code-news-review

Stand: geprüft bis 2026-w34 (v2.1.239) · letzter Lauf: 2026-08-31 (Routine, headless — Übersichtsseite listete keine Woche nach w34, nichts Neues)

Besonderheiten: 2026-w31 = kein Digest veröffentlicht (404, verifiziert 2026-08-23).

## Offen

_(Framework-/Global-Befunde, die noch nicht umgesetzt sind — Umsetzung bumpt Plugin-Version + CHANGELOG.)_

| Woche | Item | Zielsystem | Entscheidung |
|---|---|---|---|
| W18–W34 | Sammel-Review der Wochen Mai–August 2026 | alle drei | Vollständig ausgewertet im Setup-Tuning-Plan (Artifact „Setup-Tuning August 2026", https://claude.ai/code/artifact/c097194a-57b4-41d2-89c4-bef43ebbcef1); Umsetzung läuft als VioletApp-Milestones M9.0 (Blöcke a/b/c), M9.4, M9.5, M10.2. Einzel-Items unten nur, wo dort NICHT erfasst. |

## Geprüft (Auszug mit Relevanz)

| Woche | Item | Zielsystem | Klassifikation | Entscheidung / Ziel |
|---|---|---|---|---|
| W32 | Auto Mode = Produkt-Default; autoMode.hard_deny | global + Framework | vereinfachen | M9.0 Block a (A1); Framework 0.1.30 gespiegelt |
| W19+ | Hook-`if`-Filter, exec-Form, neue Events | Projekte + Framework | effizienter | M9.0 Block b (A2) |
| v2.1.205 | /doctor als aktiver Checkup | global | vereinfachen | M9.0 Block b (A3); checkpoint-Skill angepasst |
| v2.1.223 | /code-review Level-Memory + /review-Alias | Projekte | Qualität | M9.0 Block a (A4): Level immer explizit |
| W16 | /schedule Cloud-Routinen | Projekte | Zuverlässigkeit | M9.0 Block c (A5): Nightly-Triage in die Cloud |
| W27/W33 | Subagents background-default, fork-default; TodoWrite auf neuen Modellen entfernt | global + Framework | obsolet-macht | M9.0 Block a (B2): Plugin-Update + „Implementer nie fork" |
| W19/W28/W32 | Native Worktrees (--worktree, /fork, Isolation) | Projekte + Framework | obsolet-macht | M9.0 Block c (C1): nativ vor Skill-Fallback |
| W25/W27 | Artifacts GA (Pro/Max), /artifacts-Attach | Projekte | erweitern | M9.0 Block c: Dashboard als Artifact |
| W22/W30 | security-guidance- / Claude-Security-Plugin | global | irrelevant (vorerst) | Zurückgestellt: Python fehlt, Kosten > Nutzen (Plan C2); Wiedervorlage bei M9.3 |
| W33 | attribution ersetzt includeCoAuthoredBy | global | vereinfachen | Nur bei Bedarf; nichts gesetzt |
| W32 | Ultraplan entfernt | alle | Deprecation | Keine Referenzen vorhanden — keine Aktion |
