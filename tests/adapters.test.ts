import { afterEach, describe, expect, it, vi } from "vitest";
import { OpenMeteoMarineAdapter } from "@/lib/adapters/open-meteo-marine";
import type { MarineProviderPayload } from "@/lib/adapters/types";

afterEach(() => vi.unstubAllGlobals());

describe("provider failure handling", () => {
  it("marks the last valid response as stale during a network failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const fallback: MarineProviderPayload = { observations: {} };
    const result = await new OpenMeteoMarineAdapter().fetch({ latitude: 41.35, longitude: -8.75 }, fallback);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.stale).toBe(true);
    expect(result.fallback).toBe(fallback);
    expect(result.error.code).toBe("network");
  });

  it("rejects malformed provider payloads without throwing", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ hourly: { unexpected: [] } }), { status: 200 })));
    const result = await new OpenMeteoMarineAdapter().fetch({ latitude: 41.35, longitude: -8.75 });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("invalid_response");
    expect(result.stale).toBe(false);
  });

  it("normalizes a valid secondary marine response with units and provenance", async () => {
    const time = new Date(Date.now() + 60_000).toISOString();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ hourly: { time: [time], wave_height: [1.2], wave_direction: [315], wave_period: [9], sea_surface_temperature: [17.4] } }), { status: 200 })));
    const result = await new OpenMeteoMarineAdapter().fetch({ latitude: 41.35, longitude: -8.75 });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.data.observations.waveHeight?.unit).toBe("m");
    expect(result.data.observations.waveHeight?.source.provider).toBe("Open-Meteo Marine");
    expect(result.data.observations.waveHeight?.latitude).toBe(41.35);
    expect(result.data.observations.waveHeight?.validAt).toBe(time);
  });
});
