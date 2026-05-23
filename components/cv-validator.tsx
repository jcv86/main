'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  AlertCircle, CheckCircle2, Zap, TrendingUp, Download, RefreshCw, Copy, Loader2
} from 'lucide-react'

interface CVValidatorProps {
  jobRequirements?: string[]
}

interface ValidationResult {
  atsScore: {
    overall: number
    categories: {
      formatting: number
      content: number
      keywords: number
      structure: number
    }
    estimatedPassRate: number
  }
  suggestions: {
    critical: string[]
    important: string[]
    optional: string[]
  }
  strengths: string[]
  recommendations: Array<{
    keyword: string
    context: string
  }>
  extractedData: {
    skills: string[]
    experienceCount: number
    educationCount: number
    contactInfo: any
  }
  displayText: string
}

export function CVValidator({ jobRequirements }: CVValidatorProps) {
  const [cvText, setCvText] = useState('')
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleValidate = async () => {
    if (!cvText.trim()) {
      alert('Please paste your CV text')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/a4/cv-validator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvText,
          jobRequirements: jobRequirements || []
        })
      })

      const data = await response.json()
      if (data.success) {
        setResult(data)
      } else {
        alert('Error validating CV: ' + data.error)
      }
    } catch (error) {
      console.error('[v0] Validation error:', error)
      alert('Error validating CV')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500/10'
    if (score >= 60) return 'bg-yellow-500/10'
    return 'bg-red-500/10'
  }

  if (!result) {
    return (
      <div className="space-y-4">
        <Card className="border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[rgb(170,70,170)]" />
              CV ATS Validator
            </CardTitle>
            <CardDescription>
              Paste your CV to see how it performs with ATS parsing systems
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Paste your CV text here..."
              className="w-full h-64 p-4 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-[rgb(170,70,170)]"
            />
            <Button
              onClick={handleValidate}
              disabled={loading || !cvText.trim()}
              className="w-full bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.8)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Validate CV
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ATS Score Overview */}
      <Card className="border-[rgb(170,70,170)]/30 bg-[rgba(170,70,170,0.05)]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>ATS Compatibility Score</CardTitle>
              <CardDescription>How well your CV will parse in automated systems</CardDescription>
            </div>
            <div className={`text-6xl font-bold ${getScoreColor(result.atsScore.overall)}`}>
              {result.atsScore.overall}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Pass Rate */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Estimated ATS Pass Rate</span>
              <span className="text-sm font-bold text-green-400">
                {Math.round(result.atsScore.estimatedPassRate)}%
              </span>
            </div>
            <Progress 
              value={result.atsScore.estimatedPassRate} 
              className="h-2"
            />
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(result.atsScore.categories).map(([key, score]) => (
              <div key={key} className="text-center">
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">
                  {key === 'formatting' && 'Format'}
                  {key === 'content' && 'Content'}
                  {key === 'keywords' && 'Keywords'}
                  {key === 'structure' && 'Structure'}
                </p>
                <p className={`text-2xl font-bold ${getScoreColor(score)}`}>
                  {score}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strengths */}
      {result.strengths.length > 0 && (
        <Card className="border-green-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              What You're Doing Well
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.strengths.map((strength, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-green-400">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Critical Issues */}
      {result.suggestions.critical.length > 0 && (
        <Card className="border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              Critical Issues
            </CardTitle>
            <CardDescription>Fix these for ATS systems to parse your CV correctly</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.suggestions.critical.map((issue, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-red-400">•</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Important Improvements */}
      {result.suggestions.important.length > 0 && (
        <Card className="border-yellow-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-400">
              <TrendingUp className="w-5 h-5" />
              Important Improvements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.suggestions.important.map((issue, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="text-yellow-400">•</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Extracted Data */}
      <Card className="border-slate-700/50">
        <CardHeader>
          <CardTitle>Extracted Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-slate-400 mb-2">Technical Skills</p>
            <div className="flex flex-wrap gap-2">
              {result.extractedData.skills.slice(0, 8).map(skill => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
              {result.extractedData.skills.length > 8 && (
                <Badge variant="outline">+{result.extractedData.skills.length - 8} more</Badge>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400">Experience Entries</p>
              <p className="text-2xl font-bold">{result.extractedData.experienceCount}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Education Entries</p>
              <p className="text-2xl font-bold">{result.extractedData.educationCount}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            setCopied(true)
            navigator.clipboard.writeText(result.displayText)
            setTimeout(() => setCopied(false), 2000)
          }}
          className="flex-1"
        >
          <Copy className="w-4 h-4 mr-2" />
          {copied ? 'Copied!' : 'Copy Suggestions'}
        </Button>
        <Button
          variant="outline"
          onClick={() => setResult(null)}
          className="flex-1"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Validate New CV
        </Button>
      </div>
    </div>
  )
}
