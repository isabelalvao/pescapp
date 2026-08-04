import { NextResponse } from "next/server";
import { getDemoConditions } from "@/lib/data/seed";
import { OpenMeteoMarineAdapter } from "@/lib/adapters/open-meteo-marine";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const latitude = Number(url.searchParams.get("lat") ?? "41.35");
  const longitude = Number(url.searchParams.get("lon") ?? "-8.75");
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return NextResponse.json({ error: "Coordenadas inválidas." }, { status: 400 });
  }

  const baseline = getDemoConditions();
  const secondary = await new OpenMeteoMarineAdapter().fetch({ latitude, longitude });
  return NextResponse.json(
    {
      conditions: secondary.ok ? { ...baseline, ...secondary.data.observations } : baseline,
      provider: secondary.ok ? secondary.source : null,
      warning: secondary.ok ? "Fonte secundária não oficial; confirme no IPMA." : "Dados de demonstração — fornecedor real indisponível.",
      staleFallbackUsed: !secondary.ok && secondary.stale
    },
    { headers: { "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600" } }
  );
}
