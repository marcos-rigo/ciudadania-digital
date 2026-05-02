"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, LogIn, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const springTransition = {
  type: "spring",
  stiffness: 100,
  damping: 15,
  mass: 0.8,
}

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.08, ease: "easeOut" },
  },
}

const fadeUpSpring = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { type: "spring", stiffness: 120, damping: 14, mass: 0.7 },
  },
}

const scaleInSpring = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1, scale: 1,
    transition: springTransition,
  },
}

const STATS = [
  { value: "9.033", label: "Personas alcanzadas"        },
  { value: "106",   label: "Actividades registradas"    },
  { value: "17",    label: "Localidades y municipios"   },
  { value: "85",    label: "Personas por actividad (promedio)" },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center bg-white">

      {/* ── GRAIN ── */}
      <div className="bg-noise" />

      {/* ── AURORA BLOBS ── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-right — azul vivo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.65 }}
          transition={{ duration: 2, delay: 0.2 }}
          className="absolute -top-[20%] right-[-5%] h-[620px] w-[620px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(37, 99, 235, 0.22) 0%, rgba(37, 99, 235, 0.05) 55%, transparent 75%)",
            filter: "blur(72px)",
          }}
        />
        {/* Bottom-left — violeta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.55 }}
          transition={{ duration: 2.5, delay: 0.35 }}
          className="absolute bottom-[-15%] left-[-10%] h-[680px] w-[680px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(109, 40, 217, 0.18) 0%, rgba(109, 40, 217, 0.04) 55%, transparent 75%)",
            filter: "blur(90px)",
          }}
        />
        {/* Center — cyan sutil */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.40 }}
          transition={{ duration: 3, delay: 0.5 }}
          className="absolute top-[30%] left-[15%] h-[400px] w-[800px] rounded-full"
          style={{
            background: "radial-gradient(ellipse, rgba(6, 182, 212, 0.12) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* ── GRID PATTERN ── */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0L50 0M0 0L0 50' fill='none' stroke='%230f172a' stroke-width='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── MAIN CONTENT ── */}
      <div className="container mx-auto px-4 relative z-10 py-16 lg:py-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center space-y-8 max-w-5xl mx-auto"
        >

          {/* BADGE */}
          <motion.div variants={fadeUpSpring}>
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-blue-200 bg-blue-50 shadow-sm">
              <motion.span
                className="relative flex h-2.5 w-2.5"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-60" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600" />
              </motion.span>
              <span className="text-blue-700 text-sm font-semibold">
                Sistema Integral de Análisis y Gestión
              </span>
              <Sparkles className="h-3.5 w-3.5 text-blue-600 ml-1" />
            </div>
          </motion.div>

          {/* TÍTULO */}
          <motion.div variants={fadeUpSpring} className="space-y-3">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] text-balance">
              <span className="block text-slate-900">Gestión Inteligente</span>
              <motion.span
                className="block text-gradient"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                de Datos y Resultados
              </motion.span>
            </h1>
          </motion.div>

          {/* SUBTÍTULO */}
          <motion.div variants={fadeUpSpring} className="max-w-2xl">
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
              Visualización de datos transparentes y gestión estratégica de resultados territoriales para decisiones fundamentadas.
            </p>
            <p className="text-slate-400 font-medium mt-3 text-base italic">
              "Dr. José Farhat — Secretario de Estado de Participación Ciudadana"
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={fadeUpSpring}
            className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto sm:justify-center"
          >
            <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.95 }} transition={springTransition}>
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto text-base font-semibold btn-magnetic relative group overflow-hidden bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              >
                <Link href="/dashboard/estadisticas">
                  <span className="relative z-10 flex items-center gap-2">
                    Acceder a Tableros
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent group-hover:translate-x-full transition-transform duration-700 skew-x-12 pointer-events-none"
                  />
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} transition={springTransition}>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base font-semibold border-slate-300 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 btn-magnetic"
              >
                <Link href="/login">
                  <LogIn className="h-5 w-5" />
                  Ingresar al sistema
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* DIVIDER animado */}
          <motion.div variants={fadeUpSpring} className="pt-4">
            <motion.div
              animate={{ scaleY: [0, 1, 1, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              className="w-0.5 h-14 bg-gradient-to-b from-blue-500 via-violet-500 to-transparent rounded-full mx-auto"
            />
          </motion.div>

          {/* STATS PANEL */}
          <motion.div variants={scaleInSpring} className="w-full">
            <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg">
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-slate-200">
                {STATS.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    variants={{
                      hidden: { opacity: 0, scale: 0.9 },
                      show: {
                        opacity: 1, scale: 1,
                        transition: { type: "spring", stiffness: 100, damping: 12, delay: i * 0.08 },
                      },
                    }}
                    className="px-6 py-5 text-center hover:bg-blue-50 transition-colors duration-300 group"
                  >
                    <motion.p
                      className="text-3xl sm:text-4xl font-black text-blue-700 tabular-nums group-hover:scale-105 transition-transform duration-200"
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-xs text-slate-500 mt-2 font-medium tracking-wide uppercase">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

        </motion.div>
      </div>

      {/* SCROLL INDICATOR */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Desplázate
          </span>
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-slate-300 rounded-full flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-blue-500 rounded-full"
            />
          </motion.div>
        </div>
      </motion.div>

    </section>
  )
}
