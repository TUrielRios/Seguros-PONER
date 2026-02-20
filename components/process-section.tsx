import { MessageSquare, Search, Send, ShieldCheck } from "lucide-react"

const pasos = [
  {
    step: 1,
    icon: MessageSquare,
    title: "Nos contás qué necesitás",
    description:
      "Comunicate con nosotros por teléfono, WhatsApp o completando el formulario. Contanos tu situación.",
  },
  {
    step: 2,
    icon: Search,
    title: "Analizamos tu caso",
    description:
      "Evaluamos tus necesidades y comparamos opciones entre las mejores compañías aseguradoras.",
  },
  {
    step: 3,
    icon: Send,
    title: "Te enviamos la mejor opción",
    description:
      "Recibís una propuesta clara y detallada, sin compromiso y totalmente adaptada a tu perfil.",
  },
  {
    step: 4,
    icon: ShieldCheck,
    title: "Activamos tu cobertura",
    description:
      "Una vez que elegís, activamos tu póliza de forma inmediata. Quedás protegido al instante.",
  },
]

export function ProcessSection() {
  return (
    <section id="proceso" className="bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Cómo funciona
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Contratar es simple
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
            En solo cuatro pasos podés tener tu cobertura activa. Nosotros nos
            encargamos de todo.
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl">
          {/* Vertical line connector - desktop */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-border lg:block" />

          <div className="grid gap-8 lg:gap-0">
            {pasos.map((paso, i) => (
              <div
                key={paso.step}
                className={`relative flex flex-col items-center gap-6 lg:flex-row ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
              >
                {/* Content */}
                <div
                  className={`flex-1 ${i % 2 === 0 ? "lg:text-right lg:pr-12" : "lg:text-left lg:pl-12"
                    }`}
                >
                  <div
                    className={`rounded-2xl bg-background p-8 shadow-sm ${i % 2 === 0 ? "lg:ml-auto" : "lg:mr-auto"
                      } max-w-md`}
                  >
                    <div className="mb-4 inline-flex size-10 items-center justify-center rounded-full bg-primary/10 lg:hidden">
                      <paso.icon className="size-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {paso.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground leading-relaxed">
                      {paso.description}
                    </p>
                  </div>
                </div>

                {/* Circle indicator - desktop */}
                <div className="relative z-10 hidden lg:flex">
                  <div className="flex size-14 items-center justify-center rounded-full border-4 border-background bg-primary shadow-lg">
                    <paso.icon className="size-6 text-primary-foreground" />
                  </div>
                </div>

                {/* Spacer for the other side */}
                <div className="hidden flex-1 lg:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
