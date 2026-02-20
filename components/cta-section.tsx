import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck } from "lucide-react"

export function CtaSection() {
  return (
    <section className="bg-primary py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <ShieldCheck className="mx-auto mb-6 size-12 text-primary-foreground/80" />
          <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl">
            Obtene tu cotizacion en minutos
          </h2>
          <p className="mt-4 text-pretty text-lg text-primary-foreground/80 leading-relaxed">
            Completar el formulario te lleva menos de un minuto. Nosotros nos
            encargamos del resto.
          </p>
          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="h-12 bg-background px-8 text-base text-foreground hover:bg-background/90"
            >
              <a href="#contacto">
                Solicitar asesoramiento
                <ArrowRight className="ml-2 size-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
