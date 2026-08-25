---
name: claude-code-news-review
description: Use when running the weekly Claude Code news check — the user (or a scheduled run) invokes /claude-code-news-review, or asks to check https://code.claude.com/docs/en/whats-new for updates relevant to their setup, projects, or the agentic-loop framework. Not for general Claude Code questions.
disable-model-invocation: true
---

# Claude-Code-News-Review — wöchentliche What's-New-Prüfung mit Ledger

Prüft neue Claude-Code-Wochen-Digests genau einmal und leitet daraus Optimierungen für drei
Zielsysteme ab. Kern: **erst Ledger lesen, nur Neueres holen, jede Entscheidung protokollieren** —
sonst prüft jeder Lauf wieder alles (beobachtete Baseline: 16 Digests neu gelesen, Findings im
Chat verloren).

## Zielsysteme (gegen diese wird jedes News-Item geprüft)

1. **Globales Setup** — Quelle der Wahrheit: `skill-ClaudeCode-general-settings` (settings-reference.json, README, general-settings-Plugin).
2. **Projekte** — jedes lokale Repo mit `.claude/` (Hooks, Skills, Agents, CLAUDE.md; z. B. VioletApp).
3. **Dieses Framework** — Templates, Gate-Hooks, checkpoint-Skill; inkl. Obsoleszenz-Frage: *ersetzt ein natives Feature einen Framework-Mechanismus?* (stehende Version des Checkpoint-Schritts „Native-Feature-Review").

## Ledger

`reviews/whats-new-ledger.md` im Framework-Repo (committet → Stand gilt auf jedem Rechner).
Kopfzeile `Stand: geprüft bis <Woche> (<CLI-Version aus dem neuesten gelesenen Digest>)` ist der
Dedup-Marker; Zeilen nur für Items mit Relevanz. **Marker-Regel:** Der Marker rückt nur bis zur
letzten **erfolgreich gelesenen** Woche vor. Eine 404-Woche *zwischen* gelesenen Wochen wird als
„kein Digest" festgeschrieben (z. B. 2026-w31) — eine 404-Woche *am aktuellen Rand* bleibt
ungeprüft; der nächste Lauf probiert sie erneut.

## Ablauf

1. Ledger lesen → letzte geprüfte Woche W.
2. `https://code.claude.com/docs/en/whats-new` holen; alle **dort gelisteten** Wochen-Digests **nach W** laden (einzeln, `…/whats-new/<jahr>-w<nn>`; die Übersichtsseite bestimmt, welche Wochen existieren — keine Kalender-URLs raten). Nichts Neues → Ledger-Kopf mit Prüfdatum aktualisieren, Ende („nichts Neues" ist ein korrektes Ergebnis, keinen Befund erzwingen).
3. Jedes neue Item gegen die drei Zielsysteme klassifizieren: `erweitern | vereinfachen | effizienter | obsolet-macht | deprecation/rename | irrelevant`. Deprecations/Renames immer prüfen — sie brechen bestehende Regeln still.
4. Relevante Items nach Impact ordnen (Maßstab: spart Kontext/Zeit pro Session, ersetzt Eigenbau durch Natives, schließt Zuverlässigkeitslücke).
5. **Interaktiv:** Top-Items per AskUserQuestion anbieten — sofort umsetzen / als Milestone- bzw. triage-inbox-Eintrag / verwerfen. Gewählte Sofort-Umsetzungen ausführen. **Headless (`-p`/Routine):** nichts umsetzen, keine Settings ändern — nur routen (Schritt 6) und im Ledger als `offen` markieren.
6. Routing der Entscheidungen: Projekt-Befund → `docs/dashboard/triage-inbox.md` des Projekts; Framework-Befund → Ledger-Abschnitt „Offen" (Umsetzung bumpt später Plugin-Version + CHANGELOG); Global-Setup-Befund → Ledger + Hinweis, dass settings-reference.json **zuerst** im Settings-Repo geändert wird.
7. Ledger aktualisieren (Kopf-Marker + Zeilen) und committen; triage-inbox-Einträge nach den Regeln des jeweiligen Repos (Ledger-only-Automation → direkt auf main).

## Leitplanken

- Schreibzugriff nur: Ledger, triage-inbox-Anhänge, und (nur interaktiv, nur nach Auswahl) die gewählte Umsetzung.
- In fremden Repos (Projekte) darf ein Headless-Lauf ausschließlich die triage-inbox anhängen und committen — nie andere Dateien.
- Quelle ist die offizielle Doku — Items aus Blogs/Social nicht in den Ledger-Marker mischen.
- Jeder Lauf endet mit den zwei Zeilen „ausgeführt und verifiziert" / „angenommen".

## Wöchentlicher Trigger (einmalig einrichten)

`/schedule`-Routine oder lokaler Task, wöchentlich: `claude -p "/claude-code-news-review"` im
Framework-Repo-Checkout. (`/schedule` ist mit gesetztem `ANTHROPIC_API_KEY` deaktiviert — dann
lokalen Scheduler nutzen.)

## Häufige Fehler

| Fehler | Korrektur |
|---|---|
| Ledger erst am Ende gelesen | Schritt 1 ist das Lesen — davor kein Fetch |
| Item „später prüfen" ohne Ledger-Zeile | Alles Neue wird jetzt klassifiziert oder als `offen` protokolliert |
| Headless-Lauf ändert Settings/Code | Headless routet nur; Umsetzung braucht die interaktive Auswahl |
| 404-Woche am aktuellen Rand als „kein Digest" festgeschrieben | Nur Lücken ZWISCHEN gelesenen Wochen festschreiben; Rand-404 → Marker bleibt stehen, nächster Lauf probiert erneut |
