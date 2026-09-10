import Link from "next/link";
import { Suspense } from "react";
import { api, type Catalogos, type Pagina, type ResultadoCartera } from "@panel/lib/api";
import { diasLegible, fecha, pesos, tonoVencimiento } from "@panel/lib/formato";
import { Filtros } from "@panel/components/Filtros";
import { Paginador } from "@panel/components/Paginador";
import { EncabezadoPagina } from "@panel/components/Shell";

type Params = Promise<Record<string, string | string[] | undefined>>;

function construirQuery(sp: Record<string, string | string[] | undefined>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (v === undefined || v === "") continue;
    if (Array.isArray(v)) v.forEach((x) => q.append(k, x));
    else q.set(k, v);
  }
  if (!q.has("tamanio")) q.set("tamanio", "25");
  return q.toString();
}

export default async function Cartera({ searchParams }: { searchParams: Params }) {
  const sp = await searchParams;
  const [catalogos, resultados] = await Promise.all([
    api<Catalogos>("/api/v1/catalogos"),
    api<Pagina<ResultadoCartera>>(`/api/v1/cartera/buscar?${construirQuery(sp)}`),
  ]);

  return (
    <>
      <EncabezadoPagina titulo="Cartera" />

      <Suspense>
        <Filtros catalogos={catalogos} />
      </Suspense>

      <div className="mt-6 overflow-hidden rounded-xl border border-[var(--color-borde)] bg-[var(--color-panel)]">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--color-borde)] bg-[var(--color-fondo)] text-left text-xs uppercase tracking-wide text-[var(--color-tenue)]">
            <tr>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Póliza</th>
              <th className="px-4 py-3 font-medium">Ramo / Compañía</th>
              <th className="px-4 py-3 font-medium">Detalle</th>
              <th className="px-4 py-3 font-medium">Vence</th>
              <th className="px-4 py-3 text-right font-medium">Prima</th>
              <th className="px-4 py-3 font-medium">Alertas</th>
            </tr>
          </thead>
          <tbody>
            {resultados.contenido.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center text-[var(--color-tenue)]">
                  Sin resultados. Probá con menos filtros.
                </td>
              </tr>
            )}
            {resultados.contenido.map((r) => (
              <tr
                key={r.polizaId}
                className="border-b border-[var(--color-borde)] last:border-0 hover:bg-[var(--color-fondo)]"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/cartera/${r.clienteId}`}
                    className="font-medium hover:text-[var(--color-marca-tinta)] hover:underline"
                  >
                    {r.cliente}
                  </Link>
                  <div className="numero text-xs text-[var(--color-tenue)]">{r.documento ?? "—"}</div>
                </td>
                <td className="numero px-4 py-3">{r.numero}</td>
                <td className="px-4 py-3">
                  {r.ramo}
                  <div className="text-xs text-[var(--color-tenue)]">{r.compania}</div>
                </td>
                <td className="numero px-4 py-3 text-[var(--color-tenue)]">{r.patentes ?? "—"}</td>
                <td className={`px-4 py-3 ${tonoVencimiento(r.diasHastaVencimiento)}`}>
                  {fecha(r.vigenciaHasta)}
                  <div className="text-xs">{diasLegible(r.diasHastaVencimiento)}</div>
                </td>
                <td className="numero px-4 py-3 text-right">{pesos(r.prima)}</td>
                <td className="px-4 py-3">
                  <span className="flex flex-wrap gap-1">
                    {r.cuotasImpagas > 0 && (
                      <span className="rounded-full bg-[var(--color-alerta)]/10 px-2 py-0.5 text-xs text-[var(--color-alerta-tinta)]">
                        {r.cuotasImpagas} impaga{r.cuotasImpagas > 1 ? "s" : ""}
                      </span>
                    )}
                    {r.siniestrosAbiertos > 0 && (
                      <span className="rounded-full bg-[var(--color-aviso)]/15 px-2 py-0.5 text-xs text-[var(--color-aviso-tinta)]">
                        {r.siniestrosAbiertos} siniestro{r.siniestrosAbiertos > 1 ? "s" : ""}
                      </span>
                    )}
                    {r.estado !== "VIGENTE" && (
                      <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs text-[var(--color-tenue)]">
                        {r.estado.toLowerCase()}
                      </span>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <Suspense>
          <Paginador
            pagina={resultados.pagina}
            totalPaginas={resultados.totalPaginas}
            total={resultados.total}
          />
        </Suspense>
      </div>
    </>
  );
}
