# PescApp Architecture

## Runtime topology

```text
Browser / installed PWA
  ├─ Next.js React interface
  ├─ service-worker shell + recent GET cache
  └─ private local demo logbook
          │ HTTPS
Next.js server / route handlers
  ├─ safety gate (must run first)
  ├─ deterministic opportunity engine
  ├─ adapter orchestration and validation
  └─ Supabase server client (production)
          │
Supabase
  ├─ Auth
  ├─ PostgreSQL + PostGIS + RLS
  ├─ private Storage bucket
  └─ scheduled provider refresh jobs
          │
External providers
  ├─ official: IPMA, DGRM, APA, AMN, authorized IH, WoRMS
  └─ secondary: WorldTides, Open-Meteo Marine
```

## Code boundaries

- `lib/domain`: pure, testable safety and score rules. No network calls.
- `lib/adapters`: provider-specific server adapters and normalization.
- `lib/data`: schema-compatible demo fixtures and source registry.
- `components`: reusable accessible interface elements and product flows.
- `app/api`: validated server route handlers.
- `supabase`: database migration source.
- `tests`: safety, legal override, scoring, and provider failure coverage.

## Provider refresh strategy

Run provider jobs on the server or Supabase scheduled functions. Each job writes a `provider_sync_runs` audit row. On failure, do not overwrite the last valid observation. Cache according to the specific provider agreement and set the shortest valid TTL among composed inputs. The browser receives normalized records, never provider secrets or raw keys.

## Expansion strategy

Geography and jurisdiction are data, not application forks. New regions add region records, source coverage, validated locations, legal rules, species profiles, and local score configuration. Freshwater is a distinct jurisdiction/provider bundle with ICNF rules and no shared legal assumptions from maritime fishing.
