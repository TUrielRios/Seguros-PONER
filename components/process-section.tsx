import { MessageSquare, Search, Send, ShieldCheck } from "lucide-react"
import { CurvyArrow, Squiggle } from "@/components/doodles"

const pasos = [
  {
    step: 1,
    icon: MessageSquare,
    title: "Nos contás qué necesitás",
    description:
      "Por teléfono, por WhatsApp o con el formulario. Contanos tu situación como te salga, ya vamos a ordenarla nosotros.",
  },
  {
    step: 2,
    icon: Search,
    title: "Lo miramos con lupa",
    description:
      "Evaluamos tus necesidades y comparamos opciones entre las mejores compañías aseguradoras del país.",
  },
  {
    step: 3,
    icon: Send,
    title: "Te pasamos la mejor opción",
    description:
      "Una propuesta clara, en criollo y sin compromiso. Si algo no se entiende, te lo explicamos las veces que haga falta.",
  },
  {
    step: 4,
    icon: ShieldCheck,
    title: "Quedás cubierto",
    description:
      "Cuando elegís, activamos la póliza enseguida. Y quedamos nosotros como tu contacto para lo que venga.",
  },
]

export function ProcessSection() {
  return (
    <section
      id="proceso"
      className="scroll-mt-[84px] bg-paper py-20 md:scroll-mt-[104px] md:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="eyebrow-hand">cómo trabajamos</span>
          <h2 className="mt-2 text-balance text-4xl font-semibold text-ink md:text-5xl">
            Cuatro pasos, ni uno más
          </h2>
          <Squiggle className="mx-auto mt-5 h-3 w-32 text-ochre" />
        </div>

        {/* Hoja de cuaderno */}
        <div className="card-paper paper-lined tilt-xs relative mx-auto max-w-3xl rounded-sm py-10 pl-16 pr-7 sm:pl-24 sm:pr-12">
          {/* Margen rojo del cuaderno */}
          <div className="absolute inset-y-0 left-10 w-px bg-brand/35 sm:left-16" />

          {/* Perforaciones */}
          <div className="absolute inset-y-0 left-4 flex flex-col justify-evenly py-12 sm:left-6">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-3.5 rounded-full border border-line bg-paper-deep"
              />
            ))}
          </div>

          <ol className="flex flex-col gap-9">
            {pasos.map((paso) => (
              <li key={paso.step} className="flex items-start gap-5">
                <span className="text-hand -mt-2 w-8 shrink-0 text-4xl leading-none text-brand">
                  {paso.step}.
                </span>
                <div className="min-w-0">
                  <h3 className="flex items-center gap-2 text-xl font-semibold text-ink">
                    <paso.icon className="size-5 shrink-0 text-olive" />
                    {paso.title}
                  </h3>
                  <p className="mt-1.5 text-pretty leading-relaxed text-ink-soft">
                    {paso.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl items-start justify-center gap-2 pr-6 sm:justify-end">
          <span className="text-hand mt-4 text-xl text-ink-faint">
            en general, el mismo día ya tenés respuesta
          </span>
          <CurvyArrow className="h-10 w-10 rotate-[190deg] text-ochre" />
        </div>
      </div>
    </section>
  )
}
