'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CheckCircle2, Circle, Trash2, Plus, AlertCircle } from 'lucide-react'

interface Task {
  id: string
  title: string
  category: string
  estimated_duration: number
  actual_duration?: number
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  predicted_success_rate: number
  recommended: boolean
}

interface TaskManagerProps {
  userId: string
  capacity: number
}

export function CIPTaskManager({ userId, capacity }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [recommendations, setRecommendations] = useState<any>(null)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [category, setCategory] = useState<'deep_work' | 'learning' | 'rest' | 'collaboration'>('deep_work')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [userId])

  const fetchData = async () => {
    try {
      // Get recommendations
      const recRes = await fetch(`/api/cip/tasks?action=recommendations`)
      const rec = await recRes.json()
      setRecommendations(rec)

      // Get tasks
      const tasksRes = await fetch('/api/cip/tasks')
      const data = await tasksRes.json()
      setTasks(data.tasks || [])
    } catch (error) {
      console.error('[v0] Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async () => {
    if (!newTaskTitle) return

    try {
      const response = await fetch('/api/cip/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          title: newTaskTitle,
          category,
          estimated_duration: 30,
          priority: 2,
        }),
      })

      const { task } = await response.json()
      setTasks([...tasks, task])
      setNewTaskTitle('')
    } catch (error) {
      console.error('[v0] Error adding task:', error)
    }
  }

  const completeTask = async (taskId: string) => {
    try {
      await fetch('/api/cip/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'complete',
          task_id: taskId,
          actual_duration: 30,
          success: true,
        }),
      })

      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: 'completed' } : t))
    } catch (error) {
      console.error('[v0] Error completing task:', error)
    }
  }

  const deleteTask = async (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId))
  }

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Cargando tareas...</div>
  }

  const isCapacityCritical = capacity <= 15
  const isCapacityOptimal = capacity > 68

  return (
    <div className="space-y-6">
      {/* Recomendations Banner */}
      {recommendations && (
        <div className={`p-4 rounded-lg border-l-4 ${
          isCapacityCritical ? 'bg-red-50 border-red-500' :
          capacity <= 68 ? 'bg-yellow-50 border-yellow-500' :
          'bg-green-50 border-green-500'
        }`}>
          <div className="flex items-start gap-3">
            <AlertCircle className={`h-5 w-5 mt-0.5 ${
              isCapacityCritical ? 'text-red-600' :
              capacity <= 68 ? 'text-yellow-600' :
              'text-green-600'
            }`} />
            <div>
              <p className="font-semibold text-sm">
                {recommendations.message}
              </p>
              <p className="text-xs mt-1">
                Se recomienda: <strong>{recommendations.recommended_task_count} tareas máximo</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Form */}
      <div className="flex gap-2">
        <Input
          placeholder="Añadir nueva tarea..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          disabled={isCapacityCritical}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as any)}
          className="px-3 py-2 border rounded-md text-sm"
          disabled={isCapacityCritical}
        >
          <option value="deep_work">Deep Work</option>
          <option value="learning">Learning</option>
          <option value="rest">Rest</option>
          <option value="collaboration">Collaboration</option>
        </select>
        <Button
          onClick={addTask}
          disabled={!newTaskTitle || isCapacityCritical}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" /> Añadir
        </Button>
      </div>

      {/* Tasks List */}
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No hay tareas. ¡Crea una nueva!</p>
        ) : (
          tasks.map((task) => (
            <Card key={task.id} className="p-4 flex items-center gap-4 hover:shadow-md transition">
              <button
                onClick={() => completeTask(task.id)}
                className="flex-shrink-0"
              >
                {task.status === 'completed' ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
              </button>

              <div className="flex-1">
                <p className={task.status === 'completed' ? 'line-through text-gray-500' : ''}>
                  {task.title}
                </p>
                <div className="flex gap-2 text-xs text-gray-500 mt-1">
                  <span className="px-2 py-0.5 bg-gray-100 rounded">
                    {task.category}
                  </span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded">
                    {task.estimated_duration}min
                  </span>
                  {task.recommended && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                      ⭐ Recomendada
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                className="flex-shrink-0 p-2 hover:bg-red-50 rounded transition"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </button>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
