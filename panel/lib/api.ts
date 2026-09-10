/**
 * Cliente de la API para server components.
 *
 * El JWT vive en una cookie httpOnly: el JavaScript del navegador no lo ve
 * nunca. Las llamadas salen del servidor de Next hacia `nucleo` por la red
 * interna de Docker.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BASE = process.env.API_URL_INTERNA ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export class ErrorApi extends Error {
  constructor(public estado: number, mensaje: string) {
    super(mensaje);
  }
}

export async function api<T>(ruta: string, init: RequestInit = {}): Promise<T> {
  const token = (await cookies()).get("sesion")?.value;

  let res: Response;
  try {
    res = await fetch(`${BASE}${ruta}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init.headers,
      },
      cache: "no-store",
    });
  } catch {
    // `nucleo` apagado. Sin esto sube un "TypeError: fetch failed" pelado, que
    // no le dice a nadie que lo único que falta es arrancar el backend.
    throw new ErrorApi(503, `No hay respuesta de la API en ${BASE}.`);
  }

  if (res.status === 401) redirect("/admin/login");

  if (!res.ok) {
    let detalle = res.statusText;
    try {
      const problema = await res.json();
      detalle = problema.detail ?? problema.title ?? detalle;
    } catch {
      /* la respuesta no era JSON */
    }
    throw new ErrorApi(res.status, detalle);
  }

  return res.json() as Promise<T>;
}

// ─────────────── Tipos del dominio ───────────────
// Cuando el backend esté corriendo: `npm run tipos` los genera desde el OpenAPI.

export type Pagina<T> = {
  contenido: T[];
  pagina: number;
  tamanio: number;
  total: number;
  totalPaginas: number;
};

export type ResultadoCartera = {
  polizaId: number;
  numero: string;
  clienteId: number;
  cliente: string;
  documento: string | null;
  compania: string;
  ramo: string;
  patentes: string | null;
  vigenciaDesde: string;
  vigenciaHasta: string;
  diasHastaVencimiento: number;
  prima: string | null;
  premio: string | null;
  estado: string;
  cuotasImpagas: number;
  siniestrosAbiertos: number;
};

export type FichaCliente = {
  id: number;
  tipoPersona: string;
  denominacion: string;
  cuit: string | null;
  dni: string | null;
  email: string | null;
  telefono: string | null;
  whatsappOptIn: boolean;
  direccion: string | null;
  localidad: string | null;
  provincia: string | null;
  fechaAlta: string | null;
  estado: string;
  asesor: string | null;
  driveCarpetaId: string | null;
  resumen: {
    polizasVigentes: number;
    polizasTotales: number;
    primaAnualVigente: string;
    cuotasImpagas: number;
    deudaTotal: string;
    siniestrosAbiertos: number;
    proximoVencimiento: string | null;
    antiguedadAnios: number | null;
  };
  polizas: {
    id: number;
    numero: string;
    compania: string;
    ramo: string;
    detalle: string | null;
    vigenciaDesde: string;
    vigenciaHasta: string;
    diasHastaVencimiento: number;
    prima: string | null;
    estado: string;
    cuotasImpagas: number;
    siniestrosAbiertos: number;
  }[];
};

export type Catalogos = {
  companias: { id: number; nombre: string }[];
  ramos: { id: number; codigo: string; nombre: string; familia: string }[];
  asesores: { id: number; nombre: string }[];
  estados: string[];
};

export type RenovacionPendiente = {
  poliza_id: number;
  numero: string;
  cliente_id: number;
  cliente: string;
  telefono: string | null;
  opt_in: boolean;
  compania: string;
  ramo: string;
  vigencia_hasta: string;
  dias: number;
  prima: string | null;
  cuotas_impagas: number;
  ultimo_hito: string | null;
  ultimo_estado: string | null;
};

export type AvisoFila = {
  id: number;
  tipo: string;
  hito: string | null;
  plantilla: string;
  estado: string;
  motivo_supresion: string | null;
  programado_para: string;
  enviado_en: string | null;
  intentos: number;
  ultimo_error: string | null;
  parametros: Record<string, unknown>;
  clave_unicidad: string;
  cliente_id: number;
  cliente: string;
  telefono: string | null;
  opt_in: boolean;
};

export type CasoRevision = {
  id: number;
  motivo: string;
  campos_dudosos: string[];
  prioridad: number;
  creado_en: string;
  extraccion_id: number;
  confianza: string;
  motor: string;
  payload: Record<string, unknown>;
  confianza_campos: Record<string, number>;
  validaciones: string[];
  documento_id: number;
  nombre_archivo: string;
  tipo_detectado: string | null;
  origen: string;
  ruta: string | null;
  drive_file_id: string | null;
  paginas: number | null;
  tiene_texto: boolean | null;
};

export type DetalleRevision = CasoRevision & {
  estado: string;
  textoDocumento: string;
};

export type EstadoIngesta = {
  porEstado: { estado: string; cantidad: number; escaneados: number }[];
  porTipo: { tipo: string; cantidad: number }[];
  calidadExtraccion: {
    motor: string;
    extracciones: number;
    confianza_media: string | null;
    sobre_umbral: number;
  }[];
  pendientesRevision: number;
  analitica: Record<string, unknown>;
};

export type FilaMes = {
  mes: string;
  prima_devengada: string | null;
  expuestos: string | null;
  siniestros: number;
  incurrido: string | null;
  pagado: string | null;
  reserva_pendiente: string | null;
  loss_ratio_pct: string | null;
  frecuencia: string | null;
  severidad_media: string | null;
};

export type FilaRamo = {
  codigo: string;
  ramo: string;
  prima_devengada: string | null;
  incurrido: string | null;
  siniestros: number;
  expuestos: string | null;
  polizas: number;
  loss_ratio_pct: string | null;
  frecuencia: string | null;
  severidad_media: string | null;
};

export type TableroCompanias = {
  companias: {
    compania: string;
    prima_devengada: string | null;
    incurrido: string | null;
    siniestros: number;
    loss_ratio_pct: string | null;
    participacion_pct: string | null;
  }[];
  hhi: number;
  interpretacionHhi: string;
};

export type FilaRetencion = {
  mes: string;
  vencidas: number;
  renovadas: number;
  tasa_renovacion_pct: string | null;
  retencion_prima_pct: string | null;
};

export type Frescura = {
  vista: string;
  refrescado_en: string;
  duracion_ms: number;
  filas: number;
};
