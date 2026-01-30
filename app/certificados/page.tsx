"use client";

import { useState } from "react";
import { CiudadaniaLayout } from "@/components/layouts/ciudadania-layout";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Download,
  Calendar,
  Shield,
  ArrowRight,
  BookOpen,
  X,
} from "lucide-react";
import {
  currentMockUser,
  mockCertificados,
  mockTrayectos,
} from "@/lib/mock/ciudadania-data";

export default function CertificadosPage() {
  const [selectedCertificado, setSelectedCertificado] = useState<string | null>(
    null
  );

  const userCertificados = mockCertificados.filter(
    (c) => c.usuarioId === currentMockUser.id
  );

  const certificado = selectedCertificado
    ? mockCertificados.find((c) => c.id === selectedCertificado)
    : null;
  const trayecto = certificado
    ? mockTrayectos.find((t) => t.id === certificado.trayectoId)
    : null;

  // Certificate preview modal
  if (selectedCertificado && certificado) {
    return (
      <CiudadaniaLayout>
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-auto dark:bg-card">
            {/* Close button */}
            <div className="flex justify-end p-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedCertificado(null)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Certificate */}
            <div className="px-8 pb-8">
              <div className="border-8 border-double border-sky-200 rounded-lg p-8 bg-gradient-to-br from-sky-50 to-white dark:border-sky-700 dark:bg-gradient-to-br dark:from-primary/10 dark:to-transparent">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white dark:from-primary dark:to-secondary">
                      <Award className="h-10 w-10" />
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold text-sky-800 mb-2 dark:text-foreground">
                    Certificado de Ciudadanía Digital
                  </h1>
                  <p className="text-muted-foreground">
                    Secretaría de Estado de Participación Ciudadana
                  </p>
                </div>

                {/* Content */}
                <div className="text-center mb-8">
                  <p className="text-muted-foreground mb-2">
                    Se certifica que
                  </p>
                  <p className="text-2xl font-bold text-foreground mb-4">
                    {certificado.nombreUsuario}
                  </p>
                  <p className="text-muted-foreground mb-2">
                    ha completado satisfactoriamente el trayecto formativo
                  </p>
                  <p
                    className="text-xl font-semibold mb-4"
                    style={{ ['--accent' as any]: trayecto?.color, color: 'var(--accent)' } as React.CSSProperties}
                  >
                    {certificado.tituloTrayecto}
                  </p>
                  <p className="text-muted-foreground">
                    demostrando conocimientos y habilidades en ciudadanía
                    digital
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-8 border-t border-sky-100 dark:border-sky-700">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Fecha de emisión
                    </p>
                    <p className="font-medium">
                      {new Date(certificado.fechaEmision).toLocaleDateString(
                        "es-AR",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Código de verificación
                    </p>
                    <p className="font-mono font-medium">
                      {certificado.codigoVerificacion}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
                <div className="flex justify-center gap-4 mt-6">
                <Button className="gap-2 bg-sky-600 hover:bg-sky-700 text-white dark:bg-primary dark:hover:bg-primary/90 dark:text-white">
                  <Download className="h-4 w-4" />
                  Descargar PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedCertificado(null)}
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CiudadaniaLayout>
    );
  }

  return (
    <CiudadaniaLayout>
      {/* Header */}
      <section className="bg-gradient-to-b from-purple-50 to-white dark:from-primary/10 dark:to-transparent py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center dark:bg-card dark:text-primary">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Certificados
              </h1>
              <p className="text-muted-foreground">
                {userCertificados.length} certificados obtenidos
              </p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Tus certificados de Ciudadano/a Digital acreditan los conocimientos
            y habilidades que adquiriste en cada trayecto formativo.
          </p>
        </div>
      </section>

      {/* Certificates */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {userCertificados.length === 0 ? (
            <Card className="border-none shadow-sm transition-smooth animate-fade-up reveal">
              <CardContent className="p-12 text-center">
                <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Todavía no tenés certificados
                </h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Completá un trayecto formativo y aprobá la evaluación final
                  para obtener tu certificado de Ciudadano/a Digital.
                </p>
                <Link href="/trayectos">
                  <Button className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                    Explorar trayectos
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {userCertificados.map((cert) => {
                  const certTrayecto = mockTrayectos.find(
                    (t) => t.id === cert.trayectoId
                  );

                  return (
                    <Card
                      key={cert.id}
                      className="border-none shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                      onClick={() => setSelectedCertificado(cert.id)}
                    >
                      <div
                        className="h-2"
                        style={{ backgroundColor: certTrayecto?.color }}
                      />
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className="h-12 w-12 rounded-xl flex items-center justify-center"
                            style={{
                              backgroundColor: `${certTrayecto?.color}15`,
                            }}
                          >
                            <Award
                              className="h-6 w-6"
                              style={{ ['--accent' as any]: certTrayecto?.color, color: 'var(--accent)' } as React.CSSProperties}
                            />
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                          >
                            Verificado
                          </Badge>
                        </div>

                        <h2 className="font-semibold text-foreground mb-2">
                          {cert.tituloTrayecto}
                        </h2>

                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <p className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(cert.fechaEmision).toLocaleDateString(
                              "es-AR"
                            )}
                          </p>
                          <p className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            {cert.codigoVerificacion}
                          </p>
                        </div>

                        <Button
                          className="w-full gap-2 bg-transparent"
                          variant="outline"
                          style={{
                            borderColor: certTrayecto?.color,
                            color: certTrayecto?.color,
                          }}
                        >
                          Ver certificado
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Pending certificates */}
              {currentMockUser.trayectosIniciados.length >
                currentMockUser.trayectosCompletados.length && (
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Trayectos en progreso
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockTrayectos
                      .filter(
                        (t) =>
                          currentMockUser.trayectosIniciados.includes(t.id) &&
                          !currentMockUser.trayectosCompletados.includes(t.id)
                      )
                      .map((trayecto) => (
                        <Card
                          key={trayecto.id}
                          className="border-none shadow-sm border-l-4"
                          style={{ borderLeftColor: trayecto.color }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <BookOpen
                                  className="h-5 w-5"
                                  style={{ ['--accent' as any]: trayecto.color, color: 'var(--accent)' } as React.CSSProperties}
                                />
                                <div>
                                  <p className="font-medium text-foreground">
                                    {trayecto.titulo}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Completá el trayecto para obtener el
                                    certificado
                                  </p>
                                </div>
                              </div>
                              <Link href={`/trayectos/${trayecto.slug}`}>
                                <Button size="sm" variant="ghost">
                                  Continuar
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </CiudadaniaLayout>
  );
}
