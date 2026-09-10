import { Triangulo } from "@panel/components/Triangulo";
import { EncabezadoPagina } from "@panel/components/Shell";

export default function Reservas() {
  return (
    <>
      <EncabezadoPagina titulo="Reservas" />

      <section className="mb-6 rounded-xl border border-[var(--color-aviso)] bg-[var(--color-aviso)]/8 p-5 text-sm leading-relaxed">
        <h2 className="font-medium">Qué es y qué no es esto</h2>
        <p className="mt-2">
          Una agencia ve la denuncia del siniestro, pero la reserva técnica y el pago
          final los maneja la compañía. Este triángulo mide{" "}
          <strong>el desarrollo que la agencia conoce</strong>, no el real.
        </p>
        <p className="mt-2">
          Sirve para comparar compañías —cuál tarda más en pagar, cuál rechaza más— y
          para anticipar cómo va a impactar la siniestralidad en la próxima renovación.
          Eso es poder de negociación concreto.
        </p>
        <p className="mt-2">
          <strong>No es</strong> un cálculo de reservas con validez regulatoria: ese lo
          hace la compañía y lo firma su actuario. Y la selección de factores de
          desarrollo es criterio profesional, no cálculo automático.
        </p>
      </section>

      <Triangulo />
    </>
  );
}
