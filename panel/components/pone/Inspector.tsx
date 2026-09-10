"use client";

import { Insignia } from "@panel/components/viz/Primitivas";
import { fecha } from "@panel/lib/formato";
import { GUION } from "@panel/lib/pone/guion";
import { ESCENARIOS } from "@panel/lib/pone/escenarios";
import type { Entrada, Estado } from "@panel/lib/pone/tipos";

/**
 * Panel lateral del simulador.
 *
 * No es decoración: es lo que separa "mirá qué lindo contesta" de poder decidir
 * si el bot sirve. Muestra en qué nodo del guion está parado, qué datos ya
 * juntó, y —sobre todo— por qué derivó cuando derivó. Sin eso, una derivación
 * se ve igual que un cuelgue.
 */

const ETIQUETAS: Record<string, string> = {
  identificador: "Identificador",
  intentos_identificacion: "Intentos de identificación",
  lesionados: "¿Lesionados?",
  donde: "Dónde",
  cuando: "Cuándo",
  como: "Cómo fue",
  terceros: "¿Terceros?",
  datos_tercero: "Datos del tercero",
  fotos_dano: "Fotos del daño",
  cedula: "Cédula",
  licencia: "Licencia",
  denuncia_policial: "Denuncia policial",
  alcance: "Alcance",
  llaves: "¿Tiene las llaves?",
  cristal: "Cristal",
  bomberos: "¿Bomberos?",
  constancia_bomberos: "Constancia de bomberos",
  evento: "Evento",
  relato: "Relato",
  ubicacion: "Ubicación",
  patente: "Patente",
  telefono: "Teléfono",
  puede_mover: "¿Se mueve?",
  problema: "Problema",
  choque: "¿Hubo choque?",
  circula: "¿Circula?",
  nombre: "Nombre",
  franja: "Franja horaria",
  motivo: "Motivo",
  referencia: "Referencia",
  comprobante: "Comprobante",
  gestion: "N° de gestión",
  cbu: "CBU",
  titular: "Titular",
  descripcion: "Descripción",
  dni_frente: "DNI (frente)",
  dni_dorso: "DNI (dorso)",
  presupuesto: "Presupuesto",
  archivo: "Archivo",
  constancia_cbu: "Constancia de CBU",
};

function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="tarjeta p-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-tenue)]">
        {titulo}
      </h2>
      {children}
    </section>
  );
}

function Dato({ clave, valor }: { clave: string; valor: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-[var(--color-borde)] py-1.5 last:border-0">
      <dt className="shrink-0 text-xs text-[var(--color-tenue)]">{ETIQUETAS[clave] ?? clave}</dt>
      <dd className="text-right text-xs font-medium text-[var(--color-tinta)]">
        {valor === "si" ? "sí" : valor}
      </dd>
    </div>
  );
}

export function Inspector({
  estado,
  onEscenario,
  ocupado,
}: {
  estado: Estado;
  onEscenario: (pasos: Entrada[]) => void;
  ocupado: boolean;
}) {
  const nodo = GUION[estado.nodo];
  const datos = Object.entries(estado.datos).filter(([clave]) => clave !== "intentos_identificacion");

  return (
    <div className="flex flex-col gap-4">
      <Bloque titulo="Probar un caso">
        <div className="flex flex-col gap-1.5">
          {ESCENARIOS.map((e) => (
            <button
              key={e.id}
              disabled={ocupado}
              onClick={() => onEscenario(e.pasos)}
              className="rounded-lg border border-[var(--color-borde)] px-3 py-2 text-left transition-colors hover:border-[var(--color-marca)] hover:bg-[var(--color-marca-humo)] disabled:opacity-50"
            >
              <span className="block text-sm font-medium text-[var(--color-tinta)]">{e.titulo}</span>
              <span className="mt-0.5 block text-xs leading-snug text-[var(--color-tenue)]">
                {e.bajada}
              </span>
            </button>
          ))}
        </div>
      </Bloque>

      <Bloque titulo="Estado de la conversación">
        <dl className="space-y-0">
          <Dato clave="Nodo del guion" valor={nodo?.titulo ?? estado.nodo} />
          <Dato clave="Mensajes del cliente" valor={String(estado.contadores.mensajesCliente)} />
          <Dato clave="Vueltas al menú" valor={String(estado.contadores.vueltasAlMenu)} />
          <Dato clave="Avisos por WhatsApp" valor={estado.optIn ? "sí" : "dado de baja"} />
        </dl>

        <div className="mt-3">
          {estado.escalada ? (
            <Insignia clave="aviso">Derivada a una persona</Insignia>
          ) : (
            <Insignia clave="ok">La atiende el bot</Insignia>
          )}
        </div>

        {estado.escalada && (
          <p className="mt-2 text-xs leading-snug text-[var(--color-secundario)]">
            {estado.escalada.explicacion}.
          </p>
        )}
      </Bloque>

      <Bloque titulo="Asegurado identificado">
        {estado.poliza ? (
          <>
            <p className="text-sm font-medium text-[var(--color-tinta)]">{estado.poliza.cliente}</p>
            <p className="numero mt-0.5 text-xs text-[var(--color-tenue)]">
              {estado.poliza.numero} · {estado.poliza.compania}
            </p>
            <p className="mt-1 text-xs text-[var(--color-tenue)]">
              Vigencia hasta {fecha(estado.poliza.vigenciaHasta)}
              {estado.poliza.cuotasImpagas > 0 && ` · ${estado.poliza.cuotasImpagas} cuota(s) impaga(s)`}
            </p>
            <div className="mt-2">
              {estado.origenPoliza === "cartera" ? (
                <Insignia clave="ok">Cartera real</Insignia>
              ) : (
                <Insignia clave="neutro">Dato de demostración</Insignia>
              )}
            </div>
          </>
        ) : (
          <p className="text-xs text-[var(--color-tenue)]">Todavía no se identificó.</p>
        )}
      </Bloque>

      {datos.length > 0 && (
        <Bloque titulo="Datos que juntó el bot">
          <dl>
            {datos.map(([clave, valor]) => (
              <Dato key={clave} clave={clave} valor={valor} />
            ))}
          </dl>
          {estado.adjuntos.length > 0 && (
            <p className="mt-2 text-xs text-[var(--color-tenue)]">
              {estado.adjuntos.length} archivo(s) adjunto(s).
            </p>
          )}
        </Bloque>
      )}

      {estado.gestiones.length > 0 && (
        <Bloque titulo="Gestiones abiertas">
          <ul className="space-y-1.5">
            {estado.gestiones.map((g) => (
              <li key={g.id} className="text-xs">
                <span className="numero font-medium text-[var(--color-tinta)]">{g.id}</span>
                <span className="text-[var(--color-tenue)]"> · {g.asunto}</span>
              </li>
            ))}
          </ul>
        </Bloque>
      )}

      <Bloque titulo="Traza">
        <ol className="space-y-1">
          {estado.traza.slice(-12).map((t, i) => (
            <li key={i} className="text-xs leading-snug text-[var(--color-tenue)]">
              {t.texto}
            </li>
          ))}
        </ol>
      </Bloque>
    </div>
  );
}
