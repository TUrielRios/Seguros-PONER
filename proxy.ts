import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// El panel de gestión vive en /admin. La landing no pasa por acá.
const PUBLICAS = ["/admin/login", "/admin/api/login"]

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (PUBLICAS.some((p) => pathname.startsWith(p))) return NextResponse.next()

  if (!req.cookies.get("sesion")) {
    const url = req.nextUrl.clone()
    url.pathname = "/admin/login"
    url.search = ""
    url.searchParams.set("volver", pathname)
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
