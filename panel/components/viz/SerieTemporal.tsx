"use client";

import { useId, useState } from "react";

import { escalaLineal, formatear, pathArea, pathLinea, type Formato } from "@panel/lib/viz";
import { Leyenda } from "./Primitivas";

export type Punto = { etiqueta: string; valores: (number | null)[] };

/**
 * Líneas sobre un eje. UN solo eje siempre.
 *
 * Dos medidas de escalas distintas nunca comparten panel: el punto donde se
 * cruzan las dos escalas es arbitrario y el gráfico termina insinuando una
 * correlación que los datos no tienen. Para eso van dos gráficos.
 */
export function SerieTemporal({
  puntos,
  series,
  alto = 240,
  formato,
  referencia,
}: {
  puntos: Punto[];
  series: { nombre: string; color: string }[];
  alto?: number;
  formato: Formato;
  /** Línea horizontal de umbral, con su nombre. */
  referencia?: { valor: number; nombre: string };
}) {
  const fmt = (v: number) => formatear(v, formato);
  const id = useId();
  const [activo, setActivo] = useState<number | null>(null);

  const ANCHO = 560;
  // El margen derecho tiene que alcanzar para la etiqueta del último valor:
  // con 16px el número quedaba recortado contra el borde de la tarjeta.
  const M = { top: 16, right: 60, bottom: 26, left: 46 };
  const wPlot = ANCHO - M.left - M.right;
  const hPlot = alto - M.top - M.bottom;

  const todos = puntos
    .flatMap((p) => p.valores)
    .filter((v): v is number => v !== null && Number.isFinite(v));
  if (todos.length === 0 || puntos.length < 2) {
    return <p className="py-10 text-center text-sm text-[var(--color-tenue)]">Sin datos suficientes.</p>;
  }

  const maxDato = Math.max(...todos, referencia?.valor ?? 0);
  const { tope, ticks } = escalaLineal(maxDato);

  const x = (i: number) => M.left + (i / (puntos.length - 1)) * wPlot;
  const y = (v: number) => M.top + hPlot - (v / tope) * hPlot;

  // Con muchos meses, etiquetar todos amontona el eje: se muestra 1 de cada N.
  const cadaCuantos = Math.ceil(puntos.length / 8);

  return (
    <div>
      <Leyenda series={series} />

      <div className="relative">
        <svg
          viewBox={`0 0 ${ANCHO} ${alto}`}
          className="w-full"
          role="img"
          aria-label={`Evolución de ${series.map((s) => s.nombre).join(" y ")}`}
          onMouseLeave={() => setActivo(null)}
        >
          {/* Grilla: hairline sólida, un paso del fondo. Nunca punteada. */}
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={M.left}
                x2={ANCHO - M.right}
                y1={y(t)}
                y2={y(t)}
                stroke="var(--color-grilla)"
                strokeWidth="1"
              />
              <text
                x={M.left - 8}
                y={y(t)}
                textAnchor="end"
                dominantBaseline="middle"
                className="numero fill-[var(--color-tenue)] text-[10px]"
              >
                {fmt(t)}
              </text>
            </g>
          ))}

          {referencia && referencia.valor <= tope && (
            <g>
              <line
                x1={M.left}
                x2={ANCHO - M.right}
                y1={y(referencia.valor)}
                y2={y(referencia.valor)}
                stroke="var(--color-eje)"
                strokeWidth="1"
              />
              {/* Al inicio del plot: contra el borde derecho chocaba con la
                  etiqueta del último punto y las dos quedaban ilegibles. */}
              <text
                x={M.left + 4}
                y={y(referencia.valor) - 5}
                textAnchor="start"
                className="fill-[var(--color-tenue)] text-[10px]"
              >
                {referencia.nombre}
              </text>
            </g>
          )}

          {series.map((s, si) => {
            const validos = puntos
              .map((p, i) => ({ i, v: p.valores[si] }))
              .filter((d): d is { i: number; v: number } => d.v !== null);
            if (validos.length < 2) return null;
            const coords = validos.map((d) => ({ x: x(d.i), y: y(d.v) }));
            const fin = coords[coords.length - 1];
            const ultimo = validos[validos.length - 1].v;

            return (
              <g key={s.nombre}>
                {series.length === 1 && (
                  <path d={pathArea(coords, M.top + hPlot)} fill={s.color} opacity="0.08" />
                )}
                <path
                  d={pathLinea(coords)}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Etiqueta directa solo en la punta: un número por punto es ilegible. */}
                <circle cx={fin.x} cy={fin.y} r="4" fill={s.color} stroke="var(--color-panel)" strokeWidth="2" />
                {/* Anclada al borde del viewBox, no al punto: así el ancho del
                    número nunca decide si entra o se corta. */}
                <text
                  x={ANCHO - 2}
                  y={fin.y}
                  dominantBaseline="middle"
                  textAnchor="end"
                  className="numero fill-[var(--color-tinta)] text-[11px] font-semibold"
                >
                  {fmt(ultimo)}
                </text>
              </g>
            );
          })}

          {activo !== null && (
            <line
              x1={x(activo)}
              x2={x(activo)}
              y1={M.top}
              y2={M.top + hPlot}
              stroke="var(--color-eje)"
              strokeWidth="1"
            />
          )}

          {puntos.map((p, i) => (
            <text
              key={`${id}-eje-${i}`}
              x={x(i)}
              y={alto - 8}
              textAnchor="middle"
              className="fill-[var(--color-tenue)] text-[10px]"
              opacity={i % cadaCuantos === 0 || i === puntos.length - 1 ? 1 : 0}
            >
              {p.etiqueta}
            </text>
          ))}

          {/* Banda de captura por punto: el objetivo de hover es la franja
              entera, no el círculo de 4px. */}
          {puntos.map((p, i) => (
            <rect
              key={`${id}-hit-${i}`}
              x={x(i) - wPlot / (puntos.length - 1) / 2}
              y={M.top}
              width={wPlot / (puntos.length - 1)}
              height={hPlot}
              fill="transparent"
              onMouseEnter={() => setActivo(i)}
              onFocus={() => setActivo(i)}
              tabIndex={0}
              role="img"
              aria-label={`${p.etiqueta}: ${series
                .map((s, si) => `${s.nombre} ${p.valores[si] === null ? "sin dato" : fmt(p.valores[si]!)}`)
                .join(", ")}`}
            />
          ))}
        </svg>

        {activo !== null && (
          <div
            className="pointer-events-none absolute top-2 z-10 rounded-lg border border-[var(--color-borde)] bg-[var(--color-panel)] px-3 py-2 text-xs shadow-lg"
            style={{
              left: `${(x(activo) / ANCHO) * 100}%`,
              transform: x(activo) > ANCHO / 2 ? "translateX(-105%)" : "translateX(5%)",
            }}
          >
            <p className="font-semibold text-[var(--color-tinta)]">{puntos[activo].etiqueta}</p>
            {series.map((s, si) => (
              <p key={s.nombre} className="mt-1 flex items-center gap-2 whitespace-nowrap">
                <span className="h-0.5 w-3 rounded-full" style={{ background: s.color }} />
                <span className="text-[var(--color-tenue)]">{s.nombre}</span>
                <span className="numero ml-auto font-medium text-[var(--color-tinta)]">
                  {puntos[activo].valores[si] === null
                    ? "—"
                    : fmt(puntos[activo].valores[si]!)}
                </span>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
