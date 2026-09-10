import { ArrowRight, Phone } from "lucide-react"
import { Sparkle, TornEdge } from "@/components/doodles"

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 md:py-28">
      <TornEdge
        flip
        className="absolute inset-x-0 top-0 block h-6 w-full text-paper-warm md:h-8"
      />
      <TornEdge className="absolute inset-x-0 bottom-0 block h-6 w-full text-paper md:h-8" />

      <div className="relative mx-auto max-w-3xl px-5 text-center md:px-8">
        <div className="stitch tilt-xs rounded-sm border-paper/25 px-6 py-12 sm:px-12">
          <span className="text-hand text-2xl text-ochre">
            dale, no muerde
          </span>

          <h2 className="mt-3 text-balance text-4xl font-semibold leading-tight text-paper md:text-5xl">
            Pedinos un presupuesto y fijate
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-pretty text-lg leading-relaxed text-paper/70">
            Completar el formulario lleva menos de un minuto. Del resto nos
            ocupamos nosotros, sin compromiso y sin llamados insistentes.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#contacto"
              className="btn-stamp wobble-a border-paper bg-ochre px-7 py-3.5 text-base text-ink shadow-[4px_4px_0_0_var(--paper)] hover:bg-[#e8b350]"
            >
              Quiero mi presupuesto
              <ArrowRight className="size-4" />
            </a>

            <a
              href="tel:+541135963691"
              className="inline-flex items-center gap-2 border-b-2 border-paper/30 pb-1 font-medium text-paper/85 transition-colors hover:border-ochre hover:text-ochre"
            >
              <Phone className="size-4" />
              o llamanos al 11 3596-3691
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-paper/40">
            <Sparkle className="size-3" />
            <span className="text-sm">
              Lunes a viernes, de 9 a 18 h
            </span>
            <Sparkle className="size-3" />
          </div>
        </div>
      </div>
    </section>
  )
}
