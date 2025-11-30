# Data Format

Denne filen beskriver JSON-formatet som brukes av julekalenderen.

## Oversikt

- Kalenderdata ligger i `data/calendar.json`.
- Mediafiler (bilder/lyd/video) refereres med relative stier (se nedenfor).
- Ingen andre JSON-filer kreves.

## calendar.json

Topnivå:

```json
{
  "title": "Min Julekalender 2024",
  "description": "Kort tekst som vises på forsiden (valgfritt)",
  "days": [ Day, Day, ... ]
}
```

### Day-objekt

```json
{
  "id": "01",
  "title": "1. desember",
  "teaser": "Pepperkaker",
  "openAt": "2024-12-01T00:00:00Z",
  "coverImage": "days/01/cover.jpg",
  "image": "days/01/main.jpg",
  "body": "Kort tekst eller flere setninger om dagens luke.",
  "ctaLabel": "Les mer",
  "ctaUrl": "https://example.com/oppskrift",
  "extraMedia": ["days/01/bonus.mp3"],
  "position": {
    "xPercent": 42.5,
    "yPercent": 38.0
  }
}
```

Feltbeskrivelser:
- `id` (påkrevd): unik streng for dagen. Anbefalt format: to-sifret (“01”, “24”) for naturlig sortering.
- `title` (påkrevd): visningsnavn i dagvisning.
- `teaser` (valgfritt): kort tekst som vises på kortet i gridet.
- `openAt` (valgfritt): ISO 8601 UTC-tidspunkt når luken blir tilgjengelig. Hvis utelatt → alltid åpen. Bruk format `YYYY-MM-DDTHH:mm:ssZ`.
- `coverImage` (valgfritt): lite bilde/ikon for gridet.
- `image` (valgfritt): hovedbilde i dagvisningen.
- `body` (valgfritt): fri tekst. Kan inneholde linjeskift (`\n`).
- `ctaLabel` / `ctaUrl` (valgfritt): knapp/lenke i dagvisningen.
- `extraMedia` (valgfritt): array av ekstra mediafiler (video/lyd/bilder) som kan listes opp eller brukes videre.
- `position` (påkrevd for forside): `{ xPercent, yPercent }` posisjon for knappen på bakgrunnsbildet. Verdier 0–100 (prosent av bredde/høyde). Dette gjør at lukene følger bakgrunnsbildet på tvers av skjermstørrelser.

Alle mediastier er relative til `assets/media/`. Eksempel: `days/01/main.jpg` refererer til `assets/media/days/01/main.jpg`.

### Eksempel på komplett calendar.json

```json
{
  "title": "Familiekalender 2024",
  "description": "24 små gleder frem mot julaften.",
  "days": [
    {
      "id": "01",
      "title": "1. desember",
      "teaser": "Pepperkake-søndag",
      "openAt": "2024-12-01T00:00:00Z",
      "coverImage": "days/01/cover.jpg",
      "image": "days/01/main.jpg",
      "body": "Bak pepperkaker og pynt dem med melis.",
      "ctaLabel": "Se oppskrift",
      "ctaUrl": "https://example.com/oppskrift"
    },
    {
      "id": "02",
      "title": "2. desember",
      "teaser": "Quiz",
      "openAt": "2024-12-02T00:00:00Z",
      "body": "Test julekunnskapen din med fem spørsmål."
    }
  ]
}
```

## Regler og beste praksis

- **ID-er**: bruk to-sifret streng for desember-dager (“01”–“24”). Flere luker kan legges til, men behold unikhet.
- **Stier**: alle filstier skal være URL-vennlige (kebab-case, ingen mellomrom). Legg filer under `assets/media/`.
- **openAt**: bruk UTC for stabilitet. Frontend kan konvertere til lokal tid for visning.
- **Manglende media**: hvis `coverImage` mangler, vis et ikon/nummer. Hvis `image` mangler, vis bare teksten.
- **Låsing**: en luke er tilgjengelig når `openAt` er tom eller i fortiden, eller dersom en eventuell “preview/override”-modus er aktiv (se IMPLEMENTATION). Etter 24. desember er alle luker åpne uansett `openAt`.

## Validering (anbefalt)

Minimumskrav per dag:
- `id`
- `title`

Annet er valgfritt, men sørg for at stier peker til faktiske filer. JSON må være gyldig UTF-8/ASCII og parsebar i nettleseren.
