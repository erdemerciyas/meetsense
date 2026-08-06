# MeetSense Interactive Showcase

Premium one-page microsite for MeetSense — AI meeting assistant with scroll-driven animations, video placeholders, and TR/EN localization.

## Stack

- Next.js 16 (App Router, static export)
- Tailwind CSS v4
- GSAP + ScrollTrigger
- Lenis smooth scroll
- Framer Motion

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000/tr/](http://localhost:3000/tr/) or [http://localhost:3000/en/](http://localhost:3000/en/).

## Build & Deploy

```bash
npm run build
```

Static output is generated in `out/`. Deploy to any static host:

### Vercel (recommended)

1. Push repo to GitHub
2. Import project in Vercel
3. Add custom domain (e.g. `meetsense.bgts.ai`)
4. DNS: CNAME to `cname.vercel-dns.com`

### Nginx / static server

Serve the `out/` folder. Example:

```nginx
server {
  listen 80;
  server_name meetsense.example.com;
  root /var/www/meetsense/out;
  index index.html;

  location / {
    try_files $uri $uri/ $uri/index.html =404;
  }
}
```

## Adding Product Videos

All video slots are centralized in [`src/content/media.ts`](src/content/media.ts).

```ts
hero: {
  id: "hero",
  src: "/videos/hero-demo.mp4",  // add your file path
  poster: "/videos/hero-poster.jpg",
  fallback: "waveform",
  aspectRatio: "16/9",
},
```

1. Place video files in `public/videos/`
2. Set `src` (and optional `poster`) in `media.ts`
3. Rebuild — `VideoSlot` auto-plays when visible

When `src` is empty, animated mockups or waveform fallbacks are shown.

## Project Structure

```
src/
  app/
    [locale]/page.tsx    # TR/EN routes
    page.tsx             # redirects to /tr/
  components/
    sections/            # Hero, Intro, Transcript, Lifecycle, etc.
    ui/                  # VideoSlot, WaveformCanvas, Button, ...
  content/
    tr.ts, en.ts         # All copy
    media.ts             # Video slot registry
```

## Sections

1. Hero — video parallax + waveform
2. MeetSense Nedir — pinned 4-step scrub
3. Live Transcript — diarization + action extraction
4. Meeting Lifecycle — draw-on-scroll flow
5. Features — bento grid
6. Use Cases — sticky stack cards
7. Video Showcase — parallax band + stats
8. Business Value
9. CTA / Demo form

## Custom Domain Checklist

- [ ] Build passes (`npm run build`)
- [ ] Upload `out/` or connect Vercel
- [ ] Point DNS A/CNAME to host
- [ ] Enable HTTPS
- [ ] Set `metadataBase` in `src/app/layout.tsx` to production URL

## License

Private — BGTS / MeetSense product showcase.
