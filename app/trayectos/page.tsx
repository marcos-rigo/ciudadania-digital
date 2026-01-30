import React from "react"
import { CiudadaniaLayout } from "@/components/layouts/ciudadania-layout";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Clock,
  PlayCircle,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { mockTrayectos, currentMockUser } from "@/lib/mock/ciudadania-data";

export default function TrayectosPage() {
  return (
    <CiudadaniaLayout>
      {/* Header */}
      <section className="bg-gradient-to-b from-sky-50 to-white py-12 lg:py-16 dark:from-background dark:to-background animate-fade-up">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Trayectos Formativos
            </h1>
            <p className="text-lg text-muted-foreground">
              Elegí tu camino de aprendizaje. Cada trayecto está diseñado para
              que avances a tu propio ritmo, con videos, podcasts y evaluaciones
              que te ayudarán a convertirte en ciudadano/a digital.
            </p>
          </div>
        </div>
      </section>

      {/* Trayectos list */}
      <section className="py-12 bg-background dark:bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {mockTrayectos.map((trayecto) => {
              const isStarted = currentMockUser.trayectosIniciados.includes(
                trayecto.id
              );
              const isCompleted = currentMockUser.trayectosCompletados.includes(
                trayecto.id
              );

              // Mock progress calculation
              const progress = isCompleted
                ? 100
                : isStarted
                  ? Math.floor(Math.random() * 60) + 20
                  : 0;

              return (
                <Card
                  key={trayecto.id}
                  className="overflow-hidden border-none shadow-sm transition-smooth animate-fade-up reveal"
                  style={{ ['--accent' as any]: trayecto.color, ['--accent-15' as any]: `${trayecto.color}15` } as React.CSSProperties}
                >
                  <div
                    className="h-3"
                    style={{ backgroundColor: 'var(--accent)' } as React.CSSProperties}
                  />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="outline"
                            style={{ ['--accent' as any]: trayecto.color, borderColor: 'var(--accent)', color: 'var(--accent)' } as React.CSSProperties}
                          >
                            {trayecto.nivel}
                          </Badge>
                          {isCompleted && (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completado
                            </Badge>
                          )}
                          {isStarted && !isCompleted && (
                            <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-100 dark:bg-sky-900/20 dark:text-sky-300 dark:hover:bg-sky-900/20">
                              En progreso
                            </Badge>
                          )}
                        </div>
                        <h2 className="text-xl font-semibold text-foreground mb-2">
                          {trayecto.titulo}
                        </h2>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {trayecto.descripcion}
                        </p>
                      </div>
                      <div
                        className="h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ ['--accent' as any]: trayecto.color, ['--accent-15' as any]: `${trayecto.color}15`, backgroundColor: 'var(--accent-15)' } as React.CSSProperties}
                      >
                        <BookOpen className="h-6 w-6" style={{ ['--accent' as any]: trayecto.color, color: 'var(--accent)' } as React.CSSProperties} />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {trayecto.duracion}
                      </span>
                      <span className="flex items-center gap-1">
                        <PlayCircle className="h-4 w-4" />
                        {trayecto.contenidosTotal} contenidos
                      </span>
                      <span>{trayecto.modulos.length} módulos</span>
                    </div>

                    {/* Progress */}
                    {isStarted && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-muted-foreground">
                            Progreso
                          </span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <Progress
                          value={progress}
                          className="h-2"
                          style={
                            {
                              "--progress-background": 'var(--accent)',
                            } as React.CSSProperties
                          }
                        />
                      </div>
                    )}

                    {/* Modules preview */}
                    <div className="border-t border-muted pt-4 mb-4">
                      <p className="text-sm font-medium text-foreground mb-2">
                        Módulos del trayecto:
                      </p>
                      <ul className="space-y-1">
                        {trayecto.modulos.slice(0, 3).map((modulo, index) => (
                          <li
                            key={modulo.id}
                            className="text-sm text-muted-foreground flex items-center gap-2"
                          >
                            <span
                              className="h-5 w-5 rounded-full text-xs flex items-center justify-center"
                              style={{ ['--accent' as any]: trayecto.color, ['--accent-15' as any]: `${trayecto.color}15`, backgroundColor: 'var(--accent-15)', color: 'var(--accent)' } as React.CSSProperties}
                            >
                              {index + 1}
                            </span>
                            {modulo.titulo}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action */}
                    <Link href={`/trayectos/${trayecto.slug}`}>
                      <Button
                        className="w-full gap-2"
                        style={{ ['--accent' as any]: trayecto.color, backgroundColor: isCompleted ? 'transparent' : 'var(--accent)', color: isCompleted ? 'var(--accent)' : 'white', borderColor: 'var(--accent)' } as React.CSSProperties}
                        variant={isCompleted ? "outline" : "default"}
                      >
                        {isCompleted
                          ? "Revisar trayecto"
                          : isStarted
                            ? "Continuar"
                            : "Comenzar trayecto"}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Info section */}
      <section className="py-12 bg-sky-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm dark:bg-sidebar transition-smooth animate-fade-up">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              ¿Cómo funcionan los trayectos?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0 font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Elegí tu trayecto
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Seleccioná el tema que más te interese según tu nivel de
                    conocimiento.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0 font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Avanzá a tu ritmo
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Mirá los videos, escuchá los podcasts y completá las
                    actividades cuando quieras.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0 font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">
                    Obtené tu certificado
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Al completar el trayecto y la evaluación, recibí tu
                    certificado digital.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </CiudadaniaLayout>
  );
}
