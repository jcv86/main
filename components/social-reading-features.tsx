"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  MessageCircle,
  Heart,
  Share2,
  Users,
  BookOpen,
  Star,
  ThumbsUp,
  MessageSquare,
  UserPlus,
  Globe,
  Lock,
  Send,
  Target,
  TrendingUp,
  Award,
} from "lucide-react"

interface BookClub {
  id: number
  name: string
  description: string
  member_count: number
  current_book: string
  privacy: "public" | "private"
  created_by: string
  created_at: string
}

interface Discussion {
  id: number
  book_id: number
  book_title: string
  user_email: string
  user_name: string
  content: string
  likes: number
  replies: number
  created_at: string
  is_spoiler: boolean
}

interface ReadingGroup {
  id: number
  name: string
  description: string
  members: string[]
  current_challenge: string
  progress: number
}

export default function SocialReadingFeatures() {
  const [bookClubs, setBookClubs] = useState<BookClub[]>([])
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [readingGroups, setReadingGroups] = useState<ReadingGroup[]>([])
  const [newDiscussion, setNewDiscussion] = useState("")
  const [selectedBook, setSelectedBook] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  const userEmail = "demo@example.com"
  const userName = "Demo User"

  useEffect(() => {
    loadSocialData()
  }, [])

  const loadSocialData = async () => {
    try {
      setLoading(true)

      // Load book clubs (mock data for now)
      const mockBookClubs: BookClub[] = [
        {
          id: 1,
          name: "Líderes del Futuro",
          description: "Club de lectura enfocado en libros de liderazgo y desarrollo profesional",
          member_count: 24,
          current_book: "Los 7 Hábitos de la Gente Altamente Efectiva",
          privacy: "public",
          created_by: "admin@example.com",
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          name: "Productividad Máxima",
          description: "Exploramos técnicas y estrategias para maximizar la productividad",
          member_count: 18,
          current_book: "Atomic Habits",
          privacy: "public",
          created_by: "travis@nuanu.com",
          created_at: new Date().toISOString(),
        },
        {
          id: 3,
          name: "Emprendedores Unidos",
          description: "Lecturas sobre emprendimiento y desarrollo de negocios",
          member_count: 31,
          current_book: "The Lean Startup",
          privacy: "private",
          created_by: "demo@despegaturcarrera.com",
          created_at: new Date().toISOString(),
        },
      ]

      // Load discussions (mock data)
      const mockDiscussions: Discussion[] = [
        {
          id: 1,
          book_id: 1,
          book_title: "Los 7 Hábitos de la Gente Altamente Efectiva",
          user_email: "travis@nuanu.com",
          user_name: "Travis",
          content:
            "¿Qué opinan del concepto de 'Primero lo primero'? Me ha cambiado completamente la forma de priorizar mis tareas.",
          likes: 12,
          replies: 5,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          is_spoiler: false,
        },
        {
          id: 2,
          book_id: 2,
          book_title: "Atomic Habits",
          user_email: "demo@despegaturcarrera.com",
          user_name: "Demo Despega",
          content: "La regla de los 2 minutos es increíble. He logrado crear 3 nuevos hábitos este mes aplicándola.",
          likes: 8,
          replies: 3,
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          is_spoiler: false,
        },
        {
          id: 3,
          book_id: 1,
          book_title: "Los 7 Hábitos de la Gente Altamente Efectiva",
          user_email: "demo@example.com",
          user_name: "Demo User",
          content:
            "El capítulo sobre la escucha empática me hizo reflexionar mucho sobre mis relaciones interpersonales.",
          likes: 15,
          replies: 7,
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          is_spoiler: false,
        },
      ]

      // Load reading groups (mock data)
      const mockReadingGroups: ReadingGroup[] = [
        {
          id: 1,
          name: "Desafío 12 Libros",
          description: "Meta de leer 12 libros este año",
          members: ["demo@example.com", "travis@nuanu.com", "demo@despegaturcarrera.com"],
          current_challenge: "Leer 1 libro por mes",
          progress: 75,
        },
        {
          id: 2,
          name: "Maratón de Productividad",
          description: "Enfoque en libros de productividad y eficiencia",
          members: ["demo@example.com", "travis@nuanu.com"],
          current_challenge: "5 libros de productividad en 3 meses",
          progress: 60,
        },
      ]

      setBookClubs(mockBookClubs)
      setDiscussions(mockDiscussions)
      setReadingGroups(mockReadingGroups)
    } catch (error) {
      console.error("Error loading social data:", error)
    } finally {
      setLoading(false)
    }
  }

  const postDiscussion = async () => {
    if (!newDiscussion.trim() || !selectedBook) return

    const newPost: Discussion = {
      id: discussions.length + 1,
      book_id: selectedBook,
      book_title: "Libro Seleccionado",
      user_email: userEmail,
      user_name: userName,
      content: newDiscussion,
      likes: 0,
      replies: 0,
      created_at: new Date().toISOString(),
      is_spoiler: false,
    }

    setDiscussions([newPost, ...discussions])
    setNewDiscussion("")
    setSelectedBook(null)
  }

  const likeDiscussion = (discussionId: number) => {
    setDiscussions((prev) =>
      prev.map((discussion) =>
        discussion.id === discussionId ? { ...discussion, likes: discussion.likes + 1 } : discussion,
      ),
    )
  }

  const joinBookClub = (clubId: number) => {
    setBookClubs((prev) =>
      prev.map((club) => (club.id === clubId ? { ...club, member_count: club.member_count + 1 } : club)),
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Users className="h-12 w-12 animate-pulse mx-auto mb-4 text-blue-600" />
          <p>Cargando comunidad...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">👥 Comunidad de Lectores</h1>
        <p className="text-xl text-gray-600">Conecta con otros lectores, únete a clubes y participa en discusiones</p>
      </div>

      <Tabs defaultValue="discussions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="discussions">Discusiones</TabsTrigger>
          <TabsTrigger value="clubs">Clubes de Lectura</TabsTrigger>
          <TabsTrigger value="groups">Grupos</TabsTrigger>
          <TabsTrigger value="activity">Actividad</TabsTrigger>
        </TabsList>

        <TabsContent value="discussions" className="space-y-6">
          {/* New Discussion */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Iniciar Nueva Discusión
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="¿Qué te ha parecido interesante de tu lectura actual? Comparte tus reflexiones..."
                value={newDiscussion}
                onChange={(e) => setNewDiscussion(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <BookOpen className="h-4 w-4 mr-1" />
                    Seleccionar Libro
                  </Button>
                  <Button variant="outline" size="sm">
                    <Star className="h-4 w-4 mr-1" />
                    Marcar Spoiler
                  </Button>
                </div>
                <Button onClick={postDiscussion} disabled={!newDiscussion.trim()}>
                  <Send className="h-4 w-4 mr-1" />
                  Publicar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Discussions Feed */}
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <Card key={discussion.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${discussion.user_name}`} />
                      <AvatarFallback>
                        {discussion.user_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{discussion.user_name}</span>
                        <Badge variant="outline" className="text-xs">
                          {discussion.book_title}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(discussion.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{discussion.content}</p>
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => likeDiscussion(discussion.id)}>
                          <Heart className="h-4 w-4 mr-1" />
                          {discussion.likes}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          {discussion.replies}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4 mr-1" />
                          Compartir
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="clubs" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookClubs.map((club) => (
              <Card key={club.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{club.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={club.privacy === "public" ? "default" : "secondary"}>
                          {club.privacy === "public" ? (
                            <>
                              <Globe className="h-3 w-3 mr-1" />
                              Público
                            </>
                          ) : (
                            <>
                              <Lock className="h-3 w-3 mr-1" />
                              Privado
                            </>
                          )}
                        </Badge>
                        <span className="text-sm text-gray-600">{club.member_count} miembros</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{club.description}</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Libro Actual:</p>
                      <p className="text-sm text-gray-600">{club.current_book}</p>
                    </div>
                    <Button className="w-full" onClick={() => joinBookClub(club.id)}>
                      <UserPlus className="h-4 w-4 mr-1" />
                      Unirse al Club
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Create New Club Card */}
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Crear Nuevo Club</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Inicia tu propio club de lectura y conecta con lectores afines
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <UserPlus className="h-4 w-4 mr-1" />
                        Crear Club
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Crear Nuevo Club de Lectura</DialogTitle>
                        <DialogDescription>
                          Configura tu club y comienza a construir una comunidad de lectores
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Nombre del Club</label>
                          <input className="w-full mt-1 p-2 border rounded" placeholder="Ej: Líderes del Mañana" />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Descripción</label>
                          <Textarea placeholder="Describe el enfoque y objetivos de tu club..." />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Privacidad</label>
                          <select className="w-full mt-1 p-2 border rounded">
                            <option value="public">Público - Cualquiera puede unirse</option>
                            <option value="private">Privado - Solo por invitación</option>
                          </select>
                        </div>
                        <Button className="w-full">Crear Club</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {readingGroups.map((group) => (
              <Card key={group.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {group.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{group.description}</p>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Desafío Actual:</p>
                      <p className="text-sm text-gray-600">{group.current_challenge}</p>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progreso del Grupo</span>
                        <span>{group.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${group.progress}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Miembros: {group.members.length}</p>
                      <div className="flex -space-x-2 mt-2">
                        {group.members.slice(0, 3).map((member, index) => (
                          <Avatar key={index} className="w-8 h-8 border-2 border-white">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${member}`} />
                            <AvatarFallback className="text-xs">
                              {member.split("@")[0].substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {group.members.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                            +{group.members.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Travis" />
                    <AvatarFallback>T</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">Travis</span> completó
                      <span className="font-semibold"> "Los 7 Hábitos de la Gente Altamente Efectiva"</span>
                    </p>
                    <p className="text-xs text-gray-500">Hace 2 horas</p>
                  </div>
                  <ThumbsUp className="h-4 w-4 text-blue-600" />
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Demo" />
                    <AvatarFallback>D</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">Demo User</span> se unió al club
                      <span className="font-semibold"> "Líderes del Futuro"</span>
                    </p>
                    <p className="text-xs text-gray-500">Hace 4 horas</p>
                  </div>
                  <UserPlus className="h-4 w-4 text-green-600" />
                </div>

                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=DemoD" />
                    <AvatarFallback>DD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">Demo Despega</span> escribió una reseña de 5 estrellas para
                      <span className="font-semibold"> "Atomic Habits"</span>
                    </p>
                    <p className="text-xs text-gray-500">Hace 6 horas</p>
                  </div>
                  <Star className="h-4 w-4 text-purple-600" />
                </div>

                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Travis" />
                    <AvatarFallback>T</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">Travis</span> inició una nueva discusión sobre
                      <span className="font-semibold"> "Técnicas de productividad"</span>
                    </p>
                    <p className="text-xs text-gray-500">Hace 1 día</p>
                  </div>
                  <MessageCircle className="h-4 w-4 text-orange-600" />
                </div>

                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Demo" />
                    <AvatarFallback>D</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">Demo User</span> alcanzó el logro
                      <span className="font-semibold"> "Lector Dedicado"</span>
                    </p>
                    <p className="text-xs text-gray-500">Hace 2 días</p>
                  </div>
                  <Award className="h-4 w-4 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
