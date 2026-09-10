/**
 * Conversaciones de prueba.
 *
 * Sirven para dos cosas distintas. Una es mostrarle el bot a alguien sin tener
 * que acordarse qué escribir. La otra, menos obvia y más útil: son los casos que
 * hay que volver a mirar cada vez que se toca el guion. Si después de un cambio
 * "cliente enojado" deja de derivar, el cambio está mal.
 *
 * Están escritos como los escribiría una persona —con texto libre, no eligiendo
 * opciones del menú— porque así es como llegan los mensajes de verdad.
 */

import type { Entrada } from "./tipos";

export type Escenario = {
  id: string;
  titulo: string;
  bajada: string;
  pasos: Entrada[];
};

const texto = (t: string): Entrada => ({ tipo: "texto", texto: t });
const foto = (nombre: string): Entrada => ({ tipo: "adjunto", adjunto: { nombre, tipo: "foto" } });

export const ESCENARIOS: Escenario[] = [
  {
    id: "choque",
    titulo: "Choque con terceros",
    bajada: "Denuncia completa: preguntas guiadas, fotos y cierre con número de gestión.",
    pasos: [
      texto("hola, me chocaron"),
      texto("No"),
      texto("Av. Rivadavia 4500, CABA"),
      texto("Hoy a las 14:30"),
      texto("Me chocaron de atrás en un semáforo"),
      texto("Sí"),
      texto("Juan Pérez, 11 5555-5555, AC456DF, Otra Demo Seguros"),
      foto("foto-daño-general.jpg"),
      foto("cedula-verde.jpg"),
      foto("licencia.jpg"),
    ],
  },
  {
    id: "cobertura",
    titulo: "Consulta de cobertura",
    bajada: "Identifica al asegurado por patente y contesta con los datos de la póliza.",
    pasos: [texto("quiero saber qué cubre mi póliza"), texto("AB123CD")],
  },
  {
    id: "mora",
    titulo: "Cuota impaga",
    bajada: "Detecta la deuda y deriva a administración antes de que se caiga la cobertura.",
    pasos: [texto("cuándo vence mi próxima cuota"), texto("AA456BB")],
  },
  {
    id: "sin-dato",
    titulo: "Dato que no está cargado",
    bajada: "La póliza no tiene franquicia cargada: el bot no inventa, avisa y deriva.",
    pasos: [texto("cuánto es mi franquicia"), texto("XYZ789")],
  },
  {
    id: "grua",
    titulo: "Grúa en ruta",
    bajada: "Toma ubicación, patente y contacto, y suma el recordatorio de seguridad vial.",
    pasos: [
      texto("necesito una grúa"),
      texto("Ruta 2, km 58, sentido a Mar del Plata"),
      texto("AB123CD"),
      texto("11 4444-3333"),
      texto("No"),
    ],
  },
  {
    id: "enojado",
    titulo: "Cliente caliente",
    bajada: "Regla 2: aparece la bronca y entra una persona, sin insistir con el menú.",
    pasos: [
      texto("hola"),
      texto("quiero saber de mi póliza"),
      texto("ya escribí tres veces y nadie me contesta"),
    ],
  },
  {
    id: "no-entiende",
    titulo: "El bot no entiende",
    bajada: "Regla 3: dos mensajes sin reconocer y deriva, en vez de repetir el menú.",
    pasos: [texto("kjsdfh"), texto("asdasd")],
  },
];
