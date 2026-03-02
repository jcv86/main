import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Check if user has already completed the Despega Cerebral test
    const { data: testResults } = await supabase
      .from("a1_tests_results")
      .select("id")
      .eq("user_id", user.id)
      .eq("test_name", "Despega Cerebral")
      .limit(1)

    if (testResults && testResults.length > 0) {
      // User already completed the test, redirect to results
      redirect("/despega/a1/resultado")
    }
  }

  return <>{children}</>
}
