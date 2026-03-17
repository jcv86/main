'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
export default function A1CerebralPage() {
  const router = useRouter()
  useEffect(() => {
    const check = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/signin'); return }
      router.push('/despega/a1-report')
    }
    check()
  }, [router])
  return <div className="min-h-screen flex items-center justify-center"><p>Cargando...</p></div>
}
