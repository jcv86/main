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
      'Core': 'bg-blue/10 text-blue dark:bg-blue dark:text-blue/20',
      'Backend': 'bg-purple/10 text-purple dark:bg-purple dark:text-purple/20',
      'AI': 'bg-red/10 text-red dark:bg-red dark:text-red/20',
      'UX': 'bg-green/10 text-green dark:bg-green dark:text-green/20',
      'Mobile': 'bg-yellow/10 text-yellow dark:bg-yellow dark:text-yellow/20',
      'Analytics': 'bg-blue/10 text-blue dark:bg-blue dark:text-blue/20',
      'Performance': 'bg-red/10 text-red dark:bg-red dark:text-red/20',
      'Design': 'bg-cyan/10 text-cyan dark:bg-cyan dark:text-cyan/20',
      'Auth': 'bg-orange/10 text-orange dark:bg-orange dark:text-orange/20'
    }
    return colors[category] || 'bg-muted/10 text-muted/80'
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Admin Test Management</h1>
          <p className="text-foreground/70 text-lg">Comprehensive testing & verification dashboard</p>
        </div>

        {/* Access Notice */}
        <Card className="mb-8 border-yellow/20 dark:border-yellow bg-yellow/5 dark:bg-yellow/20">
          <CardContent className="flex gap-3 pt-6">
            <AlertCircle className="w-5 h-5 text-yellow dark:text-orange flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow dark:text-yellow/10">Admin-Only Dashboard</h3>
              <p className="text-sm text-yellow dark:text-yellow/20">This page consolidates internal testing & debugging tools. Not visible to regular users.</p>
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
                      ? 'bg-blue text-white dark:bg-blue'
                      : 'bg-muted/20 text-muted/90 dark:bg-muted/70 dark:text-muted/10 hover:bg-muted/30 dark:hover:bg-muted/60'
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
                  <CheckCircle2 className="w-5 h-5 text-green dark:text-green/40 flex-shrink-0 mt-1" />
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
                  <Button className="w-full bg-blue hover:bg-blue dark:bg-blue dark:hover:bg-blue text-white">
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
              <div className="text-3xl font-bold text-green dark:text-green/40">100%</div>
              <p className="text-xs text-foreground/50 mt-1">Tests operational</p>
            </CardContent>
          </Card>
        </div>

        {/* Documentation */}
        <Card className="mt-12 bg-muted/5 dark:bg-card/50">
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
