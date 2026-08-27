'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader } from 'lucide-react'

interface Day8VaultImportProps {
  onVaultImported: (vaultData: any) => Promise<void>
  isLoading: boolean
}

export function Day8VaultImport({ onVaultImported, isLoading }: Day8VaultImportProps) {
  const [importing, setImporting] = useState(false)
  const [count, setCount] = useState(10)

  const handleImport = async () => {
    setImporting(true)
    try {
      await onVaultImported({ count, fromDay2: false })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Paso 1: Preparar captura</h2>
        <p className="text-white/70">¿Cuántas memorias quieres excavar?</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)' }}>
          <label className="block text-white font-semibold mb-3">Número de Memorias a Capturar</label>
          <input
            type="range"
            min="5"
            max="15"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            className="w-full"
            style={{
              accentColor: 'rgb(80, 160, 170)',
            }}
          />
          <p className="text-cyan-400 font-bold text-lg mt-2">Excavando {count} memorias</p>
        </div>

        <div className="rounded-lg p-6 border border-cyan-400/40" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)' }}>
          <p className="text-white/80 text-sm">Se crearán {count} espacios para capturar tus mejores historias laborales. Recomendamos 10 para obtener diversidad.</p>
        </div>
      </div>

      <Button
        onClick={handleImport}
        disabled={importing || isLoading}
        className="w-full py-6 text-white font-semibold rounded-full"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
      >
        {importing || isLoading ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Importando...
          </>
        ) : (
          <>
            Crear espacios y capturar memorias
            <ChevronRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  )
}
