"use client"

import { useSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader } from "lucide-react"

export const dynamic = "force-dynamic"

export default function AuthDebugPage() {
  const sessionResult = useSession()
  const { data: session, status } = sessionResult || { data: null, status: "unauthenticated" }
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      fetchEnrichedProfile()
    } else {
      setLoading(false)
    }
  }, [status, session])

  const fetchEnrichedProfile = async () => {
    try {
      const response = await fetch("/api/despega/profile")
      const data = await response.json()
      setProfile(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Auth Debug Dashboard</h1>
        <p className="text-muted-foreground">
          Verifica el estado de autenticación y enriquecimiento de perfil
        </p>
      </div>

      {/* Session Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status === "authenticated" ? (
              <>
                <CheckCircle className="h-5 w-5 text-green" />
                Autenticado
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red" />
                No autenticado
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="text-lg">{status}</p>
          </div>

          {status === "authenticated" && session?.user && (
            <>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg">{session.user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Provider</p>
                <Badge variant="outline">
                  {(session as any).provider || "Unknown"}
                </Badge>
              </div>
              <Button
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                variant="destructive"
              >
                Sign Out
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Profile Enrichment */}
      {status === "authenticated" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {loading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Loading profile...
                </>
              ) : profile?.linkedin_context ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green" />
                  Perfil enriquecido
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-yellow" />
                  Perfil no enriquecido
                </>
              )}
            </CardTitle>
            <CardDescription>Datos de LinkedIn/Google extraídos</CardDescription>
          </CardHeader>
          <CardContent>
            {profile && (
              <div className="space-y-4">
                {profile.linkedin_context && (
                  <div className="bg-blue/5 dark:bg-blue p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">LinkedIn Data</h3>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <strong>Title:</strong> {profile.linkedin_context.currentTitle || "N/A"}
                      </li>
                      <li>
                        <strong>Company:</strong> {profile.linkedin_context.currentCompany || "N/A"}
                      </li>
                      <li>
                        <strong>Industry:</strong> {profile.linkedin_context.industry || "N/A"}
                      </li>
                      <li>
                        <strong>Experience:</strong>{" "}
                        {profile.linkedin_context.yearsOfExperience || 0} years
                      </li>
                      <li>
                        <strong>Skills:</strong>{" "}
                        {profile.linkedin_context.topSkills?.join(", ") || "N/A"}
                      </li>
                    </ul>
                  </div>
                )}

                <div className="bg-muted/5 dark:bg-background p-4 rounded-lg max-h-96 overflow-auto">
                  <h3 className="font-semibold mb-2">Raw Profile Data</h3>
                  <pre className="text-xs">{JSON.stringify(profile, null, 2)}</pre>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
