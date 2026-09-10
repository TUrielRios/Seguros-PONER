"use client";

import { useState } from "react";

import { Chat } from "./Chat";
import { Inspector } from "./Inspector";
import { usarConversacion } from "./usarConversacion";
import type { Entrada } from "@panel/lib/pone/tipos";

export function Simulador() {
  const { estado, visibles, escribiendo, enviar, reiniciar, correrEscenario } = usarConversacion();
  const [corriendo, setCorriendo] = useState(false);

  async function correr(pasos: Entrada[]) {
    setCorriendo(true);
    try {
      await correrEscenario(pasos);
    } finally {
      setCorriendo(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_336px]">
      <Chat
        estado={estado}
        visibles={visibles}
        escribiendo={escribiendo}
        onEnviar={enviar}
        onReiniciar={reiniciar}
      />
      <Inspector estado={estado} onEscenario={correr} ocupado={corriendo} />
    </div>
  );
}
