import { ShieldCheck, UserCheck, Zap } from "lucide-react"

const valores = [
  {
    icon: ShieldCheck,
    title: "Confianza",
    description:
      "Más de 15 años respaldando a familias y empresas con las mejores coberturas del mercado.",
  },
  {
    icon: UserCheck,
    title: "Atención personalizada",
    description:
      "Cada cliente es único. Analizamos tu situación y te recomendamos la cobertura ideal.",
  },
  {
    icon: Zap,
    title: "Respuesta rápida",
    description:
      "Ante cualquier siniestro o consulta, estamos disponibles para asistirte de forma inmediata.",
  },
]

export function WhyUsSection() {
  return (
    <section className="bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Nuestros valores
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            ¿Por qué elegirnos?
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Nos diferenciamos por un servicio cercano, honesto y comprometido con
            tu tranquilidad.
          </p>
        </div>

        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {valores.map((valor, i) => (
            <div
              key={valor.title}
              className={`flex flex-col items-center text-center gap-4 ${i === 2 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
            >
              <div
                className="flex size-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20 text-primary"
              >
                <valor.icon className="size-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {valor.title}
                </h3>
                <p className="mt-2 text-balance leading-relaxed text-muted-foreground">
                  {valor.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
