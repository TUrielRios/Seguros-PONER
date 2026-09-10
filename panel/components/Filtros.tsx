"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import type { Catalogos } from "@panel/lib/api";

/**
 * Filtros del buscador.
 *
 * Todo el estado vive en la URL, no en React: así una búsqueda se comparte por
 * link, que es como trabaja de verdad una oficina ("mirá estos vencimientos").
 */
export function Filtros({ catalogos }: { catalogos: Catalogos }) {
  const router = useRouter();
  const params = useSearchParams();
  const [pendiente, iniciarTransicion] = useTransition();
  const [texto, setTexto] = useState(params.get("texto") ?? "");

  // Debounce: no dispara una consulta por cada tecla.
  useEffect(() => {
    const t = setTimeout(() => {
      if (texto !== (params.get("texto") ?? "")) actualizar("texto", texto);
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texto]);

  function actualizar(clave: string, valor: string) {
    const nuevos = new URLSearchParams(params.toString());
    if (valor) nuevos.set(clave, valor);
    else nuevos.delete(clave);
    nuevos.delete("pagina");
    iniciarTransicion(() => router.push(`/admin/cartera?${nuevos.toString()}`));
  }

  function atajo(dias: number) {
    const nuevos = new URLSearchParams(params.toString());
    const hasta = new Date();
    hasta.setDate(hasta.getDate() + dias);
    nuevos.set("venceDesde", new Date().toISOString().slice(0, 10));
    nuevos.set("venceHasta", hasta.toISOString().slice(0, 10));
    nuevos.set("estados", "VIGENTE");
    nuevos.delete("pagina");
    iniciarTransicion(() => router.push(`/admin/cartera?${nuevos.toString()}`));
  }

  const claseSelect =
    "h-10 rounded-lg border border-[var(--color-borde-fuerte)] bg-white px-3 text-sm text-[var(--color-tinta)] transition-colors hover:border-[var(--color-tenue)]";

  return (
    <div className="space-y-3">
      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Apellido, razón social, CUIT, DNI, patente o nº de póliza…"
        className="w-full rounded-xl border border-[var(--color-borde-fuerte)] bg-white px-4 py-3 text-sm transition-colors placeholder:text-[var(--color-tenue)]"
        autoFocus
      />

      <div className="flex flex-wrap items-center gap-2">
        <select
          className={claseSelect}
          value={params.get("ramoIds") ?? ""}
          onChange={(e) => actualizar("ramoIds", e.target.value)}
        >
          <option value="">Todos los ramos</option>
          {catalogos.ramos.map((r) => (
            <option key={r.id} value={r.id}>{r.nombre}</option>
          ))}
        </select>

        <select
          className={claseSelect}
          value={params.get("companiaIds") ?? ""}
          onChange={(e) => actualizar("companiaIds", e.target.value)}
        >
          <option value="">Todas las compañías</option>
          {catalogos.companias.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>

        <select
          className={claseSelect}
          value={params.get("estados") ?? ""}
          onChange={(e) => actualizar("estados", e.target.value)}
        >
          <option value="">Todos los estados</option>
          {catalogos.estados.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={params.get("conCuotasImpagas") === "true"}
            onChange={(e) => actualizar("conCuotasImpagas", e.target.checked ? "true" : "")}
          />
          Con deuda
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={params.get("conSiniestrosAbiertos") === "true"}
            onChange={(e) => actualizar("conSiniestrosAbiertos", e.target.checked ? "true" : "")}
          />
          Con siniestro abierto
        </label>

        <span className="ml-auto flex gap-1">
          {[15, 30, 60].map((d) => (
            <button
              key={d}
              onClick={() => atajo(d)}
              className="h-10 rounded-lg border border-[var(--color-borde-fuerte)] bg-white px-3 text-sm font-medium text-[var(--color-secundario)] transition-colors hover:border-[var(--color-marca)] hover:text-[var(--color-marca-tinta)]"
            >
              Vencen en {d} d
            </button>
          ))}
          <button
            onClick={() => iniciarTransicion(() => router.push("/admin/cartera"))}
            className="h-10 rounded-lg px-3 text-sm text-[var(--color-tenue)] hover:text-[var(--color-tinta)] hover:underline"
          >
            Limpiar
          </button>
        </span>
      </div>

      {pendiente && <p className="text-xs text-[var(--color-tenue)]">Buscando…</p>}
    </div>
  );
}
