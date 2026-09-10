import Link from "next/link";
import { api, type DetalleRevision } from "@panel/lib/api";
import { FormularioRevision } from "@panel/components/FormularioRevision";

export default async function DetalleRevisionPagina({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const caso = await api<DetalleRevision>(`/api/v1/revision/${id}`);

  const enlaceDrive = caso.drive_file_id
    ? `https://drive.google.com/file/d/${caso.drive_file_id}/view`
    : null;

  return (
    <>
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/revision" className="text-sm text-[var(--color-tenue)] hover:underline">
            ← Volver a la cola
          </Link>
          <h1 className="mt-1 text-xl font-semibold">{caso.nombre_archivo}</h1>
        </div>
        <div className="flex items-center gap-3 text-sm text-[var(--color-tenue)]">
          <span>
            {caso.tipo_detectado ?? "sin clasificar"} · extractor {caso.motor} ·
            confianza {(Number(caso.confianza) * 100).toFixed(0)}%
          </span>
          {enlaceDrive && (
            <a
              href={enlaceDrive}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--color-marca-tinta)] hover:underline"
            >
              Abrir original ↗
            </a>
          )}
        </div>
      </header>

      {caso.validaciones?.length > 0 && (
        <div className="mb-4 rounded-lg bg-[var(--color-alerta)]/10 px-4 py-2 text-sm text-[var(--color-alerta-tinta)]">
          Validaciones que fallaron: {caso.validaciones.join(", ")}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Izquierda: lo que el sistema leyó del documento */}
        <section className="rounded-xl border border-[var(--color-borde)] bg-[var(--color-panel)]">
          <div className="border-b border-[var(--color-borde)] px-4 py-2 text-xs uppercase tracking-wide text-[var(--color-tenue)]">
            Texto del documento
          </div>
          <pre className="max-h-[70vh] overflow-auto px-4 py-3 text-xs leading-relaxed whitespace-pre-wrap">
            {caso.textoDocumento || "(no se pudo leer el texto del documento)"}
          </pre>
        </section>

        {/* Derecha: lo que extrajo, editable */}
        <section className="rounded-xl border border-[var(--color-borde)] bg-[var(--color-panel)] p-4">
          <div className="mb-3 text-xs uppercase tracking-wide text-[var(--color-tenue)]">
            Datos extraídos — corregí lo que haga falta
          </div>
          <FormularioRevision
            revisionId={caso.id}
            payload={caso.payload}
            confianzaCampos={caso.confianza_campos ?? {}}
            camposDudosos={caso.campos_dudosos ?? []}
          />
        </section>
      </div>
    </>
  );
}
