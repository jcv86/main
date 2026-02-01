'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, MoreVertical, Download, Eye, Lock } from 'lucide-react'

interface AdminUser {
  id: string
  email: string
  displayName: string
  a1_completed: boolean
  a1_score: number
  current_pillar: string
  total_score: number
  created_at: string
  last_activity: string
}

export function AdminUserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPillar, setFilterPillar] = useState('all')
  const supabase = createClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    try {
      const { data } = await supabase
        .from('despega_user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      setUsers(
        data?.map(u => ({
          id: u.id,
          email: u.email,
          displayName: u.display_name,
          a1_completed: u.a1_test_completed,
          a1_score: u.a1_total_score || 0,
          current_pillar: u.current_pillar || 'a1_cerebral',
          total_score: u.total_score || 0,
          created_at: u.created_at,
          last_activity: u.last_activity
        })) || []
      )
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterPillar === 'all' || user.current_pillar === filterPillar

    return matchesSearch && matchesFilter
  })

  const getPillarLabel = (pilar: string) => {
    const labels: Record<string, string> = {
      a1_cerebral: 'A1 Cerebral',
      a2_intermediate: 'A2 Intermedio',
      a3_rutas: 'A3 Rutas',
      a4_base: 'A4 Base'
    }
    return labels[pilar] || pilar
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por email o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select 
          value={filterPillar}
          onChange={(e) => setFilterPillar(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="all">Todos los Pilares</option>
          <option value="a1_cerebral">A1 Cerebral</option>
          <option value="a2_intermediate">A2 Intermedio</option>
          <option value="a3_rutas">A3 Rutas</option>
          <option value="a4_base">A4 Base</option>
        </select>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Email</th>
                  <th className="text-left py-2 px-4">Nombre</th>
                  <th className="text-left py-2 px-4">A1 Estado</th>
                  <th className="text-left py-2 px-4">Score A1</th>
                  <th className="text-left py-2 px-4">Pilar Actual</th>
                  <th className="text-left py-2 px-4">Score Total</th>
                  <th className="text-left py-2 px-4">Última Actividad</th>
                  <th className="text-left py-2 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.displayName || '-'}</td>
                    <td className="py-3 px-4">
                      {user.a1_completed ? (
                        <Badge className="bg-green-100 text-green-800">Completado</Badge>
                      ) : (
                        <Badge variant="outline">Pendiente</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {user.a1_score > 0 ? (
                        <span className="font-medium">{user.a1_score}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary">{getPillarLabel(user.current_pillar)}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium">{user.total_score}</span>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {new Date(user.last_activity).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No users found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
