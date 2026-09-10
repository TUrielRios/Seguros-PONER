import Image from "next/image"
import { ArrowRight, MessageCircle } from "lucide-react"
import { CurvyArrow, Sparkle, Squiggle, TornEdge } from "@/components/doodles"

const notas = [
  "Más de 15 años acompañando familias",
  "Trabajamos con las principales compañías",
  "Te acompañamos también en el siniestro",
]

export function HeroSection() {
  return (
    <section className="paper-grid relative overflow-hidden bg-paper pt-[76px] md:pt-[92px]">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 pt-14 pb-20 md:px-8 md:pt-20 md:pb-28 lg:grid-cols-12 lg:gap-10">
        {/* Texto */}
        <div className="lg:col-span-6">
          <span className="eyebrow-hand text-2xl">
            Agencia de seguros, gente de carne y hueso
          </span>

          <h1 className="mt-3 text-balance text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Protegemos{" "}
            <span className="relative inline-block">
              <span className="marker">lo que más importa</span>
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-pretty text-lg leading-relaxed text-ink-soft">
            Atención de persona a persona: te escuchamos, comparamos entre las
            principales compañías del país y te explicamos la letra chica en
            castellano. Sin vueltas y sin apuro.
          </p>

          <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <a
              href="#contacto"
              className="btn-stamp wobble-a px-7 py-3.5 text-base"
            >
              Quiero mi presupuesto
              <ArrowRight className="size-4" />
            </a>

            <a
              href="https://wa.me/541135963691"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-stamp btn-stamp-ghost wobble-b px-6 py-3.5 text-base"
            >
              <MessageCircle className="size-4" />
              Escribinos por WhatsApp
            </a>
          </div>

          <div className="mt-5 flex items-start gap-3 pl-4">
            <CurvyArrow className="h-11 w-11 shrink-0 rotate-180 text-ochre" />
            <span className="text-hand mt-4 text-xl text-ink-faint">
              te contesta una persona, no un robot
            </span>
          </div>

          {/* Notas de confianza */}
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {notas.map((nota) => (
              <li
                key={nota}
                className="flex items-center gap-2 text-sm font-medium text-ink-soft"
              >
                <Sparkle className="size-3.5 shrink-0 text-brand" />
                {nota}
              </li>
            ))}
          </ul>
        </div>

        {/* Foto pegada con cinta */}
        <div className="relative lg:col-span-6">
          <div className="tape straighten tilt-r relative mx-auto max-w-lg bg-card p-3 pb-14 shadow-[0_18px_40px_-22px_rgba(44,34,26,0.65)] lg:ml-auto lg:mr-0">
            <div className="relative aspect-[3/2] overflow-hidden bg-paper-deep">
              <Image
                src="/hero-concesionaria.png"
                alt="Autos alineados en el playón de una concesionaria"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 520px"
                className="object-cover sepia-[0.12] saturate-[0.92]"
              />
            </div>
            <p className="text-hand absolute inset-x-0 bottom-4 text-center text-xl text-ink-faint">
              todos distintos, todos bien cubiertos
            </p>
          </div>

          {/* Sello circular */}
          <div className="absolute -left-1 top-1/2 flex size-24 -translate-y-1/2 rotate-[-12deg] flex-col items-center justify-center rounded-full border-2 border-brand bg-paper/95 text-center text-brand shadow-sm lg:-left-6">
            <span className="text-display text-2xl font-bold leading-none">
              +15
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest">
              años
            </span>
          </div>
        </div>
      </div>

      <Squiggle className="mx-auto h-4 w-40 text-line" />

      <TornEdge className="mt-8 block h-6 w-full text-paper-warm md:h-8" />
    </section>
  )
}
