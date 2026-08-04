"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, ArrowRight, Footprints, MapPin } from "lucide-react";
import type { FishingLocation, LocationType } from "@/lib/domain/types";
import { typeLabel } from "@/lib/format";

const filters: { value: "todos" | LocationType; label: string }[] = [
  { value: "todos", label: "Todos" }, { value: "praia", label: "Praia" }, { value: "estuário", label: "Estuário" }, { value: "rochas", label: "Rochas" }, { value: "margem_portuária", label: "Margem portuária" }
];

export function MapExplorer({ locations }: { locations: FishingLocation[] }) {
  const mapNode = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("todos");
  const [selectedId, setSelectedId] = useState(locations[0]?.id ?? "");
  const filtered = useMemo(() => filter === "todos" ? locations : locations.filter((item) => item.type === filter), [filter, locations]);

  useEffect(() => {
    if (!mapNode.current) return;
    let disposed = false;
    let map: import("maplibre-gl").Map | undefined;
    const start = async () => {
      const maplibregl = await import("maplibre-gl");
      if (disposed || !mapNode.current) return;
      map = new maplibregl.Map({
        container: mapNode.current,
        center: [-8.748, 41.3505],
        zoom: 12.7,
        minZoom: 10,
        style: {
          version: 8,
          sources: { osm: { type: "raster", tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"], tileSize: 256, attribution: "© OpenStreetMap contributors" } },
          layers: [{ id: "osm", type: "raster", source: "osm", paint: { "raster-saturation": -0.32, "raster-contrast": 0.05 } }]
        }
      });
      map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-right");
      locations.map((location) => {
        const marker = document.createElement("button");
        marker.type = "button";
        marker.setAttribute("aria-label", `Ver ${location.publicName}`);
        marker.className = "grid h-10 w-10 place-items-center rounded-full border-[3px] border-white bg-ink text-white shadow-lg transition hover:scale-110";
        marker.innerHTML = `<span aria-hidden="true" style="width:10px;height:10px;border-radius:999px;background:#f4a621;display:block"></span>`;
        marker.addEventListener("click", () => setSelectedId(location.id));
        return new maplibregl.Marker({ element: marker }).setLngLat([location.longitude, location.latitude]).addTo(map!);
      });
    };
    void start();
    return () => { disposed = true; map?.remove(); };
  }, [locations]);

  const selected = locations.find((item) => item.id === selectedId) ?? filtered[0];
  return (
    <div>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filtrar tipos de local">{filters.map((item) => <button key={item.value} onClick={() => setFilter(item.value)} className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-bold transition ${filter === item.value ? "bg-ink text-white" : "border border-ink/10 bg-white text-ink/65 hover:bg-foam"}`}>{item.label}</button>)}</div>
      <div className="grid min-h-[680px] overflow-hidden rounded-[28px] border border-ink/10 bg-white shadow-soft lg:grid-cols-[360px_1fr]">
        <aside className="order-2 max-h-[680px] overflow-y-auto border-t border-ink/10 bg-[#fbfaf6] p-3 lg:order-1 lg:border-r lg:border-t-0" aria-label="Lista de locais">
          <div className="mb-2 flex items-center justify-between px-2 py-3"><span className="text-sm font-bold">{filtered.length} zonas curadas</span><span className="text-xs text-ink/45">coordenadas aproximadas</span></div>
          <div className="space-y-2">{filtered.map((location) => <button key={location.id} onClick={() => setSelectedId(location.id)} className={`w-full rounded-2xl border p-4 text-left transition ${selected?.id === location.id ? "border-atlantic bg-foam shadow-sm" : "border-ink/10 bg-white hover:border-ink/25"}`}><div className="flex items-start gap-3"><span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-white"><MapPin size={16} /></span><span className="min-w-0 flex-1"><span className="block font-bold leading-tight">{location.publicName}</span><span className="mt-1 block text-xs text-ink/50">{typeLabel(location.type)} · {location.experience} · {location.exposure}</span></span></div></button>)}</div>
        </aside>
        <div className="relative order-1 min-h-[420px] lg:order-2 lg:min-h-full">
          <div ref={mapNode} className="absolute inset-0" aria-label="Mapa OpenStreetMap com zonas de pesca aproximadas em Vila do Conde" />
          {selected && <div className="absolute inset-x-3 bottom-3 z-10 rounded-[20px] border border-white/60 bg-white/95 p-4 shadow-2xl backdrop-blur sm:inset-x-auto sm:bottom-5 sm:left-5 sm:w-[360px] sm:p-5"><div className="flex items-start justify-between gap-3"><div><span className="eyebrow">{typeLabel(selected.type)} · {selected.exposure}</span><h2 className="mt-1 font-display text-2xl leading-tight tracking-tight">{selected.publicName}</h2></div><span className="rounded-full bg-amber/15 p-2 text-[#9a5f00]"><AlertTriangle size={18} /></span></div><p className="mt-3 line-clamp-2 text-sm leading-6 text-ink/65">{selected.access}</p><div className="mt-3 flex items-center gap-4 text-xs text-ink/55"><span className="flex items-center gap-1.5"><Footprints size={15} /> {selected.walkingDistanceM} m</span><span>{selected.experience}</span></div><Link href={`/locais/${selected.slug}`} className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink text-sm font-bold text-white">Abrir análise do local <ArrowRight size={16} /></Link></div>}
        </div>
      </div>
    </div>
  );
}
