import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";
import { AdminConsole } from "@/components/admin-console";

export const metadata: Metadata = { title: "Administração", robots: { index: false, follow: false } };
export default function AdminPage() { return <div className="page-wrap"><div className="mb-7 grid gap-4 lg:grid-cols-[1fr_380px] lg:items-end"><div><p className="eyebrow">Backoffice editorial</p><h1 className="display-title mt-2">Publicar só depois de provar.</h1></div><div className="flex gap-3 rounded-2xl bg-ink p-4 text-sm text-white"><LockKeyhole size={20} className="shrink-0 text-amber"/><p><strong>Pré-visualização sem autenticação.</strong><br/><span className="text-white/55">O schema exige função editorial em produção.</span></p></div></div><AdminConsole /></div>; }
