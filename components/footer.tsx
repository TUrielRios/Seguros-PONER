import Image from "next/image"
import { TornEdge } from "@/components/doodles"

const quickLinks = [
  { label: "Coberturas", href: "#coberturas" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Cómo trabajamos", href: "#proceso" },
  { label: "Clientes", href: "#testimonios" },
  { label: "Contacto", href: "#contacto" },
]

const coberturas = [
  "Automotor",
  "Hogar",
  "Salud / Vida",
  "Empresas",
  "ART",
  "Riesgos especiales",
]

export function Footer() {
  return (
    <footer className="relative bg-ink text-paper">
      <TornEdge
        flip
        className="absolute inset-x-0 top-0 block h-6 w-full text-paper md:h-8"
      />

      <div className="mx-auto max-w-6xl px-5 pb-28 pt-24 md:px-8 md:pb-10 md:pt-28">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div>
            <span className="inline-block -rotate-2 bg-paper px-4 py-3">
              <Image
                src="/logo-new.png"
                alt="Poner Seguros"
                width={160}
                height={44}
                className="h-9 w-auto mix-blend-multiply"
              />
            </span>
            <p className="mt-5 text-sm leading-relaxed text-paper/60">
              Tu agencia de seguros de confianza. Asesoramiento personalizado
              para personas y empresas en toda Argentina.
            </p>
            <p className="text-hand mt-4 text-xl text-ochre">
              gracias por pasar
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="text-hand text-2xl text-paper/80">Secciones</h4>
            <ul className="mt-4 flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-paper/60 transition-colors hover:text-ochre"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Coberturas */}
          <div>
            <h4 className="text-hand text-2xl text-paper/80">Coberturas</h4>
            <ul className="mt-4 flex flex-col gap-3">
              {coberturas.map((item) => (
                <li key={item}>
                  <a
                    href="#coberturas"
                    className="text-sm text-paper/60 transition-colors hover:text-ochre"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-hand text-2xl text-paper/80">Contacto</h4>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-paper/60">
              <li>
                <a
                  href="mailto:info@poner.com.ar"
                  className="transition-colors hover:text-ochre"
                >
                  info@poner.com.ar
                </a>
              </li>
              <li>
                <a
                  href="tel:+541135963691"
                  className="transition-colors hover:text-ochre"
                >
                  11 3596-3691
                </a>
              </li>
              <li>Buenos Aires, Argentina</li>
              <li>Lunes a viernes, de 9 a 18 h</li>
            </ul>
          </div>
        </div>

        {/* Separador cosido */}
        <div className="my-10 h-px w-full bg-[repeating-linear-gradient(to_right,var(--paper)_0_12px,transparent_12px_22px)] opacity-25" />

        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row">
          <p className="text-sm text-paper/40">
            {`© ${new Date().getFullYear()} Poner Seguros. Hecho con paciencia en Buenos Aires.`}
          </p>
          <div className="flex gap-6 text-sm text-paper/40">
            <a href="#" className="transition-colors hover:text-paper">
              Política de privacidad
            </a>
            <a href="#" className="transition-colors hover:text-paper">
              Términos y condiciones
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
