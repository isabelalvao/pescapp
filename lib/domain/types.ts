export type DataConfidence = "alta" | "média" | "baixa";
export type VerificationState = "verified" | "review_required" | "rejected";
export type LegalStatus = "open" | "closed" | "restricted" | "unknown";
export type LocationType = "praia" | "rochas" | "margem_portuária" | "estuário";

export interface SourceReference {
  provider: string;
  label: string;
  url: string;
  authoritative: boolean;
}

export interface Observation<T> {
  value: T;
  unit: string;
  source: SourceReference;
  retrievedAt: string;
  validAt: string;
  latitude: number;
  longitude: number;
  quality: "observed" | "forecast" | "estimated" | "demo";
}

export interface MarineConditions {
  airTemperature: Observation<number>;
  seaTemperature: Observation<number>;
  windSpeed: Observation<number>;
  windDirection: Observation<string>;
  waveHeight: Observation<number>;
  swellHeight: Observation<number>;
  swellDirection: Observation<string>;
  wavePeriod: Observation<number>;
  precipitation: Observation<number>;
  pressureTrend: Observation<"a subir" | "estável" | "a descer">;
  cloudCover: Observation<number>;
  tideState: Observation<"a encher" | "a vazar" | "preia-mar" | "baixa-mar">;
  nextHighTide: Observation<string>;
  nextLowTide: Observation<string>;
  sunrise: Observation<string>;
  sunset: Observation<string>;
  completeness: number;
}

export interface FishingLocation {
  id: string;
  slug: string;
  publicName: string;
  latitude: number;
  longitude: number;
  coordinatePrecision: "approximate";
  type: LocationType;
  allowedMethods: string[];
  access: string;
  parking: string;
  walkingDistanceM: number;
  terrain: string;
  accessibility: string;
  seabed: string;
  exposure: "abrigado" | "moderado" | "exposto";
  experience: "iniciante" | "intermédio" | "experiente";
  targetSpeciesIds: string[];
  productivePatterns: string[];
  hazards: string[];
  legalStatus: LegalStatus;
  legalNote: string;
  source: SourceReference;
  lastHumanVerification: string | null;
  verificationState: VerificationState;
  maxSafeWaveM: number;
  maxSafeWindKmh: number;
  sensitive: boolean;
}

export interface SpeciesLegalProfile {
  minimumSizeCm: number | null;
  closedSeason: string | null;
  catchRestrictions: string | null;
  status: VerificationState;
  version: string;
  reviewedAt: string | null;
  source: SourceReference;
}

export interface FishSpecies {
  id: string;
  slug: string;
  commonName: string;
  scientificName: string;
  identification: string[];
  similarSpecies: string[];
  habitat: string;
  typicalDepthM: string;
  localSeasonality: string;
  preferredConditions: string[];
  naturalBaits: string[];
  artificialLures: string[];
  hook: string;
  line: string;
  leader: string;
  rig: string;
  handling: string;
  legal: SpeciesLegalProfile;
  taxonomySource: SourceReference;
}

export type SafetyBlockCode =
  | "location_closed"
  | "access_prohibited"
  | "bar_closed"
  | "stale_data"
  | "wave_threshold"
  | "wind_threshold"
  | "legal_unknown"
  | "missing_critical_data";

export interface SafetyBlock {
  code: SafetyBlockCode;
  title: string;
  detail: string;
  source: SourceReference;
}

export interface SafetyGateResult {
  allowed: boolean;
  blocks: SafetyBlock[];
  checkedAt: string;
}

export type ScoreFactorKey =
  | "tide"
  | "wind"
  | "swell"
  | "wavePeriod"
  | "pressure"
  | "precipitation"
  | "cloud"
  | "waterTemperature"
  | "season"
  | "daylight"
  | "freshness"
  | "completeness";

export interface ScoreFactor {
  key: ScoreFactorKey;
  label: string;
  contribution: number;
  maxContribution: number;
  explanation: string;
  tone: "positive" | "neutral" | "negative";
}

export interface OpportunityResult {
  score: number | null;
  label: string;
  confidence: DataConfidence;
  confidenceReason: string;
  factors: ScoreFactor[];
  safety: SafetyGateResult;
  calculatedAt: string;
  disclaimer: string;
}

export interface OpportunityInput {
  location: FishingLocation;
  conditions: MarineConditions;
  targetSpecies: FishSpecies;
  now: Date;
  barOpen?: boolean;
  accessProhibited?: boolean;
}
