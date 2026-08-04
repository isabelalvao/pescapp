# Deployment and Environment Configuration

## Local development

Requirements: Node.js 20+, pnpm 11+, and an optional Supabase project.

```powershell
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

The app runs without credentials in a clearly labeled demonstration mode. WorldTides and authenticated provider integrations remain disabled until their server-only variables are present.

## Supabase setup

1. Create separate development, staging, and production projects.
2. Apply `supabase/schema.sql` as a migration.
3. Create a private `catch-photos` bucket.
4. Add object policies restricting paths to `${auth.uid()}/...`.
5. Add an account-deletion Edge Function that deletes Storage objects before deleting the Auth user.
6. Promote editor roles only through an audited server procedure.
7. Never expose `SUPABASE_SERVICE_ROLE_KEY` or provider credentials to the browser.

## Scheduled refresh jobs

Recommended starting cadence, subject to each provider's terms:

- Weather/marine forecast: every 30–60 minutes.
- Tide predictions: every 6–24 hours.
- Official notices: every 15 minutes if an authorized structured feed exists; otherwise editorial polling.
- Legal rules: daily change detection plus mandatory human review.
- WoRMS taxonomy: weekly or on-demand.

Jobs authenticate with `CRON_SECRET`, validate payloads, write normalized observations, and preserve last-valid records on failure.

## Vercel or equivalent

1. Import the repository and use `pnpm build`.
2. Add variables from `.env.example` in encrypted project settings.
3. Deploy preview branches to staging Supabase only.
4. Configure scheduled functions outside client routes.
5. Verify `/api/health`, manifest installation, offline shell, security headers, RLS, and provider rate limits.
6. Run `pnpm test`, `pnpm lint`, and `pnpm build` before promotion.

## Capacitor path

The responsive PWA is the system of record. A later Capacitor shell should add native camera/storage/geolocation adapters behind consent, preserve Europe/Lisbon formatting, and use the same server APIs. Do not add background location or broad photo-library access by default.

## Production readiness gates

- Replace all demo conditions with validated provider orchestration.
- Human-verify every public location, access path, threshold, and legal state.
- Import and double-review current DGRM/AMN rules.
- Obtain authorization and confirm licensing terms for Instituto Hidrográfico data.
- Complete DPIA/privacy review, retention schedule, and incident plan.
- Test WCAG 2.2 AA, low-bandwidth/offline behavior, and Portuguese copy with target users.
- Generate production PNG PWA icons and App Store assets.
