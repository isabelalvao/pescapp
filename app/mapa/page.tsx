import type { Metadata } from "next";
import { Info } from "lucide-react";
import { MapExplorer } from "@/components/map-explorer";
import { locations } from "@/lib/data/seed";

export const metadata: Metadata = { title: "Mapa" };

export default function MapPage() {
  return <div className="page-wrap"><div className="mb-6 grid gap-4 lg:grid-cols-[1fr_420px] lg:items-end"><div><p className="eyebrow">Zonas de consulta · piloto</p><h1 className="display-title mt-2">A costa, com contexto.</h1></div><div className="flex gap-3 rounded-2xl border border-ink/10 bg-white/70 p-4 text-sm leading-5 text-ink/70"><Info size={19} className="mt-0.5 shrink-0 text-atlantic" /><p>Pontos de referência aproximados, com acesso, terreno, exposição e espécies associados. Consulte as fontes oficiais para regras em vigor.</p></div></div><MapExplorer locations={locations} /></div>;
}
