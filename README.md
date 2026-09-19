# Approximation von Differentialgleichungen

Eine statische Website für ein schulisches Mathematikprojekt: Grundlagen lesen,
numerische Verfahren am harmonischen Oszillator ausprobieren und später Poster
und Skript herunterladen. Oberfläche und Dokumentation sind auf Deutsch.

## Technik und Voraussetzungen

Astro erstellt statische HTML-Seiten. TypeScript enthält die Mathematik, React
steuert ausschließlich die interaktive Simulation. KaTeX rendert Formeln beim
Build; Plotly.js zeichnet Diagramme im Browser. Vitest prüft die Mathematik.
Kein Backend und keine Datenbank. Node.js 24 LTS und npm werden nur für Entwicklung
und Build benötigt. TypeScript 6 ist die aktuelle von Astro Check unterstützte Version.

## Lokal starten

```bash
git clone https://github.com/XynoxiCollaborations/xynoxicollaborations.github.io.git
cd xynoxicollaborations.github.io
git lfs install
git lfs pull
npm ci
npm run dev
```

Die Adresse steht im Terminal (normalerweise http://localhost:4321).
Auch `npm install` funktioniert; für unveränderte Abhängigkeiten ist `npm ci`
vorzuziehen. Nach Änderungen an Abhängigkeiten die `package-lock.json` mit versionieren.

```bash
npm run check       # Astro- und TypeScript-Prüfung
npm test            # alle Tests einmal ausführen
npm run test:run     # identisch zu npm test
npm run test:watch   # Tests während der Entwicklung
npm run build       # statische Dateien in dist/
npm run preview     # Produktionsbuild lokal ansehen
```

## Projektstruktur

```text
src/
  pages/                  Startseite, theorie, simulationen
  layouts/                gemeinsames HTML-Grundgerüst
  components/             Navigation, Downloadkarte, KaTeX-Formel
    simulations/          React-Steuerung und Diagrammkomponenten
  math/
    types.ts              Schnittstellen und Zustände
    integrate.ts          Zeitraster und Eingabeprüfung
    mechanics.ts          mechanische Zustände und Umwandlung in erste Ordnung
    methods/              Euler, Euler-Cromer, Heun, RK4, Leapfrog
    systems/              Oszillator und analytische Lösung
  simulation/             Berechnung und Vergleich der Simulationsdaten
  visualization/          Umwandlung der Daten in Plotly-Traces
  lib/                    zentrale Pfadfunktion
  styles/                 globale Gestaltung und CSS-Variablen
tests/math/               mathematische Tests
public/downloads/         spätere PDF-Dateien
public/images/            statische Bilder
.github/workflows/        PR-Prüfung und Pages-Deployment
```

`index.md` und `CNAME` aus dem ursprünglichen Repository bleiben unverändert.
Astro baut die Seiten aus `src/pages/`; die alte Markdown-Datei ist keine aktive
Startseite. Die vorhandene Root-CNAME nennt `simplemath.ch`. Der neue Build
aktiviert diese Domain nicht eigenständig; maßgeblich sind die Pages-Einstellungen.

## Inhalte bearbeiten

Texte direkt in `src/pages/*.astro` ändern. Für weitere Formeln die Verwendung von
`MathFormula` in `theorie.astro` kopieren. KaTeX-CSS und Schriften werden lokal
gebündelt; ungültige Formeln lassen den Build fehlschlagen. Farben, Abstände und
Inhaltsbreite stehen in `src/styles/variables.css`.

Die PDFs liegen in `public/downloads/`: `poster_print.pdf`, `poster_digital.pdf`
und `script.pdf`. Aktuell enthalten sie zum Funktionstest nur ihren Dateinamen.
Später durch die endgültigen Dokumente ersetzen und den Testhinweis auf der Startseite
entfernen. Die Posterkarte öffnet per Klick, Tastatur oder Mauszeiger ein Menü;
das Skript erhält einen direkten Downloadlink. Die Beschriftungen sind auf Deutsch.
Fehlende Dateien erhalten einen Hinweis ohne kaputten Link. Der Build bricht bei
einem LFS-Zeiger anstelle eines PDFs ab, damit keine defekten Downloads veröffentlicht werden.

Der gesamte Downloadordner (auch Unterordner und README) wird über die Regel in
`.gitattributes` mit Git LFS verwaltet. Git LFS muss lokal installiert sein.
Nach dem Klonen `git lfs install` und `git lfs pull` ausführen; beim normalen
`git add`, Commit und Push übernimmt LFS die Dokumente. Beide Workflows verwenden
`lfs: true` beim Checkout und veröffentlichen die echten Dateien im statischen Build.
Die bisherigen Dateien werden ohne Umschreiben der Git-Historie auf LFS umgestellt.
Bei neuen Rechnern ist die lokale LFS-Einrichtung erneut erforderlich.

## Mathematik und Erweiterungen

Allgemeine Systeme erster Ordnung implementieren `ODESystem.derivative(t, state)`.
Euler, Heun und RK4 erhalten System, Anfangszustand und `IntegrationOptions`.
Mechanische Systeme implementieren `MechanicalSystem.acceleration(t, position)`
für q'' = a(t,q), **ohne Geschwindigkeitsabhängigkeit**. Euler-Cromer und Leapfrog
erhalten getrennte Positions- und Geschwindigkeitsvektoren. `asFirstOrder` macht
ein solches System für die allgemeinen Solver zugänglich.

Alle Solver liefern `{ t, state }[]` inklusive Anfangswert. Mechanische Zustände
sind `[q1, …, qN, v1, …, vN]`. Leapfrog verwendet Kick-Drift-Kick (Velocity Verlet);
gespeicherte Geschwindigkeiten gehören zum vollen Zeitpunkt. Der letzte Schritt
wird bei Bedarf verkürzt. Maximal 100 000 Schritte sind erlaubt. Nichtendliche Werte
und ungültige Dimensionen werden abgewiesen. Bei einem verkürzten letzten Schritt
sollte man keine globalen Energieeigenschaften einer konstanten Schrittweite voraussetzen.

Die erste Simulation setzt D = 1 N/m, m = 1 kg, t₀ = 0 und keine Reibung voraus.
Verglichen wird der absolute **Positionsfehler an denselben Stützstellen**, nicht
der Fehler des vollständigen Zustands. Plotly verbindet die Punkte linear.
Die Regler steuern h (0.01–0.50 s) und N (10–1000 ganze Schritte); T = N · h.
Diese Grenzen sind in `src/simulation/comparison.ts` anpassbar. Änderungen an
Reglern, Methode und gültigen Anfangswerten werden sofort berechnet. „Alle Verfahren“
zeichnet alle fünf Näherungen und ihre Fehler mit konsistenten Farben. Die Checkbox
blendet ausschließlich die exakte Kurve aus; die Fehlerberechnung bleibt erhalten.
Mit „exakt“ ist die analytische Lösung gemeint. Instabilität wird nicht künstlich korrigiert.
Bei stark wachsendem Euler-Fehler kann die gemeinsame Achse die anderen Kurven
zusammendrücken; dann ein einzelnes Verfahren auswählen oder hineinzoomen.

Das Design ist Mobile First mit dunkelgrauem Hintergrund und Primärfarbe `#69d2f5`.
Alle Oberflächen-, Text-, Akzent- und Verfahrensfarben stehen in
`src/styles/variables.css`. Plotly liest dieselben Variablen beim Zeichnen.

### Ein weiteres Verfahren hinzufügen

1. Eine reine TypeScript-Datei in `src/math/methods/` anlegen.
2. Die passende allgemeine oder mechanische Schnittstelle verwenden; Voraussetzungen dokumentieren.
3. Manuell überprüfbare Schritte und Genauigkeit in `tests/math/` testen.
4. Name und Solver-Auswahl in `src/simulation/oscillator.ts` ergänzen und eine
   `--method-NAME`-Farbe in `variables.css` definieren. Formular und Vergleich
   übernehmen das neue Verfahren automatisch.

### Ein weiteres Gleichungssystem hinzufügen

1. Ableitung oder Beschleunigung in `src/math/systems/` implementieren.
2. Falls bekannt, die analytische Lösung separat ergänzen und testen.
3. Ein Datenmodul in `src/simulation/` für Parameter und Fehlervergleich erstellen.
4. Steuerung und Visualisierung anschließen. Ohne exakte Lösung keinen vermeintlich
   exakten Fehler anzeigen. Geschwindigkeitsabhängige Kräfte dürfen nicht unverändert
   mit den hier implementierten mechanischen Solvern gelöst werden.

## GitHub Pages und CI

In **Settings → Pages → Build and deployment → Source** die Option **GitHub Actions**
auswählen. Actions müssen erlaubt sein. Änderungen auf `main`, einschließlich
gemergter PRs, lösen `deploy.yml` aus. Manuelles Starten ist ebenfalls möglich,
aber auf `main` beschränkt.

Die offizielle Astro-Action führt zunächst `npm install` aus. Unser Build-Befehl
weist Lockfile-Änderungen zurück und installiert ausdrücklich erneut mit `npm ci`,
führt Check, Tests und Build aus und lädt das Pages-Artefakt hoch. Nur der Deployment-Job
erhält `pages: write` und `id-token: write` und nutzt die Umgebung `github-pages`.
PRs verwenden ausschließlich `ci.yml`: Installation, Check, Tests und Build ohne
Deployment. Optional diese Prüfung in einer Branch Protection Rule verpflichtend machen.

`actions/configure-pages` ermittelt die tatsächliche Pages-URL. `PAGES_URL` wird
zentral in `astro.config.mjs` in `site` und `base` aufgeteilt. Links verwenden
`sitePath`; damit funktionieren sowohl `/REPOSITORY/` als auch die Domainwurzel.
Lokal wird ohne `PAGES_URL` die Wurzel `/` verwendet. Unterpfad testen (PowerShell):

```powershell
$env:PAGES_URL = 'https://username.github.io/repository/'
npm run build
npm run preview
Remove-Item Env:PAGES_URL
```

Das vorhandene Remote ist ein Organisations-Repository mit `.github.io`-Namen;
ohne Custom Domain verwendet es bereits einen Wurzelpfad. `dist/`, `.astro/` und
`node_modules/` gehören nicht in Git; das Lockfile muss eingecheckt werden.

### Eigene Domain

1. Die gewünschte Domain in **Settings → Pages → Custom domain** setzen.
   `simplemath.ch` steht bereits in der ursprünglichen CNAME-Datei; Eigentümerschaft
   und DNS wurden hier nicht geprüft.
2. Beim DNS-Anbieter die von GitHub dokumentierten Records einrichten und die
   Domain möglichst verifizieren; anschließend HTTPS aktivieren.
3. Falls eine CNAME-Datei im Artefakt gewünscht ist, die echte Domain in
   `public/CNAME` eintragen (bei Weiterverwendung die vorhandene Datei kopieren).
4. Deployment erneut ausführen. Die neue URL wird automatisch übernommen und der
   Unterpfad entfällt. Komponenten müssen nicht einzeln geändert werden.

Offizielle Anleitungen: [Astro auf GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
und [eigene Domain bei GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
