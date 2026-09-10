"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Isotipo, Logotipo } from "./Marca";

const SECCIONES = [
  { href: "/admin", texto: "Tablero", exacta: true, icono: "▤" },
  { href: "/admin/cartera", texto: "Cartera", icono: "☰" },
  { href: "/admin/renovaciones", texto: "Renovaciones", icono: "↻" },
  { href: "/admin/avisos", texto: "Avisos", icono: "✉" },
  { href: "/admin/chatbot", texto: "Chatbot", icono: "💬" },
  { href: "/admin/documentos", texto: "Documentos", icono: "🗀" },
  { href: "/admin/revision", texto: "Revisión", icono: "⚑" },
  { href: "/admin/analitica", texto: "Analítica", icono: "◱" },
  { href: "/admin/reservas", texto: "Reservas", icono: "∑" },
];

function Menu({ compacto = false }: { compacto?: boolean }) {
  const ruta = usePathname();

  return (
    <nav className={compacto ? "flex gap-1 overflow-x-auto" : "flex flex-col gap-0.5"}>
      {SECCIONES.map((s) => {
        const activa = s.exacta ? ruta === s.href : ruta.startsWith(s.href);
        return (
          <Link
            key={s.href}
            href={s.href}
            aria-current={activa ? "page" : undefined}
            className={`flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
              activa
                ? "bg-white/12 font-medium text-white"
                : "text-white/65 hover:bg-white/8 hover:text-white"
            }`}
          >
            <span aria-hidden="true" className="w-4 text-center text-[0.8rem] opacity-80">
              {s.icono}
            </span>
            {s.texto}
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * Marco de la aplicación.
 *
 * La barra lateral es el único lugar donde el rojo de la marca ocupa una
 * superficie grande. Dentro del contenido el fondo es neutro a propósito:
 * si el rojo se repite en las tarjetas, deja de señalar y pasa a ser ruido,
 * y encima compite con el rojo que sí significa "esto necesita atención".
 */
export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[236px_1fr]">
      <aside className="sticky top-0 z-20 hidden h-screen flex-col bg-[var(--color-marca)] lg:flex">
        <div className="px-5 py-5">
          <Link href="/admin" className="inline-flex rounded-md">
            <Logotipo tono="claro" />
          </Link>
        </div>

        <div className="flex-1 px-3">
          <Menu />
        </div>

        <div className="border-t border-white/15 p-3">
          <form action="/admin/api/logout" method="post">
            <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-white/65 transition-colors hover:bg-white/8 hover:text-white">
              <span aria-hidden="true" className="mr-2.5 inline-block w-4 text-center opacity-80">
                ⏻
              </span>
              Salir
            </button>
          </form>
        </div>
      </aside>

      {/* En pantallas chicas la barra pasa a una franja arriba. */}
      <header className="sticky top-0 z-20 bg-[var(--color-marca)] px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <Link href="/admin" className="inline-flex text-white">
            <Isotipo className="h-7 w-7" />
          </Link>
          <form action="/admin/api/logout" method="post">
            <button className="text-sm text-white/70 hover:text-white">Salir</button>
          </form>
        </div>
        <div className="mt-3">
          <Menu compacto />
        </div>
      </header>

      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** Encabezado de página. Reemplaza el bloque que cada pantalla repetía. */
export function EncabezadoPagina({
  titulo,
  bajada,
  acciones,
}: {
  titulo: string;
  bajada?: string;
  acciones?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-tinta)]">
          {titulo}
        </h1>
        {bajada && <p className="mt-1 text-sm text-[var(--color-tenue)]">{bajada}</p>}
      </div>
      {acciones}
    </header>
  );
}
