-- PescApp PostgreSQL/PostGIS schema
-- Apply through Supabase migrations. Legal records must only be published after human review.

create extension if not exists postgis;
create extension if not exists pgcrypto;

create type public.review_state as enum ('draft', 'in_review', 'verified', 'rejected', 'superseded');
create type public.legal_state as enum ('open', 'closed', 'restricted', 'unknown');
create type public.location_kind as enum ('beach', 'rocks', 'harbour_edge', 'estuary');
create type public.observation_quality as enum ('observed', 'forecast', 'estimated');
create type public.location_privacy as enum ('private', 'approximate');
create type public.catch_outcome as enum ('released', 'retained');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  locale text not null default 'pt-PT',
  timezone text not null default 'Europe/Lisbon',
  is_editor boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.sources (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  label text not null,
  url text not null,
  authoritative boolean not null default false,
  terms_url text,
  cache_ttl_seconds integer not null check (cache_ttl_seconds > 0),
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  unique (provider, url)
);

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  public_name text not null,
  approximate_position geography(point, 4326) not null,
  coordinate_precision_m integer not null default 250 check (coordinate_precision_m >= 100),
  kind public.location_kind not null,
  allowed_methods text[] not null default '{}',
  access_description text not null,
  parking_description text,
  walking_distance_m integer check (walking_distance_m >= 0),
  terrain text,
  accessibility text,
  seabed text,
  exposure text check (exposure in ('sheltered', 'moderate', 'exposed')),
  experience_level text check (experience_level in ('beginner', 'intermediate', 'experienced')),
  productive_patterns text[] not null default '{}',
  hazards text[] not null default '{}',
  legal_status public.legal_state not null default 'unknown',
  legal_note text not null,
  max_safe_wave_m numeric(4,2) check (max_safe_wave_m > 0),
  max_safe_wind_kmh numeric(5,1) check (max_safe_wind_kmh > 0),
  sensitive boolean not null default false,
  review_state public.review_state not null default 'draft',
  last_human_verification timestamptz,
  verified_by uuid references public.profiles(id),
  source_id uuid not null references public.sources(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint verified_location_has_reviewer check (review_state <> 'verified' or (verified_by is not null and last_human_verification is not null))
);
create index locations_position_gix on public.locations using gist (approximate_position);
create index locations_public_idx on public.locations (review_state, sensitive) where review_state = 'verified' and sensitive = false;

create table public.species (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  common_name_pt text not null,
  scientific_name text not null,
  worms_aphia_id integer,
  identification jsonb not null default '[]',
  similar_species jsonb not null default '[]',
  habitat text not null,
  typical_depth text,
  local_seasonality text,
  preferred_conditions jsonb not null default '[]',
  natural_baits text[] not null default '{}',
  artificial_lures text[] not null default '{}',
  hook_guidance text,
  line_guidance text,
  leader_guidance text,
  rig_guidance text,
  handling_guidance text,
  biological_review_state public.review_state not null default 'draft',
  taxonomy_source_id uuid references public.sources(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.location_species (
  location_id uuid not null references public.locations(id) on delete cascade,
  species_id uuid not null references public.species(id) on delete cascade,
  confidence text not null default 'low' check (confidence in ('low', 'medium', 'high')),
  evidence text,
  primary key (location_id, species_id)
);

create table public.legal_rules (
  id uuid primary key default gen_random_uuid(),
  jurisdiction text not null,
  rule_type text not null check (rule_type in ('licence', 'minimum_size', 'closed_season', 'catch_limit', 'method', 'access', 'notice')),
  title text not null,
  structured_value jsonb not null,
  official_reference text not null,
  source_id uuid not null references public.sources(id),
  valid_from date not null,
  valid_until date,
  version text not null,
  review_state public.review_state not null default 'draft',
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  second_reviewed_by uuid references public.profiles(id),
  published_at timestamptz,
  content_hash text not null,
  supersedes_id uuid references public.legal_rules(id),
  created_at timestamptz not null default now(),
  constraint legal_reviewers_are_distinct check (reviewed_by is null or second_reviewed_by is null or reviewed_by <> second_reviewed_by),
  constraint verified_legal_rule_complete check (review_state <> 'verified' or (reviewed_by is not null and second_reviewed_by is not null and reviewed_at is not null and published_at is not null))
);
create unique index legal_rule_version_idx on public.legal_rules (jurisdiction, rule_type, official_reference, version);

create table public.species_legal_rules (
  species_id uuid not null references public.species(id) on delete cascade,
  legal_rule_id uuid not null references public.legal_rules(id) on delete restrict,
  primary key (species_id, legal_rule_id)
);

create table public.location_legal_rules (
  location_id uuid not null references public.locations(id) on delete cascade,
  legal_rule_id uuid not null references public.legal_rules(id) on delete restrict,
  primary key (location_id, legal_rule_id)
);

create table public.provider_observations (
  id bigint generated always as identity primary key,
  source_id uuid not null references public.sources(id),
  parameter text not null,
  numeric_value double precision,
  text_value text,
  unit text not null,
  position geography(point, 4326) not null,
  retrieved_at timestamptz not null,
  valid_at timestamptz not null,
  quality public.observation_quality not null,
  provider_record_id text,
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  constraint observation_has_one_value check ((numeric_value is not null)::integer + (text_value is not null)::integer = 1)
);
create index provider_observation_lookup_idx on public.provider_observations (parameter, valid_at desc);
create index provider_observation_position_gix on public.provider_observations using gist (position);

create table public.provider_sync_runs (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.sources(id),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null check (status in ('running', 'success', 'partial', 'failed')),
  records_written integer not null default 0,
  fallback_preserved boolean not null default false,
  error_code text,
  error_detail text
);

create table public.score_configs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  version text not null unique,
  weights jsonb not null,
  stale_after_minutes integer not null,
  active boolean not null default false,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index one_active_score_config on public.score_configs (active) where active = true;

create table public.saved_trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  location_id uuid references public.locations(id),
  trip_date date not null,
  available_start timestamptz not null,
  available_end timestamptz not null,
  target_species_id uuid references public.species(id),
  plan_snapshot jsonb not null,
  created_at timestamptz not null default now()
);

create table public.catch_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  species_id uuid references public.species(id),
  private_position geography(point, 4326),
  approximate_position geography(point, 4326),
  location_label text,
  location_privacy public.location_privacy not null default 'private',
  caught_at timestamptz not null,
  length_cm numeric(6,2) not null check (length_cm > 0),
  weight_kg numeric(7,3) check (weight_kg > 0),
  bait text,
  equipment jsonb not null default '{}',
  outcome public.catch_outcome not null,
  photo_path text,
  photo_metadata_stripped boolean not null default false,
  notes text,
  conditions_snapshot jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint retained_requires_user_confirmation check (outcome <> 'retained' or notes is not null)
);
create index catch_records_user_time_idx on public.catch_records (user_id, caught_at desc);

create table public.editor_audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid not null references public.profiles(id),
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.saved_trips enable row level security;
alter table public.catch_records enable row level security;
alter table public.locations enable row level security;
alter table public.species enable row level security;
alter table public.legal_rules enable row level security;
alter table public.editor_audit_log enable row level security;

create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users own saved trips" on public.saved_trips for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users own catch records" on public.catch_records for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Public reads verified non-sensitive locations" on public.locations for select using (review_state = 'verified' and sensitive = false);
create policy "Public reads reviewed biology" on public.species for select using (biological_review_state = 'verified');
create policy "Public reads active verified legal rules" on public.legal_rules for select using (review_state = 'verified' and valid_from <= current_date and (valid_until is null or valid_until >= current_date));

-- Editor mutations should be performed through security-definer RPCs that check
-- profiles.is_editor, enforce dual legal review, and append editor_audit_log.
-- Storage bucket `catch-photos` must be private. Object paths begin with auth.uid().
revoke update on public.profiles from authenticated;
grant update (display_name, locale, timezone, updated_at) on public.profiles to authenticated;
