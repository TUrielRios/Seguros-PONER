/**
 * Cartera de demostración.
 *
 * El simulador busca primero contra la cartera real (`/api/v1/cartera/buscar`,
 * que ya resuelve patente, DNI y número de póliza en un solo campo). Cuando el
 * backend no está levantado, o cuando se quiere mostrar el circuito sin tocar
 * datos de un asegurado real, cae acá.
 *
 * Los tres casos NO son decorativos: cubren los tres finales distintos que
 * tiene una consulta de póliza.
 *
 *   · AB123CD — todo en orden, el bot contesta y listo.
 *   · AA456BB — con cuotas impagas, el bot avisa antes de que el cliente
 *     descubra en el peor momento que la cobertura puede estar suspendida.
 *   · XYZ789  — póliza vencida y sin franquicia cargada: el bot NO inventa,
 *     dice que no lo tiene y deriva. Ese es el camino que hay que mirar,
 *     porque es el que más se va a dar con datos reales incompletos.
 *
 * Los datos son inventados y los teléfonos no existen. Está a propósito: si
 * alguien confunde esto con producción, que sea evidente.
 */

import type { Poliza } from "./tipos";

export const CARTERA_DEMO: Poliza[] = [
  {
    numero: "DEMO-AU-4471902",
    cliente: "Martín Gómez",
    documento: "28417663",
    patente: "AB123CD",
    compania: "Compañía Demo Seguros",
    ramo: "Automotores",
    detalle: "Volkswagen Gol Trend 1.6 · 2019",
    cobertura: "C3 — Todo riesgo con franquicia",
    incluye: [
      "Responsabilidad civil hacia terceros",
      "Robo e incendio total y parcial",
      "Daño total y parcial por accidente",
      "Granizo",
      "Cristales y cerraduras",
      "Asistencia mecánica y grúa 24 h",
    ],
    sumaAsegurada: "$ 18.900.000",
    franquicia: "$ 480.000",
    formaPago: "Débito automático · Visa terminada en 4417",
    proximoVencimiento: "2026-10-10",
    cuotasImpagas: 0,
    vigenciaDesde: "2026-03-01",
    vigenciaHasta: "2027-02-28",
    estado: "VIGENTE",
    asistencia: "0800-000-1111",
  },
  {
    numero: "DEMO-AU-5590331",
    cliente: "Laura Fernández",
    documento: "33128904",
    patente: "AA456BB",
    compania: "Compañía Demo Seguros",
    ramo: "Automotores",
    detalle: "Toyota Etios XLS · 2021",
    cobertura: "B1 — Responsabilidad civil + robo e incendio total",
    incluye: [
      "Responsabilidad civil hacia terceros",
      "Robo e incendio total",
      "Asistencia mecánica y grúa 24 h",
    ],
    sumaAsegurada: "$ 22.400.000",
    franquicia: "No aplica en esta cobertura",
    formaPago: "Transferencia · CBU registrado",
    proximoVencimiento: "2026-09-05",
    cuotasImpagas: 2,
    vigenciaDesde: "2026-01-15",
    vigenciaHasta: "2027-01-14",
    estado: "VIGENTE",
    asistencia: "0800-000-1111",
  },
  {
    numero: "DEMO-AU-2210447",
    cliente: "Comercial del Sur S.R.L.",
    documento: "30712334568",
    patente: "XYZ789",
    compania: "Otra Demo Seguros",
    ramo: "Automotores",
    detalle: "Fiat Fiorino · 2015",
    cobertura: null,
    incluye: [],
    sumaAsegurada: null,
    franquicia: null,
    formaPago: null,
    proximoVencimiento: null,
    cuotasImpagas: 0,
    vigenciaDesde: "2025-06-01",
    vigenciaHasta: "2026-05-31",
    estado: "VENCIDA",
    asistencia: null,
  },
];

/** Misma idea que el campo `texto` del buscador: patente, documento o número. */
export function buscarEnDemo(texto: string): Poliza | null {
  const clave = texto.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (clave.length < 4) return null;

  return (
    CARTERA_DEMO.find((p) => {
      const candidatos = [p.patente, p.documento, p.numero, p.cliente]
        .filter((v): v is string => Boolean(v))
        .map((v) => v.toLowerCase().replace(/[^a-z0-9]/g, ""));
      return candidatos.some((c) => c === clave || c.includes(clave));
    }) ?? null
  );
}
