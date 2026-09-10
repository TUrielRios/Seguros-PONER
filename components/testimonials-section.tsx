import { Star } from "lucide-react"
import { Squiggle } from "@/components/doodles"

const testimonios = [
  {
    name: "María González",
    role: "Clienta desde 2018",
    comment:
      "Excelente atención y muy buenas opciones. Me ayudaron a encontrar el seguro ideal para mi auto y mi hogar. Siempre disponibles ante cualquier consulta.",
    rating: 5,
    tone: "bg-[#fdf6e3]",
    tilt: "tilt-l",
  },
  {
    name: "Carlos Rodríguez",
    role: "Empresa PyME",
    comment:
      "Contratamos el seguro de la empresa y el ART con ellos. El asesoramiento fue impecable y los precios muy competitivos. Recomendados al 100%.",
    rating: 5,
    tone: "bg-[#f6f2e2]",
    tilt: "tilt-r",
  },
  {
    name: "Laura Martínez",
    role: "Clienta desde 2020",
    comment:
      "Tuve un siniestro con mi auto y me acompañaron en todo el proceso. La gestión fue rápida y transparente. No dudé en renovar cada año.",
    rating: 5,
    tone: "bg-[#fbf3ea]",
    tilt: "tilt-xs",
  },
]

export function TestimonialsSection() {
  return (
    <section
      id="testimonios"
      className="scroll-mt-[84px] bg-paper-warm py-20 md:scroll-mt-[104px] md:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="eyebrow-hand">nos dejaron dicho</span>
          <h2 className="mt-2 text-balance text-4xl font-semibold text-ink md:text-5xl">
            Lo que cuentan nuestros clientes
          </h2>
          <Squiggle className="mx-auto mt-5 h-3 w-32 text-ochre" />
        </div>

        <div className="grid gap-10 md:grid-cols-3 md:gap-6">
          {testimonios.map((testimonio, i) => (
            <figure
              key={testimonio.name}
              className={`tape tape-single straighten ${testimonio.tilt} ${testimonio.tone} relative flex flex-col rounded-sm border border-line px-7 pb-7 pt-9 shadow-[0_14px_30px_-20px_rgba(44,34,26,0.7)] ${i === 1 ? "md:mt-8" : ""
                }`}
            >
              <div className="flex gap-1">
                {Array.from({ length: testimonio.rating }).map((_, s) => (
                  <Star key={s} className="size-4 fill-brand text-brand" />
                ))}
              </div>

              <blockquote className="text-hand mt-4 text-2xl leading-snug text-ink">
                {`"${testimonio.comment}"`}
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-dashed border-line pt-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-paper text-sm font-bold text-ink">
                  {testimonio.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <span>
                  <span className="block text-sm font-bold text-ink">
                    {testimonio.name}
                  </span>
                  <span className="block text-xs text-ink-faint">
                    {testimonio.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
