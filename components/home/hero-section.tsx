"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"

const ease = [0.16, 0.84, 0.3, 1] as const

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 22, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease },
  },
}

const STATS = [
  { value: "106", label: "Actividades" },
  { value: "17", label: "Municipios y Comunas" },
  { value: "9.033", label: "Personas alcanzadas" },
  { value: "4", label: "Programas activos" },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[88vh] flex items-center">

      {/* ── Aurora gradient blobs ── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-[25%] right-[-8%] h-[650px] w-[650px] rounded-full opacity-50 dark:opacity-25"
          style={{
            background: "radial-gradient(circle, rgba(0,102,255,0.22) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute bottom-[-20%] left-[-12%] h-[700px] w-[700px] rounded-full opacity-35 dark:opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(0,229,255,0.18) 0%, transparent 70%)",
            filter: "blur(110px)",
          }}
        />
        <div
          className="absolute top-[35%] left-[20%] h-[450px] w-[900px] rounded-full opacity-20 dark:opacity-10"
          style={{
            background: "radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* ── Grid pattern ── */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0L40 0M0 0L0 40' fill='none' stroke='%23ffffff' stroke-width='0.8'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── Content ── */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center py-20 lg:py-32"
        >

          {/* Badge */}
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm text-primary text-sm font-medium mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Plataforma Digital Operativa · Tucumán
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl text-balance leading-[1.06]"
          >
            <span className="text-foreground">Gestión para una</span>
            <br />
            <span className="gradient-text">Ciudadanía Activa</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl text-pretty leading-relaxed"
          >
            Datos, territorio y participación ciudadana para una gestión inteligente.{" "}
            <span className="text-foreground/70 font-medium">
              Dr. José Farhat — Secretario de Estado
            </span>
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="text-base relative group overflow-hidden shadow-glow hover:shadow-glow-lg transition-shadow duration-300"
            >
              <Link href="/programas">
                <span className="relative z-10 flex items-center gap-2">
                  Ver Programas
                  <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
                {/* Shimmer sweep */}
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700 skew-x-12 pointer-events-none"
                />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-base bg-transparent border-border/60 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-300"
            >
              <Link href="/login">
                <LogIn className="mr-2 h-5 w-5" />
                Ingresar al sistema
              </Link>
            </Button>
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={fadeUp}
            className="mt-16 w-px h-12 bg-gradient-to-b from-border to-transparent mx-auto"
          />

          {/* Stats grid */}
          <motion.div
            variants={fadeUp}
            className="mt-8 grid grid-cols-2 sm:grid-cols-4 w-full max-w-2xl rounded-2xl overflow-hidden border border-border/50 bg-background/60 dark:bg-card/40 backdrop-blur-md shadow-sm"
          >
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={[
                  "px-6 py-5 text-center",
                  i < STATS.length - 1
                    ? "border-r border-b sm:border-b-0 border-border/40 last:border-r-0"
                    : "",
                ].join(" ")}
              >
                <p className="text-3xl sm:text-4xl font-bold text-foreground tabular-nums">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-tight">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}
