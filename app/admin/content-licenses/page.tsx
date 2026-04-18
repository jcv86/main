"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Clock, FileText } from "lucide-react"

export default function ContentLicensesPage() {
  const [licenses, setLicenses] = useState<any[]>([])
  const [unlicensed, setUnlicensed] = useState<any[]>([])
  const [summary, setSummary] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [licensesRes, unlicensedRes, summaryRes] = await Promise.all([
        fetch("/api/content-licenses/list"),
        fetch("/api/content-licenses/unlicensed"),
        fetch("/api/content-licenses/summary"),
      ])

      const licensesData = await licensesRes.json()
      const unlicensedData = await unlicensedRes.json()
      const summaryData = await summaryRes.json()

      setLicenses(licensesData.licenses || [])
      setUnlicensed(unlicensedData.unlicensed || [])
      setSummary(summaryData.summary || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getComplianceColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green/50"
      case "pending_review":
        return "bg-orange"
      case "needs_documentation":
        return "bg-orange-500"
      case "at_risk":
        return "bg-red/50"
      case "non_compliant":
        return "bg-red"
      default:
        return "bg-muted/50"
    }
  }

  const getLicenseTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      public_domain: "Dominio Público",
      cc_by: "CC BY",
      cc_by_sa: "CC BY-SA",
      cc_by_nc: "CC BY-NC",
      cc_by_nd: "CC BY-ND",
      fair_use: "Fair Use",
      proprietary: "Propietario",
      custom: "Personalizado",
      unknown: "Desconocido",
      pending_review: "Pendiente de Revisión",
    }
    return labels[type] || type
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando licencias...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Documentación de Licencias</h1>
        <p className="text-muted-foreground">Gestión de origen, derechos y compliance de contenido</p>
      </div>

      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList>
          <TabsTrigger value="summary">Resumen</TabsTrigger>
          <TabsTrigger value="unlicensed">Sin Licencia ({unlicensed.length})</TabsTrigger>
          <TabsTrigger value="all">Todas las Licencias ({licenses.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Licencias</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{licenses.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verificadas</CardTitle>
                <CheckCircle className="h-4 w-4 text-green" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {licenses.filter((l) => l.compliance_status === "verified").length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                <Clock className="h-4 w-4 text-orange" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {licenses.filter((l) => l.compliance_status === "pending_review").length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sin Licencia</CardTitle>
                <AlertCircle className="h-4 w-4 text-red" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{unlicensed.length}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resumen por Tipo de Contenido</CardTitle>
              <CardDescription>Estado de compliance por categoría</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {summary.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.content_type}</Badge>
                      <span className="text-sm">{item.compliance_status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.count}</span>
                      <span className="text-sm text-muted-foreground">({item.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unlicensed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contenido Sin Licencia</CardTitle>
              <CardDescription>Contenido que requiere documentación de licencia</CardDescription>
            </CardHeader>
            <CardContent>
              {unlicensed.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  ¡Excelente! Todo el contenido tiene licencia documentada.
                </p>
              ) : (
                <div className="space-y-2">
                  {unlicensed.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.content_title}</p>
                        <p className="text-sm text-muted-foreground">{item.content_type}</p>
                      </div>
                      <Badge variant="destructive">Sin Licencia</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Todas las Licencias</CardTitle>
              <CardDescription>Lista completa de licencias documentadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {licenses.map((license) => (
                  <div key={license.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{license.content_title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {license.content_type} • {getLicenseTypeLabel(license.license_type)}
                        </p>
                      </div>
                      <Badge className={getComplianceColor(license.compliance_status)}>
                        {license.compliance_status}
                      </Badge>
                    </div>

                    {license.author_name && (
                      <p className="text-sm">
                        <span className="font-medium">Autor:</span> {license.author_name}
                      </p>
                    )}

                    {license.source_name && (
                      <p className="text-sm">
                        <span className="font-medium">Fuente:</span> {license.source_name}
                      </p>
                    )}

                    {license.rights_statement && (
                      <p className="text-sm text-muted-foreground">{license.rights_statement}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
