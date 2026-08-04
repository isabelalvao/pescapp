# PescApp

PescApp is a safety-first, installable fishing-planning PWA for shore and estuary recreational fishing in Vila do Conde, Portugal.

The MVP answers “Should I go fishing, where and when?” while making uncertainty explicit. Safety and legal rules gate the deterministic opportunity score; they are never just negative scoring factors.

## Included

- Five responsive product sections: Hoje, Mapa, Planear, Espécies, Diário.
- MapLibre/OpenStreetMap map with approximate schema-compatible seed zones.
- Transparent opportunity engine with factor explanations and confidence.
- Hard safety/legal/stale-data overrides.
- Equipment recommender with reasons and rig diagram.
- Private local demo logbook with photo metadata stripping.
- Editorial console for locations, species, regulations, and sources.
- Typed IPMA, WorldTides, Open-Meteo Marine, and maritime-notice adapter seams.
- Supabase/PostGIS schema with RLS and dual legal review.
- Installable manifest, service-worker shell caching, tests, and deployment docs.

## Important MVP limitation

All local seed locations, legal rules, thresholds, and recommendations are marked for expert verification. The interface intentionally suppresses the opportunity score for those locations. Nothing in this repository claims an unverified location is legal or safe.

## Start

```powershell
pnpm install
pnpm dev
```

Open `http://localhost:3000`. No provider credentials are required for the demonstration mode.

## Verify

```powershell
pnpm test
pnpm lint
pnpm build
```

## Documentation

- Product, IA, screens, score, and states: `docs/PRODUCT_SPEC.md`
- Runtime architecture: `docs/ARCHITECTURE.md`
- Database: `supabase/schema.sql`
- Deployment and environment: `docs/DEPLOYMENT.md`
- Durable execution plan: `plan/task_plan.md`
