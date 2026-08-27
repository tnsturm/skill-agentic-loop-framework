# Changelog — agentic-loop-framework

## 0.1.33 (2026-08-27)

- **Neu: `MILESTONE-CYCLE.md` + `assets/milestone-cycle.svg`** — der Meilenstein-Zyklus als
  Ablaufgrafik mit Erklärtext. Acht Bänder von `triage-inbox` bis `milestone-checkpoint`; es ist
  die Detailansicht der Zeile „Milestone-Loop · Tage" aus `assets/struktur.svg`, wo der ganze
  Zyklus eine Zeile ist. Sichtbar gemacht wird vor allem die Stelle, die am leichtesten
  verwechselt wird: `/code-review medium` läuft **pro Task** innerhalb der Umsetzung, der
  Fan-out aus `/code-review xhigh` + `adversarial-reviewer` + bedingten Linsen läuft **einmal**
  auf dem Whole-Branch-Diff, und nur dort hängt ein Triage-Gate dran.

- **Die Grafik trägt ihre eigene Herkunft.** Der Ablauf ist über `templates/CLAUDE.md` §0/§4/§5/
  §7/§9/§11, die Linsen-Agents, `milestone-checkpoint` und die „Standing rules" in `SKILL.md`
  verteilt — die Datei enthält deshalb eine Mapping-Tabelle, die je Diagrammschritt die Quelle
  benennt, aus der er stammt. Bei Widerspruch gilt die Quelle, nicht das Bild. Dazu ein
  `Stand:`-Stempel im Kopf und ein „Pflege"-Abschnitt mit den vier Auslösern, die ein Nachziehen
  erzwingen.

  Anlass ist ein konkreter Verrottungsfall: `assets/struktur.svg` trägt seit 0.1.15 das
  Versionsschild `plugin.json · 0.1.15` — siebzehn Releases lang falsch, weil die Grafik keinen
  Gate-Hook hat und niemand sie nachzog. Ein Hook ist hier nicht möglich (das Repo installiert
  seine eigenen Templates nicht), deshalb ist die Regel prozedural verankert statt mechanisch.

- **`milestone-checkpoint` Schritt 7a nimmt die Grafik in die Spiegelung auf.** Berührt die Drift
  einen der gemappten CLAUDE.md-Abschnitte, einen Linsen-Agent, die Schrittfolge des Checkpoints
  oder eine im Bild sichtbare Standing rule, gehören SVG, Text, Mapping-Tabelle und Stempel in
  denselben Commit — und als eigene Zeile in die Abgleichstabelle, die 7a ohnehin verlangt.

- **README-Korrekturen, ausgelöst von genau dieser Regel.** Beide READMEs beschrieben den
  Milestone-Loop noch als „endet mit `/code-review` + explizitem Push-Gate" — seit 0.1.32 falsch,
  weil das Triage-Gate dazwischen liegt. Ebenfalls korrigiert: der Checkpoint hat neun Schritte,
  nicht acht (`/doctor` als Schritt 2 fehlte in der Aufzählung, seit er 0.1.30 dazukam).

- **`assets/struktur.svg` + `.en.svg` entrostet.** Vier Stellen waren nachweislich falsch: das
  Versionsschild (`0.1.15` → `0.1.33`), die Hook-Zahl im Homey-Modul (4 → 6), die
  Milestone-Loop-Zeile (`/code-review → §9-Gate → Checkpoint (8 Schritte)` → Fan-out, Triage und
  neun Schritte) und die Templates-Zeile, die `.claude/agents/` gar nicht kannte — die vier
  Linsen-Agents sind seit 0.1.28 dort und tauchten in der Grafik nie auf. Damit ist der Anlass
  für die Pflegeregel oben zugleich behoben.

- **Beide Sprachfassungen für den Zyklus.** `MILESTONE-CYCLE.en.md` +
  `assets/milestone-cycle.en.svg` liegen neben den deutschen Originalen; beide Fassungen
  verlinken einander im Kopf wie die READMEs. Der Zyklus ist damit die dritte bilinguale Einheit
  des Repos (nach README und Struktur-Grafik). Die Pflegeregel und Schritt 7a benennen
  ausdrücklich beide: eine Änderung, die nur eine Sprachfassung erreicht, ist ein Defekt und kein
  Backlog-Eintrag — sonst folgen die Leser der zwei Fassungen verschiedenen Abläufen. Die SVGs
  tragen zusätzlich ein `<title>`-Element als barrierefreie Beschreibung.

## 0.1.32 (2026-08-26)

- **Neue Review-Linse `adversarial-reviewer`** (templates/.claude/agents/): prüft den Diff
  gegnerisch — Grundannahme ist, dass der Code kaputt und unvalidiert ist und die Tests das
  Falsche prüfen. Anders als die drei bestehenden Linsen läuft sie in §9 **immer** mit, weil sie
  nicht an eine Diff-Eigenschaft gebunden ist, sondern die Gegenkalibrierung zu `/code-review`
  liefert: dieses findet wenige, hochsichere Funde, jene den anderen Rand — was erst unter
  ungünstigen Eingaben, Zeitpunkten oder Reihenfolgen auffällt.

  Zentral ist die **Beweislast statt Findepflicht**: ein Fund zählt nur mit Datei:Zeile, einem
  konkreten Repro-Szenario, der Begründung, warum kein vorhandener Test greift, und einem
  Fix-Ansatz; "kein Critical" ist ein zulässiges Ergebnis. Die naheliegende Formulierung
  ("finde mindestens einen kritischen Fehler") wurde bewusst verworfen — sie garantiert ein
  Ergebnis, nicht dessen Wahrheit, und die Triage-Kosten trägt der Mensch. Sicherheitsanalyse
  bleibt ausdrücklich bei `/security-review`.

  Modell `opus`, `effort: xhigh` — dieselbe Stufe, auf der `/code-review` den Whole-Branch-Review
  fährt, damit beide Linsen vergleichbar kalibriert sind; für Opus-Klasse-Modelle ist xhigh die
  beste Einstellung für Coding- und Agentic-Arbeit. Das ist die **einzige Ausnahme von der
  `model: inherit`-Regel für Review-Agents** (§11, dort als solche dokumentiert): diese Linse
  läuft bei *jedem* Whole-Branch-Review, und aus einer Workhorse-Session geerbt käme sie als
  schwacher Verifier auf einer Aufgabe an, für die es keinen zweiten Checker gibt — Rauschen
  statt Netz. Der Pin ist eine Untergrenze, kein Deckel. Der Prompt ist als Ziel plus Suchraum
  geschrieben statt als nummerierte Prüfliste, mit dem ausdrücklichen Hinweis, dass die
  Aufzählung ein Startpunkt und keine Checkliste ist. Sicherheitsvokabular meidet er bewusst:
  die Klassifikatoren der aktuellen Modellgeneration greifen bei Cybersecurity-Inhalten, und ein
  abgelehnter Lauf sähe wie ein leerer Review aus statt wie ein Fehler.

- **CLAUDE.md §9: Triage-Gate als eigener Schritt.** Aus "review, then ask" wird "review, triage,
  then ask". Neuer Schritt 2: Funde aller Linsen zusammenführen, als Artifact veröffentlichen und
  **anhalten**; der Mensch triagiert jeden Fund als `approved` / `rejected` / `deferred`, die
  freigegebenen landen in `docs/superpowers/reviews/<datum>-approved.md` mit dem geprüften
  `head`-SHA im Frontmatter — daran erkennt eine spätere Session, dass die Freigabe veraltet ist.
  Gefixt wird über `test-driven-development`, das Repro-Szenario ist der zuerst geschriebene
  Test. Dieses Gate ist der Grund, warum die Linsen paranoid sein dürfen: über die Relevanz
  entscheidet ein Mensch, nicht der Reviewer. Die bisherige Zwei-Optionen-Frage wird Schritt 3.

## 0.1.31 (2026-08-24)

- **Neuer Skill `claude-code-news-review`** (plugin/skills/claude-code-news-review/): wöchentliche
  Prüfung der Claude-Code-What's-New-Digests gegen drei Zielsysteme (globales Setup / Projekte /
  dieses Framework) mit committetem Ledger `reviews/whats-new-ledger.md` als Dedup-Marker — jeder
  Digest wird genau einmal geprüft. Interaktiv: Impact-Ranking + AskUserQuestion-Auswahl; headless
  (`-p`/Routine): nur Routing in Ledger/triage-inbox, keine Umsetzung. Der Ledger liegt bewusst
  AUSSERHALB von plugin/ (wird nicht mit dem Plugin ausgeliefert) und ist mit dem Prüfstand des
  Setup-Tunings vom 2026-08-23/24 vorbefüllt (geprüft bis 2026-w34 / v2.1.239; 2026-w31 = kein
  Digest). Wöchentlicher Trigger: `/schedule`-Routine oder lokaler Task mit
  `claude -p "/claude-code-news-review"` im Framework-Checkout.

## 0.1.30 (2026-08-24)

Herkunft: das Setup-Tuning-Checkpoint M9.0 im adoptierenden Projekt (VioletApp). Vier
Produktänderungen von Claude Code hatten das Framework überholt; die generischen Anteile davon
sind hier gespiegelt.

- **CLAUDE.md §10: drei Schichten → zwei.** Auto Mode ist seit v2.1.228 (v2.1.233 auf nativem
  Windows) Produkt-Default auf Pro/Max, damit verliert die kuratierte Allowlist ihren Hauptzweck
  (Prompts vermeiden) — sie dokumentiert nur noch Read-Only-Alltagsbefehle. Neu benannt sind die
  zwei Grenzen, die der Classifier **nicht selbst** aufheben kann und die **vor** ihm ausgewertet
  werden: `permissions.ask` (menschlicher Checkpoint, erzwingt immer einen Prompt) und
  `autoMode.hard_deny` (Prosa-Regeln). Wichtig und leicht falsch zu machen: `autoMode` liest der
  Classifier **nur** aus `~/.claude/settings.json`, nie aus der `.claude/settings.json` eines
  Repos, und die Listen nehmen Prosa statt Werkzeug-Muster — Repo-Grenzen gehören darum nach
  `permissions.ask`/`deny`. Fehlt `"$defaults"` im Array, ersetzt man die eingebaute
  Exfiltrations-Regel ersatzlos.
- **Neu: „Hook start conditions (`if` filters)" in §10** plus `if`-Filter in
  `templates/.claude/settings.json` (package-guard nur auf `**/package.json`, dashboard-guard nur
  auf `docs/dashboard/dashboard.html`). Zwei Regeln, damit das Netz dabei nicht leiser wird: der
  Filter muss eine echte **Obermenge** des Hook-Prädikats sein, und weil ein `if` genau EINE
  Permission-Regel trägt, wird der Hook je Tool-Namen einmal registriert (`Edit(…)` und
  `Write(…)`). **Bash-Gates bleiben bewusst ungefiltert:** eine Permission-Regel muss *jedes*
  Subkommando eines Compound-Kommandos treffen, also greift `Bash(git commit *)` bei
  `git add . && git commit -m …` nicht — das Gate wäre genau dort still abgeschaltet, wo es zählt.
- **`lib/log.js` schreibt `durationMs`** (aus `performance.now()`, in Node relativ zum
  Prozessstart — kein Eingriff an den Aufrufstellen nötig). Damit beantwortet die Checkpoint-Retro
  „was kostet das Gate-Netz pro Commit?" mit einer Zahl statt einem Gefühl; das Auswertungskommando
  in Schritt 5 gibt jetzt Blocks **und** den `durationMs`-Median je Hook aus.
- **Checkpoint-Skill: `/insights` als zweite Signalquelle der Workflow-Retro.** Der Nutzer tippt es
  zu Retro-Beginn (gleiches Muster wie `/doctor`); die Befunde werden mit dem lokalen Signal
  zusammengeführt und laufen durch EINE gemeinsame Impact-Gewichtung samt
  `AskUserQuestion`-Auswahl — kein eigener Analyse-Schritt, keine zweite Liste. Das **Delta**
  (in `/insights`, aber nicht im `FRICTION:`-Log) wird als Hinweis auf ungeloggte Reibungsklassen
  protokolliert.
- **Checkpoint-Skill Schritt 2 ist jetzt der `/doctor`-Lauf** statt `/fewer-permission-prompts`:
  dessen denial-basierter Permission-Check ersetzt die frühere Allowlist-Kuratierung, und der
  Vorschlag „Auto Mode als Default" wird angenommen statt abgelehnt (folgt aus §10).
- **§9 nennt native Worktrees zuerst** (`claude --worktree`, `EnterWorktree`, `/fork`) — nur der
  native Weg isoliert auch Bash/git vom Haupt-Checkout; `superpowers:using-git-worktrees` bleibt
  Fallback. Ebenfalls in §9: `/code-review` wird **nie ohne Level** aufgerufen, sonst erbt es
  sessionübergreifend das zuletzt getippte (`medium` Task, `xhigh` Branch, `ultra` +
  `/security-review high` bei eigenem Threat-Model).
- **§11 + Agent-Templates:** Review-/Security-Agents tragen `model: inherit` **und**
  `effort: high`. Neu als stehende Regel: **Implementer werden als
  `subagent_type: general-purpose` dispatcht, nie als `fork`** — `fork` (Elternkontext geerbt) ist
  inzwischen Agent-Tool-Default und zerstört genau den frischen Kontext, von dem
  `subagent-driven-development` lebt; der Skill selbst benennt keinen Typ. Für Review-Agents ist
  `fork` dagegen erwünscht. `CLAUDE_CODE_ENABLE_TODO_TOOLS=1` bewusst nicht setzen.

## 0.1.29 (2026-08-22)

Herkunft: ein Guard-Fehlalarm im adoptierenden Projekt (VioletApp, 2026-08-21). Eine Session
in Projekt A bearbeitete eine Datei in Repository B und wurde von A's `docs-header-guard`
blockiert — wegen einer Header-Konvention, die B gar nicht verwendet.

- **Neu: `lib/in-repo.js` mit `isInsideGuardedRepo(cwd, filePath)` — Guards wirken nur noch im
  bewachten Repository.** Alle Edit|Write-Guards entschieden allein am Pfad-String, ob eine
  Datei zu bewachen ist (`lib/`- oder `drivers/`-Segment irgendwo im Pfad, Basename
  `package.json`, Pfadende `docs/dashboard/dashboard.html`), und prüften nie, ob der
  aufgelöste absolute Pfad überhaupt innerhalb von `input.cwd` liegt. Jeder Fremdpfad mit
  passendem Segment galt damit als Projekt-Quelldatei — besonders tückisch bei
  `changelog-lang-guard`, der einen fremden Changelog gegen die **eigene**
  `.homeycompose/app.json`-Version prüfte, also zwei unabhängige Versionslinien verglich.
  Umgestellt: `control-bytes-guard`, `dashboard-guard` (templates) sowie `json-guard`,
  `changelog-lang-guard` (homey).
- **Grenze ist das Repository um `cwd`, nicht `cwd` selbst.** Ein reiner cwd-Vergleich hätte
  die Guards still abgeschaltet, sobald eine Session in einem **Unterverzeichnis** startet
  (`cwd = <repo>/sub/dir`, Datei `<repo>/lib/*.js`) — `compose-guard.js` dokumentiert genau
  diesen Fall seit je als real. Der Helper sucht darum den nächsten Vorfahren mit
  `.git`-Eintrag. Ein Worktree trägt `.git` als **Datei**, weshalb bloße Existenz genügt und
  ein Worktree sich selbst begrenzt statt seines umgebenden Checkouts.
- **Beide Seiten werden kanonisiert** (`fs.realpathSync.native`, mit Rückfall auf den längsten
  existierenden Vorfahren, damit ein `Write` auf eine noch nicht existente Datei funktioniert).
  Sonst hätten 8.3-Kurznamen (`TORSTE~1`) oder Junctions dieselbe Stelle unterschiedlich
  buchstabiert — und der Guard hätte eine echte Verletzung still übersprungen, also genau die
  Fehlerklasse reproduziert, die hier beseitigt wird. Groß-/Kleinschreibung und Separator-Stil
  deckt `path.win32.relative` bereits selbst ab (nachgemessen).
- **`control-bytes-guard.js`: toter `hook-log.jsonl`-Ausschluss entfernt.** Unerreichbar, weil
  `GUARDED_EXT` auf `.json` verankert ist und `.jsonl` deshalb nie matcht. Was die
  Telemetrie-Datei tatsächlich heraushält (die Endungsliste), steht jetzt als Kommentar dort
  und ist im Test festgenagelt, statt sich auf toten Code zu verlassen.
- **Bewusst nicht übernommen:** `compose-guard.js` bleibt unverändert — er rät nicht am Pfad,
  sondern verifiziert die Signatur eines generierten Manifests (Basename `app.json` **und** ein
  `.homeycompose/` im selben Verzeichnis); das ist eine plattformweite Wahrheit, und ein
  cwd-Containment würde seine bewusste Verankerung am Verzeichnis der Datei kaputt machen.
  `secrets-guard.js` ebenfalls unverändert: fail-closed vor Ergonomie — seine Regel für das
  bekannte Write-Passwort soll einen Leak in *jedes* Repo fangen.

## 0.1.28 (2026-08-21)

Herkunft: der neue native `/insights`-Report (Claude Code 2.1.220) über 33 Sessions eines
adoptierenden Projekts (VioletApp, 2026-06-24 bis 2026-08-17). Übernommen wurden nur Befunde,
die sich gegen das Repo verifizieren ließen — mehrere Report-Vorschläge waren im Framework
längst gelöst oder standen im Widerspruch zu §5/§9/§10 (siehe „Bewusst nicht übernommen").

- **`lib/log.js`: Telemetrie no-op'et unter node:test-Markern.** `NODE_TEST_CONTEXT`/
  `NODE_TEST_WORKER_ID` trägt jeder aus `node --test` gespawnte Hook-Prozess; `lib/spawn-env.js`
  strippt sie nur für absichtlich verschachtelte Suiten. Damit ist die Ledger-Pollution durch
  Hook-Tests strukturell zu, statt per Konvention: `HOOK_LOG_DISABLE` deckte nur Tests ab, die
  daran denken es zu setzen (im Ursprungs-Repo 4 von 14). Dort waren 434 von 449 `block`-Records
  Fixture-Records eines einzigen Hook-Tests — Schritt 5 des Checkpoints hätte daraus die
  häufigste Reibungsklasse abgeleitet. `decision` kennt jetzt zusätzlich `'skip'`.
- **Neu: `lib/env-ready.js` + `test-gate.js` unterscheidet „konnte nicht prüfen" von „Prüfung
  rot".** Ein Repo mit deklarierten, aber nicht installierten Dependencies ließ die Suite mit
  `MODULE_NOT_FOUND` scheitern — das las sich wie „Tests rot" und blockte jeden `git commit`.
  Im Ursprungs-Repo kostete das eine ganze Session (alle Git-Operationen von Hand, ein
  Release-Commit unterblieb dabei still). **Keine Abschwächung des Gates:** `test-gate.js`
  behandelte den Spawn-Fehler (`status === null`) schon als „nichts wurde geprüft → fail open";
  die Unterscheidung wird nur auf den zweiten, vor dem Spawn erkennbaren Fall ausgedehnt und
  beim Namen genannt („run npm ci").
- **Neu: `commit-msg-guard.js` (PreToolUse Bash|PowerShell).** Blockt ein `git commit -m`, dessen
  Message per Heredoc/PowerShell-Here-String gebaut wird, und verweist auf `git commit -F <file>`.
  Zweimal war der Delimiter selbst in die Message geleakt (`@`, `EOF`). Bewusst eng: getroffen
  wird nur eine Zeile, die ausschließlich aus einem Delimiter besteht (optional gefolgt vom
  schließenden Quote), plus die Heredoc-Einleitungen — `eslint@9` und das Wort EOF in Fließtext
  passieren, Heredocs außerhalb eines Commit-Kommandos ebenso.
- **Neu: `handoff-notice.js` (Stop).** Meldet Commits, die nur lokal existieren, einmal pro neuem
  HEAD (State-File merkt sich die gemeldete SHA, damit ein ungepushter Branch nicht bei jedem
  Turn-Ende feuert). `git log HEAD --not --remotes` deckt „kein Upstream" und „vor dem Upstream"
  in einem ab. Der Hook **pusht nicht** — §9 verlangt ein explizites Ja; der Report-Vorschlag
  „immer pushen bevor fertig gemeldet wird" wurde deshalb nicht übernommen, nur die Sichtbarkeit.
- **Neu: drei Review-Linsen** (`templates/.claude/agents/`): `runtime-resource-reviewer`,
  `api-contract-reviewer`, `cross-platform-reviewer`. Ohne `model:`-Feld — Review-Agents erben
  laut §11 die Session. Verdrahtet in §9 als paralleler Fan-out neben `/code-review`, nicht als
  neues autonomes Verhalten. Anlass: 16 Reibungsereignisse der Klasse „buggy_code" fielen erst
  beim manuellen Testen des Nutzers auf, alle drei in genau diesen Klassen.
- **CLAUDE.md §4**: Iterationsbudget (~10 Runden, dann `git bisect` statt weiterprobieren),
  Offenlegungspflicht für Fixes durch Unterdrückung statt Verstehen, CRLF-sichere Zähl-/
  Grep-Checks (eine still gezählte Null liest sich wie „sauber"), keine unbegrenzten
  `requestAnimationFrame`-/`setInterval`-Schleifen in generierten Visualisierungen.
- **CLAUDE.md §7**: jeder Bericht und Handover endet mit „verifiziert" vs. „angenommen".
- **milestone-checkpoint**: Schritt 5 zählt Hook-Blocks über ein deterministisches Kommando und
  prüft Blockspitzen zuerst gegen Testläufe; Schritt 7a spiegelt nur noch über eine
  `Repo | Pfad | Ist | Soll`-Tabelle vor UND nach dem Editieren (zweimal ging hier ein Teil
  verloren); der Bericht bekommt dieselbe Verifikationszeile.
- **homey/HOMEY.md**: generierte Store-Assets vor dem Commit in Zielgröße rendern und ansehen.

Bekannte Lücken / bewusst nicht übernommen:

- `templates/test/hooks/hook-log.test.js` **fehlt im Framework** — `lib/log.js` ist hier ohne
  eigenen Smoke-Test, obwohl der Ursprung ihn hat. Eigener Punkt für den nächsten Checkpoint.
- `stop-verify.js` bekam im Ursprungs-Repo dieselbe `env-ready`-Behandlung, existiert hier aber
  nicht — kein Port, nur diese Drift-Notiz.
- **Nicht übernommen: „Gates fail-soft machen"** (`|| exit 0`). Verstößt gegen §10 Layer 1 und §5
  („never weaken the hook"); es hätte das Release-Gate still deaktiviert — genau der Fehlermodus,
  den der Report beklagt. Die `env-ready`-Unterscheidung ist der korrekte Fix.
- **Nicht übernommen: pauschales `.gitattributes` für Zeilenenden** und ein eigener `/ship`-Skill
  (Release-Mechanik steht in §8/§9 + der Plattformdatei), sowie ein autonomer Lauf „ohne
  Bestätigung außer Publish" (widerspricht §9/§10).

## 0.1.27 (2026-08-21)

- **Dashboard-Template: Milestone-Karten sind aufklappbar.** Jede Karte ist jetzt ein
  `<details class="mcard">`; eingeklappt zeigt die `<summary>`-Zeile nur noch `Id · Titel`
  plus Status-Badge, alles Weitere (Summary, Steps, Metazeile, Modell-Empfehlung, Log,
  Start-Prompt) liegt dahinter. Default: `status: "active"` startet aufgeklappt, `done`
  und `todo` eingeklappt. Dazu ein „Expand all"/„Collapse all"-Schalter über der Liste.
  Grund: bei ~30 Milestones war die Liste nur noch scrollbar, nicht mehr überblickbar.
  Der bestehende innere `<details>` für den Start-Prompt bleibt unangetastet und wird vom
  Schalter nicht mitgeschaltet — die §7-Zusage „zeigt jeden Prompt in voller Länge" gilt
  unverändert, der Prompt liegt nur eine Ebene tiefer.
- Datenblock-Format unverändert — bestehende `dashboard.html`-Dateien brauchen keine
  Migration, nur den neuen Renderer.

## 0.1.26 (2026-08-21)

- **§0 names the plan-execution skill** (template CLAUDE.md): `subagent-driven-development`
  joins the always-on list as the standard path for executing a written plan, with
  `executing-plans` as the named exception for tasks that share toolchain state or one
  common error list (name which and why in the plan header). The vague
  "code-review/verification skills before completion" becomes the concrete
  `verification-before-completion`, with a pointer that code review itself runs through
  `/code-review` (§9). Origin: an audit of an adopting project (VioletApp) found that SDD
  was the de-facto implementation path for 17 of 19 plans and every dashboard resume prompt,
  yet was anchored nowhere in CLAUDE.md — it survived only in the plan headers that
  superpowers:writing-plans generates. A tersely worded resume prompt would have dropped it
  silently, since brainstorming and writing-plans were rule-backed but the implementation
  phase was not.
- **§11 "Flagship orchestration" stops paraphrasing SDD** (template CLAUDE.md): the section
  described decompose → delegate → parallelize → review-before-integrate in prose, i.e. a
  hand-maintained second copy of `subagent-driven-development` + `dispatching-parallel-agents`
  — and one missing the skills' per-task reviewer prompt and final whole-branch review. It now
  points at both skills and keeps only what is genuinely flagship-specific: the model choice
  per subagent (implementer vs. workhorse, reviewers at `model: inherit`).
- **SKILL.md standing rules** gain the matching one-liner next to the existing
  systematic-debugging / verification-before-completion bullet.
- Bumped `plugin.json` to 0.1.26 — it had been left at 0.1.22 while the changelog advanced to
  0.1.25, so this closes that drift too.

## 0.1.25 (2026-07-27)

- **§1 gains two brainstorming interview rules** (template CLAUDE.md): (a) *Hunt unknown
  unknowns* — during brainstorming, actively bring own domain knowledge and name risks,
  constraints, and pitfalls the user hasn't mentioned, instead of only extracting what
  they already know; (b) *Architecture changers first* — order clarifying questions by
  impact, architecture-changing questions before detail questions. Complements the
  superpowers:brainstorming skill, which already covers "explore context first" and
  "one question at a time" but has neither an unknown-unknowns hunt nor a question-
  ordering rule. Origin: a user-proposed interview prompt ("Before we build: find my
  unknown unknowns … interview me one question at a time, architecture changers first");
  the already-covered parts were deliberately NOT restated (per the CLAUDE.md head rule).

## 0.1.24 (2026-07-27)

- **§11 palette gains an *implementer* role (Claude Opus 5) + new "Flagship orchestration"
  section.** Milestone sessions still know only two tiers (workhorse/flagship) — the
  implementer is a delegation target *inside* flagship sessions: the flagship main loop
  acts as orchestrator (decompose, delegate implementation — implementer for complex/
  ambiguous work, workhorse for mechanical work — parallelize independent tasks, review
  every result; review subagents stay `model: inherit`). Deliberately a default, not a
  ban: trivial edits and short verifications stay in the orchestrator — for a one-line
  fix, handing over context costs more flagship tokens than the fix, and hard bans are
  exactly the over-prescriptiveness flagship models respond poorly to. The pattern lives
  in §11 as a standing rule, not in resume prompts (§7 keeps those goal + done condition).
  Origin: a user-proposed orchestrator prompt ("write no code yourself, hand each task to
  Opus 5 or Sonnet 5, review every result before the next step") — adopted with three
  fixes: no absolute self-execution ban, no forced sequencing of independent tasks, and
  scoped to flagship-worthy milestones only.

## 0.1.23 (2026-07-22)

- **CLAUDE.md §11 moves to a two-model palette (workhorse/flagship)** — a new "Current
  palette" line names the concrete models once (currently workhorse = Claude Sonnet 5,
  flagship = Claude Fable 5); all tier rules now reference the roles, so future model
  swaps are one-line edits. The former three-way milestone tiering (Haiku/Sonnet/Opus)
  collapses to two tiers with `effort` as the fine-grained dial ("effort before model
  switch; the model switch happens only at the judgment boundary"). Haiku leaves the
  subagent mechanical tier; `model: inherit` for checkers is unchanged and now explicitly
  notes that a flagship session's checker inheriting the flagship is intended. Two new
  §11 paragraphs: (a) security milestones stay on the flagship despite possible
  safety-classifier refusals on benign adversarial work (log as `FRICTION:`, rephrase,
  only drop the affected sub-step to the workhorse if it persists); (b) autonomous
  loops/scheduled routines default to the workhorse — flagship turns run minutes at
  flagship rates, which compounds unattended.
- **New §7 resume-prompt rule:** prompts state the goal and the machine-checkable done
  condition, never a step-by-step procedure — load-bearing for flagship sessions
  (over-prescriptive prompts measurably reduce flagship output quality), not just style.
- Bootstrap SKILL.md (Phase 4.3 + standing rules) rephrased to reference the §11 palette
  roles instead of hard-coded model names.
- **Migration note for adopting projects:** at the next milestone checkpoint, re-derive
  every open milestone's `recommendedModel` against the new palette (checkpoint step 8
  already covers the mechanics; this is a one-time full pass instead of only-new-entries).

## 0.1.22 (2026-07-21)

- **CLAUDE.md §9 is now "Branch Lifecycle"** — the former "Finishing a Branch" content becomes
  its second half ("Finishing: review, then ask", unchanged), and a new first half fixes the
  gap at the other end: **one worktree per session**. Milestone/feature sessions start in their
  own worktree via `superpowers:using-git-worktrees`; short read-only or single-file sessions
  stay in the primary checkout. Extracted from a VioletApp incident (2026-07-21): two agent
  sessions shared one working directory, so every commit had to be reasoned about against
  foreign changes in `git status`, and one session's `git push` shipped the other session's
  finished-but-unpushed commit that nobody had decided to release — git cannot arbitrate this,
  only isolation prevents it. Also adds the corollary for automations: a routine writing **only
  its own ledger file** commits directly on the main branch (its findings must be readable
  there — §7 has every new session read them first, and a PR queue hides them behind a merge
  nobody performs); anything beyond that ledger needs a branch and a PR.

## 0.1.21 (2026-07-21)

- **New generic hook: `control-bytes-guard`** — PostToolUse (Edit|Write) blocks a guarded
  text file (`.js`/`.json`/`.md`/`.html`/`.txt`) that contains a raw C0 control byte other
  than tab/LF/CR. Extracted from a VioletApp M7.0 workflow retro: a literal `\u`-escape the
  model intended as source text landed as a real control character instead, twice, each
  time caught by hand and fixed via a throwaway Node script. Added to
  `templates/.claude/hooks/` + `templates/test/hooks/`, wired into
  `templates/.claude/settings.json`. (VioletApp also built a `docs-header-guard` hook in the
  same retro, but that one stays project-local — it enforces a documenting-code skill's
  reference grammar that isn't part of this generic template.)

## 0.1.20 (2026-07-20)

- **Branch/worktree cleanup is now step 1 of `milestone-checkpoint`** instead of a
  free-floating "AKTION 1" paragraph duplicated into every checkpoint resume prompt in the
  dashboard. The instruction lived only in CLAUDE.md §7 point 4 ("first action — before the
  skill") and in the prompts; the skill itself never mentioned it, so any session that just
  ran `/milestone-checkpoint` silently skipped it. Former steps 1–8 renumbered to 2–9
  (framework reconciliation is now 7a/7b); CLAUDE.md §7 point 4 and the Phase-5 section of
  the bootstrap SKILL.md updated to match. Checkpoint resume prompts now only say "run
  /milestone-checkpoint — cleanup is its step 1".

## 0.1.19 (2026-07-20)

- **Extension Hygiene** — new CLAUDE.md §5 block covering third-party skills, agents, hooks and
  MCP servers, the sibling of the existing Dependency Hygiene rule. Motivated by two independent
  security labs (Reversec 06/2026, Datadog 05/2026) with working PoCs: skills exfiltrate
  credentials, and `` !`cmd` `` dynamic-context blocks execute during preprocessing — before the
  model can refuse. Skills also need no install step (a cloned repo's `.claude/skills/` loads on
  workspace trust).
- **Fixed an unreviewed third-party code path in our own checkpoint**: `milestone-checkpoint`
  step 3 / Pattern A used to `git pull` external skill repos and copy them into
  `~/.claude/skills/` automatically, explicitly "no confirmation needed". It now reviews the
  incoming diff against the §5 checklist (mechanical `grep` pre-filter for dynamic-context,
  `allowed-tools`, network, credential paths, `eval`/base64, postinstall) and blocks on any hit,
  leaving the older version in place. A stale skill beats an unreviewed one.
- `disableSkillShellExecution: true` added to `templates/.claude/settings.json`. Verified
  2026-07-20 that no framework template, no VioletApp skill, and no installed plugin skill body
  uses dynamic context, so this breaks nothing today; bundled/managed skills are out of scope
  per the docs.
- **Step 6 is now "Framework reconciliation"** with two directions: 6a the existing drift check
  (project → framework), 6b a new **native-feature review** (framework → platform) asking which
  of our own instructions/skills/hooks/agents Claude Code now does natively. Carried by a new
  ledger template `templates/docs/dashboard/native-feature-review.md`, seeded with today's
  verdicts (auto memory vs. our memory convention, `/code-review` vs. §9, etc.). Bias: keep
  mechanically-enforcing artifacts, retire prose rules the platform now satisfies by default.
  No step renumbering — 7 (dashboard) and 8 (handover) are unchanged.

## 0.1.18 (2026-07-15)

- Fixed a hook-telemetry pollution bug found live during VioletApp's M6.0 checkpoint
  workflow retro: hook test suites that spawn a hook subprocess without an isolated
  `cwd` cause the hook's own `input.cwd || process.cwd()` fallback to resolve to the
  REAL project repo, so every `logHook()` call in the test run writes a fake decision
  record into the real (gitignored) `hook-log.jsonl` — up to hundreds of entries per
  full test run for a hook with many block-path test cases. The M4.8 fixture-safety
  fix in `templates/.claude/hooks/lib/log.js` only covered an explicitly-undefined
  `cwd`, not this fallback case. Added a `HOOK_LOG_DISABLE` test-only env opt-out to
  `logHook()` (dev telemetry only — the block DECISION itself is unaffected either
  way) and wired it into all four hook-spawn call sites of
  `templates/test/hooks/package-guard.test.js` (its own helper functions plus two
  standalone `spawnSync` calls that bypassed them).
- `homey/README.md`: documented the `changelog-lang-guard` hook (installation table +
  Phase 3 add-on section) — the hook file and its test already shipped in
  `homey/hooks/`/`homey/test/hooks/` since 0.1.x, but the README never listed it, so a
  project bootstrapped from this module's Phase-1 instructions never actually adopted
  it. Found via a stale `loop-dev-roadmap` memory note in VioletApp, re-verified live.

## 0.1.17 (2026-07-14)

- Checkpoint naming convention renamed (mirror of VioletApp, 2026-07-14): between-milestone
  checkpoint entries are now `id: "Mx.0"`, `title: "Housekeeping Agentic Loop"` (previously
  `id: "→Mx"`, `title: "Zwischen-Check"`), and the implementation milestone a checkpoint
  gates is numbered `Mx.1`. Updated in `templates/CLAUDE.md` §7 point 4,
  `templates/.claude/skills/milestone-checkpoint/SKILL.md`, and this plugin's `SKILL.md`
  (Phases 5/7, standing rules). Historical `→Mx` mentions in code comments and old
  changelog entries are left as-is.
- New first checkpoint action (before running the milestone-checkpoint skill):
  branch/worktree cleanup — check locally and on origin for no-longer-needed branches
  and worktrees, show a short explanation per candidate, offer selectable deletion,
  then delete the selected branches (local + origin) and worktrees (git + disk).
  Anchored in `templates/CLAUDE.md` §7 point 4; projects add it as the first
  `steps[]` label ("Branch-/Worktree-Cleanup") and as ACTION 1 of their checkpoint
  resume prompts.

## 0.1.16 (2026-07-14)

- Hardened `parseInstallCommand` against two gate-bypasses found in the M5.9 security
  review: a leading `VAR=val` env-assignment prefix no longer hides an install from the
  parser (`CI=true npm i <fake>` is now caught), and `npx`/`npm exec` `-p`/`--package X`
  (and `--package=X`) now verify X — the package npx actually fetches and executes —
  instead of the command name. Ephemeral positional detection is per-segment.
- New `package-guard` PreToolUse hook (slopsquatting defense) — mirror of VioletApp M5.9:
  blocks agent-initiated npm installs (`npm install|i|add|exec`, `npx`, `yarn add`,
  `pnpm add`; Bash AND PowerShell) and `package.json` edits (all dep blocks incl.
  recursive `overrides` and `npm:` alias TARGETS) that name unverified packages —
  nonexistent on the registry, first published < 90 days ago, < 500 weekly downloads,
  or unverifiable (registry unreachable → fail CLOSED; harness-input parse errors fail
  open per house convention). Pure logic in `templates/.claude/hooks/lib/package-specs.js`
  (parse/resolve/diff/verdict, fully offline-testable), IO shell in
  `templates/.claude/hooks/package-guard.js`, tests with a local `node:http` stub registry
  in `templates/test/hooks/package-guard.test.js` (no real network). Registered in
  `templates/.claude/settings.json` (both PreToolUse matcher groups). New CLAUDE.md §5
  block "Dependency Hygiene": existence proof for new deps in specs/plans,
  `--ignore-scripts` for agent installs. Template divergence from the VioletApp origin
  (the only one, noted in both headers): `BLOCK_RUNTIME_DEPS = false` (generic projects
  have runtime deps; Violet freezes `dependencies` at `{}`). Origin: VioletApp M5.9
  threat model (STRIDE, SR-01..SR-10) + spec 2026-07-14.

## 0.1.15 (2026-07-13)

- Full English i18n of the plugin's German-language artifacts — the repo now ships in
  English throughout, except the intentionally bilingual German halves `README.md` and
  `assets/struktur.svg`. Translated: `SKILL.md` (body + frontmatter — also fixed a GitHub
  YAML error by single-quoting the `description`, whose unquoted `Trigger: ` colon was
  parsed as a mapping); the `plugin.json` + `.claude-plugin/marketplace.json` descriptions;
  the `templates/` tree (`CLAUDE.md` tail, `docs/dashboard/{triage-inbox,versions}.md`,
  `docs/dashboard/dashboard.html` UI strings + `lang`, `.claude/skills/milestone-checkpoint/SKILL.md`
  body); the `homey/` module (`HOMEY.md`, `README.md`, `agents/release-readiness.md`,
  `allowlist.json` comment); the previously-German 0.1.0–0.1.2 changelog entries below; and
  the German header comments across the gate/guard hooks, `lib/` helpers, and smoke tests.
  Added an English structure diagram `assets/struktur.en.svg` (referenced from `README.en.md`;
  the German `README.md` keeps `assets/struktur.svg`); both diagrams' `plugin.json` version
  label refreshed to 0.1.15. Where code was involved the change is
  comment/string-only — no hook logic, dashboard renderer logic, or `window.DASHBOARD_STATUS`
  structure was altered. Every substantive file was verified meaning-equivalent by a second
  bilingual instance; `dashboard.html`/`struktur.en.svg` additionally checked for
  structural/behavioral parity. Origin: user request 2026-07-13.

## 0.1.14 (2026-07-09)

- New dashboard field `recommendedModel: {model, effort, why}` on every open milestone —
  a per-milestone Claude model/reasoning-effort recommendation, distinct from §11's
  existing subagent tiering. `templates/docs/dashboard/dashboard.html` renders it (new
  `.modelrec` CSS class + renderer block, mirroring the `.cur`/currentActivity pattern).
  `CLAUDE.md` §11 renamed "Model Tiering (Subagents & Milestones)" with a new "Milestones
  (main-loop sessions)" subsection defining the tiering heuristic (mechanical/checklist →
  mid-tier low/medium; open design/research → mid-tier medium; high-stakes judgment calls,
  e.g. GO/NO-GO decisions, untested-crash-surface work, correctness-critical domain logic,
  or anything with its own threat-model → flagship model, high/xhigh). §7's field list and
  rules updated to require setting it at milestone-creation time. `milestone-checkpoint`
  SKILL.md step 7 now checks/sets it for every open milestone during the dashboard update,
  and step 8 (Handover) backfills it for the next milestone if missing before the push
  notification goes out. Origin: Violet Homey App session 2026-07-09 (user asked for a
  model/effort recommendation on every open milestone + for this to become standard
  practice for future milestones/projects).

- `SKILL.md` Phase 0 (Preflight) gains a GitHub-MCP-Server entry in the tool-check list:
  create a fine-grained PAT (direct link to
  https://github.com/settings/personal-access-tokens) scoped to Contents/Pull
  requests/Issues read-write, register it via `claude mcp add-json github '{"type":"http",
  "url":"https://api.githubcopilot.com/mcp","headers":{"Authorization":"Bearer
  YOUR_GITHUB_PAT"}}'`, then smoke-test with a real read call — "Connected" alone doesn't
  prove the token or session actually works (full pitfalls: milestone-checkpoint SKILL.md,
  step 2). Fallback: git/gh CLI, no bootstrap blocker.
- `templates/.claude/skills/milestone-checkpoint/SKILL.md` gets a much shorter "Step 0:
  Check the GitHub MCP connection" instead — just a connection + smoke-test check, pointing to
  the bootstrap skill's Phase 0 for actual setup. (Supersedes the full walkthrough
  mistakenly added there in an unpublished 0.1.13 draft — moved to the right place.)

## 0.1.12 (2026-07-09)

- `templates/.claude/skills/milestone-checkpoint/SKILL.md` step 2, MCP-server handling
  extended with three gotchas learned verifying a standalone GitHub MCP server
  end-to-end: **(1)** `claude mcp add` defaults to `--scope local` (bound to whatever
  directory the command ran in) — use `--scope user` for cross-project availability.
  **(2)** A newly connected server's tools do NOT load into an already-running session
  even once `claude mcp get <name>` shows "Connected" — only a fresh session picks them
  up via `ToolSearch`. **(3)** "Connected" only proves the handshake, not that the token
  can do anything: a fine-grained PAT with no repo access 404s on every repo call; one
  with read-only access 403s on write calls (`create_branch`, `push_files`, …) —
  `get_me` succeeds in both broken states, so it's not a reliable health check. Verified
  live end-to-end: created a local branch + commit, pushed it via `push_files`, confirmed
  the commit on GitHub via `get_commit`, then cleaned up both sides. Documents the
  required repo permissions for the GitHub MCP server: Contents (R/W), Pull requests
  (R/W), Issues (R/W).

## 0.1.11 (2026-07-09)

- `templates/.claude/skills/milestone-checkpoint/SKILL.md` step 2, MCP-server handling
  refined: a recommender hit for `plugin:<category>:<name>` (e.g. `plugin:engineering:github`)
  is a role-based **Cowork plugin bundle** — its auth/activation only goes through Cowork's
  own settings (`setup-cowork`/`cowork-plugin-management` skills), never through
  `claude plugin`/`claude mcp` from inside a session; document + point the user there
  instead of attempting it. Separately, a standalone plugin with a plain name in the
  `claude-plugins-official` marketplace manifest (verified locally: `github` exists there,
  independent of the Cowork bundle) IS directly installable via `claude plugin install
  <name>` — the install itself needs no OAuth, but the MCP server behind it can still need
  its own auth step afterward (check `claude mcp list`, report "Failed to connect" honestly
  rather than assuming success). Learned live: `plugin:engineering:github` couldn't be
  toggled from a session, but `claude plugin install github` (the standalone marketplace
  plugin) worked immediately.

## 0.1.10 (2026-07-09)

- `homey/hooks/release-gate.js` + `homey/test/hooks/release-gate.test.js` (13 tests) —
  ports VioletApp's `.claude/hooks/release-gate.js` (blocks `homey app install|publish`
  on an incomplete release checklist), reusing the shared `lib/changelog.js` completeness
  check. One part genericized: VioletApp's credential-rotation check (part c) is
  unconditional (it always manages a device credential); the generic version only
  enforces it once a `docs/superpowers/security/credential-rotation.md` already exists,
  so apps without device credentials are never forced to create one. README updated
  (install table + Phase-3 hook list) to document the new hook and the genericization.
  Verified against a simulated merged install of templates/+homey/.

## 0.1.9 (2026-07-09)

- `homey/test/hooks/secrets-guard.test.js` (9 tests) — ported from VioletApp's
  test/hooks/secrets-guard.test.js, updated for the one intentional drift between the
  two hooks: the known-secret env var is `DEVICE_WRITE_PASSWORD` here, not
  `VIOLET_WRITE_PASSWORD` (already genericized in homey/hooks/secrets-guard.js itself).
  No other logic drift found. Verified against a simulated merged install of
  templates/+homey/. All 4 pre-existing homey hooks now have smoke-test coverage.

## 0.1.8 (2026-07-09)

- `homey/test/hooks/json-guard.test.js` (5 tests) — ported unchanged (besides the HOOK
  location) from VioletApp's test/hooks/json-guard.test.js. No logic drift found between
  the VioletApp and homey/ generic hook. Verified against a simulated merged install of
  templates/+homey/.

## 0.1.7 (2026-07-09)

- `homey/test/hooks/compose-guard.test.js` (16 tests) — ported from VioletApp's
  test/hooks/compose-guard.test.js (path unchanged apart from the HOOK location and one
  example filename genericized: lib/VioletClient.js → lib/DeviceClient.js). No logic
  drift found between the VioletApp and homey/ hook. Verified against a simulated
  merged install of templates/+homey/.

## 0.1.6 (2026-07-09)

- `homey/test/hooks/check-version-sync.test.js` (7 tests) — first smoke test for this
  hook; no VioletApp test/hooks/check-version-sync.test.js exists to port from, so this
  was written directly against homey/hooks/check-version-sync.js, mirroring the sibling
  hook tests' style. Verified against a simulated merged install of templates/+homey/.

## 0.1.5 (2026-07-09)

- `homey/hooks/changelog-lang-guard.js` + `homey/hooks/lib/changelog.js` (shared with a
  future release-gate-equivalent hook in this module) + `homey/test/hooks/changelog-lang-guard.test.js`
  (6 tests, verified against a simulated merged install of templates/+homey/) — mirrors
  VioletApp's edit-time changelog-completeness guard. First smoke test to ship under
  `homey/test/hooks/` (the 4 pre-existing homey hooks — check-version-sync, compose-guard,
  json-guard, secrets-guard — still have none; flagged as a follow-up, not fixed here).

## 0.1.4 (2026-07-09)

- `templates/.claude/skills/milestone-checkpoint/SKILL.md`: new step 2 — the
  `/claude-automation-recommender` output (read-only by design) is now summarized as a
  short numbered list and offered back via `AskUserQuestion` (multiSelect) for direct
  same-session implementation (Hook → same pattern as step 4 with a smoke test; MCP
  server → `claude mcp add` if addable without OAuth, else just register + point the
  user at the auth step; Skill/Subagent → file + smoke-test; Plugin → only after
  explicit consent). Deselected recommendations get a one-line note in the `→Mx` log
  instead of silently disappearing. Source: VioletApp →M5-checkpoint follow-up request.

## 0.1.3 (2026-07-09)

- `templates/.claude/hooks/dashboard-guard.js` + `templates/test/hooks/dashboard-guard.test.js`
  (5 Tests), wired into `templates/.claude/settings.json` PostToolUse Edit|Write — validates
  the `window.DASHBOARD_STATUS` data block (`script#status-data`) via a sandboxed `vm` eval
  after every edit to `docs/dashboard/dashboard.html`, blocking (exit 2) on a syntax error the
  same way `test-gate.js` blocks a red suite. Closes a gap a plain JSON guard can't cover
  (the data block is a JS object literal embedded in HTML). Source: VioletApp →M5-Checkpoint
  workflow retro (step 4) — the same smart-quote delimiter bug class hit `dashboard.html`
  a 4th time, previously only flagged, never codified into a hook.

## 0.1.2 (2026-07-09)

- README substantially expanded (de) + new `README.en.md` (en): what the framework does
  (the four verification loops), structure diagram (`assets/struktur.svg`), installation
  (incl. note: marketplace add accepts the GitHub shorthand, git URLs, and local paths)
  and the copy-paste initiation prompt (with and without plugin installation).

## 0.1.1 (2026-07-09)

- Removed the seed prompts from the settings repo (user decision): this repo is the ONLY
  living source; seed references in SKILL.md/README switched to the git history
  (`skill-ClaudeCode-general-settings@fcbda47`).
- README: entry line for bootstrapping WITHOUT plugin installation (clone the repo → point
  the session at the SKILL.md) — replaces the copy-paste use case of the old seed prompts.

## 0.1.0 (2026-07-09)

Initial extraction from the VioletApp project (M0–M4.8), milestone M4.9 of the
loop-hardening series. Sources per artifact:

- `SKILL.md` ← `skill-ClaudeCode-general-settings/prompts/agentic-loop-bootstrap.de.md`
  (as of 2026-07-07), generalized from a copy-paste prompt into a skill guide; the phases
  now reference the bundled `templates/` tree.
- `templates/CLAUDE.md` ← VioletApp `CLAUDE.md` (§0–§11; Karpathy core §1–§4 via
  github.com/multica-ai/andrej-karpathy-skills; §7 incl. the FRICTION + triage-inbox rule
  from M4.8; §10 permission strategy; §11 subagent tiering), project extensions →
  placeholders.
- `templates/docs/dashboard/dashboard.html` ← VioletApp dashboard (renderer 1:1,
  data block emptied); `versions.md` and `triage-inbox.md` skeletons ← M4.8 formats.
- `templates/.claude/settings.json` ← VioletApp scaffold, reduced to be platform-free
  (matcher lesson M4.6: `Bash|PowerShell`).
- `templates/.claude/hooks/test-gate.js` ← VioletApp M4.6 (incl. the NODE_TEST_CONTEXT lesson);
  `lib/log.js` + `lib/spawn-env.js` ← M4.8 (telemetry, explicit cwd);
  `test/hooks/test-gate.test.js` ← M4.6 smoke-test pattern.
- `templates/.claude/skills/milestone-checkpoint/SKILL.md` ← VioletApp state after M4.8/M4.9
  (steps: retro with hook-log signal, memory consolidation, framework-drift check,
  handover); skill-sources section → placeholder.
- `homey/` ← VioletApp: `HOMEY.md`, guard hooks `compose-guard`/`json-guard`/
  `check-version-sync`/`secrets-guard` (M3–M4.5; secrets-guard phrased app-neutrally,
  env `DEVICE_WRITE_PASSWORD`), Homey allowlist block, `release-readiness` subagent
  (M4 state + M4.7 live-smoke point as a project-specific pattern + M4.8 triage line);
  `README.md` ← bootstrap prompt B as the install guide.
