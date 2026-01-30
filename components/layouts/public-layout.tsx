"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  Menu,
  X,
  Home,
  FolderOpen,
  Calendar,
  BarChart3,
  FileText,
  Mail,
  LogIn,
  GraduationCap,
} from "lucide-react"

const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/programas", label: "Programas", icon: FolderOpen },
  { href: "/acciones", label: "Acciones", icon: Calendar },
  { href: "/resultados", label: "Resultados", icon: BarChart3 },
  { href: "/transparencia", label: "Transparencia", icon: FileText },
  { href: "/ciudadania-digital", label: "Ciudadanía Digital", icon: GraduationCap },
  { href: "/contacto", label: "Contacto", icon: Mail },
]

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 lg:px-6">
          {/* Logo - pegado a la izquierda */}
          <Link href="/" className="flex items-center shrink-0">
            <div className="relative h-14 w-48">
              <Image
                src="/logo1.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Contenido centrado */}
          <div className="flex-1 flex items-center justify-center">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    pathname === item.href
                      ? "bg-primary/10 text-primary glow shadow-glow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:backdrop-blur"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Actions - a la derecha */}
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            
            <Button asChild variant="default" size="sm" className="hidden sm:flex glow">
              <Link href="/equipo/login">
                <LogIn className="h-4 w-4 mr-2" />
                Ingresar
              </Link>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px] glass">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between py-4 border-b border-border/40">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent glow">
                        <span className="text-sm font-bold text-primary-foreground">SPC</span>
                      </div>
                      <span className="font-semibold text-sm">Participación Ciudadana</span>
                    </div>
                    <ThemeToggle />
                  </div>
                  <nav className="flex flex-col gap-1 py-4">
                    {navItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                            pathname === item.href
                              ? "bg-primary/10 text-primary glow"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          {item.label}
                        </Link>
                      )
                    })}
                  </nav>
                  <div className="mt-auto pb-4">
                    <Button asChild className="w-full glow">
                      <Link href="/equipo/login" onClick={() => setMobileMenuOpen(false)}>
                        <LogIn className="h-4 w-4 mr-2" />
                        Ingresar
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent glow">
                  <span className="text-lg font-bold text-primary-foreground">CD</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Ciudadanía Digital
                  </p>
                  <p className="text-sm text-muted-foreground">
                    San Miguel de Tucumán
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                Plataforma de Gestión para una Ciudadanía Activa y Participativa

              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                {navItems.slice(1, 5).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Contacto</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>25 de Mayo 90</li>
                <li>San Miguel de Tucumán</li>
                
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border/40">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} José Farhat. Todos los derechos reservados.
              </p>
              <div className="flex items-center gap-4">
                <div className="relative h-32 w-56">
                  <Image
                    src="/logo1.png"
                    alt="Logo 1"
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="relative h-32 w-56">
                  <Image
                    src="/logo2.png"
                    alt="Logo 2"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
