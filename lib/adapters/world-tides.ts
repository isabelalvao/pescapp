import { z } from "zod";
import { sources } from "@/lib/data/sources";
import type { DataSourceAdapter, ProviderRequest, ProviderResult, TideProviderPayload } from "@/lib/adapters/types";
import { failedResult } from "@/lib/adapters/types";

const responseSchema = z.object({
  extremes: z.array(z.object({ dt: z.number(), height: z.number(), type: z.enum(["High", "Low"]) }))
});

export class WorldTidesAdapter implements DataSourceAdapter<TideProviderPayload> {
  readonly id = "world-tides";
  readonly source = sources.worldTides;
  readonly authoritative = false;

  async fetch(request: ProviderRequest, lastValid?: TideProviderPayload): Promise<ProviderResult<TideProviderPayload>> {
    const apiKey = process.env.WORLDTIDES_API_KEY;
    if (!apiKey) {
      return failedResult(this.source, { code: "not_configured", message: "WORLDTIDES_API_KEY não está configurada no servidor.", retryable: false }, lastValid);
    }
    const params = new URLSearchParams({
      extremes: "",
      lat: request.latitude.toString(),
      lon: request.longitude.toString(),
      key: apiKey
    });
    try {
      const response = await fetch(`https://www.worldtides.info/api/v3?${params}`, { next: { revalidate: 1800 } });
      if (!response.ok) {
        return failedResult(this.source, { code: response.status === 401 ? "unauthorized" : "network", message: `WorldTides respondeu com ${response.status}.`, retryable: response.status >= 500 }, lastValid);
      }
      const parsed = responseSchema.safeParse(await response.json());
      if (!parsed.success) {
        return failedResult(this.source, { code: "invalid_response", message: "Resposta de marés inválida.", retryable: false }, lastValid);
      }
      const data: TideProviderPayload = {
        extremes: parsed.data.extremes.map((item) => ({
          time: new Date(item.dt * 1000).toISOString(),
          heightM: item.height,
          type: item.type === "High" ? "high" : "low"
        })),
        datum: "WorldTides provider datum"
      };
      return { ok: true, data, source: this.source, retrievedAt: new Date().toISOString(), stale: false };
    } catch {
      return failedResult(this.source, { code: "network", message: "Falha temporária ao obter marés.", retryable: true }, lastValid);
    }
  }
}
