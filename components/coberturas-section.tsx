"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
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
  ChevronRight,
} from "lucide-react"
import { useState } from "react"

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

export function CoberturasSection() {
  const [openModal, setOpenModal] = useState<ModalType>(null)

  return (
    <section id="coberturas" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Nuestras coberturas
          </span>
          <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Seguros para cada necesidad
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Ofrecemos una amplia gama de coberturas para proteger lo que más
            valoras. Encontrá el seguro ideal para vos.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Seguros Personales Card */}
          <button
            onClick={() => setOpenModal("personales")}
            className="group relative overflow-hidden rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <div className="relative h-72 md:h-80">
              <Image
                src="/seguros-personales-new.png"
                alt="Seguros Personales - documentos y llaves en escritorio"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 md:p-8">
                <div>
                  <h3 className="text-2xl font-bold text-white md:text-3xl">
                    Seguros Personales
                  </h3>
                  <p className="mt-1 text-sm text-white/70">
                    Vida, ART, sepelio y más
                  </p>
                </div>
                <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 group-hover:translate-x-1">
                  <ChevronRight className="size-5" />
                </span>
              </div>
            </div>
          </button>

          {/* Seguros Patrimoniales Card */}
          <button
            onClick={() => setOpenModal("patrimoniales")}
            className="group relative overflow-hidden rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <div className="relative h-72 md:h-80">
              <Image
                src="/seguros-patrimoniales-new.png"
                alt="Seguros Patrimoniales - asesores con clientes en oficina"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 md:p-8">
                <div>
                  <h3 className="text-2xl font-bold text-white md:text-3xl">
                    Seguros Patrimoniales
                  </h3>
                  <p className="mt-1 text-sm text-white/70">
                    Autos, hogar, comercio y más
                  </p>
                </div>
                <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 group-hover:translate-x-1">
                  <ChevronRight className="size-5" />
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Modal Seguros Personales */}
      <Dialog
        open={openModal === "personales"}
        onOpenChange={(open) => !open && setOpenModal(null)}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl text-foreground">
              Seguros Personales
            </DialogTitle>
            <DialogDescription>
              Coberturas pensadas para proteger a las personas y su bienestar.
            </DialogDescription>
          </DialogHeader>
          <ul className="mt-2 flex flex-col gap-3">
            {segurosPersonales.map((seguro) => (
              <li
                key={seguro.title}
                className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-secondary"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <seguro.icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">
                    {seguro.title}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                    {seguro.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Button asChild className="w-full">
              <a href="#contacto" onClick={() => setOpenModal(null)}>
                Solicitar cotización
                <ArrowRight className="ml-2 size-4" />
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Seguros Patrimoniales */}
      <Dialog
        open={openModal === "patrimoniales"}
        onOpenChange={(open) => !open && setOpenModal(null)}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl text-foreground">
              Seguros Patrimoniales
            </DialogTitle>
            <DialogDescription>
              Protección integral para tus bienes, vehículos y negocios.
            </DialogDescription>
          </DialogHeader>
          <ul className="mt-2 flex flex-col gap-3">
            {segurosPatrimoniales.map((seguro) => (
              <li
                key={seguro.title}
                className="flex items-start gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-secondary"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <seguro.icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">
                    {seguro.title}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                    {seguro.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Button asChild className="w-full">
              <a href="#contacto" onClick={() => setOpenModal(null)}>
                Solicitar cotización
                <ArrowRight className="ml-2 size-4" />
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
