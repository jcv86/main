'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play } from 'lucide-react'

interface Video {
  id: string
  titulo: string
  descripcion: string
  url: string
  duracion: number
  categoria: string
  tipo: 'ejemplo' | 'tecnica' | 'motivacion'
}

export default function A3VideoBanco() {
  const [videos, setVideos] = useState<Video[]>([])
  const [filtro, setFiltro] = useState<string>('todos')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/a3/videos')
        const data = await response.json()
        if (data.success) {
          setVideos(data.data)
        }
      } catch (error) {
        console.error('[v0] Error fetching videos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  const videosFiltrados = filtro === 'todos' 
    ? videos 
    : videos.filter(v => v.tipo === filtro)

  if (loading) {
    return <div className="text-gray-400">Cargando banco de videos...</div>
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {['todos', 'ejemplo', 'tecnica', 'motivacion'].map(tipo => (
          <Button
            key={tipo}
            onClick={() => setFiltro(tipo)}
            variant={filtro === tipo ? 'default' : 'outline'}
            className="capitalize"
          >
            {tipo === 'todos' ? 'Todos' : tipo === 'ejemplo' ? 'Ejemplos' : tipo === 'tecnica' ? 'Técnicas' : 'Motivación'}
          </Button>
        ))}
      </div>

      {/* Grid de videos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videosFiltrados.map(video => (
          <Card key={video.id} className="p-4 bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer group">
            <div className="relative mb-4 bg-slate-900 rounded-lg overflow-hidden h-40 flex items-center justify-center group-hover:bg-slate-800 transition-colors">
              <Play className="w-12 h-12 text-white opacity-50 group-hover:opacity-75 transition-opacity" />
            </div>
            <h3 className="text-white font-semibold mb-2">{video.titulo}</h3>
            <p className="text-gray-400 text-sm mb-3">{video.descripcion}</p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span className="capitalize bg-slate-700 px-2 py-1 rounded">{video.tipo}</span>
              <span>{video.duracion} min</span>
            </div>
          </Card>
        ))}
      </div>

      {videosFiltrados.length === 0 && (
        <Card className="p-8 text-center bg-slate-800 border-slate-700">
          <p className="text-gray-400">No hay videos en esta categoría</p>
        </Card>
      )}
    </div>
  )
}
