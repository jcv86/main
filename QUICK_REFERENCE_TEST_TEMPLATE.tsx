// QUICK REFERENCE: Sistema Cerebro + Tests + Biblioteca
// Copia esta estructura exacta para CUALQUIER nuevo test

import { TestInsights } from "@/components/test-insights"  // ← OBLIGATORIO

export default function TestResultsPage() {
  const [testResults, setTestResults] = useState(null)
  const { user } = useSession()
  
  return (
    <Tabs defaultValue="resumen" className="w-full">
      
      {/* TABS HEADER - ESTRUCTURA OBLIGATORIA */}
      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-10 gap-2">
        
        {/* Tab 1: Resumen */}
        <TabsTrigger value="resumen" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>Resumen</span>
        </TabsTrigger>
        
        {/* Tab 2: INSIGHTS IA - OBLIGATORIO */}
        <TabsTrigger value="insights-hibridos" className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          <span>Insights IA</span>
        </TabsTrigger>
        
        {/* Tab 3+: Otros */}
        <TabsTrigger value="detalles" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          <span>Detalles</span>
        </TabsTrigger>
        
      </TabsList>

      {/* TABS CONTENT */}
      
      {/* Tab Content 1: Resumen */}
      <TabsContent value="resumen">
        {/* Tu contenido aquí */}
      </TabsContent>

      {/* Tab Content 2: INSIGHTS IA - OBLIGATORIO */}
      <TabsContent value="insights-hibridos" className="space-y-6">
        <TestInsights
          testType="[NOMBRE DEL TEST]"           {/* ← OBLIGATORIO: Nombre exacto del test */}
          testResults={testResults}              {/* ← OBLIGATORIO: Objeto de resultados */}
          userId={user?.id || "demo"}            {/* ← OBLIGATORIO: ID del usuario */}
        />
      </TabsContent>

      {/* Tab Content 3+: Otros */}
      <TabsContent value="detalles">
        {/* Tu contenido aquí */}
      </TabsContent>

    </Tabs>
  )
}

/* 
   CHECKLIST PARA CUMPLIMIENTO:
   
   ✅ Importé TestInsights
   ✅ Agregué tab "insights-hibridos" con Brain icon
   ✅ Pasé testType, testResults, userId a TestInsights
   ✅ TabsContent tiene value="insights-hibridos"
   ✅ Clase "space-y-6" aplicada
   
   RESULTADO: El flujo Cerebro + Tests + Biblioteca está GARANTIZADO
   
   QUÉ SUCEDE AUTOMÁTICAMENTE:
   
   1. Usuario hace clic en "Insights IA"
   2. TestInsights renderiza loading "Analizando con Cerebro..."
   3. Llama POST /api/post-test-insights con:
      {
        testType: "Tu Test",
        results: {...},
        userId: "user123"
      }
   4. API ejecuta:
      - OpenAI analiza respuestas
      - Cerebro busca en conocimiento
      - Biblioteca sugiere libros
      - Smart Merge combina todo
   5. Retorna insights personalizados con:
      - Insights prioritarios
      - Recomendaciones de libros
      - Plan de desarrollo
      - Métricas de confianza
   6. Usuario ve análisis 100% personalizado
*/
