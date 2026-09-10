"use client";

import { useEffect, useRef, useState } from "react";

import { Isotipo } from "@panel/components/Marca";
import { AGENCIA } from "@panel/lib/pone/guion";
import { esperaAhora, opcionesVigentes } from "@panel/lib/pone/motor";
import type { Adjunto, Entrada, Estado, Mensaje } from "@panel/lib/pone/tipos";

/** Archivos que se pueden "adjuntar" en la simulación. */
const ADJUNTOS: Adjunto[] = [
  { nombre: "foto-daño-general.jpg", tipo: "foto" },
  { nombre: "foto-daño-detalle.jpg", tipo: "foto" },
  { nombre: "dni-frente.jpg", tipo: "foto" },
  { nombre: "dni-dorso.jpg", tipo: "foto" },
  { nombre: "cedula-verde.jpg", tipo: "foto" },
  { nombre: "licencia.jpg", tipo: "foto" },
  { nombre: "denuncia-policial.pdf", tipo: "pdf" },
  { nombre: "presupuesto-taller.pdf", tipo: "pdf" },
  { nombre: "constancia-cbu.pdf", tipo: "pdf" },
  { nombre: "Ubicación actual", tipo: "ubicacion" },
];

const ICONO_ADJUNTO = { foto: "🖼", pdf: "📄", ubicacion: "📍" } as const;

const HORA = new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit" });

function hora(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : HORA.format(d);
}

/** Negrita al estilo WhatsApp: *así*. Los saltos de línea los respeta el CSS. */
function Texto({ valor }: { valor: string }) {
  const partes = valor.split(/(\*[^*\n]+\*)/g);
  return (
    <>
      {partes.map((parte, i) =>
        parte.length > 2 && parte.startsWith("*") && parte.endsWith("*") ? (
          <strong key={i} className="font-semibold">
            {parte.slice(1, -1)}
          </strong>
        ) : (
          <span key={i}>{parte}</span>
        ),
      )}
    </>
  );
}

function Burbuja({ mensaje: m, conHora }: { mensaje: Mensaje; conHora: boolean }) {
  if (m.rol === "sistema") {
    return (
      <div className="my-2 flex justify-center">
        <p className="max-w-[85%] rounded-lg border border-dashed border-[var(--color-borde-fuerte)] bg-[var(--color-elevado)] px-3 py-1.5 text-center text-xs text-[var(--color-tenue)]">
          {m.texto}
        </p>
      </div>
    );
  }

  const delCliente = m.rol === "cliente";

  return (
    <div className={`flex ${delCliente ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
          delCliente
            ? "rounded-br-sm border border-[var(--color-marca-borde)] bg-[var(--color-marca-humo)]"
            : "rounded-bl-sm border border-[var(--color-borde)] bg-[var(--color-panel)]"
        }`}
      >
        {m.adjunto ? (
          <span className="flex items-center gap-2">
            <span aria-hidden="true">{ICONO_ADJUNTO[m.adjunto.tipo]}</span>
            <span className="italic text-[var(--color-secundario)]">{m.adjunto.nombre}</span>
          </span>
        ) : (
          <Texto valor={m.texto} />
        )}
        {/* El espacio se reserva siempre: la hora recién aparece al montar, así
            que sin esto la burbuja daría un salto en cuanto hidrata. */}
        <span className="mt-1 block text-right text-[0.65rem] text-[var(--color-tenue)]">
          {conHora ? hora(m.hora) : " "}
        </span>
      </div>
    </div>
  );
}

export function Chat({
  estado,
  visibles,
  escribiendo,
  onEnviar,
  onReiniciar,
}: {
  estado: Estado;
  visibles: number;
  escribiendo: boolean;
  onEnviar: (entrada: Entrada) => void;
  onReiniciar: () => void;
}) {
  const [borrador, setBorrador] = useState("");
  const scroll = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLDetailsElement>(null);

  // La conversación arranca con la hora actual, que en el prerender y en el
  // navegador no son la misma. Mostrarla recién después de montar evita el
  // desajuste de hidratación sin tener que silenciarlo.
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  const alDia = visibles >= estado.historial.length && !escribiendo;
  const opciones = alDia ? opcionesVigentes(estado) : [];
  const espera = alDia ? esperaAhora(estado) : { sugerencias: [], adjunto: null };

  useEffect(() => {
    scroll.current?.scrollTo({ top: scroll.current.scrollHeight, behavior: "smooth" });
  }, [visibles, escribiendo]);

  function enviarTexto(texto: string) {
    const limpio = texto.trim();
    if (!limpio) return;
    setBorrador("");
    onEnviar({ tipo: "texto", texto: limpio });
  }

  function adjuntar(adjunto: Adjunto) {
    if (clip.current) clip.current.open = false;
    onEnviar({ tipo: "adjunto", adjunto });
  }

  return (
    <section className="tarjeta flex h-[calc(100vh-12rem)] min-h-[560px] flex-col overflow-hidden">
      {/* Cabecera: es lo único que se pinta con el rojo de la marca. */}
      <header className="flex items-center gap-3 bg-[var(--color-marca)] px-4 py-3 text-white">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
          <Isotipo className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-tight">{AGENCIA.bot}</p>
          <p className="truncate text-xs text-white/75">
            {estado.escalada
              ? `derivado a un asesor · ${estado.escalada.explicacion}`
              : escribiendo
                ? "escribiendo…"
                : `asistente de ${AGENCIA.nombre} · en línea`}
          </p>
        </div>
        <button
          onClick={onReiniciar}
          className="rounded-lg px-2.5 py-1.5 text-xs text-white/80 transition-colors hover:bg-white/12 hover:text-white"
        >
          Reiniciar
        </button>
      </header>

      <div ref={scroll} className="flex-1 space-y-2 overflow-y-auto bg-[var(--color-fondo)] px-4 py-4">
        {estado.historial.slice(0, visibles).map((m) => (
          <Burbuja key={m.id} mensaje={m} conHora={montado} />
        ))}

        {escribiendo && (
          <div className="flex justify-start">
            <div
              className="rounded-2xl rounded-bl-sm border border-[var(--color-borde)] bg-[var(--color-panel)] px-3 py-2.5"
              aria-label="El asistente está escribiendo"
            >
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--color-tenue)]"
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </span>
            </div>
          </div>
        )}

        {opciones.length > 0 && (
          <div className="flex flex-col gap-1.5 pt-1">
            {opciones.map((o) => (
              <button
                key={o.id}
                onClick={() => onEnviar({ tipo: "opcion", id: o.id })}
                className="flex items-center gap-2.5 rounded-xl border border-[var(--color-borde)] bg-[var(--color-panel)] px-3 py-2 text-left text-sm transition-colors hover:border-[var(--color-marca)] hover:bg-[var(--color-marca-humo)]"
              >
                <span className="numero w-6 shrink-0 rounded-md bg-[var(--color-fondo)] py-0.5 text-center text-xs font-medium text-[var(--color-tenue)]">
                  {o.id}
                </span>
                {o.texto}
              </button>
            ))}
          </div>
        )}
      </div>

      {estado.escalada && (
        <p className="border-t border-[var(--color-borde)] bg-[var(--color-aviso)]/12 px-4 py-2 text-xs text-[var(--color-aviso-tinta)]">
          El bot dejó de responder: la conversación está en manos de una persona. Lo que escribas
          igual queda en el hilo.
        </p>
      )}

      <div className="border-t border-[var(--color-borde)] bg-[var(--color-panel)] px-3 py-2.5">
        {espera.sugerencias.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {espera.sugerencias.map((s) => (
              <button
                key={s}
                onClick={() => enviarTexto(s)}
                className="rounded-full border border-[var(--color-borde)] px-3 py-1 text-xs text-[var(--color-secundario)] transition-colors hover:border-[var(--color-marca)] hover:text-[var(--color-marca-tinta)]"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            enviarTexto(borrador);
          }}
          className="flex items-center gap-2"
        >
          <details ref={clip} className="relative">
            <summary
              className={`flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full text-base transition-colors ${
                espera.adjunto
                  ? "bg-[var(--color-marca-humo)] text-[var(--color-marca-tinta)] ring-1 ring-[var(--color-marca-borde)]"
                  : "text-[var(--color-tenue)] hover:bg-[var(--color-fondo)]"
              }`}
              aria-label="Adjuntar un archivo de prueba"
            >
              📎
            </summary>
            <div className="absolute bottom-11 left-0 z-10 w-60 rounded-xl border border-[var(--color-borde)] bg-[var(--color-panel)] p-1.5 shadow-lg">
              <p className="px-2 py-1 text-[0.7rem] uppercase tracking-wide text-[var(--color-tenue)]">
                Archivos de prueba
              </p>
              {ADJUNTOS.map((a) => (
                <button
                  key={a.nombre}
                  type="button"
                  onClick={() => adjuntar(a)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-[var(--color-fondo)]"
                >
                  <span aria-hidden="true">{ICONO_ADJUNTO[a.tipo]}</span>
                  {a.nombre}
                </button>
              ))}
            </div>
          </details>

          <input
            value={borrador}
            onChange={(e) => setBorrador(e.target.value)}
            placeholder={
              espera.adjunto ? "Esperando un archivo — usá el clip 📎" : "Escribí un mensaje…"
            }
            className="min-w-0 flex-1 rounded-full border border-[var(--color-borde)] bg-[var(--color-fondo)] px-4 py-2 text-sm"
          />

          <button
            type="submit"
            disabled={!borrador.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-marca-accion)] text-white transition-opacity disabled:opacity-35"
            aria-label="Enviar"
          >
            ➤
          </button>
        </form>
      </div>
    </section>
  );
}
