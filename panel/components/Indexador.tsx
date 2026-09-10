"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Resultado = {
  archivos?: number;
  vinculados?: number;
  sinCliente?: number;
  eliminados?: number;
  carpetasSinReconocer?: string[];
  error?: string;
  detalle?: string;
};

export function Indexador() {
  const router = useRouter();
  const [corriendo, setCorriendo] = useState(false);
  const [r, setR] = useState<Resultado | null>(null);

  async function indexar() {
    setCorriendo(true);
    setR(null);
    try {
      const res = await fetch("/admin/api/documentos/indexar", { method: "POST" });
      const cuerpo = await res.json().catch(() => null);
      setR(cuerpo ?? { error: "sin_respuesta", detalle: `HTTP ${res.status}` });
      router.refresh();
    } catch (e) {
      setR({ error: "sin_conexion", detalle: e instanceof Error ? e.message : "" });
    } finally {
      setCorriendo(false);
    }
  }

  return (
    <div>
      <button
        onClick={indexar}
        disabled={corriendo}
        className="rounded-lg bg-[var(--color-marca-accion)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-marca-tinta)] disabled:opacity-50"
      >
        {corriendo ? "Recorriendo la carpeta…" : "Actualizar índice"}
      </button>

      {r?.error && (
        <div className="mt-4 rounded-xl border border-[var(--color-marca-borde)] bg-[var(--color-marca-humo)] p-4">
          <p className="text-sm font-medium text-[var(--color-marca-tinta)]">
            No se pudo indexar
          </p>
          <p className="mt-1 text-sm text-[var(--color-secundario)]">
            {r.detalle ?? r.error}
          </p>
        </div>
      )}

      {r && !r.error && (
        <div className="mt-4 rounded-xl border border-[var(--color-borde)] bg-[var(--color-panel)] p-4">
          <p className="text-sm">
            <strong className="numero">{r.archivos}</strong> archivos ·{" "}
            <strong className="numero">{r.vinculados}</strong> vinculados a un cliente
            {r.eliminados ? ` · ${r.eliminados} que ya no estaban, quitados` : ""}
          </p>

          {r.carpetasSinReconocer && r.carpetasSinReconocer.length > 0 && (
            <div className="mt-3 border-t border-[var(--color-borde)] pt-3">
              <p className="text-xs font-medium text-[var(--color-tenue)]">
                Carpetas que no coinciden con ningún cliente ({r.carpetasSinReconocer.length}).
                Sus archivos quedan indexados pero sin ficha donde mostrarse.
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {r.carpetasSinReconocer.map((c) => (
                  <li
                    key={c}
                    className="rounded-full bg-black/5 px-2.5 py-0.5 text-xs text-[var(--color-secundario)]"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
