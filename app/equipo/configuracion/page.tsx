"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/layouts/admin-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Bell,
  Shield,
  Palette,
  Users,
  Settings,
  Mail,
  Phone,
  Building2,
  MapPin,
  Camera,
  Save,
  Key,
  Smartphone,
  Globe,
  Moon,
  Sun,
  Monitor,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
} from "lucide-react";

const usuarios = [
  {
    id: "1",
    nombre: "Juan Pérez",
    email: "jperez@tucuman.gob.ar",
    rol: "Administrador",
    departamento: "Dirección General",
    activo: true,
    ultimoAcceso: "Hace 5 minutos",
  },
  {
    id: "2",
    nombre: "María González",
    email: "mgonzalez@tucuman.gob.ar",
    rol: "Coordinador",
    departamento: "Territorio",
    activo: true,
    ultimoAcceso: "Hace 1 hora",
  },
  {
    id: "3",
    nombre: "Carlos López",
    email: "clopez@tucuman.gob.ar",
    rol: "Operador",
    departamento: "Datos",
    activo: true,
    ultimoAcceso: "Hace 2 horas",
  },
  {
    id: "4",
    nombre: "Ana Martínez",
    email: "amartinez@tucuman.gob.ar",
    rol: "Operador",
    departamento: "Comunicación",
    activo: false,
    ultimoAcceso: "Hace 3 días",
  },
];

export default function ConfiguracionPage() {
  const [notificaciones, setNotificaciones] = useState({
    email: true,
    push: false,
    semanal: true,
    alertas: true,
  });

  const [tema, setTema] = useState("system");

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
          <p className="text-muted-foreground mt-1">
            Administra tu cuenta y las preferencias del sistema
          </p>
        </div>

        <Tabs defaultValue="perfil" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="perfil" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="notificaciones" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notificaciones</span>
            </TabsTrigger>
            <TabsTrigger value="seguridad" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Seguridad</span>
            </TabsTrigger>
            <TabsTrigger value="apariencia" className="gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Apariencia</span>
            </TabsTrigger>
            <TabsTrigger value="equipo" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Equipo</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="perfil" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>
                  Actualiza tu información de perfil y datos de contacto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-2xl">JP</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" className="gap-2 bg-transparent">
                      <Camera className="h-4 w-4" />
                      Cambiar foto
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG o GIF. Máximo 2MB.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre completo</Label>
                    <Input id="nombre" defaultValue="Juan Pérez" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        defaultValue="jperez@tucuman.gob.ar"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="telefono"
                        type="tel"
                        defaultValue="+54 381 4123456"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cargo">Cargo</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="cargo"
                        defaultValue="Coordinador de Datos"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="departamento">Departamento</Label>
                    <Select defaultValue="datos">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="direccion">Dirección General</SelectItem>
                        <SelectItem value="datos">Datos y Análisis</SelectItem>
                        <SelectItem value="territorio">Territorio</SelectItem>
                        <SelectItem value="comunicacion">Comunicación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ubicacion">Ubicación</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="ubicacion"
                        defaultValue="San Miguel de Tucumán"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Guardar cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notificaciones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferencias de Notificaciones</CardTitle>
                <CardDescription>
                  Configura cómo y cuándo quieres recibir notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Label>Notificaciones por email</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Recibe actualizaciones importantes en tu correo
                      </p>
                    </div>
                    <Switch
                      checked={notificaciones.email}
                      onCheckedChange={(checked) =>
                        setNotificaciones({ ...notificaciones, email: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-muted-foreground" />
                        <Label>Notificaciones push</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Recibe alertas en tiempo real en tu navegador
                      </p>
                    </div>
                    <Switch
                      checked={notificaciones.push}
                      onCheckedChange={(checked) =>
                        setNotificaciones({ ...notificaciones, push: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <Label>Resumen semanal</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Recibe un resumen de actividades cada semana
                      </p>
                    </div>
                    <Switch
                      checked={notificaciones.semanal}
                      onCheckedChange={(checked) =>
                        setNotificaciones({ ...notificaciones, semanal: checked })
                      }
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <Label>Alertas de sistema</Label>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Notificaciones sobre errores y eventos importantes
                      </p>
                    </div>
                    <Switch
                      checked={notificaciones.alertas}
                      onCheckedChange={(checked) =>
                        setNotificaciones({ ...notificaciones, alertas: checked })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seguridad" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Seguridad de la Cuenta</CardTitle>
                <CardDescription>
                  Administra tu contraseña y opciones de seguridad
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-muted">
                        <Key className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">Contraseña</p>
                        <p className="text-sm text-muted-foreground">
                          Última actualización: hace 30 días
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">Cambiar contraseña</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-muted">
                        <Smartphone className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">Autenticación de dos factores</p>
                        <p className="text-sm text-muted-foreground">
                          Añade una capa extra de seguridad
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-amber-600 border-amber-300">
                      No configurado
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-muted">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">Sesiones activas</p>
                        <p className="text-sm text-muted-foreground">
                          2 dispositivos conectados
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">Ver sesiones</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apariencia" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferencias de Apariencia</CardTitle>
                <CardDescription>
                  Personaliza la apariencia de la interfaz
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Tema</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setTema("light")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        tema === "light" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <Sun className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">Claro</p>
                    </button>
                    <button
                      onClick={() => setTema("dark")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        tema === "dark" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <Moon className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">Oscuro</p>
                    </button>
                    <button
                      onClick={() => setTema("system")}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        tema === "system" ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <Monitor className="h-6 w-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">Sistema</p>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="equipo" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestión de Equipo</CardTitle>
                    <CardDescription>
                      Administra los usuarios del sistema
                    </CardDescription>
                  </div>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Invitar usuario
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {usuarios.map((usuario) => (
                    <div
                      key={usuario.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {usuario.nombre
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{usuario.nombre}</p>
                            {usuario.activo ? (
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                Activo
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-muted-foreground">
                                Inactivo
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {usuario.email} • {usuario.rol} • {usuario.departamento}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Último acceso: {usuario.ultimoAcceso}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
