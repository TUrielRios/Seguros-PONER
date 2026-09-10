/**
 * Trazos dibujados a mano que se reutilizan en toda la página.
 * Todos usan `currentColor` para poder teñirse con clases de Tailwind.
 */

type DoodleProps = {
  className?: string
}

/** Línea ondulada para separar bloques dentro de una sección. */
export function Squiggle({ className = '' }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 200 12"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2 8c8-7 16 3 24-1s16-8 24-3 16 8 24 3 16-8 24-3 16 8 24 3 16-7 24-2"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Subrayado irregular, como hecho con fibra. */
export function RoughUnderline({ className = '' }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 220 14"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
      className={className}
    >
      <path
        d="M4 9.5c36-4 74-6 120-5.5 34 .4 60 2.5 92 5"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M14 12.5c40-2.6 82-3.6 128-3 26 .4 48 1.4 66 2.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  )
}

/** Óvalo trazado a mano, para "encerrar" una palabra. */
export function HandCircle({ className = '' }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 240 90"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
      className={className}
    >
      <path
        d="M133 6C71 3 12 19 7 46c-5 27 55 40 116 38 52-2 108-16 110-40C235 20 186 8 132 6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Flecha curva para señalar un elemento. */
export function CurvyArrow({ className = '' }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 90 70"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M6 6c26 4 46 18 56 38 3 6 5 12 6 18"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path
        d="M54 54c6 5 11 8 14 9 1-5 2-11 5-17"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Destello / chispa. */
export function Sparkle({ className = '' }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M16 2c1.5 8 6 12.5 14 14-8 1.5-12.5 6-14 14-1.5-8-6-12.5-14-14C10 14.5 14.5 10 16 2Z"
        fill="currentColor"
      />
    </svg>
  )
}

/** Tilde de lista, trazada a mano. */
export function HandCheck({ className = '' }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 26 22"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3 12c3 1.5 5.5 4 7.5 7C13 12 17 6 23 2"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Borde de papel rasgado. Se apoya sobre el borde inferior de una sección
 * y se pinta con el color de la sección siguiente (`text-*`).
 */
export function TornEdge({
  className = '',
  flip = false,
}: DoodleProps & { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1200 34"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
      className={className}
      style={flip ? { transform: 'scaleY(-1)' } : undefined}
    >
      <path
        d="M0 34V13q42-11 80-3t74 4 76-9 78 5 74 6 78-11 76 2 74 8 76-8 78-4 74 9 72-4 70 2v34Z"
        fill="currentColor"
      />
    </svg>
  )
}

/** Chinche / alfiler para las notas prendidas. */
export function Pin({ className = '' }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 24 28"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="9" r="7" fill="currentColor" />
      <circle cx="9.5" cy="6.5" r="2.2" fill="#fff" opacity="0.55" />
      <path
        d="M12 16v10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
