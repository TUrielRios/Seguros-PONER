import Link from "next/link";
import { api, type RenovacionPendiente } from "@panel/lib/api";
import { fecha, pesos } from "@panel/lib/formato";
import { Acciones } from "@panel/components/Acciones";
import { EncabezadoPagina } from "@panel/components/Shell";

/** Los hitos, de más urgente a menos. Cada póliza cae en el primero que aplica. */
const TRAMOS = [
  { hasta: 5, titulo: "Vence en 5 días o menos", tono: "border-[var(--color-alerta)]" },
  { hasta: 15, titulo: "Entre 6 y 15 días", tono: "border-[var(--color-alerta)]/50" },
  { hasta: 30, titulo: "Entre 16 y 30 días", tono: "border-[var(--color-aviso)]" },
  { hasta: 45, titulo: "Entre 31 y 45 días", tono: "border-[var(--color-borde)]" },
  { hasta: 60, titulo: "Entre 46 y 60 días", tono: "border-[var(--color-borde)]" },
];

export default async function Renovaciones() {
  const pendientes = await api<RenovacionPendiente[]>("/api/v1/renovaciones/pendientes?dias=60");

  const porTramo = TRAMOS.map((t, i) => ({
    ...t,
    desde: i === 0 ? 0 : TRAMOS[i - 1].hasta + 1,
    filas: pendientes.filter(
      (p) => p.dias <= t.hasta && (i === 0 || p.dias > TRAMOS[i - 1].hasta),
    ),
  }));

  const sinWhatsapp = pendientes.filter((p) => !p.opt_in || !p.telefono).length;
  const primaEnJuego = pendientes.reduce((a, p) => a + Number(p.prima ?? 0), 0);

  return (
    <>
      <EncabezadoPagina titulo="Renovaciones" />

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--color-borde)] bg-[var(--color-panel)] p-4">
          <div className="text-xs uppercase tracking-wide text-[var(--color-tenue)]">
            Vencen en 60 días
          </div>
          <div className="numero mt-1 text-2xl font-semibold">{pendientes.length}</div>
        </div>
        <div className="rounded-xl border border-[var(--color-borde)] bg-[var(--color-panel)] p-4">
          <div className="text-xs uppercase tracking-wide text-[var(--color-tenue)]">
            Prima en juego
          </div>
          <div className="numero mt-1 text-2xl font-semibold">{pesos(primaEnJuego)}</div>
        </div>
        <div className="rounded-xl border border-[var(--color-borde)] bg-[var(--color-panel)] p-4">
          <div className="text-xs uppercase tracking-wide text-[var(--color-tenue)]">
            Sin WhatsApp
          </div>
          <div
            className={`numero mt-1 text-2xl font-semibold ${
              sinWhatsapp > 0 ? "text-[var(--color-alerta-tinta)]" : ""
            }`}
          >
            {sinWhatsapp}
          </div>
          <div className="mt-1 text-xs text-[var(--color-tenue)]">
            hay que llamarlos o pedirles el consentimiento
          </div>
        </div>
      </section>

      <div className="mb-6">
        <Acciones modoMock />
      </div>

      {pendientes.length === 0 && (
        <p className="rounded-xl border border-[var(--color-borde)] bg-[var(--color-panel)] p-12 text-center text-[var(--color-tenue)]">
          No hay pólizas por vencer en los próximos 60 días.
        </p>
      )}

      {porTramo
        .filter((t) => t.filas.length > 0)
        .map((tramo) => (
          <section key={tramo.titulo} className="mb-8">
            <h2 className="mb-2 flex items-baseline gap-2 text-sm font-semibold">
              {tramo.titulo}
              <span className="text-[var(--color-tenue)]">({tramo.filas.length})</span>
            </h2>

            <div className={`overflow-hidden rounded-xl border-l-4 ${tramo.tono} border-y border-r border-y-[var(--color-borde)] border-r-[var(--color-borde)] bg-[var(--color-panel)]`}>
              <table className="w-full text-sm">
                <tbody>
                  {tramo.filas.map((p) => (
                    <tr
                      key={p.poliza_id}
                      className="border-b border-[var(--color-borde)] last:border-0"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/cartera/${p.cliente_id}`}
                          className="font-medium hover:text-[var(--color-marca-tinta)] hover:underline"
                        >
                          {p.cliente}
                        </Link>
                        <div className="numero text-xs text-[var(--color-tenue)]">
                          {p.telefono ?? "sin teléfono"}
                        </div>
                      </td>
                      <td className="numero px-4 py-3">{p.numero}</td>
                      <td className="px-4 py-3">
                        {p.ramo}
                        <div className="text-xs text-[var(--color-tenue)]">{p.compania}</div>
                      </td>
                      <td className="px-4 py-3">
                        {fecha(p.vigencia_hasta)}
                        <div className="text-xs text-[var(--color-tenue)]">
                          en {p.dias} {p.dias === 1 ? "día" : "días"}
                        </div>
                      </td>
                      <td className="numero px-4 py-3 text-right">{pesos(p.prima)}</td>
                      <td className="px-4 py-3">
                        <span className="flex flex-wrap gap-1">
                          {!p.opt_in && (
                            <span className="rounded-full bg-[var(--color-alerta)]/10 px-2 py-0.5 text-xs text-[var(--color-alerta-tinta)]">
                              sin WhatsApp
                            </span>
                          )}
                          {p.cuotas_impagas > 0 && (
                            <span className="rounded-full bg-[var(--color-alerta)]/10 px-2 py-0.5 text-xs text-[var(--color-alerta-tinta)]">
                              {p.cuotas_impagas} impaga{p.cuotas_impagas > 1 ? "s" : ""}
                            </span>
                          )}
                          {p.ultimo_hito && (
                            <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs text-[var(--color-tenue)]">
                              avisado {p.ultimo_hito}
                              {p.ultimo_estado === "ENVIADO" ? " ✓" : ` · ${p.ultimo_estado?.toLowerCase()}`}
                            </span>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
    </>
  );
}
