'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, CheckCircle } from 'lucide-react'

interface A2Day2VaultSetupProps {
  onNext: (vaultType: string, vaultLink: string) => void
  onBack: () => void
}

const vaultOptions = [
  {
    id: 'notion',
    title: 'Notion',
    description: 'Crea página en Notion',
    instruction: 'Nombre: "DTC Evidence Vault — [Tu Nombre]"',
  },
  {
    id: 'drive',
    title: 'Google Drive',
    description: 'Nueva carpeta en Drive',
    instruction: 'Nombre: "DTC Evidence Vault — [Tu Nombre]"',
  },
  {
    id: 'local',
    title: 'Carpeta Local',
    description: 'En tu computadora',
    instruction: 'Subirás screenshots después',
  },
  {
    id: 'dtc',
    title: 'DTC Documents',
    description: 'Usa área de documentos aquí',
    instruction: 'Más limitado pero funciona',
  },
  {
    id: 'cloud',
    title: 'Cloud (OneDrive/iCloud)',
    description: 'Tu servicio preferido',
    instruction: 'Crea en el lugar que prefieras',
  },
]

export function A2Day2VaultSetup({
  onNext,
  onBack,
}: A2Day2VaultSetupProps) {
  const [selectedVault, setSelectedVault] = useState<string | null>(null)
  const [vaultLink, setVaultLink] = useState('')

  const handleNext = () => {
    if (selectedVault && vaultLink.trim()) {
      onNext(selectedVault, vaultLink)
    }
  }

  const isComplete = selectedVault && vaultLink.trim().length > 0

  return (
    <div className="max-w-3xl mx-auto px-4 space-y-8">
      {/* Header */}
      <div
        className="rounded-lg p-4"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', borderColor: 'rgba(90, 90, 150, 0.2)', border: '1px solid' }}
      >
        <h3 className="font-bold text-white mb-2">Crear Tu Bóveda de Evidencia</h3>
        <p className="text-sm text-white/70">
          Elige dónde vas a guardar tu evidencia. Puede ser externa o en DTC.
        </p>
      </div>

      {/* Vault Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vaultOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelectedVault(option.id)}
            className="p-4 rounded-lg border-2 text-left transition-all"
            style={{
              borderColor: selectedVault === option.id ? 'rgb(90, 90, 150)' : 'rgba(90, 90, 150, 0.2)',
              backgroundColor: selectedVault === option.id ? 'rgba(90, 90, 150, 0.15)' : 'rgba(90, 90, 150, 0.05)',
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-white">{option.title}</h4>
              {selectedVault === option.id && (
                <CheckCircle className="w-5 h-5" style={{ color: 'rgb(80, 160, 170)' }} />
              )}
            </div>
            <p className="text-xs text-white/60 mb-2">{option.description}</p>
            <p className="text-xs text-white/50 italic">{option.instruction}</p>
          </button>
        ))}
      </div>

      {/* Link Input */}
      {selectedVault && (
        <div className="space-y-3">
          <label className="text-sm font-semibold text-white">
            Link o Confirmación de tu Bóveda
          </label>
          <Textarea
            value={vaultLink}
            onChange={(e) => setVaultLink(e.target.value)}
            placeholder={
              selectedVault === 'local'
                ? 'ej. ~/Documents/DTC Evidence Vault'
                : 'Pega el link aquí o confirma que la creaste'
            }
            className="min-h-[80px]"
            style={{
              backgroundColor: 'rgba(15, 15, 30, 0.5)',
              borderColor: 'rgba(90, 90, 150, 0.2)',
              color: 'white',
            }}
          />
        </div>
      )}

      {/* CTA */}
      <div className="pt-4 border-t space-y-3" style={{ borderColor: 'rgba(90, 90, 150, 0.2)' }}>
        <Button
          onClick={handleNext}
          disabled={!isComplete}
          className="w-full"
          size="lg"
          style={{
            backgroundColor: isComplete ? 'rgb(90, 90, 150)' : 'rgba(90, 90, 150, 0.4)',
            color: 'white',
          }}
        >
          Continuar a Caza de Evidencia →
        </Button>

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/50 hover:text-white/70 text-sm transition w-full justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
      </div>
    </div>
  )
}
