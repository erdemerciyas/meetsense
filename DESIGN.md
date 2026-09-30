---
name: MeetSense
description: A meeting's work printed as tickets and hung on one steel rail, from invite to a question asked a month later.
colors:
  ember: "oklch(58% 0.19 40)"
  ember-ink: "oklch(49% 0.17 37)"
  ember-wash: "oklch(94% 0.035 50)"
  pass: "oklch(93.6% 0.005 75)"
  pass-2: "oklch(90.5% 0.006 75)"
  paper: "oklch(98.8% 0.004 90)"
  ink: "oklch(21% 0.006 60)"
  ink-2: "oklch(36% 0.006 60)"
  ink-3: "oklch(43% 0.006 60)"
  rule: "oklch(83% 0.006 70)"
  steel: "oklch(72% 0.007 250)"
  steel-hi: "oklch(84% 0.005 250)"
  steel-lo: "oklch(56% 0.009 250)"
typography:
  display:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 1.4rem + 5vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.3rem + 2.6vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.625rem, 1.2rem + 1.4vw, 2.375rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.35vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  ticket-text:
    fontFamily: "Schibsted Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.375
  data:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 500
    letterSpacing: "-0.01em"
    fontFeature: "\"tnum\""
    fontVariation: "\"wdth\" 87.5"
  label:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.01em"
    fontFeature: "\"tnum\""
    fontVariation: "\"wdth\" 87.5"
  stamp:
    fontFamily: "Martian Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 700
    letterSpacing: "0.04em"
    fontVariation: "\"wdth\" 87.5"
rounded:
  hairline: "1px"
  sm: "2px"
spacing:
  gutter: "1.25rem"
  gutter-md: "2.5rem"
  shell: "80rem"
  ticket-x: "1rem"
  ticket-y: "0.875rem"
  section: "6rem"
  section-lg: "8rem"
components:
  button-primary:
    backgroundColor: "{colors.ember-ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "0 1.375rem"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "oklch(43% 0.155 36)"
    textColor: "{colors.paper}"
  text-link:
    textColor: "{colors.ink}"
  text-link-hover:
    textColor: "{colors.ember-ink}"
  ticket:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.hairline}"
    padding: "0.875rem 1rem 1rem"
  ticket-clip:
    backgroundColor: "{colors.steel-lo}"
    rounded: "{rounded.hairline}"
    width: "2.25rem"
    height: "1.1rem"
  rail-bar:
    backgroundColor: "{colors.steel}"
    rounded: "{rounded.hairline}"
    height: "0.625rem"
  stamp:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ember-ink}"
    typography: "{typography.stamp}"
    rounded: "{rounded.sm}"
    padding: "0.2rem 0.5rem"
  field-input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.625rem 0.75rem"
    height: "3rem"
---

# Design System: MeetSense

## Overview

**Creative North Star: "Sipariş Rayı" (The Ticket Rail)**

MeetSense is shown the way a kitchen pass runs orders. Each piece of work said in a meeting becomes a printed ticket of thermal paper. The ticket carries a number, a kind, an owner and the timecode it came from, and it hangs from one steel rail with a notch for each weekday. The page follows a single meeting through its whole life, from the invite to a question asked a month later. Each chapter's output is a physical object hanging on that rail. The page is not built from feature sections, screenshot rows or tabbed product cards.

The mood is calm, exact and physical. The ground is a warm, pale pass. Tickets are near-white paper printed in near-black ink. The only metal is the rail, and the only heat is the logo's ember, which appears where something needs attention: a flag, a stamp, the active day, a due-date span and the one primary action. Density is moderate. Prose stays in a grotesk and anything that looks printed (numbers, times, owners, labels) is set in a narrowed mono. The site has one light theme.

**Key Characteristics:**
- A warm pale pass for the ground, thermal-paper tickets and one steel rail with day notches.
- Ember appears rarely and always carries a meaning.
- Every chapter output hangs from a length of rail and carries a clip.
- Long records tear off with a zigzag edge.
- Grotesk for speech and prose. Narrowed mono for printed data.
- Tickets print in timecode order and are visible by default.
- One light theme only.

## Colors

The palette is a warm neutral paper-and-ink world with a cool steel rail and one hot accent.

### Primary
- **Ember** (`ember`): the logo's heat. It is used only for flags (the risk glyph on a flagged tally row or note), the stamp border, the active day notch on the rail, the due-date span drawn along the rail, and the spoken-phrase underline that marks the words a ticket was printed from. It is never used for body text.
- **Ember Ink** (`ember-ink`): a deeper ember used wherever ember must carry text or a fill: the primary button, stamp lettering, the active day's label, the "no owner" value, field error text, the focus ring and the text-link hover.
- **Ember Wash** (`ember-wash`): a pale tint for text selection and the input focus halo only.

### Neutral
- **Pass** (`pass`): the page ground, like the steel-and-tile pass of a kitchen. The html background.
- **Pass Shade** (`pass-2`): a slightly deeper pass, used at 50% for the long meeting-life band so it reads as a separate counter.
- **Thermal Paper** (`paper`): every ticket, the demo form and the enterprise band. Text on paper is always ink.
- **Print Ink** (`ink`), **Ink Two** (`ink-2`), **Ink Three** (`ink-3`): three strengths of print, used in that order for primary text, secondary prose and ticket values, and quiet data such as labels, timecodes and placeholders.
- **Rule** (`rule`): section borders, the dashed tear line, dotted tally leaders and input strokes.
- **Rail Steel** (`steel`), **Steel Highlight** (`steel-hi`), **Steel Shadow** (`steel-lo`): the rail bar's body, its top edge and its bottom edge. Steel Shadow also fills the ticket clip and the inactive day notches. Steel is the resting underline colour of text links.

### Named Rules
**The Ember Means Something Rule.** Ember appears only on flags, stamps, the active notch, the due-date span and the primary action. When ember must be text or a button fill, use Ember Ink. If ember appears somewhere and you cannot say which of those five it is, remove it.

**The Stamp Not Colour Rule.** A missing owner, or any other failure state, is named in words (a stamp, a "no owner" value) and shown with a glyph. Colour alone never carries it.

## Typography

**Display Font:** Schibsted Grotesk (with ui-sans-serif, system-ui)
**Body Font:** Schibsted Grotesk
**Label/Mono Font:** Martian Mono, at 87.5% width (the wdth axis), with tabular figures

**Character:** The grotesk is plain-spoken and a little newsy: what someone said and what the page argues. The narrowed mono is the ticket printer: what the machine recorded.

### Hierarchy
- **Display** (700, clamp 2.75–6rem, line-height 0.98, −0.035em): the single hero h1.
- **Headline** (700, clamp 2–3.5rem, 1.04, −0.03em): section h2s.
- **Title** (700, clamp 1.625–2.375rem, 1.1, −0.02em): chapter h3s within the meeting's life, max 22ch.
- **Lead** (400, clamp 1.0625–1.25rem, 1.55, Ink Two, max 36rem): the one sentence under each heading.
- **Body** (400, 1.0625rem, 1.6): prose in Ink Two, max 60ch.
- **Ticket text** (600, 0.9375–1rem, snug): the work itself printed on a ticket. Record titles step up to 1.125–1.375rem bold.
- **Data** (mono, 500–600, 0.75–0.8125rem, tabular): ticket numbers, timecodes, owners, dates, tallies.
- **Label** (mono, 500, 0.75rem, +0.01em, Ink Three, sentence case): field names inside records and the "example" marks.
- **Stamp** (mono, 700, 0.75rem, +0.04em, uppercase): the only uppercase in the system.

### Named Rules
**The Printed Data Rule.** Martian Mono is used only for printed data: numbers, times, owners, dates, tallies and labels. Headings, prose and what was said are always Schibsted Grotesk. Mono is always narrowed to 87.5% width and uses tabular figures.

## Layout

The page is a single centred shell (max 80rem) with 1.25rem gutters, widening to 2.5rem from 768px. Section headings sit on a 12-column grid from 1024px, and the heading and lead often split 7/5 or 6/4. Sections breathe at 6rem vertically and 8rem from 1024px. The meeting's life runs as numbered chapters. Each chapter has a 2-column sticky timecode rail with a left rule and a small ink square marking the chapter, and a 10-column body. Chapter content is split 4/6 or 6/4 on a 10-column subgrid.

The rail board lays tickets out in weekday columns under a full-width rail, which stays on phones. Below 768px the columns collapse into a stacked list of only the days that hold tickets, each headed by its day in mono, and the rail sits above them. Template tickets run in four columns under one rail at 1024px and each gets its own length of rail below that.

## Elevation & Depth

Depth is physical and minimal. The ground is flat. Tickets are the only lifted objects, and they hang with a hairline contact shadow plus a soft drop shadow beneath, as paper hanging slightly off the wall. The rail is modelled with a lighter top edge and darker bottom edge rather than a shadow. Nothing else casts a shadow.

### Shadow Vocabulary
- **Hanging paper** (`box-shadow: 0 1px 0 oklch(21% 0.006 60 / 0.06), 0 14px 22px -16px oklch(21% 0.006 60 / 0.35)`): every ticket, and nothing else.
- **Input halo** (`box-shadow: 0 0 0 3px var(--color-ember-wash)`): focus state of a field only.

### Named Rules
**The Only Paper Hangs Rule.** Only tickets have the hanging shadow. Bands, sections and chapter containers stay flat and are divided by rules or a shift in pass tone.

## Shapes

The shapes are near-square. Tickets, the rail and the clip have a 1px hairline radius. Buttons, fields and stamps have 2px. Round shapes appear only in the invite card's radio dots and small flag dots. Tickets are divided by a dashed tear line in Rule. Long records (the transcript log, the closing record, the weekly tally and the later answer) end in a zigzag torn edge (a 0.625rem tooth, cut with a CSS mask), as a receipt torn off the printer. Tally rows use dotted leaders. The unowned ticket and its stamp are the only rotated objects (about −4° and −5°).

### Named Rules
**The Torn Record Rule.** A record long enough to have been torn off the printer ends in a zigzag edge. Short tickets keep a straight edge.

## Components

### Buttons
Heavy and direct, like a pass bell.
- **Shape:** near-square (2px), min-height 3rem, padding 0 1.375rem, weight 650.
- **Primary:** Ember Ink fill with Paper text. This is the only ember-filled control, and it always means "request a demo".
- **Hover / Focus / Active:** darkens on hover (160ms ease-out). Focus shows a 2px Ember Ink outline offset 3px. Active scales to 0.97. Disabled drops to 55% opacity.
- **Text link:** Ink, weight 600, underlined in Steel. On hover the text turns Ember Ink and the underline takes the text colour.

### Cards / Containers (Ticket)
- **Corner Style:** hairline (1px).
- **Background:** Thermal Paper, Ink text.
- **Shadow Strategy:** Hanging paper (see Elevation).
- **Anatomy:** a mono number (#01) and a kind glyph with its name, a dashed tear line, the work in semibold grotesk, and a mono definition list of owner or speaker, due date and source timecode.
- **Clip:** a steel tab centred on the top edge that pins the ticket to the rail.
- **Internal Padding:** 0.875rem top, 1rem sides and bottom. Records use 1.25–2rem.

### Inputs / Fields
- **Style:** Paper background, 1px Rule stroke, 2px radius, min-height 3rem. Label above in semibold grotesk at 0.9375rem.
- **Hover:** stroke shifts to Steel Shadow.
- **Focus:** stroke turns Ink and an Ember Wash 3px halo appears. There is no outline.
- **Error:** stroke turns Ember Ink and an Ember Ink message appears below.

### Navigation
A 4.5rem bar with the logo, grotesk links (0.9375rem, 500, Ink Two turning Ink on hover, min 44px targets), a locale switch and the primary button from 640px. Below 1024px the links collapse into a toggle menu of full-width rows divided by Rule, with a full-width primary button.

### Rail (signature)
A steel bar 0.625rem tall with a light top edge and dark bottom edge, beneath a row of weekday labels in mono. Each day has a 1px notch in Steel Shadow. The meeting day's notch is Ember and its label Ember Ink. An action's due-date span is drawn as a 3px Ember line along the bar from the meeting day to the due day.

### Stamp (signature)
A mono, uppercase, bold label with a 1.5px Ember border and Ember Ink text on Paper, set slightly rotated across the corner of a ticket. It marks the ticket that never reached the rail.

### Kind Glyphs
Small 16px stroked SVG marks for decision (checked square), action (arrow in a circle), risk (triangle) and info. They let ticket kinds be told apart without colour. Risk turns Ember only when flagged.

### Motion (signature)
Tickets print in timecode order. Each one is revealed top-down with a clip-path wipe and a 10px drop over 520ms, staggered by about 0.65s. Before the action prints, its ember due-date span draws along the rail (a scaleX from the left over 640ms). Switching an answer uses a 220ms fade-and-rise swap. All motion uses `cubic-bezier(0.23, 1, 0.32, 1)`. Content is visible by default, and the animations run only from a hidden start. Reduced motion collapses every animation and transition.

## Do's and Don'ts

### Do:
- **Do** hang every chapter output from a length of rail and give it a clip.
- **Do** tear long records off with the zigzag edge and keep short tickets straight.
- **Do** keep an unowned ticket off the rail and mark it with a stamp, never with colour alone.
- **Do** use Ember only for flags, stamps, the active notch, the due-date span and the primary action. Use Ember Ink for text and button fills.
- **Do** set numbers, times, owners and labels in Martian Mono at 87.5% width with tabular figures, and set headings and prose in Schibsted Grotesk.
- **Do** print tickets in timecode order, draw the due-date span before the action prints, keep content visible by default and honour reduced motion.
- **Do** mark every piece of demo data as an example.

### Don't:
- **Don't** add a dark theme or a second accent. The system has one light theme; a single dark (ink) section as a contrast band is the only exception.
- **Don't** use Ember as a text colour or for decoration. Use Ember Ink when ember must carry text.
- **Don't** set prose or headings in the mono, or printed data in the grotesk.
- **Don't** give shadows to anything but tickets, or round corners beyond 2px.
- **Don't** build feature sections, left-copy/right-screenshot rows or tabbed product cards. Show the work as tickets on the rail.
- **Don't** hide content until an animation runs.
