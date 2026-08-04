import { sources } from "@/lib/data/sources";
import type { DataSourceAdapter, MarineProviderPayload, ProviderRequest, ProviderResult } from "@/lib/adapters/types";
import { failedResult } from "@/lib/adapters/types";

export class IpmaMarineAdapter implements DataSourceAdapter<MarineProviderPayload> {
  readonly id = "ipma-marine";
  readonly source = sources.ipma;
  readonly authoritative = true;

  async fetch(_request: ProviderRequest, lastValid?: MarineProviderPayload): Promise<ProviderResult<MarineProviderPayload>> {
    const endpoint = process.env.IPMA_MARINE_ENDPOINT;
    if (!endpoint) {
      return failedResult(this.source, { code: "not_configured", message: "Defina IPMA_MARINE_ENDPOINT após confirmar o contrato de dados aplicável.", retryable: false }, lastValid);
    }
    return failedResult(this.source, { code: "not_configured", message: "O mapeamento do feed IPMA deve ser validado por versão antes de ativar produção.", retryable: false }, lastValid);
  }
}
