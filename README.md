# Kedai Kopi Hijrah — MVP landing page

A single-page landing site for Kedai Kopi Hijrah, a coffee house on Jl. Fatahillah in
Raliwadas, Sumber, Cirebon, West Java.

Design language: dark editorial luxury (modelled on the structure of forgeautomotive.co.uk) —
oversized serif display type, full-bleed photography, numbered chapters, a marquee strip and a
giant outlined footer wordmark. The menu section flips to bone-on-ink for contrast.

## Run it

No build step. Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 4173
# http://127.0.0.1:4173
```

## Structure

```
index.html          markup + JSON-LD (CafeOrCoffeeShop)
styles.css          design tokens, layout, responsive rules
script.js           nav, slider, menu tabs + image preview, reveals, reviews
assets/images/      optimised JPEGs (~1.8 MB total)
dist/index.html     single-file build (CSS/JS inlined, images on CDN)
```

## What works

- Fixed nav that condenses on scroll, full-screen mobile menu with scroll lock and Escape to close
- Hero parallax (disabled under `prefers-reduced-motion`)
- Three-step approach slider — buttons, arrow keys, touch swipe
- Menu categories as tabs, keyboard arrow navigation, and a hover-driven section backdrop — each
  dish fades its photograph behind the menu under a dark veil
- Auto-rotating reviews (7s) with circular selectors that scale on hover
- Scroll reveals via IntersectionObserver, with a reduced-motion fallback
- Google Maps embed, Instagram and directions links

## Content notes — confirm before going live

- **No phone number** is published. The reservation CTA points to the Instagram profile — swap in
  a WhatsApp or booking link when you have one.
- **Menu items and prices** are plausible placeholders, not the real menu.
- **Hours** (09:00–23:00) follow the Google listing; the kitchen cutoff (22:30) is an assumption.
- **Reviews** are real quotes from the brand's Google listing. The 5.0 score matches the map card
  for this location.
- Take your own photography — the current images are licensed stock (Unsplash / Pexels).

## Deploy

Static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages): publish the folder as-is, or drop
`dist/index.html` on its own if you only need a single file.
