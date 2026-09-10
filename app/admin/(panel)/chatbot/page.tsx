import { EncabezadoPagina } from "@panel/components/Shell";
import { Simulador } from "@panel/components/pone/Simulador";

export const metadata = { title: "Chatbot · PONER" };

/**
 * Simulador de *Poné*.
 *
 * WhatsApp todavía no está conectado a este bot, así que la conversación pasa
 * por acá. No es una maqueta: el motor que contesta es el mismo módulo que
 * después va a atender los mensajes reales (`src/lib/pone/`). Lo único que
 * cambia el día que se conecte es de dónde entran los mensajes y por dónde
 * salen — el guion, las reglas de derivación y la captura de datos ya son estas.
 */
export default function Chatbot() {
  return (
    <>
      <EncabezadoPagina
        titulo="Chatbot"
        bajada="Simulador de Poné, el asistente de WhatsApp. Probalo como si fueras un asegurado."
      />
      <Simulador />
    </>
  );
}
