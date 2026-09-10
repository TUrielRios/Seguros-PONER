/**
 * Barra proporcional sin librería de gráficos.
 *
 * Para tablas comparativas alcanza y sobra, y evita sumar una dependencia de
 * charting al bundle. Cuando haga falta algo interactivo (triángulos, curvas),
 * ahí sí conviene traer una librería.
 */
export function Barra({
  valor,
  maximo,
  tono = "acento",
}: {
  valor: number;
  maximo: number;
  tono?: "acento" | "alerta" | "ok" | "aviso";
}) {
  const pct = maximo > 0 ? Math.min(100, (100 * valor) / maximo) : 0;
  return (
    <div className="h-1.5 w-full rounded-full bg-black/5">
      <div
        className="h-1.5 rounded-full"
        style={{ width: `${pct}%`, background: `var(--color-${tono})` }}
      />
    </div>
  );
}

/** Loss ratio con semáforo. Por encima de 70% el ramo deja de ser rentable
 *  para la compañía y eso termina impactando en las condiciones de renovación. */
export function tonoLossRatio(pct: number | null): "ok" | "aviso" | "alerta" {
  if (pct === null) return "ok";
  if (pct >= 90) return "alerta";
  if (pct >= 70) return "aviso";
  return "ok";
}
