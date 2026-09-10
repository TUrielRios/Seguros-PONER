import type { Metadata, Viewport } from 'next'
import { Fraunces, Karla, Caveat } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const karla = Karla({
  subsets: ['latin'],
  variable: '--font-karla',
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Poner Seguros | Te cuidamos como si fueras de la familia',
  description:
    'Agencia de seguros en Argentina. Asesoramiento personalizado, cara a cara, en seguros para personas y empresas. Automotor, hogar, salud, vida, ART y mas.',
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
  themeColor: '#f8f2e6',
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
    <html
      lang="es"
      className={`scroll-smooth ${fraunces.variable} ${karla.variable} ${caveat.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
