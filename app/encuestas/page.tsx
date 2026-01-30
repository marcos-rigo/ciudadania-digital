"use client";

import { useState } from "react";
import { CiudadaniaLayout } from "@/components/layouts/ciudadania-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileQuestion,
  ExternalLink,
  Calendar,
  Users,
  CheckCircle,
} from "lucide-react";
import { mockEncuestas } from "@/lib/mock/ciudadania-data";

export default function EncuestasPage() {
  const [selectedEncuesta, setSelectedEncuesta] = useState<string | null>(null);

  const encuestasActivas = mockEncuestas.filter((e) => e.activa);
  const encuestasCompletadas = mockEncuestas.filter((e) => !e.activa);

  // Mock: user has responded to some surveys
  const encuestasRespondidas = ["encuesta-1", "encuesta-3"];

  const encuesta = selectedEncuesta
    ? mockEncuestas.find((e) => e.id === selectedEncuesta)
    : null;

  if (selectedEncuesta && encuesta) {
    return (
      <CiudadaniaLayout>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => setSelectedEncuesta(null)}
            className="mb-6"
          >
            Volver a encuestas
          </Button>

          <Card className="border-none shadow-sm mb-6">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    {encuesta.titulo}
                  </h1>
                  <p className="text-muted-foreground">{encuesta.descripcion}</p>
                </div>
                <Badge
                  variant={encuesta.activa ? "default" : "secondary"}
                  className={
                        encuesta.activa
                          ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/10 dark:text-green-300 dark:hover:bg-green-900/10"
                          : ""
                  }
                >
                  {encuesta.activa ? "Activa" : "Cerrada"}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Creada: {new Date(encuesta.fechaCreacion).toLocaleDateString("es-AR")}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {encuesta.respuestas} respuestas
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Embed iframe */}
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="aspect-[4/3] bg-muted dark:bg-muted/20">
              {encuesta.activa ? (
                <iframe
                  src={encuesta.embedUrl}
                  className="w-full h-full border-0"
                  title={encuesta.titulo}
                >
                  Cargando encuesta...
                </iframe>
              ) : (
                <div className="h-full flex items-center justify-center text-center p-8">
                  <div>
                    <FileQuestion className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Encuesta cerrada
                    </h3>
                    <p className="text-muted-foreground">
                      Esta encuesta ya no está aceptando respuestas.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </CiudadaniaLayout>
    );
  }

  return (
    <CiudadaniaLayout>
      {/* Header */}
      <section className="bg-gradient-to-b from-amber-50 to-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <FileQuestion className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Encuestas
              </h1>
              <p className="text-muted-foreground">
                {encuestasActivas.length} encuestas activas
              </p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Tu opinión nos ayuda a mejorar. Completá las encuestas para compartir
            tu experiencia y sugerencias sobre la plataforma y los contenidos.
          </p>
        </div>
      </section>

      {/* Encuestas */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="activas" className="space-y-6">
            <TabsList>
              <TabsTrigger value="activas">
                Activas ({encuestasActivas.length})
              </TabsTrigger>
              <TabsTrigger value="historial">
                Mi historial ({encuestasRespondidas.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="activas">
              {encuestasActivas.length === 0 ? (
                <Card className="border-none shadow-sm">
                  <CardContent className="p-12 text-center">
                    <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No hay encuestas activas
                    </h3>
                    <p className="text-muted-foreground">
                      Volvé pronto para participar en nuevas encuestas.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {encuestasActivas.map((enc) => {
                    const isResponded = encuestasRespondidas.includes(enc.id);

                    return (
                      <Card
                        key={enc.id}
                        className="border-none shadow-sm hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                  Activa
                                </Badge>
                                {isResponded && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-sky-100 text-sky-700"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Respondida
                                  </Badge>
                                )}
                              </div>
                              <h2 className="font-semibold text-foreground mb-2">
                                {enc.titulo}
                              </h2>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {enc.descripcion}
                              </p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                              <FileQuestion className="h-5 w-5" />
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(enc.fechaCreacion).toLocaleDateString("es-AR")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {enc.respuestas} respuestas
                            </span>
                          </div>

                          <Button
                            onClick={() => setSelectedEncuesta(enc.id)}
                            className="w-full gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                          >
                            {isResponded ? "Ver encuesta" : "Completar encuesta"}
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="historial">
              {encuestasRespondidas.length === 0 ? (
                <Card className="border-none shadow-sm">
                  <CardContent className="p-12 text-center">
                    <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No respondiste ninguna encuesta
                    </h3>
                    <p className="text-muted-foreground">
                      Completá encuestas activas para ver tu historial aquí.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockEncuestas
                    .filter((e) => encuestasRespondidas.includes(e.id))
                    .map((enc) => (
                      <Card
                        key={enc.id}
                        className="border-none shadow-sm"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="h-5 w-5" />
                            </div>
                            <div>
                              <h2 className="font-semibold text-foreground mb-1">
                                {enc.titulo}
                              </h2>
                              <p className="text-sm text-muted-foreground">
                                Respondida el{" "}
                                {new Date().toLocaleDateString("es-AR")}
                              </p>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground">
                            Gracias por tu participación.
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </CiudadaniaLayout>
  );
}
