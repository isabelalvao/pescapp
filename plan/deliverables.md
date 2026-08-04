# PescApp MVP Deliverables

## Delivery map

1. **Information architecture** — `docs/PRODUCT_SPEC.md` and five-section application navigation.
2. **Responsive screen designs** — implemented in `app/` and `components/`, with mobile bottom navigation and desktop compositions.
3. **Database schema** — `supabase/schema.sql` with PostGIS, RLS, private logbook records, legal versioning, and audit logs.
4. **Data-source adapters** — `lib/adapters/` covers IPMA, authorized IH, WorldTides, Open-Meteo Marine, DGRM, ICNF, APA InfoÁgua, AMN notices, and WoRMS.
5. **Opportunity-score specification** — `lib/domain/scoring.ts`, editable `lib/domain/config.ts`, and the specification in `docs/PRODUCT_SPEC.md`.
6. **Safety and stale-data states** — `lib/domain/safety.ts`, warning UI, provider fallback union, and state matrix in the product specification.
7. **Functional PWA** — Next.js application, manifest, icon, service worker, install prompt, offline first-party shell cache.
8. **Tests** — `tests/scoring.test.ts` and `tests/adapters.test.ts`; 10 passing tests.
9. **Administration interface** — `/admin` with location, species, regulation, and source review queues.
10. **Deployment/environment documentation** — `.env.example`, `docs/DEPLOYMENT.md`, `docs/ARCHITECTURE.md`, and `README.md`.

## Verification

- `pnpm test` — passed, 10 tests.
- `pnpm lint` — passed, no warnings.
- `pnpm build` — passed, 17 routes generated.
- `git diff --check` — passed.

## Honest production boundary

The repository is a complete, functional MVP in demonstration mode. It is not operational maritime advice until real provider contracts are activated and local experts verify locations, access, thresholds, species patterns, and versioned rules. The UI enforces this boundary by suppressing the index for every unverified seed location.
