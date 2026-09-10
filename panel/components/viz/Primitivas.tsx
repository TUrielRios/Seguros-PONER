/**
 * Piezas compartidas por todos los gráficos: tarjeta, insignia de estado y
 * tabla gemela.
 *
 * La tabla gemela no es un extra: un gráfico donde el único modo de leer un
 * valor es apuntarle con el mouse deja afuera a quien navega con teclado, a
 * quien no distingue los colores y a quien lo imprime.
 */

import type { ReactNode } from "react";

export function Tarjeta({
  titulo,
  bajada,
  acciones,
  children,
  className = "",
}: {
  titulo?: string;
  bajada?: string;
  acciones?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`tarjeta flex flex-col p-5 ${className}`}>
      {(titulo || acciones) && (
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            {titulo && (
              <h2 className="text-sm font-semibold text-[var(--color-tinta)]">{titulo}</h2>
            )}
            {bajada && (
              <p className="mt-0.5 text-xs text-[var(--color-tenue)]">{bajada}</p>
            )}
          </div>
          {acciones}
        </header>
      )}
      {children}
    </section>
  );
}

const ESTILO_INSIGNIA = {
  ok: "bg-[#0ca30c]/10 text-[var(--color-ok-tinta)] ring-[#0ca30c]/25",
  aviso: "bg-[#fab219]/15 text-[#7a5300] ring-[#fab219]/40",
  alerta: "bg-[#d03b3b]/10 text-[#a32020] ring-[#d03b3b]/25",
  neutro: "bg-black/5 text-[var(--color-secundario)] ring-black/10",
} as const;

const ICONO = { ok: "●", aviso: "▲", alerta: "■", neutro: "·" } as const;

/**
 * Estado con ícono + palabra, nunca color solo.
 *
 * En esta marca es obligatorio: el rojo institucional y el rojo de "crítico"
 * son casi el mismo color, así que lo que separa "una barra de PONER" de "esto
 * está mal" es el texto, no el tono.
 */
export function Insignia({
  clave,
  children,
}: {
  clave: keyof typeof ESTILO_INSIGNIA;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${ESTILO_INSIGNIA[clave]}`}
    >
      <span aria-hidden="true" className="text-[0.6rem] leading-none">
        {ICONO[clave]}
      </span>
      {children}
    </span>
  );
}

export function TablaGemela({
  columnas,
  filas,
  resumen = "Ver los datos en tabla",
}: {
  columnas: string[];
  filas: (string | number)[][];
  resumen?: string;
}) {
  return (
    <details className="mt-4 border-t border-[var(--color-borde)] pt-3">
      <summary className="cursor-pointer text-xs text-[var(--color-tenue)] hover:text-[var(--color-tinta)]">
        {resumen}
      </summary>
      <div className="mt-3 max-h-64 overflow-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-[var(--color-panel)]">
            <tr className="border-b border-[var(--color-borde)] text-left text-[var(--color-tenue)]">
              {columnas.map((c, i) => (
                <th key={c} className={`py-1.5 pr-3 font-medium ${i > 0 ? "text-right" : ""}`}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="numero">
            {filas.map((fila, i) => (
              <tr key={i} className="border-b border-[var(--color-borde)]/60 last:border-0">
                {fila.map((celda, j) => (
                  <td
                    key={j}
                    className={`py-1.5 pr-3 ${j > 0 ? "text-right" : "font-medium text-[var(--color-tinta)]"}`}
                  >
                    {celda}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

/** Leyenda. Obligatoria desde dos series; con una sola, el título ya la nombra. */
export function Leyenda({ series }: { series: { nombre: string; color: string }[] }) {
  if (series.length < 2) return null;
  return (
    <ul className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1">
      {series.map((s) => (
        <li key={s.nombre} className="flex items-center gap-1.5 text-xs text-[var(--color-secundario)]">
          <span
            aria-hidden="true"
            className="h-0.5 w-3 rounded-full"
            style={{ background: s.color }}
          />
          {s.nombre}
        </li>
      ))}
    </ul>
  );
}

export function SinDatos({ children = "Todavía no hay datos para mostrar." }: { children?: ReactNode }) {
  return (
    <p className="py-10 text-center text-sm text-[var(--color-tenue)]">{children}</p>
  );
}
