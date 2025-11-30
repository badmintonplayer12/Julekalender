# Analyse av julekalender-prosjektet

## Formål og målgruppe

- **Formål**: En enkel, nettbasert julekalender der hver luke inneholder et lite innholdsstykke (tekst, bilde, lenke eller media).
- **Målgruppe**: Familier, kollegaer eller små grupper som vil dele et lett tilgjengelig kalenderformat uten innlogging eller app-installasjon.
- **Krav**: Skal fungere på mobil først, være selvdokumenterende og kunne hostes statisk (f.eks. GitHub Pages).

## Brukerflyt

1. Forsiden viser alle luker (typisk 1–24) som kort.
2. Låste luker viser dato/ikon; åpne luker viser status.
3. Klikk på en tilgjengelig luke åpner detaljvisningen.
4. URL oppdateres med hash slik at en spesifikk luke kan deles.
5. Åpne luker lagres lokalt (localStorage) slik at fremdriften beholdes.

## Nøkkelfunksjoner å beholde

- **Låsing per dato (`openAt`)**: Ett konsistent sted for å sjekke om en luke er tilgjengelig.
- **Enkel datamodell**: Én `calendar.json` som beskriver alle luker; stier peker til `assets/media/`.
- **Hash-ruting**: `/#/` for grid, `/#/d/<id>` for lukevisning.
- **LocalStorage**: Lagre åpne luker og evt. preview-modus for redaktører.
- **Responsivt UI**: Grid som skalerer fra mobil til desktop uten horisontal scroll.

## Antatte rammer

- Ingen backend; alt innhold er statisk.
- Ingen byggsteg eller avhengigheter; ren HTML/CSS/JS.
- Nettverkskrav: kun GET av statiske filer (data + media).
- Tidssoner: `openAt` lagres som ISO UTC og evalueres i frontend.

## Risikoer og hensyn

- **Tidssone-avvik**: Brukere i ulike soner kan oppleve åpning tidligere/senere. Løsning: vis lokal tid, men lagre `openAt` i UTC.
- **Store mediafiler**: Optimaliser bilder; unngå tunge video/lyd uten behov.
- **Deling av lenker**: Hash-routing krever at `calendar.json` lastes før visning; håndter feil med bruker-vennlig melding.
- **Tilgjengelighet**: Sørg for kontrast, fokus-stiler og alt-tekst på bilder.

## Mulige utvidelser

- Enkel “preview”-toggle for redaktører (åpne alle luker uavhengig av dato).
- Delingsknapp (Web Share / kopier lenke).
- Lettvekts animasjon eller snøeffekt ved åpning av luke.
- Service worker for offline-modus når alt innhold er statisk tilgjengelig.
