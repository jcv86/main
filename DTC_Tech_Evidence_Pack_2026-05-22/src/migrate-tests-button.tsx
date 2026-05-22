'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Database, Upload } from 'lucide-react'
import { migrateTestFromLocalStorage } from '@/lib/test-storage'

export function MigrateTestsButton() {
  const [isMigrating, setIsMigrating] = useState(false)
  const { toast } = useToast()

  const migrateAllTests = async () => {
    setIsMigrating(true)
    console.log('[v0] Starting migration of all tests from localStorage to Supabase')

    const testTypes = [
      'disc',
      'mbti',
      'big-five',
      'riasec',
      'soft-skills',
      'emotional-intelligence',
    ]

    let migratedCount = 0

    for (const testType of testTypes) {
      const success = await migrateTestFromLocalStorage(testType)
      if (success) {
        migratedCount++
      }
    }

    setIsMigrating(false)

    if (migratedCount > 0) {
      toast({
        title: 'Migración Exitosa',
        description: `Se migraron ${migratedCount} tests a la base de datos.`,
      })
    } else {
      toast({
        title: 'No hay datos para migrar',
        description: 'No se encontraron tests en el almacenamiento local.',
        variant: 'default',
      })
    }
  }

  return (
    <Button
      onClick={migrateAllTests}
      disabled={isMigrating}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      {isMigrating ? (
        <>
          <Upload className="h-4 w-4 animate-spin" />
          Migrando...
        </>
      ) : (
        <>
          <Database className="h-4 w-4" />
          Migrar Tests a DB
        </>
      )}
    </Button>
  )
}
