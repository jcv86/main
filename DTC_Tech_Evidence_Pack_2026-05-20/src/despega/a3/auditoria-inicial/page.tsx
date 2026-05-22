'use client'

import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function AuditoriaInicialPage() {
  useEffect(() => {
    // Redirect to the full interview-0 experience
    redirect('/despega/interview-0')
  }, [])

  return null
}
