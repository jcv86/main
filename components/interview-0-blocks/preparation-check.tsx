'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Check } from 'lucide-react'

interface PreparationCheckProps {
  onComplete: (data: { passed: boolean; score: number }) => void
}

export function PreparationCheck({ onComplete }: PreparationCheckProps) {
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [achievements, setAchievements] = useState('')
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})

  // Validation functions
  const validateRole = (value: string): string | null => {
    const trimmed = value.trim()
    if (trimmed.length < 3) return 'Mínimo 3 caracteres'
    if (trimmed.length > 50) return 'Máximo 50 caracteres'
    if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s\-/]+$/.test(trimmed)) return 'Solo letras, espacios y guiones'
    
    // Check for obviously fake/repetitive input (like "aaa", "111")
    const uniqueChars = new Set(trimmed.toLowerCase().replace(/\s/g, '')).size
    if (uniqueChars < 2) return 'Ingresa un cargo válido'
    
    return null
  }

  const validateCompany = (value: string): string | null => {
    const trimmed = value.trim()
    if (trimmed.length < 2) return 'Mínimo 2 caracteres'
    if (trimmed.length > 50) return 'Máximo 50 caracteres'
    if (!/^[a-záéíóúñA-ZÁÉÍÓÚÑ0-9\s\-&.]+$/.test(trimmed)) return 'Usa solo letras, números y símbolos básicos'
    
    return null
  }

  const validateAchievements = (value: string): string | null => {
    const trimmed = value.trim()
    if (trimmed.length < 20) return `Mínimo 20 caracteres (${trimmed.length}/20)`
    if (trimmed.length > 500) return 'Máximo 500 caracteres'
    
    // Check for repetitive/spam input (same character repeated)
    const charCounts = new Map<string, number>()
    for (const char of trimmed.toLowerCase()) {
      charCounts.set(char, (charCounts.get(char) || 0) + 1)
    }
    const maxCharCount = Math.max(...charCounts.values())
    if (maxCharCount > trimmed.length * 0.6) return 'Ingresa logros reales y variados'
    
    // Check for at least some variety (words)
    const words = trimmed.split(/\s+/).filter(w => w.length > 2)
    if (words.length < 3) return 'Describe tus logros de forma más completa'
    
    return null
  }

  const roleValid = validateRole(role) === null
  const companyValid = validateCompany(company) === null
  const achievementsValid = validateAchievements(achievements) === null

  const validFields = [roleValid, companyValid, achievementsValid].filter(Boolean).length
  const allValid = roleValid && companyValid && achievementsValid
  
  // Scoring: 100 only if all fields are valid and substantial
  const score = allValid ? 100 : validFields === 2 ? 60 : validFields === 1 ? 30 : 0

  const handleRoleChange = (value: string) => {
    setRole(value)
    const error = validateRole(value)
    setValidationErrors(prev => {
      const next = { ...prev }
      if (error) {
        next.role = error
      } else {
        delete next.role
      }
      return next
    })
  }

  const handleCompanyChange = (value: string) => {
    setCompany(value)
    const error = validateCompany(value)
    setValidationErrors(prev => {
      const next = { ...prev }
      if (error) {
        next.company = error
      } else {
        delete next.company
      }
      return next
    })
  }

  const handleAchievementsChange = (value: string) => {
    setAchievements(value)
    const error = validateAchievements(value)
    setValidationErrors(prev => {
      const next = { ...prev }
      if (error) {
        next.achievements = error
      } else {
        delete next.achievements
      }
      return next
    })
  }

  const handleContinue = () => {
    onComplete({
      passed: allValid,
      score: Math.round(score)
    })
  }

  return (
    <Card className="border-muted/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">📋</span>
          Preparación Base
        </CardTitle>
        <p className="text-sm text-white/70 mt-2">
          Cuéntanos sobre tu objetivo laboral y logros clave
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Role Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-white">
            Cargo que buscas
            {roleValid && <Check className="w-4 h-4 text-emerald-400 inline ml-2" />}
          </label>
          <Input
            placeholder="Ej: Ingeniero de Software, Product Manager, Data Analyst"
            value={role}
            onChange={(e) => handleRoleChange(e.target.value)}
            className={`bg-muted/20 border-muted/40 text-white placeholder-white/40 ${
              validationErrors.role ? 'border-red-500/50' : ''
            }`}
          />
          <p className={`text-xs ${validationErrors.role ? 'text-red-400' : 'text-white/50'}`}>
            {validationErrors.role || 'Cargo objetivo (3-50 caracteres)'}
          </p>
        </div>

        {/* Company Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-white">
            Empresa u objetivo
            {companyValid && <Check className="w-4 h-4 text-emerald-400 inline ml-2" />}
          </label>
          <Input
            placeholder="Ej: Google, Startup X, Mi propia empresa"
            value={company}
            onChange={(e) => handleCompanyChange(e.target.value)}
            className={`bg-muted/20 border-muted/40 text-white placeholder-white/40 ${
              validationErrors.company ? 'border-red-500/50' : ''
            }`}
          />
          <p className={`text-xs ${validationErrors.company ? 'text-red-400' : 'text-white/50'}`}>
            {validationErrors.company || 'Empresa u objetivo (2-50 caracteres)'}
          </p>
        </div>

        {/* Achievements */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-white">
            3-5 logros clave
            {achievementsValid && <Check className="w-4 h-4 text-emerald-400 inline ml-2" />}
          </label>
          <Textarea
            placeholder="Ej:&#10;- Lideré proyecto X que incrementó ventas 30%&#10;- Certificado en AWS&#10;- 5 años en industria tech"
            value={achievements}
            onChange={(e) => handleAchievementsChange(e.target.value)}
            className={`bg-muted/20 border-muted/40 text-white placeholder-white/40 resize-none min-h-[120px] ${
              validationErrors.achievements ? 'border-red-500/50' : ''
            }`}
          />
          <p className={`text-xs ${validationErrors.achievements ? 'text-red-400' : 'text-white/50'}`}>
            {validationErrors.achievements || `Logros (${achievements.length}/20 mín.)`}
          </p>
        </div>

        {/* Score */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/70">Completado</span>
            <span className="text-white font-semibold">{score}%</span>
          </div>
          <div className="w-full h-2 bg-muted/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue transition-all"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-2 text-sm">
          <p className="text-white/70 font-semibold">Verificación</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {roleValid ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <div className="w-4 h-4 rounded border border-muted/40" />
              )}
              <span className={roleValid ? 'text-white' : 'text-white/50'}>Cargo identificado</span>
            </div>
            <div className="flex items-center gap-2">
              {companyValid ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <div className="w-4 h-4 rounded border border-muted/40" />
              )}
              <span className={companyValid ? 'text-white' : 'text-white/50'}>Empresa u objetivo claro</span>
            </div>
            <div className="flex items-center gap-2">
              {achievementsValid ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <div className="w-4 h-4 rounded border border-muted/40" />
              )}
              <span className={achievementsValid ? 'text-white' : 'text-white/50'}>Logros documentados</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Button
          onClick={handleContinue}
          className={`w-full h-12 font-semibold ${
            allValid
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-muted/20 text-white/50 cursor-not-allowed'
          }`}
          disabled={!allValid}
        >
          {allValid ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Completar Auditoría
            </>
          ) : (
            'Completa todos los campos'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
