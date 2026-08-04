import Link from "next/link";
import { AlertTriangle, ArrowRight, Clock3, ExternalLink, Info, ShieldAlert, Sparkles } from "lucide-react";
import type { FishingLocation, OpportunityResult } from "@/lib/domain/types";
import { formatDateTime } from "@/lib/format";

export function OpportunityHero({ result, location }: { result: OpportunityResult; location: FishingLocation }) {
  const blocked = !result.safety.allowed;
  return (
    <section className={`relative overflow-hidden rounded-[28px] ${blocked ? "bg-[#5a251f]" : "bg-ink"} text-white shadow-lift`}>
      <div aria-hidden className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[42px] border-white/[.045]" />
      <div aria-hidden className="absolute bottom-0 right-1/4 h-px w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="relative grid lg:grid-cols-[1.1fr_.9fr]">
        <div className="p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-2"><span className={`chip border-white/10 ${blocked ? "bg-amber text-ink" : "bg-white/10 text-white"}`}>{blocked ? <ShieldAlert size={14} /> : <Sparkles size={14} />}{result.label}</span><span className="chip border-white/10 bg-white/10 text-white">Confiança {result.confidence}</span></div>
          <div className="mt-8 flex items-end gap-4"><span className="font-display text-[88px] leading-[.72] tracking-[-.07em] sm:text-[112px]">{result.score ?? "—"}</span>{result.score !== null && <span className="mb-1 text-xl text-white/45">/ 100</span>}</div>
          <h1 className="mt-7 max-w-2xl font-display text-3xl leading-tight tracking-tight sm:text-4xl">{blocked ? "Não mostramos uma recomendação até o local estar validado." : "Uma manhã com potencial, sem promessas."}</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">{blocked ? result.safety.blocks[0]?.detail : result.disclaimer}</p>
          {blocked && <a href={result.safety.blocks[0]?.source.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-[#5a251f]">Consultar fonte oficial <ExternalLink size={16} /></a>}
        </div>
        <div className="border-t border-white/10 bg-white/[.06] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
          <p className="eyebrow text-white/50">Próxima janela indicativa</p>
          <p className="mt-3 font-display text-4xl tracking-tight">08:10–11:20</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-white/65"><Clock3 size={15} /> enchente · primeira luz tardia</div>
          <div className="my-7 h-px bg-white/10" />
          <p className="data-label text-white/45">Área em análise</p><p className="mt-2 text-lg font-semibold">{location.publicName}</p><p className="mt-1 text-sm text-white/55">Coordenadas aproximadas · validação local pendente</p>
          <Link href={`/locais/${location.slug}`} className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-amber">Analisar local <ArrowRight size={17} /></Link>
        </div>
      </div>
      <div className="relative flex flex-col gap-2 border-t border-white/10 bg-black/10 px-6 py-3 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10"><span className="flex items-center gap-2"><Info size={14} />{result.confidenceReason}</span><span>Calculado {formatDateTime(result.calculatedAt)}</span></div>
    </section>
  );
}
