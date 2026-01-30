"use client";

import { useState } from "react";
import { GestionLayout } from "@/components/layouts/gestion-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  MoreHorizontal,
  Eye,
  Download,
  Users,
  BookOpen,
  PlayCircle,
  Award,
} from "lucide-react";
import { mockUsers, mockTrayectos, mockCertificados } from "@/lib/mock/ciudadania-data";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const Loading = () => null;

export default function GestionUsuariosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const user = selectedUser ? mockUsers.find((u) => u.id === selectedUser) : null;
  const userCertificados = user
    ? mockCertificados.filter((c) => c.usuarioId === user.id)
    : [];

  return (
    <GestionLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>
            <p className="text-muted-foreground">
              {mockUsers.length} usuarios registrados
            </p>
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>

        {/* Search */}
        <Card className="border-none shadow-sm transition-smooth animate-fade-up reveal">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-none shadow-sm transition-smooth animate-fade-up reveal">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Fecha registro</TableHead>
                  <TableHead>Trayectos</TableHead>
                  <TableHead>Videos</TableHead>
                  <TableHead>Certificados</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const certs = mockCertificados.filter(
                    (c) => c.usuarioId === user.id
                  );

                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-sky-100 text-sky-600 dark:bg-sky-900/10 dark:text-sky-300 flex items-center justify-center font-medium">
                            {user.nombre
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {user.nombre}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(user.fechaRegistro).toLocaleDateString(
                          "es-AR"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {user.trayectosCompletados.length}
                          </span>
                          <span className="text-muted-foreground">/</span>
                          <span className="text-muted-foreground">
                            {user.trayectosIniciados.length}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">
                          {user.videosVistos.length} vistos
                        </span>
                      </TableCell>
                      <TableCell>
                        {certs.length > 0 ? (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/10 dark:text-green-300 dark:hover:bg-green-900/10">
                            {certs.length}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setSelectedUser(user.id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalle
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* User detail dialog */}
        <Suspense fallback={<Loading />}>
          <Dialog
            open={!!selectedUser}
            onOpenChange={() => setSelectedUser(null)}
          >
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Detalle del usuario</DialogTitle>
              </DialogHeader>
              {user && (
                <div className="space-y-6">
                  {/* User info */}
                  <div className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-full bg-sky-100 text-sky-600 dark:bg-sky-900/10 dark:text-sky-300 flex items-center justify-center text-xl font-semibold">
                      {user.nombre
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {user.nombre}
                      </h3>
                      <p className="text-muted-foreground">{user.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Registrado el{" "}
                        {new Date(user.fechaRegistro).toLocaleDateString("es-AR")}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4">
                    {[
                        {
                        icon: BookOpen,
                        value: user.trayectosIniciados.length,
                        label: "Iniciados",
                        color: "text-blue-600 bg-blue-100 dark:bg-blue-900/10 dark:text-blue-300",
                      },
                      {
                        icon: BookOpen,
                        value: user.trayectosCompletados.length,
                        label: "Completados",
                        color: "text-green-600 bg-green-100 dark:bg-green-900/10 dark:text-green-300",
                      },
                      {
                        icon: PlayCircle,
                        value: user.videosVistos.length,
                        label: "Videos",
                        color: "text-red-600 bg-red-100 dark:bg-red-900/10 dark:text-red-300",
                      },
                      {
                        icon: Award,
                        value: userCertificados.length,
                        label: "Certificados",
                        color: "text-purple-600 bg-purple-100 dark:bg-purple-900/10 dark:text-purple-300",
                      },
                    ].map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div
                          className={`h-10 w-10 rounded-lg ${stat.color} flex items-center justify-center mx-auto mb-2`}
                        >
                          <stat.icon className="h-5 w-5" />
                        </div>
                        <p className="text-2xl font-bold text-foreground">
                          {stat.value}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Trayectos */}
                  <div>
                    <h4 className="font-medium text-foreground mb-3">
                      Trayectos
                    </h4>
                    <div className="space-y-3">
                      {user.trayectosIniciados.map((trayectoId) => {
                        const trayecto = mockTrayectos.find(
                          (t) => t.id === trayectoId
                        );
                        const isCompleted =
                          user.trayectosCompletados.includes(trayectoId);
                        const progress = isCompleted ? 100 : 65;

                        if (!trayecto) return null;

                        return (
                          <div
                            key={trayectoId}
                            className="p-3 rounded-lg border border-muted"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-foreground">
                                {trayecto.titulo}
                              </span>
                              <Badge
                                variant={isCompleted ? "default" : "secondary"}
                                className={
                                  isCompleted
                                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                                    : ""
                                }
                              >
                                {isCompleted ? "Completado" : "En progreso"}
                              </Badge>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>
                        );
                      })}
                      {user.trayectosIniciados.length === 0 && (
                        <p className="text-muted-foreground text-sm">
                          Sin trayectos iniciados
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Certificates */}
                  {userCertificados.length > 0 && (
                    <div>
                      <h4 className="font-medium text-foreground mb-3">
                        Certificados
                      </h4>
                      <div className="space-y-2">
                        {userCertificados.map((cert) => (
                          <div
                            key={cert.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-muted"
                          >
                            <div className="flex items-center gap-3">
                              <Award className="h-5 w-5 text-purple-600" />
                              <span className="text-foreground">
                                {cert.tituloTrayecto}
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(cert.fechaEmision).toLocaleDateString(
                                "es-AR"
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </Suspense>
      </div>
    </GestionLayout>
  );
}
