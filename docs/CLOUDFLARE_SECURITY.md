# Coolify + Cloudflare production security

The application is designed to run as a normal Node.js service in Coolify.
Every accepted page opening is an atomic increment in Supabase. Cloudflare
provides DNS by default; it becomes an HTTP protection layer only when the DNS
record is set to **Proxied** (orange cloud).

## Required secrets

In the Coolify application environment settings, add
`SUPABASE_SERVICE_ROLE_KEY` as a protected/secret variable, never in the
repository or a public build argument. Add `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY` as normal application variables; they are
public configuration by design. Redeploy after changing a secret.

Do not upload `.env.local`, `.dev.vars`, or `coolify-creds.txt`. Run:

```bash
npm run security:check-secrets
```

before packaging or sharing the workspace.

## Optional Cloudflare rate limit

If the DNS record remains **DNS Only** (grey cloud), Cloudflare does not see
the HTTP requests and this rule has no effect. For protection at the edge,
set the public web record to **Proxied**, then create a **Security → Security
rules → Rate limiting rule** for non-verified bots that repeatedly open detail
pages. A practical starting point is 60 requests per minute per source IP,
with a 10-minute block. Monitor Security Events and tune the threshold before
making it stricter.

Use this expression when the expression editor is available:

```text
not cf.client.bot and (
  (starts_with(http.request.uri.path, "/articles/") and http.request.uri.path ne "/articles/") or
  (starts_with(http.request.uri.path, "/news/") and http.request.uri.path ne "/news/") or
  (starts_with(http.request.uri.path, "/vision/") and http.request.uri.path ne "/vision/") or
  (starts_with(http.request.uri.path, "/archive/") and http.request.uri.path ne "/archive/") or
  (starts_with(http.request.uri.path, "/testimonials/") and http.request.uri.path ne "/testimonials/")
)
```

The database design remains safe if this rule is absent: traffic can increase
the counter and database request volume, but it cannot create one permanent row
per request. The Cloudflare rule additionally limits forged counts and cost.
If the domain must remain DNS Only, use Coolify/Traefik or an upstream reverse
proxy rate limit instead.

## Deployment order

1. Apply `supabase/migrations/202608250001_secure_page_view_counters.sql` in
   Supabase SQL Editor or through the Supabase CLI.
2. In Coolify, use the Node deployment commands `npm install`, `npm run build`,
   and `npm start` (or the equivalent detected by your build pack).
3. Open one detail page twice and verify the displayed count increases twice.
4. Verify **Visits today**, **Total views**, and **Top pages** in the dashboard.
5. After verification and a backup, optionally delete old
   `site_settings` rows whose IDs begin with `analytics:view:`.
