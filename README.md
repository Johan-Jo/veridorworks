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

## CI

GitHub Actions workflow is in `.github/workflows/ci.yml`. If push is rejected for workflow scope, run:

```bash
gh auth refresh -s workflow
git add .github/workflows/ci.yml
git commit -m "chore: add CI workflow"
git push
```

## Deploy

Push to `main` on GitHub; Vercel deploys automatically when the project is linked.

1. [vercel.com/new](https://vercel.com/new) → Import this repository
2. Framework preset: **Other** (static)
3. Add domain `veridorworks.com` (+ optional `www` → apex redirect is in `vercel.json`)

## Portfolio

- [DisputeDesk](https://disputedesk.app) — Shopify dispute & chargeback operations

## Contact form (Resend)

Submissions are sent to **info@veridorworks.com** via `POST /api/contact` and [Resend](https://resend.com).

**Vercel environment variables** (Production + Preview):

| Variable | Example |
|----------|---------|
| `RESEND_API_KEY` | `re_…` from Resend dashboard |
| `EMAIL_FROM` | `Veridor Works <info@veridorworks.com>` (must be a verified sender in Resend) |

`CONTACT_TO_EMAIL` is optional; it defaults to `info@veridorworks.com`.

**Local testing** (API + static site):

```bash
npm install
npx vercel dev
```

Plain `npx serve` only serves the HTML; the form needs `vercel dev` for `/api/contact`.
