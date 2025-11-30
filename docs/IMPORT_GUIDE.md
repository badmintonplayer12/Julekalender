# Import Guide – Legg til nye luker

Hvordan du legger til nytt innhold i julekalenderen på en trygg og konsistent måte.

## Kort oppskrift

1. Lag en mappe for dagen under `assets/media/days/<id>/`.
2. Plasser bilder/lyd/video i mappen (bruk web-vennlige filnavn).
3. Oppdater `data/calendar.json` med felter for den nye dagen (se nedenfor).
4. Test lokalt at luken vises, låses opp på riktig tidspunkt og at lenker/bilder fungerer.

## Navn og stier

- **ID**: bruk to-sifret streng: `01`, `02`, … `24`. Unike ID-er kreves.
- **Mapper**: `assets/media/days/<id>/` (ingen mellomrom eller spesialtegn). Eksempel: `assets/media/days/07/cover.jpg`.
- **Filnavn**: bruk kebab-case eller tall (`main.jpg`, `cover.jpg`, `quiz-audio.mp3`).
- **Stier i JSON**: relative til `assets/media/`, f.eks. `"coverImage": "days/07/cover.jpg"`.

## Oppdatere calendar.json

Legg til et nytt objekt i `days`-arrayen:

```json
{
  "id": "07",
  "title": "7. desember",
  "teaser": "Quizkveld",
  "openAt": "2024-12-07T00:00:00Z",
  "coverImage": "days/07/cover.jpg",
  "image": "days/07/main.jpg",
  "body": "Quizkveld med gløgg og pepperkaker.",
  "ctaLabel": "Start quizen",
  "ctaUrl": "https://example.com/quiz"
}
```

Husk å sortere luker etter `id` (stigende). `loadCalendar()` vil sortere ved innlasting, men hold filen ryddig.

## Låsing med openAt

- Sett `openAt` til et ISO-8601 tidspunkt i UTC: `YYYY-MM-DDTHH:mm:ssZ`.
- Utelat `openAt` hvis luken skal være åpen fra start.
- For test/preview kan du bruke en egen “previewMode” flagg i state (se IMPLEMENTATION).

## Godkjenningsliste før du pusher

- [ ] `id` er unik og to-sifret.
- [ ] `openAt` er korrekt og i fremtiden hvis luken skal låses.
- [ ] Alle stier i JSON peker til faktiske filer under `assets/media/`.
- [ ] Bilder er optimalisert for web (typisk < 1 MB).
- [ ] Lokal test viser riktig status (låst/åpen) og innhold.

## Feilsøking

- **Bilde vises ikke**: sjekk stien i JSON og at filen ligger under `assets/media/`.
- **Luken er alltid låst**: verifiser `openAt` (tidssone og dato), og at systemklokken er riktig.
- **Rekkefølge er feil**: sørg for at `id` er to-sifret og at data er sortert.

## Rydding og arkivering

For å deaktivere en luke uten å slette den:
- Fjern den fra `days`-arrayen, eller
- Sett en svært fremtidig `openAt`.

Bevar mediafilene hvis de kan brukes senere; ellers slett ubrukte filer fra `assets/media/` for å holde repoet lett.
