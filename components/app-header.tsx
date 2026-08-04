"use client";

import Link from "next/link";
import { Anchor, ChevronDown, ShieldCheck } from "lucide-react";
import { DesktopNavigation } from "@/components/navigation";
import { InstallButton } from "@/components/install-button";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-[#f8fbf9]/88 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3" aria-label="PescApp — Hoje">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-white shadow-lg"><Anchor size={20} /></span>
          <span><span className="block font-display text-[22px] font-semibold leading-none tracking-tight">PescApp</span><span className="mt-1 hidden text-[9px] font-bold uppercase tracking-[.2em] text-atlantic sm:block">Vila do Conde · piloto</span></span>
        </Link>
        <DesktopNavigation />
        <div className="flex items-center gap-2">
          <Link href="/#today-location" aria-label="Escolher zona de pesca" className="hidden min-h-10 items-center gap-2 rounded-full border border-ink/10 bg-white/60 px-3 text-sm font-semibold md:flex"><span className="h-2 w-2 rounded-full bg-sea" />Escolher zona<ChevronDown size={15} /></Link>
          <InstallButton />
          <Link href="/admin" className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 bg-white/60 text-ink/65 hover:text-ink" aria-label="Abrir área de administração"><ShieldCheck size={18} /></Link>
        </div>
      </div>
    </header>
  );
}
