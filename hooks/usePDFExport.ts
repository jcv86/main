'use client'

import { useCallback, useState } from 'react'

export function usePDFExport() {
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const exportToPDF = useCallback(
    async (userId: string) => {
      setIsExporting(true)
      setError(null)

      try {
        console.log(`[v0] Exporting PDF for user ${userId}`)

        const response = await fetch(
          `/api/reports/${userId}?format=pdf`,
          { method: 'GET' }
        )

        if (!response.ok) {
          throw new Error('Failed to generate PDF')
        }

        // Download the PDF
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `despega-ciclo-${userId}-${Date.now()}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        console.log('[v0] PDF exported successfully')
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        console.error('[v0] Error exporting PDF:', message)
        setError(message)
        throw err
      } finally {
        setIsExporting(false)
      }
    },
    []
  )

  const exportToJSON = useCallback(
    async (userId: string) => {
      setIsExporting(true)
      setError(null)

      try {
        console.log(`[v0] Exporting JSON for user ${userId}`)

        const response = await fetch(
          `/api/reports/${userId}?format=json`,
          { method: 'GET' }
        )

        if (!response.ok) {
          throw new Error('Failed to generate JSON report')
        }

        const data = await response.json()

        // Download the JSON
        const jsonString = JSON.stringify(data, null, 2)
        const blob = new Blob([jsonString], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `despega-ciclo-${userId}-${Date.now()}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        console.log('[v0] JSON exported successfully')
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        console.error('[v0] Error exporting JSON:', message)
        setError(message)
        throw err
      } finally {
        setIsExporting(false)
      }
    },
    []
  )

  return {
    exportToPDF,
    exportToJSON,
    isExporting,
    error
  }
}
