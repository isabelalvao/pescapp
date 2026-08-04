import { sources } from "@/lib/data/sources";
import type { DataSourceAdapter, OfficialNoticePayload, ProviderRequest, ProviderResult } from "@/lib/adapters/types";
import { failedResult } from "@/lib/adapters/types";

export class MaritimeNoticesAdapter implements DataSourceAdapter<OfficialNoticePayload> {
  readonly id = "amn-vila-do-conde";
  readonly source = sources.amn;
  readonly authoritative = true;

  async fetch(_request: ProviderRequest, lastValid?: OfficialNoticePayload): Promise<ProviderResult<OfficialNoticePayload>> {
    return failedResult(
      this.source,
      { code: "not_configured", message: "Sem feed oficial estruturado configurado. Os avisos devem ser revistos manualmente no backoffice.", retryable: false },
      lastValid
    );
  }
}
