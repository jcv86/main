'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PrintReportButton() {
  return (
    <Button type="button" variant="outline" onClick={() => window.print()} className="print:hidden">
      <Download className="mr-2 h-4 w-4" /> Imprimir / guardar PDF
    </Button>
  )
}
