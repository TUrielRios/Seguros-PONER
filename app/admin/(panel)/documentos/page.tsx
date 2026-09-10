import { api } from "@panel/lib/api";
import { EncabezadoPagina } from "@panel/components/Shell";
import { Indexador } from "@panel/components/Indexador";
import { Insignia, Tarjeta } from "@panel/components/viz/Primitivas";
import { entero } from "@panel/lib/viz";

export const dynamic = "force-dynamic";

type EstadoDocumentos = {
  configurado: boolean;
  raiz: string | null;
  totales: {
    archivos: number;
    vinculados: number;
    carpetas: number;
    ultimo_indexado: string | null;
  };
};

const FECHA = new Intl.DateTimeFormat("es-AR", {
  dateStyle: "short",
  timeStyle: "short",
});

export default async function Documentos() {
  const e = await api<EstadoDocumentos>("/api/v1/documentos/estado").catch(() => null);
  const t = e?.totales;
  const sinVincular = t ? t.archivos - t.vinculados : 0;

  return (
    <>
      <EncabezadoPagina
        titulo="Documentos"
        bajada="Índice de la carpeta de Clientes. Los archivos se muestran en la ficha de cada uno."
      />

      {!e?.configurado ? (
        <Tarjeta titulo="Falta indicar dónde está la carpeta">
          <p className="text-sm text-[var(--color-secundario)]">
            El sistema no copia los documentos: los lee de la carpeta de Clientes
            sincronizada en esta máquina con Google Drive para escritorio.
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-[var(--color-secundario)]">
            <li>
              Instalá <strong>Google Drive para escritorio</strong> e iniciá sesión con
              la cuenta que tiene acceso al Drive de la agencia.
            </li>
            <li>
              Buscá la carpeta <code className="rounded bg-black/5 px-1">Clientes</code>{" "}
              dentro de la unidad que crea (normalmente <code className="rounded bg-black/5 px-1">G:</code>).
            </li>
            <li>
              Poné esa ruta en la variable{" "}
              <code className="rounded bg-black/5 px-1">DOCUMENTOS_RAIZ</code> y
              reiniciá la API.
            </li>
          </ol>
          <p className="mt-4 text-xs text-[var(--color-tenue)]">
            Mientras tanto apunta a una carpeta de ejemplo, así se puede ver cómo
            queda sin esperar a la sincronización.
          </p>
        </Tarjeta>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Tarjeta>
              <p className="text-xs font-medium text-[var(--color-tenue)]">Archivos indexados</p>
              <p className="mt-2 text-2xl font-semibold">{entero(t?.archivos ?? 0)}</p>
            </Tarjeta>
            <Tarjeta>
              <p className="text-xs font-medium text-[var(--color-tenue)]">Carpetas de cliente</p>
              <p className="mt-2 text-2xl font-semibold">{entero(t?.carpetas ?? 0)}</p>
            </Tarjeta>
            <Tarjeta>
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs font-medium text-[var(--color-tenue)]">Sin vincular</p>
                {sinVincular > 0 && <Insignia clave="aviso">revisar</Insignia>}
              </div>
              <p className="mt-2 text-2xl font-semibold">{entero(sinVincular)}</p>
            </Tarjeta>
            <Tarjeta>
              <p className="text-xs font-medium text-[var(--color-tenue)]">Último indexado</p>
              <p className="mt-2 text-sm">
                {t?.ultimo_indexado
                  ? FECHA.format(new Date(t.ultimo_indexado))
                  : "nunca"}
              </p>
            </Tarjeta>
          </div>

          <Tarjeta
            className="mt-5"
            titulo="Actualizar el índice"
            bajada="Recorre la carpeta y refleja lo que haya: lo nuevo entra, lo borrado sale."
          >
            <p className="mb-4 text-xs text-[var(--color-tenue)]">
              Leyendo de{" "}
              <code className="rounded bg-black/5 px-1 break-all">{e.raiz}</code>
            </p>
            <Indexador />
          </Tarjeta>
        </>
      )}
    </>
  );
}
