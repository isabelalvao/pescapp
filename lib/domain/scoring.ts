import { opportunityWeights } from "@/lib/domain/config";
import { runSafetyGate, minutesSince } from "@/lib/domain/safety";
import type { OpportunityInput, OpportunityResult, ScoreFactor, ScoreFactorKey } from "@/lib/domain/types";

function factor(
  key: ScoreFactorKey,
  ratio: number,
  label: string,
  explanation: string
): ScoreFactor {
  const maxContribution = opportunityWeights.factors[key];
  const clamped = Math.max(-0.5, Math.min(1, ratio));
  const contribution = Math.round(maxContribution * clamped);
  return {
    key,
    label,
    contribution,
    maxContribution,
    explanation,
    tone: contribution > maxContribution * 0.55 ? "positive" : contribution < 0 ? "negative" : "neutral"
  };
}

function getLabel(score: number): string {
  if (score >= 80) return "Índice elevado";
  if (score >= 65) return "Índice intermédio";
  if (score >= 45) return "Índice reduzido";
  return "Índice baixo";
}

export function calculateOpportunity(input: OpportunityInput): OpportunityResult {
  const safety = runSafetyGate(input);
  const { conditions, now } = input;

  if (!safety.allowed) {
    return {
      score: null,
      label: "Índice indisponível",
      confidence: "baixa",
      confidenceReason: "Faltam dados atualizados ou existe um condicionamento publicado para esta zona.",
      factors: [],
      safety,
      calculatedAt: now.toISOString(),
      disclaimer: "A PescApp agrega dados de referência; as fontes oficiais prevalecem."
    };
  }

  const freshestAge = Math.max(
    minutesSince(conditions.waveHeight.retrievedAt, now),
    minutesSince(conditions.windSpeed.retrievedAt, now),
    minutesSince(conditions.tideState.retrievedAt, now)
  );
  const hour = now.getHours();
  const month = now.getMonth() + 1;
  const factors: ScoreFactor[] = [
    factor("tide", conditions.tideState.value === "a encher" ? 1 : 0.35, "Maré", conditions.tideState.value === "a encher" ? "A enchente coincide com o padrão preferencial configurado." : "A fase de maré tem menor afinidade com o perfil escolhido."),
    factor("wind", conditions.windSpeed.value <= 16 ? 0.9 : conditions.windSpeed.value <= 24 ? 0.4 : -0.2, "Vento", `${conditions.windSpeed.value} km/h de ${conditions.windDirection.value}; impacto ajustado à exposição do local.`),
    factor("swell", conditions.swellHeight.value <= 1 ? 0.85 : conditions.swellHeight.value <= 1.4 ? 0.35 : -0.25, "Ondulação", `${conditions.swellHeight.value.toFixed(1)} m de ${conditions.swellDirection.value}; influência considerada no índice.`),
    factor("wavePeriod", conditions.wavePeriod.value <= 10 ? 0.65 : 0.2, "Período", `${conditions.wavePeriod.value} s; períodos longos podem produzir séries mais energéticas.`),
    factor("pressure", conditions.pressureTrend.value === "estável" ? 0.75 : conditions.pressureTrend.value === "a subir" ? 0.55 : 0.15, "Pressão", `Pressão ${conditions.pressureTrend.value}.`),
    factor("precipitation", conditions.precipitation.value < 0.5 ? 0.8 : conditions.precipitation.value < 2 ? 0.3 : -0.2, "Precipitação", `${conditions.precipitation.value.toFixed(1)} mm/h previstos.`),
    factor("cloud", conditions.cloudCover.value >= 40 && conditions.cloudCover.value <= 85 ? 0.85 : 0.45, "Nebulosidade", `${conditions.cloudCover.value}% de cobertura pode suavizar a luz.`),
    factor("waterTemperature", conditions.seaTemperature.value >= 14 && conditions.seaTemperature.value <= 20 ? 0.8 : 0.25, "Temperatura da água", `${conditions.seaTemperature.value.toFixed(1)} °C comparados com o intervalo geral do perfil.`),
    factor("season", month >= 4 && month <= 10 ? 0.7 : 0.4, "Época", "A sazonalidade é apenas indicativa até existirem registos locais suficientes."),
    factor("daylight", hour <= 9 || hour >= 18 ? 0.9 : 0.45, "Luz", hour <= 9 || hour >= 18 ? "Janela próxima de mudança de luz." : "Período de luz mais intensa."),
    factor("freshness", freshestAge <= 30 ? 1 : freshestAge <= 90 ? 0.65 : 0.25, "Atualidade", `Dados críticos recolhidos há cerca de ${Math.round(freshestAge)} min.`),
    factor("completeness", conditions.completeness, "Cobertura", `${Math.round(conditions.completeness * 100)}% dos campos esperados estão disponíveis.`)
  ];

  const rawScore = opportunityWeights.base + factors.reduce((total, item) => total + item.contribution, 0);
  const score = Math.max(0, Math.min(100, Math.round(rawScore)));
  const demoData = conditions.waveHeight.quality === "demo";
  const confidence = demoData ? "baixa" : conditions.completeness >= 0.9 && freshestAge <= 60 ? "alta" : "média";

  return {
    score,
    label: getLabel(score),
    confidence,
    confidenceReason: demoData
      ? "Pré-visualização com dados de demonstração; ligue fornecedores reais para uma leitura atualizada."
      : `${Math.round(conditions.completeness * 100)}% de cobertura e dados críticos com ${Math.round(freshestAge)} min.`,
    factors,
    safety,
    calculatedAt: now.toISOString(),
    disclaimer: "Índice agregado de condições para pesca amadora; não garante capturas."
  };
}
