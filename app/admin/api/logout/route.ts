import { NextResponse } from "next/server";

// Lo llama el <form method="post"> de la barra lateral: tiene que devolver una
// navegación, no un JSON que el navegador mostraría tal cual.
export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/admin/login", req.url), 303);
  res.cookies.set("sesion", "", { path: "/admin", maxAge: 0 });
  return res;
}
