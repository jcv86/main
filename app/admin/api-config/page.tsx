"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, AlertCircle, Key } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConfigStatus {
  openai: {
    configured: boolean
    keyLength?: number
  }
  supabase: {
    configured: boolean
  }
}

export default function APIConfigPage() {
  const [config, setConfig] = useState<ConfigStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkConfiguration()
  }, [])

  const checkConfiguration = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/embeddings/generate")
      const data = await response.json()

      setConfig({
        openai: {
          configured: data.configured || false,
        },
        supabase: {
          configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        },
      })
    } catch (error) {
      console.error("Error checking configuration:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="py-12 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-muted-foreground">Verificando configuración...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isFullyConfigured = config?.openai.configured && config?.supabase.configured

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">🔧 Configuración de API</h1>
        <p className="text-muted-foreground">Verifica que todas las claves de API estén configuradas correctamente</p>
      </div>

      <div className="space-y-6">
        {isFullyConfigured ? (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-900 dark:text-green-100">¡Configuración Completa!</AlertTitle>
            <AlertDescription className="text-green-800 dark:text-green-200">
              Todas las claves de API están configuradas correctamente. El sistema está listo para usar.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Configuración Incompleta</AlertTitle>
            <AlertDescription>
              Algunas claves de API no están configuradas. Por favor revisa los detalles abajo.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>OpenAI API</CardTitle>
            <CardDescription>Necesaria para embeddings y búsqueda semántica</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Estado de la Clave</p>
                  <p className="text-sm text-muted-foreground">OPENAI_API_KEY</p>
                </div>
              </div>
              {config?.openai.configured ? (
                <Badge className="bg-green-500">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Configurada
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="mr-1 h-3 w-3" />
                  No Configurada
                </Badge>
              )}
            </div>

            {!config?.openai.configured && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Cómo Configurar</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>1. Crea un archivo .env.local en la raíz de tu proyecto</p>
                  <p>2. Agrega la siguiente línea:</p>
                  <code className="block bg-muted p-2 rounded text-sm mt-2">OPENAI_API_KEY=sk-proj-tu-clave-aqui</code>
                  <p className="mt-2">3. Reinicia el servidor de desarrollo</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    ⚠️ Nunca compartas tu clave de API ni la subas a un repositorio público
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supabase</CardTitle>
            <CardDescription>Base de datos y almacenamiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Estado de la Conexión</p>
                  <p className="text-sm text-muted-foreground">SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY</p>
                </div>
              </div>
              {config?.supabase.configured ? (
                <Badge className="bg-green-500">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Configurada
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="mr-1 h-3 w-3" />
                  No Configurada
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button onClick={checkConfiguration} variant="outline">
            Verificar Nuevamente
          </Button>
          {isFullyConfigured && (
            <Button onClick={() => (window.location.href = "/test-semantic-search")}>Probar Búsqueda Semántica</Button>
          )}
        </div>
      </div>
    </div>
  )
}
