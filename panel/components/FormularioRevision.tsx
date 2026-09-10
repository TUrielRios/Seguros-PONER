"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

/**
 * Formulario de revisión.
 *
 * El objetivo de diseño es el tiempo: si revisar un documento lleva más de
 * ~20 segundos, la cola nunca se vacía y la ingesta masiva fracasa. De ahí
 * los atajos de teclado, el foco automático en el primer campo dudoso y el
 * resaltado del valor dentro del texto del documento.
 */

const CAMPOS: { clave: string; etiqueta: string; tipo?: string; ancho?: string }[] = [
  { clave: "numero_poliza", etiqueta: "N° de póliza" },
  { clave: "compania", etiqueta: "Compañía" },
  { clave: "ramo", etiqueta: "Ramo" },
  { clave: "asegurado", etiqueta: "Asegurado", ancho: "col-span-2" },
  { clave: "cuit", etiqueta: "CUIT" },
  { clave: "dni", etiqueta: "DNI" },
  { clave: "vigencia_desde", etiqueta: "Vigencia desde", tipo: "date" },
  { clave: "vigencia_hasta", etiqueta: "Vigencia hasta", tipo: "date" },
  { clave: "prima", etiqueta: "Prima" },
  { clave: "premio", etiqueta: "Premio" },
  { clave: "suma_asegurada", etiqueta: "Suma asegurada" },
  { clave: "cantidad_cuotas", etiqueta: "Cuotas" },
  { clave: "patente", etiqueta: "Patente" },
  { clave: "marca", etiqueta: "Marca" },
  { clave: "modelo", etiqueta: "Modelo" },
  { clave: "anio_vehiculo", etiqueta: "Año" },
  { clave: "cobertura", etiqueta: "Cobertura", ancho: "col-span-2" },
];

const OBLIGATORIOS = new Set(["numero_poliza", "compania", "vigencia_desde", "vigencia_hasta"]);

export function FormularioRevision({
  revisionId,
  payload,
  confianzaCampos,
  camposDudosos,
  onFocoCampo,
}: {
  revisionId: number;
  payload: Record<string, unknown>;
  confianzaCampos: Record<string, number>;
  camposDudosos: string[];
  onFocoCampo?: (valor: string) => void;
}) {
  const router = useRouter();
  const [valores, setValores] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      CAMPOS.map((c) => [c.clave, payload[c.clave] == null ? "" : String(payload[c.clave])]),
    ),
  );
  const [enviando, setEnviando] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dudosos = useMemo(() => new Set(camposDudosos), [camposDudosos]);

  const faltanObligatorios = CAMPOS.filter(
    (c) => OBLIGATORIOS.has(c.clave) && !valores[c.clave]?.trim(),
  ).map((c) => c.etiqueta);

  async function enviar(accion: "aprobar" | "descartar") {
    setEnviando(accion);
    setError(null);

    const limpio = Object.fromEntries(
      Object.entries(valores).filter(([, v]) => v !== null && String(v).trim() !== ""),
    );

    const res = await fetch(`/admin/api/revision/${revisionId}/${accion}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: accion === "aprobar" ? JSON.stringify({ payload: limpio }) : undefined,
    });

    const datos = await res.json().catch(() => ({}));
    setEnviando(null);

    if (!res.ok || datos.aprobado === false) {
      setError(datos.motivoRechazo ?? datos.detail ?? "No se pudo guardar");
      return;
    }
    router.push("/admin/revision");
    router.refresh();
  }

  // Atajos: Ctrl+Enter aprueba, Ctrl+Backspace descarta.
  useEffect(() => {
    function alTeclado(e: KeyboardEvent) {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key === "Enter" && faltanObligatorios.length === 0) {
        e.preventDefault();
        void enviar("aprobar");
      }
      if (e.key === "Backspace") {
        e.preventDefault();
        void enviar("descartar");
      }
    }
    window.addEventListener("keydown", alTeclado);
    return () => window.removeEventListener("keydown", alTeclado);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valores, faltanObligatorios.length]);

  const primerDudoso = CAMPOS.findIndex(
    (c) => dudosos.has(c.clave) || (OBLIGATORIOS.has(c.clave) && !valores[c.clave]),
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {CAMPOS.map((campo, i) => {
          const q = confianzaCampos[campo.clave];
          const esDudoso = dudosos.has(campo.clave);
          const vacioObligatorio = OBLIGATORIOS.has(campo.clave) && !valores[campo.clave]?.trim();

          const borde = vacioObligatorio
            ? "border-[var(--color-alerta)]"
            : esDudoso || (q !== undefined && q < 0.7)
              ? "border-[var(--color-aviso)]"
              : "border-[var(--color-borde)]";

          return (
            <div key={campo.clave} className={campo.ancho ?? ""}>
              <label className="flex items-baseline justify-between text-xs text-[var(--color-tenue)]">
                <span>
                  {campo.etiqueta}
                  {OBLIGATORIOS.has(campo.clave) && (
                    <span className="text-[var(--color-alerta-tinta)]"> *</span>
                  )}
                </span>
                {q !== undefined && (
                  <span className="numero">{(q * 100).toFixed(0)}%</span>
                )}
              </label>
              <input
                autoFocus={i === primerDudoso}
                value={valores[campo.clave] ?? ""}
                onFocus={() => onFocoCampo?.(valores[campo.clave] ?? "")}
                onChange={(e) =>
                  setValores((v) => ({ ...v, [campo.clave]: e.target.value }))
                }
                className={`mt-1 w-full rounded-lg border ${borde} bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-acento)]`}
              />
            </div>
          );
        })}
      </div>

      {faltanObligatorios.length > 0 && (
        <p className="text-xs text-[var(--color-alerta-tinta)]">
          Faltan campos obligatorios: {faltanObligatorios.join(", ")}
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-[var(--color-alerta)]/10 px-3 py-2 text-sm text-[var(--color-alerta-tinta)]">
          {error}
        </p>
      )}

      <div className="flex items-center gap-2 border-t border-[var(--color-borde)] pt-4">
        <button
          onClick={() => enviar("aprobar")}
          disabled={enviando !== null || faltanObligatorios.length > 0}
          className="rounded-lg bg-[var(--color-acento)] px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          {enviando === "aprobar" ? "Guardando…" : "Aprobar y cargar"}
        </button>
        <button
          onClick={() => enviar("descartar")}
          disabled={enviando !== null}
          className="rounded-lg border border-[var(--color-borde)] bg-white px-4 py-2 text-sm disabled:opacity-40"
        >
          Descartar
        </button>
        <span className="ml-auto text-xs text-[var(--color-tenue)]">
          Ctrl+Enter aprueba · Ctrl+Backspace descarta
        </span>
      </div>
    </div>
  );
}
