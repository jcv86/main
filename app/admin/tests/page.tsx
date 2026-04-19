'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Search, AlertCircle, CheckCircle2, Beaker, Zap } from 'lucide-react'

export default function AdminTestsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const tests = [
    { id: 'test-hub', name: 'Main Test Hub', path: '/test', category: 'Core', status: 'complete', description: 'Central verification system' },
    { id: 'verification', name: 'Verification', path: '/test-verification', category: 'Core', status: 'complete', description: 'Full system verification' },
    { id: 'semantic-search', name: 'Semantic Search', path: '/test-semantic-search', category: 'Backend', status: 'complete', description: 'Vector search testing' },
    { id: 'openai-brain', name: 'OpenAI Brain', path: '/test-openai-brain', category: 'AI', status: 'complete', description: 'AI integration testing' },
    { id: 'flow', name: 'Test Flow', path: '/test-flow', category: 'UX', status: 'complete', description: 'User flow testing' },
    { id: 'gestures', name: 'Mobile Gestures', path: '/test-gestures', category: 'Mobile', status: 'complete', description: 'Touch interactions' },
    { id: 'metrics', name: 'Metrics & Analytics', path: '/test-metrics', category: 'Analytics', status: 'complete', description: 'Metrics tracking' },
  ]

  const categories = ['all', 'Core', 'Backend', 'AI', 'UX', 'Mobile', 'Analytics']

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Admin Test Management</h1>
          <p className="text-foreground/70 text-lg">Comprehensive testing dashboard</p>
        </div>

        <Card className="mb-8 border-yellow/20 bg-yellow/5">
          <CardContent className="flex gap-3 pt-6">
            <AlertCircle className="w-5 h-5 text-yellow flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow">Admin-Only Dashboard</h3>
              <p className="text-sm text-yellow/80">This page consolidates internal testing tools. Not visible to regular users.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search & Filter Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
              <Input
                placeholder="Search tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-blue text-white'
                      : 'bg-muted/20 text-muted/90 hover:bg-muted/30'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map(test => (
            <Card key={test.id} className="hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{test.name}</CardTitle>
                    <CardDescription className="mt-1">{test.path}</CardDescription>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green flex-shrink-0 mt-1" />
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                <p className="text-sm text-foreground/70">{test.description}</p>

                <div className="flex items-center justify-between text-xs text-foreground/60">
                  <Badge className="bg-blue/10 text-blue">{test.category}</Badge>
                </div>

                <Link href={test.path} className="block">
                  <Button className="w-full bg-blue hover:bg-blue text-white">
                    <Beaker className="w-4 h-4 mr-2" />
                    Run Test
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTests.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Zap className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground/70">No tests found</p>
              <p className="text-sm text-foreground/50 mt-1">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{tests.length}</div>
              <p className="text-xs text-foreground/50 mt-1">All tests available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{categories.length - 1}</div>
              <p className="text-xs text-foreground/50 mt-1">Test categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green">100%</div>
              <p className="text-xs text-foreground/50 mt-1">Tests operational</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

}
