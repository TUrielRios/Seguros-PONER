import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BASE = process.env.API_URL_INTERNA ?? "http://localhost:8080";
const PERMITIDAS = new Set(["aprobar", "descartar"]);

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; accion: string }> },
) {
  const { id, accion } = await params;
  if (!PERMITIDAS.has(accion)) {
    return NextResponse.json({ error: "Acción no permitida" }, { status: 400 });
  }

  const token = (await cookies()).get("sesion")?.value;
  const cuerpo = await req.text();

  const res = await fetch(`${BASE}/api/v1/revision/${id}/${accion}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: cuerpo || undefined,
  });

  return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
}
