"use client"

import { useState } from "react"
import { PublicLayout } from "@/components/layouts/public-layout"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { documentos, faqs } from "@/lib/mock/data"
import { FileText, Download, Calendar, FolderOpen, HelpCircle } from "lucide-react"

export default function TransparenciaPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = [...new Set(documentos.map((d) => d.categoria))]
  const faqCategories = [...new Set(faqs.map((f) => f.categoria))]

  const filteredDocumentos =
    selectedCategory === "all"
      ? documentos
      : documentos.filter((d) => d.categoria === selectedCategory)

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Transparencia"
          description="Documentos, reportes y preguntas frecuentes sobre la gestión de la Secretaría de Participación Ciudadana."
          breadcrumbs={[{ label: "Transparencia" }]}
        />

        <Tabs defaultValue="documentos" className="mt-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="documentos" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documentos
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Preguntas Frecuentes
            </TabsTrigger>
          </TabsList>

          {/* Documentos Tab */}
          <TabsContent value="documentos" className="mt-6">
            {/* Category filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
              >
                Todos
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Documents list */}
            <div className="grid md:grid-cols-2 gap-4">
              {filteredDocumentos.map((documento) => (
                <Card
                  key={documento.id}
                  className="group hover:shadow-md transition-shadow"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {documento.titulo}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <FolderOpen className="h-3.5 w-3.5" />
                          {documento.categoria}
                        </div>
                        {documento.descripcion && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {documento.descripcion}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(documento.fechaPublicacion).toLocaleDateString(
                              "es-AR",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={documento.enlaceDescarga}
                              download
                              onClick={(e) => {
                                e.preventDefault()
                                alert("Demo: Descarga de documento simulada")
                              }}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Descargar
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="mt-6">
            <div className="max-w-3xl">
              {faqCategories.map((category) => (
                <div key={category} className="mb-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    {category}
                  </h3>
                  <Card>
                    <CardContent className="pt-6">
                      <Accordion type="single" collapsible className="w-full">
                        {faqs
                          .filter((faq) => faq.categoria === category)
                          .map((faq) => (
                            <AccordionItem key={faq.id} value={faq.id}>
                              <AccordionTrigger className="text-left">
                                {faq.pregunta}
                              </AccordionTrigger>
                              <AccordionContent className="text-muted-foreground">
                                {faq.respuesta}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PublicLayout>
  )
}
