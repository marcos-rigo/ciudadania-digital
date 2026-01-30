"use client";

import { CiudadaniaLayout } from "@/components/layouts/ciudadania-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  BookOpen,
  Play,
  Users,
  Shield,
  MessageCircle,
  Award,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { mockTrayectos, mockEstadisticas } from "@/lib/mock/ciudadania-data";
import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/use-in-view";

export default function CiudadaniaDigitalPage() {
  const { ref: heroRef, inView: heroInView } = useInView<HTMLDivElement>();
  const heroBgRef = useRef<HTMLDivElement | null>(null);
  const heroContentRef = useRef<HTMLDivElement | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const m = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(!!m && m.matches);
  }, []);

  function handleHeroMove(e: React.MouseEvent) {
    if (prefersReducedMotion) return;
    const el = heroBgRef.current;
    const content = heroContentRef.current;
    if (!el || !content) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width; // -0.5..0.5
    const dy = (e.clientY - cy) / rect.height;
    const tx = dx * 10; // px
    const ty = dy * 8;
    el.style.transform = `translate(${tx}px, ${ty}px) rotate(${dx * 2}deg)`;
    content.style.transform = `translate(${tx / 2}px, ${ty / 2}px)`;
  }

  function handleHeroLeave() {
    if (heroBgRef.current) heroBgRef.current.style.transform = "none";
    if (heroContentRef.current) heroContentRef.current.style.transform = "none";
  }

  function FeatureCard({ item }: { item: any }) {
    const { ref, inView } = useInView<HTMLDivElement>();
    return (
      <div ref={ref as any} className={`bg-white dark:bg-sidebar border-none shadow-sm transition-smooth ${inView ? 'animate-fade-up' : 'reveal'} hover-lift`}>
        <Card className="h-full">
          <CardContent className="p-6">
            <div
              className={`h-12 w-12 rounded-xl ${item.color} text-white flex items-center justify-center mb-4 parallax-translate`}>
              <item.icon className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {item.description}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  function TrayectoCard({ trayecto }: { trayecto: any }) {
    const { ref, inView } = useInView<HTMLDivElement>();
    return (
      <Link href={`/trayectos/${trayecto.slug}`} className="group" aria-label={trayecto.titulo}>
        <div ref={ref as any} className={`h-full border-none shadow-sm transition-smooth ${inView ? 'animate-fade-up' : 'reveal'} hover-lift`}>
          <Card className="h-full overflow-hidden dark:bg-sidebar">
            <div className="h-2" style={{ ['--accent' as any]: trayecto.color, ['--accent-10' as any]: `${trayecto.color}10`, backgroundColor: 'var(--accent)' } as React.CSSProperties} />
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="inline-block px-2 py-1 rounded text-xs font-medium mb-2" style={{ ['--accent' as any]: trayecto.color, ['--accent-15' as any]: `${trayecto.color}15`, backgroundColor: 'var(--accent-15)', color: 'var(--accent)' } as React.CSSProperties}>
                    {trayecto.nivel}
                  </span>
                  <h3 className="font-semibold text-foreground group-hover:text-sky-600 transition-colors">{trayecto.titulo}</h3>
                </div>
                <BookOpen className="h-5 w-5 text-muted-foreground flex-shrink-0" style={{ ['--accent' as any]: trayecto.color, color: 'var(--accent)' } as React.CSSProperties} />
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{trayecto.descripcion}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{trayecto.duracion}</span>
                <span>{trayecto.contenidosTotal} contenidos</span>
                <span>{trayecto.modulos.length} módulos</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </Link>
    );
  }
  const { ref: previewRef, inView: previewInView } = useInView<HTMLDivElement>();
  const { ref: statsRef, inView: statsInView } = useInView<HTMLDivElement>();
  return (
    <CiudadaniaLayout>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 dark:from-primary dark:via-secondary dark:to-accent text-white"
        onMouseMove={handleHeroMove}
        onMouseLeave={handleHeroLeave}
      >
        {/* Background pattern */}
        <div ref={heroBgRef} className="absolute inset-0 opacity-10 parallax-translate">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="hero-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="currentColor" />
              </pattern>
            </defs>
            <rect fill="url(#hero-pattern)" width="100" height="100" />
          </svg>
        </div>

        <div
          ref={heroRef}
          className={`relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28 transition-smooth ${
            heroInView ? "animate-fade-up" : "reveal"
          }`}
          >
          <div className="max-w-3xl">
            <div
              ref={heroContentRef}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-4 py-2 text-sm mb-6 parallax-translate"
            >
              <Sparkles className="h-4 w-4" />
              Plataforma gratuita de formación
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-balance">
              Formate en Ciudadanía Digital
            </h1>
            <p className="text-xl text-sky-100 dark:text-sky-100 mb-8 max-w-2xl text-pretty">
              Aprender, participar y cuidarnos en entornos digitales. Descubrí
              tus derechos, desarrollá habilidades y contribuí a un entorno
              digital más seguro y participativo.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/trayectos">
                <Button
                  size="lg"
                  className="bg-white text-sky-700 hover:bg-sky-50 dark:bg-primary-foreground dark:text-primary dark:hover:bg-primary-foreground/90 gap-2"
                >
                  Empezar mi trayecto
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contenidos/videos">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 dark:border-white/20 text-white hover:bg-white/10 dark:hover:bg-white/10 gap-2 bg-transparent"
                >
                  <Play className="h-4 w-4" />
                  Ver contenidos
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 50L48 45.8C96 41.7 192 33.3 288 37.5C384 41.7 480 58.3 576 62.5C672 66.7 768 58.3 864 50C960 41.7 1056 33.3 1152 33.3C1248 33.3 1344 41.7 1392 45.8L1440 50V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z"
              className="fill-sky-50 dark:fill-background"
            />
          </svg>
        </div>
      </section>

      {/* What is digital citizenship */}
      <section className="py-16 lg:py-24 bg-sky-50 dark:bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              ¿Qué es la Ciudadanía Digital?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Es el conjunto de conocimientos, habilidades y actitudes que nos
              permiten participar de manera responsable, segura y ética en el
              mundo digital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Derechos Digitales",
                description:
                  "Conocé tus derechos en internet: privacidad, acceso a la información y libertad de expresión.",
                color: "bg-blue-500",
              },
              {
                icon: Users,
                title: "Convivencia",
                description:
                  "Aprendé a relacionarte de forma respetuosa y constructiva en espacios digitales.",
                color: "bg-green-500",
              },
              {
                icon: MessageCircle,
                title: "Participación",
                description:
                  "Descubrí cómo usar las herramientas digitales para participar activamente en tu comunidad.",
                color: "bg-purple-500",
              },
              {
                icon: CheckCircle,
                title: "Responsabilidad",
                description:
                  "Desarrollá hábitos seguros y responsables para protegerte y proteger a otros.",
                color: "bg-orange-500",
              },
            ].map((item) => (
              <FeatureCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-16 lg:py-24 bg-white dark:bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Cómo funciona
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tres pasos simples para obtener tu certificado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              {
                number: 1,
                title: "Registrate",
                description: "Crea tu cuenta en la plataforma de forma gratuita",
              },
              {
                number: 2,
                title: "Completá módulos",
                description: "Accedé a videos, podcast y actividades breves",
              },
              {
                number: 3,
                title: "Obtené tu certificado",
                description: "Descargá tu certificado al finalizar cada trayecto",
              },
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="h-14 w-14 rounded-full bg-sky-600 dark:bg-primary text-white flex items-center justify-center font-bold text-lg mb-4 flex-shrink-0">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 text-lg">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-7 left-[60%] w-[calc(40%-2rem)] h-0.5 bg-gradient-to-r from-sky-600 dark:from-primary to-sky-200 dark:to-primary/50" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trayectos formativos */}
      <section className="py-16 lg:py-24 bg-background dark:bg-card/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Trayectos Formativos
              </h2>
              <p className="text-muted-foreground">
                Elegí tu camino de aprendizaje según tu nivel e intereses
              </p>
            </div>
            <Link href="/trayectos">
              <Button variant="outline" className="gap-2 bg-transparent dark:border-border/60 dark:hover:bg-card">
                Ver todos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockTrayectos.slice(0, 4).map((trayecto) => (
              <TrayectoCard key={trayecto.id} trayecto={trayecto} />
            ))}
          </div>
        </div>
      </section>

      {/* Content preview */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-white dark:from-background to-sky-50 dark:to-card/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Videos, Podcast y Actividades
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Contenidos educativos pensados para que aprendas a tu ritmo, desde
              cualquier lugar
            </p>
          </div>

          <div ref={previewRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className={`bg-white dark:bg-sidebar border-none shadow-sm transition-smooth ${previewInView ? 'animate-fade-up' : 'reveal'} hover-lift`}>
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
                  <Play className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Videos Educativos
                </h3>
                <p className="text-muted-foreground mb-4">
                  {mockEstadisticas.videosDisponibles} videos sobre ciudadanía
                  digital, seguridad y participación
                </p>
                <Link href="/contenidos/videos">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    Explorar videos
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className={`bg-white dark:bg-sidebar border-none shadow-sm transition-smooth ${previewInView ? 'animate-fade-up' : 'reveal'} hover-lift`}>
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Podcast
                </h3>
                <p className="text-muted-foreground mb-4">
                  {mockEstadisticas.podcastsDisponibles} episodios con expertos
                  y testimonios
                </p>
                <Link href="/contenidos/podcast">
                  <Button variant="outline" className="gap-2 bg-transparent dark:border-border/60 dark:hover:bg-card">
                    Escuchar podcast
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className={`bg-white dark:bg-sidebar border-none shadow-sm transition-smooth ${previewInView ? 'animate-fade-up' : 'reveal'} hover-lift`}>
              <CardContent className="p-8 text-center">
                <div className="h-16 w-16 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Certificación
                </h3>
                <p className="text-muted-foreground mb-4">
                  Obtené tu certificado de Ciudadano/a Digital al completar los
                  trayectos
                </p>
                <Link href="/certificados">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    Ver certificados
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact section */}
      <section className="py-16 lg:py-24 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 dark:from-primary dark:via-secondary dark:to-accent rounded-3xl p-8 lg:p-12 text-white">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Impacto Social</h2>
              <p className="text-sky-100 dark:text-sky-100 max-w-2xl mx-auto">
                Juntos estamos construyendo una comunidad digital más informada,
                segura y participativa
              </p>
            </div>

            <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  value: mockEstadisticas.usuariosRegistrados.toString(),
                  label: "Ciudadanos formándose",
                },
                {
                  value: mockEstadisticas.trayectosCompletados.toString(),
                  label: "Trayectos completados",
                },
                {
                  value: mockEstadisticas.certificadosEmitidos.toString(),
                  label: "Certificados emitidos",
                },
                {
                  value: mockEstadisticas.videosVistos.toString(),
                  label: "Contenidos vistos",
                },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className={`text-4xl lg:text-5xl font-bold mb-2 transition-smooth ${statsInView ? 'animate-fade-up' : 'reveal'}`}>
                    {stat.value}
                  </p>
                  <p className="text-sm text-sky-200 dark:text-sky-200">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-sky-50 dark:bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            ¿Listo/a para comenzar?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            La ciudadanía digital se aprende, se practica y se construye
            colectivamente. Tu participación importa.
          </p>
          <Link href="/trayectos">
            <Button
              size="lg"
              className="bg-sky-600 hover:bg-sky-700 dark:bg-primary dark:hover:bg-primary/90 text-white gap-2"
            >
              Comenzar ahora
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </CiudadaniaLayout>
  );
}
