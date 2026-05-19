# Fix veridorworks.com on Vercel

Your screenshot shows **“linked to another Vercel account”**. The site will not go live until DNS is updated at your **domain registrar** (where you bought `veridorworks.com` — GoDaddy, Namecheap, Cloudflare, etc.).

## Step 1 — Add DNS records (registrar)

Add these **exact** records (copy from Vercel → Domains → `www.veridorworks.com` if values change):

| Type | Name / Host | Value |
|------|-------------|--------|
| **TXT** | `_vercel` | `vc-domain-verify=www.veridorworks.com,8bb2b852438e7c42201b` |
| **CNAME** | `www` | `5d5b5d4378dcc17a.vercel-dns-016.com` |

Notes:

- Some registrars want `_vercel` as the full host ` _vercel.veridorworks.com`; others only `_vercel` under the zone `veridorworks.com`.
- CNAME value may end with `.` or not — both are usually fine.
- TTL: 300–3600 seconds. Propagation can take **5 minutes to 48 hours**.

After `www` verifies, Vercel may ask for an **A** record on the apex (`@`):

| Type | Name | Value |
|------|------|--------|
| **A** | `@` | `76.76.21.21` |

Use whatever Vercel shows for `veridorworks.com` after `www` is verified.

## Step 2 — Verify in Vercel

1. Open **Vercel → veridorworks project → Settings → Domains**.
2. Click **Refresh** next to `www.veridorworks.com`.
3. Wait until status is **Valid Configuration** (not “Verification Needed”).

## Step 3 — Resolve “another Vercel account”

The TXT record proves you own the domain so this team can use it.

**If you still see the warning after adding TXT:**

1. Sign in to any **other** Vercel account/team you use (personal vs `estimatepro`).
2. **Settings → Domains** → remove `veridorworks.com` / `www.veridorworks.com` from the old project.
3. Return to this project and **Refresh** again.

## Step 4 — Avoid redirect loops

In Vercel you currently have:

- `veridorworks.com` → redirects to `www.veridorworks.com`

Pick **one** canonical host:

| Canonical URL | Vercel setup |
|---------------|----------------|
| **https://veridorworks.com** (recommended) | Production = `veridorworks.com`. Edit `www` → redirect to apex. Remove apex→www redirect. |
| **https://www.veridorworks.com** | Keep apex→www. Do not add repo redirects from www→apex. |

The repo `vercel.json` no longer defines host redirects so it will not fight the Vercel dashboard.

## Step 5 — Resend email (separate)

After the domain is verified on Vercel, verify the same domain in **Resend** so `info@veridorworks.com` can send/receive.

---

**Working now without custom domain:** https://veridorworks.vercel.app
