import { z } from "zod";
import { sources } from "@/lib/data/sources";
import type {
  DataSourceAdapter,
  LegalRulesPayload,
  ProviderRequest,
  ProviderResult,
  TaxonomyPayload,
  TideProviderPayload,
  WaterQualityPayload
} from "@/lib/adapters/types";
import { failedResult } from "@/lib/adapters/types";

/**
 * Authorized IH integration seam. The public tide tables are not treated as a
 * programmatic API; activation requires an approved endpoint and contract map.
 */
export class InstitutoHidrograficoAdapter implements DataSourceAdapter<TideProviderPayload> {
  readonly id = "instituto-hidrografico-tides";
  readonly source = sources.ih;
  readonly authoritative = true;

  async fetch(_request: ProviderRequest, lastValid?: TideProviderPayload): Promise<ProviderResult<TideProviderPayload>> {
    return failedResult(this.source, {
      code: "not_configured",
      message: process.env.IH_TIDES_ENDPOINT
        ? "O endpoint IH está definido, mas o contrato ainda não foi aprovado para ingestão."
        : "Acesso programático do Instituto Hidrográfico não autorizado/configurado.",
      retryable: false
    }, lastValid);
  }
}

/** DGRM legal rules are imported into drafts and can never auto-publish. */
export class DgrmRulesAdapter implements DataSourceAdapter<LegalRulesPayload> {
  readonly id = "dgrm-rules";
  readonly source = sources.dgrm;
  readonly authoritative = true;

  async fetch(_request: ProviderRequest, lastValid?: LegalRulesPayload): Promise<ProviderResult<LegalRulesPayload>> {
    return failedResult(this.source, {
      code: "not_configured",
      message: "Configure uma fonte DGRM aprovada; qualquer importação permanece em rascunho para dupla revisão humana.",
      retryable: false
    }, lastValid);
  }
}

/** Future-only freshwater rules adapter; not wired into the maritime MVP. */
export class IcnfFreshwaterRulesAdapter implements DataSourceAdapter<LegalRulesPayload> {
  readonly id = "icnf-freshwater-rules";
  readonly source = sources.icnf;
  readonly authoritative = true;

  async fetch(_request: ProviderRequest, lastValid?: LegalRulesPayload): Promise<ProviderResult<LegalRulesPayload>> {
    return failedResult(this.source, {
      code: "not_configured",
      message: "Adaptador reservado para a futura expansão a águas interiores; não está ativo no MVP marítimo.",
      retryable: false
    }, lastValid);
  }
}

/** APA InfoÁgua import seam for bathing-water warnings and classifications. */
export class ApaInfoAguaAdapter implements DataSourceAdapter<WaterQualityPayload> {
  readonly id = "apa-infoagua";
  readonly source = sources.apa;
  readonly authoritative = true;

  async fetch(_request: ProviderRequest, lastValid?: WaterQualityPayload): Promise<ProviderResult<WaterQualityPayload>> {
    return failedResult(this.source, {
      code: "not_configured",
      message: "APA_INFOAGUA_ENDPOINT não tem um contrato estruturado validado nesta instalação.",
      retryable: false
    }, lastValid);
  }
}

const wormsSchema = z.array(z.object({
  AphiaID: z.number(),
  scientificname: z.string(),
  authority: z.string().nullable().optional(),
  status: z.string()
}));

export class WormsTaxonomyAdapter {
  readonly id = "worms-taxonomy";
  readonly source = sources.worms;
  readonly authoritative = true;

  async fetchSpecies(scientificName: string, lastValid?: TaxonomyPayload): Promise<ProviderResult<TaxonomyPayload>> {
    const normalized = scientificName.trim();
    if (!normalized) return failedResult(this.source, { code: "invalid_response", message: "Nome científico vazio.", retryable: false }, lastValid);
    const baseUrl = process.env.WORMS_API_BASE_URL ?? "https://www.marinespecies.org/rest";
    try {
      const response = await fetch(`${baseUrl}/AphiaRecordsByName/${encodeURIComponent(normalized)}?like=false&marine_only=true`, { next: { revalidate: 604800 } });
      if (!response.ok) return failedResult(this.source, { code: "network", message: `WoRMS respondeu com ${response.status}.`, retryable: response.status >= 500 }, lastValid);
      const parsed = wormsSchema.safeParse(await response.json());
      const record = parsed.success ? parsed.data[0] : undefined;
      if (!record) return failedResult(this.source, { code: "invalid_response", message: "Registo taxonómico não encontrado ou inválido.", retryable: false }, lastValid);
      return { ok: true, data: { aphiaId: record.AphiaID, scientificName: record.scientificname, authority: record.authority ?? null, status: record.status }, source: this.source, retrievedAt: new Date().toISOString(), stale: false };
    } catch {
      return failedResult(this.source, { code: "network", message: "Não foi possível contactar o WoRMS.", retryable: true }, lastValid);
    }
  }
}
