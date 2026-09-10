import { cookies } from "next/headers";

const BASE = process.env.API_URL_INTERNA ?? "http://localhost:8080";

/**
 * Sirve el archivo al visor.
 *
 * Hace falta este intermediario porque el JWT vive en una cookie httpOnly: un
 * `<iframe src=…>` o un `<img src=…>` apuntando directo a la API saldría sin
 * la cabecera `Authorization` y rebotaría con 401. Acá el servidor de Next lee
 * la cookie, la convierte en cabecera y devuelve el binario tal cual.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    return new Response("Identificador inválido", { status: 400 });
  }

  const token = (await cookies()).get("sesion")?.value;
  const res = await fetch(`${BASE}/api/v1/documentos/${id}/contenido`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });

  if (!res.ok || !res.body) {
    return new Response("No se pudo abrir el documento", { status: res.status });
  }

  return new Response(res.body, {
    status: 200,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/octet-stream",
      "Content-Disposition":
        res.headers.get("content-disposition") ?? "inline",
      "Cache-Control": "private, max-age=60",
    },
  });
}
