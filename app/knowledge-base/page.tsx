"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  BookOpen,
  Users,
  Briefcase,
  GraduationCap,
  MessageSquare,
  FileText,
  TrendingUp,
  Star,
  Clock,
  ArrowRight,
  Brain,
  Lightbulb,
  Shield,
} from "lucide-react"
import Link from "next/link"

interface KnowledgeArticle {
  id: string
  title: string
  description: string
  category: string
  difficulty: "Principiante" | "Intermedio" | "Avanzado"
  readTime: number
  tags: string[]
  isFeatured: boolean
  lastUpdated: string
  views: number
  rating: number
}

const knowledgeArticles: KnowledgeArticle[] = [
  {
    id: "getting-started",
    title: "Guía de Inicio: Cómo usar la plataforma",
    description: "Todo lo que necesitas saber para comenzar tu desarrollo profesional en nuestra plataforma.",
    category: "Inicio",
    difficulty: "Principiante",
    readTime: 5,
    tags: ["inicio", "tutorial", "básico"],
    isFeatured: true,
    lastUpdated: "2024-01-15",
    views: 1250,
    rating: 4.8,
  },
  {
    id: "career-planning",
    title: "Planificación de Carrera: Estrategias para el Éxito",
    description: "Aprende a crear un plan de carrera efectivo y alcanzar tus objetivos profesionales.",
    category: "Desarrollo Profesional",
    difficulty: "Intermedio",
    readTime: 12,
    tags: ["carrera", "planificación", "objetivos"],
    isFeatured: true,
    lastUpdated: "2024-01-14",
    views: 980,
    rating: 4.9,
  },
  {
    id: "job-search-strategies",
    title: "Estrategias Avanzadas de Búsqueda de Empleo",
    description: "Técnicas probadas para encontrar y conseguir el trabajo de tus sueños en Chile.",
    category: "Búsqueda de Empleo",
    difficulty: "Avanzado",
    readTime: 18,
    tags: ["empleo", "búsqueda", "estrategias", "chile"],
    isFeatured: false,
    lastUpdated: "2024-01-13",
    views: 756,
    rating: 4.7,
  },
]

const categories = [
  { name: "Inicio", icon: BookOpen, count: 5, color: "bg-blue-100 text-blue-800" },
  { name: "Desarrollo Profesional", icon: TrendingUp, count: 12, color: "bg-green-100 text-green-800" },
  { name: "Búsqueda de Empleo", icon: Briefcase, count: 8, color: "bg-purple-100 text-purple-800" },
  { name: "Habilidades", icon: GraduationCap, count: 15, color: "bg-orange-100 text-orange-800" },
  { name: "Entrevistas", icon: Users, count: 6, color: "bg-red-100 text-red-800" },
  { name: "CV y Perfil", icon: FileText, count: 9, color: "bg-yellow-100 text-yellow-800" },
]

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")
  const [filteredArticles, setFilteredArticles] = useState(knowledgeArticles)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterArticles(query, selectedCategory)
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    filterArticles(searchQuery, category)
  }

  const filterArticles = (query: string, category: string) => {
    let filtered = knowledgeArticles

    if (query) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.description.toLowerCase().includes(query.toLowerCase()) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
      )
    }

    if (category !== "Todos") {
      filtered = filtered.filter((article) => article.category === category)
    }

    setFilteredArticles(filtered)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">Base de Conocimiento</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Tu biblioteca completa de recursos para el desarrollo profesional y búsqueda de empleo en Chile
        </p>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar artículos, guías, tutoriales..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Featured Articles */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-5 w-5 text-yellow-500" />
          <h2 className="text-2xl font-bold">Artículos Destacados</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {knowledgeArticles
            .filter((article) => article.isFeatured)
            .map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge className={categories.find((c) => c.name === article.category)?.color}>
                      {article.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3 w-3 fill-current text-yellow-500" />
                      {article.rating}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{article.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.readTime} min
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {article.difficulty}
                      </Badge>
                    </div>
                    <Link href={`/knowledge-base/${article.id}`}>
                      <Button variant="ghost" size="sm">
                        Leer más
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </section>

      {/* Categories and Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Categorías</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant={selectedCategory === "Todos" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleCategoryFilter("Todos")}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Todos los artículos
            </Button>
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? "default" : "ghost"}
                  className="w-full justify-between"
                  onClick={() => handleCategoryFilter(category.name)}
                >
                  <div className="flex items-center">
                    <Icon className="h-4 w-4 mr-2" />
                    {category.name}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </Button>
              )
            })}
          </CardContent>
        </Card>

        {/* Articles List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">
              {selectedCategory === "Todos" ? "Todos los artículos" : selectedCategory}
            </h3>
            <p className="text-sm text-muted-foreground">
              {filteredArticles.length} artículo{filteredArticles.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={categories.find((c) => c.name === article.category)?.color}>
                          {article.category}
                        </Badge>
                        <Badge variant="outline">{article.difficulty}</Badge>
                        {article.isFeatured && (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                            <Star className="h-3 w-3 mr-1" />
                            Destacado
                          </Badge>
                        )}
                      </div>

                      <h4 className="text-lg font-semibold">{article.title}</h4>
                      <p className="text-sm text-muted-foreground">{article.description}</p>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.readTime} min de lectura
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {article.views} vistas
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current text-yellow-500" />
                          {article.rating}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Link href={`/knowledge-base/${article.id}`}>
                      <Button variant="outline">
                        Leer artículo
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Acciones Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/knowledge-base/getting-started">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                <BookOpen className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-semibold">Comenzar</div>
                  <div className="text-xs text-muted-foreground">Guía de inicio</div>
                </div>
              </Button>
            </Link>

            <Link href="/career-coach">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                <MessageSquare className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-semibold">AI Coach</div>
                  <div className="text-xs text-muted-foreground">Consulta personalizada</div>
                </div>
              </Button>
            </Link>

            <Link href="/knowledge-base/contact">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                <Shield className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-semibold">Soporte</div>
                  <div className="text-xs text-muted-foreground">Ayuda adicional</div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
