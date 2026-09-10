import Link from "next/link";

import {
  api,
  type EstadoIngesta,
  type FilaMes,
  type FilaRamo,
  type FilaRetencion,
  type Pagina,
  type RenovacionPendiente,
  type ResultadoCartera,
  type TableroCompanias,
} from "@panel/lib/api";
import { fecha, pesos } from "@panel/lib/formato";
import {
  entero,
  estadoLossRatio,
  mesCorto,
  num,
  pesosCompactos,
  porcentaje,
} from "@panel/lib/viz";
import { BarrasRanking } from "@panel/components/viz/BarrasRanking";
import { Insignia, SinDatos, TablaGemela, Tarjeta } from "@panel/components/viz/Primitivas";
import { SerieTemporal } from "@panel/components/viz/SerieTemporal";
import { StatTile } from "@panel/components/viz/StatTile";

export const dynamic = "force-dynamic";

/** Si un tablero falla, el resto de la pantalla tiene que seguir sirviendo. */
async function opcional<T>(p: Promise<T>): Promise<T | null> {
  try {
    return await p;
  } catch {
    return null;
  }
}

function sumar(filas: { [k: string]: unknown }[], campo: string): number {
  return filas.reduce((acc, f) => acc + (num(f[campo] as string) ?? 0), 0);
}

export default async function Tablero() {
  const [meses, ramos, companias, retencion, avisos, ingesta, vigentes] = await Promise.all([
    opcional(api<FilaMes[]>("/api/v1/tableros/resultado-tecnico")),
    opcional(api<FilaRamo[]>("/api/v1/tableros/por-ramo")),
    opcional(api<TableroCompanias>("/api/v1/tableros/por-compania")),
    opcional(api<FilaRetencion[]>("/api/v1/tableros/retencion")),
    opcional(api<{ tipo: string; estado: string; cantidad: number }[]>("/api/v1/avisos/resumen")),
    opcional(api<EstadoIngesta>("/api/v1/ingesta/estado")),
    opcional(api<Pagina<ResultadoCartera>>("/api/v1/cartera/buscar?estados=VIGENTE&tamanio=1")),
  ]);
  const proximas = await opcional(api<RenovacionPendiente[]>("/api/v1/renovaciones/pendientes"));

  // ── Ventana de 12 meses: un año móvil compara contra sí mismo sin que la
  //    estacionalidad del ramo ensucie la lectura.
  const ultimos12 = (meses ?? []).slice(-12);
  const primaAnual = sumar(ultimos12, "prima_devengada");
  const incurridoAnual = sumar(ultimos12, "incurrido");
  const lossRatio = primaAnual > 0 ? (100 * incurridoAnual) / primaAnual : null;
  const estadoLR = estadoLossRatio(lossRatio);

  const retencionReciente = (retencion ?? []).filter((r) => num(r.tasa_renovacion_pct) !== null);
  const ultimaRetencion = retencionReciente.at(-1);
  const tasaRetencion = num(ultimaRetencion?.tasa_renovacion_pct ?? null);

  const avisosPendientes = (avisos ?? [])
    .filter((a) => a.estado === "PENDIENTE")
    .reduce((acc, a) => acc + a.cantidad, 0);

  const porRevisar = ingesta?.pendientesRevision ?? 0;
  const venciendo30 = (proximas ?? []).filter((r) => r.dias >= 0 && r.dias <= 30);

  const serieMeses = ultimos12.map((m) => ({
    etiqueta: mesCorto(m.mes),
    valores: [num(m.prima_devengada)],
  }));
  const serieLR = ultimos12.map((m) => ({
    etiqueta: mesCorto(m.mes),
    valores: [num(m.loss_ratio_pct)],
  }));
  const serieRetencion = retencionReciente.slice(-12).map((r) => ({
    etiqueta: mesCorto(r.mes),
    valores: [num(r.tasa_renovacion_pct)],
  }));

  const ramosOrdenados = (ramos ?? [])
    .map((r) => ({ ...r, primaNum: num(r.prima_devengada) ?? 0 }))
    .sort((a, b) => b.primaNum - a.primaNum)
    .slice(0, 8);

  const companiasOrdenadas = (companias?.companias ?? [])
    .map((c) => ({ ...c, primaNum: num(c.prima_devengada) ?? 0 }))
    .sort((a, b) => b.primaNum - a.primaNum);

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Tablero</h1>
        <p className="mt-1 text-sm text-[var(--color-tenue)]">
          Cartera y resultado técnico de los últimos 12 meses.
        </p>
      </header>

      {/* ── Fila de indicadores ────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <StatTile
            etiqueta="Prima devengada · 12 meses"
            valor={pesosCompactos(primaAnual)}
            detalle={`${entero(ultimos12.length)} meses con movimiento`}
            serie={ultimos12.map((m) => num(m.prima_devengada) ?? 0)}
            destacado
          />
        </div>

        <StatTile
          etiqueta="Siniestralidad"
          valor={porcentaje(lossRatio)}
          detalle={`${pesosCompactos(incurridoAnual)} incurrido`}
          serie={ultimos12.map((m) => num(m.loss_ratio_pct) ?? 0)}
          color="var(--color-serie-2)"
          insignia={<Insignia clave={estadoLR.clave}>{estadoLR.texto}</Insignia>}
        />

        <StatTile
          etiqueta="Retención"
          valor={porcentaje(tasaRetencion)}
          detalle={
            ultimaRetencion
              ? `${entero(ultimaRetencion.renovadas)} de ${entero(ultimaRetencion.vencidas)} en ${mesCorto(ultimaRetencion.mes)}`
              : "sin cierre reciente"
          }
          serie={retencionReciente.slice(-12).map((r) => num(r.tasa_renovacion_pct) ?? 0)}
          color="var(--color-serie-3)"
        />

        <StatTile
          etiqueta="Pólizas vigentes"
          valor={entero(vigentes?.total ?? null)}
          detalle={`${entero(ramosOrdenados.length)} ramos activos`}
        />

        <StatTile
          etiqueta="Vencen en 30 días"
          valor={entero(venciendo30.length)}
          detalle={
            venciendo30.length > 0
              ? `${entero(venciendo30.filter((r) => !r.opt_in).length)} sin opt-in de WhatsApp`
              : "nada por vencer"
          }
          insignia={
            venciendo30.length > 0 ? <Insignia clave="aviso">a gestionar</Insignia> : undefined
          }
        />

        <StatTile
          etiqueta="Pendientes"
          valor={entero(avisosPendientes + porRevisar)}
          detalle={`${entero(avisosPendientes)} avisos · ${entero(porRevisar)} documentos por revisar`}
          insignia={porRevisar > 0 ? <Insignia clave="neutro">cola</Insignia> : undefined}
        />
      </div>

      {/* ── Evolución ──────────────────────────────────────────────────── */}
      <div className="mt-5 grid items-start gap-4 xl:grid-cols-2">
        <Tarjeta
          titulo="Prima devengada por mes"
          bajada="Devengada pro rata temporis, no emitida."
        >
          {serieMeses.length > 1 ? (
            <>
              <SerieTemporal
                puntos={serieMeses}
                series={[{ nombre: "Prima devengada", color: "var(--color-serie-1)" }]}
                formato="pesos"
              />
              <TablaGemela
                columnas={["Mes", "Prima devengada", "Incurrido", "Siniestros"]}
                filas={ultimos12.map((m) => [
                  mesCorto(m.mes),
                  pesos(m.prima_devengada),
                  pesos(m.incurrido),
                  entero(m.siniestros),
                ])}
              />
            </>
          ) : (
            <SinDatos />
          )}
        </Tarjeta>

        <Tarjeta
          titulo="Siniestralidad por mes"
          bajada="Incurrido sobre prima devengada. El umbral marca el 70%."
        >
          {serieLR.length > 1 ? (
            <>
              <SerieTemporal
                puntos={serieLR}
                series={[{ nombre: "Loss ratio", color: "var(--color-serie-2)" }]}
                formato="pct"
                referencia={{ valor: 70, nombre: "umbral 70%" }}
              />
              <TablaGemela
                columnas={["Mes", "Loss ratio", "Frecuencia", "Severidad media"]}
                filas={ultimos12.map((m) => [
                  mesCorto(m.mes),
                  porcentaje(m.loss_ratio_pct),
                  num(m.frecuencia)?.toFixed(4) ?? "—",
                  pesos(m.severidad_media),
                ])}
              />
            </>
          ) : (
            <SinDatos />
          )}
        </Tarjeta>
      </div>

      {/* ── Composición ────────────────────────────────────────────────── */}
      <div className="mt-5 grid items-start gap-4 xl:grid-cols-2">
        <Tarjeta
          titulo="Prima por ramo"
          bajada="Qué productos sostienen la cartera."
          acciones={
            <Link
              href="/admin/analitica"
              className="text-xs font-medium text-[var(--color-marca-tinta)] hover:underline"
            >
              Ver analítica
            </Link>
          }
        >
          {ramosOrdenados.length > 0 ? (
            <>
              <BarrasRanking
                filas={ramosOrdenados.map((r) => ({
                  nombre: r.ramo,
                  valor: r.primaNum,
                  nota: `Loss ratio ${porcentaje(r.loss_ratio_pct)} · ${entero(r.polizas)} pólizas`,
                }))}
                formato="pesos"
              />
              <TablaGemela
                columnas={["Ramo", "Prima devengada", "Loss ratio", "Pólizas"]}
                filas={ramosOrdenados.map((r) => [
                  r.ramo,
                  pesos(r.prima_devengada),
                  porcentaje(r.loss_ratio_pct),
                  entero(r.polizas),
                ])}
              />
            </>
          ) : (
            <SinDatos />
          )}
        </Tarjeta>

        <Tarjeta
          titulo="Prima por compañía"
          bajada="Con qué aseguradoras se concentra el negocio."
          acciones={
            companias ? (
              <Insignia
                clave={
                  companias.hhi > 2500 ? "alerta" : companias.hhi > 1500 ? "aviso" : "ok"
                }
              >
                HHI {entero(companias.hhi)} · {companias.interpretacionHhi}
              </Insignia>
            ) : undefined
          }
        >
          {companiasOrdenadas.length > 0 ? (
            <>
              <BarrasRanking
                filas={companiasOrdenadas.map((c) => ({
                  nombre: c.compania,
                  valor: c.primaNum,
                  nota: `${porcentaje(c.participacion_pct)} de la cartera · loss ratio ${porcentaje(c.loss_ratio_pct)}`,
                }))}
                formato="pesos"
                color="var(--color-serie-2)"
              />
              <TablaGemela
                columnas={["Compañía", "Prima devengada", "Participación", "Loss ratio"]}
                filas={companiasOrdenadas.map((c) => [
                  c.compania,
                  pesos(c.prima_devengada),
                  porcentaje(c.participacion_pct),
                  porcentaje(c.loss_ratio_pct),
                ])}
              />
            </>
          ) : (
            <SinDatos />
          )}
        </Tarjeta>
      </div>

      {/* ── Retención + trabajo pendiente ──────────────────────────────── */}
      <div className="mt-5 grid items-start gap-4 xl:grid-cols-[1fr_420px]">
        <Tarjeta
          titulo="Retención mensual"
          bajada="Pólizas renovadas sobre vencidas, por mes de vencimiento."
        >
          {serieRetencion.length > 1 ? (
            <>
              <SerieTemporal
                puntos={serieRetencion}
                series={[{ nombre: "Tasa de renovación", color: "var(--color-serie-3)" }]}
                formato="pct"
                alto={200}
              />
              <TablaGemela
                columnas={["Mes", "Vencidas", "Renovadas", "Tasa"]}
                filas={retencionReciente.slice(-12).map((r) => [
                  mesCorto(r.mes),
                  entero(r.vencidas),
                  entero(r.renovadas),
                  porcentaje(r.tasa_renovacion_pct),
                ])}
              />
            </>
          ) : (
            <SinDatos>Todavía no hay cadenas de renovación cerradas.</SinDatos>
          )}
        </Tarjeta>

        <Tarjeta
          titulo="Próximas a vencer"
          bajada="Las diez más cercanas."
          acciones={
            <Link
              href="/admin/renovaciones"
              className="text-xs font-medium text-[var(--color-marca-tinta)] hover:underline"
            >
              Ver todas
            </Link>
          }
        >
          {venciendo30.length === 0 ? (
            <SinDatos>Ninguna póliza vence en los próximos 30 días.</SinDatos>
          ) : (
            <ul className="-mx-2 divide-y divide-[var(--color-borde)]">
              {venciendo30
                .sort((a, b) => a.dias - b.dias)
                .slice(0, 10)
                .map((r) => (
                  <li key={r.poliza_id}>
                    <Link
                      href={`/admin/cartera/${r.cliente_id}`}
                      className="fila-clickable flex items-center justify-between gap-3 rounded-lg px-2 py-2.5"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-[var(--color-tinta)]">
                          {r.cliente}
                        </span>
                        <span className="block truncate text-xs text-[var(--color-tenue)]">
                          {r.ramo} · {r.compania}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="numero block text-sm text-[var(--color-tinta)]">
                          {fecha(r.vigencia_hasta)}
                        </span>
                        <span className="block text-xs text-[var(--color-tenue)]">
                          {r.dias === 0 ? "vence hoy" : `en ${r.dias} d`}
                          {!r.opt_in && " · sin opt-in"}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          )}
        </Tarjeta>
      </div>
    </>
  );
}
