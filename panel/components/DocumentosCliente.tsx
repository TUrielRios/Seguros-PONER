"use client";

import { useState } from "react";

export type ArchivoCliente = {
  id: number;
  nombre: string;
  extension: string | null;
  mime: string | null;
  bytes: number;
  modificado_en: string | null;
  historico: boolean;
  carpeta: string;
  ruta_relativa: string;
};

const FECHA = new Intl.DateTimeFormat("es-AR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function tamanio(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function icono(extension: string | null): string {
  if (extension === "pdf") return "▤";
  if (["jpg", "jpeg", "png", "webp", "gif"].includes(extension ?? "")) return "▣";
  return "▢";
}

/**
 * Documentos de la carpeta del cliente, con el archivo a la vista.
 *
 * El visor está incrustado a propósito: el objetivo es no tener que salir del
 * sistema para mirar una póliza. El binario lo sirve el propio panel
 * (`/admin/api/documentos/:id/contenido`), así que no hace falta que cada persona de
 * la agencia tenga permiso sobre la carpeta de Drive.
 */
export function DocumentosCliente({ archivos }: { archivos: ArchivoCliente[] }) {
  const vigentes = archivos.filter((a) => !a.historico);
  const historicos = archivos.filter((a) => a.historico);

  // Abre la póliza, no la foto de la tarjeta de circulación: en una carpeta el
  // PDF es casi siempre lo que se viene a buscar, aunque no sea lo más nuevo.
  const inicial =
    vigentes.find((a) => a.extension === "pdf") ?? vigentes[0] ?? archivos[0] ?? null;
  const [abierto, setAbierto] = useState<ArchivoCliente | null>(inicial);

  if (archivos.length === 0) {
    return (
      <p className="rounded-xl border border-[var(--color-borde)] bg-[var(--color-panel)] p-5 text-sm text-[var(--color-tenue)]">
        No hay archivos indexados para este cliente. Puede ser que su carpeta no
        esté en el Drive todavía, o que el nombre de la carpeta no coincida con
        el del cliente.
      </p>
    );
  }

  const esImagen = (a: ArchivoCliente) => (a.mime ?? "").startsWith("image/");
  const esPdf = (a: ArchivoCliente) => a.mime === "application/pdf";

  function Fila({ a }: { a: ArchivoCliente }) {
    const activo = abierto?.id === a.id;
    return (
      <li>
        <button
          onClick={() => setAbierto(a)}
          aria-current={activo ? "true" : undefined}
          className={`flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${
            activo
              ? "bg-[var(--color-marca-humo)] ring-1 ring-inset ring-[var(--color-marca-borde)]"
              : "hover:bg-[var(--color-elevado)]"
          }`}
        >
          <span aria-hidden="true" className="mt-0.5 text-[var(--color-tenue)]">
            {icono(a.extension)}
          </span>
          <span className="min-w-0 flex-1">
            <span
              className={`block truncate text-sm ${
                activo
                  ? "font-medium text-[var(--color-marca-tinta)]"
                  : "text-[var(--color-tinta)]"
              }`}
            >
              {a.nombre}
            </span>
            <span className="numero block text-xs text-[var(--color-tenue)]">
              {tamanio(a.bytes)}
              {a.modificado_en &&
                ` · ${FECHA.format(new Date(a.modificado_en))}`}
            </span>
          </span>
        </button>
      </li>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <div className="tarjeta max-h-[640px] overflow-auto p-3">
        <ul className="space-y-0.5">
          {vigentes.map((a) => (
            <Fila key={a.id} a={a} />
          ))}
        </ul>

        {historicos.length > 0 && (
          <>
            <p className="mt-4 mb-1 px-2.5 text-xs font-medium uppercase tracking-wide text-[var(--color-tenue)]">
              Histórico ({historicos.length})
            </p>
            <ul className="space-y-0.5">
              {historicos.map((a) => (
                <Fila key={a.id} a={a} />
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="tarjeta flex min-h-[420px] flex-col overflow-hidden">
        {abierto && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--color-borde)] px-4 py-2.5">
            <span className="min-w-0 truncate text-sm font-medium">{abierto.nombre}</span>
            <a
              href={`/admin/api/documentos/${abierto.id}/contenido`}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 text-xs font-medium text-[var(--color-marca-tinta)] hover:underline"
            >
              Abrir en pestaña nueva ↗
            </a>
          </div>
        )}

        <div className="flex-1 bg-[var(--color-fondo)]">
          {abierto && esPdf(abierto) && (
            <iframe
              key={abierto.id}
              src={`/admin/api/documentos/${abierto.id}/contenido#view=FitH`}
              title={abierto.nombre}
              className="h-[560px] w-full"
            />
          )}

          {abierto && esImagen(abierto) && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={abierto.id}
              src={`/admin/api/documentos/${abierto.id}/contenido`}
              alt={abierto.nombre}
              className="mx-auto max-h-[560px] object-contain p-4"
            />
          )}

          {abierto && !esPdf(abierto) && !esImagen(abierto) && (
            <div className="grid h-full place-items-center p-8 text-center">
              <div>
                <p className="text-sm text-[var(--color-secundario)]">
                  Este tipo de archivo no se puede previsualizar acá.
                </p>
                <a
                  href={`/admin/api/documentos/${abierto.id}/contenido`}
                  className="mt-2 inline-block text-sm font-medium text-[var(--color-marca-tinta)] hover:underline"
                >
                  Descargar {abierto.nombre}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
