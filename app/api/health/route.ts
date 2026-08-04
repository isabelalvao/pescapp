import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ status: "ok", service: "pescapp", time: new Date().toISOString() });
}
