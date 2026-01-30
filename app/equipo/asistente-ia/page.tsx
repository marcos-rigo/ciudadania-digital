"use client";

import { useState, useRef, useEffect } from "react";
import { AdminLayout } from "@/components/layouts/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bot,
  Send,
  Sparkles,
  FileText,
  BarChart3,
  Map,
  Users,
  Lightbulb,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Loader2,
  MessageSquare,
  History,
  BookOpen,
  ChevronRight,
  Zap,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const sugerenciasRapidas = [
  {
    icon: BarChart3,
    titulo: "Resumen de métricas",
    prompt: "Dame un resumen de las métricas principales del último mes",
  },
  {
    icon: Map,
    titulo: "Análisis territorial",
    prompt: "Analiza la distribución de acciones por departamento",
  },
  {
    icon: FileText,
    titulo: "Generar informe",
    prompt: "Genera un borrador de informe mensual de actividades",
  },
  {
    icon: Users,
    titulo: "Participación ciudadana",
    prompt: "¿Cuáles fueron las acciones con mayor participación?",
  },
  {
    icon: Lightbulb,
    titulo: "Recomendaciones",
    prompt: "Dame recomendaciones para mejorar el alcance territorial",
  },
  {
    icon: BarChart3,
    titulo: "Comparativa",
    prompt: "Compara los resultados de este trimestre con el anterior",
  },
];

const historialConversaciones = [
  { id: "1", titulo: "Análisis de métricas enero", fecha: "Hace 2 horas", mensajes: 8 },
  { id: "2", titulo: "Informe trimestral Q4", fecha: "Ayer", mensajes: 12 },
  { id: "3", titulo: "Distribución por departamento", fecha: "Hace 3 días", mensajes: 5 },
  { id: "4", titulo: "Recomendaciones operativas", fecha: "Hace 1 semana", mensajes: 15 },
];

const respuestasSimuladas: Record<string, string> = {
  "Dame un resumen de las métricas principales del último mes": `## Resumen de Métricas - Enero 2025

### Indicadores Principales

| Métrica | Valor | Variación |
|---------|-------|-----------|
| Acciones realizadas | 127 | +15% |
| Beneficiarios alcanzados | 45,230 | +22% |
| Departamentos cubiertos | 14/17 | 82% |
| Satisfacción ciudadana | 4.6/5 | +0.3 |

### Programas más activos
1. **Tucumán en Territorio** - 45 acciones
2. **Participación Comunitaria** - 38 acciones
3. **Seguridad Ciudadana** - 28 acciones

### Observaciones
- Se observa un incremento significativo en la participación ciudadana
- Los departamentos del sur muestran mayor crecimiento
- Recomendación: Fortalecer presencia en Capital y Yerba Buena`,

  "Analiza la distribución de acciones por departamento": `## Análisis de Distribución Territorial

### Distribución por Departamento

**Alta concentración (>15 acciones)**
- Capital: 23 acciones (18%)
- Yerba Buena: 18 acciones (14%)
- Cruz Alta: 16 acciones (13%)

**Media concentración (8-15 acciones)**
- Lules: 12 acciones
- Famaillá: 10 acciones
- Monteros: 9 acciones

**Baja concentración (<8 acciones)**
- Tafí del Valle: 5 acciones
- Simoca: 4 acciones
- Otros: 30 acciones combinadas

### Mapa de Calor
Las zonas urbanas concentran el 45% de las acciones, mientras que las zonas rurales representan el 55% restante.

### Recomendaciones
1. Incrementar presencia en departamentos del este
2. Fortalecer programas en zonas rurales del sur
3. Establecer coordinación con municipios locales`,
};

export default function AsistenteIAPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `¡Hola! Soy el asistente de IA de la Secretaría de Participación Ciudadana. Estoy aquí para ayudarte con:

- **Análisis de datos** de acciones y programas
- **Generación de informes** y reportes
- **Consultas** sobre métricas y estadísticas
- **Recomendaciones** basadas en los datos

¿En qué puedo ayudarte hoy?`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (prompt?: string) => {
    const messageText = prompt || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responseText =
        respuestasSimuladas[messageText] ||
        `Entiendo tu consulta sobre "${messageText}". 

Basándome en los datos disponibles del sistema, puedo decirte que:

1. **Análisis general**: Los datos muestran tendencias positivas en la mayoría de los indicadores.

2. **Puntos destacados**:
   - Incremento del 18% en participación ciudadana
   - 127 acciones registradas este mes
   - Cobertura del 82% del territorio provincial

3. **Recomendaciones**:
   - Continuar fortaleciendo los programas con mayor impacto
   - Expandir cobertura a departamentos con menor presencia

¿Te gustaría que profundice en algún aspecto específico?`;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-8rem)] flex gap-6">
        {/* Sidebar */}
        <div className="w-80 flex-shrink-0 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="h-4 w-4" />
                Historial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {historialConversaciones.map((conv) => (
                <button
                  key={conv.id}
                  className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <p className="font-medium text-sm line-clamp-1">{conv.titulo}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {conv.fecha} • {conv.mensajes} mensajes
                  </p>
                </button>
              ))}
              <Button variant="ghost" className="w-full justify-start text-muted-foreground" size="sm">
                Ver todo el historial
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Capacidades
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <BarChart3 className="h-4 w-4 text-primary mt-0.5" />
                <span>Análisis de métricas y KPIs</span>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-primary mt-0.5" />
                <span>Generación de informes</span>
              </div>
              <div className="flex items-start gap-2">
                <Map className="h-4 w-4 text-primary mt-0.5" />
                <span>Análisis territorial</span>
              </div>
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-primary mt-0.5" />
                <span>Recomendaciones estratégicas</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <Card className="flex-1 flex flex-col overflow-hidden">
          <CardHeader className="border-b flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg">Asistente de IA</CardTitle>
                  <CardDescription>Análisis inteligente de datos y generación de informes</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="gap-1">
                <Zap className="h-3 w-3" />
                Conectado
              </Badge>
            </div>
          </CardHeader>

          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4 max-w-3xl mx-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === "user" ? "bg-primary" : "bg-gradient-to-br from-primary to-accent"
                      }`}
                    >
                      {message.role === "user" ? (
                        <span className="text-primary-foreground text-sm font-medium">U</span>
                      ) : (
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      )}
                    </div>
                    <div
                      className={`flex-1 ${message.role === "user" ? "flex justify-end" : ""}`}
                    >
                      <div
                        className={`rounded-lg p-4 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground max-w-[80%]"
                            : "bg-muted"
                        }`}
                      >
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          {message.content.split("\n").map((line, i) => {
                            if (line.startsWith("## ")) {
                              return (
                                <h3 key={i} className="text-base font-semibold mt-2 mb-1">
                                  {line.replace("## ", "")}
                                </h3>
                              );
                            }
                            if (line.startsWith("### ")) {
                              return (
                                <h4 key={i} className="text-sm font-semibold mt-2 mb-1">
                                  {line.replace("### ", "")}
                                </h4>
                              );
                            }
                            if (line.startsWith("- ") || line.startsWith("* ")) {
                              return (
                                <p key={i} className="text-sm my-0.5 ml-4">
                                  • {line.replace(/^[-*] /, "").replace(/\*\*(.*?)\*\*/g, "$1")}
                                </p>
                              );
                            }
                            if (line.startsWith("|")) {
                              return null; // Skip table formatting for simplicity
                            }
                            if (line.match(/^\d+\. /)) {
                              return (
                                <p key={i} className="text-sm my-0.5 ml-4">
                                  {line.replace(/\*\*(.*?)\*\*/g, "$1")}
                                </p>
                              );
                            }
                            if (line.trim() === "") return <br key={i} />;
                            return (
                              <p key={i} className="text-sm my-1">
                                {line.replace(/\*\*(.*?)\*\*/g, "$1")}
                              </p>
                            );
                          })}
                        </div>
                        {message.role === "assistant" && (
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <Copy className="h-3 w-3 mr-1" />
                              Copiar
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Regenerar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analizando datos...
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Quick suggestions */}
            {messages.length === 1 && (
              <div className="px-4 pb-4">
                <p className="text-sm text-muted-foreground mb-3">Sugerencias rápidas:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-3xl mx-auto">
                  {sugerenciasRapidas.map((sugerencia, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(sugerencia.prompt)}
                      className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors text-left"
                    >
                      <sugerencia.icon className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">{sugerencia.titulo}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t">
              <div className="max-w-3xl mx-auto">
                <div className="flex gap-2">
                  <Input
                    placeholder="Escribe tu consulta..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button onClick={() => handleSend()} disabled={isLoading || !inputValue.trim()}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  El asistente puede cometer errores. Verifica la información importante.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
