/**
 * Identidad de PONER.
 *
 * El isotipo se dibuja en SVG y no se importa como imagen: así toma el color
 * del contexto (rojo sobre blanco en el login, blanco sobre rojo en la barra
 * lateral) sin mantener dos archivos, y queda nítido en cualquier pantalla.
 */

export function Isotipo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {/* Punta de flecha hacia la izquierda */}
      <path d="M22 4 L22 60 L1 32 Z" />
      {/* La P: asta, hombro y el corte diagonal del contorno */}
      <path d="M30 4 H44 a15 15 0 0 1 0 30 H41 v26 H30 Z M41 13 v12 h3 a6 6 0 0 0 0-12 Z" />
      <path d="M63 26 c0 16 -12 24 -22 26 v-8 c8 -2 17 -8 22 -18 Z" />
    </svg>
  );
}

export function Logotipo({
  className = "",
  tono = "marca",
}: {
  className?: string;
  tono?: "marca" | "claro";
}) {
  const color = tono === "claro" ? "text-white" : "text-[var(--color-marca)]";
  return (
    <span className={`flex items-center gap-2.5 ${color} ${className}`}>
      <Isotipo className="h-7 w-7 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="text-[1.0625rem] font-extrabold tracking-tight">PONER</span>
        <span
          className={`mt-0.5 text-[0.5rem] font-semibold tracking-[0.16em] ${
            tono === "claro" ? "text-white/70" : "text-[var(--color-tenue)]"
          }`}
        >
          AGENCIA DE SEGUROS
        </span>
      </span>
    </span>
  );
}
