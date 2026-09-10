import Link from "next/link";
import { api, type AvisoFila } from "@panel/lib/api";
import { Acciones } from "@panel/components/Acciones";
import { EncabezadoPagina } from "@panel/components/Shell";

const COLOR_ESTADO: Record<string, string> = {
  PENDIENTE: "bg-[var(--color-aviso)]/15 text-[var(--color-aviso-tinta)]",
  ENVIADO: "bg-[var(--color-ok)]/12 text-[var(--color-ok-tinta)]",
  SUPRIMIDO: "bg-black/5 text-[var(--color-tenue)]",
  CANCELADO: "bg-black/5 text-[var(--color-tenue)]",
  FALLIDO: "bg-[var(--color-alerta)]/10 text-[var(--color-alerta-tinta)]",
};

const EXPLICACION_MOTIVO: Record<string, string> = {
  sin_opt_in: "el cliente no dio consentimiento para WhatsApp",
  sin_telefono: "no hay teléfono cargado",
  cliente_dado_de_baja: "el cliente está dado de baja",
  caducado_por_reprogramaciones: "se venció reprogramándose, ya no tiene sentido enviarlo",
  cancelado_manualmente: "lo canceló un operador",
};

function momento(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : new Intl.DateTimeFormat("es-AR", {
        day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
      }).format(d);
}

export default async function Avisos({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; tipo?: string }>;
}) {
  const sp = await searchParams;
  const query = new URLSearchParams();
  if (sp.estado) query.set("estado", sp.estado);
  if (sp.tipo) query.set("tipo", sp.tipo);

  const [avisos, resumen] = await Promise.all([
    api<AvisoFila[]>(`/api/v1/avisos?${query.toString()}`),
    api<{ tipo: string; estado: string; cantidad: number }[]>("/api/v1/avisos/resumen"),
  ]);

  const porEstado = resumen.reduce<Record<string, number>>((acc, r) => {
    acc[r.estado] = (acc[r.estado] ?? 0) + Number(r.cantidad);
    return acc;
  }, {});

  return (
    <>
      <EncabezadoPagina titulo="Avisos" />

      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href="/admin/avisos"
          className={`rounded-lg border border-[var(--color-borde)] px-3 py-1.5 text-sm ${
            !sp.estado ? "bg-[var(--color-acento)]/10 text-[var(--color-marca-tinta)]" : "bg-white"
          }`}
        >
          Todos
        </Link>
        {["PENDIENTE", "ENVIADO", "SUPRIMIDO", "FALLIDO"].map((e) => (
          <Link
            key={e}
            href={`/admin/avisos?estado=${e}`}
            className={`rounded-lg border border-[var(--color-borde)] px-3 py-1.5 text-sm ${
              sp.estado === e ? "bg-[var(--color-acento)]/10 text-[var(--color-marca-tinta)]" : "bg-white"
            }`}
          >
            {e.charAt(0) + e.slice(1).toLowerCase()}{" "}
            <span className="text-[var(--color-tenue)]">{porEstado[e] ?? 0}</span>
          </Link>
        ))}
      </div>

      <div className="mb-6">
        <Acciones modoMock />
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--color-borde)] bg-[var(--color-panel)]">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--color-borde)] bg-[var(--color-fondo)] text-left text-xs uppercase tracking-wide text-[var(--color-tenue)]">
            <tr>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Tipo / Hito</th>
              <th className="px-4 py-3 font-medium">Programado</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {avisos.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-16 text-center text-[var(--color-tenue)]">
                  No hay avisos con ese filtro. Probá con &quot;Generar avisos&quot;.
                </td>
              </tr>
            )}
            {avisos.map((a) => (
              <tr key={a.id} className="border-b border-[var(--color-borde)] last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/cartera/${a.cliente_id}`}
                    className="font-medium hover:text-[var(--color-marca-tinta)] hover:underline"
                  >
                    {a.cliente}
                  </Link>
                  <div className="numero text-xs text-[var(--color-tenue)]">
                    {a.telefono ?? "sin teléfono"}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {a.tipo.replace("_", " ").toLowerCase()}
                  <div className="numero text-xs text-[var(--color-tenue)]">{a.hito}</div>
                </td>
                <td className="numero px-4 py-3 text-[var(--color-tenue)]">
                  {momento(a.enviado_en ?? a.programado_para)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      COLOR_ESTADO[a.estado] ?? "bg-black/5"
                    }`}
                  >
                    {a.estado.toLowerCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-[var(--color-tenue)]">
                  {a.motivo_supresion
                    ? (EXPLICACION_MOTIVO[a.motivo_supresion] ?? a.motivo_supresion)
                    : a.ultimo_error
                      ? `reintento: ${a.ultimo_error}`
                      : a.plantilla}
                  {a.intentos > 0 && a.estado !== "ENVIADO" && (
                    <span className="ml-1">· {a.intentos} intento{a.intentos > 1 ? "s" : ""}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-[var(--color-tenue)]">
        Cada aviso tiene una clave de unicidad. Aunque el generador corra diez veces, un asegurado
        nunca recibe el mismo mensaje dos veces.
      </p>
    </>
  );
}
