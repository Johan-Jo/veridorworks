# Veridor Works

Corporate site for **Veridor Works OÜ** — technology holding company focused on dispute operations, merchant infrastructure, and evidence workflows.

**Production:** [https://veridorworks.com](https://veridorworks.com)

## Stack

- Static HTML/CSS (single page)
- Deployed on [Vercel](https://vercel.com)
- Fonts: Google Fonts (Inter Tight, Newsreader, JetBrains Mono)

## Local preview

```bash
npx serve .
# or: python -m http.server 8080
```

Open `http://localhost:3000` (serve) or `http://localhost:8080`.

## Deploy

Push to `main` on GitHub; Vercel deploys automatically when the project is linked.

1. [vercel.com/new](https://vercel.com/new) → Import this repository
2. Framework preset: **Other** (static)
3. Add domain `veridorworks.com` (+ optional `www` → apex redirect is in `vercel.json`)

## Portfolio

- [DisputeDesk](https://disputedesk.app) — Shopify dispute & chargeback operations

## Contact form

The contact form is client-side only (shows a success message). Wire a backend (e.g. Resend API route in a future Next.js migration) before treating submissions as delivered.
