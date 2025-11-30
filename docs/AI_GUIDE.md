# AI Guide – Start her før implementering

Dette dokumentet gir en rask oversikt over hvordan du skal jobbe med julekalender-prosjektet. Les dette først, og bruk lenkene videre for detaljer.

## 🎯 Hva er prosjektet?

Et statisk nettsted som viser en julekalender: et grid med luker (typisk 1–24) som åpnes etter en gitt dato (`openAt`). Hver luke kan inneholde tekst, bilde/media og en lenke/CTA. Ingen build-verktøy eller eksterne dependencies.

## 📋 Hvor starter jeg?

1. **Les [ROADMAP.md](./ROADMAP.md)** – rekkefølgen på oppgaver.
2. **Sjekk [IMPLEMENTATION.md](./IMPLEMENTATION.md)** – funksjonssignaturer og patterns.
3. **Bruk [ARCHITECTURE.md](./ARCHITECTURE.md)** – modulansvar og dataflyt.
4. **Se [CSS_GUIDELINES.md](./CSS_GUIDELINES.md)** – tokens, BEM og layout.
5. **Følg [DATA_FORMAT.md](./DATA_FORMAT.md)** – hvordan `calendar.json` og asset-stier skal se ut.

## ⚠️ Kritiske regler

- **Modulgrenser**: `main.js` koordinerer, views renderer, `data-loader.js` henter data, `state.js` lagrer fremdrift. Ikke bland ansvar.
- **BEM-navn**: bruk `block__element--modifier` (f.eks. `.calendar-grid__card`). Ingen ad-hoc klassenavn.
- **Låse-logikk**: én helper for å avgjøre om en luke er låst (`openAt`, evt. preview/override). Ikke spre dato-sjekk i flere filer.
- **URL-bygging**: bruk helper fra `data-loader.js` (`getMediaUrl`) for alle bilder/media, ikke hardkod stier.
- **State**: lagret fremdrift i localStorage skal håndteres via `state.js` (sett/les åpne luker). Views skal ikke skrive direkte.

## 🗺️ Dokumentoversikt

| Fil | Bruk når du trenger... |
|-----|------------------------|
| **[ROADMAP.md](./ROADMAP.md)** | Rekkefølge på oppgaver og milepæler |
| **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** | Signaturer, helpers og kode-patterns |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Modulansvar, dataflyt, ruting |
| **[CSS_GUIDELINES.md](./CSS_GUIDELINES.md)** | Tokens, BEM, komponent- og layoutmønstre |
| **[DATA_FORMAT.md](./DATA_FORMAT.md)** | Struktur på `calendar.json` og filstier for media |
| **[README.md](./README.md)** | Overordnet prosjektbeskrivelse og bruk |

## 🚀 Arbeidsflyt

1. Velg neste punkt i ROADMAP, les målet.
2. Slå opp relevante signaturer i IMPLEMENTATION og UI-klasser i CSS_GUIDELINES.
3. Implementer i korrekt modul. Hold ansvar rent.
4. Test i nettleser der ROADMAP ber om det (🌐).
5. Oppdater ROADMAP (avkryss) når oppgaven er ferdig.

## 🔍 Rask referanse

- **Er en luke åpen?** → `isDayAvailable(day, now, previewMode)` i IMPLEMENTATION/`state.js`.
- **Hvordan hente data?** → `loadCalendar()` i `data-loader.js`.
- **Hvilken hash brukes?** → `/#/` for grid, `/#/d/<id>` for dag.
- **Hvor lagres fremdrift?** → localStorage-key i `state.js` (se IMPLEMENTATION).
- **Hvilke klassenavn?** → seksjonen “Komponenter” i CSS_GUIDELINES.

## ⚡ Påminnelser

- Ikke finn opp nye patterns uten å oppdatere docs.
- Ikke hardkod datoer eller ID-er i views; alt kommer fra data.
- Bevar modulgrenser: views kaller callbacks, `main.js` eier URL/state.
- Hold nye funksjoner korte og beskrivende; kommenter kun det som er uklart.

Start med [ROADMAP.md](./ROADMAP.md) og arbeid i rekkefølge.
