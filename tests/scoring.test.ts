import { describe, expect, it } from "vitest";
import { getDemoConditions, locations, species } from "@/lib/data/seed";
import { calculateOpportunity } from "@/lib/domain/scoring";
import type { FishingLocation } from "@/lib/domain/types";

function verifiedLocation(overrides: Partial<FishingLocation> = {}): FishingLocation {
  return {
    ...locations[0],
    legalStatus: "open",
    verificationState: "verified",
    lastHumanVerification: "2026-08-01T09:00:00.000Z",
    ...overrides
  };
}

describe("transparent opportunity score", () => {
  it("returns a bounded score and factor-level explanations after safety passes", () => {
    const now = new Date();
    const result = calculateOpportunity({ location: verifiedLocation(), targetSpecies: species[0], conditions: getDemoConditions(), now });
    expect(result.safety.allowed).toBe(true);
    expect(result.score).toBeTypeOf("number");
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.factors).toHaveLength(12);
    expect(result.factors.every((item) => item.explanation.length > 0)).toBe(true);
    expect(result.disclaimer).toContain("não garante capturas");
  });

  it("uses low confidence for demo observations", () => {
    const result = calculateOpportunity({ location: verifiedLocation(), targetSpecies: species[0], conditions: getDemoConditions(), now: new Date() });
    expect(result.confidence).toBe("baixa");
    expect(result.confidenceReason).toContain("demonstração");
  });
});

describe("Vila do Conde demo tide wording", () => {
  it("marks the 13:26 Lisbon reading as ebbing and points to low water", () => {
    const conditions = getDemoConditions(new Date("2026-08-04T12:26:00.000Z"));
    expect(conditions.tideState.value).toBe("a vazar");
    expect(conditions.nextLowTide.value).toBe("16:58");
  });

  it("includes the local bodião species profile", () => {
    expect(species.find((item) => item.id === "bodiao")?.scientificName).toBe("Labrus bergylta");
  });
});

describe("safety and legal overrides", () => {
  it("suppresses the score when a location is closed", () => {
    const result = calculateOpportunity({ location: verifiedLocation({ legalStatus: "closed" }), targetSpecies: species[0], conditions: getDemoConditions(), now: new Date() });
    expect(result.score).toBeNull();
    expect(result.label).toBe("Índice indisponível");
    expect(result.safety.blocks.map((item) => item.code)).toContain("location_closed");
  });

  it("keeps the aggregated index available when legal information is not yet imported", () => {
    const result = calculateOpportunity({ location: locations[0], targetSpecies: species[0], conditions: getDemoConditions(), now: new Date() });
    expect(result.score).toBeTypeOf("number");
    expect(result.safety.blocks.map((item) => item.code)).not.toContain("legal_unknown");
  });

  it("suppresses the score when the bar is closed", () => {
    const result = calculateOpportunity({ location: verifiedLocation(), targetSpecies: species[0], conditions: getDemoConditions(), now: new Date(), barOpen: false });
    expect(result.score).toBeNull();
    expect(result.safety.blocks.map((item) => item.code)).toContain("bar_closed");
  });

  it("keeps the index available above a reference wave threshold", () => {
    const conditions = getDemoConditions();
    conditions.waveHeight.value = 2.3;
    const result = calculateOpportunity({ location: verifiedLocation({ maxSafeWaveM: 1.4 }), targetSpecies: species[0], conditions, now: new Date() });
    expect(result.score).toBeTypeOf("number");
    expect(result.safety.blocks.map((item) => item.code)).not.toContain("wave_threshold");
  });

  it("preserves old readings but suppresses the score when critical data is stale", () => {
    const conditions = getDemoConditions();
    const old = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString();
    conditions.waveHeight.retrievedAt = old;
    conditions.windSpeed.retrievedAt = old;
    conditions.tideState.retrievedAt = old;
    const result = calculateOpportunity({ location: verifiedLocation(), targetSpecies: species[0], conditions, now: new Date() });
    expect(conditions.waveHeight.value).toBe(1.1);
    expect(result.score).toBeNull();
    expect(result.safety.blocks.map((item) => item.code)).toContain("stale_data");
  });
});
