import type { Metadata } from "next";
import { SpeciesGuide } from "@/components/species-guide";
import { species } from "@/lib/data/seed";

export const metadata: Metadata = { title: "Espécies" };
export default function SpeciesPage() { return <div className="page-wrap"><div className="mb-7 max-w-3xl"><p className="eyebrow">Biologia separada de legislação</p><h1 className="display-title mt-2">Conhecer antes de capturar.</h1><p className="mt-4 text-base leading-7 text-ink/60">Identificação, habitat e material num guia; regras legais num registo independente, versionado e sempre sujeito a validação humana.</p></div><SpeciesGuide species={species} /></div>; }
