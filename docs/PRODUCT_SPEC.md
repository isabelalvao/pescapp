# PescApp — Product and Interaction Specification

## 1. Information architecture

The primary navigation is deliberately outcome-oriented:

| Section | Primary job | Main objects |
| --- | --- | --- |
| Hoje | Decide whether to continue planning | safety gate, opportunity index, best window, conditions, target species |
| Mapa | Compare curated and validated zones | location, access, exposure, hazards, legal state, verification |
| Planear | Build a trip and equipment checklist | date/time, location, species, technique, budget, experience |
| Espécies | Identify fish and prepare responsibly | biology, similar species, habitat, tackle, separately versioned law |
| Diário | Learn from private personal records | catch, private coordinate, photo, outcome, weather/tide snapshot |

Supporting routes:

- `/locais/[slug]`: location conditions, charts, access, hazards, sources, human verification.
- `/admin`: editorial queues for locations, species, legal rules, and provider status.
- `/sobre-dados`: provenance, limitations, and decision hierarchy.
- `/api/conditions`, `/api/score`, `/api/health`: server-side integration surface.

Future regions use the same entities and add `region`, `jurisdiction`, provider coverage, and ruleset bindings. Madeira, the Azores, and freshwater remain excluded from the first-release content.

## 2. Responsive screen design

### Today / decision screen

Desktop uses a two-column decision instrument. The left side gives the score or blocking warning; the right side gives the best indicative window and selected zone. A condition grid, tide/swell graph, targets, and authoritative-source prompts follow in decreasing priority.

Mobile preserves the exact decision order. Primary navigation moves to a thumb-reachable five-item bottom bar. Cards become a single column and raw hourly data remains horizontally scrollable.

### Map

Desktop pairs a scrollable curated list with a MapLibre map. Mobile prioritizes the map with a selected-location sheet and renders the list beneath it. Coordinates are approximate; sensitive and unsafe structures never enter the public dataset.

### Planner

A persistent input column feeds a result canvas. The output starts with the safety/legal result, then presents tackle with a reason for every item, a rig diagram, safety equipment, and legal reminders.

### Species

A searchable species rail controls a detail article. Biological identification and tackle appear first. Legal information is visually and structurally separated and remains blocked until double-reviewed.

### Logbook

Summary counts lead into a private capture form. Exact locations are private by default. The browser re-encodes photos before storage, removing original EXIF/GPS metadata.

### Administration

Four review queues cover locations, species, legal rules, and sources. Legal publishing requires an official reference, version, content hash, validity dates, and two distinct human reviewers in the database schema.

## 3. Domain and database model

The executable PostGIS schema is at `supabase/schema.sql`.

Key boundaries:

- `locations` stores approximate public geography, access, hazards, thresholds, review state, and human verification.
- `species` stores biology only.
- `legal_rules` stores versioned legal statements with dual review; join tables bind rules to species and locations.
- `provider_observations` stores one normalized measurement with source, retrieval time, valid time, unit, point, and quality.
- `score_configs` stores editable versioned weights.
- `catch_records` keeps private and approximate geometry separate and is protected by user-owned RLS.
- `editor_audit_log` records every publication decision.

## 4. Data-source adapter contract

`DataSourceAdapter<T>` exposes:

```ts
interface DataSourceAdapter<T> {
  readonly id: string;
  readonly source: SourceReference;
  readonly authoritative: boolean;
  fetch(request: ProviderRequest, lastValid?: T): Promise<ProviderResult<T>>;
}
```

`ProviderResult` is a discriminated union. Success contains normalized data and retrieval time. Failure contains a typed error, retryability, optional last-valid fallback, and a `stale` flag. API keys exist only in server adapters.

Implemented adapters:

- Open-Meteo Marine: working secondary wave/temperature adapter with Zod response validation.
- WorldTides: working authenticated tide adapter, inactive without `WORLDTIDES_API_KEY`.
- IPMA Marine: guarded integration seam pending an approved endpoint/contract mapping.
- Maritime notices: guarded manual/editorial seam because no structured official feed is assumed.
- Instituto Hidrográfico: authorization-gated tide adapter.
- DGRM: legal draft-import adapter that cannot auto-publish.
- APA InfoÁgua: water-quality adapter seam pending a validated structured contract.
- ICNF: disabled future freshwater rules adapter, deliberately not wired into this release.
- WoRMS: working scientific-name taxonomy lookup with response validation.

## 5. Opportunity-score specification

The opportunity index is deterministic, explainable, and never an AI output.

### Execution sequence

1. Normalize observations and attach provenance.
2. Run the safety/legal gate.
3. If blocked, return `score: null` and explicit blocks.
4. Otherwise, apply editable factor weights.
5. Bound the result to `0..100`.
6. Derive confidence from source quality, freshness, and completeness.
7. Return factor contribution, maximum contribution, explanation, calculation time, and disclaimer.

Default weights are in `lib/domain/config.ts`:

| Factor | Maximum |
| --- | ---: |
| Base | 20 |
| Tide | 15 |
| Wind relative to exposure | 10 |
| Swell | 8 |
| Water temperature | 8 |
| Season | 7 |
| Pressure trend | 6 |
| Wave period | 5 |
| Cloud | 5 |
| Daylight | 5 |
| Precipitation | 4 |
| Freshness | 4 |
| Completeness | 3 |

The initial generic ratios are intentionally conservative. Production rollout requires species-specific profiles, locally reviewed patterns, location-specific wind bearings, calibrated thresholds, and backtesting against observations—not catch guarantees.

## 6. Safety, legal, and stale-data states

| Trigger | UI result | Score |
| --- | --- | ---: |
| Location closed | “Local encerrado” + official source | hidden |
| Legal status unknown | “Estado legal por confirmar” | hidden |
| Access prohibited | “Acesso proibido”; no workaround shown | hidden |
| Bar closed | “Barra fechada” + maritime authority | hidden |
| Wave/wind above validated threshold | exact measurement and configured threshold | hidden |
| Critical observation missing | missing fields named | hidden |
| Critical data older than 180 min | last reading retained, clearly stale | hidden |
| Provider temporarily fails with cached data | cached reading shown with stale banner | depends on critical-data age |
| Secondary provider only | source marked non-authoritative; lower confidence | available only if safety passes |

The interface never uses “safe” as an absolute state. It describes gate checks, residual uncertainty, and the need to observe conditions locally. PescApp is never presented as a substitute for official maritime advice.

## Privacy and GDPR controls

- Explicit consent before requesting geolocation.
- Guest mode stores the logbook locally.
- Exact catch location private by default; public approximate geometry is a separate field.
- Photo re-encoding occurs before storage; production uploads must reject objects without `photo_metadata_stripped = true`.
- User-owned RLS protects trips and catches.
- UI includes JSON export and deletion; production account deletion should invoke a server-side cascade and storage cleanup job.
- No advertising identifier or background location access is required.
