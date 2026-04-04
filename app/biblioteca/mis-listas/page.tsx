'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/components/session-wrapper'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookMarked, Plus, Trash2, Share2, Download } from 'lucide-react'

interface ReadingList {
  id: string
  name: string
  description: string
  bookIds: string[]
  createdAt: string
  isPublic: boolean
}

export default function ReadingListsPage() {
  const { user } = useSession()
  const [readingLists, setReadingLists] = useState<ReadingList[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [newListDescription, setNewListDescription] = useState('')

  useEffect(() => {
    // Load reading lists from localStorage (or API)
    const savedLists = JSON.parse(localStorage.getItem('readingLists') || '[]')
    setReadingLists(savedLists)
    setLoading(false)
  }, [])

  const handleCreateList = () => {
    if (!newListName.trim()) return

    const newList: ReadingList = {
      id: Date.now().toString(),
      name: newListName,
      description: newListDescription,
      bookIds: [],
      createdAt: new Date().toISOString(),
      isPublic: false,
    }

    const updated = [...readingLists, newList]
    setReadingLists(updated)
    localStorage.setItem('readingLists', JSON.stringify(updated))
    setNewListName('')
    setNewListDescription('')
    setShowCreate(false)
  }

  const handleDeleteList = (id: string) => {
    const updated = readingLists.filter(list => list.id !== id)
    setReadingLists(updated)
    localStorage.setItem('readingLists', JSON.stringify(updated))
  }

  const handleExportList = (list: ReadingList) => {
    const content = `${list.name}\n${list.description}\n\nBooks: ${list.bookIds.length}`
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', `${list.name}.txt`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <BookMarked className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <p className="text-lg font-semibold mb-4">Por favor inicia sesión</p>
            <p className="text-gray-600 dark:text-gray-400">Necesitas tener una cuenta para crear y gestionar listas de lectura.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
                <BookMarked className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Mis Listas de Lectura</h1>
                <p className="text-gray-600 dark:text-gray-400">Organiza y gestiona tus lecturas favoritas</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowCreate(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Lista
            </Button>
          </div>
        </div>

        {/* Create New List */}
        {showCreate && (
          <Card className="mb-8 border-2 border-blue-300">
            <CardHeader>
              <CardTitle>Crear Nueva Lista</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="text"
                placeholder="Nombre de la lista"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Descripción (opcional)"
                value={newListDescription}
                onChange={(e) => setNewListDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
              />
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline"
                  onClick={() => setShowCreate(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateList}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Crear Lista
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reading Lists Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-3">
                  <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-gray-200 dark:bg-slate-700 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : readingLists.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {readingLists.map((list) => (
              <Card key={list.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-xl">{list.name}</CardTitle>
                    {list.isPublic && (
                      <Badge variant="default" className="bg-green-600">Público</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{list.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {list.bookIds.length} libro{list.bookIds.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(list.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                      onClick={() => handleExportList(list)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Exportar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Compartir
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteList(list.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <BookMarked className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">No tienes listas de lectura yet</p>
              <Button 
                onClick={() => setShowCreate(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Lista
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
