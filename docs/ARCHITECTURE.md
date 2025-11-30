# Arkitektur

Denne filen beskriver den tekniske arkitekturen til julekalender-prosjektet.

## TL;DR – mental modell

- **Router** tolker hash-URL (`/#/` og `/#/d/<id>`).
- **Data-lag** henter `calendar.json` og bygger mediestier.
- **Views** renderer kalender-grid og dagvisning.
- **main.js** koordinerer ruting, state og rendering.

## Arkitekturoversikt

Prosjektet er en modulær, statisk app uten rammeverk. Hver fil har tydelig ansvar:

- **Model/Data**: `data-loader.js` (fetch + URL-bygger) og `state.js` (app-state + lagring).
- **View**: `view-calendar-grid.js` og `view-day.js` håndterer DOM-rendering.
- **Controller**: `main.js` og `router.js` koordinerer ruter, state og callbacks.

Prinsipper:
- Statisk hosting, ingen backend.
- Ingen eksterne dependencies/build-verktøy.
- Hash-routing for delbare URL-er.
- localStorage for å lagre åpne luker.

## Komponenter

### main.js
**Rolle**: entry point og koordinator.

**Ansvar**:
- Initialisere router og state.
- Håndtere ruteendringer og laste data.
- Kalle riktig view med callbacks.

### router.js
**Rolle**: hash-basert ruting.

**Ansvar**:
- Lytte på `hashchange`.
- Parse hash til `Route`.
- Oppdatere hash ved navigasjon.

**Route-typer**:
```javascript
type Route =
  | { type: "root" }
  | { type: "day"; id: string };
```

URL-eksempler:
- `/#/` → root/grid
- `/#/d/01` → dag 01

### state.js
**Rolle**: runtime-state og persistens.

**Ansvar**:
- Holde `AppState` i minne (nåværende dag, kalenderdata).
- Lese/lagre åpne luker i localStorage.
- Gi helpers for å oppdatere state kontrollert.

**AppState**:
```javascript
type AppState = {
  calendar: CalendarData | null;
  currentDayId: string | null;
  openedDayIds: Set<string>;
  previewMode: boolean;
};
```

### data-loader.js
**Rolle**: hente data og bygge stier.

**Ansvar**:
- `loadCalendar()` → fetch `data/calendar.json`.
- `getMediaUrl(path)` → prefiks for alle mediafiler.
- Feilhåndtering for manglende filer.

### utils.js
**Rolle**: små, rene helpers.

**Ansvar**:
- `isDayAvailable(day, { now, preview })` – ett sted for låse-logikk.
- Evt. formateringsfunksjoner (dato/klokkeslett) for UI.

### view-calendar-grid.js
**Rolle**: vise kalendergrid.

**Ansvar**:
- Renderer kort for hver dag (åpen/låst status).
- Viser cover/teaser/nummer.
- Kaller `onDaySelected(id)` callback ved klikk.

### view-day.js
**Rolle**: vise innhold for én dag.

**Ansvar**:
- Renderer tittel, dato, tekst og media.
- Viser status (låst/åpen) og knapp for å åpne om tilgjengelig.
- Kaller callbacks for navigasjon (tilbake) og markering av åpning.

## Dataflyt

1. **Oppstart**: `main.init()` → start router.
2. **Root-rute**: `loadCalendar()` hentes; `view-calendar-grid` renderer med låste/åpne statuser.
3. **Dag-rute**: `state` oppdateres med valgt dag → `view-day` renderer:
   - Sjekker tilgjengelighet (`openAt` vs. nå/preview).
   - Viser innhold eller låst tilstand.
   - Ved åpning: marker dag som åpnet i state + localStorage.
4. **Navigasjon**: Views kaller callbacks → `main` oppdaterer state og hash.

## Routing

- Root: `/#/`
- Dag: `/#/d/<id>`

Parsing og bygging av hash gjøres kun i `router.js`.

## Filstruktur

```
/julekalender/
  index.html
  /assets/css/main.css
  /assets/js/
    main.js
    router.js
    state.js
    data-loader.js
    utils.js
    view-calendar-grid.js
    view-day.js
  /assets/media/days/<id>/*
  /data/calendar.json
```

## Designvalg

- **Hash-routing**: fungerer uten serverkonfig; lett å dele lenker.
- **localStorage**: enkelt og offline-vennlig for å lagre åpne luker.
- **Modulær struktur**: klar separasjon gjør kode lett å vedlikeholde og utvide.
- **Ingen build**: kort feedback-loop, enkel hosting (GitHub Pages el.l.).

## Vedlikeholdstips

- Splitt opp filer som vokser over ~400–500 linjer.
- Hold helpers “rene” (pure) der det er mulig.
- Dokumenter nye patterns i disse filene når de etableres.
- Views skal ikke ha egen datahenting eller direkte localStorage-tilgang.
