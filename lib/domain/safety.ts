import { opportunityWeights } from "@/lib/domain/config";
import { sources } from "@/lib/data/sources";
import type { OpportunityInput, SafetyBlock, SafetyGateResult } from "@/lib/domain/types";

const criticalKeys = ["waveHeight", "windSpeed", "tideState"] as const;

export function minutesSince(iso: string, now: Date): number {
  return Math.max(0, (now.getTime() - new Date(iso).getTime()) / 60_000);
}

export function runSafetyGate(input: OpportunityInput): SafetyGateResult {
  const { location, conditions, now } = input;
  const blocks: SafetyBlock[] = [];

  if (location.legalStatus === "closed") {
    blocks.push({ code: "location_closed", title: "Local encerrado", detail: location.legalNote, source: location.source });
  }
  if (input.accessProhibited) {
    blocks.push({ code: "access_prohibited", title: "Acesso proibido", detail: "Não entre na zona nem contorne barreiras ou sinalização.", source: sources.amn });
  }
  if (input.barOpen === false) {
    blocks.push({ code: "bar_closed", title: "Barra fechada", detail: "A situação da barra prevalece sobre qualquer janela de pesca calculada.", source: sources.amn });
  }
  const missingCritical = criticalKeys.some((key) => conditions[key]?.value === null || conditions[key]?.value === undefined);
  if (missingCritical) {
    blocks.push({ code: "missing_critical_data", title: "Faltam dados críticos", detail: "Sem vento, ondulação e maré completos não é possível avaliar este local.", source: sources.ipma });
  }

  const stalestMinutes = Math.max(...criticalKeys.map((key) => minutesSince(conditions[key].retrievedAt, now)));
  if (stalestMinutes > opportunityWeights.staleAfterMinutes) {
    blocks.push({
      code: "stale_data",
      title: "Dados demasiado antigos",
      detail: `Os dados críticos têm mais de ${opportunityWeights.staleAfterMinutes / 60} horas. É preservada a última leitura, mas o índice fica suspenso.`,
      source: sources.ipma
    });
  }

  return { allowed: blocks.length === 0, blocks, checkedAt: now.toISOString() };
}
