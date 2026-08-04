import Link from "next/link";
import { ArrowRight, ExternalLink, FishSymbol, Info } from "lucide-react";
import { ConditionsGrid } from "@/components/conditions-grid";
import { LocationConsent } from "@/components/location-consent";
import { OpportunityHero } from "@/components/opportunity-hero";
import { TideChart } from "@/components/tide-chart";
import { getDemoConditions, locations, species } from "@/lib/data/seed";
import { sources } from "@/lib/data/sources";
import { calculateOpportunity } from "@/lib/domain/scoring";
import { formatLongDate } from "@/lib/format";

interface HomePageProps {
  searchParams?: Promise<{ location?: string | string[] }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const now = new Date();
  const params = searchParams ? await searchParams : {};
  const requestedLocation = Array.isArray(params.location) ? params.location[0] : params.location;
  const location = locations.find((item) => item.id === requestedLocation) ?? locations[0];
  const target = species.find((item) => location.targetSpeciesIds.includes(item.id)) ?? species[0];
  const conditions = getDemoConditions(now);
  const result = calculateOpportunity({ location, targetSpecies: target, conditions, now });
  const locationTargets = species.filter((item) => location.targetSpeciesIds.includes(item.id));
  return (
    <div className="page-wrap">
      <LocationConsent />
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="eyebrow">{formatLongDate(now)}</p><h1 className="display-title mt-2">Condições de pesca hoje.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-ink/60">Escolha uma zona para consultar maré, mar, vento, espécies e equipamento associado.</p></div>
        <form action="/" method="get" className="surface flex w-full flex-col gap-3 p-3 sm:flex-row sm:items-end lg:max-w-xl" aria-label="Escolher zona de pesca">
          <label htmlFor="today-location" className="min-w-0 flex-1"><span className="data-label">Zona de pesca</span><select id="today-location" name="location" defaultValue={location.id} className="mt-1.5 min-h-11 w-full rounded-xl border border-ink/15 bg-white px-3 text-sm font-semibold outline-none focus:border-atlantic">{locations.map((item) => <option key={item.id} value={item.id}>{item.publicName}</option>)}</select></label>
          <button type="submit" className="button-primary shrink-0">Ver condições <ArrowRight size={16} /></button>
        </form>
      </div>
      <OpportunityHero result={result} location={location} conditions={conditions} />
      <section className="mt-5"><div className="mb-3 flex items-end justify-between"><div><p className="eyebrow">Leitura rápida</p><h2 className="mt-1 font-display text-2xl tracking-tight">Condições em {location.publicName}</h2></div><span className="chip bg-amber/15 text-ink"><span className="h-2 w-2 rounded-full bg-amber" /> Demonstração</span></div><ConditionsGrid conditions={conditions} /></section>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <section className="surface-dark p-5 sm:p-7"><TideChart conditions={conditions} /></section>
        <section className="surface p-5 sm:p-7"><div className="flex items-start justify-between"><div><p className="eyebrow">Espécies associadas à zona</p><h2 className="mt-2 font-display text-2xl tracking-tight">Referência biológica</h2></div><FishSymbol className="text-sea" /></div><div className="mt-5 space-y-2">{locationTargets.slice(0,4).map((fish, index) => <Link key={fish.id} href={`/especies#${fish.slug}`} className="group flex min-h-16 items-center gap-3 rounded-2xl border border-ink/10 bg-white p-3 transition hover:border-atlantic/40 hover:bg-foam"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sand font-display text-lg">0{index + 1}</span><span className="min-w-0 flex-1"><strong className="block">{fish.commonName}</strong><em className="block truncate text-xs text-ink/50">{fish.scientificName}</em></span><ArrowRight size={17} className="text-ink/35 transition group-hover:translate-x-1" /></Link>)}</div><p className="mt-4 text-xs leading-5 text-ink/50">Dados biológicos agregados para consulta.</p></section>
      </div>
      <aside className="mt-5 flex flex-col gap-3 rounded-[18px] border border-ink/10 bg-white/60 px-5 py-4 text-sm leading-6 text-ink/60 sm:flex-row sm:items-center sm:justify-between"><p className="flex gap-2"><Info size={17} className="mt-1 shrink-0 text-atlantic" />A PescApp agrega dados para pesca amadora e não é uma fonte oficial. Cada pescador é responsável por cumprir as regras aplicáveis e agir com bom senso.</p><div className="flex shrink-0 gap-3"><a href={sources.dgrm.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-bold text-ink">DGRM <ExternalLink size={14} /></a><a href={sources.amn.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-bold text-ink">Capitania <ExternalLink size={14} /></a></div></aside>
    </div>
  );
}
