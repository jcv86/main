"use client"

import { useState, useMemo } from "react"
import {
  Search,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Sparkles,
  Book,
  Clipboard,
  User,
  Building,
  HelpCircle,
} from "lucide-react"
import { FAQ_DATA, FAQ_CATEGORIES, type FAQCategory, type FAQItem } from "@/lib/faq-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const CATEGORY_ICONS = {
  clipboard: Clipboard,
  book: Book,
  sparkles: Sparkles,
  user: User,
  building: Building,
  help: HelpCircle,
}

export function InteractiveFAQ() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | "all">("all")
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const filteredFAQs = useMemo(() => {
    let filtered = FAQ_DATA

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((faq) => faq.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query) ||
          faq.keywords.some((keyword) => keyword.toLowerCase().includes(query)),
      )
    }

    return filtered
  }, [searchQuery, selectedCategory])

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const getRelatedFAQs = (faq: FAQItem): FAQItem[] => {
    if (!faq.relatedIds) return []
    return FAQ_DATA.filter((f) => faq.relatedIds?.includes(f.id))
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Busca tu pregunta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-6 text-lg"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          onClick={() => setSelectedCategory("all")}
          className="rounded-full"
        >
          Todas
        </Button>
        {Object.entries(FAQ_CATEGORIES).map(([key, { label, icon }]) => {
          const Icon = CATEGORY_ICONS[icon as keyof typeof CATEGORY_ICONS]
          return (
            <Button
              key={key}
              variant={selectedCategory === key ? "default" : "outline"}
              onClick={() => setSelectedCategory(key as FAQCategory)}
              className="rounded-full gap-2"
            >
              <Icon className="w-4 h-4" />
              {label}
            </Button>
          )
        })}
      </div>

      {/* Results Count */}
      <div className="mb-6 text-sm text-gray-600">
        {filteredFAQs.length} {filteredFAQs.length === 1 ? "pregunta encontrada" : "preguntas encontradas"}
      </div>

      {/* FAQ List */}
      <div className="space-y-4 mb-12">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No encontramos preguntas que coincidan con tu búsqueda</p>
            <Link href="/ai-coach">
              <Button className="gap-2">
                <MessageCircle className="w-4 h-4" />
                Pregúntale a Sofia o Dani
              </Button>
            </Link>
          </div>
        ) : (
          filteredFAQs.map((faq) => {
            const isExpanded = expandedIds.has(faq.id)
            const relatedFAQs = getRelatedFAQs(faq)
            const categoryInfo = FAQ_CATEGORIES[faq.category]
            const CategoryIcon = CATEGORY_ICONS[categoryInfo.icon as keyof typeof CATEGORY_ICONS]

            return (
              <div
                key={faq.id}
                id={`faq-${faq.id}`}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleExpanded(faq.id)}
                  className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CategoryIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        {categoryInfo.label}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6">
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-gray-700 leading-relaxed mb-4">{faq.answer}</p>

                      {relatedFAQs.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <p className="text-sm font-medium text-gray-900 mb-3">Preguntas relacionadas:</p>
                          <div className="space-y-2">
                            {relatedFAQs.map((related) => (
                              <button
                                key={related.id}
                                onClick={() => {
                                  toggleExpanded(related.id)
                                  // Scroll to the related FAQ
                                  setTimeout(() => {
                                    document.getElementById(`faq-${related.id}`)?.scrollIntoView({
                                      behavior: "smooth",
                                      block: "center",
                                    })
                                  }, 100)
                                }}
                                className="block w-full text-left text-sm text-blue-600 hover:text-blue-700 hover:underline"
                              >
                                → {related.question}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* CTA to AI Coach */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <MessageCircle className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">¿No encontraste tu respuesta?</h3>
            <p className="text-gray-600">Pregúntale directamente a Sofia o Dani</p>
          </div>
        </div>
        <Link href="/ai-coach">
          <Button size="lg" className="gap-2">
            <Sparkles className="w-4 h-4" />
            Chatear con Sofia & Dani
          </Button>
        </Link>
      </div>
    </div>
  )
}
