import React from "react"
import type { Metadata, Viewport } from 'next'
import { Poppins, Lora } from "next/font/google";
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const lora = Lora({
  subsets: ["latin"],
  variable: '--font-lora',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sistema Integral de Información y Comunicación Estratégica | SPC Tucumán',
  description: 'Hacia una Gestión Inteligente: Datos, Territorio y Participación Ciudadana. Secretaría de Estado de Participación Ciudadana - Ministerio de Seguridad - Tucumán.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${poppins.variable} ${lora.variable} font-sans antialiased bg-background text-foreground relative`}>
        <div className="bg-noise" />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
