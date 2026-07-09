---
name: agentic-loop-framework
description: Bootstrap eines loop-getriebenen agentischen Entwicklungs-Frameworks in einem beliebigen Repo — verifizierte, selbstkorrigierende Loops (Gate-Hooks, Progress-Dashboard, Milestone-Checkpoints, Hook-Telemetrie) statt Prompt-für-Prompt-Arbeit. Trigger: "agentic loop aufsetzen", "Framework-Bootstrap", "verifizierte Loops einrichten", "Projekt auf Milestone-Loops umstellen" — für neue UND bestehende Projekte.
---

# Agentic-Loop-Framework — Bootstrap

Richtet in einem Repository ein loop-getriebenes agentisches Entwicklungs-Framework ein.
Kern: maschinell verifizierte Loops (Tests + Gates), ein selbst-dokumentierendes Dashboard,
Checkpoints, die das Framework selbst verbessern, und Telemetrie als Retro-Datenbasis.

**Artefakt-Quellen:** Statt Dateien neu zu erfinden, den mitgelieferten Baum
[`templates/`](templates/) kopieren und Platzhalter anpassen (Spitzklammern `<…>`).
Für Homey-Apps zusätzlich [`homey/README.md`](homey/README.md) (Plattform-Zusatzblock).
Historischer Seed: die Bootstrap-Prompts (de/en, Stand 2026-07-07) — seit 2026-07-09 nur
noch in der Git-Historie des Repos `skill-ClaudeCode-general-settings` (Commit `fcbda47`);
dieses Repo ist die einzige lebende Quelle.

## Vorab klären (falls nicht im Auftrag genannt)

1. Projekt: NEU (Zweck, Sprache/Stack) oder BESTAND (bisher ohne Claude)?
2. Team: solo oder geteilt (der Framework-Skill wird dann als Plugin verteilt)?
3. Sprache aller erzeugten Artefakte (CLAUDE.md, Dashboard, Changelogs): de oder en?
4. Bootstrap-Commits: direkt auf main (solo/neues Repo) oder Branch `bootstrap/agentic-loop`?

## Regeln für den gesamten Bootstrap

- Phasen strikt nacheinander; nach jeder Phase einzeln committen.
- Folgt ein Plattform-Zusatz (z. B. `homey/`): zuerst ALLES lesen; jeder „Phase-N-Zusatz"
  läuft zusammen mit Phase N, Kontext-/Dauerregel-Zusätze gelten ab Phase 0.
- Simplicity First: nur Automatisierung, die wiederkehrenden Schmerz trifft — nichts Spekulatives.
- Fragen nur an den markierten ENTSCHEIDUNGSPUNKTEN — sonst autonom arbeiten.
- Die Phasen-Commits des Bootstraps sind vom §9-Review-Gate ausgenommen; §9 gilt ab Phase 7.
- Kontext-Hygiene: den Bootstrap ab Phase 1 als eigenen Dashboard-Eintrag führen
  (id "B0", steps = Phasen 0–7). Nach Phase 2 und Phase 5: committen, B0 aktualisieren,
  Resume-Prompt für die nächste Phase ausgeben — der Nutzer entscheidet, ob eine frische
  Session übernimmt.

## Phase 0 — Preflight & Bestandsaufnahme

1. Werkzeuge prüfen, jedes Ergebnis klassifizieren als VERFÜGBAR / FEHLT-BLOCKIEREND /
   FEHLT-DEGRADIERBAR:
   - BLOCKIEREND (ohne sie stoppen + Installationsweg nennen): git (Repo vorhanden? sonst
     git init + stack-übliches .gitignore), superpowers-Skills (brainstorming, writing-plans,
     test-driven-development, systematic-debugging, verification-before-completion),
     /code-review.
   - DEGRADIERBAR (weglassen + Fallback in CLAUDE.md dokumentieren):
     /claude-automation-recommender, /fewer-permission-prompts,
     /goal (Fallback: DONE-BEDINGUNGEN als nummerierte Klartext-Checkliste im Prompt),
     /remote-control (Fallback: Zeile weglassen), /security-review,
     security-requirement-extraction (Fallback: STRIDE manuell — Assets/Trust Boundaries/
     Threats → testbare Requirements),
     context7-MCP (Fallback: offizielle Doku per WebFetch — nie aus dem Gedächtnis),
     Auto-Memory (Fallback: docs/memory/*.md + docs/memory/MEMORY.md als Index).
2. Bei Bestandsprojekt: Stack, Build-/Testsystem (inkl. Suite-LAUFZEIT!), CI, Git-Historie,
   offene TODOs analysieren; Ist-Zustand in max. 10 Zeilen zusammenfassen.

→ verify: Werkzeug-Tabelle (Name | Status | ggf. Fallback) + Ist-Zusammenfassung im Chat.

## Phase 1 — Fundament: Zustand auf Platte

Aus [`templates/`](templates/) kopieren und anpassen (bestehende Dateien NIE überschreiben —
bei Bestand behutsam mergen):

1. `templates/CLAUDE.md` → Repo-Root. Enthält §0 Pflicht-Skills, §1–§4 Karpathy-Kern
   (Original: github.com/multica-ai/andrej-karpathy-skills, inkl. Tradeoff-Hinweis und
   Schlussabsatz), §4-Zusatz todo-Test-Konvention, §5 Security by Design (STRIDE),
   §6 `<PLATFORM>.md`-Mechanismus, §7 Dashboard-Protokoll (inkl. FRICTION- und
   Triage-Inbox-Regel), §8 Versionierung 0.X.Y, §9 Branch-Gate, §10 Permission-Strategie
   (3 Schichten), §11 Subagent-Tiering, Source-of-Truth-Abschnitt. Platzhalter füllen;
   in Phase 1 den §7-Vermerk ergänzen: „milestone-checkpoint-Skill wird in Phase 5
   dieses Bootstraps eingerichtet" (wird in Phase 5 entfernt).
2. `templates/docs/dashboard/` → `docs/dashboard/` (dashboard.html mit leerem Datenblock —
   der Renderer darunter wird NIE editiert; versions.md-Skelett; triage-inbox.md-Skelett).
   B0-Bootstrap-Eintrag in den Datenblock legen.
3. `templates/.claude/settings.json` → `.claude/settings.json` (leeres Hook-Gerüst nach
   Events + minimale read-only-Allowlist). §10-Kurzfassung: (i) Hooks = „darf NIE
   passieren", gelten in jedem Permission-Modus; (ii) Projekt-Allowlist = „ist IMMER ok",
   git-portabel, per /fewer-permission-prompts kuratiert; (iii) Auto Mode
   (claude --permission-mode auto) nur für autonome Loop-Sessions; bypassPermissions lokal NIE.
4. Memory: erste Projekt-Memories (Projektziel, Stack-Entscheidungen, Konventionen) + Index —
   ins Auto-Memory-Verzeichnis, falls verfügbar, sonst docs/memory/ (Ort in CLAUDE.md
   dokumentieren).

→ verify: alles committed; ein node-Einzeiler extrahiert window.DASHBOARD_STATUS aus
dashboard.html und parst ihn fehlerfrei.

## Phase 2 — Milestone-Plan (die Loop-Iterationen definieren)  [interaktiv]

1. ENTSCHEIDUNGSPUNKT: superpowers:brainstorming mit dem Nutzer — was ist M0 (Foundation),
   was sind M1..Mn? Ergebnis als Design-Spec unter docs/superpowers/specs/.
2. superpowers:writing-plans für M0 (docs/superpowers/plans/).
3. Dashboard füllen: jeder Milestone mit vollständigem Resume-Prompt; jeder Prompt enthält
   (a) die maschinell prüfbare Done-Bedingung — /goal-Zeile bzw. DONE-BEDINGUNGEN-Checkliste
   (Fallback aus Phase 0), transcript-verifizierbar („Testrunner zeigt 0 Failures UND
   Build/Validate zeigt PASS — Outputs im Chat gezeigt");
   (b) den Startmodus-Hinweis nach §10 (autonomer Lauf per claude --permission-mode auto;
   Alltags-Session im Default-Modus);
   (c) die Triage-Inbox-Zeile („Lies zuerst docs/dashboard/triage-inbox.md, §7");
   (d) als letzte Zeile /remote-control <id> — <titel> (falls verfügbar).

→ verify: Dashboard zeigt alle Milestones, jeder unfertige mit vollständigem Prompt.
Dann: committen, B0 aktualisieren, Resume-Prompt für Phase 3 ausgeben.

## Phase 3 — Innerer Loop: mechanische Verifikation

1. Falls kein Testrunner existiert: den leichtesten stack-üblichen einrichten
   (Ziel: Sekunden-Laufzeit, minimale Dependencies) + ersten Smoke-Test.
2. `templates/.claude/hooks/test-gate.js` + `templates/.claude/hooks/lib/` +
   `templates/test/hooks/test-gate.test.js` übernehmen und in settings.json registrieren
   (Matcher `Bash|PowerShell` — Windows-Sessions committen über das PowerShell-Tool!).
   Der Hook liest das Testkommando aus `package.json scripts.test`; bei Nicht-npm-Stacks
   die im Hook-Kopf dokumentierte Stelle anpassen. Laufzeitbudget ≤30 s
   (ENTSCHEIDUNGSPUNKT bei Bestand mit langsamer Suite: welches schnelle Subset? Die volle
   Suite läuft dann im CI-/Review-Gate).
3. Hook-Lade-Realität: settings.json-Hooks können sofort ODER erst beim nächsten
   Session-Start greifen (variiert je Version) — in-Session-Verify daher IMMER per
   Direktaufruf mit Fixture-stdin (roter Fall exit 2, grüner exit 0); der
   Ende-zu-Ende-Check (echter Commit wird geblockt) ist dokumentierter erster Schritt
   der Folge-Session.
4. In CLAUDE.md verankern: Framework-/Library-Fragen IMMER per context7 (bzw.
   WebFetch-Fallback) nachschlagen statt aus dem Gedächtnis.

→ verify: beide Direktaufrufe des Hook-Skripts liefern die spezifizierten Exit-Codes.

## Phase 4 — Automation-Pass (repo-spezifisch statt generisch)

1. /claude-automation-recommender ausführen. Skip-Kriterium: noch kein Produktiv-Code
   jenseits des Phase-1-Gerüsts oder kein lauffähiger Test → überspringen und als ersten
   Schritt des ersten →M0-Checkpoints vormerken.
2. Empfehlungen priorisiert präsentieren (wiederkehrender Schmerz × Aufwand).
   ENTSCHEIDUNGSPUNKT: der Nutzer wählt.
3. Gewählte umsetzen: Hooks je mit Smoke-Test + Direktaufruf-Verify (Phase 3.3); Skills;
   Subagents (z. B. read-only release-readiness-Prüfer mit PASS/FAIL-Checkliste) mit
   model-/effort-Frontmatter nach Tiering-Regel: mechanische Checklisten-/Extraktions-
   Agents → model: haiku/sonnet + effort: low/medium; Review-/Judge-/Security-Agents →
   model: inherit (beim Checker NIE sparen — Feedback-Qualität ist der Loop-Engpass).

→ verify: jeder neue Hook per Direktaufruf geprüft.

## Phase 5 — Meta-Loop: das Framework verbessert sich selbst

`templates/.claude/skills/milestone-checkpoint/SKILL.md` → `.claude/skills/
milestone-checkpoint/SKILL.md` übernehmen; den Skill-Quellen-Platzhalter (Schritt 3) mit
den echten externen Quellen des Projekts füllen. Der Checkpoint läuft nach jedem
Milestone-„done" (eigener `→Mx`-Dashboard-Eintrag) und umfasst: Workflow-Retro (liest
FRICTION-Einträge + hook-log.jsonl-Blockzählungen), /fewer-permission-prompts,
/claude-automation-recommender, Memory-Konsolidierung (nur als Diff!), Framework-Drift-Check
(gegen diesen Skill), Dashboard-Update, Handover (Push + Startfrage).

Danach den Phase-1-Vermerk in CLAUDE.md §7 entfernen. Committen, B0 aktualisieren,
Resume-Prompt für Phase 6 ausgeben.

→ verify: Skill existiert; CLAUDE.md §7 nennt den Checkpoint als Pflichtschritt, ohne Vermerk.

## Phase 6 — Source of Truth verankern

Dieses Repo IST bereits der portable Skill — im Projekt nur noch verankern:

1. Source-of-Truth-Regel in CLAUDE.md (Vorlage in `templates/CLAUDE.md`): JEDE generische
   Framework-Änderung (Gate-/Guard-Hooks, Protokollregeln, Checkpoint-Ablauf, Templates)
   wird IN DERSELBEN SESSION hierher gespiegelt + CHANGELOG-Eintrag; Projekt-/Stack-
   spezifisches bleibt im Projekt. Faustregel: „In jedem Projekt sinnvoll?" → Skill;
   „nur hier?" → Projekt.
2. Telemetrie: `.claude/hooks/lib/log.js` ist im Template-Baum enthalten — jeder neue Hook
   loggt block/pass an seinen Entscheidungspunkten (Muster in test-gate.js).

→ verify (Trockentest): templates/ in ein Temp-Verzeichnis kopieren — dashboard.html-
Datenblock parst, settings.json parst, `node --test test/hooks/test-gate.test.js` grün.

## Phase 7 — Probelauf des ganzen Loops (ab hier gilt §9)

1. Eine bewusst kleine, echte Aufgabe aus M0 durch den kompletten Loop führen:
   TDD → Gates → Dashboard-Pflege → /code-review → §9-Frage an den Nutzer.
2. Jede Reibung sofort als FRICTION:-Eintrag ins Dashboard-Log — erstes Retro-Futter für
   den →M0-Checkpoint.

→ verify: Aufgabe gemerged ODER als PR offen; Dashboard und Memory aktuell.

## Dauerregeln (in CLAUDE.md verankert; gelten ab sofort)

- Dashboard-Eintrag des aktiven Milestones in jeder Session aktuell halten.
- Reibung SOFORT als `FRICTION:`-log-Eintrag im aktiven Milestone — das Retro liest sie aus.
- Nach jedem Milestone-„done" und vor dem nächsten Start: milestone-checkpoint (eigener
  →Mx-Dashboard-Eintrag).
- Jeder deployte/installierte Stand: Version bumpen + versions.md-Zeile (§8).
- Neue dauerhafte Erkenntnisse sofort als Memory-Datei + Indexzeile.
- Bekannte Defekte sofort als `{ todo: true }`-Test mit der KORREKTEN Erwartung einfrieren.
- Bugs: erst superpowers:systematic-debugging. Fertigmeldungen: erst
  superpowers:verification-before-completion.
- Permission-Strategie nach §10: Hooks immer; Allowlist für Alltag; Auto Mode nur für
  autonome Loop-Sessions; bypassPermissions lokal nie.
- Subagent-Modell-Tiering: mechanisch → haiku/sonnet + niedriger Effort; urteilend →
  inherit; in Workflows Effort pro Stage steuern.
- Fragen nur an ENTSCHEIDUNGSPUNKTEN oder §9-Gates — sonst autonom.
