"use client";

import { useState } from "react";
import { LocateFixed, X } from "lucide-react";

export function LocationConsent() {
  const [state, setState] = useState<"idle" | "loading" | "accepted" | "denied" | "hidden">("idle");
  if (state === "hidden" || state === "accepted") return null;
  const requestLocation = () => {
    if (!navigator.geolocation) return setState("denied");
    setState("loading");
    navigator.geolocation.getCurrentPosition(
      () => setState("accepted"),
      () => setState("denied"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 900000 }
    );
  };
  return (
    <div className="mb-5 flex items-start gap-3 rounded-2xl border border-atlantic/15 bg-foam/70 p-3.5 text-sm text-ink/75">
      <LocateFixed className="mt-0.5 shrink-0 text-atlantic" size={19} />
      <div className="flex-1"><strong className="text-ink">Usar a sua zona?</strong> A localização só é pedida com o seu consentimento e não é guardada no modo visitante.{state === "denied" && <span className="mt-1 block font-semibold text-coral">Não foi possível obter a localização. Pode continuar com Vila do Conde.</span>}</div>
      <button onClick={requestLocation} className="min-h-10 shrink-0 rounded-full bg-white px-4 text-xs font-bold shadow-sm" disabled={state === "loading"}>{state === "loading" ? "A obter…" : "Permitir"}</button>
      <button onClick={() => setState("hidden")} className="grid h-10 w-10 shrink-0 place-items-center rounded-full hover:bg-white" aria-label="Fechar"><X size={17} /></button>
    </div>
  );
}
