/**
 * Comprensión de texto libre.
 *
 * Nadie escribe "1A" en WhatsApp: escribe "me chocaron". El menú numerado es la
 * red de contención, no la vía principal, así que antes de decir "no entendí"
 * conviene buscar la intención en lo que el cliente escribió.
 *
 * Es coincidencia por palabra clave, no un modelo. Para este dominio alcanza:
 * el vocabulario de un siniestro de auto es chico y muy repetido. Y a diferencia
 * de un modelo, cuando se equivoca se puede ver por qué y arreglarlo en una línea.
 *
 * Comparte criterio con `nucleo/.../whatsapp/bot/Intencion.java`, que hace lo
 * mismo del lado del backend. Si acá se agrega un término que aparece seguido,
 * conviene agregarlo allá también.
 */

/** Minúsculas, sin acentos y sin puntuación: "Choqué!!" y "choque" son lo mismo. */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // las marcas de acento que separó NFD
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Intención → nodo del guion. El orden del arreglo ES la prioridad: un mensaje
 * que dice "choqué y quiero hablar con alguien" es un siniestro, no una
 * derivación comercial.
 */
const RUTAS: { destino: string; claves: string[] }[] = [
  {
    destino: "5D",
    claves: ["emergencia", "urgente", "herido", "heridos", "lesionado", "lesionados", "ambulancia", "911"],
  },
  {
    destino: "1A",
    claves: ["choque", "choco", "chocaron", "chocamos", "colision", "embistieron", "me dieron"],
  },
  { destino: "1B", claves: ["robo", "robaron", "hurto", "sustrajeron"] },
  { destino: "1C", claves: ["cristal", "cristales", "parabrisas", "luneta", "vidrio", "ventanilla"] },
  { destino: "1D", claves: ["incendio", "fuego", "se prendio fuego", "quemo", "humo"] },
  { destino: "1E", claves: ["granizo", "granizada", "inundacion", "inundo", "temporal"] },
  { destino: "3A", claves: ["grua", "remolque", "remolcar", "acarreo"] },
  {
    destino: "3B",
    claves: [
      "auxilio", "no arranca", "bateria", "pinchada", "pinche", "goma", "rueda",
      "mecanico", "sin nafta", "sin combustible",
    ],
  },
  { destino: "3E", claves: ["que numero", "a que numero", "telefono de asistencia", "numero de asistencia"] },
  { destino: "1", claves: ["siniestro", "denuncia", "denunciar", "accidente"] },
  { destino: "2E", claves: ["franquicia", "descubierto obligatorio"] },
  { destino: "2C", claves: ["forma de pago", "como pago", "debito", "tarjeta", "cbu", "transferencia"] },
  {
    destino: "2D",
    claves: ["vencimiento", "vence", "cuota", "cuotas", "deuda", "debo", "pagar", "impaga"],
  },
  { destino: "2B", claves: ["vigencia", "vigente", "hasta cuando"] },
  {
    destino: "2A",
    claves: ["cobertura", "cubre", "cubierto", "todo riesgo", "terceros completo", "suma asegurada"],
  },
  {
    destino: "2F",
    claves: ["certificado", "comprobante", "carta verde", "frente de poliza"],
  },
  {
    destino: "4",
    claves: ["mandar documentacion", "enviar documentacion", "adjuntar", "documentacion", "dni", "licencia", "cedula"],
  },
  {
    destino: "5A",
    claves: ["cotizar", "cotizacion", "asegurar", "alta de poliza", "nuevo seguro"],
  },
  { destino: "5C", claves: ["dar de baja", "baja de poliza", "cancelar poliza", "modificar"] },
  {
    destino: "5",
    claves: ["asesor", "humano", "persona", "operador", "productor", "hablar con alguien", "atencion"],
  },
  { destino: "2", claves: ["poliza", "mi seguro"] },
];

export function detectarIntencion(texto: string): string | null {
  const plano = normalizar(texto);
  if (!plano) return null;
  for (const ruta of RUTAS) {
    if (ruta.claves.some((c) => plano.includes(c))) return ruta.destino;
  }
  return null;
}

/**
 * Cliente caliente.
 *
 * La regla que bajó la agencia es clara: cuando el cliente está enojado conviene
 * que entre una persona. El costo de equivocarse es asimétrico — derivar de más
 * a alguien que estaba tranquilo cuesta un minuto de un asesor; dejar al bot
 * insistiendo con un menú cuando el otro está furioso cuesta el cliente.
 */
const ENOJO = [
  "desastre", "verguenza", "vergonzoso", "pesimo", "horrible", "inutil",
  "no sirve", "no funciona", "nadie me contesta", "nadie contesta", "no me contestan",
  "hace dias", "hace semanas", "otra vez", "ya escribi", "ya llame",
  "ya te dije", "es la tercera", "es la cuarta", "estoy cansado", "estoy cansada",
  "harto", "harta", "reclamo", "queja", "defensa del consumidor",
  "abogado", "estafa", "chorros", "ladrones", "mentira", "basta",
];

const INSULTOS = ["mierda", "carajo", "puta", "pelotudo", "boludo", "forro", "hdp"];

export type Temperatura = { caliente: boolean; senales: string[] };

export function medirTemperatura(texto: string): Temperatura {
  const plano = normalizar(texto);
  const senales: string[] = [];

  for (const palabra of [...ENOJO, ...INSULTOS]) {
    if (plano.includes(palabra)) senales.push(`escribió "${palabra}"`);
  }

  // Mayúsculas sostenidas: gritar. Se pide un mínimo de largo para no marcar un
  // "OK" ni una patente escrita como "AB123CD".
  const letras = texto.replace(/[^\p{L}]/gu, "");
  if (letras.length >= 12 && letras === letras.toUpperCase()) {
    senales.push("escribió todo en mayúsculas");
  }

  if (/[!?]{3,}/.test(texto)) senales.push("signos repetidos");

  return { caliente: senales.length > 0, senales: senales.slice(0, 3) };
}

// ─────────────────────────── Parsers ───────────────────────────

const SI = ["si", "s", "sip", "sisi", "claro", "obvio", "afirmativo", "dale", "correcto", "exacto", "hubo", "hay"];
const NO = ["no", "n", "nop", "nada", "ninguno", "ninguna", "negativo"];

/** "si" | "no" | null. Devuelve null cuando la respuesta no es ni una cosa ni la otra. */
export function interpretarSiNo(texto: string): "si" | "no" | null {
  const plano = normalizar(texto);
  if (!plano) return null;
  // El "no" se evalúa primero: "no, no hubo heridos" contiene "hubo".
  if (NO.some((n) => plano === n || plano.startsWith(`${n} `))) return "no";
  if (SI.some((s) => plano === s || plano.startsWith(`${s} `))) return "si";
  if (NO.some((n) => plano.includes(` ${n} `))) return "no";
  if (SI.some((s) => plano.includes(` ${s} `))) return "si";
  return null;
}

export type Comando = "menu" | "volver" | "asesor" | "baja" | "alta" | null;

/** Palabras que funcionan en cualquier punto de la conversación. */
export function interpretarComando(texto: string): Comando {
  const plano = normalizar(texto);
  if (["menu", "inicio", "empezar", "start", "hola", "buenas"].includes(plano)) return "menu";
  if (["volver", "atras", "cancelar", "salir"].includes(plano)) return "volver";
  if (["asesor", "humano", "operador"].includes(plano)) return "asesor";
  if (["baja", "stop", "no molestar", "desuscribir"].includes(plano)) return "baja";
  if (["alta", "suscribir"].includes(plano)) return "alta";
  return null;
}

/** Patente argentina: vieja (AAA123) o Mercosur (AA123AA). */
export function parecePatente(texto: string): boolean {
  const plano = normalizar(texto).replace(/\s/g, "");
  return /^[a-z]{3}[0-9]{3}$/.test(plano) || /^[a-z]{2}[0-9]{3}[a-z]{2}$/.test(plano);
}
