"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, FileSpreadsheet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function CoachingAnalyticsDashboard() {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  const handleExportCSV = async () => {
    try {
      setIsExporting(true)
      const response = await fetch("/api/export/metrics-csv")

      if (!response.ok) throw new Error("Export failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `coaching-metrics-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Exportación exitosa",
        description: "Las métricas se han exportado a CSV",
      })
    } catch (error) {
      console.error("Error exporting:", error)
      toast({
        title: "Error",
        description: "No se pudo exportar las métricas",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleGenerateReport = async () => {
    try {
      setIsExporting(true)
      const response = await fetch("/api/export/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: null,
          endDate: null,
          includeCharts: true,
        }),
      })

      if (!response.ok) throw new Error("Report generation failed")

      const report = await response.json()

      // Download as JSON for now (can be enhanced to PDF later)
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `coaching-report-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Reporte generado",
        description: "El reporte se ha descargado exitosamente",
      })
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        title: "Error",
        description: "No se pudo generar el reporte",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exportar Datos</CardTitle>
        <CardDescription>Descarga métricas y reportes en diferentes formatos</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-4">
        <Button onClick={handleExportCSV} disabled={isExporting} variant="outline">
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
        <Button onClick={handleGenerateReport} disabled={isExporting} variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Generar Reporte
        </Button>
      </CardContent>
    </Card>
  )
}
