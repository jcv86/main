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

  const roleValid = role.trim().length >= 3
  const companyValid = company.trim().length >= 2
  const achievementsValid = achievements.trim().length >= 10

  const allValid = roleValid && companyValid && achievementsValid
  const score = allValid ? 100 : Math.round(
    (roleValid ? 33 : 0) + (companyValid ? 33 : 0) + (achievementsValid ? 34 : 0)
  )

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
            onChange={(e) => setRole(e.target.value)}
            className="bg-muted/20 border-muted/40 text-white placeholder-white/40"
          />
          <p className="text-xs text-white/50">
            {roleValid ? 'Correcto' : 'Al menos 3 caracteres'}
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
            onChange={(e) => setCompany(e.target.value)}
            className="bg-muted/20 border-muted/40 text-white placeholder-white/40"
          />
          <p className="text-xs text-white/50">
            {companyValid ? 'Correcto' : 'Al menos 2 caracteres'}
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
            onChange={(e) => setAchievements(e.target.value)}
            className="bg-muted/20 border-muted/40 text-white placeholder-white/40 resize-none min-h-[120px]"
          />
          <p className="text-xs text-white/50">
            {achievementsValid ? 'Correcto' : `Al menos 10 caracteres (${achievements.length}/10)`}
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
