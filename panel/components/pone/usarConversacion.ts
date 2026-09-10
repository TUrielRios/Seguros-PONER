"use client";

import { useCallback, useRef, useState } from "react";

import { avanzar, conversacionNueva, resolverIdentificacion } from "@panel/lib/pone/motor";
import type { Entrada, Estado, OrigenPoliza, Poliza } from "@panel/lib/pone/tipos";

const PAUSA_TIPEO = 450;

function pausa(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function buscarPoliza(
  texto: string,
): Promise<{ poliza: Poliza | null; origen: OrigenPoliza | null }> {
  try {
    const res = await fetch("/admin/api/pone/poliza", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texto }),
    });
    if (!res.ok) return { poliza: null, origen: null };
    return await res.json();
  } catch {
    return { poliza: null, origen: null };
  }
}

/**
 * Conversación en curso.
 *
 * El motor devuelve todos los globos de una tanda juntos; acá se separan en dos
 * tiempos —primero el eco de lo que escribió el cliente, después la respuesta
 * con puntos suspensivos en el medio— porque si aparecen todos en el mismo
 * fotograma no se lee como un chat, se lee como un volcado de log.
 *
 * `visibles` es cuántos globos del historial se están mostrando. El estado del
 * motor va siempre adelante; la pantalla lo alcanza.
 */
export function usarConversacion() {
  const [estado, setEstado] = useState<Estado>(() => conversacionNueva(new Date()));
  const [visibles, setVisibles] = useState(() => estado.historial.length);
  const [escribiendo, setEscribiendo] = useState(false);

  const referencia = useRef(estado);
  const ocupado = useRef(false);

  const aplicar = useCallback(async (nuevo: Estado) => {
    const previos = referencia.current.historial.length;
    referencia.current = nuevo;
    setEstado(nuevo);

    // Todo lo que el cliente mandó se ve al instante; lo del bot espera.
    const primerBot = nuevo.historial.findIndex((m, i) => i >= previos && m.rol !== "cliente");
    const corte = primerBot === -1 ? nuevo.historial.length : primerBot;
    setVisibles(corte);

    if (corte < nuevo.historial.length) {
      setEscribiendo(true);
      await pausa(PAUSA_TIPEO);
      setEscribiendo(false);
      setVisibles(nuevo.historial.length);
    }
  }, []);

  const enviar = useCallback(
    async (entrada: Entrada) => {
      if (ocupado.current) return;
      ocupado.current = true;
      try {
        await aplicar(avanzar(referencia.current, entrada, new Date()));

        // El motor puede quedar esperando la identificación del asegurado.
        while (referencia.current.pendiente) {
          const { texto } = referencia.current.pendiente;
          setEscribiendo(true);
          const { poliza, origen } = await buscarPoliza(texto);
          setEscribiendo(false);
          await aplicar(resolverIdentificacion(referencia.current, poliza, origen, new Date()));
        }
      } finally {
        ocupado.current = false;
      }
    },
    [aplicar],
  );

  const reiniciar = useCallback(() => {
    const nuevo = conversacionNueva(new Date());
    referencia.current = nuevo;
    setEstado(nuevo);
    setVisibles(nuevo.historial.length);
    setEscribiendo(false);
  }, []);

  /** Reproduce una conversación de prueba, entrada por entrada. */
  const correrEscenario = useCallback(
    async (pasos: Entrada[]) => {
      reiniciar();
      await pausa(150);
      for (const paso of pasos) {
        await enviar(paso);
        await pausa(320);
      }
    },
    [enviar, reiniciar],
  );

  return { estado, visibles, escribiendo, enviar, reiniciar, correrEscenario };
}
