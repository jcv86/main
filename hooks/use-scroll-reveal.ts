'use client'

import { useEffect, useRef, useState } from 'react'

interface UseScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.1,
  rootMargin = '0px 0px -60px 0px',
  once = true,
}: UseScrollRevealOptions = {}) {
  const ref = useRef<T>(null)
  // Start as visible — IntersectionObserver will correct this only if element is off-screen
  const [inView, setInView] = useState(true)
  const [hasSetInitial, setHasSetInitial] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Check immediately if element is in viewport
    const rect = el.getBoundingClientRect()
    const alreadyVisible =
      rect.top < window.innerHeight && rect.bottom > 0

    if (!alreadyVisible) {
      setInView(false)
    }
    setHasSetInitial(true)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return { ref, inView }
}
