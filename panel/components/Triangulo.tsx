"use client";

import { useState } from "react";

type Resultado = {
  suficiencia: {
    suficiente: boolean;
    motivos: string[];
    origenes: number;
    desarrollos: number;
    siniestros: number;
  };
  triangulo: { origenes: string[]; filas: (number | null)[][]; base: string };
  resultado: {
    origenes: string[];
    factores: number[];
    diagonal: number[];
    ultimate: number[];
    ibnr: number[];
    ibnrTotal: number;
    errorEstandar?: number[];
    errorEstandarTotal?: number;
    cvTotal?: number | null;
  } | null;
  diagnosticos?: { aplicable: boolean; alertas: string[] };
  mensaje?: string;
};

const money = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

export function Triangulo() {
  const [datos, setDatos] = useState<Resultado | null>(null);
  const [fallo, setFallo] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [metodo, setMetodo] = useState("mack");
  const [base, setBase] = useState("incurrido");

  /**
   * "No se pudo calcular" y "los datos no alcanzan" son cosas distintas y hay
   * que decirlas distinto.
   *
   * Antes cualquier respuesta sin `suficiencia` —un servicio caído, un 500—
   * caía en la rama de datos insuficientes, porque `!undefined` es `true`. El
   * panel llegó a anunciar "con este volumen cualquier número sería falsa
   * precisión" con 81 siniestros y 9 años de origen cargados: de sobra para
   * el método. Lo que fallaba era una consulta SQL.
   */
  async function calcular() {
    setCargando(true);
    setFallo(null);
    try {
      const res = await fetch("/admin/api/actuarial/reservas/triangulo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metodo, base, granularidad: "anual" }),
      });
      const cuerpo = await res.json().catch(() => null);

      if (!res.ok) {
        setDatos(null);
        setFallo(cuerpo?.detail ?? cuerpo?.message ?? `El servicio respondió ${res.status}.`);
      } else if (!cuerpo || typeof cuerpo.suficiencia !== "object") {
        setDatos(null);
        setFallo("La respuesta del servicio de analítica no tiene el formato esperado.");
      } else {
        setDatos(cuerpo as Resultado);
      }
    } catch (e) {
      setDatos(null);
      setFallo(e instanceof Error ? e.message : "No se pudo contactar al servidor.");
    } finally {
      setCargando(false);
    }
  }

  const sel =
    "h-10 rounded-lg border border-[var(--color-borde-fuerte)] bg-white px-3 text-sm";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <select className={sel} value={metodo} onChange={(e) => setMetodo(e.target.value)}>
          <option value="mack">Mack (Chain Ladder + error estándar)</option>
          <option value="chain_ladder">Chain Ladder</option>
        </select>
        <select className={sel} value={base} onChange={(e) => setBase(e.target.value)}>
          <option value="incurrido">Incurrido (pagado + reserva)</option>
          <option value="pagado">Solo pagado</option>
        </select>
        <button
          onClick={calcular}
          disabled={cargando}
          className="rounded-lg bg-[var(--color-marca-accion)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-marca-tinta)] disabled:opacity-50"
        >
          {cargando ? "Calculando…" : "Calcular"}
        </button>
      </div>

      {fallo && (
        <div className="rounded-xl border border-[var(--color-marca-borde)] bg-[var(--color-marca-humo)] p-5">
          <h3 className="font-medium text-[var(--color-marca-tinta)]">
            No se pudo calcular
          </h3>
          <p className="mt-1 text-sm text-[var(--color-secundario)]">{fallo}</p>
          <p className="mt-3 text-xs text-[var(--color-tenue)]">
            Esto es una falla del sistema, no una conclusión sobre tus datos.
          </p>
        </div>
      )}

      {datos && !datos.suficiencia.suficiente && (
        <div className="rounded-xl border border-[var(--color-aviso)] bg-[var(--color-aviso)]/8 p-5">
          <h3 className="font-medium">Datos insuficientes</h3>
          <p className="mt-1 text-sm text-[var(--color-secundario)]">
            {datos.mensaje ??
              "Con este volumen, cualquier número sería falsa precisión."}
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            {datos.suficiencia.motivos?.map((m) => <li key={m}>{m}</li>)}
          </ul>
          <p className="mt-3 text-xs text-[var(--color-tenue)]">
            Mínimos del método: 4 períodos de origen, 3 de desarrollo y 30 siniestros,
            sin años en cero. Tenés {datos.suficiencia.origenes} orígenes,{" "}
            {datos.suficiencia.desarrollos} desarrollos y {datos.suficiencia.siniestros}{" "}
            siniestros.
          </p>
        </div>
      )}

      {datos?.diagnosticos && datos.diagnosticos.alertas.length > 0 && (
        <div className="rounded-xl border border-[var(--color-aviso)] bg-[var(--color-aviso)]/8 p-5">
          <h3 className="font-medium">Los supuestos del método no se cumplen del todo</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {datos.diagnosticos.alertas.map((a) => <li key={a}>{a}</li>)}
          </ul>
          <p className="mt-3 text-xs text-[var(--color-tenue)]">
            No invalida el cálculo, pero sí obliga a mirarlo con criterio antes de
            usarlo para una decisión.
          </p>
        </div>
      )}

      {datos?.resultado && (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Caja etiqueta="IBNR total" valor={`$${money.format(datos.resultado.ibnrTotal)}`} />
            {datos.resultado.errorEstandarTotal !== undefined && (
              <Caja
                etiqueta="Error estándar"
                valor={`± $${money.format(datos.resultado.errorEstandarTotal)}`}
              />
            )}
            {datos.resultado.cvTotal != null && (
              <Caja
                etiqueta="Coef. de variación"
                valor={`${(datos.resultado.cvTotal * 100).toFixed(0)}%`}
                nota={datos.resultado.cvTotal > 0.5 ? "muy incierto" : "razonable"}
              />
            )}
            <Caja etiqueta="Siniestros" valor={String(datos.suficiencia.siniestros)} />
          </div>

          <div className="overflow-auto rounded-xl border border-[var(--color-borde)] bg-[var(--color-panel)]">
            <table className="w-full text-xs">
              <thead className="border-b border-[var(--color-borde)] bg-[var(--color-fondo)] text-[var(--color-tenue)]">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Origen</th>
                  {datos.triangulo.filas[0]?.map((_, j) => (
                    <th key={j} className="px-3 py-2 text-right font-medium">
                      {j}
                    </th>
                  ))}
                  <th className="px-3 py-2 text-right font-medium">Ultimate</th>
                  <th className="px-3 py-2 text-right font-medium">IBNR</th>
                </tr>
              </thead>
              <tbody>
                {datos.triangulo.filas.map((fila, i) => (
                  <tr key={i} className="border-b border-[var(--color-borde)] last:border-0">
                    <td className="px-3 py-2 font-medium">{datos.triangulo.origenes[i]}</td>
                    {fila.map((celda, j) => (
                      <td
                        key={j}
                        className={`numero px-3 py-2 text-right ${
                          celda === null ? "text-[var(--color-borde)]" : ""
                        }`}
                      >
                        {celda === null ? "·" : money.format(celda)}
                      </td>
                    ))}
                    <td className="numero px-3 py-2 text-right font-medium">
                      {money.format(datos.resultado!.ultimate[i])}
                    </td>
                    <td className="numero px-3 py-2 text-right text-[var(--color-marca-tinta)]">
                      {money.format(datos.resultado!.ibnr[i])}
                    </td>
                  </tr>
                ))}
                <tr className="bg-[var(--color-fondo)]">
                  <td className="px-3 py-2 font-medium">Factores</td>
                  {datos.resultado.factores.map((f, j) => (
                    <td key={j} className="numero px-3 py-2 text-right text-[var(--color-tenue)]">
                      {f.toFixed(3)}
                    </td>
                  ))}
                  <td colSpan={2} />
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function Caja({ etiqueta, valor, nota }: { etiqueta: string; valor: string; nota?: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-borde)] bg-[var(--color-panel)] p-4">
      <div className="text-xs uppercase tracking-wide text-[var(--color-tenue)]">{etiqueta}</div>
      <div className="numero mt-1 text-xl font-semibold">{valor}</div>
      {nota && <div className="mt-1 text-xs text-[var(--color-tenue)]">{nota}</div>}
    </div>
  );
}
