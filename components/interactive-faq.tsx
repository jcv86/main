"use client"

import { useState, useMemo } from "react"
import {
  Search,
  ChevronDown,
  MessageCircle,
  Sparkles,
  Book,
  Clipboard,
  User,
  Building,
  HelpCircle,
  ArrowRight,
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
  // Track which items the user has explicitly opened. All answers stay in the
  // DOM regardless (crawler / LLM visible); this only drives the visual collapse.
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  const filteredFAQs = useMemo(() => {
    let filtered = FAQ_DATA

    if (selectedCategory !== "all") {
      filtered = filtered.filter((faq) => faq.category === selectedCategory)
    }

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

  const toggleOpen = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const getRelatedFAQs = (faq: FAQItem): FAQItem[] => {
    if (!faq.relatedIds) return []
    return FAQ_DATA.filter((f) => faq.relatedIds?.includes(f.id))
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Busca tu pregunta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Buscar en preguntas frecuentes"
            className="pl-12 pr-4 h-14 text-base bg-card border-border rounded-xl focus-visible:ring-[rgba(80,160,170,0.5)]"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors border ${
            selectedCategory === "all"
              ? "bg-[rgba(80,160,170,0.9)] text-white border-transparent"
              : "bg-card text-foreground/70 border-border hover:border-[rgba(80,160,170,0.5)]"
          }`}
        >
          Todas
        </button>
        {Object.entries(FAQ_CATEGORIES).map(([key, { label, icon }]) => {
          const Icon = CATEGORY_ICONS[icon as keyof typeof CATEGORY_ICONS]
          const active = selectedCategory === key
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as FAQCategory)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors border inline-flex items-center gap-2 ${
                active
                  ? "bg-[rgba(80,160,170,0.9)] text-white border-transparent"
                  : "bg-card text-foreground/70 border-border hover:border-[rgba(80,160,170,0.5)]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          )
        })}
      </div>

      {/* Results Count */}
      <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
        {filteredFAQs.length} {filteredFAQs.length === 1 ? "pregunta encontrada" : "preguntas encontradas"}
      </p>

      {/* FAQ List */}
      <div className="space-y-3 mb-12">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground/70 mb-4">No encontramos preguntas que coincidan con tu búsqueda</p>
            <Link href="/auth/signin" prefetch={true}>
              <Button className="gap-2 bg-[rgba(80,160,170,0.9)] hover:bg-[rgba(80,160,170,1)] text-white">
                <MessageCircle className="w-4 h-4" />
                Pregúntale a Vera
              </Button>
            </Link>
          </div>
        ) : (
          filteredFAQs.map((faq) => {
            const isOpen = openIds.has(faq.id)
            const relatedFAQs = getRelatedFAQs(faq)
            const categoryInfo = FAQ_CATEGORIES[faq.category]
            const CategoryIcon = CATEGORY_ICONS[categoryInfo.icon as keyof typeof CATEGORY_ICONS]

            return (
              <article
                key={faq.id}
                id={`faq-${faq.id}`}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
                className={`rounded-xl border bg-card overflow-hidden transition-colors ${
                  isOpen ? "border-[rgba(80,160,170,0.5)]" : "border-border hover:border-white/20"
                }`}
              >
                <button
                  onClick={() => toggleOpen(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`answer-${faq.id}`}
                  className="w-full px-5 py-4 flex items-start justify-between gap-4 text-left"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <CategoryIcon className="w-3.5 h-3.5 text-[rgba(80,160,170,0.9)]" />
                      <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                        {categoryInfo.label}
                      </span>
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-foreground" itemProp="name">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground flex-shrink-0 mt-1 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[rgba(80,160,170,0.9)]" : ""
                    }`}
                  />
                </button>

                {/* Answer is ALWAYS rendered in the DOM (crawler / LLM visible).
                    The grid-rows trick collapses it visually without removing it. */}
                <div
                  id={`answer-${faq.id}`}
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                  aria-hidden={!isOpen}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5">
                      <div className="pt-3 border-t border-border">
                        <p className="text-foreground/75 leading-relaxed" itemProp="text">
                          {faq.answer}
                        </p>

                        {relatedFAQs.length > 0 && (
                          <div className="mt-5 pt-4 border-t border-border">
                            <p className="text-sm font-medium text-foreground mb-2">Preguntas relacionadas</p>
                            <div className="flex flex-col gap-1.5">
                              {relatedFAQs.map((related) => (
                                <button
                                  key={related.id}
                                  onClick={() => {
                                    if (!openIds.has(related.id)) toggleOpen(related.id)
                                    setTimeout(() => {
                                      document.getElementById(`faq-${related.id}`)?.scrollIntoView({
                                        behavior: "smooth",
                                        block: "center",
                                      })
                                    }, 120)
                                  }}
                                  className="inline-flex items-center gap-1.5 text-left text-sm text-[rgba(80,160,170,0.95)] hover:underline"
                                >
                                  <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                                  {related.question}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            )
          })
        )}
      </div>

      {/* CTA to Vera */}
      <div className="rounded-2xl border border-[rgba(80,160,170,0.3)] bg-[rgba(80,160,170,0.06)] p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-5 md:justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[rgba(80,160,170,0.15)] border border-[rgba(80,160,170,0.4)] flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-6 h-6 text-[rgba(80,160,170,0.95)]" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-foreground">¿No encontraste tu respuesta?</h2>
              <p className="text-sm text-foreground/70">Vera, tu coach con IA, responde al instante 24/7.</p>
            </div>
          </div>
          <Link href="/auth/signin" prefetch={true} className="flex-shrink-0">
            <Button
              size="lg"
              className="gap-2 w-full md:w-auto bg-[rgba(80,160,170,0.9)] hover:bg-[rgba(80,160,170,1)] text-white rounded-full px-6"
            >
              <Sparkles className="w-4 h-4" />
              Hablar con Vera
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
