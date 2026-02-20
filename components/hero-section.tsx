import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative mt-[104px] overflow-hidden md:mt-[120px]">
      {/* Full-width background image */}
      <div className="relative h-[500px] md:h-[560px]">
        <Image
          src="/hero-bg-new.png"
          alt="Auto en ruta representando la protección de Poner Seguros"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />

        {/* Hero text content - left-aligned like Allianz */}
        <div className="relative mx-auto flex h-full max-w-7xl items-center px-6">
          <div className="max-w-xl">
            <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl lg:leading-tight">
              Protegemos lo que más importa
            </h1>

            <p className="mt-5 max-w-md text-pretty text-lg leading-relaxed text-white/85">
              Asesoramiento personalizado en seguros para personas y empresas.
            </p>

            <div className="mt-8">
              <Button
                asChild
                size="lg"
                className="h-13 px-10 text-base font-semibold uppercase tracking-wide"
              >
                <a href="#contacto">
                  Quiero cotizar
                  <ArrowRight className="ml-2 size-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>


    </section>
  )
}
