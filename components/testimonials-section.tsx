import { Star, Quote } from "lucide-react"

const testimonios = [
  {
    name: "Maria Gonzalez",
    role: "Clienta desde 2018",
    comment:
      "Excelente atención y muy buenas opciones. Me ayudaron a encontrar el seguro ideal para mi auto y mi hogar. Siempre disponibles ante cualquier consulta.",
    rating: 5,
  },
  {
    name: "Carlos Rodriguez",
    role: "Empresa PyME",
    comment:
      "Contratamos el seguro de la empresa y el ART con ellos. El asesoramiento fue impecable y los precios muy competitivos. Recomendados al 100%.",
    rating: 5,
  },
  {
    name: "Laura Martinez",
    role: "Clienta desde 2020",
    comment:
      "Tuve un siniestro con mi auto y me acompañaron en todo el proceso. La gestión fue rápida y transparente. No dudé en renovar cada año.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonios" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Testimonios
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Lo que dicen nuestros clientes
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
            La satisfacción de nuestros clientes es nuestro mayor orgullo.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonios.map((testimonio) => (
            <div
              key={testimonio.name}
              className="relative rounded-2xl border border-border bg-background p-8 transition-shadow hover:shadow-lg"
            >
              <Quote className="absolute top-6 right-6 size-8 text-primary/10" />

              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonio.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-primary text-primary"
                  />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {`"${testimonio.comment}"`}
              </p>

              <div className="mt-6 border-t border-border pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {testimonio.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {testimonio.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {testimonio.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
