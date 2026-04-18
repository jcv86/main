'use client'

import { useState, useEffect } from 'react'
import { useBitacora } from '@/hooks/use-bitacora'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Calendar, BookOpen, Lightbulb, TrendingUp, ChevronLeft, Loader } from 'lucide-react'
import Link from 'next/link'

export default function BitacoraPage() {
  const { entries, loading, error, addEntry, getStats } = useBitacora()
  const [isCreating, setIsCreating] = useState(false)
  const [newEntry, setNewEntry] = useState({
    type: 'daily' as 'daily' | 'weekly',
    title: '',
    reflection: '',
    insights: '',
    mood: 3,
    actionsTaken: 0,
    nextSteps: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = async () => {
    if (!newEntry.title || !newEntry.reflection) {
      alert('Por favor completa título y reflexión')
      return
    }

    try {
      setIsSubmitting(true)
      await addEntry({
        date: new Date().toISOString().split('T')[0],
        type: newEntry.type,
        title: newEntry.title,
        reflection: newEntry.reflection,
        insights: newEntry.insights
          .split('\n')
          .filter(i => i.trim())
          .map(i => i.trim()),
        mood: newEntry.mood,
        actionsTaken: newEntry.actionsTaken,
        nextSteps: newEntry.nextSteps
      })

      setNewEntry({
        type: 'daily',
        title: '',
        reflection: '',
        insights: '',
        mood: 3,
        actionsTaken: 0,
        nextSteps: ''
      })
      setIsCreating(false)
    } catch (err) {
      console.error('Error creating entry:', err)
      alert('Error al guardar la entrada')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getMoodColor = (mood: number) => {
    if (mood <= 2) return 'bg-red/10 text-red'
    if (mood === 3) return 'bg-yellow/10 text-yellow'
    return 'bg-green/10 text-green'
  }

  const getMoodLabel = (mood: number) => {
    const labels = ['Muy difícil', 'Difícil', 'Neutral', 'Bien', 'Excelente']
    return labels[mood - 1]
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-muted/20 dark:border-muted/80 bg-white dark:bg-background">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/despega/a2/dashboard" className="p-2 hover:bg-transparent dark:hover:bg-muted/80 rounded-lg transition">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <BookOpen className="w-6 h-6 text-blue dark:text-blue/40" />
            <h1 className="text-3xl font-bold text-muted/90 dark:text-muted/5">Mi Bitácora</h1>
          </div>
          <p className="text-muted/60 dark:text-muted/40 ml-11">
            Tu registro personal de aprendizaje, reflexiones e insights
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <Loader className="w-8 h-8 animate-spin text-blue mx-auto" />
              <p className="text-muted/60 dark:text-muted/40">Cargando tu bitácora...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-0 shadow-md bg-red/5 dark:bg-red/20 border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <p className="text-sm text-red dark:text-red/20">
                <strong>Error:</strong> {error}
              </p>
            </CardContent>
          </Card>
        )}

        {!loading && (
          <>
            {/* Stats Overview */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted/60 dark:text-muted/40">Entradas Registradas</p>
                    <p className="text-3xl font-bold text-muted/90 dark:text-muted/5">{stats.total}</p>
                    <p className="text-xs text-muted/50">Bitácora activa</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted/60 dark:text-muted/40">Ánimo Promedio</p>
                    <p className="text-3xl font-bold text-muted/90 dark:text-muted/5">{stats.avgMood}/5</p>
                    <p className="text-xs text-muted/50">{stats.avgMood >= 4 ? 'Muy positivo' : stats.avgMood >= 3 ? 'Neutral' : 'Desafiante'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="text-sm text-muted/60 dark:text-muted/40">Acciones Completadas</p>
                    <p className="text-3xl font-bold text-muted/90 dark:text-muted/5">{stats.totalActions}</p>
                    <p className="text-xs text-muted/50">En total</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Create Entry Section */}
            {isCreating ? (
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b border-muted/20 dark:border-muted/80">
                  <CardTitle>Nueva Entrada en Bitácora</CardTitle>
                  <CardDescription>Comparte tu reflexión del día o semana</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Type Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted/90 dark:text-muted/10">Tipo de Entrada</label>
                    <div className="flex gap-3">
                      {(['daily', 'weekly'] as const).map(type => (
                        <button
                          key={type}
                          onClick={() => setNewEntry({ ...newEntry, type })}
                          className={`px-4 py-2 rounded-lg font-medium transition ${`}
                            newEntry.type === type
                              ? 'bg-blue text-white'
                              : 'bg-muted/10 dark:bg-card text-muted/70 dark:text-muted/30'
                          }`}
                        >
                          {type === 'daily' ? 'Reflexión Diaria' : 'Revisión Semanal'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted/90 dark:text-muted/10">Título</label>
                    <input
                      type="text"
                      placeholder="Ej: Día 3 - Aprendizaje clave"
                      value={newEntry.title}
                      onChange={e => setNewEntry({ ...newEntry, title: e.target.value })}
                      className="w-full px-4 py-2 rounded-[28px] border border-muted/20 dark:border-card bg-white dark:bg-background text-muted/90 dark:text-muted/5"
                    />
                  </div>

                  {/* Reflection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted/90 dark:text-muted/10">Reflexión</label>
                    <Textarea
                      placeholder="¿Qué pasó hoy? ¿Cómo te sentiste? ¿Qué aprendiste?"
                      value={newEntry.reflection}
                      onChange={e => setNewEntry({ ...newEntry, reflection: e.target.value })}
                      className="min-h-32"
                    />
                  </div>

                  {/* Insights */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted/90 dark:text-muted/10">Insights Clave (uno por línea)</label>
                    <Textarea
                      placeholder="Ej: La consistencia es más importante que perfección&#10;Los pequeños pasos generan momentum"
                      value={newEntry.insights}
                      onChange={e => setNewEntry({ ...newEntry, insights: e.target.value })}
                      className="min-h-24"
                    />
                  </div>

                  {/* Mood & Actions */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted/90 dark:text-muted/10">¿Cómo estuvo tu día?</label>
                      <div className="flex justify-between items-center">
                        {[1, 2, 3, 4, 5].map(i => (
                          <button
                            key={i}
                            onClick={() => setNewEntry({ ...newEntry, mood: i })}
                            className={`text-3xl transition ${newEntry.mood === i ? 'scale-125' : 'opacity-50'}`}
                          >
                            {['😞', '😐', '😐', '😊', '🤩'][i - 1]}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted/50 text-center">{getMoodLabel(newEntry.mood)}</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted/90 dark:text-muted/10">Acciones Completadas</label>
                      <input
                        type="number"
                        min="0"
                        value={newEntry.actionsTaken}
                        onChange={e => setNewEntry({ ...newEntry, actionsTaken: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 rounded-[28px] border border-muted/20 dark:border-card bg-white dark:bg-background text-muted/90 dark:text-muted/5"
                      />
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted/90 dark:text-muted/10">Próximos Pasos</label>
                    <Textarea
                      placeholder="¿Qué harás diferente mañana?"
                      value={newEntry.nextSteps}
                      onChange={e => setNewEntry({ ...newEntry, nextSteps: e.target.value })}
                      className="min-h-20"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={handleCreate} 
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="w-4 h-4 mr-2 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        'Guardar Entrada'
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreating(false)} 
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button onClick={() => setIsCreating(true)} className="w-full h-12 text-base">
                + Nueva Entrada en Bitácora
              </Button>
            )}

            {/* Entries List */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-muted/90 dark:text-muted/5">Historial de Reflexiones</h2>
              {entries.length === 0 ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="py-12 text-center">
                    <BookOpen className="w-12 h-12 text-muted/30 dark:text-muted/70 mx-auto mb-4" />
                    <p className="text-muted/60 dark:text-muted/40">Aún no hay entradas. ¡Comienza tu primera reflexión!</p>
                  </CardContent>
                </Card>
              ) : (
                entries.map(entry => (
                  <Card key={entry.id} className="border-0 shadow-sm hover:shadow-md transition">
                    <CardContent className="pt-6 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={entry.type === 'daily' ? 'default' : 'secondary'}>
                              {entry.type === 'daily' ? 'Diaria' : 'Semanal'}
                            </Badge>
                            <span className="text-xs text-muted/50 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(entry.date).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-muted/90 dark:text-muted/5">{entry.title}</h3>
                        </div>
                        <div className={`px-3 py-2 rounded-lg font-medium text-sm ${getMoodColor(entry.mood)}`}>
                          {getMoodLabel(entry.mood)}
                        </div>
                      </div>

                      {/* Reflection */}
                      <p className="text-muted/70 dark:text-muted/30 leading-relaxed">{entry.reflection}</p>

                      {/* Insights */}
                      {entry.insights && entry.insights.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-muted/90 dark:text-muted/10">
                            <Lightbulb className="w-4 h-4 text-orange" />
                            Insights Clave
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {entry.insights.map((insight, i) => (
                              <Badge key={i} variant="outline" className="bg-yellow/5 dark:bg-yellow border-yellow/20 dark:border-yellow">
                                {insight}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-muted/60 dark:text-muted/40 pt-2 border-t border-muted/20 dark:border-muted/80">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {entry.actionsTaken} acción{entry.actionsTaken !== 1 ? 'es' : ''} completada{entry.actionsTaken !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Next Steps */}
                      {entry.nextSteps && (
                        <div className="p-3 bg-blue/5 dark:bg-blue rounded-[28px] border border-blue/30 dark:border-blue/10">
                          <p className="text-sm font-medium text-blue dark:text-blue/10 mb-1">Próximos Pasos</p>
                          <p className="text-sm text-blue dark:text-blue/20">{entry.nextSteps}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
