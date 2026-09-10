"use client"

import { useState, useEffect } from "react"

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300)
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-6 right-5 z-50 flex items-center gap-3 transition-all duration-300 md:right-8 ${visible
        ? "translate-y-0 opacity-100"
        : "pointer-events-none translate-y-4 opacity-0"
        }`}
    >
      <span className="text-hand hidden -rotate-2 bg-paper px-3 py-1 text-lg text-ink shadow-[2px_2px_0_0_var(--ink)] sm:block">
        escribinos
      </span>

      <a
        href="https://wa.me/541135963691"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hablar por WhatsApp"
        className="flex size-14 items-center justify-center rounded-full border-2 border-ink bg-[#25D366] text-white shadow-[4px_4px_0_0_var(--ink)] transition-transform duration-150 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_var(--ink)]"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="size-7">
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z" />
          <path d="M12.04 2C6.6 2 2.17 6.43 2.16 11.87c0 1.74.46 3.44 1.32 4.94L2 22.5l5.85-1.53a9.9 9.9 0 0 0 4.19.95h.01c5.44 0 9.87-4.43 9.88-9.87A9.82 9.82 0 0 0 19.03 5a9.8 9.8 0 0 0-6.99-3Zm5.8 15.68a8.2 8.2 0 0 1-5.8 2.4h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.1.81.83-3.02-.2-.31a8.19 8.19 0 0 1-1.26-4.36c0-4.52 3.69-8.2 8.22-8.2a8.16 8.16 0 0 1 8.2 8.21c0 2.2-.86 4.26-2.4 5.8Z" />
        </svg>
      </a>
    </div>
  )
}
