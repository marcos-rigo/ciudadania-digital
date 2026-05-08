"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
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
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center bg-hero-premium">

      {/* ── GRAIN ── */}
      <div className="bg-noise" />

      {/* ── MAIN CONTENT ── */}
      <div className="container mx-auto px-4 relative z-10 py-8 lg:py-0 lg:min-h-[calc(100vh-64px)] lg:flex lg:items-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center space-y-5 lg:space-y-4 max-w-5xl mx-auto w-full"
        >

          {/* BADGE */}
          <motion.div variants={fadeUpSpring}>
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-blue-500/25 bg-blue-500/8 shadow-sm">
              <motion.span
                className="relative flex h-2 w-2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
              </motion.span>
              <span className="text-blue-700 text-xs font-semibold tracking-wide">
                Secretaría de Estado · Tucumán · Sistema de Gestión
              </span>
              <Sparkles className="h-3 w-3 text-blue-600" />
            </div>
          </motion.div>

          {/* TÍTULO */}
          <motion.div variants={fadeUpSpring} className="space-y-1">
            <h1 className="text-4xl sm:text-6xl lg:text-5xl font-black tracking-tight leading-[1.05] text-balance">
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
            <p className="text-base sm:text-lg lg:text-base text-slate-600 leading-relaxed">
              Visualización de datos transparentes y gestión estratégica de resultados territoriales para decisiones fundamentadas.
            </p>
            <p className="text-slate-400 font-medium mt-1.5 text-sm italic">
              "Dr. José Farhat — Secretario de Estado de Participación Ciudadana"
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUpSpring}>
            <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.95 }} transition={springTransition}>
              <Button
                asChild
                size="lg"
                className="text-base font-semibold btn-magnetic relative group overflow-hidden bg-blue-600 hover:bg-blue-700 text-white shadow-lg px-8"
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
          </motion.div>

          {/* DIVIDER animado */}
          <motion.div variants={fadeUpSpring}>
            <motion.div
              animate={{ scaleY: [0, 1, 1, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              className="w-0.5 h-8 bg-gradient-to-b from-blue-500 via-violet-500 to-transparent rounded-full mx-auto"
            />
          </motion.div>

          {/* STATS PANEL */}
          <motion.div variants={scaleInSpring} className="w-full">
            <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden border border-blue-100/60 bg-white card-glow">
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-slate-100">
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
                    className="px-4 py-3 text-center hover:bg-blue-50/50 transition-colors duration-300 group"
                  >
                    <motion.p
                      className="metric-value text-2xl sm:text-3xl font-black group-hover:scale-105 transition-transform duration-200"
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium tracking-wide uppercase leading-tight">
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
