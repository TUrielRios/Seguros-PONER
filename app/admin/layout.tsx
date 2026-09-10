import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "PONER · Gestión de cartera",
  description: "Panel de gestión y analítica de PONER Agencia de Seguros",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
