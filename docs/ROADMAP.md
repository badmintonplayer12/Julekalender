# Roadmap

Arbeidsplan for julekalender-prosjektet. Følg rekkefølgen i fasene med mindre annet er avtalt.

## Fase 1: Grunnstruktur

- [ ] **1.1** Oppsett av filer og mapper  
  - Opprett `index.html`, `assets/css/main.css`, `assets/js/*`, `data/calendar.json`.
- [ ] **1.2** Ruting og oppstart  
  - Implementer `router.js` (hash-parsing) og `main.init()` som lytter på ruter.
- [ ] **1.3** Datahenting  
  - `data-loader.js` med `loadCalendar()` + `getMediaUrl()`. Vis feil på skjerm hvis `calendar.json` ikke kan lastes.
- [ ] **1.4** Grid-view  
  - `view-calendar-grid.js` som viser alle luker med status (låst/åpen/åpnet).
- [ ] **1.5** Dagvisning  
  - `view-day.js` som viser tittel, tekst, media og CTA. Håndter låst-tilstand og “tilbake”-navigasjon.
- [ ] **1.6** State og lagring  
  - `state.js` som lagrer åpne luker i localStorage. Egen helper for låse-logikk (`isDayAvailable`).
- [ ] **1.7** Grunnleggende styling  
  - Mobile-first layout, BEM-klasser, mørk/lys bakgrunn etter tokens. Ingen horisontal scroll.
- [ ] **1.8** Posisjoner for luker  
  - Les posisjonstabell (prosentbasert) fra data og plasser 24 tap-targets på bakgrunnsbildet. Test at tapp/klikk treffer riktig på mobil og desktop.

## Fase 2: Opplevelse og robusthet

- [ ] **2.1** Låse-feedback  
  - Vis tydelig tidspunkt for når luken åpnes hvis den er låst. Håndter ugyldig/manglende `openAt`.
- [ ] **2.2** Deling  
  - Legg til knapp som kopierer lenke til aktiv dag (bruk hash). Fallback til alert ved manglende Clipboard API.
- [ ] **2.3** Nullstill fremdrift  
  - Knapp/lenke for å slette localStorage-innslag (åpne luker).
- [ ] **2.4** Tilgjengelighet  
  - Fokus-stiler, alt-tekster, ARIA-labels på knapper. Minimum kontrast på tekst/knapper.
- [ ] **2.5** Responsiv justering  
  - Juster grid-kolonner og dag-layout for nettbrett/desktop. Test 375px, 768px, 1280px.
- [ ] **2.6** Åpne-animasjon  
  - Implementer glitter/gavepapir/glød ved åpning (1–2s), med fallback hvis animasjon feiler/deaktiveres (`prefers-reduced-motion`). Naviger til dag etter animasjonen.
- [ ] **2.7** Kopier lenke  
  - “Kopier lenke” i dagvisningen (Clipboard API + fallback alert) for deling av `/#/d/<id>`.

## Fase 3: Finpuss (valgfritt)

- [ ] **3.1** Animasjon/snøeffekt  
  - Lett animasjon ved åpning av luke. Kort og diskret (<300ms).
- [ ] **3.2** Offline/PWA  
  - Enkel service worker som cacher HTML, CSS, JS, `calendar.json` og media. Versjonsbump ved endring.
- [ ] **3.3** Preview-modus  
  - Lokal toggle (lagres i localStorage) som åpner alle luker uansett `openAt`.
- [ ] **3.4** Feilhåndtering for media  
  - Fallback-bilde/ikon hvis media feiler, og bruker-vennlig melding i dagvisning.
- [ ] **3.5** Dato/time-travel testing  
  - Test desember-datoer ved å simulere klokke (DevTools/overstyr `now`), bekreft låsing 1–24 og at alt åpnes etter 24. des.

## Testing (anbefalt)

- [ ] Last forsiden og sjekk at `calendar.json` fetches uten feil (DevTools Network).
- [ ] Åpne en tilgjengelig dag og se at status “Åpnet” lagres etter reload.
- [ ] Sett en `openAt` i fremtiden og bekreft låst visning.
- [ ] Besøk `/#/d/<id>` direkte og verifiser korrekt rendering + håndtering av manglende ID.
- [ ] Test på mobil-bredde (375px) og desktop.
