/**
 * Guion de *Poné*, el asistente de PONER.
 *
 * Es el árbol que bajó la agencia, escrito tal cual: cinco entradas de menú y
 * sus ramas (1A–1F, 2A–2G, 3A–3E, 4A–4H, 5A–5E). Todo lo que se lee acá es
 * texto y estructura; la lógica está en `motor.ts`.
 *
 * Tres criterios de redacción, que no son estéticos:
 *
 *  1. El bot NUNCA dictamina cobertura. Informa lo que dice la póliza y deriva.
 *     Un "sí, está cubierto" por WhatsApp es una promesa que después hay que
 *     bancar, y la agencia no es la que paga el siniestro.
 *  2. La pregunta por lesionados va primero en todo lo que sea un golpe. Si hay
 *     heridos, el guion se corta ahí: emergencias y una persona.
 *  3. Nada de "no entendí, volvé a intentar" en loop. A la segunda, un humano.
 */

import type { Nodo, Opcion } from "./tipos";

/** Datos de contacto de la agencia. Cambiar acá y cambia en todo el guion. */
export const AGENCIA = {
  nombre: "PONER",
  bot: "Poné",
  telefonoUrgencias: "0800-000-0000",
  horario: "lunes a viernes de 9 a 18",
} as const;

const MENU_PRINCIPAL: Opcion[] = [
  { id: "1", texto: "Denunciar un siniestro", destino: "1" },
  { id: "2", texto: "Consultar mi póliza", destino: "2" },
  { id: "3", texto: "Pedir asistencia", destino: "3" },
  { id: "4", texto: "Enviar documentación", destino: "4" },
  { id: "5", texto: "Hablar con una persona", destino: "5" },
];

/** Cierre común de los flujos de asistencia: recordatorio de seguridad vial. */
const SEGURIDAD_EN_RUTA =
  "Mientras esperás: balizas, triángulo y, si estás en ruta o autopista, salí del " +
  "vehículo por el lado contrario al tránsito y esperá detrás del guardarraíl.";

export const GUION: Record<string, Nodo> = {
  // ═══════════════════════════ Menú ═══════════════════════════

  menu: {
    id: "menu",
    titulo: "Menú principal",
    mensajes: [
      `¡Hola! Soy *${AGENCIA.bot}*, el asistente de *${AGENCIA.nombre}* 👋`,
      "Te ayudo con:",
    ],
    opciones: MENU_PRINCIPAL,
  },

  "menu-corto": {
    id: "menu-corto",
    titulo: "Menú (vuelta)",
    mensajes: ["¿Te ayudo con algo más?"],
    opciones: MENU_PRINCIPAL,
  },

  baja: {
    id: "baja",
    titulo: "Baja de avisos",
    mensajes: [
      "Listo, no vas a recibir más avisos por WhatsApp.",
      "Si en algún momento querés volver a recibirlos, escribí *ALTA*.",
    ],
    siguiente: "silencio",
  },

  alta: {
    id: "alta",
    titulo: "Alta de avisos",
    mensajes: ["Listo, vuelvo a mandarte los avisos de vencimientos y cuotas por acá."],
    siguiente: "menu-corto",
  },

  silencio: {
    id: "silencio",
    titulo: "En silencio",
    mensajes: [],
  },

  // ═════════════════════ 1 · Denuncia de siniestros ═════════════════════

  "1": {
    id: "1",
    titulo: "Denunciar un siniestro",
    mensajes: ["Lamento lo que pasó. ¿Qué tipo de siniestro querés denunciar?"],
    opciones: [
      { id: "1A", texto: "Choque", destino: "1A" },
      { id: "1B", texto: "Robo / hurto", destino: "1B" },
      { id: "1C", texto: "Rotura de cristales", destino: "1C" },
      { id: "1D", texto: "Incendio", destino: "1D" },
      { id: "1E", texto: "Granizo / inundación", destino: "1E" },
      { id: "1F", texto: "Otro siniestro", destino: "1F" },
    ],
  },

  "1A": {
    id: "1A",
    titulo: "Siniestro · Choque",
    mensajes: ["Vamos a armar la denuncia. Te hago unas preguntas cortas."],
    pasos: [
      {
        clave: "lesionados",
        pregunta: "Antes que nada: ¿hay personas lesionadas?",
        tipo: "sino",
        sugerencias: ["Sí", "No"],
        alerta: {
          cuando: "si",
          mensajes: [
            "🚨 Si hay heridos, llamá *ya* al *911*. Es lo primero.",
            `Después comunicate con nosotros al *${AGENCIA.telefonoUrgencias}*.`,
            "No cierro la denuncia por acá: ya le avisé a la mesa de siniestros para que te llame.",
          ],
          derivar: "emergencia",
          equipo: "guardia",
          detener: true,
        },
      },
      {
        clave: "donde",
        pregunta: "¿Dónde ocurrió? Calle y localidad, o mandame tu ubicación.",
        tipo: "texto",
      },
      {
        clave: "cuando",
        pregunta: "¿Cuándo ocurrió? Fecha y hora aproximada.",
        tipo: "texto",
        sugerencias: ["Hoy", "Ayer"],
      },
      {
        clave: "como",
        pregunta: "Contame brevemente cómo fue.",
        tipo: "texto",
      },
      {
        clave: "terceros",
        pregunta: "¿Hubo terceros involucrados?",
        tipo: "sino",
        sugerencias: ["Sí", "No"],
      },
      {
        clave: "datos_tercero",
        pregunta:
          "Pasame los datos del tercero: nombre, teléfono, patente, compañía y " +
          "número de póliza si los tenés.",
        tipo: "texto",
        condicion: { clave: "terceros", igual: "si" },
      },
      {
        clave: "fotos_dano",
        pregunta:
          "Enviame fotos del daño: una general del vehículo, una del detalle y, si se puede, " +
          "una donde se lea la patente.",
        tipo: "archivo",
        adjuntoEsperado: "foto",
      },
      {
        clave: "cedula",
        pregunta: "Ahora la cédula del vehículo (verde o azul).",
        tipo: "archivo",
        adjuntoEsperado: "foto",
      },
      {
        clave: "licencia",
        pregunta: "Y la licencia de quien manejaba.",
        tipo: "archivo",
        adjuntoEsperado: "foto",
      },
    ],
    generaGestion: true,
    cierre: [
      "Listo, con esto armo la denuncia. Te dejo el resumen:",
      "*Gestión N° {{gestion}}*\n" +
        "• Tipo: choque\n" +
        "• Dónde: {{donde}}\n" +
        "• Cuándo: {{cuando}}\n" +
        "• Terceros: {{terceros_texto}}\n" +
        "• Documentación: {{adjuntos_cantidad}} archivo(s)",
      "Un asesor de siniestros revisa la denuncia y te confirma el número definitivo de la compañía.",
    ],
    derivar: "siniestro_denunciado",
    equipo: "siniestros",
  },

  "1B": {
    id: "1B",
    titulo: "Siniestro · Robo o hurto",
    mensajes: ["Vamos con la denuncia de robo."],
    pasos: [
      {
        clave: "alcance",
        pregunta: "¿Se llevaron el vehículo completo o fueron partes / accesorios?",
        tipo: "texto",
        sugerencias: ["Vehículo completo", "Partes"],
      },
      {
        clave: "cuando",
        pregunta: "¿Cuándo ocurrió? Fecha y hora aproximada.",
        tipo: "texto",
      },
      {
        clave: "donde",
        pregunta: "¿Dónde estaba el vehículo?",
        tipo: "texto",
      },
      {
        clave: "llaves",
        pregunta: "¿Tenés todos los juegos de llaves en tu poder?",
        tipo: "sino",
        sugerencias: ["Sí", "No"],
        alerta: {
          cuando: "no",
          mensajes: [
            "Anotado. Es un dato que la compañía siempre pregunta, así que mejor que lo sepan desde el arranque.",
          ],
        },
      },
      {
        clave: "denuncia_policial",
        pregunta:
          "Para robo, la *denuncia policial* es obligatoria. Adjuntame foto o PDF de la denuncia.",
        tipo: "archivo",
        adjuntoEsperado: "pdf",
      },
      {
        clave: "cedula",
        pregunta: "Y la cédula del vehículo, si la tenés.",
        tipo: "archivo",
        adjuntoEsperado: "foto",
        opcional: true,
      },
    ],
    generaGestion: true,
    cierre: [
      "*Gestión N° {{gestion}}*\n" +
        "• Tipo: robo / hurto ({{alcance}})\n" +
        "• Cuándo: {{cuando}}\n" +
        "• Dónde: {{donde}}\n" +
        "• Llaves: {{llaves_texto}}",
      "Te paso con siniestros para dar el alta formal en la compañía.",
    ],
    derivar: "siniestro_denunciado",
    equipo: "siniestros",
  },

  "1C": {
    id: "1C",
    titulo: "Siniestro · Cristales",
    mensajes: ["Rotura de cristales. Un par de datos y lo derivo al taller."],
    pasos: [
      {
        clave: "cristal",
        pregunta: "¿Qué cristal se rompió?",
        tipo: "texto",
        sugerencias: ["Parabrisas", "Luneta", "Ventanilla", "Varios"],
      },
      {
        clave: "cuando",
        pregunta: "¿Cuándo pasó?",
        tipo: "texto",
        sugerencias: ["Hoy", "Ayer"],
      },
      {
        clave: "fotos_dano",
        pregunta: "Mandame una foto donde se vea el cristal roto y otra donde se lea la patente.",
        tipo: "archivo",
        adjuntoEsperado: "foto",
      },
    ],
    generaGestion: true,
    cierre: [
      "*Gestión N° {{gestion}}* — cristales ({{cristal}}).",
      "Cristales suele resolverse directo con el taller de la compañía, sin franquicia si tu " +
        "póliza tiene la cláusula. Un asesor te confirma el taller y el turno.",
    ],
    derivar: "siniestro_denunciado",
    equipo: "siniestros",
  },

  "1D": {
    id: "1D",
    titulo: "Siniestro · Incendio",
    pasos: [
      {
        clave: "lesionados",
        pregunta: "¿Hay personas lesionadas?",
        tipo: "sino",
        sugerencias: ["Sí", "No"],
        alerta: {
          cuando: "si",
          mensajes: [
            "🚨 Llamá al *911* ahora mismo.",
            "Ya avisé a la guardia de la agencia para que se comunique con vos.",
          ],
          derivar: "emergencia",
          equipo: "guardia",
          detener: true,
        },
      },
      { clave: "donde", pregunta: "¿Dónde ocurrió?", tipo: "texto" },
      { clave: "cuando", pregunta: "¿Cuándo?", tipo: "texto" },
      { clave: "como", pregunta: "Contame brevemente cómo empezó.", tipo: "texto" },
      {
        clave: "bomberos",
        pregunta: "¿Intervinieron bomberos?",
        tipo: "sino",
        sugerencias: ["Sí", "No"],
      },
      {
        clave: "constancia_bomberos",
        pregunta: "Si te dieron constancia de bomberos, adjuntala.",
        tipo: "archivo",
        adjuntoEsperado: "pdf",
        condicion: { clave: "bomberos", igual: "si" },
        opcional: true,
      },
      {
        clave: "fotos_dano",
        pregunta: "Mandame fotos de los daños.",
        tipo: "archivo",
        adjuntoEsperado: "foto",
      },
    ],
    generaGestion: true,
    cierre: [
      "*Gestión N° {{gestion}}* — incendio.\n• Dónde: {{donde}}\n• Cuándo: {{cuando}}\n• Bomberos: {{bomberos_texto}}",
      "Incendio siempre lo mira un asesor: te contacta a la brevedad.",
    ],
    derivar: "siniestro_denunciado",
    equipo: "siniestros",
  },

  "1E": {
    id: "1E",
    titulo: "Siniestro · Granizo o inundación",
    pasos: [
      {
        clave: "evento",
        pregunta: "¿Fue granizo o inundación?",
        tipo: "texto",
        sugerencias: ["Granizo", "Inundación"],
      },
      { clave: "cuando", pregunta: "¿Qué día fue?", tipo: "texto" },
      { clave: "donde", pregunta: "¿Dónde estaba el vehículo?", tipo: "texto" },
      {
        clave: "fotos_dano",
        pregunta:
          "Mandame fotos del daño: una general y varias de detalle. En granizo conviene sacarlas " +
          "con luz de costado, que es como se ven los golpes en la chapa.",
        tipo: "archivo",
        adjuntoEsperado: "foto",
      },
    ],
    generaGestion: true,
    cierre: [
      "*Gestión N° {{gestion}}* — {{evento}} del {{cuando}}.",
      "Estos eventos suelen entrar de a muchos el mismo día, así que la compañía puede tardar un " +
        "poco más en asignar perito. Un asesor te va siguiendo el caso.",
    ],
    derivar: "siniestro_denunciado",
    equipo: "siniestros",
  },

  "1F": {
    id: "1F",
    titulo: "Siniestro · Otro",
    mensajes: [
      "Contame qué pasó y lo derivo. Sirve también para accidentes personales, daños a terceros " +
        "o cualquier hecho que no entre en las opciones anteriores.",
    ],
    pasos: [
      { clave: "relato", pregunta: "¿Qué ocurrió?", tipo: "texto" },
      { clave: "cuando", pregunta: "¿Cuándo fue?", tipo: "texto" },
    ],
    generaGestion: true,
    cierre: ["*Gestión N° {{gestion}}* — {{relato}} ({{cuando}})."],
    derivar: "siniestro_denunciado",
    equipo: "siniestros",
  },

  // ═════════════════════ 2 · Consultas de póliza ═════════════════════

  "2": {
    id: "2",
    titulo: "Consultar mi póliza",
    mensajes: ["¿Qué querés consultar?"],
    opciones: [
      { id: "2A", texto: "Ver cobertura", destino: "2A" },
      { id: "2B", texto: "Consultar vigencia", destino: "2B" },
      { id: "2C", texto: "Forma de pago", destino: "2C" },
      { id: "2D", texto: "Próximo vencimiento", destino: "2D" },
      { id: "2E", texto: "Franquicia", destino: "2E" },
      { id: "2F", texto: "Pedir comprobante o certificado", destino: "2F" },
      { id: "2G", texto: "Otra consulta", destino: "2G" },
    ],
  },

  "2A": {
    id: "2A",
    titulo: "Póliza · Cobertura",
    requiereIdentificacion: true,
    consulta: "cobertura",
    siguiente: "menu-corto",
  },

  "2B": {
    id: "2B",
    titulo: "Póliza · Vigencia",
    requiereIdentificacion: true,
    consulta: "vigencia",
    siguiente: "menu-corto",
  },

  "2C": {
    id: "2C",
    titulo: "Póliza · Forma de pago",
    requiereIdentificacion: true,
    consulta: "forma-pago",
    siguiente: "menu-corto",
  },

  "2D": {
    id: "2D",
    titulo: "Póliza · Vencimiento",
    requiereIdentificacion: true,
    consulta: "vencimiento",
    siguiente: "menu-corto",
  },

  "2E": {
    id: "2E",
    titulo: "Póliza · Franquicia",
    requiereIdentificacion: true,
    consulta: "franquicia",
    siguiente: "menu-corto",
  },

  "2F": {
    id: "2F",
    titulo: "Póliza · Comprobantes",
    mensajes: ["¿Qué necesitás?"],
    opciones: [
      {
        id: "1",
        texto: "Certificado de cobertura",
        destino: "2F-emitir",
        define: { clave: "comprobante", valor: "certificado de cobertura" },
      },
      {
        id: "2",
        texto: "Comprobante de pago",
        destino: "2F-emitir",
        define: { clave: "comprobante", valor: "comprobante de pago" },
      },
      {
        id: "3",
        texto: "Frente de póliza",
        destino: "2F-emitir",
        define: { clave: "comprobante", valor: "frente de póliza" },
      },
      {
        id: "4",
        texto: "Carta verde (Mercosur)",
        destino: "2F-emitir",
        define: { clave: "comprobante", valor: "carta verde" },
      },
    ],
  },

  "2F-emitir": {
    id: "2F-emitir",
    titulo: "Póliza · Emitir comprobante",
    requiereIdentificacion: true,
    consulta: "comprobante",
    generaGestion: true,
    siguiente: "menu-corto",
  },

  "2G": {
    id: "2G",
    titulo: "Póliza · Otra consulta",
    pasos: [{ clave: "relato", pregunta: "Contame qué necesitás saber.", tipo: "texto" }],
    cierre: ["Anotado: “{{relato}}”."],
    derivar: "caso_complejo",
    equipo: "administracion",
  },

  // ═════════════════════ 3 · Asistencia y emergencias ═════════════════════

  "3": {
    id: "3",
    titulo: "Pedir asistencia",
    mensajes: ["¿Qué asistencia necesitás?"],
    opciones: [
      { id: "3A", texto: "Grúa / remolque", destino: "3A" },
      { id: "3B", texto: "Auxilio mecánico", destino: "3B" },
      { id: "3C", texto: "Asistencia por accidente", destino: "3C" },
      { id: "3D", texto: "No sé qué asistencia necesito", destino: "3D" },
      { id: "3E", texto: "¿A qué número llamo?", destino: "3E" },
    ],
  },

  "3A": {
    id: "3A",
    titulo: "Asistencia · Grúa",
    mensajes: ["Vamos a pedir la grúa. Necesito cuatro datos."],
    pasos: [
      {
        clave: "ubicacion",
        pregunta: "¿Dónde estás? Mandame la ubicación o calle, altura y localidad.",
        tipo: "texto",
      },
      { clave: "patente", pregunta: "¿Cuál es la patente del vehículo?", tipo: "texto" },
      { clave: "telefono", pregunta: "¿A qué teléfono te llama el chofer?", tipo: "telefono" },
      {
        clave: "puede_mover",
        pregunta: "¿El vehículo se puede mover por sus propios medios?",
        tipo: "sino",
        sugerencias: ["Sí", "No"],
      },
    ],
    generaGestion: true,
    cierre: [
      "*Pedido N° {{gestion}}* — grúa.\n" +
        "• Ubicación: {{ubicacion}}\n" +
        "• Patente: {{patente}}\n" +
        "• Contacto: {{telefono}}\n" +
        "• Se mueve: {{puede_mover_texto}}",
      SEGURIDAD_EN_RUTA,
      "Ya lo paso a la mesa de asistencia para que despachen la grúa.",
    ],
    derivar: "caso_complejo",
    equipo: "asistencia",
  },

  "3B": {
    id: "3B",
    titulo: "Asistencia · Auxilio mecánico",
    pasos: [
      {
        clave: "problema",
        pregunta: "¿Qué le pasa al auto?",
        tipo: "texto",
        sugerencias: ["No arranca", "Batería", "Rueda pinchada", "Me quedé sin nafta"],
      },
      { clave: "ubicacion", pregunta: "¿Dónde estás?", tipo: "texto" },
      { clave: "patente", pregunta: "¿Patente?", tipo: "texto" },
      { clave: "telefono", pregunta: "¿Teléfono de contacto?", tipo: "telefono" },
    ],
    generaGestion: true,
    cierre: [
      "*Pedido N° {{gestion}}* — auxilio mecánico ({{problema}}) en {{ubicacion}}.",
      SEGURIDAD_EN_RUTA,
    ],
    derivar: "caso_complejo",
    equipo: "asistencia",
  },

  "3C": {
    id: "3C",
    titulo: "Asistencia · Por accidente",
    pasos: [
      {
        clave: "lesionados",
        pregunta: "¿Hay lesionados?",
        tipo: "sino",
        sugerencias: ["Sí", "No"],
        alerta: {
          cuando: "si",
          mensajes: [
            "🚨 Llamá al *911* ahora. Es la prioridad.",
            `Después, o si podés en paralelo, llamanos al *${AGENCIA.telefonoUrgencias}*.`,
            "Ya avisé a la guardia de la agencia.",
          ],
          derivar: "emergencia",
          equipo: "guardia",
          detener: true,
        },
      },
      {
        clave: "choque",
        pregunta: "¿Hubo choque con otro vehículo?",
        tipo: "sino",
        sugerencias: ["Sí", "No"],
      },
      {
        clave: "circula",
        pregunta: "¿El vehículo puede circular?",
        tipo: "sino",
        sugerencias: ["Sí", "No"],
      },
      { clave: "ubicacion", pregunta: "¿Dónde estás?", tipo: "texto" },
      { clave: "telefono", pregunta: "¿Teléfono de contacto?", tipo: "telefono" },
    ],
    generaGestion: true,
    cierre: [
      "*Pedido N° {{gestion}}* — asistencia por accidente.\n" +
        "• Ubicación: {{ubicacion}}\n" +
        "• Choque: {{choque_texto}}\n" +
        "• Circula: {{circula_texto}}",
      SEGURIDAD_EN_RUTA,
      "Después de resolver la asistencia hay que hacer la *denuncia del siniestro*. " +
        "Te lo recuerdo yo, no hace falta que lo hagas ahora.",
    ],
    derivar: "caso_complejo",
    equipo: "asistencia",
  },

  "3D": {
    id: "3D",
    titulo: "Asistencia · No sé cuál",
    pasos: [
      {
        clave: "relato",
        pregunta: "Contame brevemente qué pasó y te indico la asistencia que corresponde.",
        tipo: "texto",
      },
    ],
    sugerirDestino: true,
    cierre: ["Anotado: “{{relato}}”. Te paso con la mesa de asistencia."],
    derivar: "caso_complejo",
    equipo: "asistencia",
  },

  "3E": {
    id: "3E",
    titulo: "Asistencia · Teléfono de la compañía",
    requiereIdentificacion: true,
    consulta: "asistencia",
    siguiente: "menu-corto",
  },

  // ═════════════════════ 4 · Documentación ═════════════════════

  "4": {
    id: "4",
    titulo: "Enviar documentación",
    mensajes: ["¿Qué documento vas a mandar?"],
    opciones: [
      { id: "4A", texto: "DNI", destino: "4A" },
      { id: "4B", texto: "Licencia de conducir", destino: "4B" },
      { id: "4C", texto: "Cédula del vehículo", destino: "4C" },
      { id: "4D", texto: "Fotos del siniestro", destino: "4D" },
      { id: "4E", texto: "Denuncia policial", destino: "4E" },
      { id: "4F", texto: "Presupuesto / factura", destino: "4F" },
      { id: "4G", texto: "CBU para cobro", destino: "4G" },
      { id: "4H", texto: "Otra documentación", destino: "4H" },
    ],
  },

  "4A": {
    id: "4A",
    titulo: "Documentación · DNI",
    pasos: [
      {
        clave: "dni_frente",
        pregunta: "Enviá una foto clara del *frente* del DNI.",
        tipo: "archivo",
        adjuntoEsperado: "foto",
      },
      {
        clave: "dni_dorso",
        pregunta: "Ahora el *dorso*.",
        tipo: "archivo",
        adjuntoEsperado: "foto",
      },
    ],
    cierre: ["Recibido, quedó adjuntado a tu legajo. ✅"],
    siguiente: "menu-corto",
  },

  "4B": {
    id: "4B",
    titulo: "Documentación · Licencia",
    pasos: [
      {
        clave: "licencia",
        pregunta: "Enviá foto clara de tu licencia de conducir, de los dos lados si podés.",
        tipo: "archivo",
        adjuntoEsperado: "foto",
      },
    ],
    cierre: [
      "Recibida. ✅ Ojo con la fecha de vencimiento: si está por vencer, conviene renovarla " +
        "antes de que haga falta.",
    ],
    siguiente: "menu-corto",
  },

  "4C": {
    id: "4C",
    titulo: "Documentación · Cédula",
    pasos: [
      {
        clave: "cedula",
        pregunta: "Enviá foto de la cédula verde o azul.",
        tipo: "archivo",
        adjuntoEsperado: "foto",
      },
    ],
    cierre: ["Recibida. ✅"],
    siguiente: "menu-corto",
  },

  "4D": {
    id: "4D",
    titulo: "Documentación · Fotos del siniestro",
    mensajes: [
      "Enviá fotos donde se vea:\n• el daño completo\n• el detalle del daño\n• la patente del vehículo, si es posible",
    ],
    pasos: [
      {
        clave: "fotos_dano",
        pregunta: "Cuando las tengas, mandámelas por acá.",
        tipo: "archivo",
        adjuntoEsperado: "foto",
      },
    ],
    cierre: ["Recibidas. ✅ Las sumo al legajo del siniestro."],
    siguiente: "menu-corto",
  },

  "4E": {
    id: "4E",
    titulo: "Documentación · Denuncia policial",
    pasos: [
      {
        clave: "denuncia_policial",
        pregunta: "Adjuntá foto o PDF de la denuncia policial.",
        tipo: "archivo",
        adjuntoEsperado: "pdf",
      },
    ],
    cierre: ["Recibida. ✅"],
    siguiente: "menu-corto",
  },

  "4F": {
    id: "4F",
    titulo: "Documentación · Presupuesto o factura",
    pasos: [
      {
        clave: "presupuesto",
        pregunta: "Enviá foto o archivo del presupuesto, factura o comprobante.",
        tipo: "archivo",
        adjuntoEsperado: "pdf",
      },
    ],
    cierre: ["Recibido. ✅ Lo mando a siniestros para que lo evalúen."],
    siguiente: "menu-corto",
  },

  "4G": {
    id: "4G",
    titulo: "Documentación · CBU",
    mensajes: ["Para acreditarte una indemnización necesito el CBU de una cuenta *a tu nombre*."],
    pasos: [
      { clave: "cbu", pregunta: "Pasame el CBU o el alias.", tipo: "texto" },
      { clave: "titular", pregunta: "¿A nombre de quién está la cuenta?", tipo: "texto" },
      {
        clave: "constancia_cbu",
        pregunta: "Adjuntá la constancia de CBU del banco (la que descargás del homebanking).",
        tipo: "archivo",
        adjuntoEsperado: "pdf",
      },
    ],
    cierre: [
      "Anotado: {{cbu}} — titular {{titular}}. ✅",
      "Administración valida que el titular coincida con el asegurado antes de cargarlo.",
    ],
    derivar: "caso_complejo",
    equipo: "administracion",
  },

  "4H": {
    id: "4H",
    titulo: "Documentación · Otra",
    pasos: [
      {
        clave: "archivo",
        pregunta: "Adjuntá el archivo.",
        tipo: "archivo",
        adjuntoEsperado: "pdf",
      },
      { clave: "descripcion", pregunta: "¿De qué documento se trata?", tipo: "texto" },
    ],
    cierre: ["Recibido: {{descripcion}}. ✅"],
    siguiente: "menu-corto",
  },

  // ═════════════════════ 5 · Derivación humana ═════════════════════

  "5": {
    id: "5",
    titulo: "Hablar con una persona",
    mensajes: ["Sin problema. ¿Con quién te paso?"],
    opciones: [
      { id: "5A", texto: "Asesor comercial", destino: "5A" },
      { id: "5B", texto: "Ayuda con un siniestro", destino: "5B" },
      { id: "5C", texto: "Consulta administrativa", destino: "5C" },
      { id: "5D", texto: "Tengo un problema urgente", destino: "5D" },
      { id: "5E", texto: "Quiero que me contacten", destino: "5E" },
    ],
  },

  "5A": {
    id: "5A",
    titulo: "Derivación · Comercial",
    mensajes: ["¿Qué necesitás?"],
    opciones: [
      {
        id: "1",
        texto: "Cotización",
        destino: "5A-contacto",
        define: { clave: "motivo", valor: "cotización" },
      },
      {
        id: "2",
        texto: "Alta de póliza",
        destino: "5A-contacto",
        define: { clave: "motivo", valor: "alta de póliza" },
      },
      {
        id: "3",
        texto: "Cambiar cobertura",
        destino: "5A-contacto",
        define: { clave: "motivo", valor: "cambio de cobertura" },
      },
      {
        id: "4",
        texto: "Cambio de vehículo",
        destino: "5A-contacto",
        define: { clave: "motivo", valor: "cambio de vehículo" },
      },
      {
        id: "5",
        texto: "Asegurar otro vehículo",
        destino: "5A-contacto",
        define: { clave: "motivo", valor: "asegurar otro vehículo" },
      },
    ],
  },

  "5A-contacto": {
    id: "5A-contacto",
    titulo: "Derivación · Comercial (datos)",
    pasos: [
      { clave: "nombre", pregunta: "¿Cómo te llamás?", tipo: "texto" },
      {
        clave: "franja",
        pregunta: "¿En qué franja te viene bien que te llamen?",
        tipo: "texto",
        sugerencias: ["Mañana", "Tarde", "Cualquier momento"],
      },
    ],
    cierre: ["Listo {{nombre}}: *{{motivo}}*, te llaman en la franja de {{franja}}."],
    derivar: "pedido_del_cliente",
    equipo: "comercial",
  },

  "5B": {
    id: "5B",
    titulo: "Derivación · Siniestros",
    pasos: [
      {
        clave: "referencia",
        pregunta:
          "Para ubicar el caso: pasame el número de siniestro, la patente o el número de póliza.",
        tipo: "texto",
      },
      { clave: "relato", pregunta: "¿Qué necesitás resolver?", tipo: "texto" },
    ],
    cierre: ["Anotado. Referencia: {{referencia}}."],
    derivar: "pedido_del_cliente",
    equipo: "siniestros",
  },

  "5C": {
    id: "5C",
    titulo: "Derivación · Administración",
    mensajes: ["¿Sobre qué es la consulta?"],
    opciones: [
      { id: "1", texto: "Pagos", destino: "5C-detalle", define: { clave: "motivo", valor: "pagos" } },
      { id: "2", texto: "Cuotas", destino: "5C-detalle", define: { clave: "motivo", valor: "cuotas" } },
      {
        id: "3",
        texto: "Certificados",
        destino: "5C-detalle",
        define: { clave: "motivo", valor: "certificados" },
      },
      {
        id: "4",
        texto: "Baja de póliza",
        destino: "5C-detalle",
        define: { clave: "motivo", valor: "baja de póliza" },
      },
      {
        id: "5",
        texto: "Modificaciones",
        destino: "5C-detalle",
        define: { clave: "motivo", valor: "modificaciones" },
      },
    ],
  },

  "5C-detalle": {
    id: "5C-detalle",
    titulo: "Derivación · Administración (detalle)",
    pasos: [
      {
        clave: "relato",
        pregunta: "Contame el detalle así el asesor llega con contexto.",
        tipo: "texto",
      },
    ],
    cierre: ["Anotado: *{{motivo}}* — {{relato}}."],
    derivar: "pedido_del_cliente",
    equipo: "administracion",
  },

  "5D": {
    id: "5D",
    titulo: "Derivación · Urgente",
    mensajes: [
      `🚨 Si hay lesionados o una emergencia, llamá al *911* y después a la guardia de ${AGENCIA.nombre}: *${AGENCIA.telefonoUrgencias}*.`,
      "Ya marqué esta conversación como urgente para que la tome una persona ahora.",
    ],
    derivar: "emergencia",
    equipo: "guardia",
  },

  "5E": {
    id: "5E",
    titulo: "Derivación · Que me contacten",
    pasos: [
      { clave: "nombre", pregunta: "¿Cómo te llamás?", tipo: "texto" },
      { clave: "telefono", pregunta: "¿A qué teléfono te llamamos?", tipo: "telefono" },
      { clave: "motivo", pregunta: "¿Cuál es el motivo?", tipo: "texto" },
      {
        clave: "franja",
        pregunta: "¿En qué franja horaria preferís?",
        tipo: "texto",
        sugerencias: ["Mañana", "Tarde", "Cualquier momento"],
      },
    ],
    cierre: [
      "Listo {{nombre}}. Queda agendado:\n• Teléfono: {{telefono}}\n• Motivo: {{motivo}}\n• Franja: {{franja}}",
    ],
    derivar: "pedido_del_cliente",
    equipo: "comercial",
  },
};

export const NODO_INICIAL = "menu";
