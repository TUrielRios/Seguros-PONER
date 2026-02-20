import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { CoberturasSection } from "@/components/coberturas-section"
import { WhyUsSection } from "@/components/why-us-section"
import { AboutSection } from "@/components/about-section"
import { ProcessSection } from "@/components/process-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { CtaSection } from "@/components/cta-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CoberturasSection />
        <WhyUsSection />
        <AboutSection />
        <ProcessSection />
        <TestimonialsSection />
        <CtaSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
