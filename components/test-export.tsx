'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface TestExportProps {
  userEmail: string
  testType: string
  onExportStart?: () => void
  onExportComplete?: (format: string) => void
}

export function TestExportComponent({ userEmail, testType, onExportStart, onExportComplete }: TestExportProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleExport = async (format: 'csv' | 'pdf' | 'json') => {
    setIsExporting(true)
    setError(null)
    setSuccessMessage(null)

    try {
      onExportStart?.()

      console.log(`[v0] Starting export as ${format}...`)

      const response = await fetch('/api/export-test-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail,
          testType,
          format,
        }),
      })

      if (!response.ok) {
        throw new Error(`Export failed with status ${response.status}`)
      }

      // Create blob from response
      const blob = await response.blob()

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `test-result-${testType}-${new Date().getTime()}.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      setSuccessMessage(`Successfully exported as ${format.toUpperCase()}!`)
      onExportComplete?.(format)

      console.log(`[v0] Export completed successfully`)
    } catch (e: any) {
      console.error(`[v0] Export error:`, e)
      setError(e.message || 'Failed to export test results')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Export Test Results</CardTitle>
        <CardDescription>Download your {testType} test results in your preferred format</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="flex-1"
          >
            {isExporting ? 'Exporting...' : '📊 CSV'}
          </Button>

          <Button
            variant="outline"
            onClick={() => handleExport('json')}
            disabled={isExporting}
            className="flex-1"
          >
            {isExporting ? 'Exporting...' : '📄 JSON'}
          </Button>

          <Button
            variant="outline"
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="flex-1"
          >
            {isExporting ? 'Exporting...' : '📑 PDF'}
          </Button>
        </div>

        <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
          <p className="font-semibold">Export formats:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
            <li><strong>CSV</strong> - For spreadsheet analysis and data manipulation</li>
            <li><strong>JSON</strong> - For API integration and data processing</li>
            <li><strong>PDF</strong> - For printing, sharing, and professional documentation</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
