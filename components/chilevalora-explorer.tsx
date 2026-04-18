'use client'

import { useState, useEffect } from 'react'
import { ChileValoraBrain, type ChileValoraSearchResult, type CareerMatchResult } from '@/lib/chilevalora-brain'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Search, TrendingUp, Heart, AlertCircle } from 'lucide-react'

/**
 * Phase 4: ChileValora Explorer UI
 * Interactive component for discovering job profiles and career paths
 */

interface ChileValoraExplorerProps {
  userTestResults?: Record<string, number>
  userCompetencies?: string[]
  onProfileSelect?: (profile: ChileValoraSearchResult) => void
}

export function ChileValoraExplorer({
  userTestResults,
  userCompetencies,
  onProfileSelect,
}: ChileValoraExplorerProps) {
  const [activeTab, setActiveTab] = useState('search')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSector, setSelectedSector] = useState<string>('')
  const [sectors, setSectors] = useState<string[]>([])
  
  const [searchResults, setSearchResults] = useState<ChileValoraSearchResult[]>([])
  const [careerPath, setCareerPath] = useState<CareerMatchResult[]>([])
  const [trendingProfiles, setTrendingProfiles] = useState<ChileValoraSearchResult[]>([])
  
  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  // Load sectors on mount
  useEffect(() => {
    const loadSectors = async () => {
      const sectoresList = await ChileValoraBrain.getSectors()
      setSectors(sectoresList)
    }
    loadSectors()
  }, [])

  // Load trending profiles on mount
  useEffect(() => {
    const loadTrending = async () => {
      const trending = await ChileValoraBrain.getTrendingProfiles(selectedSector)
      setTrendingProfiles(trending)
    }
    loadTrending()
  }, [selectedSector])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    try {
      const results = await ChileValoraBrain.searchProfiles(searchQuery, {
        sector: selectedSector || undefined,
        max_results: 10,
      })
      setSearchResults(results)
    } finally {
      setLoading(false)
    }
  }

  const handleCareerPath = async () => {
    if (!userTestResults || !userCompetencies) return

    setLoading(true)
    try {
      const results = await ChileValoraBrain.findCareerPath(userTestResults, userCompetencies)
      setCareerPath(results)
      setActiveTab('matches')
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (codigo: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(codigo)) {
      newFavorites.delete(codigo)
    } else {
      newFavorites.add(codigo)
    }
    setFavorites(newFavorites)
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Explorador de Perfiles ChileValora</h2>
        <p className="text-muted-foreground">
          Descubre oportunidades de carrera alineadas con tus competencias y aspiraciones
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="search">Búsqueda</TabsTrigger>
          <TabsTrigger value="trending">Tendencias</TabsTrigger>
          <TabsTrigger value="matches" disabled={!userTestResults}>
            Mi Carrera
          </TabsTrigger>
          <TabsTrigger value="favorites">
            Favoritos ({favorites.size})
          </TabsTrigger>
        </TabsList>

        {/* Tab: Search */}
        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Buscar Perfiles</CardTitle>
              <CardDescription>
                Describe el perfil que buscas en lenguaje natural
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Ej: Tecnología con liderazgo en equipo..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                <Button
                  onClick={handleSearch}
                  disabled={loading || !searchQuery.trim()}
                  className="gap-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  Buscar
                </Button>
              </div>

              {/* Sector Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Filtrar por Sector</label>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={selectedSector === '' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedSector('')}
                  >
                    Todos
                  </Badge>
                  {sectors.map(sector => (
                    <Badge
                      key={sector}
                      variant={selectedSector === sector ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setSelectedSector(sector)}
                    >
                      {sector}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Results */}
              <div className="space-y-4 mt-6">
                {loading && <p className="text-center text-muted-foreground">Buscando...</p>}
                {!loading && searchResults.length === 0 && searchQuery && (
                  <p className="text-center text-muted-foreground">
                    No se encontraron resultados para "{searchQuery}"
                  </p>
                )}
                {searchResults.map(result => (
                  <ProfileCard
                    key={result.profile_codigo}
                    profile={result}
                    isFavorite={favorites.has(result.profile_codigo)}
                    onFavorite={() => toggleFavorite(result.profile_codigo)}
                    onSelect={() => onProfileSelect?.(result)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Trending */}
        <TabsContent value="trending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Perfiles en Demanda
              </CardTitle>
              <CardDescription>
                Oportunidades con mayor empleabilidad del mercado
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {trendingProfiles.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Cargando perfiles en demanda...
                </p>
              ) : (
                trendingProfiles.map(profile => (
                  <ProfileCard
                    key={profile.profile_codigo}
                    profile={profile}
                    isFavorite={favorites.has(profile.profile_codigo)}
                    onFavorite={() => toggleFavorite(profile.profile_codigo)}
                    onSelect={() => onProfileSelect?.(profile)}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: My Career Path */}
        {userTestResults && (
          <TabsContent value="matches" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tu Camino Profesional</CardTitle>
                <CardDescription>
                  Perfiles alineados con tus resultados de tests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={handleCareerPath}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Analizando...
                    </>
                  ) : (
                    'Analizar Mi Carrera'
                  )}
                </Button>

                {careerPath.length > 0 && (
                  <div className="space-y-4">
                    {careerPath.map((match, idx) => (
                      <CareerMatchCard
                        key={idx}
                        match={match}
                        isFavorite={favorites.has(match.profile.profile_codigo)}
                        onFavorite={() =>
                          toggleFavorite(match.profile.profile_codigo)
                        }
                        onSelect={() => onProfileSelect?.(match.profile)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Tab: Favorites */}
        <TabsContent value="favorites" className="space-y-4">
          {favorites.size === 0 ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-muted-foreground">
                  No tienes favoritos aún. Guarda perfiles que te interesen.
                </p>
              </CardContent>
            </Card>
          ) : (
            <p className="text-sm text-muted-foreground">
              Tienes {favorites.size} perfiles guardados
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

/**
 * Profile Card Component
 */
interface ProfileCardProps {
  profile: ChileValoraSearchResult
  isFavorite: boolean
  onFavorite: () => void
  onSelect: () => void
}

function ProfileCard({ profile, isFavorite, onFavorite, onSelect }: ProfileCardProps) {
  const demandColor = {
    alto: 'bg-red-100 text-red-800',
    medio: 'bg-yellow-100 text-yellow-800',
    bajo: 'bg-green-100 text-green-800',
  }

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onSelect}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{profile.nombre}</h3>
            <p className="text-sm text-muted-foreground">{profile.sector}</p>
          </div>
          <button
            onClick={e => {
              e.stopPropagation()
              onFavorite()
            }}
            className="p-2 hover:bg-accent rounded-lg"
          >
            <Heart
              className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red' : 'text-muted/40'}`}
            />
          </button>
        </div>

        <div className="flex gap-2 flex-wrap mb-4">
          <Badge className={demandColor[profile.nivel_demanda]}>
            Demanda: {profile.nivel_demanda.charAt(0).toUpperCase() + profile.nivel_demanda.slice(1)}
          </Badge>
          {profile.empleabilidad > 0 && (
            <Badge variant="outline">Empleabilidad: {profile.empleabilidad}%</Badge>
          )}
        </div>

        {profile.competencias.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Competencias:</p>
            <div className="flex flex-wrap gap-1">
              {profile.competencias.slice(0, 5).map((comp, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {comp}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Career Match Card with Gap Analysis
 */
interface CareerMatchCardProps {
  match: CareerMatchResult
  isFavorite: boolean
  onFavorite: () => void
  onSelect: () => void
}

function CareerMatchCard({ match, isFavorite, onFavorite, onSelect }: CareerMatchCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onSelect}>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{match.profile.nombre}</h3>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-full bg-muted/20 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${match.matchPercentage}%` }}
                />
              </div>
              <span className="text-sm font-semibold">{match.matchPercentage}%</span>
            </div>
          </div>
          <button
            onClick={e => {
              e.stopPropagation()
              onFavorite()
            }}
          >
            <Heart
              className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red' : 'text-muted/40'}`}
            />
          </button>
        </div>

        {/* Gap Analysis */}
        <div className="space-y-2 mt-4">
          <p className="text-xs font-medium text-muted-foreground">Análisis de Competencias:</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {match.gapAnalysis.map((gap, idx) => (
              <div
                key={idx}
                className={`p-2 rounded text-center ${
                  gap.estado === 'acquired'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {gap.competencia}
                <div className="text-xs mt-1">
                  {gap.estado === 'acquired' ? '✓' : '○'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Competencies Alert */}
        {match.gapAnalysis.some(g => g.estado === 'missing') && (
          <div className="flex gap-2 items-start mt-4 p-3 bg-yellow-50 rounded-[28px] border border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-yellow-800">
              {match.gapAnalysis.filter(g => g.estado === 'missing').length} competencias
              por desarrollar
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
