import { NextResponse } from "next/server";

const BASE = process.env.API_URL_INTERNA ?? "http://localhost:8080";

/**
 * BFF de login: pide el token a `nucleo` y lo guarda en una cookie httpOnly.
 * El token nunca queda accesible al JavaScript del navegador.
 */
export async function POST(req: Request) {
  const cuerpo = await req.json();

  let res: Response;
  try {
    res = await fetch(`${BASE}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo),
    });
  } catch {
    return NextResponse.json({ error: "Sin conexión con la API" }, { status: 503 });
  }

  if (!res.ok) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const datos = await res.json();
  const respuesta = NextResponse.json({ nombre: datos.nombre, rol: datos.rol });
  respuesta.cookies.set("sesion", datos.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    // Solo viaja en las rutas del panel, nunca en las de la landing.
    path: "/admin",
    maxAge: datos.expiraEnMinutos * 60,
  });
  return respuesta;
}
