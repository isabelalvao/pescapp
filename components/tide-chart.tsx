import { hourlyForecast } from "@/lib/data/seed";

function points(values: number[], width: number, height: number, pad = 12): string {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return values.map((value, index) => {
    const x = pad + (index / (values.length - 1)) * (width - pad * 2);
    const y = height - pad - ((value - min) / Math.max(0.01, max - min)) * (height - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

export function TideChart({ compact = false }: { compact?: boolean }) {
  const width = 680;
  const height = compact ? 150 : 210;
  const tidePoints = points(hourlyForecast.map((item) => item.tide), width, height);
  const wavePoints = points(hourlyForecast.map((item) => item.wave), width, height);
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><p className="data-label text-white/50">Maré e ondulação · hoje</p><p className="mt-1 text-sm text-white/70">Alturas indicativas de demonstração</p></div><div className="flex gap-3 text-xs"><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-amber" />Maré</span><span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#6bd6d0]" />Ondulação</span></div></div>
      <div className="chart-grid overflow-hidden rounded-xl">
        <svg role="img" aria-label="Gráfico indicativo da altura da maré e da ondulação entre as 06:00 e as 20:00" viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
          <defs><linearGradient id="tideFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f4a621" stopOpacity=".42"/><stop offset="1" stopColor="#f4a621" stopOpacity="0"/></linearGradient></defs>
          <polygon points={`12,${height - 12} ${tidePoints} ${width - 12},${height - 12}`} fill="url(#tideFill)" />
          <polyline points={tidePoints} fill="none" stroke="#f4a621" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={wavePoints} fill="none" stroke="#6bd6d0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 6" />
          {hourlyForecast.map((item, index) => <text key={item.time} x={12 + (index / (hourlyForecast.length - 1)) * (width - 24)} y={height - 2} fill="rgba(255,255,255,.55)" fontSize="12" textAnchor={index === 0 ? "start" : index === hourlyForecast.length - 1 ? "end" : "middle"}>{item.time.slice(0,2)}h</text>)}
        </svg>
      </div>
    </div>
  );
}
