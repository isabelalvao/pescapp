import type { Metadata } from "next";
import { Info } from "lucide-react";
import { MapExplorer } from "@/components/map-explorer";
import { locations } from "@/lib/data/seed";

export const metadata: Metadata = { title: "Mapa" };

export default function MapPage() {
  return <div className="page-wrap"><div className="mb-6 grid gap-4 lg:grid-cols-[1fr_420px] lg:items-end"><div><p className="eyebrow">Zonas curadas · piloto</p><h1 className="display-title mt-2">A costa, com contexto.</h1></div><div className="flex gap-3 rounded-2xl border border-amber/30 bg-amber/10 p-4 text-sm leading-5 text-ink/70"><Info size={19} className="mt-0.5 shrink-0 text-[#9a5f00]" /><p>Os pontos são aproximados e aguardam validação local. Não assinalamos molhes perigosos, canais de navegação, acessos privados ou locais ambientalmente sensíveis.</p></div></div><MapExplorer locations={locations} /></div>;
}
