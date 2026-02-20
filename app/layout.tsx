import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Poner Seguros | Protegemos lo que mas importa',
  description:
    'Agencia de seguros en Argentina. Asesoramiento personalizado en seguros para personas y empresas. Automotor, hogar, salud, vida, ART y mas.',
  keywords: [
    'seguros',
    'agencia de seguros',
    'Argentina',
    'cotizacion seguros',
    'automotor',
    'hogar',
    'salud',
    'ART',
  ],
}

export const viewport: Viewport = {
  themeColor: '#ea3333',
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
