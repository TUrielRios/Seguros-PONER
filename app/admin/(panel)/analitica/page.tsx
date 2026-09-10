import {
  api, type FilaMes, type FilaRamo, type FilaRetencion, type Frescura,
  type TableroCompanias,
} from "@panel/lib/api";
import { pesos } from "@panel/lib/formato";
import { Barra, tonoLossRatio } from "@panel/components/Barra";
import { EncabezadoPagina } from "@panel/components/Shell";

function num(v: string | number | null | undefined): number {
  return v === null || v === undefined ? 0 : Number(v);
}

function pct(v: string | null): string {
  return v === null ? "—" : `${Number(v).toFixed(1)}%`;
}

function mesCorto(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return new Intl.DateTimeFormat("es-AR", { month: "short", year: "2-digit" }).format(d);
}

export default async function Analitica() {
  const [meses, ramos, companias, retencion, frescura] = await Promise.all([
    api<FilaMes[]>("/api/v1/tableros/resultado-tecnico"),
    api<FilaRamo[]>("/api/v1/tableros/por-ramo"),
    api<TableroCompanias>("/api/v1/tableros/por-compania"),
    api<FilaRetencion[]>("/api/v1/tableros/retencion"),
    api<Frescura[]>("/api/v1/tableros/frescura"),
  ]);

  const primaTotal = ramos.reduce((a, r) => a + num(r.prima_devengada), 0);
  const incurridoTotal = ramos.reduce((a, r) => a + num(r.incurrido), 0);
  const lossRatioGlobal = primaTotal > 0 ? (100 * incurridoTotal) / primaTotal : null;

  const ultimos = retencion.slice(-12);
  const renovadas = ultimos.reduce((a, r) => a + num(r.renovadas), 0);
  const vencidas = ultimos.reduce((a, r) => a + num(r.vencidas), 0);
  const retencionGlobal = vencidas > 0 ? (100 * renovadas) / vencidas : null;

  const maxPrimaRamo = Math.max(...ramos.map((r) => num(r.prima_devengada)), 1);
  const maxPrimaMes = Math.max(...meses.map((m) => num(m.prima_devengada)), 1);
  const ultimoRefresco = frescura[0]?.refrescado_en;

  return (
    <>
      <EncabezadoPagina titulo="Analítica de cartera" />

      {ultimoRefresco && (
        <p className="mb-4 text-xs text-[var(--color-tenue)]">
          Datos al{" "}
          {new Intl.DateTimeFormat("es-AR", {
            dateStyle: "short",
            timeStyle: "short",
          }).format(new Date(ultimoRefresco))}
          . Las vistas se refrescan cada noche.
        </p>
      )}

      <section className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Tarjeta etiqueta="Prima devengada" valor={pesos(primaTotal)} />
        <Tarjeta
          etiqueta="Siniestralidad"
          valor={lossRatioGlobal === null ? "—" : `${lossRatioGlobal.toFixed(1)}%`}
          nota="incurrido / prima devengada"
          tono={tonoLossRatio(lossRatioGlobal)}
        />
        <Tarjeta
          etiqueta="Retención (12 m)"
          valor={retencionGlobal === null ? "—" : `${retencionGlobal.toFixed(1)}%`}
          nota={`${renovadas} de ${vencidas} renovadas`}
        />
        <Tarjeta
          etiqueta="Concentración"
          valor={String(companias.hhi)}
          nota={companias.interpretacionHhi}
          tono={companias.hhi > 2500 ? "alerta" : companias.hhi > 1500 ? "aviso" : "ok"}
        />
      </section>

      {/* ── Por ramo: la pregunta de negocio más importante ── */}
      <h2 className="mb-3 text-lg font-semibold">Resultado por ramo</h2>
      <p className="mb-3 text-sm text-[var(--color-tenue)]">
        Qué producto deja plata y cuál se come la rentabilidad.
      </p>
      <Tabla
        cabeceras={["Ramo", "Prima devengada", "Siniestralidad", "Frecuencia", "Severidad", "Siniestros"]}
        filas={ramos.map((r) => {
          const lr = r.loss_ratio_pct === null ? null : Number(r.loss_ratio_pct);
          return [
            <div key="r">
              <span className="font-medium">{r.ramo}</span>
              <div className="mt-1">
                <Barra valor={num(r.prima_devengada)} maximo={maxPrimaRamo} />
              </div>
            </div>,
            <span key="p" className="numero">{pesos(r.prima_devengada)}</span>,
            <span
              key="l"
              className="numero"
              style={{ color: `var(--color-${tonoLossRatio(lr)}-tinta)` }}
            >
              {pct(r.loss_ratio_pct)}
            </span>,
            <span key="f" className="numero">
              {r.frecuencia === null ? "—" : `${(Number(r.frecuencia) * 100).toFixed(1)}%`}
            </span>,
            <span key="s" className="numero">{pesos(r.severidad_media)}</span>,
            <span key="n" className="numero">{r.siniestros}</span>,
          ];
        })}
      />

      {/* ── Por compañía ── */}
      <h2 className="mt-10 mb-3 text-lg font-semibold">Por compañía</h2>
      <p className="mb-3 text-sm text-[var(--color-tenue)]">
        Base para negociar condiciones: dónde está el volumen y cómo se comporta la
        siniestralidad de cada aseguradora.
      </p>
      <Tabla
        cabeceras={["Compañía", "Prima devengada", "Participación", "Siniestralidad", "Siniestros"]}
        filas={companias.companias.map((c) => {
          const lr = c.loss_ratio_pct === null ? null : Number(c.loss_ratio_pct);
          return [
            <span key="c" className="font-medium">{c.compania}</span>,
            <span key="p" className="numero">{pesos(c.prima_devengada)}</span>,
            <span key="pa" className="numero">{pct(c.participacion_pct)}</span>,
            <span key="l" className="numero" style={{ color: `var(--color-${tonoLossRatio(lr)}-tinta)` }}>
              {pct(c.loss_ratio_pct)}
            </span>,
            <span key="s" className="numero">{c.siniestros}</span>,
          ];
        })}
      />

      {/* ── Evolución mensual ── */}
      <h2 className="mt-10 mb-3 text-lg font-semibold">Evolución mensual</h2>
      <Tabla
        cabeceras={["Mes", "Prima devengada", "Incurrido", "Siniestralidad", "Siniestros"]}
        filas={meses.slice(-24).reverse().map((m) => {
          const lr = m.loss_ratio_pct === null ? null : Number(m.loss_ratio_pct);
          return [
            <div key="m">
              {mesCorto(m.mes)}
              <div className="mt-1">
                <Barra valor={num(m.prima_devengada)} maximo={maxPrimaMes} />
              </div>
            </div>,
            <span key="p" className="numero">{pesos(m.prima_devengada)}</span>,
            <span key="i" className="numero">{pesos(m.incurrido)}</span>,
            <span key="l" className="numero" style={{ color: `var(--color-${tonoLossRatio(lr)}-tinta)` }}>
              {pct(m.loss_ratio_pct)}
            </span>,
            <span key="s" className="numero">{m.siniestros}</span>,
          ];
        })}
      />

      <p className="mt-8 rounded-xl border border-[var(--color-borde)] bg-[var(--color-panel)] p-4 text-xs leading-relaxed text-[var(--color-tenue)]">
        <strong>Cómo leer estos números.</strong> La prima está{" "}
        <em>devengada</em> (prorrateada día a día), no emitida: una póliza anual
        vendida en octubre aporta tres meses al año calendario, no doce. El
        incurrido combina lo pagado con la reserva pendiente según la convención
        documentada en la migración V009 — si la compañía informa los movimientos
        de otra manera, hay que ajustarla antes de tomar decisiones con estos
        valores.
      </p>
    </>
  );
}

function Tarjeta({
  etiqueta, valor, nota, tono,
}: {
  etiqueta: string;
  valor: string;
  nota?: string;
  tono?: "ok" | "aviso" | "alerta";
}) {
  return (
    <div className="rounded-xl border border-[var(--color-borde)] bg-[var(--color-panel)] p-4">
      <div className="text-xs uppercase tracking-wide text-[var(--color-tenue)]">{etiqueta}</div>
      <div
        className="numero mt-1 text-2xl font-semibold"
        style={tono ? { color: `var(--color-${tono}-tinta)` } : undefined}
      >
        {valor}
      </div>
      {nota && <div className="mt-1 text-xs text-[var(--color-tenue)]">{nota}</div>}
    </div>
  );
}

function Tabla({
  cabeceras, filas,
}: {
  cabeceras: string[];
  filas: React.ReactNode[][];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-borde)] bg-[var(--color-panel)]">
      <table className="w-full text-sm">
        <thead className="border-b border-[var(--color-borde)] bg-[var(--color-fondo)] text-left text-xs uppercase tracking-wide text-[var(--color-tenue)]">
          <tr>
            {cabeceras.map((c, i) => (
              <th key={c} className={`px-4 py-2 font-medium ${i > 0 ? "text-right" : ""}`}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.length === 0 && (
            <tr>
              <td colSpan={cabeceras.length} className="px-4 py-12 text-center text-[var(--color-tenue)]">
                Sin datos. ¿Se refrescaron las vistas?
              </td>
            </tr>
          )}
          {filas.map((fila, i) => (
            <tr key={i} className="border-b border-[var(--color-borde)] last:border-0">
              {fila.map((celda, j) => (
                <td key={j} className={`px-4 py-2.5 ${j > 0 ? "text-right" : ""}`}>
                  {celda}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
