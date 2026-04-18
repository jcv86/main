import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Key, Database, Globe, Brain } from "lucide-react"

export default function ApiConfigPage() {
  const openaiKey = process.env.OPENAI_API_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const isOpenAIConfigured = openaiKey && openaiKey.length > 20
  const isSupabaseConfigured = supabaseUrl && supabaseKey

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
          <Key className="h-8 w-8" />
          Configuración de APIs
        </h1>
        <p className="text-muted-foreground">Estado actual de las configuraciones del sistema</p>
      </div>

      <div className="space-y-6">
        {!isOpenAIConfigured || !isSupabaseConfigured ? (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Configuración Incompleta</AlertTitle>
            <AlertDescription>
              Algunas variables de entorno no están configuradas correctamente. Por favor, revisa los detalles abajo.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-green bg-green/5">
            <CheckCircle2 className="h-4 w-4 text-green" />
            <AlertTitle className="text-green">Sistema Configurado Correctamente</AlertTitle>
            <AlertDescription className="text-green">
              Todas las variables de entorno necesarias están configuradas y listas para usar.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              OpenAI API
            </CardTitle>
            <CardDescription>Configuración para búsqueda semántica y generación de embeddings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">OPENAI_API_KEY</p>
                <p className="text-xs text-muted-foreground">Clave de API de OpenAI para embeddings y chat</p>
              </div>
              {isOpenAIConfigured ? (
                <Badge variant="default" className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Configurado
                </Badge>
              ) : (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  No Configurado
                </Badge>
              )}
            </div>

            {isOpenAIConfigured && (
              <div className="p-3 bg-muted/5 rounded-md space-y-2">
                <p className="text-xs font-mono text-muted-foreground">
                  sk-proj-{openaiKey?.substring(8, 12)}...{openaiKey?.substring(openaiKey.length - 4)}
                </p>
                <div className="flex gap-2 text-xs">
                  <Badge variant="outline" className="text-xs">
                    Modelo: text-embedding-3-small
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Dimensiones: 1536
                  </Badge>
                </div>
              </div>
            )}

            {!isOpenAIConfigured && (
              <Alert>
                <AlertDescription className="text-sm">
                  <strong>Para configurar:</strong> Agrega{" "}
                  <code className="bg-muted/10 px-2 py-1 rounded">OPENAI_API_KEY=tu-clave-aqui</code> a tu archivo{" "}
                  <code className="bg-muted/10 px-2 py-1 rounded">.env.local</code>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Supabase Database
            </CardTitle>
            <CardDescription>Configuración de la base de datos PostgreSQL con pgvector</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">NEXT_PUBLIC_SUPABASE_URL</p>
                <p className="text-xs text-muted-foreground">URL de tu proyecto Supabase</p>
              </div>
              {supabaseUrl ? (
                <Badge variant="default" className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Configurado
                </Badge>
              ) : (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  No Configurado
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">SUPABASE_SERVICE_ROLE_KEY</p>
                <p className="text-xs text-muted-foreground">Clave de servicio para operaciones del servidor</p>
              </div>
              {supabaseKey ? (
                <Badge variant="default" className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Configurado
                </Badge>
              ) : (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  No Configurado
                </Badge>
              )}
            </div>

            {isSupabaseConfigured && (
              <div className="p-3 bg-muted/5 rounded-md">
                <p className="text-xs font-mono text-muted-foreground break-all">{supabaseUrl}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Sistema de Búsqueda
            </CardTitle>
            <CardDescription>Estado de las funcionalidades de búsqueda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm">Búsqueda Semántica</span>
              {isOpenAIConfigured ? (
                <Badge variant="default">Disponible</Badge>
              ) : (
                <Badge variant="secondary">No Disponible</Badge>
              )}
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm">Generación de Embeddings</span>
              {isOpenAIConfigured && isSupabaseConfigured ? (
                <Badge variant="default">Disponible</Badge>
              ) : (
                <Badge variant="secondary">No Disponible</Badge>
              )}
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm">Base de Conocimiento</span>
              {isSupabaseConfigured ? (
                <Badge variant="default">Conectado</Badge>
              ) : (
                <Badge variant="secondary">Desconectado</Badge>
              )}
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm">AI Coach</span>
              {isOpenAIConfigured && isSupabaseConfigured ? (
                <Badge variant="default">Activo</Badge>
              ) : (
                <Badge variant="secondary">Inactivo</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue/20 bg-blue/5">
          <CardHeader>
            <CardTitle className="text-base">Próximos Pasos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {!isOpenAIConfigured && (
              <div className="flex gap-2">
                <span>1.</span>
                <p>
                  Obtén una clave de API de OpenAI en{" "}
                  <a
                    href="https://platform.openai.com/api-keys"
                    className="text-blue underline"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    platform.openai.com
                  </a>
                </p>
              </div>
            )}
            {!isSupabaseConfigured && (
              <div className="flex gap-2">
                <span>2.</span>
                <p>Configura las variables de entorno de Supabase en tu archivo .env.local</p>
              </div>
            )}
            {isOpenAIConfigured && isSupabaseConfigured && (
              <>
                <div className="flex gap-2">
                  <span>✓</span>
                  <p>
                    Ejecuta el script 249 para habilitar soporte de vectores:{" "}
                    <code className="bg-blue/10 px-2 py-1 rounded">scripts/249-add-embeddings-support.sql</code>
                  </p>
                </div>
                <div className="flex gap-2">
                  <span>✓</span>
                  <p>Genera embeddings para tu contenido en /admin/embeddings</p>
                </div>
                <div className="flex gap-2">
                  <span>✓</span>
                  <p>Prueba la búsqueda semántica en /test-semantic-search</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
