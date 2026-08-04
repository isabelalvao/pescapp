import Link from "next/link";
import { ArrowRight, ExternalLink, FishSymbol, Info, ShieldCheck } from "lucide-react";
import { ConditionsGrid } from "@/components/conditions-grid";
import { LocationConsent } from "@/components/location-consent";
import { OpportunityHero } from "@/components/opportunity-hero";
import { TideChart } from "@/components/tide-chart";
import { getDemoConditions, locations, species } from "@/lib/data/seed";
import { sources } from "@/lib/data/sources";
import { calculateOpportunity } from "@/lib/domain/scoring";
import { formatLongDate } from "@/lib/format";

export default function HomePage() {
  const now = new Date();
  const location = locations[0];
  const target = species[0];
  const conditions = getDemoConditions();
  const result = calculateOpportunity({ location, targetSpecies: target, conditions, now });
  return (
    <div className="page-wrap">
      <LocationConsent />
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="eyebrow">{formatLongDate(now)}</p><h1 className="display-title mt-2">Vale a pena ir hoje?</h1></div><p className="max-w-md text-sm leading-6 text-ink/60">Uma leitura rápida de maré, mar e regras — sempre subordinada aos avisos oficiais e ao que observa no local.</p></div>
      <OpportunityHero result={result} location={location} />
      <section className="mt-5"><div className="mb-3 flex items-end justify-between"><div><p className="eyebrow">Leitura rápida</p><h2 className="mt-1 font-display text-2xl tracking-tight">Condições em Vila do Conde</h2></div><span className="chip bg-amber/15 text-ink"><span className="h-2 w-2 rounded-full bg-amber" /> Demonstração</span></div><ConditionsGrid conditions={conditions} /></section>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <section className="surface-dark p-5 sm:p-7"><TideChart /></section>
        <section className="surface p-5 sm:p-7"><div className="flex items-start justify-between"><div><p className="eyebrow">Alvos possíveis</p><h2 className="mt-2 font-display text-2xl tracking-tight">Depois de validar o local</h2></div><FishSymbol className="text-sea" /></div><div className="mt-5 space-y-2">{species.slice(0,3).map((fish, index) => <Link key={fish.id} href={`/especies#${fish.slug}`} className="group flex min-h-16 items-center gap-3 rounded-2xl border border-ink/10 bg-white p-3 transition hover:border-atlantic/40 hover:bg-foam"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sand font-display text-lg">0{index + 1}</span><span className="min-w-0 flex-1"><strong className="block">{fish.commonName}</strong><em className="block truncate text-xs text-ink/50">{fish.scientificName}</em></span><ArrowRight size={17} className="text-ink/35 transition group-hover:translate-x-1" /></Link>)}</div></section>
      </div>
      <section className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[22px] border border-amber/30 bg-amber/10 p-5"><div className="flex gap-3"><Info className="shrink-0 text-[#9a5f00]" /><div><h2 className="font-bold">Conteúdo piloto por validar</h2><p className="mt-1 text-sm leading-6 text-ink/65">Locais, padrões e material são exemplos compatíveis com o schema. Não constituem validação de acesso, segurança ou legalidade.</p><Link href="/sobre-dados" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-ink">Como tratamos os dados <ArrowRight size={15} /></Link></div></div></div>
        <div className="rounded-[22px] border border-sea/20 bg-sea/10 p-5"><div className="flex gap-3"><ShieldCheck className="shrink-0 text-sea" /><div><h2 className="font-bold">Confirme antes de sair</h2><p className="mt-1 text-sm leading-6 text-ink/65">A PescApp não substitui aconselhamento marítimo oficial. Verifique avisos, sinalização, licença e regras em vigor.</p><div className="mt-3 flex flex-wrap gap-3"><a href={sources.amn.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-bold">Capitania <ExternalLink size={14} /></a><a href={sources.dgrm.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-bold">DGRM <ExternalLink size={14} /></a></div></div></div></div>
      </section>
    </div>
  );
}
