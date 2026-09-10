"use client";

import { useState } from "react";

import { formatear, pathBarraH, type Formato } from "@panel/lib/viz";

export type FilaBarra = {
  nombre: string;
  valor: number;
  /** Dato de apoyo que va al tooltip, no al gráfico. */
  nota?: string;
};

/**
 * Ranking horizontal. Una sola serie, un solo color.
 *
 * Nada de pintar cada barra de un tono según su valor: el largo YA dice
 * cuánto vale, y gastar el color en repetirlo desperdicia el único canal que
 * queda libre para decir algo nuevo.
 */
export function BarrasRanking({
  filas,
  formato,
  color = "var(--color-marca)",
  alturaFila = 34,
}: {
  filas: FilaBarra[];
  formato: Formato;
  color?: string;
  alturaFila?: number;
}) {
  const [activa, setActiva] = useState<number | null>(null);
  const fmt = (v: number) => formatear(v, formato);

  if (filas.length === 0) {
    return <p className="py-10 text-center text-sm text-[var(--color-tenue)]">Sin datos.</p>;
  }

  const ANCHO = 520;
  const ANCHO_ETIQUETA = 150;
  const ANCHO_VALOR = 76;
  const GROSOR = 16; // ≤24px: la barra no llena su carril, el aire hace el resto
  const alto = filas.length * alturaFila;
  const wPista = ANCHO - ANCHO_ETIQUETA - ANCHO_VALOR;
  const max = Math.max(...filas.map((f) => f.valor), 1);

  return (
    <div className="relative overflow-x-auto">
      <svg
        viewBox={`0 0 ${ANCHO} ${alto}`}
        className="w-full"
        role="img"
        aria-label="Ranking por magnitud"
        onMouseLeave={() => setActiva(null)}
      >
        {filas.map((f, i) => {
          const y = i * alturaFila;
          const yBarra = y + (alturaFila - GROSOR) / 2;
          const ancho = Math.max(0, (f.valor / max) * wPista);

          return (
            <g
              key={f.nombre}
              onMouseEnter={() => setActiva(i)}
              onFocus={() => setActiva(i)}
              tabIndex={0}
              role="img"
              aria-label={`${f.nombre}: ${fmt(f.valor)}${f.nota ? `. ${f.nota}` : ""}`}
            >
              <rect x="0" y={y} width={ANCHO} height={alturaFila} fill="transparent" />

              <text
                x="0"
                y={y + alturaFila / 2}
                dominantBaseline="middle"
                className="fill-[var(--color-secundario)] text-[12px]"
              >
                {f.nombre.length > 24 ? `${f.nombre.slice(0, 23)}…` : f.nombre}
              </text>

              {/* Pista de fondo: da el 100% de referencia sin dibujar una grilla. */}
              <rect
                x={ANCHO_ETIQUETA}
                y={yBarra}
                width={wPista}
                height={GROSOR}
                rx="4"
                fill="var(--color-grilla)"
                opacity="0.6"
              />
              <path
                d={pathBarraH(ANCHO_ETIQUETA, yBarra, ancho, GROSOR)}
                fill={color}
                opacity={activa === null || activa === i ? 1 : 0.45}
              />

              {/* Valor al final del carril, siempre fuera de la barra: así
                  nunca queda recortado dentro de una barra corta. */}
              <text
                x={ANCHO}
                y={y + alturaFila / 2}
                textAnchor="end"
                dominantBaseline="middle"
                className="numero fill-[var(--color-tinta)] text-[12px] font-medium"
              >
                {fmt(f.valor)}
              </text>
            </g>
          );
        })}
      </svg>

      {activa !== null && filas[activa].nota && (
        <div className="pointer-events-none absolute right-0 top-0 rounded-lg border border-[var(--color-borde)] bg-[var(--color-panel)] px-3 py-2 text-xs shadow-lg">
          <p className="font-semibold text-[var(--color-tinta)]">{filas[activa].nombre}</p>
          <p className="mt-0.5 text-[var(--color-tenue)]">{filas[activa].nota}</p>
        </div>
      )}
    </div>
  );
}
