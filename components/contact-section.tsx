"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, MapPin, Clock, Phone, Mail, Send } from "lucide-react"
import { HandCheck, Squiggle } from "@/components/doodles"

const tiposSeguros = [
  "Automotor",
  "Hogar",
  "Salud / Vida",
  "Empresas / Comercios",
  "ART",
  "Riesgos especiales",
  "Otro",
]

/** Campos con pinta de formulario de papel: solo una línea abajo. */
const campo =
  "h-11 rounded-none border-x-0 border-t-0 border-b-2 border-line bg-transparent px-0 text-base shadow-none placeholder:text-ink-faint/70 focus-visible:border-brand focus-visible:ring-0"

const etiqueta =
  "text-xs font-bold uppercase tracking-widest text-ink-faint"

const datos = [
  {
    icon: Phone,
    label: "Teléfono",
    value: "11 3596-3691",
    href: "tel:+541135963691",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@poner.com.ar",
    href: "mailto:info@poner.com.ar",
  },
  { icon: MapPin, label: "Dónde estamos", value: "Buenos Aires, Argentina" },
  { icon: Clock, label: "Horarios", value: "Lunes a viernes, de 9 a 18 h" },
]

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <section
      id="contacto"
      className="paper-grid scroll-mt-[84px] bg-paper py-20 md:scroll-mt-[104px] md:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="eyebrow-hand">contanos</span>
          <h2 className="mt-2 text-balance text-4xl font-semibold text-ink md:text-5xl">
            Escribinos y charlamos
          </h2>
          <Squiggle className="mx-auto mt-5 h-3 w-32 text-ochre" />
          <p className="mt-5 text-pretty leading-relaxed text-ink-soft">
            Dejanos tus datos y te contactamos a la brevedad. Si preferís algo
            más rápido, mandanos un WhatsApp y listo.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-5 lg:gap-14">
          {/* Formulario */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="card-paper tilt-xs relative rounded-sm p-7 sm:p-9"
            >
              <div className="mb-8 flex items-end justify-between gap-4 border-b-2 border-dashed border-line pb-4">
                <div>
                  <p className="text-display text-2xl font-semibold text-ink">
                    Pedido de presupuesto
                  </p>
                  <p className="text-hand text-xl text-ink-faint">
                    completalo tranquilo, son 4 datos
                  </p>
                </div>
                <span className="hidden shrink-0 -rotate-6 border-2 border-brand/50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-brand/70 sm:block">
                  sin cargo
                </span>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="nombre" className={etiqueta}>
                    Nombre completo
                  </Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    placeholder="Tu nombre"
                    required
                    className={campo}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="telefono" className={etiqueta}>
                    Teléfono
                  </Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    placeholder="11 5555-5555"
                    required
                    className={campo}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className={etiqueta}>
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                    className={campo}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="tipo-seguro" className={etiqueta}>
                    Qué querés asegurar
                  </Label>
                  <Select required>
                    <SelectTrigger
                      id="tipo-seguro"
                      className={`${campo} w-full data-[size=default]:h-11`}
                    >
                      <SelectValue placeholder="Elegí una opción" />
                    </SelectTrigger>
                    <SelectContent className="rounded-sm border-2 border-ink bg-card">
                      {tiposSeguros.map((tipo) => (
                        <SelectItem key={tipo} value={tipo.toLowerCase()}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-2">
                <Label htmlFor="mensaje" className={etiqueta}>
                  Contanos un poco más
                </Label>
                <Textarea
                  id="mensaje"
                  name="mensaje"
                  placeholder="Por ejemplo: tengo un Gol 2015 y quiero pasar a todo riesgo..."
                  rows={4}
                  className="paper-lined resize-none rounded-none border-x-0 border-t-0 border-b-2 border-line bg-transparent px-0 py-1 text-base leading-7 shadow-none placeholder:text-ink-faint/70 focus-visible:border-brand focus-visible:ring-0"
                />
              </div>

              <div className="mt-8">
                {submitted ? (
                  <p className="flex items-center gap-3 border-2 border-olive/40 bg-olive/10 px-5 py-4 text-olive">
                    <HandCheck className="size-5 shrink-0" />
                    <span className="text-hand text-xl">
                      ¡Gracias! Te escribimos en breve.
                    </span>
                  </p>
                ) : (
                  <button
                    type="submit"
                    className="btn-stamp wobble-a w-full px-7 py-3.5 text-base sm:w-auto"
                  >
                    <Send className="size-4" />
                    Enviar mi consulta
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Datos de contacto */}
          <div className="lg:col-span-2">
            <a
              href="https://wa.me/541135963691"
              target="_blank"
              rel="noopener noreferrer"
              className="card-paper straighten tilt-r flex items-center gap-4 rounded-sm bg-[#eef6ea] p-5"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-[#25D366] text-white">
                <MessageCircle className="size-6" />
              </span>
              <span>
                <span className="block text-lg font-semibold text-ink">
                  Hablemos por WhatsApp
                </span>
                <span className="block text-sm text-ink-soft">
                  +54 11 3596-3691
                </span>
              </span>
            </a>

            <ul className="mt-10 flex flex-col">
              {datos.map((dato) => {
                const contenido = (
                  <>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-paper-warm text-brand">
                      <dato.icon className="size-4" />
                    </span>
                    <span>
                      <span className={`block ${etiqueta}`}>{dato.label}</span>
                      <span className="block text-ink">{dato.value}</span>
                    </span>
                  </>
                )

                return (
                  <li
                    key={dato.label}
                    className="border-b border-dashed border-line py-4 last:border-b-0"
                  >
                    {dato.href ? (
                      <a
                        href={dato.href}
                        className="flex items-center gap-4 transition-colors hover:text-brand"
                      >
                        {contenido}
                      </a>
                    ) : (
                      <div className="flex items-center gap-4">{contenido}</div>
                    )}
                  </li>
                )
              })}
            </ul>

            <p className="text-hand mt-8 -rotate-1 text-2xl leading-snug text-ink-faint">
              Si llamás y no atendemos, es porque estamos con otro cliente:
              dejá mensaje que devolvemos.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
