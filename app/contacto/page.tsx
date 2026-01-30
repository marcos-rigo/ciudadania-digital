"use client"

import React from "react"

import { useState } from "react"
import { PublicLayout } from "@/components/layouts/public-layout"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react"

export default function ContactoPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Contacto"
          description="Comunicate con la Secretaría de Estado de Participación Ciudadana."
          breadcrumbs={[{ label: "Contacto" }]}
        />

        <div className="mt-8 grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Envianos tu consulta</CardTitle>
                <CardDescription>
                  Completá el formulario y nos pondremos en contacto a la brevedad.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Mensaje enviado
                    </h3>
                    <p className="text-muted-foreground max-w-sm">
                      Gracias por contactarnos. Te responderemos a la brevedad 
                      al correo electrónico proporcionado.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-6 bg-transparent"
                      onClick={() => setSubmitted(false)}
                    >
                      Enviar otro mensaje
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre completo *</Label>
                        <Input
                          id="nombre"
                          placeholder="Tu nombre"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="tu@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input
                          id="telefono"
                          type="tel"
                          placeholder="(0381) XXX-XXXX"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="motivo">Motivo de consulta *</Label>
                        <Select required>
                          <SelectTrigger id="motivo">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="solicitud">
                              Solicitar actividad
                            </SelectItem>
                            <SelectItem value="informacion">
                              Información sobre programas
                            </SelectItem>
                            <SelectItem value="participacion">
                              Participar como organización
                            </SelectItem>
                            <SelectItem value="prensa">
                              Consulta de prensa
                            </SelectItem>
                            <SelectItem value="otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organizacion">
                        Organización / Institución
                      </Label>
                      <Input
                        id="organizacion"
                        placeholder="Nombre de tu organización (opcional)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mensaje">Mensaje *</Label>
                      <Textarea
                        id="mensaje"
                        placeholder="Escribí tu consulta o mensaje..."
                        rows={5}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full sm:w-auto">
                      <Send className="h-4 w-4 mr-2" />
                      Enviar mensaje
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Datos de contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Dirección</p>
                    <p className="text-sm text-muted-foreground">
                      Av. Sarmiento 850
                      <br />
                      San Miguel de Tucumán
                      <br />
                      CP 4000
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Teléfono</p>
                    <p className="text-sm text-muted-foreground">
                      (0381) 4XX-XXXX
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground">
                      spc@tucuman.gob.ar
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Horario</p>
                    <p className="text-sm text-muted-foreground">
                      Lunes a Viernes
                      <br />
                      8:00 a 14:00 hs
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Dependencia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground block">
                    Secretaría de Estado de Participación Ciudadana
                  </span>
                  Ministerio de Seguridad
                  <br />
                  Gobierno de la Provincia de Tucumán
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
