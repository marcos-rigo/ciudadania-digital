"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CiudadaniaLayout } from "@/components/layouts/ciudadania-layout";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  ClipboardCheck,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  BookOpen,
  AlertCircle,
  Trophy,
} from "lucide-react";
import {
  mockEvaluaciones,
  mockTrayectos,
  currentMockUser,
} from "@/lib/mock/ciudadania-data";
import type { Pregunta } from "@/lib/types-ciudadania";

function EvaluacionesContent() {
  const searchParams = useSearchParams();
  const trayectoParam = searchParams.get("trayecto");
  
  const [selectedEvaluacion, setSelectedEvaluacion] = useState<string | null>(
    trayectoParam
      ? mockEvaluaciones.find((e) => e.trayectoId === trayectoParam)?.id || null
      : null
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number | boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  const evaluacion = selectedEvaluacion
    ? mockEvaluaciones.find((e) => e.id === selectedEvaluacion)
    : null;
  const trayecto = evaluacion
    ? mockTrayectos.find((t) => t.id === evaluacion.trayectoId)
    : null;

  const handleAnswer = (questionId: string, answer: string | number | boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (evaluacion && currentQuestion < evaluacion.preguntas.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!evaluacion) return 0;
    let correct = 0;
    let total = 0;

    for (const pregunta of evaluacion.preguntas) {
      if (pregunta.tipo === "reflexiva") continue;
      total++;
      const answer = answers[pregunta.id];
      if (pregunta.tipo === "multiple" && answer === pregunta.respuestaCorrecta) {
        correct++;
      } else if (
        pregunta.tipo === "verdadero_falso" &&
        answer === pregunta.respuestaCorrecta
      ) {
        correct++;
      }
    }

    return total > 0 ? Math.round((correct / total) * 100) : 0;
  };

  const renderQuestion = (pregunta: Pregunta) => {
    switch (pregunta.tipo) {
      case "multiple":
        return (
          <RadioGroup
            value={answers[pregunta.id]?.toString()}
            onValueChange={(value) =>
              handleAnswer(pregunta.id, Number.parseInt(value))
            }
          >
            <div className="space-y-3">
              {pregunta.opciones.map((opcion, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 rounded-lg border border-muted hover:border-sky-300 hover:bg-sky-50/50 dark:hover:bg-card/50 transition-colors"
                >
                  <RadioGroupItem value={index.toString()} id={`q-${pregunta.id}-${index}`} />
                  <Label
                    htmlFor={`q-${pregunta.id}-${index}`}
                    className="flex-1 cursor-pointer"
                  >
                    {opcion}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        );

      case "verdadero_falso":
        return (
          <RadioGroup
            value={answers[pregunta.id]?.toString()}
            onValueChange={(value) => handleAnswer(pregunta.id, value === "true")}
          >
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-4 rounded-lg border border-muted hover:border-sky-300 hover:bg-sky-50/50 dark:hover:bg-card/50 transition-colors">
                <RadioGroupItem value="true" id={`q-${pregunta.id}-true`} />
                <Label htmlFor={`q-${pregunta.id}-true`} className="flex-1 cursor-pointer">
                  Verdadero
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 rounded-lg border border-muted hover:border-sky-300 hover:bg-sky-50/50 dark:hover:bg-card/50 transition-colors">
                <RadioGroupItem value="false" id={`q-${pregunta.id}-false`} />
                <Label htmlFor={`q-${pregunta.id}-false`} className="flex-1 cursor-pointer">
                  Falso
                </Label>
              </div>
            </div>
          </RadioGroup>
        );

      case "reflexiva":
        return (
          <Textarea
            placeholder="Escribí tu reflexión aquí..."
            value={(answers[pregunta.id] as string) || ""}
            onChange={(e) => handleAnswer(pregunta.id, e.target.value)}
            rows={4}
            className="resize-none"
          />
        );

      default:
        return null;
    }
  };

  // Show results
  if (showResults && evaluacion) {
    const score = calculateScore();
    const passed = score >= 60;

    return (
      <CiudadaniaLayout>
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
          <Card className="border-none shadow-lg overflow-hidden">
            <div
              className={`p-8 text-center text-white ${passed ? "bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700" : "bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700"}`}
            >
              {passed ? (
                <Trophy className="h-16 w-16 mx-auto mb-4" />
              ) : (
                <AlertCircle className="h-16 w-16 mx-auto mb-4" />
              )}
              <h1 className="text-3xl font-bold mb-2">
                {passed ? "¡Felicitaciones!" : "Seguí practicando"}
              </h1>
              <p className="text-lg opacity-90">
                {passed
                  ? "Completaste la evaluación exitosamente"
                  : "No alcanzaste el puntaje mínimo"}
              </p>
            </div>
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <p className="text-5xl font-bold text-foreground mb-2">{score}%</p>
                <p className="text-muted-foreground">Puntaje obtenido</p>
                <Progress
                  value={score}
                  className={`mt-4 h-3 ${passed ? "[&>div]:bg-green-500" : "[&>div]:bg-orange-500"}`}
                />
              </div>

              <div className="bg-muted/50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-foreground mb-2">
                  Mensaje educativo
                </h3>
                <p className="text-muted-foreground">
                  {passed
                    ? "¡Excelente trabajo! Demostraste un buen entendimiento de los conceptos de ciudadanía digital. Seguí aplicando estos conocimientos en tu vida cotidiana y compartí lo aprendido con otros."
                    : "No te desanimes. Revisá los contenidos del trayecto nuevamente y volvé a intentar la evaluación. Cada intento es una oportunidad para aprender más."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {passed && trayecto && (
                  <Link href="/certificados" className="flex-1">
                    <Button className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white">
                      Ver mi certificado
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                {!passed && trayecto && (
                  <Link href={`/trayectos/${trayecto.slug}`} className="flex-1">
                    <Button className="w-full gap-2 bg-transparent" variant="outline">
                      Revisar contenidos
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowResults(false);
                    setIsStarted(false);
                    setCurrentQuestion(0);
                    setAnswers({});
                    setSelectedEvaluacion(null);
                  }}
                  className="flex-1"
                >
                  Volver a evaluaciones
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </CiudadaniaLayout>
    );
  }

  // Taking evaluation
  if (isStarted && evaluacion) {
    const pregunta = evaluacion.preguntas[currentQuestion];
    const progress = ((currentQuestion + 1) / evaluacion.preguntas.length) * 100;

    return (
      <CiudadaniaLayout>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                Pregunta {currentQuestion + 1} de {evaluacion.preguntas.length}
              </span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question card */}
          <Card className="border-none shadow-sm mb-6">
            <CardContent className="p-8">
              <Badge
                variant="outline"
                className="mb-4"
                style={{
                  borderColor: trayecto?.color,
                  color: trayecto?.color,
                }}
              >
                {pregunta.tipo === "multiple"
                  ? "Opción múltiple"
                  : pregunta.tipo === "verdadero_falso"
                    ? "Verdadero o Falso"
                    : "Pregunta reflexiva"}
              </Badge>
              <h2 className="text-xl font-semibold text-foreground mb-6">
                {pregunta.pregunta}
              </h2>
              {renderQuestion(pregunta)}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentQuestion === 0}
              className="gap-2 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </Button>

            {currentQuestion === evaluacion.preguntas.length - 1 ? (
              <Button
                onClick={handleSubmit}
                className="gap-2 bg-sky-600 hover:bg-sky-700 text-white"
              >
                Finalizar evaluación
                <CheckCircle className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={answers[pregunta.id] === undefined}
                className="gap-2"
              >
                Siguiente
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CiudadaniaLayout>
    );
  }

  // Evaluation selection / start screen
  if (evaluacion && !isStarted) {
    return (
      <CiudadaniaLayout>
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/evaluaciones"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
            onClick={() => setSelectedEvaluacion(null)}
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a evaluaciones
          </Link>

          <Card className="border-none shadow-lg">
            <div
              className="h-3"
              style={{ backgroundColor: trayecto?.color }}
            />
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div
                  className="h-16 w-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${trayecto?.color}15` }}
                >
                  <ClipboardCheck
                    className="h-8 w-8"
                    style={{ ['--accent' as any]: trayecto?.color, color: 'var(--accent)' } as React.CSSProperties}
                  />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {evaluacion.titulo}
                </h1>
                {trayecto && (
                  <p className="text-muted-foreground">{trayecto.titulo}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {evaluacion.preguntas.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Preguntas</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {evaluacion.tiempoEstimado}
                  </p>
                  <p className="text-sm text-muted-foreground">Tiempo estimado</p>
                </div>
              </div>

              <div className="bg-sky-50 rounded-lg p-4 mb-8">
                <h3 className="font-medium text-foreground mb-2">
                  Instrucciones
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>- Respondé todas las preguntas para completar la evaluación</li>
                  <li>- Necesitás un 60% para aprobar</li>
                  <li>- Tenés {evaluacion.intentosPermitidos} intentos disponibles</li>
                  <li>- Las preguntas reflexivas no tienen respuesta correcta</li>
                </ul>
              </div>

              <Button
                onClick={() => setIsStarted(true)}
                className="w-full gap-2 text-white"
                style={{ backgroundColor: trayecto?.color }}
              >
                Comenzar evaluación
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </CiudadaniaLayout>
    );
  }

  // Evaluation list
  return (
    <CiudadaniaLayout>
      {/* Header */}
      <section className="bg-gradient-to-b from-green-50 to-white py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-xl bg-green-100 text-green-600 dark:bg-green-900/10 dark:text-green-300 flex items-center justify-center">
              <ClipboardCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                Evaluaciones
              </h1>
              <p className="text-muted-foreground">
                {mockEvaluaciones.length} evaluaciones disponibles
              </p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Completá las evaluaciones de cada trayecto para obtener tu
            certificado de Ciudadano/a Digital.
          </p>
        </div>
      </section>

      {/* Evaluations list */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockEvaluaciones.map((eval_) => {
              const evalTrayecto = mockTrayectos.find(
                (t) => t.id === eval_.trayectoId
              );
              const isCompleted = currentMockUser.evaluacionesRealizadas.includes(
                eval_.id
              );

              return (
                <Card
                  key={eval_.id}
                  className="border-none shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className="h-2"
                    style={{ backgroundColor: evalTrayecto?.color }}
                  />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          {isCompleted && (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completada
                            </Badge>
                          )}
                        </div>
                        <h2 className="font-semibold text-foreground mb-1">
                          {eval_.titulo}
                        </h2>
                        {evalTrayecto && (
                          <Link
                            href={`/trayectos/${evalTrayecto.slug}`}
                            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <BookOpen className="h-3 w-3" />
                            {evalTrayecto.titulo}
                          </Link>
                        )}
                      </div>
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${evalTrayecto?.color}15` }}
                      >
                        <ClipboardCheck
                          className="h-5 w-5"
                          style={{ ['--accent' as any]: evalTrayecto?.color, color: 'var(--accent)' } as React.CSSProperties}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span>{eval_.preguntas.length} preguntas</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {eval_.tiempoEstimado}
                      </span>
                    </div>

                    <Button
                      onClick={() => setSelectedEvaluacion(eval_.id)}
                      className="w-full gap-2"
                      variant={isCompleted ? "outline" : "default"}
                      style={
                        !isCompleted
                          ? { backgroundColor: evalTrayecto?.color }
                          : { borderColor: evalTrayecto?.color, color: evalTrayecto?.color }
                      }
                    >
                      {isCompleted ? "Volver a realizar" : "Comenzar"}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </CiudadaniaLayout>
  );
}

function Loading() {
  return null;
}

export default function EvaluacionesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <EvaluacionesContent />
    </Suspense>
  );
}
