import { NextResponse } from "next/server";
import { z } from "zod";
import { locations, species, getDemoConditions } from "@/lib/data/seed";
import { calculateOpportunity } from "@/lib/domain/scoring";

const bodySchema = z.object({ locationId: z.string(), speciesId: z.string(), barOpen: z.boolean().optional() });

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Pedido inválido." }, { status: 400 });
  const location = locations.find((item) => item.id === parsed.data.locationId);
  const targetSpecies = species.find((item) => item.id === parsed.data.speciesId);
  if (!location || !targetSpecies) return NextResponse.json({ error: "Local ou espécie desconhecidos." }, { status: 404 });
  return NextResponse.json(calculateOpportunity({ location, targetSpecies, conditions: getDemoConditions(), now: new Date(), barOpen: parsed.data.barOpen }));
}
