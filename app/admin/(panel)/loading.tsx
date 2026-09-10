/**
 * Esqueleto mientras carga una pantalla.
 *
 * Cumple dos funciones, y la segunda no es obvia: además de dar respuesta
 * inmediata al navegar, crea el límite de Suspense que React necesita para
 * aislar un fallo del servidor. Sin él, una excepción en un server component
 * se lleva puesto todo el árbol y `error.tsx` nunca llega a renderizarse.
 */
export default function Cargando() {
  return (
    <div className="animate-pulse py-2" aria-label="Cargando" role="status">
      <div className="mb-6 h-7 w-52 rounded-lg bg-black/8" />
      <div className="tarjeta p-5">
        <div className="mb-4 h-4 w-40 rounded bg-black/8" />
        <div className="space-y-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-9 rounded-lg bg-black/5" />
          ))}
        </div>
      </div>
    </div>
  );
}
