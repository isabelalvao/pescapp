import type { ScoreFactorKey } from "@/lib/domain/types";

export interface OpportunityWeights {
  base: number;
  factors: Record<ScoreFactorKey, number>;
  staleAfterMinutes: number;
}

export const opportunityWeights: OpportunityWeights = {
  base: 20,
  factors: {
    tide: 15,
    wind: 10,
    swell: 8,
    wavePeriod: 5,
    pressure: 6,
    precipitation: 4,
    cloud: 5,
    waterTemperature: 8,
    season: 7,
    daylight: 5,
    freshness: 4,
    completeness: 3
  },
  staleAfterMinutes: 180
};

export const legalReviewRequiredMessage =
  "Informação jurídica pendente de validação editorial. Consulte sempre a DGRM e os avisos da Autoridade Marítima antes de pescar.";
