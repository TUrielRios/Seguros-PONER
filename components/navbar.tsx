"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Phone } from "lucide-react"
import { RoughUnderline, Squiggle } from "@/components/doodles"

const navLinks = [
  { label: "Coberturas", href: "#coberturas" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Cómo trabajamos", href: "#proceso" },
  { label: "Clientes", href: "#testimonios" },
  { label: "Contacto", href: "#contacto" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 bg-paper/95 backdrop-blur-sm transition-shadow duration-300 ${scrolled ? "shadow-[0_6px_24px_-12px_rgba(44,34,26,0.45)]" : ""
        }`}
    >
      <div className="mx-auto flex h-[76px] max-w-6xl items-center justify-between gap-6 px-5 md:h-[92px] md:px-8">
        <a href="#" className="flex shrink-0 items-center gap-3">
          <Image
            src="/logo-new.png"
            alt="Poner Seguros"
            width={220}
            height={60}
            className="h-11 w-auto mix-blend-multiply md:h-14"
            priority
          />
          <span className="hidden text-hand text-lg leading-none text-ink-faint xl:block">
            desde hace más de 15 años
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative whitespace-nowrap px-2.5 py-2 text-[15px] font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
              <RoughUnderline className="absolute inset-x-2 -bottom-0.5 h-2 scale-x-0 text-brand opacity-0 transition-all duration-200 group-hover:scale-x-100 group-hover:opacity-100" />
            </a>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          <a
            href="tel:+541135963691"
            className="hidden items-center gap-2 text-sm font-medium text-ink-soft transition-colors hover:text-brand xl:flex"
          >
            <Phone className="size-4" />
            11 3596-3691
          </a>
          <a
            href="#contacto"
            className="btn-stamp wobble-a px-5 py-2.5 text-sm"
          >
            Pedir presupuesto
          </a>
        </div>

        {mounted ? (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <button
                type="button"
                aria-label="Abrir menú"
                className="card-paper-soft wobble-a flex size-11 items-center justify-center text-ink"
              >
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[85vw] max-w-xs items-start gap-0 border-l-2 border-ink bg-paper p-7"
            >
              <SheetTitle className="sr-only">Menú</SheetTitle>
              <Image
                src="/logo-new.png"
                alt="Poner Seguros"
                width={140}
                height={38}
                className="h-9 w-auto mix-blend-multiply"
              />
              <Squiggle className="mt-5 h-3 w-32 text-ochre" />

              <ul className="mt-6 flex flex-col gap-5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="text-display text-2xl font-semibold text-ink transition-colors hover:text-brand"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>

              <a
                href="#contacto"
                onClick={() => setOpen(false)}
                className="btn-stamp wobble-a mt-8 w-full px-5 py-3 text-sm"
              >
                Pedir presupuesto
              </a>
              <a
                href="tel:+541135963691"
                className="mt-5 flex items-center gap-2 text-sm font-medium text-ink-soft"
              >
                <Phone className="size-4" />
                11 3596-3691
              </a>
            </SheetContent>
          </Sheet>
        ) : (
          <span className="card-paper-soft wobble-a flex size-11 items-center justify-center text-ink lg:hidden">
            <Menu className="size-5" />
          </span>
        )}
      </div>

      {/* Borde inferior cosido a mano */}
      <div className="h-0.5 w-full bg-[repeating-linear-gradient(to_right,var(--ink)_0_10px,transparent_10px_18px)] opacity-25" />
    </header>
  )
}
