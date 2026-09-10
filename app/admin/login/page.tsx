"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Isotipo, Logotipo } from "@panel/components/Marca";

// useSearchParams() obliga a renderizar del lado del cliente. Sin el Suspense
// que lo envuelve, el build falla al prerenderizar esta página.
export default function Login() {
  return (
    <Suspense>
      <FormularioLogin />
    </Suspense>
  );
}

function FormularioLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCargando(true);
    setError(null);

    const datos = new FormData(e.currentTarget);
    const res = await fetch("/admin/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: datos.get("email"),
        password: datos.get("password"),
      }),
    });

    setCargando(false);
    if (res.ok) {
      // Solo se vuelve a pantallas del panel: `volver` viene de la URL y no se
      // puede usar para mandar a nadie a otro sitio.
      const volver = params.get("volver");
      router.push(volver?.startsWith("/admin") ? volver : "/admin");
      router.refresh();
    } else if (res.status === 503) {
      setError("No hay conexión con el servidor de la agencia. Probá de nuevo en un rato.");
    } else {
      setError("Email o contraseña incorrectos");
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* Panel de marca. En pantallas chicas se reduce a una franja. */}
      <div className="relative flex flex-col justify-between overflow-hidden bg-[var(--color-marca)] px-8 py-10 text-white lg:px-14 lg:py-14">
        <Logotipo tono="claro" />

        <div className="relative z-10 hidden lg:block">
          <p className="max-w-md text-3xl font-semibold leading-tight tracking-tight">
            Toda la cartera en un solo lugar.
          </p>
          <p className="mt-4 max-w-md text-white/75">
            Pólizas, vencimientos, siniestralidad y avisos, sobre los mismos datos
            y actualizados todos los días.
          </p>
        </div>

        <p className="relative z-10 hidden text-xs text-white/60 lg:block">
          Uso interno · Agencia 5980
        </p>

        {/* El isotipo enorme y muy tenue hace de textura, sin robar contraste. */}
        <Isotipo
          className="pointer-events-none absolute -bottom-24 -right-24 h-[26rem] w-[26rem] text-white/8"
          aria-hidden="true"
        />
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <form onSubmit={enviar} className="w-full max-w-sm">
          <h1 className="text-xl font-semibold tracking-tight">Ingresar</h1>
          <p className="mt-1 mb-8 text-sm text-[var(--color-tenue)]">
            Entrá con tu cuenta de la agencia.
          </p>

          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="username"
            className="mt-1.5 w-full rounded-lg border border-[var(--color-borde-fuerte)] bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-marca)]"
          />

          <label htmlFor="password" className="mt-5 block text-sm font-medium">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-1.5 w-full rounded-lg border border-[var(--color-borde-fuerte)] bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-marca)]"
          />

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-lg bg-[var(--color-marca-humo)] px-3 py-2 text-sm text-[var(--color-marca-tinta)] ring-1 ring-inset ring-[var(--color-marca-borde)]"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="mt-7 w-full rounded-lg bg-[var(--color-marca-accion)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-marca-tinta)] disabled:opacity-60"
          >
            {cargando ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
