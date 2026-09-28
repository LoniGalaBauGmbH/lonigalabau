## Ziel
Die Detailseite `/leistungen/$slug` weg vom "Editorial-Blog"-Look (Drop-Cap, große Serif-Zitate, lange Textspalte, Italic-Pulls) hin zu cleanem, modernem Studio-Look – mehr Struktur, weniger Prosa-Dramatik.

## Was rausfliegt
- Drop-Cap auf dem `long_text` (`first-letter:font-serif text-7xl …`)
- Sticky "Gärten, die bleiben"-Aside mit Italic-Wortspiel
- Italic-Serif-Akzente in Überschriften (`<span className="italic">…</span>`)
- Italic-Lead unter dem Hero (`font-serif italic font-light`)
- Riesige `clamp(2.75rem,9vw,8rem)`-Hero-Headline
- Dunkler dramatischer Verlauf + radialer Vignette über Hero-Bild
- Dark "Brand"-Timeline-Block mit Italic-Akzent

## Neuer Look (clean / modern)

```text
┌─────────────────────────────────────────────────────────┐
│ COMPACT HERO (60-70vh, hell)                            │
│ - 2-Spalter: links Text, rechts gerahmtes Bild          │
│ - Crumb klein, sans-serif                               │
│ - H1 sans (display) max ~6rem, NICHT all-caps Italic    │
│ - Lead in Sans, regular weight                          │
│ - Inline-Meta-Strip: Erfahrung · Festpreis · 24 h       │
│ - Primärer Button + Telefon-Ghost-Button                │
├─────────────────────────────────────────────────────────┤
│ STATS STRIP (slim, ohne icons-circles)                  │
│ Vier Zahlen mit Hairline-Divider statt Card-Boxen       │
├─────────────────────────────────────────────────────────┤
│ INTRO (single column, max-w-3xl, normaler Body)         │
│ - Kein Drop-Cap, kein Sticky-Aside                      │
│ - Eyebrow + kurze H2 + long_text als saubere Absätze    │
├─────────────────────────────────────────────────────────┤
│ LEISTUNGSUMFANG (3-col flat grid)                       │
│ - Karten ohne Hover-Glow, dünne Trennlinie statt Border │
│ - Nummerierung 01–06 statt Sparkles-Icon                │
├─────────────────────────────────────────────────────────┤
│ ABLAUF (hell, horizontal, mit dünner Linie)             │
│ - Weißer Hintergrund statt dunkler brand-Box            │
│ - 4 nummerierte Spalten, dezent                         │
├─────────────────────────────────────────────────────────┤
│ REFERENZEN (Grid wie bisher, aber Karten ohne Border,   │
│ Bildschnitt 3:4, Title unter Bild, mini-Caps Location)  │
├─────────────────────────────────────────────────────────┤
│ FAQ + MINI-KONTAKT (Split bleibt – funktional gut)      │
│ - Form: weniger Schatten, schlankere Inputs             │
│ - FAQ-Trigger sans, kein Serif                          │
├─────────────────────────────────────────────────────────┤
│ WEITERE LEISTUNGEN (Grid bleibt, Hover dezenter)        │
├─────────────────────────────────────────────────────────┤
│ FINAL CTA (helle Variante statt dunkles Brand-Panel)    │
│ - Off-white Card, schwarze Buttons, sauber              │
└─────────────────────────────────────────────────────────┘
```

## Konkrete Änderungen pro Sektion (in `src/routes/leistungen.$slug.tsx`)

**Hero**
- Höhe: `min-h-[560px] py-24 md:py-32` statt `h-[88vh]`
- Kein Vollbild-Bild + Verlauf. Stattdessen helles Layout: `grid lg:grid-cols-12`, Text links (col-span-7), Bild rechts (col-span-5, `aspect-[4/5] rounded-2xl object-cover`).
- H1: `display text-[clamp(2.5rem,6vw,5.5rem)] text-brand` – kleiner, ruhiger.
- Lead: `text-lg md:text-xl text-foreground/75 leading-relaxed max-w-xl` (Sans, kein Italic).
- Inline-Meta-Strip statt eigenem Stats-Band: 3 Zahlen mit `·`-Trenner unter Lead.
- Buttons: Primary `bg-brand text-brand-foreground rounded-full`, Phone als ghost mit `text-brand border-brand/20`.

**Stats Strip**
- Ersetzt das aktuelle Key-Facts-Band durch eine schlanke Zeile: 4 Items, Zahl groß sans, Label klein, vertikale Hairlines `divide-x divide-brand/10`.

**Intro**
- Eine Spalte, `max-w-3xl mx-auto`, Text als saubere Absätze, normaler `text-foreground/80 leading-relaxed`.
- Eyebrow "Über die Leistung" + kurze H2 (sans, 2 Zeilen max).

**Leistungsumfang**
- 3-Spalten-Grid, jede Karte: kleine Nummer `01` in `text-brand/40`, Titel sans-bold, kurze Description. Trennung durch `border-t border-brand/10` zwischen Reihen, kein Card-Look.

**Ablauf**
- Hell statt dunkles Panel. `bg-surface rounded-3xl border border-brand/10 p-12`. 4 Spalten mit Nummern oben, dünne horizontale Linie verbindet sie auf `lg:`.
- Keine `italic text-accent`-Akzente in der Headline.

**Referenzen**
- Karten ohne `bg-surface border`, nur Bild + Text darunter. Bildverhältnis `aspect-[3/4]`, Title `text-brand font-display font-semibold`, Location als Mini-Caps darüber.

**FAQ + Kontakt**
- FAQ-Header: H2 ohne `<br/>`-Trick und ohne `text-brand-muted`-Italic-Effekt – einfach `Häufige Fragen`.
- Form-Card: `shadow-none border border-brand/10 rounded-2xl` (kein dramatischer Schatten).
- Inputs: `rounded-lg` (statt `rounded-xl`), schlanker Padding.
- Submit-Button: nicht uppercase tracking-wide, sondern `text-sm font-semibold` ohne `tracking-[0.18em]`.

**Weitere Leistungen**
- Grid bleibt, aber Karten-Bilder mit `aspect-[4/5]`, Title-Block am Boden mit subtileren Gradient (`from-brand/80 via-brand/20 to-transparent`).

**Final CTA**
- Helle Card: `bg-surface border border-brand/10 rounded-3xl`. H2 in `text-brand`, kein dunkles Brand-Panel. Primary-Button `bg-brand text-brand-foreground rounded-full`.

## Typografie-Regeln (durchgängig)
- Headlines: `font-display` (Archivo), kein zusätzlicher `italic`-Span.
- Body: `font-sans` (Inter), keine Serif-Zitate, kein Drop-Cap.
- Eyebrows: bestehender `.eyebrow eyebrow-bracket text-accent` bleibt – ist clean.
- Buttons: `rounded-full`, Sans, normales Tracking (max `tracking-wide`), kein `uppercase tracking-[0.2em]` mehr.

## Mini-Komponenten-Änderungen
- `src/components/leistungen/ServiceFAQ.tsx`:
  - H2 vereinfachen → "Häufige Fragen", kein `<br/>` + Italic-Pull.
  - Trigger: `font-medium` statt `font-display font-semibold`, kleiner.
- `src/components/leistungen/ServiceMiniContact.tsx`:
  - Card-Shadow entfernen, dünnerer Border.
  - Inputs `rounded-lg`, Submit ohne Wide-Tracking.
  - Success-State H3 ohne `display`-AllCaps – ruhiger.

## Out of Scope
- Keine Daten/Server-Änderungen
- Keine neuen Routen
- Keine Bibliotheken
- `/leistungen` Übersicht bleibt unverändert
- Cookie-Banner, Admin, Footer unverändert