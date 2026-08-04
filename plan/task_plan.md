# Task Plan: PescApp MVP

## Goal
Deliver a responsive, installable Next.js PWA for shore and estuary recreational fishing in Vila do Conde, with transparent scoring, safety-first overrides, curated seed content, admin review flows, and deployment documentation.

## Phases
- [x] Phase 1: Establish product architecture, project setup, and durable specifications
- [x] Phase 2: Implement domain models, seed data, scoring engine, adapters, and API routes
- [x] Phase 3: Implement responsive user and administration interfaces
- [x] Phase 4: Add PWA/offline support, privacy flows, tests, and documentation
- [x] Phase 5: Verify build, tests, accessibility-sensitive states, and deliver

## Key Questions
1. Can a visitor understand the go/no-go decision, best window, place, species, and kit in under 30 seconds?
2. Does every recommendation pass through a legal and safety gate before presentation?
3. Are legal claims visibly sourced, versioned, and separated from biological guidance?
4. Can provider failures preserve the last valid observation while clearly marking stale data?
5. Is the initial Vila do Conde content visibly marked for local expert verification?

## Decisions Made
- Use Next.js App Router, TypeScript, Tailwind CSS, and a server-first domain layer.
- Use schema-compatible curated demo data; uncertain safety/legal content is explicitly unverified and never presented as permission or official advice.
- Keep provider integrations behind typed adapters and server-only environment variables.
- Use deterministic SVG/CSS visualizations for fast, accessible rendering without a chart dependency.
- Implement the MVP with a Supabase-ready SQL schema and local demo persistence where credentials are absent.

## Errors Encountered
- `uv --version` failed because uv is not installed in this environment; the application is Node-based and pnpm 11.9.0 is available, so pnpm is used instead.
- `pnpm install` resolved all packages but exited with `ERR_PNPM_IGNORED_BUILDS`; pnpm 11 requires explicit approval for esbuild, sharp, and unrs-resolver build scripts. Approval is deferred to the verification phase.
- The first `pnpm test` run failed because the Vitest configuration was loaded as CommonJS while its Vite dependency is ESM-only. The package was marked as ESM and the config now resolves its root through `import.meta.url`.
- The first `pnpm lint` run found no flat configuration because ESLint 9 no longer reads legacy defaults. Added the Next.js Core Web Vitals flat config and generated-directory ignores.
- The initial flat-config import needed the explicit `.js` extension under ESM; the import path was corrected.
- `eslint-config-next` 15 exports a legacy configuration object rather than an iterable flat config. Switched to ESLint's `FlatCompat` bridge for Next.js 15 compatibility.
- The first production build succeeded but Tailwind warned that it had not loaded the TypeScript configuration under the ESM package. Converted the config to ESM JavaScript before the final build.
- A background production-server smoke-test command was rejected by the environment policy. The equivalent compile, route generation, type checking, and static-page rendering completed successfully through `next build`; no background process was left running.

## Status
**Complete** - All requested MVP deliverables are implemented and verified. Production launch remains correctly gated on real provider credentials and human validation of local/legal seed content.
