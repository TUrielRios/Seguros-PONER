import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BASE = process.env.API_URL_INTERNA ?? "http://localhost:8080";

/** Dispara el reindexado de la carpeta de documentos. */
export async function POST() {
  const token = (await cookies()).get("sesion")?.value;

  const res = await fetch(`${BASE}/api/v1/documentos/indexar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
}
