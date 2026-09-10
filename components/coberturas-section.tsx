"use client"

import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Heart,
  Users,
  Cross,
  UserCheck,
  HardHat,
  Car,
  Home,
  Building2,
  Building,
  Factory,
  Wrench,
  FileCheck,
  ShieldAlert,
  Truck,
  ArrowRight,
} from "lucide-react"
import { useState } from "react"
import { HandCheck, Squiggle } from "@/components/doodles"

const segurosPersonales = [
  {
    icon: Heart,
    title: "Seguros de Vida",
    description: "Con capitalizacion y ahorro",
  },
  {
    icon: Users,
    title: "Seguros de Vida Colectivo",
    description: "Proteccion grupal para empresas y organizaciones",
  },
  {
    icon: Cross,
    title: "Seguros de Sepelio",
    description: "Cobertura integral de servicios funerarios",
  },
  {
    icon: UserCheck,
    title: "Accidentes Personales",
    description: "Proteccion ante lesiones e incapacidades",
  },
  {
    icon: HardHat,
    title: "Riesgo del Trabajo (ART)",
    description: "Cumplimiento normativo y proteccion laboral",
  },
]

const segurosPatrimoniales = [
  {
    icon: Car,
    title: "Autos, Motos, Camiones, Flotas, Bicicletas",
    description: "Cobertura vehicular integral",
  },
  {
    icon: Home,
    title: "Hogar y Combinados Familiares",
    description: "Proteccion para tu casa y tus bienes",
  },
  {
    icon: Building2,
    title: "Integrales de Comercio",
    description: "Cobertura completa para tu negocio",
  },
  {
    icon: Building,
    title: "Consorcios",
    description: "Seguros para edificios y propiedades horizontales",
  },
  {
    icon: Factory,
    title: "Seguros Industriales",
    description: "Proteccion para plantas y operaciones industriales",
  },
  {
    icon: Wrench,
    title: "Todo Riesgo Operativo / Seguro Tecnico",
    description: "Cobertura de equipos y maquinaria",
  },
  {
    icon: FileCheck,
    title: "Cauciones",
    description: "Garantias para licitaciones y contratos",
  },
  {
    icon: ShieldAlert,
    title: "Responsabilidad Civil",
    description: "Proteccion frente a reclamos de terceros",
  },
  {
    icon: Truck,
    title: "Transporte",
    description: "Cobertura de mercaderias en transito",
  },
]

type ModalType = "personales" | "patrimoniales" | null

const fichas = [
  {
    id: "personales" as const,
    tab: "Para las personas",
    title: "Seguros Personales",
    image: "/seguros-personales-new.png",
    alt: "Documentos y llaves sobre un escritorio",
    intro: "Para vos, tu familia y tu equipo de trabajo.",
    preview: ["Vida y ahorro", "Accidentes personales", "ART", "Sepelio"],
    tilt: "tilt-l",
  },
  {
    id: "patrimoniales" as const,
    tab: "Para tus cosas",
    title: "Seguros Patrimoniales",
    image: "/seguros-patrimoniales-new.png",
    alt: "Asesores conversando con clientes en la oficina",
    intro: "Para el auto, la casa, el comercio y la empresa.",
    preview: ["Autos y flotas", "Hogar", "Comercio", "Responsabilidad civil"],
    tilt: "tilt-r",
  },
]

export function CoberturasSection() {
  const [openModal, setOpenModal] = useState<ModalType>(null)
  // Se conserva la última ficha abierta para que el contenido no cambie
  // mientras el modal se está cerrando.
  const [ultima, setUltima] = useState<Exclude<ModalType, null>>("personales")

  const detalle =
    ultima === "personales"
      ? {
          title: "Seguros Personales",
          description:
            "Coberturas pensadas para cuidar a las personas y su bienestar.",
          items: segurosPersonales,
        }
      : {
          title: "Seguros Patrimoniales",
          description:
            "Protección para tus bienes, tus vehículos y tu negocio.",
          items: segurosPatrimoniales,
        }

  return (
    <section
      id="coberturas"
      className="scroll-mt-[84px] bg-paper-warm py-20 md:scroll-mt-[104px] md:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="eyebrow-hand">lo que sabemos hacer</span>
          <h2 className="mt-2 text-balance text-4xl font-semibold text-ink md:text-5xl">
            Un seguro para cada cosa que querés cuidar
          </h2>
          <Squiggle className="mx-auto mt-5 h-3 w-32 text-ochre" />
          <p className="mt-5 text-pretty leading-relaxed text-ink-soft">
            Abrí la carpeta que te interese y mirá todo lo que podemos cotizarte.
            Si no está en la lista, preguntanos igual.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 md:gap-8">
          {fichas.map((ficha) => (
            <button
              key={ficha.id}
              onClick={() => {
                setUltima(ficha.id)
                setOpenModal(ficha.id)
              }}
              className={`card-paper straighten ${ficha.tilt} group relative rounded-sm p-4 pb-6 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ochre/60`}
            >
              {/* Pestaña de carpeta */}
              <span className="absolute -top-4 left-6 border-2 border-ink bg-ochre px-4 py-1 text-xs font-bold uppercase tracking-wider text-ink">
                {ficha.tab}
              </span>

              <div className="relative mt-3 aspect-[16/10] overflow-hidden bg-paper-deep">
                <Image
                  src={ficha.image}
                  alt={ficha.alt}
                  fill
                  sizes="(max-width: 768px) 90vw, 460px"
                  className="object-cover saturate-[0.9] transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>

              <h3 className="mt-5 text-2xl font-semibold text-ink">
                {ficha.title}
              </h3>
              <p className="mt-1 text-ink-soft">{ficha.intro}</p>

              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {ficha.preview.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm text-ink-soft"
                  >
                    <HandCheck className="size-3.5 shrink-0 text-olive" />
                    {item}
                  </li>
                ))}
              </ul>

              <span className="mt-6 inline-flex items-center gap-2 border-b-2 border-brand pb-0.5 text-sm font-bold text-brand">
                Ver la lista completa
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>
          ))}
        </div>
      </div>

      <Dialog
        open={openModal !== null}
        onOpenChange={(open) => !open && setOpenModal(null)}
      >
        <DialogContent className="paper-lined max-h-[85vh] overflow-y-auto rounded-sm border-2 border-ink bg-card p-6 shadow-[6px_6px_0_0_var(--ink)] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-display text-3xl font-semibold text-ink">
              {detalle.title}
            </DialogTitle>
            <DialogDescription className="text-ink-soft">
              {detalle.description}
            </DialogDescription>
          </DialogHeader>

          <ul className="mt-1 flex flex-col">
            {detalle.items.map((seguro) => (
              <li
                key={seguro.title}
                className="flex items-start gap-4 border-b border-dashed border-line py-3 last:border-b-0"
              >
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-paper-warm text-brand">
                  <seguro.icon className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-ink">{seguro.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">
                    {seguro.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <a
            href="#contacto"
            onClick={() => setOpenModal(null)}
            className="btn-stamp wobble-a mt-2 w-full px-6 py-3"
          >
            Pedir presupuesto de esto
            <ArrowRight className="size-4" />
          </a>
        </DialogContent>
      </Dialog>
    </section>
  )
}
