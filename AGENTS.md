# MeetSense landing page

Static site with no build step: `index.html` plus `assets/` (CSS, JS, Three.js, images, videos). See README.md for the folder layout. Don't add a framework or bundler. `main` is the only branch, and Vercel deploys it to production on every push.

# MeetSense design workflow

Project-level design skills live in `.claude/skills/`: `impeccable`, `design-taste`, `ui-ux-pro-max` (and its sub-skills), `creative-web-intelligence`.
- One light theme, warm neutral, one accent (Ember). No site-wide dark mode, no gradients or glows.
- Project override (2026-09-30): decorative motion is allowed — animated margin ornaments, scroll reveals, the live recording strip, hover lift. Keep it within the palette and always honour reduced motion.
- Project override (2026-09-30): sections may alternate background tones from the palette (pass, pass-2, ember-wash, paper) and one section may be dark (ink ground, paper text) to break monotony.
- Windows: run ui-ux-pro-max with `py .claude/skills/ui-ux-pro-max/scripts/search.py ...`, impeccable with `.claude\skills\impeccable\scripts\impeccable.cmd`.
- Redesign plan: `C:\Users\erdem\.claude\plans\ok-renkli-kafa-kar-t-r-c-eager-grove.md`.
