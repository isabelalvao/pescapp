import { CloudRain, Compass, Droplets, Gauge, Sun, Sunrise, Sunset, Thermometer, Waves, Wind } from "lucide-react";
import type { MarineConditions } from "@/lib/domain/types";

interface Item { label: string; value: string; helper: string; icon: typeof Wind; }

export function ConditionsGrid({ conditions }: { conditions: MarineConditions }) {
  const items: Item[] = [
    { label: "Vento", value: `${conditions.windSpeed.value} km/h`, helper: conditions.windDirection.value, icon: Wind },
    { label: "Ondulação", value: `${conditions.waveHeight.value.toFixed(1)} m`, helper: `${conditions.swellDirection.value} · ${conditions.wavePeriod.value} s`, icon: Waves },
    { label: "Água", value: `${conditions.seaTemperature.value.toFixed(1)} °C`, helper: "superfície", icon: Droplets },
    { label: "Ar", value: `${conditions.airTemperature.value} °C`, helper: `${conditions.precipitation.value.toFixed(1)} mm/h`, icon: Thermometer },
    { label: "Maré", value: conditions.tideState.value, helper: `Preia-mar ${conditions.nextHighTide.value}`, icon: Compass },
    { label: "Pressão", value: conditions.pressureTrend.value, helper: `${conditions.cloudCover.value}% nuvens`, icon: Gauge },
    { label: "Nascer do sol", value: conditions.sunrise.value, helper: "Europe/Lisbon", icon: Sunrise },
    { label: "Pôr do sol", value: conditions.sunset.value, helper: "luz legal a confirmar", icon: Sunset }
  ];
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[22px] border border-ink/10 bg-ink/10 sm:grid-cols-4">
      {items.map(({ label, value, helper, icon: Icon }) => <div key={label} className="group min-h-[122px] bg-white/85 p-4 transition hover:bg-foam/80 sm:p-5"><div className="mb-4 flex items-center justify-between"><span className="data-label">{label}</span><Icon size={17} className="text-atlantic transition group-hover:scale-110" /></div><div className="font-display text-xl font-semibold capitalize tracking-tight sm:text-2xl">{value}</div><div className="mt-1.5 text-xs text-ink/55">{helper}</div></div>)}
    </div>
  );
}
