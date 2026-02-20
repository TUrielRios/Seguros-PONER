"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import {
  MessageCircle,
  MapPin,
  Clock,
  Phone,
  Mail,
  Send,
} from "lucide-react"

const tiposSeguros = [
  "Automotor",
  "Hogar",
  "Salud / Vida",
  "Empresas / Comercios",
  "ART",
  "Riesgos especiales",
  "Otro",
]

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <section
      id="contacto"
      className="relative py-20 md:py-28 bg-secondary"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 opacity-10"

      />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Contacto
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Hablemos sobre tu cobertura
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
            Completá el formulario y te contactamos a la brevedad, o escribinos
            directamente por WhatsApp.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-border bg-background/95 p-8 shadow-sm backdrop-blur-sm"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="nombre">Nombre completo</Label>
                  <Input
                    id="nombre"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    type="tel"
                    placeholder="+54 11 3596-3691"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="tipo-seguro">Tipo de seguro</Label>
                  <Select required>
                    <SelectTrigger id="tipo-seguro" className="w-full">
                      <SelectValue placeholder="Seleccioná una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposSeguros.map((tipo) => (
                        <SelectItem key={tipo} value={tipo.toLowerCase()}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <Label htmlFor="mensaje">Mensaje</Label>
                <Textarea
                  id="mensaje"
                  placeholder="Contanos qué necesitás..."
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="mt-8">
                {submitted ? (
                  <div className="rounded-lg bg-primary/10 p-4 text-center text-sm font-medium text-primary">
                    Gracias por tu consulta. Te contactaremos a la brevedad.
                  </div>
                ) : (
                  <Button type="submit" className="h-11 w-full text-base sm:w-auto sm:px-8">
                    <Send className="mr-2 size-4" />
                    Enviar consulta
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Contact info */}
          <div className="flex flex-col gap-8 lg:col-span-2">
            <div>
              <h3 className="mb-6 text-lg font-semibold text-foreground">
                Otras formas de contacto
              </h3>

              <div className="flex flex-col gap-6">
                <a
                  href="https://wa.me/541135963691"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 rounded-xl border border-border bg-background/80 p-5 transition-all hover:border-primary/20 hover:shadow-md backdrop-blur-sm"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600 group-hover:bg-green-100">
                    <MessageCircle className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">
                      +54 11 3596-3691
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-4 rounded-xl border border-border bg-background/80 p-5 backdrop-blur-sm">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Teléfono</p>
                    <p className="text-sm text-muted-foreground">
                      11 3596-3691
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-border bg-background/80 p-5 backdrop-blur-sm">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">
                      info@poner.com.ar
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-border bg-background/80 p-5 backdrop-blur-sm">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Dirección</p>
                    <p className="text-sm text-muted-foreground">
                      Buenos Aires, Argentina
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-border bg-background/80 p-5 backdrop-blur-sm">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Horarios</p>
                    <p className="text-sm text-muted-foreground">
                      Lunes a Viernes: 9:00 a 18:00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
