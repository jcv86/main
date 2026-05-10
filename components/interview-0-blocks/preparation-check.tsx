'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Check, AlertCircle, Loader } from 'lucide-react'
import { validatePreparationResponses } from '@/lib/interview-0/ai-validation'

interface PreparationCheckProps {
  onComplete: (data: { passed: boolean; score: number }) => void
}

export function PreparationCheck({ onComplete }: PreparationCheckProps) {
  const [role, setRole] = useState('')
  const [company, setCompany] = useState('')
  const [achievements, setAchievements] = useState('')
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({})
  const [isValidatingAI, setIsValidatingAI] = useState(false)
  const [aiValidationResult, setAiValidationResult] = useState<{
    isValid: boolean
    confidence: number
    issues: string[]
    feedback: string
  } | null>(null)
  const [showAIValidation, setShowAIValidation] = useState(false)

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

  const handleContinue = async () => {
    if (!allValid) return

    // First pass: regex validation passed
    // Second pass: AI validation
    setIsValidatingAI(true)
    setShowAIValidation(true)

    try {
      const result = await validatePreparationResponses(role, company, achievements)
      setAiValidationResult(result)

      console.log('[v0] AI validation result:', result)

      // If AI says it's not valid, block continuation
      if (!result.isValid) {
        return
      }

      // AI approved - continue
      onComplete({
        passed: true,
        score: 100
      })
    } catch (error) {
      console.error('[v0] AI validation error:', error)
      // On error, allow manual retry
      setAiValidationResult({
        isValid: false,
        confidence: 0,
        issues: ['Error en validación con IA. Intenta de nuevo.'],
        feedback: 'Por favor intenta enviar nuevamente.'
      })
    } finally {
      setIsValidatingAI(false)
    }
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
            className="bg-muted/20 text-white placeholder-white/40 border-2 focus:ring-0 focus:border-[rgb(170,70,170)]"
            style={{
              borderColor: validationErrors.role ? 'rgba(239, 68, 68, 0.5)' : 'rgba(170, 70, 170, 0.4)'
            }}
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
            className="bg-muted/20 text-white placeholder-white/40 border-2 focus:ring-0 focus:border-[rgb(170,70,170)]"
            style={{
              borderColor: validationErrors.company ? 'rgba(239, 68, 68, 0.5)' : 'rgba(170, 70, 170, 0.4)'
            }}
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
            className="bg-muted/20 text-white placeholder-white/40 resize-none min-h-[120px] border-2 focus:ring-0 focus:border-[rgb(170,70,170)]"
            style={{
              borderColor: validationErrors.achievements ? 'rgba(239, 68, 68, 0.5)' : 'rgba(170, 70, 170, 0.4)'
            }}
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
              className="h-full transition-all"
              style={{ width: `${score}%`, backgroundColor: 'rgb(170, 70, 170)' }}
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

        {/* AI Validation Result */}
        {showAIValidation && aiValidationResult && (
          <div className={`rounded-lg p-4 border ${
            aiValidationResult.isValid
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="flex items-start gap-3">
              {aiValidationResult.isValid ? (
                <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`font-semibold ${aiValidationResult.isValid ? 'text-emerald-400' : 'text-red-400'}`}>
                  {aiValidationResult.isValid ? 'Validación Exitosa' : 'Validación Rechazada'}
                </p>
                <p className="text-sm text-white/80 mt-1">{aiValidationResult.feedback}</p>
                {aiValidationResult.issues.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {aiValidationResult.issues.map((issue, idx) => (
                      <p key={idx} className="text-xs text-white/70">• {issue}</p>
                    ))}
                  </div>
                )}
                <p className="text-xs text-white/60 mt-2">
                  Confianza: {aiValidationResult.confidence}%
                </p>
              </div>
            </div>

            {!aiValidationResult.isValid && (
              <Button
                onClick={() => {
                  setShowAIValidation(false)
                  setAiValidationResult(null)
                }}
                variant="outline"
                className="w-full mt-3 text-white"
                style={{ borderColor: 'rgb(170, 70, 170)' }}
              >
                Intentar Nuevamente
              </Button>
            )}
          </div>
        )}

        {/* CTA */}
        <Button
          onClick={handleContinue}
          disabled={!allValid || isValidatingAI}
          className={`w-full h-12 font-semibold`}
          style={{
            backgroundColor: allValid && !isValidatingAI
              ? 'rgb(170, 70, 170)'
              : 'rgba(107, 114, 128, 0.2)',
            color: allValid && !isValidatingAI ? 'white' : 'rgba(255, 255, 255, 0.5)',
            cursor: allValid && !isValidatingAI ? 'pointer' : 'not-allowed'
          }}
        >
          {isValidatingAI ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Validando con IA...
            </>
          ) : allValid ? (
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
