/**
 * Identificación del asegurado para el simulador de *Poné*.
 *
 * El motor no busca por su cuenta: deja el pendiente y esto lo resuelve. Primero
 * contra la cartera real —el buscador ya resuelve patente, DNI y número de
 * póliza en un solo campo de texto, así que no hace falta adivinar qué mandó el
 * cliente— y si no hay nada, contra los casos de demostración.
 *
 * Que caiga a demo no es un parche: permite mostrar el circuito completo con el
 * backend apagado y sin exponer datos de un asegurado real en una demo.
 *
 * Ojo con lo que NO devuelve la cartera: cobertura, franquicia, suma asegurada
 * y forma de pago no están en el buscador. Se mandan en null a propósito, para
 * que el bot diga "no lo tengo" y derive, en vez de inventar un número que
 * después la agencia tiene que sostener.
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { buscarEnDemo } from "@panel/lib/pone/cartera-demo";
import type { Poliza } from "@panel/lib/pone/tipos";
import type { Pagina, ResultadoCartera } from "@panel/lib/api";

const BASE = process.env.API_URL_INTERNA ?? "http://localhost:8080";

function desdeCartera(r: ResultadoCartera): Poliza {
  return {
    numero: r.numero,
    cliente: r.cliente,
    documento: r.documento,
    patente: r.patentes,
    compania: r.compania,
    ramo: r.ramo,
    detalle: r.ramo,
    cobertura: null,
    incluye: [],
    sumaAsegurada: null,
    franquicia: null,
    formaPago: null,
    proximoVencimiento: null,
    cuotasImpagas: Number(r.cuotasImpagas ?? 0),
    vigenciaDesde: r.vigenciaDesde,
    vigenciaHasta: r.vigenciaHasta,
    estado: r.estado,
    asistencia: null,
  };
}

async function buscarEnCartera(texto: string): Promise<Poliza | null> {
  try {
    const token = (await cookies()).get("sesion")?.value;
    const url = `${BASE}/api/v1/cartera/buscar?texto=${encodeURIComponent(texto)}&tamanio=5`;
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });
    if (!res.ok) return null;

    const pagina = (await res.json()) as Pagina<ResultadoCartera>;
    const filas = pagina.contenido ?? [];
    if (filas.length === 0) return null;

    // Entre varias, la vigente. Un asegurado con póliza renovada aparece dos veces.
    const elegida = filas.find((f) => f.estado === "VIGENTE") ?? filas[0];
    return desdeCartera(elegida);
  } catch {
    // Backend apagado: no es un error del simulador, es el modo sin backend.
    return null;
  }
}

export async function POST(req: Request) {
  const { texto } = (await req.json().catch(() => ({}))) as { texto?: string };

  if (!texto || texto.trim().length < 4) {
    return NextResponse.json({ origen: null, poliza: null });
  }

  const real = await buscarEnCartera(texto.trim());
  if (real) return NextResponse.json({ origen: "cartera", poliza: real });

  const demo = buscarEnDemo(texto.trim());
  if (demo) return NextResponse.json({ origen: "demo", poliza: demo });

  return NextResponse.json({ origen: null, poliza: null });
}
