"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Botones de generación y despacho.
 *
 * "Generar" es seguro de apretar cuantas veces se quiera: el motor es
 * idempotente. "Despachar" con el proveedor mock tampoco envía nada real —
 * solo registra. Eso permite mostrarle el circuito completo al cliente sin
 * riesgo.
 */
export function Acciones({ modoMock }: { modoMock: boolean }) {
  const router = useRouter();
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [resultado, setResultado] = useState<string | null>(null);

  async function ejecutar(accion: "generar" | "despachar") {
    setOcupado(accion);
    setResultado(null);
    const res = await fetch(`/admin/api/avisos/${accion}`, { method: "POST" });
    const datos = await res.json().catch(() => ({}));
    setOcupado(null);
    setResultado(
      res.ok
        ? Object.entries(datos).map(([k, v]) => `${k}: ${v}`).join(" · ")
        : "Falló la operación",
    );
    router.refresh();
  }

  const boton =
    "rounded-lg border border-[var(--color-borde)] bg-white px-3 py-2 text-sm hover:border-[var(--color-acento)] disabled:opacity-50";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button className={boton} disabled={ocupado !== null} onClick={() => ejecutar("generar")}>
        {ocupado === "generar" ? "Generando…" : "Generar avisos"}
      </button>
      <button className={boton} disabled={ocupado !== null} onClick={() => ejecutar("despachar")}>
        {ocupado === "despachar" ? "Despachando…" : "Despachar pendientes"}
      </button>
      {modoMock && (
        <span className="rounded-full bg-[var(--color-aviso)]/15 px-2.5 py-1 text-xs text-[var(--color-aviso-tinta)]">
          WhatsApp en modo simulación — no se envía nada
        </span>
      )}
      {resultado && <span className="text-xs text-[var(--color-tenue)]">{resultado}</span>}
    </div>
  );
}
