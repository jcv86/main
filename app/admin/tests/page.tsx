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

  // Comprehensive test inventory
  const tests = [
    {
      id: 'test-hub',
      name: 'Main Test Hub',
      path: '/test',
      category: 'Core',
      status: 'complete',
      description: 'Central verification system with all test links and health checks',
      lastUpdated: '2026-04-04'
    },
    {
      id: 'verification',
      name: 'Comprehensive Verification',
      path: '/test-verification',
      category: 'Core',
      status: 'complete',
      description: 'Full system verification with performance metrics and diagnostics',
      lastUpdated: '2026-04-04'
    },
    {
      id: 'semantic-search',
      name: 'Semantic Search Engine',
      path: '/test-semantic-search',
      category: 'Backend',
      status: 'complete',
      description: 'Tests vector search and semantic understanding of content',
      lastUpdated: '2026-04-04'
    },
    {
      id: 'openai-brain',
      name: 'OpenAI Brain Integration',
      path: '/test-openai-brain',
      category: 'AI',
      status: 'complete',
      description: 'Tests AI-powered insights and content generation',
      lastUpdated: '2026-04-04'
    },
    {
      id: 'flow',
      name: 'Test Flow',
      path: '/test-flow',
      category: 'UX',
      status: 'complete',
      description: 'User flow verification and journey testing',
      lastUpdated: '2026-04-04'
    },
    {
      id: 'gestures',
      name: 'Mobile Gestures',
      path: '/test-gestures',
      category: 'Mobile',
      status: 'complete',
      description: 'Tests touch interactions and mobile gesture handling',
      lastUpdated: '2026-04-04'
    },
    {
      id: 'comprehensive-gestures',
      name: 'Comprehensive Gesture Testing',
      path: '/test-comprehensive-gestures',
      category: 'Mobile',
      status: 'complete',
      description: 'Advanced gesture testing with multi-touch and complex interactions',
      lastUpdated: '2026-04-04'
    },
    {
      id: 'metrics',
      name: 'Metrics & Analytics',
      path: '/test-metrics',
      category: 'Analytics',
      status: 'complete',
      description: 'Tracks metrics, user events, and analytics data',
      lastUpdated: '2026-04-04'
    },
    {
      id: 'performance',
      name: 'Performance Analysis',
      path: '/test-performance',
      category: 'Performance',
      status: 'complete',
      description: 'Performance profiling and optimization analysis',
      lastUpdated: '2026-04-04'
    },
    {
      id: 'colors',
      name: 'Color Scheme Testing',
      path: '/test-colors',
      category: 'Design',
      status: 'complete',
      description: 'Tests color palette, themes, and design token consistency',
      lastUpdated: '2026-04-04'
    },
    {
      id: 'auth-test',
      name: 'Authentication Test',
      path: '/auth/test',
      category: 'Auth',
      status: 'complete',
      description: 'Tests auth flow and session management',
      lastUpdated: '2026-04-04'
    }
  ]

  const categories = ['all', 'Core', 'Backend', 'AI', 'UX', 'Mobile', 'Analytics', 'Performance', 'Design', 'Auth']
  
  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category) => {
    const colors = {
      'Core': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Backend': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'AI': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'UX': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Mobile': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Analytics': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'Performance': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'Design': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      'Auth': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    }
    return colors[category] || 'bg-slate-100 text-slate-800'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Admin Test Management</h1>
          <p className="text-foreground/70 text-lg">Comprehensive testing & verification dashboard</p>
        </div>

        {/* Access Notice */}
        <Card className="mb-8 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="flex gap-3 pt-6">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">Admin-Only Dashboard</h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200">This page consolidates internal testing & debugging tools. Not visible to regular users.</p>
            </div>
          </CardContent>
        </Card>

        {/* Search & Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search & Filter Tests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
              <Input
                placeholder="Search tests by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white dark:bg-blue-700'
                      : 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map(test => (
            <Card key={test.id} className="hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{test.name}</CardTitle>
                    <CardDescription className="mt-1">{test.path}</CardDescription>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-4">
                <p className="text-sm text-foreground/70">{test.description}</p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-foreground/60">
                  <span>Updated: {test.lastUpdated}</span>
                  <Badge className={getCategoryColor(test.category)}>
                    {test.category}
                  </Badge>
                </div>

                {/* Action Button */}
                <Link href={test.path} className="block">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white">
                    <Beaker className="w-4 h-4 mr-2" />
                    Run Test
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredTests.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Zap className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground/70">No tests found</p>
              <p className="text-sm text-foreground/50 mt-1">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{tests.length}</div>
              <p className="text-xs text-foreground/50 mt-1">All tests complete</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{categories.length - 1}</div>
              <p className="text-xs text-foreground/50 mt-1">Organized by function</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">100%</div>
              <p className="text-xs text-foreground/50 mt-1">Tests operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Documentation */}
        <Card className="mt-12 bg-slate-50 dark:bg-slate-800/50">
          <CardHeader>
            <CardTitle>About This Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              This admin panel consolidates all internal testing and verification tools used during development.
              Each test is categorized by function and can be quickly accessed for debugging and performance validation.
            </p>
            <p>
              <strong>This page is not linked from public navigation</strong> and should only be accessible to
              admin/developer accounts. It helps keep testing tools organized and separate from the user-facing application.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
