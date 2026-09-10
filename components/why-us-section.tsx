import { HeartHandshake, Coffee, PhoneCall } from "lucide-react"
import { Pin, Squiggle } from "@/components/doodles"

const valores = [
  {
    icon: HeartHandshake,
    title: "Confianza que se gana",
    description:
      "Más de 15 años respaldando a familias y empresas con las mejores coberturas del mercado. Muchos clientes llegaron recomendados por otro cliente.",
    tilt: "tilt-l",
    color: "text-brand",
  },
  {
    icon: Coffee,
    title: "Te atendemos por tu nombre",
    description:
      "Cada caso es distinto. Nos sentamos a mirar tu situación real y te recomendamos la cobertura que te sirve, no la más cara.",
    tilt: "tilt-r",
    color: "text-olive",
  },
  {
    icon: PhoneCall,
    title: "Estamos cuando pasa algo",
    description:
      "Ante un siniestro o una duda, atendemos nosotros. Te acompañamos en el trámite hasta que se resuelve.",
    tilt: "tilt-xs",
    color: "text-ochre",
  },
]

export function WhyUsSection() {
  return (
    <section className="paper-grid bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="eyebrow-hand">por qué nosotros</span>
          <h2 className="mt-2 text-balance text-4xl font-semibold text-ink md:text-5xl">
            Somos de los que atienden el teléfono
          </h2>
          <Squiggle className="mx-auto mt-5 h-3 w-32 text-ochre" />
        </div>

        <div className="grid gap-x-8 gap-y-14 md:grid-cols-3">
          {valores.map((valor) => (
            <article
              key={valor.title}
              className={`card-paper-soft straighten ${valor.tilt} relative rounded-sm px-7 pb-8 pt-12 text-center`}
            >
              <Pin className="absolute -top-4 left-1/2 h-9 w-8 -translate-x-1/2 text-brand" />

              <span
                className={`mx-auto flex size-16 items-center justify-center rounded-full border-2 border-ink bg-paper-warm ${valor.color}`}
              >
                <valor.icon className="size-7" />
              </span>

              <h3 className="mt-5 text-xl font-semibold text-ink">
                {valor.title}
              </h3>
              <p className="mt-3 text-pretty leading-relaxed text-ink-soft">
                {valor.description}
              </p>
            </article>
          ))}
        </div>

        <p className="text-hand mx-auto mt-16 max-w-md -rotate-1 text-center text-2xl leading-snug text-ink-faint">
          &laquo;Si te podemos ahorrar una vuelta, te la ahorramos.&raquo;
        </p>
      </div>
    </section>
  )
}
