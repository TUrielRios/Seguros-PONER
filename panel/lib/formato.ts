/** Formateo argentino: pesos, fechas y plurales. */

const PESOS = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const FECHA = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function pesos(valor: number | string | null | undefined): string {
  if (valor === null || valor === undefined || valor === "") return "—";
  const n = typeof valor === "string" ? Number(valor) : valor;
  return Number.isFinite(n) ? PESOS.format(n) : "—";
}

export function fecha(iso: string | null | undefined): string {
  if (!iso) return "—";
  // "2026-08-06" se parsea como UTC y en Argentina se ve un día antes.
  // Se fuerza mediodía local para evitarlo.
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime()) ? "—" : FECHA.format(d);
}

export function diasLegible(dias: number | null | undefined): string {
  if (dias === null || dias === undefined) return "—";
  if (dias < 0) return `vencida hace ${Math.abs(dias)} d`;
  if (dias === 0) return "vence hoy";
  if (dias === 1) return "vence mañana";
  return `en ${dias} d`;
}

/** Color según urgencia del vencimiento. */
export function tonoVencimiento(dias: number | null | undefined): string {
  if (dias === null || dias === undefined) return "text-[var(--color-tenue)]";
  if (dias < 0) return "text-[var(--color-alerta-tinta)] font-medium";
  if (dias <= 15) return "text-[var(--color-alerta-tinta)]";
  if (dias <= 45) return "text-[var(--color-aviso-tinta)]";
  return "text-[var(--color-tenue)]";
}
