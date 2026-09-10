/**
 * Tipos del motor conversacional de *Poné*.
 *
 * El guion es DECLARATIVO a propósito: nodos, pasos y plantillas de texto, sin
 * una sola función adentro. Eso permite tres cosas que importan más adelante:
 *
 *  · se puede serializar y mover a la base o al backend sin reescribirlo;
 *  · un no-programador puede leerlo y corregir la redacción;
 *  · el motor queda puro y testeable — mismo estado + misma entrada, misma salida.
 *
 * El único punto impuro (buscar la póliza en la cartera) sale del motor como un
 * pendiente que resuelve quien lo hospeda: hoy el panel, mañana el webhook.
 */

export type Rol = "bot" | "cliente" | "sistema";

export type TipoAdjunto = "foto" | "pdf" | "ubicacion";

export type Adjunto = { nombre: string; tipo: TipoAdjunto };

/** Texto con marcadores `{{clave}}` que el motor resuelve contra los datos. */
export type Plantilla = string;

export type Opcion = {
  /** Lo que el cliente puede tipear para elegirla: "1", "1A", "2C". */
  id: string;
  texto: string;
  destino: string;
  /** Una opción puede dejar un dato antes de saltar, así varias comparten nodo. */
  define?: { clave: string; valor: string };
};

export type TipoPaso =
  | "texto"
  | "sino"
  | "archivo"
  | "telefono"
  | "identificador";

export type MotivoDerivacion =
  | "siniestro_denunciado"
  | "pedido_del_cliente"
  | "caso_complejo"
  | "cliente_molesto"
  | "sin_resolver"
  | "no_entendi"
  | "emergencia"
  | "dato_faltante";

export type Equipo =
  | "siniestros"
  | "comercial"
  | "administracion"
  | "guardia"
  | "asistencia";

/** Reacción a una respuesta concreta: el "sí" a *¿hay lesionados?* no puede
 *  seguir el guion como si nada. */
export type Alerta = {
  cuando: "si" | "no";
  mensajes: Plantilla[];
  derivar?: MotivoDerivacion;
  equipo?: Equipo;
  /** Corta la recolección y cierra el nodo ahí mismo. */
  detener?: boolean;
};

export type Paso = {
  clave: string;
  pregunta: Plantilla;
  tipo: TipoPaso;
  /** Respuestas frecuentes que el panel muestra como botones. */
  sugerencias?: string[];
  adjuntoEsperado?: TipoAdjunto;
  /** Se saltea si el dato previo no coincide (ej. datos del tercero). */
  condicion?: { clave: string; igual: string };
  alerta?: Alerta;
  opcional?: boolean;
};

export type Consulta =
  | "cobertura"
  | "vigencia"
  | "forma-pago"
  | "vencimiento"
  | "franquicia"
  | "asistencia"
  | "comprobante";

export type Nodo = {
  id: string;
  /** Nombre humano, para el inspector del panel y la traza. */
  titulo: string;
  /** Se emiten al entrar al nodo, un globo por elemento. */
  mensajes?: Plantilla[];
  opciones?: Opcion[];
  pasos?: Paso[];
  /** Antepone el pedido de patente / DNI / nº de póliza si todavía no se identificó. */
  requiereIdentificacion?: boolean;
  consulta?: Consulta;
  /** Se emiten cuando terminó la recolección. */
  cierre?: Plantilla[];
  /** Asigna un número de gestión y lo deja en `{{gestion}}`. */
  generaGestion?: boolean;
  derivar?: MotivoDerivacion;
  equipo?: Equipo;
  /** Relee el relato libre y salta solo al flujo que corresponde. */
  sugerirDestino?: boolean;
  /** A dónde ir al cerrar. Por defecto vuelve al menú. */
  siguiente?: string;
};

export type Mensaje = {
  id: string;
  rol: Rol;
  texto: string;
  hora: string;
  adjunto?: Adjunto;
  /** Botones que acompañaban a ese globo. Los viejos quedan inertes. */
  opciones?: Opcion[];
  /** Sugerencias de respuesta para el paso que abre este globo. */
  sugerencias?: string[];
  /** Pide un archivo: el panel destaca el clip. */
  esperaAdjunto?: TipoAdjunto;
};

export type Poliza = {
  numero: string;
  cliente: string;
  documento: string | null;
  patente: string | null;
  compania: string;
  ramo: string;
  detalle: string | null;
  cobertura: string | null;
  incluye: string[];
  sumaAsegurada: string | null;
  franquicia: string | null;
  formaPago: string | null;
  proximoVencimiento: string | null;
  cuotasImpagas: number;
  vigenciaDesde: string;
  vigenciaHasta: string;
  estado: string;
  /** Teléfono de asistencia de la compañía. */
  asistencia: string | null;
};

export type OrigenPoliza = "cartera" | "demo";

export type Escalada = {
  motivo: MotivoDerivacion;
  equipo: Equipo;
  explicacion: string;
  en: string;
};

export type EventoTraza = {
  en: string;
  nodo: string;
  texto: string;
};

/** Lo único que el motor no puede resolver solo. */
export type Pendiente = { tipo: "buscar-poliza"; texto: string } | null;

export type Estado = {
  nodo: string;
  /** Índice dentro de los pasos del nodo. -1 = todavía no arrancó. */
  paso: number;
  datos: Record<string, string>;
  adjuntos: Adjunto[];
  poliza: Poliza | null;
  origenPoliza: OrigenPoliza | null;
  escalada: Escalada | null;
  /** Consentimiento de avisos, igual que en `operativo.cliente.whatsapp_opt_in`. */
  optIn: boolean;
  gestiones: { id: string; asunto: string }[];
  contadores: {
    sinEntender: number;
    vueltasAlMenu: number;
    mensajesCliente: number;
  };
  historial: Mensaje[];
  traza: EventoTraza[];
  pendiente: Pendiente;
};

export type Entrada =
  | { tipo: "texto"; texto: string }
  | { tipo: "opcion"; id: string }
  | { tipo: "adjunto"; adjunto: Adjunto };
