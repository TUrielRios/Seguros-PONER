import Link from "next/link";
import { api, type CasoRevision, type EstadoIngesta } from "@panel/lib/api";
import { EncabezadoPagina } from "@panel/components/Shell";

const EXPLICACION: Record<string, string> = {
  BAJA_CONFIANZA: "la extracción no llegó al umbral",
  VALIDACION_FALLIDA: "un dato no pasó una validación dura",
  DUPLICADO_POSIBLE: "podría ser un documento ya cargado",
  TIPO_DESCONOCIDO: "no se pudo identificar el tipo de documento",
  ERROR_EXTRACCION: "el extractor falló",
};

function Metrica({ etiqueta, valor, nota }: { etiqueta: string; valor: string; nota?: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-borde)] bg-[var(--color-panel)] p-4">
      <div className="text-xs uppercase tracking-wide text-[var(--color-tenue)]">{etiqueta}</div>
      <div className="numero mt-1 text-2xl font-semibold">{valor}</div>
      {nota && <div className="mt-1 text-xs text-[var(--color-tenue)]">{nota}</div>}
    </div>
  );
}

export default async function Revision() {
  const [cola, estado] = await Promise.all([
    api<CasoRevision[]>("/api/v1/revision?limite=100"),
    api<EstadoIngesta>("/api/v1/ingesta/estado"),
  ]);

  const total = estado.porEstado.reduce((a, e) => a + Number(e.cantidad), 0);
  const aprobados = Number(
    estado.porEstado.find((e) => e.estado === "APROBADO")?.cantidad ?? 0,
  );
  const tasa = total > 0 ? Math.round((100 * aprobados) / total) : 0;

  return (
    <>
      <EncabezadoPagina titulo="Revisión" />

      <section className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Metrica etiqueta="Documentos" valor={total.toLocaleString("es-AR")} />
        <Metrica
          etiqueta="Aprobación automática"
          valor={`${tasa}%`}
          nota="objetivo: más del 70%"
        />
        <Metrica etiqueta="En cola" valor={String(estado.pendientesRevision)} />
        <Metrica
          etiqueta="Escaneados"
          valor={String(estado.porEstado.reduce((a, e) => a + Number(e.escaneados ?? 0), 0))}
          nota="sin capa de texto, requieren OCR"
        />
      </section>

      {estado.calidadExtraccion.length > 0 && (
        <section className="mb-6 overflow-hidden rounded-xl border border-[var(--color-borde)] bg-[var(--color-panel)]">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--color-borde)] bg-[var(--color-fondo)] text-left text-xs uppercase tracking-wide text-[var(--color-tenue)]">
              <tr>
                <th className="px-4 py-2 font-medium">Extractor</th>
                <th className="px-4 py-2 font-medium">Documentos</th>
                <th className="px-4 py-2 font-medium">Confianza media</th>
                <th className="px-4 py-2 font-medium">Sobre umbral</th>
              </tr>
            </thead>
            <tbody>
              {estado.calidadExtraccion.map((c) => (
                <tr key={c.motor} className="border-b border-[var(--color-borde)] last:border-0">
                  <td className="px-4 py-2">{c.motor}</td>
                  <td className="numero px-4 py-2">{c.extracciones}</td>
                  <td className="numero px-4 py-2">{c.confianza_media ?? "—"}</td>
                  <td className="numero px-4 py-2">{c.sobre_umbral}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {cola.length === 0 ? (
        <p className="rounded-xl border border-[var(--color-borde)] bg-[var(--color-panel)] p-12 text-center text-[var(--color-tenue)]">
          La cola está vacía. Nada esperando revisión humana.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--color-borde)] bg-[var(--color-panel)]">
          <table className="w-full text-sm">
            <thead className="border-b border-[var(--color-borde)] bg-[var(--color-fondo)] text-left text-xs uppercase tracking-wide text-[var(--color-tenue)]">
              <tr>
                <th className="px-4 py-3 font-medium">Documento</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Por qué está acá</th>
                <th className="px-4 py-3 font-medium">Confianza</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {cola.map((c) => (
                <tr key={c.id} className="border-b border-[var(--color-borde)] last:border-0">
                  <td className="px-4 py-3">
                    <span className="font-medium">{c.nombre_archivo}</span>
                    <div className="text-xs text-[var(--color-tenue)]">
                      {c.origen} · {c.paginas ?? "?"} pág.
                      {c.tiene_texto === false && " · escaneado"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-tenue)]">
                    {c.tipo_detectado ?? "sin clasificar"}
                  </td>
                  <td className="px-4 py-3">
                    {EXPLICACION[c.motivo] ?? c.motivo}
                    {c.campos_dudosos?.length > 0 && (
                      <div className="text-xs text-[var(--color-tenue)]">
                        {c.campos_dudosos.slice(0, 4).join(", ")}
                      </div>
                    )}
                  </td>
                  <td className="numero px-4 py-3">
                    {(Number(c.confianza) * 100).toFixed(0)}%
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/revision/${c.id}`}
                      className="rounded-lg border border-[var(--color-borde)] px-3 py-1.5 text-sm hover:border-[var(--color-acento)]"
                    >
                      Revisar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
