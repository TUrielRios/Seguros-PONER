"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function Paginador({ pagina, totalPaginas, total }: {
  pagina: number;
  totalPaginas: number;
  total: number;
}) {
  const router = useRouter();
  const params = useSearchParams();

  function ir(nueva: number) {
    const nuevos = new URLSearchParams(params.toString());
    nuevos.set("pagina", String(nueva));
    router.push(`/admin/cartera?${nuevos.toString()}`);
  }

  const boton = "rounded-lg border border-[var(--color-borde)] bg-white px-3 py-1.5 text-sm disabled:opacity-40";

  return (
    <div className="flex items-center justify-between text-sm text-[var(--color-tenue)]">
      <span>
        {total.toLocaleString("es-AR")} {total === 1 ? "resultado" : "resultados"}
      </span>
      {totalPaginas > 1 && (
        <span className="flex items-center gap-2">
          <button className={boton} disabled={pagina === 0} onClick={() => ir(pagina - 1)}>
            Anterior
          </button>
          <span>
            {pagina + 1} de {totalPaginas}
          </span>
          <button
            className={boton}
            disabled={pagina + 1 >= totalPaginas}
            onClick={() => ir(pagina + 1)}
          >
            Siguiente
          </button>
        </span>
      )}
    </div>
  );
}
