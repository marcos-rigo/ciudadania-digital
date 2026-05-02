"use client"

import React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  BarChart3,
  LogIn,
} from "lucide-react"

const authNavItems = [
  { href: "/acciones",   label: "Acciones",   icon: Calendar  },
  { href: "/resultados", label: "Resultados", icon: BarChart3 },
]

function isAuthenticated() {
  if (typeof document === "undefined") return false
  return document.cookie.split(";").some((c) => c.trim().startsWith("spc_auth=1"))
}

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    setLoggedIn(isAuthenticated())
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        {/* Accent bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600" />

        <div className="flex h-15 items-center px-4 lg:px-8">
          {/* Logo */}
          <Link href="/inicio" className="flex items-center shrink-0">
            <div className="relative h-14 w-48">
              <Image
                src="/logo1.png"
                alt="Secretaría de Participación Ciudadana"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Navigation — centrado */}
          <div className="flex-1 flex items-center justify-center">
            {loggedIn && (
              <nav className="flex items-center gap-1">
                {authNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                      pathname === item.href
                        ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-200"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {!loggedIn && (
              <Button asChild variant="default" size="sm" className="btn-magnetic">
                <Link href="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Ingresar
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-200 bg-white">
        {/* Accent bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600" />
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Descripción */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-md">
                  <span className="text-lg font-bold text-white">CD</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Ciudadanía Digital</p>
                  <p className="text-sm text-slate-500">San Miguel de Tucumán</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 max-w-md leading-relaxed">
                Plataforma de Gestión para una Ciudadanía Activa y Participativa.
                Secretaría de Estado de Participación Ciudadana.
              </p>
            </div>

            {/* Enlaces rápidos */}
            {loggedIn && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Enlaces Rápidos</h3>
                <ul className="space-y-2">
                  {authNavItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm text-slate-500 hover:text-blue-600 transition-colors duration-200"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contacto */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Contacto</h3>
              <ul className="space-y-2 text-sm text-slate-500">
                <li>25 de Mayo 90</li>
                <li>San Miguel de Tucumán</li>
                <li>Tucumán, Argentina</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <p className="text-sm text-slate-400">
                © {new Date().getFullYear()} José Farhat. Todos los derechos reservados.
              </p>
              <div className="flex items-center gap-6">
                <div className="relative h-12 w-40">
                  <Image src="/logo1.png" alt="SPC Tucumán" fill className="object-contain" />
                </div>
                <div className="relative h-12 w-40">
                  <Image src="/logo2.png" alt="Gobierno de Tucumán" fill className="object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
