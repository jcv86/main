import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import LandingPage from "@/components/landing-page"
import DashboardContent from "@/components/dashboard-content"

export default async function HomePage() {
  const cookieStore = await cookies()

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return <LandingPage />
  }

  return <DashboardContent />
}
