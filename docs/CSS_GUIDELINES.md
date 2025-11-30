# CSS Guidelines

Retningslinjer for styling av julekalenderen. Følg disse mønstrene for å holde stilarket konsistent og lett å vedlikeholde.

## Struktur

Sorter `assets/css/main.css` slik:
1. Design tokens (`:root`)
2. Reset/base
3. Layout-komponenter
4. View-spesifikke stiler
5. Utilities

## Design tokens

Bruk variabler for alt av farger, spacing og typografi.

```css
:root {
  --color-bg: #0f172a;
  --color-card: #111827;
  --color-foreground: #f8fafc;
  --color-accent: #f97316;
  --color-muted: #9ca3af;
  --color-border: #1f2937;
  --color-success: #22c55e;
  --color-warning: #f59e0b;

  --font-base: 'Segoe UI', system-ui, -apple-system, sans-serif;
  --font-size-base: 16px;
  --font-size-sm: 14px;
  --font-size-lg: 18px;
  --line-height: 1.5;

  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  --border-radius: 12px;
  --shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}
```

Tilpass farger etter tema, men legg nye verdier inn som variabler før bruk.

## Navngivning (BEM)

- Blocks: `.calendar-grid`, `.calendar-card`, `.day-view`.
- Elements: `.calendar-card__number`, `.day-view__media`.
- Modifiers: `.calendar-card--locked`, `.calendar-card--opened`.
- Utilities: `.u-hidden`, `.u-text-center`, `.u-flex`.

Ingen improviserte klassenavn; hold deg til BEM-mønsteret.

## Base-stiler

```css
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { min-height: 100%; font-family: var(--font-base); background: var(--color-bg); color: var(--color-foreground); }
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
button { font: inherit; border: none; cursor: pointer; background: none; }
```

## Layout-komponenter

### Kalender-grid

```css
.calendar-grid {
  display: grid;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}

.calendar-card {
  position: relative;
  background: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  box-shadow: var(--shadow);
  transition: transform 0.2s, box-shadow 0.2s;
}

.calendar-card:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(0, 0, 0, 0.3); }
.calendar-card--locked { opacity: 0.7; }
.calendar-card--opened { border-color: var(--color-success); }

.calendar-card__number { font-size: 32px; font-weight: 700; margin-bottom: var(--spacing-sm); }
.calendar-card__title { font-size: var(--font-size-lg); margin-bottom: var(--spacing-xs); }
.calendar-card__teaser { color: var(--color-muted); font-size: var(--font-size-sm); }
.calendar-card__badge {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  padding: 4px 8px;
  border-radius: 999px;
  font-size: var(--font-size-sm);
  background: rgba(255,255,255,0.08);
}
```

### Dagvisning

```css
.day-view {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--color-bg);
}

.day-view__header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.day-view__body {
  padding: var(--spacing-lg);
  display: grid;
  gap: var(--spacing-lg);
}

.day-view__media {
  width: 100%;
  border-radius: var(--border-radius);
  overflow: hidden;
  background: #000;
}

.day-view__content {
  display: grid;
  gap: var(--spacing-md);
  line-height: var(--line-height);
}

.day-view__actions {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.day-view__button {
  padding: 12px 16px;
  border-radius: var(--border-radius);
  background: var(--color-accent);
  color: #000;
}

.day-view__status {
  padding: var(--spacing-md);
  border: 1px dashed var(--color-border);
  border-radius: var(--border-radius);
  background: rgba(255,255,255,0.05);
}
```

### Responsivt

Bruk mobile-first:
```css
@media (min-width: 768px) {
  .calendar-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); }
  .day-view__body { grid-template-columns: 1fr 1fr; align-items: start; }
}
```

## Interaksjon og tilstand

- **Fokus**: `outline: 2px solid var(--color-accent); outline-offset: 2px;` på fokuserbare elementer.
- **Hover/aktiv**: lett transform/opacity på kort og knapper.
- **Låst**: `.calendar-card--locked` og `.day-view__status` for å signalisere kommende dato.
- **Åpnet**: `.calendar-card--opened` eller en badge som sier “Åpnet”.

## Utilities (bruk sparsomt)

```css
.u-hidden { display: none !important; }
.u-text-center { text-align: center !important; }
.u-flex { display: flex !important; align-items: center; gap: var(--spacing-sm); }
.u-muted { color: var(--color-muted) !important; }
```

## Beste praksis

- Gjenbruk tokens; ingen hardkodede verdier når en variabel finnes.
- Hold komponentstiler samlet; unngå globale tag-selectors utover base-stil.
- Ikke bruk `!important` med mindre du dokumenterer hvorfor.
- Test på mobil, nettbrett og desktop (375px / 768px / 1280px+).
- Unngå overdrevet animasjon; korte (150–250ms) overganger er nok for åpne/lukk-tilstander.
