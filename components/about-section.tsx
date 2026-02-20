import { CheckCircle2 } from "lucide-react"
import Image from "next/image"

const highlights = [
  "Asesoramiento objetivo e independiente",
  "Acompañamiento en cada etapa del proceso",
  "Tramitación de siniestros sin complicaciones",
  "Actualización permanente de tus coberturas",
]

export function AboutSection() {
  return (
    <section id="nosotros" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image / illustration area */}
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
              <div className="relative size-full">
                <Image
                  src="/equipo.png"
                  alt="Equipo de Poner Seguros trabajando"
                  fill
                  className="object-cover"
                  style={{ objectPosition: "center 25%" }}
                />
              </div>
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 -z-10 size-full rounded-2xl bg-primary/5" />
          </div>

          {/* Text content */}
          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Sobre nosotros
            </span>
            <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Tu socio en protección y tranquilidad
            </h2>
            <p className="mt-6 text-pretty text-muted-foreground leading-relaxed">
              Desde nuestros inicios, en Poner Seguros nos dedicamos a brindar
              asesoramiento integral en seguros con un enfoque cercano y
              profesional. Trabajamos con las principales compañías del mercado
              argentino para ofrecerte las mejores opciones al mejor precio.
            </p>
            <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
              Nuestro compromiso es acompañarte en cada momento, desde la
              elección de tu póliza hasta la resolución de cualquier siniestro.
            </p>

            <ul className="mt-8 flex flex-col gap-4">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 shrink-0 text-primary" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
