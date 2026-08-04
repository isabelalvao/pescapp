# Notes: PescApp Product and Engineering Decisions

## Product framing
- Primary question: “Devo ir à pesca, onde e quando?”
- Safety and legal status are gates, never merely negative score factors.
- The index is an explainable planning signal, not a catch prediction.
- All demo locations and regulations that lack human verification are labeled accordingly.

## Visual direction
- “Atlantic field instrument”: deep navy, Atlantic blue, sea green, warm sand, signal amber.
- Editorial display typography paired with a highly readable sans-serif body.
- Dense enough for experienced anglers, layered with plain-language summaries for beginners.
- Mobile bottom navigation and desktop rail/header; minimum 44 px touch targets.

## Architecture
- Domain: safety gate, score engine, freshness logic, legal versioning.
- Data: typed provider adapter interface plus normalized observations.
- UI: reusable condition cards, alerts, confidence and source treatments.
- Persistence: PostgreSQL/PostGIS schema, Supabase Auth/Storage-ready policies.

## Verification evidence
- `pnpm test`: 10/10 tests passed across scoring, legal/safety overrides, stale data, malformed payloads, network failures, and last-valid fallbacks.
- `pnpm lint`: passed with zero errors and zero warnings.
- `pnpm build`: compiled, type-checked, and generated all 17 routes successfully.
- `git diff --check`: passed.
- Static route set includes the five core sections, four location details, admin, data transparency, and three server APIs.
