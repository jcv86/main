'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface DocumentFilterProps {
  onFilterTypeChange: (type: string | null) => void
  onFilterStatusChange: (status: string | null) => void
}

export function DocumentFilter({ onFilterTypeChange, onFilterStatusChange }: DocumentFilterProps) {
  const documentTypes = [
    { value: 'route_contract', label: 'Contrato de Ruta' },
    { value: 'evidence_vault', label: 'Bóveda de Evidencia' },
    { value: 'market_signal', label: 'Señales del Mercado' },
    { value: 'candidate_board', label: 'Tablero de Candidato' },
    { value: 'test_introduction', label: 'Introducción' },
    { value: 'professional_identity', label: 'Identidad Profesional' },
    { value: 'career_mirror', label: 'Espejo de Carrera' },
    { value: 'work_memory', label: 'Memoria de Trabajo' },
    { value: 'value_inventory', label: 'Inventario de Valores' },
    { value: 'daily_mission', label: 'Misión Diaria' },
    { value: 'cv_bullet', label: 'CV Bullet' },
  ]

  const statusOptions = [
    { value: 'draft', label: 'Borrador' },
    { value: 'review', label: 'En Revisión' },
    { value: 'revision', label: 'Revisión' },
    { value: 'approved', label: 'Aprobado' },
    { value: 'final', label: 'Final' },
  ]

  return (
    <div className="flex gap-3 flex-wrap">
      <Select onValueChange={value => onFilterTypeChange(value === 'all' ? null : value)}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filtrar por tipo..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los tipos</SelectItem>
          {documentTypes.map(type => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={value => onFilterStatusChange(value === 'all' ? null : value)}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Filtrar por estado..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          {statusOptions.map(status => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={() => {
        onFilterTypeChange(null)
        onFilterStatusChange(null)
      }}>
        <X size={16} className="mr-1" />
        Limpiar filtros
      </Button>
    </div>
  )
}
