import type { MarineConditions } from "@/lib/domain/types";

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("pt-PT", {
    timeZone: "Europe/Lisbon",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date(iso));
}

export function formatTideState(state: MarineConditions["tideState"]["value"]): string {
  return ({
    "a encher": "a encher (a subir)",
    "a vazar": "a vazar (a baixar)",
    "preia-mar": "preia-mar (estofo)",
    "baixa-mar": "baixa-mar (estofo)"
  })[state];
}

export function formatLongDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-PT", { timeZone: "Europe/Lisbon", weekday: "long", day: "numeric", month: "long" }).format(date);
}

export function typeLabel(type: string): string {
  return ({ praia: "Praia", rochas: "Rochas", margem_portuária: "Margem portuária", estuário: "Estuário" } as Record<string, string>)[type] ?? type;
}
