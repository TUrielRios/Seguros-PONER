import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BASE = process.env.API_URL_INTERNA ?? "http://localhost:8080";

const RUTAS = new Set([
  "reservas/triangulo",
  "scoring/churn/entrenar",
  "glm/ajustar",
]);

/** BFF para los cálculos actuariales. Los cálculos tardan, por eso van por POST
 *  explícito y no en el render de la página. */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ ruta: string[] }> },
) {
  const { ruta } = await params;
  const destino = ruta.join("/");

  if (!RUTAS.has(destino)) {
    return NextResponse.json({ error: "Ruta no permitida" }, { status: 400 });
  }

  const token = (await cookies()).get("sesion")?.value;
  const cuerpo = await req.text();

  const res = await fetch(`${BASE}/api/v1/${destino}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: cuerpo || "{}",
  });

  return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
}
