/**
 * Motor conversacional de *Poné*.
 *
 * Es una función pura: `avanzar(estado, entrada, ahora) -> estado`. No toca la
 * red, no lee el reloj por su cuenta y no depende de React. Eso es lo que
 * permite que el mismo motor corra hoy en el panel como simulador y mañana
 * dentro del webhook de WhatsApp sin reescribir una línea del guion.
 *
 * El único paso que no puede resolver solo es buscar la póliza en la cartera.
 * En vez de hacer el fetch acá, el motor deja un `pendiente` y quien lo hospeda
 * lo resuelve y vuelve con `resolverIdentificacion`.
 *
 * ── Las tres reglas de derivación que pidió la agencia ──
 *
 *   1. Caso complejo    → los nodos que lo necesitan lo declaran (`derivar`).
 *   2. Cliente caliente → `medirTemperatura`, en cuanto aparece una señal.
 *   3. Vueltas sin      → contadores: dos veces sin entender, o tres vueltas
 *      resolver           al menú, y entra una persona.
 *
 * Y una cuarta, que no estaba en el pliego pero no se discute: si hay
 * lesionados, el guion se corta y se manda al 911.
 */

import { fecha as formatearFecha } from "@panel/lib/formato";

import { AGENCIA, GUION } from "./guion";
import {
  detectarIntencion,
  interpretarComando,
  interpretarSiNo,
  medirTemperatura,
  normalizar,
  type Temperatura,
} from "./intencion";
import type {
  Adjunto,
  Entrada,
  Equipo,
  Estado,
  Mensaje,
  MotivoDerivacion,
  Nodo,
  OrigenPoliza,
  Paso,
  Plantilla,
  Poliza,
} from "./tipos";

// ───────────────────────────── Constantes ─────────────────────────────

const PASO_IDENTIFICACION: Paso = {
  clave: "identificador",
  pregunta:
    "Indicame *patente*, *DNI* o *número de póliza* para verificar tus datos.",
  tipo: "identificador",
};

const EQUIPOS: Record<Equipo, string> = {
  siniestros: "la mesa de siniestros",
  comercial: "un asesor comercial",
  administracion: "administración",
  guardia: "la guardia",
  asistencia: "la mesa de asistencia",
};

const EXPLICACION: Record<MotivoDerivacion, string> = {
  siniestro_denunciado: "un siniestro siempre lo cierra una persona",
  pedido_del_cliente: "lo pidió el cliente",
  caso_complejo: "el caso necesita gestión humana",
  cliente_molesto: "el cliente está molesto",
  sin_resolver: "van varias vueltas sin resolver",
  no_entendi: "el bot no entendió dos veces seguidas",
  emergencia: "hay una emergencia en curso",
  dato_faltante: "el dato no está cargado en el sistema",
};

const NOTA_ESCALADA =
  "El asesor ve todo lo que escribas acá. El bot queda en silencio para no interrumpir.";

// ───────────────────────────── Utilidades ─────────────────────────────

function esHorarioLaboral(ahora: Date): boolean {
  const dia = ahora.getDay();
  const hora = ahora.getHours();
  return dia >= 1 && dia <= 5 && hora >= 9 && hora < 18;
}

/** Marca de tiempo de un mensaje. ISO; el panel la formatea al mostrarla. */
function sello(ahora: Date): string {
  return ahora.toISOString();
}

function diasHasta(iso: string | null, ahora: Date): number | null {
  if (!iso) return null;
  const destino = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(destino.getTime())) return null;
  const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 12);
  return Math.round((destino.getTime() - hoy.getTime()) / 86_400_000);
}

/** Reemplaza `{{clave}}`. Un marcador sin dato queda como raya, nunca "undefined". */
function interpolar(plantilla: Plantilla, ctx: Record<string, string>): string {
  return plantilla.replace(/\{\{([\w.]+)\}\}/g, (_, clave: string) => ctx[clave] ?? "—");
}

function contexto(e: Estado): Record<string, string> {
  const ctx: Record<string, string> = { ...e.datos };

  // Los sí/no se guardan normalizados para poder compararlos; para mostrarlos
  // hace falta la versión con acento.
  for (const [clave, valor] of Object.entries(e.datos)) {
    if (valor === "si" || valor === "no") ctx[`${clave}_texto`] = valor === "si" ? "sí" : "no";
  }

  ctx.adjuntos_cantidad = String(e.adjuntos.length);

  if (e.poliza) {
    const p = e.poliza;
    ctx["poliza.numero"] = p.numero;
    ctx["poliza.cliente"] = p.cliente;
    ctx["poliza.compania"] = p.compania;
    ctx["poliza.ramo"] = p.ramo;
    ctx["poliza.patente"] = p.patente ?? "—";
    ctx["poliza.detalle"] = p.detalle ?? p.ramo;
  }

  return ctx;
}

function pasosDe(e: Estado, nodo: Nodo): Paso[] {
  const propios = nodo.pasos ?? [];
  return nodo.requiereIdentificacion && !e.poliza ? [PASO_IDENTIFICACION, ...propios] : propios;
}

function cumpleCondicion(paso: Paso, datos: Record<string, string>): boolean {
  if (!paso.condicion) return true;
  return datos[paso.condicion.clave] === paso.condicion.igual;
}

/** Pasos donde se espera que el cliente describa el hecho con sus palabras. */
const RELATOS = new Set(["como", "relato", "problema", "descripcion", "alcance", "evento"]);
const SIN_ENOJO: Temperatura = { caliente: false, senales: [] };

function enRelato(e: Estado): boolean {
  if (e.paso < 0) return false;
  const paso = pasosDe(e, GUION[e.nodo])[e.paso];
  return Boolean(paso && RELATOS.has(paso.clave));
}

// ───────────────────────────── Emisión ─────────────────────────────

function mensaje(e: Estado, m: Omit<Mensaje, "id">): Mensaje {
  return { ...m, id: `m${e.historial.length}` };
}

function emitir(e: Estado, m: Omit<Mensaje, "id">): Estado {
  return { ...e, historial: [...e.historial, mensaje(e, m)] };
}

/** Emite varios globos del bot. Los extras se cuelgan del último. */
function emitirBot(
  e: Estado,
  textos: string[],
  ahora: Date,
  extra: Partial<Pick<Mensaje, "opciones" | "sugerencias" | "esperaAdjunto">> = {},
): Estado {
  const limpios = textos.filter((t) => t.trim().length > 0);
  return limpios.reduce((acc, texto, i) => {
    const ultimo = i === limpios.length - 1;
    return emitir(acc, {
      rol: "bot",
      texto,
      hora: sello(ahora),
      ...(ultimo ? extra : {}),
    });
  }, e);
}

function anotar(e: Estado, ahora: Date, texto: string): Estado {
  return { ...e, traza: [...e.traza, { en: sello(ahora), nodo: e.nodo, texto }] };
}

// ───────────────────────────── Derivación ─────────────────────────────

function escalar(
  e: Estado,
  motivo: MotivoDerivacion,
  equipo: Equipo,
  ahora: Date,
  preambulo: string[] = [],
): Estado {
  if (e.escalada) return e;

  const cierre =
    equipo === "guardia"
      ? "La guardia atiende las 24 horas."
      : esHorarioLaboral(ahora)
        ? "En unos minutos te escriben por acá."
        : `Ahora estamos fuera de horario (${AGENCIA.horario}); te responden a primera hora.`;

  let salida = emitirBot(e, [...preambulo, `Te paso con ${EQUIPOS[equipo]}. ${cierre}`], ahora);

  salida = emitir(salida, {
    rol: "sistema",
    texto: `Conversación derivada a ${EQUIPOS[equipo]} — ${EXPLICACION[motivo]}.`,
    hora: sello(ahora),
  });

  salida = anotar(salida, ahora, `Derivada a ${equipo}: ${EXPLICACION[motivo]}`);

  return {
    ...salida,
    nodo: "silencio",
    paso: -1,
    escalada: { motivo, equipo, explicacion: EXPLICACION[motivo], en: sello(ahora) },
  };
}

// ───────────────────────────── Consultas ─────────────────────────────

type Respuesta = { mensajes: string[]; derivar?: { motivo: MotivoDerivacion; equipo: Equipo } };

const SIN_DATO = (campo: string, p: Poliza): Respuesta => ({
  mensajes: [
    `No tengo cargado ${campo} de la póliza *${p.numero}*.`,
    "No te quiero decir algo que después no se cumpla, así que te paso con alguien que lo " +
      "verifica en el sistema de la compañía.",
  ],
  derivar: { motivo: "dato_faltante", equipo: "administracion" },
});

function responderConsulta(e: Estado, ahora: Date): Respuesta {
  const nodo = GUION[e.nodo];
  const p = e.poliza;
  if (!p) return { mensajes: [], derivar: { motivo: "dato_faltante", equipo: "administracion" } };

  const vigente = p.estado === "VIGENTE";
  const dias = diasHasta(p.vigenciaHasta, ahora);

  switch (nodo.consulta) {
    case "cobertura": {
      if (!p.cobertura) return SIN_DATO("el detalle de cobertura", p);
      return {
        mensajes: [
          `Póliza *${p.numero}* — ${p.compania}\n${p.detalle ?? p.ramo}`,
          `*Cobertura:* ${p.cobertura}\n` +
            `*Estado:* ${vigente ? "vigente ✅" : `${p.estado.toLowerCase()} ⚠️`}\n` +
            `*Suma asegurada:* ${p.sumaAsegurada ?? "no informada"}`,
          p.incluye.length > 0
            ? `Incluye:\n${p.incluye.map((i) => `• ${i}`).join("\n")}`
            : "El detalle de qué incluye lo tiene el asesor.",
          "Esto es lo que figura en tu póliza. Si tenés un caso puntual y querés saber si entra, " +
            "te lo confirma un asesor: yo no puedo darte una respuesta que comprometa a la compañía.",
        ],
      };
    }

    case "vigencia": {
      if (!vigente) {
        return {
          mensajes: [
            `Tu póliza *${p.numero}* figura como *${p.estado.toLowerCase()}*. ` +
              `El último período fue del ${formatearFecha(p.vigenciaDesde)} al ${formatearFecha(p.vigenciaHasta)}.`,
            "Sin póliza vigente no hay cobertura, así que esto lo quiero resolver con vos ahora.",
          ],
          derivar: { motivo: "caso_complejo", equipo: "comercial" },
        };
      }
      const aviso =
        dias !== null && dias <= 30
          ? `\n\nTe quedan *${dias} días*. La renovación ya está en circuito: te vamos a escribir antes del vencimiento.`
          : "";
      return {
        mensajes: [
          `Tu póliza *${p.numero}* se encuentra vigente desde el ${formatearFecha(p.vigenciaDesde)} ` +
            `hasta el ${formatearFecha(p.vigenciaHasta)}.${aviso}`,
        ],
      };
    }

    case "franquicia": {
      if (!p.franquicia) return SIN_DATO("la franquicia", p);
      return {
        mensajes: [
          `La franquicia informada para tu cobertura es de *${p.franquicia}*.`,
          "Es el monto que queda a tu cargo en un daño parcial. En cristales y en robo total " +
            "normalmente no se aplica, pero eso depende de la cláusula de tu póliza.",
        ],
      };
    }

    case "forma-pago": {
      if (!p.formaPago) return SIN_DATO("la forma de pago", p);
      const mora =
        p.cuotasImpagas > 0
          ? `\n\n⚠️ Figuran *${p.cuotasImpagas} cuota(s) impaga(s)*.`
          : "";
      return {
        mensajes: [
          `Tu método de pago registrado es:\n*${p.formaPago}*${mora}`,
          "Si querés cambiarlo, escribí *5* y te paso con administración.",
        ],
      };
    }

    case "vencimiento": {
      const proximo = p.proximoVencimiento
        ? `Tu próxima cuota vence el *${formatearFecha(p.proximoVencimiento)}*.`
        : "No tengo cargada la fecha de la próxima cuota.";

      if (p.cuotasImpagas > 0) {
        return {
          mensajes: [
            `${proximo}\n\n⚠️ Además figuran *${p.cuotasImpagas} cuota(s) impaga(s)*.`,
            "Con cuotas vencidas la compañía puede suspender la cobertura, y eso se descubre en el " +
              "peor momento. Te paso con administración para regularizarlo.",
          ],
          derivar: { motivo: "caso_complejo", equipo: "administracion" },
        };
      }
      return { mensajes: [`${proximo}\n\nNo figuran cuotas impagas. ¡Gracias por estar al día!`] };
    }

    case "asistencia": {
      if (!p.asistencia) {
        return {
          mensajes: [
            `Todavía no tengo cargado el teléfono de asistencia de *${p.compania}*.`,
            "Te paso con una persona que te lo pasa ahora mismo.",
          ],
          derivar: { motivo: "dato_faltante", equipo: "asistencia" },
        };
      }
      return {
        mensajes: [
          `El teléfono de asistencia de *${p.compania}* es *${p.asistencia}*, las 24 horas.`,
          `Tené a mano la patente (${p.patente ?? "—"}) y el número de póliza: ${p.numero}.`,
          "Si preferís, lo gestiono yo desde acá: escribí *3*.",
        ],
      };
    }

    case "comprobante": {
      const cual = e.datos.comprobante ?? "el comprobante";
      return {
        mensajes: [
          `Pedido de *${cual}* para la póliza ${p.numero}. Queda registrado con el N° ${e.datos.gestion ?? "—"}.`,
          "Te lo mando por acá apenas administración lo emita, normalmente el mismo día hábil.",
        ],
      };
    }

    default:
      return { mensajes: [] };
  }
}

// ───────────────────────────── Navegación ─────────────────────────────

function numeroDeGestion(e: Estado, ahora: Date): string {
  const prefijo = e.nodo.startsWith("1") ? "SN" : e.nodo.startsWith("3") ? "AS" : "GS";
  const dia = `${ahora.getFullYear()}${String(ahora.getMonth() + 1).padStart(2, "0")}${String(
    ahora.getDate(),
  ).padStart(2, "0")}`;
  return `${prefijo}-${dia}-${String(e.gestiones.length + 1).padStart(3, "0")}`;
}

function preguntar(e: Estado, pasos: Paso[], indice: number, ahora: Date): Estado {
  const paso = pasos[indice];
  const salida = emitirBot(e, [interpolar(paso.pregunta, contexto(e))], ahora, {
    sugerencias: paso.sugerencias,
    esperaAdjunto: paso.adjuntoEsperado,
  });
  return { ...salida, paso: indice };
}

/** Primer paso a partir de `desde` cuya condición se cumple. -1 si no queda ninguno. */
function proximoPaso(e: Estado, pasos: Paso[], desde: number): number {
  for (let i = desde; i < pasos.length; i++) {
    if (cumpleCondicion(pasos[i], e.datos)) return i;
  }
  return -1;
}

function entrarA(e: Estado, nodoId: string, ahora: Date): Estado {
  const nodo = GUION[nodoId];
  if (!nodo) return e;

  // Terminal por definición: no emite, no pregunta y no vuelve al menú.
  if (nodoId === "silencio") return anotar({ ...e, nodo: "silencio", paso: -1 }, ahora, "→ silencio");

  const vuelveAlMenu = nodoId === "menu" || nodoId === "menu-corto";

  let salida: Estado = {
    ...e,
    nodo: nodoId,
    paso: -1,
    // Un trámite nuevo no hereda los datos del anterior. La póliza identificada
    // sí se conserva: es de la sesión, no del trámite.
    datos: vuelveAlMenu ? {} : e.datos,
    contadores: {
      ...e.contadores,
      // El saludo inicial no es una "vuelta": se cuenta desde la primera vez que
      // el cliente termina de nuevo frente al menú sin haber resuelto nada.
      vueltasAlMenu:
        vuelveAlMenu && e.historial.length > 0
          ? e.contadores.vueltasAlMenu + 1
          : e.contadores.vueltasAlMenu,
      sinEntender: 0,
    },
  };

  salida = anotar(salida, ahora, `→ ${nodo.titulo}`);

  // Regla 3: si ya dio tres vueltas al menú, el bot no está resolviendo nada.
  if (vuelveAlMenu && salida.contadores.vueltasAlMenu >= 3 && !salida.escalada) {
    return escalar(salida, "sin_resolver", "administracion", ahora, [
      "Veo que estamos dando vueltas y no terminás de resolverlo.",
    ]);
  }

  salida = emitirBot(salida, (nodo.mensajes ?? []).map((m) => interpolar(m, contexto(salida))), ahora, {
    opciones: nodo.opciones,
  });

  if (nodo.opciones && nodo.opciones.length > 0) return salida;

  const pasos = pasosDe(salida, nodo);
  const primero = proximoPaso(salida, pasos, 0);
  if (primero >= 0) return preguntar(salida, pasos, primero, ahora);

  return finalizar(salida, ahora);
}

function finalizar(e: Estado, ahora: Date): Estado {
  const nodo = GUION[e.nodo];
  let salida = e;

  if (nodo.generaGestion && !salida.datos.gestion) {
    const gestion = numeroDeGestion(salida, ahora);
    salida = {
      ...salida,
      datos: { ...salida.datos, gestion },
      gestiones: [...salida.gestiones, { id: gestion, asunto: nodo.titulo }],
    };
    salida = anotar(salida, ahora, `Gestión ${gestion} — ${nodo.titulo}`);
  }

  let derivacion = nodo.derivar
    ? { motivo: nodo.derivar, equipo: nodo.equipo ?? "administracion" }
    : undefined;

  if (nodo.consulta) {
    const r = responderConsulta(salida, ahora);
    salida = emitirBot(salida, r.mensajes, ahora);
    derivacion = r.derivar ?? derivacion;
  }

  if (nodo.cierre) {
    const ctx = contexto(salida);
    salida = emitirBot(salida, nodo.cierre.map((t) => interpolar(t, ctx)), ahora);
  }

  if (derivacion) return escalar(salida, derivacion.motivo, derivacion.equipo, ahora);

  return entrarA(salida, nodo.siguiente ?? "menu-corto", ahora);
}

/** Regla 3, primera mitad: dos veces sin entender y entra una persona. */
function noEntendi(e: Estado, ahora: Date): Estado {
  const sinEntender = e.contadores.sinEntender + 1;
  const salida: Estado = { ...e, contadores: { ...e.contadores, sinEntender } };

  if (sinEntender >= 2) {
    return escalar(salida, "no_entendi", "administracion", ahora, [
      "Prefiero pasarte con una persona así te ayuda bien, en vez de seguir haciéndote repetir.",
    ]);
  }

  const nodo = GUION[salida.nodo];
  if (nodo.opciones && nodo.opciones.length > 0) {
    return emitirBot(salida, ["No estoy seguro de haber entendido. Elegí una opción:"], ahora, {
      opciones: nodo.opciones,
    });
  }
  return entrarA(
    emitirBot(salida, ["No estoy seguro de haber entendido."], ahora),
    "menu-corto",
    ahora,
  );
}

// ───────────────────────────── Respuesta a un paso ─────────────────────────────

function responderPaso(e: Estado, entrada: Entrada, ahora: Date): Estado {
  const nodo = GUION[e.nodo];
  const pasos = pasosDe(e, nodo);
  const paso = pasos[e.paso];
  if (!paso) return finalizar(e, ahora);

  const texto = entrada.tipo === "texto" ? entrada.texto : "";

  // ── Archivos ──
  if (paso.tipo === "archivo") {
    if (entrada.tipo !== "adjunto") {
      const negativa = interpretarSiNo(texto) === "no";
      if (paso.opcional && (negativa || normalizar(texto).includes("no tengo"))) {
        return continuar({ ...e, datos: { ...e.datos, [paso.clave]: "no adjuntado" } }, pasos, ahora);
      }
      return emitirBot(
        e,
        [
          paso.opcional
            ? "Si no lo tenés a mano, escribí *no tengo* y seguimos."
            : "Necesito que lo adjuntes para poder seguir. Usá el clip 📎.",
        ],
        ahora,
        { esperaAdjunto: paso.adjuntoEsperado },
      );
    }
    const conAdjunto: Estado = {
      ...e,
      datos: { ...e.datos, [paso.clave]: entrada.adjunto.nombre },
      adjuntos: [...e.adjuntos, entrada.adjunto],
    };
    return continuar(emitirBot(conAdjunto, ["Recibido ✅"], ahora), pasos, ahora);
  }

  if (entrada.tipo === "adjunto") {
    // Mandó un archivo cuando se esperaba texto. Se guarda igual — nunca se
    // descarta algo que el cliente se tomó el trabajo de mandar — y se repregunta.
    const guardado: Estado = { ...e, adjuntos: [...e.adjuntos, entrada.adjunto] };
    return emitirBot(guardado, ["Guardo el archivo. " + interpolar(paso.pregunta, contexto(guardado))], ahora, {
      sugerencias: paso.sugerencias,
    });
  }

  // ── Sí / no ──
  if (paso.tipo === "sino") {
    const valor = interpretarSiNo(texto);
    if (!valor) {
      const salida = { ...e, contadores: { ...e.contadores, sinEntender: e.contadores.sinEntender + 1 } };
      if (salida.contadores.sinEntender >= 2) {
        return escalar(salida, "no_entendi", "administracion", ahora, [
          "Mejor te paso con una persona en vez de seguir preguntándote lo mismo.",
        ]);
      }
      return emitirBot(salida, ["Perdón, necesito un *sí* o un *no*."], ahora, {
        sugerencias: paso.sugerencias ?? ["Sí", "No"],
      });
    }

    let salida: Estado = {
      ...e,
      datos: { ...e.datos, [paso.clave]: valor },
      contadores: { ...e.contadores, sinEntender: 0 },
    };

    if (paso.alerta && paso.alerta.cuando === valor) {
      salida = emitirBot(salida, paso.alerta.mensajes, ahora);
      salida = anotar(salida, ahora, `Alerta en "${paso.clave}" = ${valor}`);
      if (paso.alerta.derivar) {
        return escalar(salida, paso.alerta.derivar, paso.alerta.equipo ?? "guardia", ahora);
      }
      if (paso.alerta.detener) return finalizar(salida, ahora);
    }

    return continuar(salida, pasos, ahora);
  }

  // ── Identificación: el motor no busca, deja el pendiente ──
  if (paso.tipo === "identificador") {
    if (normalizar(texto).length < 4) {
      return emitirBot(e, ["Necesito la patente, el DNI o el número de póliza completo."], ahora);
    }
    return {
      ...e,
      datos: { ...e.datos, identificador: texto.trim() },
      pendiente: { tipo: "buscar-poliza", texto: texto.trim() },
    };
  }

  // ── Texto libre ──
  if (texto.trim().length === 0) return e;
  const salida: Estado = {
    ...e,
    datos: { ...e.datos, [paso.clave]: texto.trim() },
    contadores: { ...e.contadores, sinEntender: 0 },
  };

  // 3D: el cliente contó qué pasó; si se reconoce, se lo lleva al flujo correcto
  // en vez de derivarlo con un relato suelto.
  if (nodo.sugerirDestino) {
    const destino = detectarIntencion(texto);
    if (destino && destino !== nodo.id && GUION[destino]) {
      const aviso = emitirBot(
        salida,
        [`Por lo que contás, esto es *${GUION[destino].titulo.replace(/^.*· /, "")}*. Vamos por ahí.`],
        ahora,
      );
      return entrarA(aviso, destino, ahora);
    }
  }

  return continuar(salida, pasos, ahora);
}

function continuar(e: Estado, pasos: Paso[], ahora: Date): Estado {
  const siguiente = proximoPaso(e, pasos, e.paso + 1);
  return siguiente >= 0 ? preguntar(e, pasos, siguiente, ahora) : finalizar(e, ahora);
}

// ───────────────────────────── API pública ─────────────────────────────

export function conversacionNueva(ahora: Date): Estado {
  const vacio: Estado = {
    nodo: "menu",
    paso: -1,
    datos: {},
    adjuntos: [],
    poliza: null,
    origenPoliza: null,
    escalada: null,
    optIn: true,
    gestiones: [],
    contadores: { sinEntender: 0, vueltasAlMenu: 0, mensajesCliente: 0 },
    historial: [],
    traza: [],
    pendiente: null,
  };
  return entrarA(vacio, "menu", ahora);
}

export function avanzar(estado: Estado, entrada: Entrada, ahora: Date): Estado {
  // ── 1. Queda registrado lo que mandó el cliente ──
  let e = estado;

  if (entrada.tipo === "texto") {
    if (entrada.texto.trim().length === 0) return e;
    e = emitir(e, { rol: "cliente", texto: entrada.texto, hora: sello(ahora) });
  } else if (entrada.tipo === "adjunto") {
    e = emitir(e, {
      rol: "cliente",
      texto: entrada.adjunto.nombre,
      hora: sello(ahora),
      adjunto: entrada.adjunto,
    });
  } else {
    const nodo = GUION[e.nodo];
    const opcion = (nodo.opciones ?? []).find((o) => o.id === entrada.id);
    if (!opcion) return e;
    e = emitir(e, { rol: "cliente", texto: opcion.texto, hora: sello(ahora) });
  }

  e = { ...e, contadores: { ...e.contadores, mensajesCliente: e.contadores.mensajesCliente + 1 } };

  // ── 2. Ya hay una persona a cargo: el bot no interrumpe ──
  if (e.escalada) {
    const yaAvisado = e.historial.some((m) => m.rol === "sistema" && m.texto === NOTA_ESCALADA);
    return yaAvisado ? e : emitir(e, { rol: "sistema", texto: NOTA_ESCALADA, hora: sello(ahora) });
  }

  // ── 3. Botón del menú ──
  if (entrada.tipo === "opcion") {
    const nodo = GUION[e.nodo];
    const opcion = (nodo.opciones ?? []).find((o) => o.id === entrada.id);
    if (!opcion) return noEntendi(e, ahora);
    if (opcion.define) {
      e = { ...e, datos: { ...e.datos, [opcion.define.clave]: opcion.define.valor } };
    }
    return entrarA(e, opcion.destino, ahora);
  }

  // ── 4. Texto libre: primero lo que corta cualquier flujo ──
  if (entrada.tipo === "texto") {
    // Regla 2: cliente caliente.
    //
    // Con una excepción: cuando el guion pidió que cuente qué pasó, "fue un
    // desastre" describe el choque, no la atención de la agencia. Medir enojo
    // ahí derivaba a media denuncia por usar la palabra esperable.
    const temperatura = enRelato(e) ? SIN_ENOJO : medirTemperatura(entrada.texto);
    if (temperatura.caliente) {
      const conSenal = anotar(e, ahora, `Enojo detectado (${temperatura.senales.join(", ")})`);
      return escalar(conSenal, "cliente_molesto", "administracion", ahora, [
        "Entiendo la bronca, y con razón.",
        "Esto no lo va a resolver un bot.",
      ]);
    }

    switch (interpretarComando(entrada.texto)) {
      case "menu":
      case "volver":
        return entrarA(e, "menu-corto", ahora);
      case "asesor":
        return entrarA(e, "5", ahora);
      case "baja":
        return entrarA({ ...e, optIn: false }, "baja", ahora);
      case "alta":
        return entrarA({ ...e, optIn: true }, "alta", ahora);
      default:
        break;
    }
  }

  // ── 5. Está contestando una pregunta del guion ──
  if (e.paso >= 0) return responderPaso(e, entrada, ahora);

  // ── 6. Está frente a un menú, pero escribió en vez de tocar un botón ──
  const nodo = GUION[e.nodo];
  if (entrada.tipo === "texto") {
    const plano = normalizar(entrada.texto).replace(/\s/g, "");

    const porId = (nodo.opciones ?? []).find((o) => o.id.toLowerCase() === plano);
    if (porId) {
      const conDato = porId.define
        ? { ...e, datos: { ...e.datos, [porId.define.clave]: porId.define.valor } }
        : e;
      return entrarA(conDato, porId.destino, ahora);
    }

    const porTexto = (nodo.opciones ?? []).find((o) => normalizar(o.texto) === normalizar(entrada.texto));
    if (porTexto) return entrarA(e, porTexto.destino, ahora);

    const destino = detectarIntencion(entrada.texto);
    if (destino && GUION[destino]) return entrarA(e, destino, ahora);
  }

  return noEntendi(e, ahora);
}

/**
 * Segunda mitad de la identificación: el hospedador buscó la póliza y vuelve
 * con el resultado (o con nada).
 */
export function resolverIdentificacion(
  estado: Estado,
  poliza: Poliza | null,
  origen: OrigenPoliza | null,
  ahora: Date,
): Estado {
  const e: Estado = { ...estado, pendiente: null };
  const nodo = GUION[e.nodo];

  if (!poliza) {
    const intentos = Number(e.datos.intentos_identificacion ?? "0") + 1;
    const salida: Estado = {
      ...e,
      datos: { ...e.datos, intentos_identificacion: String(intentos) },
    };

    if (intentos >= 2) {
      return escalar(salida, "dato_faltante", "administracion", ahora, [
        "Sigo sin encontrarlo. Te paso con una persona que lo busca en el sistema.",
      ]);
    }

    return emitirBot(
      salida,
      [
        `No encontré ninguna póliza con *${e.datos.identificador ?? "ese dato"}*.`,
        "Probá con la patente (AB123CD), el DNI sin puntos o el número de póliza completo.",
      ],
      ahora,
    );
  }

  let salida: Estado = { ...e, poliza, origenPoliza: origen };
  salida = anotar(salida, ahora, `Identificado: ${poliza.numero} (${origen})`);
  salida = emitirBot(
    salida,
    [
      `Gracias ${poliza.cliente.split(" ")[0]}. Encontré tu póliza *${poliza.numero}* ` +
        `de ${poliza.compania}${poliza.patente ? ` — patente ${poliza.patente}` : ""}.`,
    ],
    ahora,
  );

  // La identificación era el paso 0 sintético: se retoman los pasos propios del nodo.
  const pasos = pasosDe(salida, nodo);
  const siguiente = proximoPaso(salida, pasos, 0);
  return siguiente >= 0 ? preguntar(salida, pasos, siguiente, ahora) : finalizar(salida, ahora);
}

/** Opciones activas: solo las del último globo del bot que las ofreció. */
export function opcionesVigentes(estado: Estado) {
  for (let i = estado.historial.length - 1; i >= 0; i--) {
    const m = estado.historial[i];
    if (m.rol === "cliente") return [];
    if (m.opciones && m.opciones.length > 0) return m.opciones;
  }
  return [];
}

/** Sugerencias y clip: lo que el guion está esperando ahora mismo. */
export function esperaAhora(estado: Estado): {
  sugerencias: string[];
  adjunto: Adjunto["tipo"] | null;
} {
  for (let i = estado.historial.length - 1; i >= 0; i--) {
    const m = estado.historial[i];
    if (m.rol === "cliente") break;
    if (m.sugerencias || m.esperaAdjunto) {
      return { sugerencias: m.sugerencias ?? [], adjunto: m.esperaAdjunto ?? null };
    }
  }
  return { sugerencias: [], adjunto: null };
}
