"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Phone } from "lucide-react"

const navLinks = [
  { label: "Coberturas", href: "#coberturas" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Proceso", href: "#proceso" },
  { label: "Testimonios", href: "#testimonios" },
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
      className={`fixed top-0 left-0 right-0 z-50 bg-background transition-shadow duration-300 ${scrolled ? "shadow-md" : ""
        }`}
    >
      {/* Top bar with logo */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <a href="#" className="block">
            <Image
              src="/logo-new.png"
              alt="Poner Seguros"
              width={220}
              height={60}
              className="h-12 w-auto md:h-14"
              priority
            />
          </a>

          <div className="hidden items-center gap-5 md:flex">
            <a
              href="tel:+541135963691"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Phone className="size-4" />
              11 3596-3691
            </a>
            <Button asChild size="sm">
              <a href="#contacto">Solicitar cotización</a>
            </Button>
          </div>

          {mounted ? (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="size-5" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 bg-background p-6">
                <div className="mb-8">
                  <Image
                    src="/logo-new.png"
                    alt="Poner Seguros"
                    width={140}
                    height={38}
                    className="h-8 w-auto"
                  />
                </div>
                <ul className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button asChild className="w-full">
                    <a href="#contacto" onClick={() => setOpen(false)}>
                      Solicitar cotización
                    </a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="size-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          )}
        </div>
      </div>

      {/* Navigation links bar */}
      <div className="hidden border-b border-border bg-background md:block">
        <nav className="mx-auto max-w-7xl px-6">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-block px-5 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
