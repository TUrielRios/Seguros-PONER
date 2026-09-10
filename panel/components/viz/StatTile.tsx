import type { ReactNode } from "react";

import { pathLinea } from "@panel/lib/viz";

/**
 * Sparkline de contexto: 12 puntos, sin ejes ni valores.
 *
 * Su trabajo es la forma de la tendencia, no la lectura de un número. El
 * número exacto lo da el valor del tile y, si hace falta el detalle, el
 * gráfico grande de más abajo.
 */
function Sparkline({ serie, color }: { serie: number[]; color: string }) {
  if (serie.length < 2) return null;

  const ANCHO = 96;
  const ALTO = 28;
  const min = Math.min(...serie);
  const max = Math.max(...serie);
  const rango = max - min || 1;

  const puntos = serie.map((v, i) => ({
    x: (i / (serie.length - 1)) * ANCHO,
    y: ALTO - 2 - ((v - min) / rango) * (ALTO - 4),
  }));
  const fin = puntos[puntos.length - 1];

  return (
    <svg
      width={ANCHO}
      height={ALTO}
      viewBox={`0 0 ${ANCHO} ${ALTO}`}
      className="overflow-visible"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={pathLinea(puntos)}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.35"
      />
      {/* El período actual va opaco: es el que se está mirando. */}
      <circle cx={fin.x} cy={fin.y} r="3.5" fill={color} stroke="var(--color-panel)" strokeWidth="2" />
    </svg>
  );
}

export function StatTile({
  etiqueta,
  valor,
  detalle,
  serie,
  color = "var(--color-marca)",
  insignia,
  destacado = false,
}: {
  etiqueta: string;
  valor: string;
  detalle?: string;
  serie?: number[];
  color?: string;
  insignia?: ReactNode;
  /** El número con el que abre el tablero. Uno solo por vista. */
  destacado?: boolean;
}) {
  return (
    <div className="tarjeta flex flex-col justify-between p-4">
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-medium text-[var(--color-tenue)]">{etiqueta}</span>
        {insignia}
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          {/* Proporcional a propósito: en un número grande y suelto, los
              dígitos de ancho fijo se ven flojos. */}
          <p
            className={`font-semibold tracking-tight text-[var(--color-tinta)] ${
              destacado ? "text-[2.75rem] leading-none" : "text-2xl leading-none"
            }`}
          >
            {valor}
          </p>
          {detalle && (
            <p className="mt-1.5 truncate text-xs text-[var(--color-tenue)]">{detalle}</p>
          )}
        </div>
        {serie && serie.length > 1 && (
          <div className="shrink-0 pb-0.5">
            <Sparkline serie={serie} color={color} />
          </div>
        )}
      </div>
    </div>
  );
}
