/**
 * Utilidades de gráficos. SVG a mano, sin librería de charting.
 *
 * No es ahorro de bundle por deporte: estos gráficos son pocos y simples, y
 * escribirlos a mano deja el control fino sobre las cosas que una librería
 * resuelve mal por defecto — grosor de marca, separación entre barras,
 * etiquetas selectivas y el hecho de que cada gráfico tenga su tabla gemela.
 */

/** Convierte a número lo que el backend manda como string decimal. */
export function num(v: string | number | null | undefined): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? n : null;
}

const COMPACTO = new Intl.NumberFormat("es-AR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const ENTERO = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

/** $4,2 M — para valores grandes en poco espacio (KPI, punta de barra). */
export function pesosCompactos(v: number | string | null | undefined): string {
  const n = num(v);
  return n === null ? "—" : `$${COMPACTO.format(n)}`;
}

export function entero(v: number | string | null | undefined): string {
  const n = num(v);
  return n === null ? "—" : ENTERO.format(n);
}

export function porcentaje(
  v: number | string | null | undefined,
  decimales = 1,
): string {
  const n = num(v);
  return n === null
    ? "—"
    : `${n.toLocaleString("es-AR", {
        minimumFractionDigits: decimales,
        maximumFractionDigits: decimales,
      })}%`;
}

/**
 * Los gráficos reciben el NOMBRE del formato, no la función que formatea.
 *
 * El tablero es un server component y los gráficos son client components: una
 * función no cruza esa frontera (no es serializable). Mandar la etiqueta del
 * formato y resolverla del lado del cliente sí funciona.
 */
export type Formato = "pesos" | "pct" | "entero";

export function formatear(v: number, formato: Formato): string {
  if (formato === "pesos") return pesosCompactos(v);
  if (formato === "pct") return `${Math.round(v)}%`;
  return ENTERO.format(v);
}

/** "2026-08" o "2026-08-01" → "ago 26" */
export function mesCorto(iso: string): string {
  const d = new Date(`${iso.length === 7 ? `${iso}-01` : iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d
    .toLocaleDateString("es-AR", { month: "short", year: "2-digit" })
    .replace(".", "");
}

/**
 * Ticks redondos para el eje: 0 / 1.000 / 2.000, nunca 0 / 1.237 / 2.474.
 * Devuelve también el tope, que suele ser mayor que el máximo real.
 */
export function escalaLineal(max: number, pasos = 4): { tope: number; ticks: number[] } {
  if (!Number.isFinite(max) || max <= 0) return { tope: 1, ticks: [0, 1] };
  const crudo = max / pasos;
  const magnitud = 10 ** Math.floor(Math.log10(crudo));
  const normalizado = crudo / magnitud;
  const bonito = normalizado <= 1 ? 1 : normalizado <= 2 ? 2 : normalizado <= 5 ? 5 : 10;
  const paso = bonito * magnitud;
  const tope = Math.ceil(max / paso) * paso;
  const ticks: number[] = [];
  for (let t = 0; t <= tope + paso / 2; t += paso) ticks.push(t);
  return { tope, ticks };
}

/** Path de una polilínea. Sin curvas: una spline inventa valores intermedios. */
export function pathLinea(puntos: { x: number; y: number }[]): string {
  return puntos.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");
}

/** El mismo trazo cerrado contra la base, para el wash de área. */
export function pathArea(
  puntos: { x: number; y: number }[],
  base: number,
): string {
  if (puntos.length === 0) return "";
  const primero = puntos[0];
  const ultimo = puntos[puntos.length - 1];
  return `${pathLinea(puntos)} L${ultimo.x} ${base} L${primero.x} ${base} Z`;
}

/**
 * Rectángulo con las esquinas del extremo de dato redondeadas y las de la
 * base cuadradas. El detalle importa: una barra redondeada en los cuatro
 * lados se despega de su línea de base y deja de leerse como magnitud.
 */
export function pathBarraH(
  x: number,
  y: number,
  ancho: number,
  alto: number,
  radio = 4,
): string {
  const r = Math.max(0, Math.min(radio, ancho, alto / 2));
  if (ancho <= 0) return "";
  return [
    `M${x} ${y}`,
    `H${x + ancho - r}`,
    `A${r} ${r} 0 0 1 ${x + ancho} ${y + r}`,
    `V${y + alto - r}`,
    `A${r} ${r} 0 0 1 ${x + ancho - r} ${y + alto}`,
    `H${x}`,
    "Z",
  ].join(" ");
}

/** Umbrales de siniestralidad. Por encima de 70% el ramo deja de ser rentable
 *  para la compañía, y eso vuelve como peores condiciones de renovación. */
export function estadoLossRatio(
  pct: number | null,
): { clave: "ok" | "aviso" | "alerta"; texto: string } {
  if (pct === null) return { clave: "ok", texto: "sin datos" };
  if (pct >= 90) return { clave: "alerta", texto: "crítico" };
  if (pct >= 70) return { clave: "aviso", texto: "en observación" };
  return { clave: "ok", texto: "sano" };
}
