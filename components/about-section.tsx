import Image from "next/image"
import { HandCheck, Squiggle } from "@/components/doodles"

const highlights = [
  "Asesoramiento objetivo e independiente",
  "Acompañamiento en cada etapa del proceso",
  "Tramitación de siniestros sin complicaciones",
  "Revisamos tus coberturas todos los años",
]

export function AboutSection() {
  return (
    <section
      id="nosotros"
      className="scroll-mt-[84px] bg-paper-warm py-20 md:scroll-mt-[104px] md:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Foto pegada al muro */}
          <div className="relative">
            <div className="tape tape-single tilt-l straighten relative mx-auto max-w-md bg-card p-3 pb-12 shadow-[0_18px_40px_-24px_rgba(44,34,26,0.6)]">
              <div className="relative aspect-[4/3] overflow-hidden bg-paper-deep">
                <Image
                  src="/equipo.png"
                  alt="El equipo de Poner Seguros trabajando"
                  fill
                  sizes="(max-width: 1024px) 90vw, 460px"
                  className="object-cover sepia-[0.1] saturate-[0.95]"
                  style={{ objectPosition: "center 25%" }}
                />
              </div>
              <p className="text-hand absolute inset-x-0 bottom-3 text-center text-xl text-ink-faint">
                un martes cualquiera en la oficina
              </p>
            </div>

            <span className="text-hand absolute -bottom-6 right-0 -rotate-6 text-2xl text-brand sm:right-6">
              ¡hola!
            </span>
          </div>

          {/* Texto */}
          <div>
            <span className="eyebrow-hand">quiénes somos</span>
            <h2 className="mt-2 text-balance text-4xl font-semibold text-ink md:text-5xl">
              Una agencia con nombre, apellido y teléfono
            </h2>
            <Squiggle className="mt-5 h-3 w-32 text-ochre" />

            <p className="mt-6 text-pretty leading-relaxed text-ink-soft">
              Desde nuestros inicios, en Poner Seguros nos dedicamos a brindar
              asesoramiento integral en seguros con un enfoque cercano y
              profesional. Trabajamos con las principales compañías del mercado
              argentino para ofrecerte las mejores opciones al mejor precio.
            </p>
            <p className="mt-4 text-pretty leading-relaxed text-ink-soft">
              Nuestro compromiso es acompañarte en cada momento, desde la
              elección de tu póliza hasta la resolución de cualquier siniestro.
              Nada de derivarte de un sector a otro: te atiende siempre la misma
              gente.
            </p>

            <ul className="mt-8 flex flex-col gap-4">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <HandCheck className="size-5 shrink-0 text-olive" />
                  <span className="text-ink">{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-hand mt-9 text-2xl text-ink-faint">
              — el equipo de Poner
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
