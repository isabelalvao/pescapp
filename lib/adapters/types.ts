import type { MarineConditions, Observation, SourceReference } from "@/lib/domain/types";

export interface ProviderRequest {
  latitude: number;
  longitude: number;
  start?: string;
  end?: string;
}

export interface ProviderFailure {
  code: "unauthorized" | "rate_limited" | "invalid_response" | "network" | "not_configured";
  message: string;
  retryable: boolean;
}

export type ProviderResult<T> =
  | { ok: true; data: T; source: SourceReference; retrievedAt: string; stale: false }
  | { ok: false; error: ProviderFailure; fallback: T | null; source: SourceReference; retrievedAt: string | null; stale: boolean };

export interface DataSourceAdapter<T> {
  readonly id: string;
  readonly source: SourceReference;
  readonly authoritative: boolean;
  fetch(request: ProviderRequest, lastValid?: T): Promise<ProviderResult<T>>;
}

export interface MarineProviderPayload {
  observations: Partial<MarineConditions>;
}

export interface TideExtreme {
  time: string;
  heightM: number;
  type: "high" | "low";
}

export interface TideProviderPayload {
  extremes: TideExtreme[];
  datum: string;
}

export interface OfficialNotice {
  id: string;
  title: string;
  status: "active" | "expired";
  validFrom: string;
  validUntil: string | null;
  url: string;
}

export interface OfficialNoticePayload {
  notices: OfficialNotice[];
}

export interface LegalRulesPayload {
  jurisdiction: string;
  version: string;
  rules: Array<{ officialReference: string; title: string; validFrom: string; validUntil: string | null; sourceUrl: string }>;
}

export interface WaterQualityPayload {
  status: "suitable" | "not_suitable" | "unknown";
  sampledAt: string | null;
  classification: string | null;
}

export interface TaxonomyPayload {
  aphiaId: number;
  scientificName: string;
  authority: string | null;
  status: string;
}

export function failedResult<T>(
  source: SourceReference,
  error: ProviderFailure,
  lastValid?: T
): ProviderResult<T> {
  return {
    ok: false,
    error,
    fallback: lastValid ?? null,
    source,
    retrievedAt: null,
    stale: lastValid !== undefined
  };
}

export function toObservation<T>(params: {
  value: T;
  unit: string;
  source: SourceReference;
  validAt: string;
  request: ProviderRequest;
  quality?: Observation<T>["quality"];
}): Observation<T> {
  return {
    value: params.value,
    unit: params.unit,
    source: params.source,
    retrievedAt: new Date().toISOString(),
    validAt: params.validAt,
    latitude: params.request.latitude,
    longitude: params.request.longitude,
    quality: params.quality ?? "forecast"
  };
}
