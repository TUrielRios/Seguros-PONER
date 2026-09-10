import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BASE = process.env.API_URL_INTERNA ?? "http://localhost:8080";
const PERMITIDAS = new Set(["generar", "despachar"]);

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ accion: string }> },
) {
  const { accion } = await params;
  if (!PERMITIDAS.has(accion)) {
    return NextResponse.json({ error: "Acción no permitida" }, { status: 400 });
  }

  const token = (await cookies()).get("sesion")?.value;
  const res = await fetch(`${BASE}/api/v1/avisos/${accion}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
}
