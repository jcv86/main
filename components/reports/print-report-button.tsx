'use client'

import { useEffect } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function PrintReportButton() {
  useEffect(() => {
    const originallyClosed = new Set<HTMLDetailsElement>()
    const expandEvidence = () => {
      document.querySelectorAll<HTMLDetailsElement>('[data-dtc-report] details').forEach((element) => {
        if (!element.open) { originallyClosed.add(element); element.open = true }
      })
    }
    const restoreScreen = () => {
      originallyClosed.forEach((element) => { if (element.isConnected) element.open = false })
      originallyClosed.clear()
    }
    window.addEventListener('beforeprint', expandEvidence)
    window.addEventListener('afterprint', restoreScreen)
    return () => {
      window.removeEventListener('beforeprint', expandEvidence)
      window.removeEventListener('afterprint', restoreScreen)
      restoreScreen()
    }
  }, [])

  return (
    <Button type="button" variant="outline" onClick={() => window.print()} className="print:hidden">
      <Download aria-hidden="true" className="mr-2 h-4 w-4" /> Imprimir / guardar PDF
    </Button>
  )
}
