import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import { PerfilIntegralClient } from "./perfil-integral-client"

export default async function PerfilIntegralPage() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  // Fetch all test results for the user
  const { data: testResults } = await supabase
    .from("test_results")
    .select("*")
    .eq("user_email", user.email)
    .order("completed_at", { ascending: false })

  return <PerfilIntegralClient testResults={testResults || []} userEmail={user.email || ""} />
}
