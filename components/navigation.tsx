"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarRange, FishSymbol, Map, Waves } from "lucide-react";

const items = [
  { href: "/", label: "Hoje", icon: Waves },
  { href: "/mapa", label: "Mapa", icon: Map },
  { href: "/planear", label: "Planear", icon: CalendarRange },
  { href: "/especies", label: "Espécies", icon: FishSymbol },
  { href: "/diario", label: "Diário", icon: BookOpen }
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function DesktopNavigation() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navegação principal" className="hidden items-center gap-1 rounded-full border border-ink/10 bg-white/75 p-1.5 shadow-sm backdrop-blur lg:flex">
      {items.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-bold transition ${active ? "bg-ink text-white shadow" : "text-ink/65 hover:bg-foam hover:text-ink"}`}>
            <Icon size={17} strokeWidth={active ? 2.4 : 1.8} />{label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNavigation() {
  const pathname = usePathname();
  return (
    <nav aria-label="Navegação principal" className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-[22px] border border-white/15 bg-ink/95 p-1.5 pb-[calc(.375rem+env(safe-area-inset-bottom))] text-white shadow-2xl backdrop-blur-xl lg:hidden">
      {items.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`flex min-h-[52px] flex-col items-center justify-center gap-1 rounded-[16px] text-[10px] font-semibold transition ${active ? "bg-white text-ink" : "text-white/65 hover:text-white"}`}>
            <Icon size={20} strokeWidth={active ? 2.4 : 1.7} />{label}
          </Link>
        );
      })}
    </nav>
  );
}
