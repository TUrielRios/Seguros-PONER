"use client";

import Link from "next/link";

/**
 * Red de contención de las pantallas del panel.
 *
 * Casi todas son server components que leen de `nucleo`. Sin este límite, con
 * el backend apagado la excepción sube hasta arriba y el operador ve una
 * pantalla de error del framework: no dice qué pasó ni qué hacer, y parece que
 * se rompió el sistema cuando lo único que falta es arrancar la API.
 *
 * La barra lateral queda viva porque el `layout` del grupo está por encima del
 * boundary: se puede seguir navegando a las pantallas que sí funcionan.
 */
export default function ErrorPanel({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // En producción Next reemplaza el mensaje de los errores de server components
  // por uno genérico, así que el texto principal no puede depender de leerlo:
  // tiene que servir igual sin saber cuál fue la causa exacta.
  const sinApi = error.message.includes("No hay respuesta de la API");

  return (
    <div className="mx-auto max-w-xl py-16">
      <div className="tarjeta p-6">
        <h1 className="text-lg font-semibold text-[var(--color-tinta)]">
          {sinApi ? "La API no está respondiendo" : "No se pudo cargar esta pantalla"}
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-[var(--color-secundario)]">
          {sinApi
            ? "Esta pantalla lee los datos del backend, y el backend no está levantado."
            : "Esta pantalla lee los datos de la API. La causa más común es que nucleo no esté levantado."}
        </p>

        <p className="mt-4 text-xs text-[var(--color-tenue)]">Para levantarlo:</p>
        <pre className="mt-1 overflow-x-auto rounded-lg border border-[var(--color-borde)] bg-[var(--color-fondo)] px-3 py-2 text-xs text-[var(--color-tinta)]">
          .\scripts\dev.ps1 nucleo
        </pre>
        <p className="mt-2 text-xs leading-relaxed text-[var(--color-tenue)]">
          Necesita Postgres corriendo. La primera vez Flyway aplica las migraciones y tarda un poco
          más.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            onClick={reset}
            className="rounded-lg bg-[var(--color-marca-accion)] px-3.5 py-2 text-sm font-medium text-white"
          >
            Reintentar
          </button>
          <Link
            href="/admin/chatbot"
            className="rounded-lg border border-[var(--color-borde)] px-3.5 py-2 text-sm hover:border-[var(--color-marca)]"
          >
            Ir al Chatbot
          </Link>
          <span className="text-xs text-[var(--color-tenue)]">
            El simulador de Poné funciona sin backend.
          </span>
        </div>

        <details className="mt-5 border-t border-[var(--color-borde)] pt-3">
          <summary className="cursor-pointer text-xs text-[var(--color-tenue)]">
            Detalle técnico
          </summary>
          <p className="numero mt-2 break-words text-xs text-[var(--color-tenue)]">
            {error.message}
            {error.digest && ` · ${error.digest}`}
          </p>
        </details>
      </div>
    </div>
  );
}
