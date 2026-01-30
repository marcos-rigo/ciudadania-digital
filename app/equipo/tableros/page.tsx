"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/layouts/admin-layout"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { tableros } from "@/lib/mock/data"
import { BarChart3, ExternalLink, Copy, Check, Eye } from "lucide-react"

const tipoIcons: Record<string, string> = {
  power_bi: "Power BI",
  looker: "Looker Studio",
  metabase: "Metabase",
}

export default function TablerosPage() {
  const [selectedTablero, setSelectedTablero] = useState<(typeof tableros)[0] | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Tableros de Control"
        description="Accedé a los tableros de visualización de datos y KPIs."
      />

      <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tableros.map((tablero) => (
          <Card key={tablero.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded dark:bg-muted/20">
                  {tipoIcons[tablero.tipo]}
                </span>
              </div>
              <CardTitle className="text-lg mt-4">{tablero.nombre}</CardTitle>
              <CardDescription>{tablero.descripcion}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <span className="px-2 py-0.5 bg-muted rounded text-xs dark:bg-muted/20">
                  {tablero.categoria}
                </span>
                <span>•</span>
                <span>
                  {new Date(tablero.fechaCreacion).toLocaleDateString("es-AR", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedTablero(tablero)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyLink(tablero.urlEmbed)}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(tablero.urlEmbed, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tablero Detail Dialog */}
      <Dialog
        open={!!selectedTablero}
        onOpenChange={() => setSelectedTablero(null)}
      >
        <DialogContent className="max-w-5xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedTablero?.nombre}</DialogTitle>
            <DialogDescription>{selectedTablero?.descripcion}</DialogDescription>
          </DialogHeader>
          <div className="flex-1 mt-4 border rounded-lg overflow-hidden bg-muted/30 dark:bg-muted/20">
            {/* Placeholder for iframe embed */}
            <div className="w-full h-full min-h-[400px] flex items-center justify-center">
              <div className="text-center p-8">
                <BarChart3 className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-lg font-medium text-foreground">
                  Tablero: {selectedTablero?.nombre}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Aquí se embebería el tablero de {tipoIcons[selectedTablero?.tipo || "power_bi"]}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  URL: {selectedTablero?.urlEmbed}
                </p>
                <p className="text-xs text-muted-foreground mt-4 bg-muted p-2 rounded dark:bg-muted/20">
                  (Placeholder - En producción se mostraría el iframe del tablero real)
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
