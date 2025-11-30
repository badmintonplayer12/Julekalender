# Julekalender

Et enkelt, statisk nettsted for å presentere en julekalender med daglige luker som åpnes på nett. Løsningen bruker ren HTML, CSS og JavaScript, uten build-verktøy eller eksterne avhengigheter.

## Prosjektoversikt

- **Kalendergrid**: Viser alle luker (f.eks. 1–24) med dato, tittel og et lite bilde/ikon.
- **Låsing per dato**: Hver luke kan ha et `openAt`-tidspunkt. Før den er tilgjengelig vises en låst tilstand.
- **Dagvisning**: Åpne en luke for å se tekst, bilde/media og eventuell lenke/CTA.
- **Lagring i nettleser**: Lokal lagring av hvilke luker som er åpnet, slik at brukeren beholder fremdriften.
- **Responsivt**: Fungerer på mobil, nettbrett og desktop uten scrolling på hovedflaten.
- **Hash-routing**: URL-er kan dele både forsiden (`/#/`) og en spesifikk dag (`/#/d/01`).

Planlagte tillegg som kan aktiveres senere:
- Animasjoner/snow/lyd ved åpning av luke
- Deleknapp (kopier lenke/bruk Web Share API)
- Offline/PWA-støtte med enkel service worker
- Mulighet for forhåndsvisning/”åpne alle” for redaktører

## Data og innhold

- Kalenderdata ligger i `data/calendar.json` (se [DATA_FORMAT.md](./DATA_FORMAT.md)).
- Mediefiler (bilder/video/lyd) legges under `assets/media/`, gjerne sortert per dag (`assets/media/days/01/...`).
- All ruting er klient-side; ingen server kreves utover statisk hosting.

## Filstruktur (anbefalt)

```
/julekalender/
  index.html
  /assets/
    /css/main.css
    /js/
      main.js
      router.js
      state.js
      data-loader.js
      utils.js
      view-calendar-grid.js
      view-day.js
    /media/
      /days/
        01/
          cover.jpg
          main.jpg
        02/
          ...
  /data/
    calendar.json
```

## Hurtigstart

```bash
git clone <repository-url>
cd julekalender
python -m http.server 8000   # eller npx http-server -p 8000
# åpne http://localhost:8000
```

1. Legg inn eller oppdater `data/calendar.json`.
2. Plasser tilhørende bilder/medier i `assets/media/`.
3. Åpne forsiden for å se gridet og test at luker som er åpnet vises som forventet.

## Legge til nye luker

- Se [IMPORT_GUIDE.md](./IMPORT_GUIDE.md) for stegvis prosess.
- Se [DATA_FORMAT.md](./DATA_FORMAT.md) for felter og eksempler.

Kortversjon:
1. Lag en mappe under `assets/media/days/<id>/` med innholdet for dagen.
2. Oppdater `data/calendar.json` med id, tittel, tidspunkt (`openAt`) og referanser til media/tekst.
3. Verifiser lokalt at låsing og rendering fungerer.

## Brukerflyt

1. Forsiden viser alle luker. Låste luker er markert; åpne luker viser status.
2. Klikk på en tilgjengelig luke for detaljvisning.
3. URL oppdateres (hash) slik at du kan dele en bestemt dag.
4. Fremdrift (åpnede luker) lagres automatisk lokalt.

## Støttede plattformer

Moderne nettlesere på mobil, nettbrett og desktop. Ingen støtte for eldre IE/legacy.

## Dokumentasjon

- [ARCHITECTURE.md](./ARCHITECTURE.md) – Teknisk struktur og modulansvar
- [IMPLEMENTATION.md](./IMPLEMENTATION.md) – Funksjonssignaturer og patterns
- [CSS_GUIDELINES.md](./CSS_GUIDELINES.md) – Design tokens og BEM-mønstre
- [DATA_FORMAT.md](./DATA_FORMAT.md) – JSON-formatet for kalender og luker
- [ROADMAP.md](./ROADMAP.md) – Arbeidsplan og milepæler

## Lisens

Privat prosjekt – ingen redistribusjon.
