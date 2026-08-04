import Link from "next/link";
import { AlertTriangle, ArrowRight, Clock3, ExternalLink, Info, Sparkles, Waves, Wind } from "lucide-react";
import type { FishingLocation, MarineConditions, OpportunityResult } from "@/lib/domain/types";
import { formatDateTime, formatTideState } from "@/lib/format";

export function OpportunityHero({ result, location, conditions }: { result: OpportunityResult; location: FishingLocation; conditions: MarineConditions }) {
  const blocked = !result.safety.allowed;
  const firstBlock = result.safety.blocks[0];
  const tideChange = conditions.tideState.value === "a vazar" || conditions.tideState.value === "preia-mar"
    ? { label: "Próxima baixa-mar", time: conditions.nextLowTide.value }
    : { label: "Próxima preia-mar", time: conditions.nextHighTide.value };

  return (
    <section className="surface overflow-hidden">
      <div className="grid divide-y divide-ink/10 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
        <div className="p-5 sm:p-6">
          <p className="eyebrow">Maré agora</p>
          <h2 className="mt-2 font-display text-3xl tracking-tight">{formatTideState(conditions.tideState.value)}</h2>
          <p className="mt-2 flex items-center gap-2 text-sm text-ink/60"><Clock3 size={15} className="text-atlantic" />{tideChange.label}: <strong className="text-ink">{tideChange.time}</strong></p>
        </div>
        <div className="p-5 sm:p-6">
          <p className="eyebrow">Mar e vento</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-3 text-sm"><span className="flex items-center gap-2"><Waves size={17} className="text-atlantic" /><strong>{conditions.waveHeight.value.toFixed(1)} m</strong><span className="text-ink/55">· {conditions.wavePeriod.value} s</span></span><span className="flex items-center gap-2"><Wind size={17} className="text-atlantic" /><strong>{conditions.windSpeed.value} km/h</strong><span className="text-ink/55">{conditions.windDirection.value}</span></span></div>
          <p className="mt-3 text-xs leading-5 text-ink/50">Leitura de demonstração; confirme o estado do mar antes de sair.</p>
        </div>
        <div className="flex flex-col justify-between gap-4 p-5 sm:p-6">
          <div><p className="eyebrow">Zona escolhida</p><p className="mt-2 font-semibold leading-snug">{location.publicName}</p><p className="mt-1 text-xs text-ink/50">Coordenadas aproximadas</p></div>
          <Link href={`/locais/${location.slug}`} className="inline-flex min-h-10 items-center gap-2 text-sm font-bold text-atlantic hover:text-ink">Ver detalhes do local <ArrowRight size={16} /></Link>
        </div>
      </div>
      {blocked ? (
        <div className="flex flex-col gap-3 border-t border-coral/25 bg-coral/5 px-5 py-3.5 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex gap-2.5"><AlertTriangle size={18} className="mt-0.5 shrink-0 text-coral" /><p><strong>{firstBlock?.title}</strong> <span className="text-ink/65">{firstBlock?.detail}</span></p></div>
          {firstBlock && <a href={firstBlock.source.url} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1.5 font-bold text-ink hover:text-atlantic">Fonte oficial <ExternalLink size={15} /></a>}
        </div>
      ) : (
        <div className="flex flex-col gap-2 border-t border-sea/20 bg-sea/10 px-5 py-3.5 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6"><span className="flex items-center gap-2"><Sparkles size={16} className="text-sea" /><strong>Índice de condições: {result.score}/100 · {result.label}</strong><span className="text-ink/60">{result.disclaimer}</span></span><span className="chip shrink-0">Confiança {result.confidence}</span></div>
      )}
      <div className="flex items-center gap-2 border-t border-ink/10 px-5 py-2 text-xs text-ink/45 sm:px-6"><Info size={13} />{result.confidenceReason} · Atualizado {formatDateTime(result.calculatedAt)}</div>
    </section>
  );
}
