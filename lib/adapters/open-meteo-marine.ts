import { z } from "zod";
import { sources } from "@/lib/data/sources";
import type { DataSourceAdapter, MarineProviderPayload, ProviderRequest, ProviderResult } from "@/lib/adapters/types";
import { failedResult, toObservation } from "@/lib/adapters/types";

const responseSchema = z.object({
  hourly: z.object({
    time: z.array(z.string()),
    wave_height: z.array(z.number().nullable()),
    wave_direction: z.array(z.number().nullable()),
    wave_period: z.array(z.number().nullable()),
    sea_surface_temperature: z.array(z.number().nullable()).optional()
  })
});

function cardinal(degrees: number): string {
  const points = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  return points[Math.round(degrees / 45) % 8];
}

export class OpenMeteoMarineAdapter implements DataSourceAdapter<MarineProviderPayload> {
  readonly id = "open-meteo-marine";
  readonly source = sources.openMeteo;
  readonly authoritative = false;

  async fetch(request: ProviderRequest, lastValid?: MarineProviderPayload): Promise<ProviderResult<MarineProviderPayload>> {
    const params = new URLSearchParams({
      latitude: request.latitude.toString(),
      longitude: request.longitude.toString(),
      hourly: "wave_height,wave_direction,wave_period,sea_surface_temperature",
      timezone: "Europe/Lisbon",
      forecast_days: "2"
    });

    try {
      const response = await fetch(`https://marine-api.open-meteo.com/v1/marine?${params}`, {
        headers: { Accept: "application/json" },
        next: { revalidate: 900 }
      });
      if (!response.ok) {
        return failedResult(this.source, { code: response.status === 429 ? "rate_limited" : "network", message: `Open-Meteo respondeu com ${response.status}.`, retryable: response.status >= 500 || response.status === 429 }, lastValid);
      }
      const parsed = responseSchema.safeParse(await response.json());
      if (!parsed.success) {
        return failedResult(this.source, { code: "invalid_response", message: "A resposta marinha não corresponde ao contrato esperado.", retryable: false }, lastValid);
      }
      const now = Date.now();
      const index = parsed.data.hourly.time.findIndex((time) => new Date(time).getTime() >= now);
      const i = index < 0 ? 0 : index;
      const validAt = parsed.data.hourly.time[i];
      const waveHeight = parsed.data.hourly.wave_height[i];
      const waveDirection = parsed.data.hourly.wave_direction[i];
      const wavePeriod = parsed.data.hourly.wave_period[i];
      const seaTemperature = parsed.data.hourly.sea_surface_temperature?.[i];
      const observations: MarineProviderPayload["observations"] = {};
      if (waveHeight !== null) observations.waveHeight = toObservation({ value: waveHeight, unit: "m", source: this.source, validAt, request });
      if (waveDirection !== null) observations.swellDirection = toObservation({ value: cardinal(waveDirection), unit: "cardinal", source: this.source, validAt, request });
      if (wavePeriod !== null) observations.wavePeriod = toObservation({ value: wavePeriod, unit: "s", source: this.source, validAt, request });
      if (seaTemperature !== null && seaTemperature !== undefined) observations.seaTemperature = toObservation({ value: seaTemperature, unit: "°C", source: this.source, validAt, request });
      return { ok: true, data: { observations }, source: this.source, retrievedAt: new Date().toISOString(), stale: false };
    } catch {
      return failedResult(this.source, { code: "network", message: "Não foi possível contactar o fornecedor secundário.", retryable: true }, lastValid);
    }
  }
}
