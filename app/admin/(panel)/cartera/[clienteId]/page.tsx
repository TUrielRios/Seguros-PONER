import Link from "next/link";
import { api, type FichaCliente } from "@panel/lib/api";
import { diasLegible, fecha, pesos, tonoVencimiento } from "@panel/lib/formato";
import { DocumentosCliente, type ArchivoCliente } from "@panel/components/DocumentosCliente";

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string | number | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-[var(--color-tenue)]">{etiqueta}</dt>
      <dd className="numero mt-0.5 text-sm">{valor === null || valor === "" ? "—" : valor}</dd>
    </div>
  );
}

function Metrica({ etiqueta, valor, tono }: { etiqueta: string; valor: string; tono?: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-borde)] bg-[var(--color-panel)] p-4">
      <div className="text-xs uppercase tracking-wide text-[var(--color-tenue)]">{etiqueta}</div>
      <div className={`numero mt-1 text-xl font-semibold ${tono ?? ""}`}>{valor}</div>
    </div>
  );
}

export default async function Ficha({ params }: { params: Promise<{ clienteId: string }> }) {
  const { clienteId } = await params;
  const c = await api<FichaCliente>(`/api/v1/clientes/${clienteId}`);
  const r = c.resumen;

  // Los documentos son un extra: si el índice no está configurado, la ficha
  // tiene que seguir mostrando todo lo demás igual.
  const archivos = await api<ArchivoCliente[]>(
    `/api/v1/clientes/${clienteId}/documentos`,
  ).catch(() => [] as ArchivoCliente[]);

  return (
    <>
      <Link href="/admin/cartera" className="text-sm text-[var(--color-tenue)] hover:underline">
        ← Volver a la cartera
      </Link>

      <header className="mt-4 flex flex-wrap items-baseline gap-3">
        <h1 className="text-2xl font-semibold">{c.denominacion}</h1>
        <span className="rounded-full bg-black/5 px-2.5 py-0.5 text-xs text-[var(--color-tenue)]">
          {c.estado.toLowerCase()}
        </span>
        {c.whatsappOptIn && (
          <span className="rounded-full bg-[var(--color-ok)]/12 px-2.5 py-0.5 text-xs text-[var(--color-ok-tinta)]">
            WhatsApp habilitado
          </span>
        )}
      </header>

      <section className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Metrica etiqueta="Pólizas vigentes" valor={`${r.polizasVigentes} / ${r.polizasTotales}`} />
        <Metrica etiqueta="Prima anual vigente" valor={pesos(r.primaAnualVigente)} />
        <Metrica
          etiqueta="Deuda"
          valor={pesos(r.deudaTotal)}
          tono={Number(r.deudaTotal) > 0 ? "text-[var(--color-alerta-tinta)]" : ""}
        />
        <Metrica
          etiqueta="Próximo vencimiento"
          valor={fecha(r.proximoVencimiento)}
        />
      </section>

      <section className="mt-6 rounded-xl border border-[var(--color-borde)] bg-[var(--color-panel)] p-5">
        <dl className="grid grid-cols-2 gap-5 md:grid-cols-4">
          <Dato etiqueta="CUIT" valor={c.cuit} />
          <Dato etiqueta="DNI" valor={c.dni} />
          <Dato etiqueta="Teléfono" valor={c.telefono} />
          <Dato etiqueta="Email" valor={c.email} />
          <Dato etiqueta="Localidad" valor={[c.localidad, c.provincia].filter(Boolean).join(", ")} />
          <Dato etiqueta="Asesor" valor={c.asesor} />
          <Dato etiqueta="Cliente desde" valor={fecha(c.fechaAlta)} />
          <Dato
            etiqueta="Antigüedad"
            valor={r.antiguedadAnios === null ? null : `${r.antiguedadAnios} años`}
          />
        </dl>
        {c.driveCarpetaId && (
          <a
            href={`https://drive.google.com/drive/folders/${c.driveCarpetaId}`}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block text-sm text-[var(--color-marca-tinta)] hover:underline"
          >
            Abrir carpeta en Drive ↗
          </a>
        )}
      </section>

      <h2 className="mt-8 mb-3 text-lg font-semibold">
        Documentos{" "}
        <span className="text-[var(--color-tenue)]">({archivos.length})</span>
      </h2>
      <DocumentosCliente archivos={archivos} />

      <h2 className="mt-8 mb-3 text-lg font-semibold">
        Pólizas <span className="text-[var(--color-tenue)]">({c.polizas.length})</span>
      </h2>

      <div className="overflow-hidden rounded-xl border border-[var(--color-borde)] bg-[var(--color-panel)]">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--color-borde)] bg-[var(--color-fondo)] text-left text-xs uppercase tracking-wide text-[var(--color-tenue)]">
            <tr>
              <th className="px-4 py-3 font-medium">Nº</th>
              <th className="px-4 py-3 font-medium">Ramo / Compañía</th>
              <th className="px-4 py-3 font-medium">Detalle</th>
              <th className="px-4 py-3 font-medium">Vigencia</th>
              <th className="px-4 py-3 text-right font-medium">Prima</th>
              <th className="px-4 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {c.polizas.map((p) => (
              <tr key={p.id} className="border-b border-[var(--color-borde)] last:border-0">
                <td className="numero px-4 py-3">{p.numero}</td>
                <td className="px-4 py-3">
                  {p.ramo}
                  <div className="text-xs text-[var(--color-tenue)]">{p.compania}</div>
                </td>
                <td className="numero px-4 py-3 text-[var(--color-tenue)]">{p.detalle ?? "—"}</td>
                <td className="px-4 py-3">
                  {fecha(p.vigenciaDesde)} – {fecha(p.vigenciaHasta)}
                  {p.estado === "VIGENTE" && (
                    <div className={`text-xs ${tonoVencimiento(p.diasHastaVencimiento)}`}>
                      {diasLegible(p.diasHastaVencimiento)}
                    </div>
                  )}
                </td>
                <td className="numero px-4 py-3 text-right">{pesos(p.prima)}</td>
                <td className="px-4 py-3">
                  <span className="text-xs text-[var(--color-tenue)]">{p.estado.toLowerCase()}</span>
                  {p.cuotasImpagas > 0 && (
                    <div className="text-xs text-[var(--color-alerta-tinta)]">
                      {p.cuotasImpagas} cuota{p.cuotasImpagas > 1 ? "s" : ""} impaga
                      {p.cuotasImpagas > 1 ? "s" : ""}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
