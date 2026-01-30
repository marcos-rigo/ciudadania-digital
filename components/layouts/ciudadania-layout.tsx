"use client";

import React from "react"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Menu,
  X,
  Home,
  BookOpen,
  Play,
  Mic,
  ClipboardCheck,
  FileQuestion,
  User,
  Award,
  LogIn,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/ciudadania-digital", label: "Inicio", icon: Home },
  { href: "/trayectos", label: "Trayectos", icon: BookOpen },
  {
    label: "Contenidos",
    icon: Play,
    children: [
      { href: "/contenidos/videos", label: "Videos", icon: Play },
      { href: "/contenidos/podcast", label: "Podcast", icon: Mic },
    ],
  },
  { href: "/evaluaciones", label: "Evaluaciones", icon: ClipboardCheck },
  { href: "/encuestas", label: "Encuestas", icon: FileQuestion },
];

const userNavItems = [
  { href: "/mi-perfil", label: "Mi Perfil", icon: User },
  { href: "/certificados", label: "Certificados", icon: Award },
];

export function CiudadaniaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock: Check if user is logged in
  const isLoggedIn = true;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent glow text-primary-foreground font-bold text-lg">
                CD
              </div>
              <div className="hidden sm:block">
                <p className="font-semibold text-foreground leading-tight">
                  Ciudadanía Digital
                </p>
                <p className="text-xs text-muted-foreground">José Farhat</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) =>
                item.children ? (
                  <DropdownMenu key={item.label}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="gap-1 text-muted-foreground hover:text-foreground"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="glass">
                      {item.children.map((child) => (
                        <DropdownMenuItem key={child.href} asChild className="cursor-pointer hover:bg-primary/10">
                          <Link
                            href={child.href}
                            className="flex items-center gap-2"
                          >
                            <child.icon className="h-4 w-4" />
                            {child.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "gap-2 text-muted-foreground hover:text-foreground transition-all duration-200 rounded-lg",
                        pathname === item.href &&
                          "bg-primary/10 text-primary glow shadow-glow-sm"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                )
              )}
            </nav>

            {/* User Actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="hidden sm:flex gap-2 border-border/40 hover:border-primary/40 hover:bg-primary/5 bg-transparent glow"
                    >
                      <User className="h-4 w-4" />
                      Mi cuenta
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="glass">
                    {userNavItems.map((item) => (
                      <DropdownMenuItem key={item.href} asChild className="cursor-pointer hover:bg-primary/10">
                        <Link
                          href={item.href}
                          className="flex items-center gap-2"
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/ciudadania-digital/login">
                  <Button className="hidden sm:flex gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground glow hover:shadow-glow-lg">
                    <LogIn className="h-4 w-4" />
                    Ingresar
                  </Button>
                </Link>
              )}

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/40 bg-card/50 backdrop-blur">
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) =>
                item.children ? (
                  <div key={item.label} className="space-y-1">
                    <p className="px-3 py-2 text-sm font-medium text-muted-foreground">
                      {item.label}
                    </p>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm pl-6 transition-all duration-200",
                          pathname === child.href
                            ? "bg-primary/10 text-primary glow"
                            : "text-muted-foreground hover:bg-muted/50"
                        )}
                      >
                        <child.icon className="h-4 w-4" />
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                      pathname === item.href
                        ? "bg-primary/10 text-primary glow"
                        : "text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              )}
              <div className="border-t border-border/40 pt-2 mt-2">
                {isLoggedIn ? (
                  userNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                        pathname === item.href
                          ? "bg-primary/10 text-primary glow"
                          : "text-muted-foreground hover:bg-muted/50"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ))
                ) : (
                  <Link
                    href="/ciudadania-digital/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-primary font-medium"
                  >
                    <LogIn className="h-4 w-4" />
                    Ingresar
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent glow text-primary-foreground font-bold text-lg">
                  CD
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Ciudadanía Digital
                  </p>
                  <p className="text-xs text-muted-foreground">José Farhat</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground max-w-md">
                La ciudadanía digital se aprende, se practica y se construye
                colectivamente. Formate como ciudadano/a digital y contribuí a
                una internet más segura y participativa.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Formación</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/trayectos"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    Trayectos formativos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contenidos/videos"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    Videos educativos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contenidos/podcast"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    Podcast
                  </Link>
                </li>
                <li>
                  <Link
                    href="/evaluaciones"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    Evaluaciones
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Institucional</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    SPC Tucumán
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contacto"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link
                    href="/transparencia"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    Transparencia
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/40 mt-8 pt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Secretaría de Estado de Participación Ciudadana - Ministerio de
              Seguridad - Tucumán
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
