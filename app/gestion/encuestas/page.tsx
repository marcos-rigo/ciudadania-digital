"use client";

import { GestionLayout } from "@/components/layouts/gestion-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileQuestion,
  Users,
  Calendar,
  ExternalLink,
  Download,
  Eye,
} from "lucide-react";
import { mockEncuestas } from "@/lib/mock/ciudadania-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const chartData = mockEncuestas.map((e) => ({
  name: e.titulo.slice(0, 20) + "...",
  respuestas: e.respuestas,
}));

export default function GestionEncuestasPage() {
  return (
    <GestionLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Encuestas</h1>
            <p className="text-muted-foreground">
              Resultados y gestión de encuestas
            </p>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Exportar datos
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total encuestas",
              value: mockEncuestas.length,
              icon: FileQuestion,
              color: "text-amber-600 bg-amber-100",
            },
            {
              label: "Activas",
              value: mockEncuestas.filter((e) => e.activa).length,
              icon: FileQuestion,
              color: "text-green-600 bg-green-100",
            },
            {
              label: "Total respuestas",
              value: mockEncuestas.reduce((acc, e) => acc + e.respuestas, 0),
              icon: Users,
              color: "text-blue-600 bg-blue-100",
            },
            {
              label: "Promedio respuestas",
              value: Math.round(
                mockEncuestas.reduce((acc, e) => acc + e.respuestas, 0) /
                  mockEncuestas.length
              ),
              icon: Users,
              color: "text-purple-600 bg-purple-100",
            },
          ].map((stat) => (
            <Card key={stat.label} className="border-none shadow-sm transition-smooth animate-fade-up reveal">
              <CardContent className="p-4 flex items-center gap-4">
                <div
                  className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart */}
        <Card className="border-none shadow-sm transition-smooth animate-fade-up reveal">
          <CardHeader>
            <CardTitle className="text-lg">Respuestas por encuesta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar
                    dataKey="respuestas"
                    fill="#f59e0b"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-none shadow-sm transition-smooth animate-fade-up reveal">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Encuesta</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha creación</TableHead>
                  <TableHead>Respuestas</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockEncuestas.map((encuesta) => (
                  <TableRow key={encuesta.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                          <FileQuestion className="h-5 w-5" />
                        </div>
                        <div className="max-w-[300px]">
                          <p className="font-medium text-foreground truncate">
                            {encuesta.titulo}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {encuesta.descripcion}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {encuesta.tipo === "google_forms"
                          ? "Google Forms"
                          : "Excel Online"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(encuesta.fechaCreacion).toLocaleDateString(
                        "es-AR"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{encuesta.respuestas}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          encuesta.activa
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                        }
                      >
                        {encuesta.activa ? "Activa" : "Cerrada"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <a
                            href={encuesta.embedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </GestionLayout>
  );
}
