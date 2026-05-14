"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, TrendingUp, Users, MapPin, BarChart3 } from "lucide-react"
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
    transition: { staggerChildren: 0.1, delayChildren: 0.08, ease: "easeOut" },
  },
}

const fadeUpSpring = {
  hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
  show: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { type: "spring", stiffness: 120, damping: 14, mass: 0.7 },
  },
}

const scaleInSpring = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1, scale: 1,
    transition: springTransition,
  },
}

const STATS = [
  { value: "9.033", label: "Personas alcanzadas", icon: Users, color: "cyan" },
  { value: "106",   label: "Actividades registradas", icon: BarChart3, color: "violet" },
  { value: "17",    label: "Localidades y municipios", icon: MapPin, color: "emerald" },
  { value: "85",    label: "Personas por actividad (prom)", icon: TrendingUp, color: "amber" },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center justify-center bg-hero-premium">
      {/* ── GRAIN & GRID ── */}
      <div className="bg-noise" />
      <div className="absolute inset-0 bg-grid opacity-30" />

      {/* ── AMBIENT GLOWS ── */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[150px]" />

      {/* ── MAIN CONTENT ── */}
      <div className="container mx-auto px-4 relative z-10 py-8 lg:py-0 lg:min-h-[calc(100vh-64px)] lg:flex lg:items-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center space-y-6 lg:space-y-5 max-w-5xl mx-auto w-full"
        >
          {/* BADGE */}
          <motion.div variants={fadeUpSpring}>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-cyan-500/20 bg-cyan-500/5 shadow-lg shadow-cyan-500/10 backdrop-blur-sm">
              <motion.span
                className="relative flex h-2 w-2"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-40" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </motion.span>
              <span className="text-cyan-300 text-xs font-semibold tracking-wider uppercase">
                Secretaría de Estado · Tucumán · Sistema de Gestión
              </span>
              <Sparkles className="h-4 w-4 text-cyan-400" />
            </div>
          </motion.div>

          {/* TÍTULO */}
          <motion.div variants={fadeUpSpring} className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.05] text-balance">
              <span className="block text-slate-100">Gestión Inteligente</span>
              <motion.span
                className="block text-gradient text-glow"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  textShadow: ["0 0 40px rgba(34,211,238,0.3)", "0 0 60px rgba(168,85,247,0.4)", "0 0 40px rgba(34,211,238,0.3)"]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                de Datos y Resultados
              </motion.span>
            </h1>
          </motion.div>

          {/* SUBTÍTULO */}
          <motion.div variants={fadeUpSpring} className="max-w-2xl">
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
              Visualización de datos transparentes y gestión estratégica de resultados territoriales para decisiones fundamentadas.
            </p>
            <p className="text-slate-500 font-medium mt-2 text-sm italic">
              "Dr. José Farhat — Secretario de Estado de Participación Ciudadana"
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeUpSpring}>
            <motion.div whileHover={{ y: -4 }} whileTap={{ scale: 0.95 }} transition={springTransition}>
              <Button
                asChild
                size="lg"
                className="text-base font-semibold btn-magnetic relative group overflow-hidden bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-lg shadow-cyan-500/25 px-8"
              >
                <Link href="/dashboard/estadisticas">
                  <span className="relative z-10 flex items-center gap-2">
                    Acceder a Tableros
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </span>
                  <span
                    aria-hidden
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-full transition-transform duration-700 skew-x-12 pointer-events-none"
                  />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* DIVIDER */}
          <motion.div variants={fadeUpSpring}>
            <motion.div
              animate={{ scaleY: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              className="w-0.5 h-12 bg-gradient-to-b from-cyan-500 via-violet-500 to-transparent rounded-full mx-auto"
            />
          </motion.div>

          {/* STATS PANEL */}
          <motion.div variants={scaleInSpring} className="w-full">
            <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-slate-800/50 bg-slate-900/30 backdrop-blur-sm card-glow">
              <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-800/50">
                {STATS.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    variants={{
                      hidden: { opacity: 0, scale: 0.9 },
                      show: {
                        opacity: 1, scale: 1,
                        transition: { type: "spring", stiffness: 100, damping: 12, delay: i * 0.1 },
                      },
                    }}
                    className="px-4 py-4 text-center hover:bg-cyan-500/5 transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500
                      ${stat.color === 'cyan' ? 'from-cyan-500/10 to-transparent' : 
                        stat.color === 'violet' ? 'from-violet-500/10 to-transparent' :
                        stat.color === 'emerald' ? 'from-emerald-500/10 to-transparent' :
                        'from-amber-500/10 to-transparent'}`} 
                    />
                    <stat.icon className={`w-5 h-5 mx-auto mb-2 transition-all duration-300 group-hover:scale-110
                      ${stat.color === 'cyan' ? 'text-cyan-400' : 
                        stat.color === 'violet' ? 'text-violet-400' :
                        stat.color === 'emerald' ? 'text-emerald-400' :
                        'text-amber-400'}`} 
                    />
                    <motion.p
                      className="metric-value text-2xl sm:text-3xl font-black"
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-[10px] sm:text-xs text-slate-500 mt-1 font-medium tracking-wide uppercase leading-tight">
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
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Desplázate
          </span>
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1, 0.9] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border border-slate-700 rounded-full flex items-start justify-center p-2 bg-slate-900/30 backdrop-blur-sm"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-cyan-500 rounded-full shadow-lg shadow-cyan-500/50"
            />
          </motion.div>
        </div>
      </motion.div>

    </section>
  )
}