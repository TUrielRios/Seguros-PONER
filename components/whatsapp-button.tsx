"use client"

import { useState, useEffect } from "react"
import { MessageCircle } from "lucide-react"

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <a
      href="https://wa.me/541135963691"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hablar por WhatsApp"
      className={`fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        }`}
    >
      <MessageCircle className="size-6" />
    </a>
  )
}
