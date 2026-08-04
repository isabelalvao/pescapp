import type { Metadata } from "next";
import { Logbook } from "@/components/logbook";

export const metadata: Metadata = { title: "Diário" };
export default function LogbookPage() { return <div className="page-wrap"><div className="mb-7 max-w-3xl"><p className="eyebrow">Diário privado</p><h1 className="display-title mt-2">Aprender com cada saída.</h1><p className="mt-4 text-base leading-7 text-ink/60">Guarde capturas e condições sem expor o seu local. Fotografias são regravadas no dispositivo para remover metadados antes do armazenamento.</p></div><Logbook /></div>; }
