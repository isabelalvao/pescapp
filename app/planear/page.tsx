import type { Metadata } from "next";
import { Planner } from "@/components/planner";

export const metadata: Metadata = { title: "Planear" };
export default function PlanPage() { return <div className="page-wrap"><div className="mb-7 max-w-3xl"><p className="eyebrow">Planeador transparente</p><h1 className="display-title mt-2">Da janela de maré ao último anzol.</h1><p className="mt-4 text-base leading-7 text-ink/60">Cruze espécie, local, técnica, equipamento e condições previstas numa consulta clara e explicável.</p></div><Planner /></div>; }
