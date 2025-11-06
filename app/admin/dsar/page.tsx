import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Download, Trash2, CheckCircle, XCircle, Clock, AlertTriangle, FileText, User } from "lucide-react"

export const dynamic = "force-dynamic"

async function getDSARData() {
  const supabase = await createClient()

  const [{ data: pendingRequests }, { data: allRequests }, { data: stats }] = await Promise.all([
    supabase.from("dsar_pending_requests").select("*").limit(50),
    supabase.from("dsar_request_summary").select("*").limit(100),
    supabase.rpc("get_dsar_stats"),
  ])

  return {
    pendingRequests: pendingRequests || [],
    allRequests: allRequests || [],
    stats: stats || {},
  }
}

function getStatusBadge(status: string) {
  const variants: Record<string, { variant: any; icon: any }> = {
    pending: { variant: "secondary", icon: Clock },
    verified: { variant: "default", icon: CheckCircle },
    processing: { variant: "default", icon: Clock },
    completed: { variant: "default", icon: CheckCircle },
    rejected: { variant: "destructive", icon: XCircle },
    cancelled: { variant: "secondary", icon: XCircle },
  }

  const config = variants[status] || variants.pending
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  )
}

function getRequestTypeBadge(type: string) {
  const icons: Record<string, any> = {
    access: Download,
    deletion: Trash2,
    portability: FileText,
    rectification: User,
  }

  const Icon = icons[type] || FileText

  return (
    <Badge variant="outline" className="gap-1">
      <Icon className="h-3 w-3" />
      {type}
    </Badge>
  )
}

export default async function DSARPage() {
  const { pendingRequests, allRequests, stats } = await getDSARData()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            DSAR Management
          </h1>
          <p className="text-muted-foreground mt-1">Data Subject Access Requests (GDPR Compliance)</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allRequests.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allRequests.filter((r) => r.status === "completed").length}</div>
            <p className="text-xs text-muted-foreground">Successfully processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24h</div>
            <p className="text-xs text-muted-foreground">Target: &lt;72h</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="all">All Requests ({allRequests.length})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending DSAR Requests</CardTitle>
              <CardDescription>Requests requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No pending requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request: any) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{request.user_email}</span>
                          {getRequestTypeBadge(request.request_type)}
                          {getStatusBadge(request.status)}
                          {request.priority === "high" && (
                            <Badge variant="destructive" className="gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              High Priority
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Requested {new Date(request.created_at).toLocaleString()}
                          {" • "}
                          Waiting {Math.floor(request.hours_waiting)}h
                        </p>
                        {request.request_reason && (
                          <p className="text-sm text-muted-foreground italic">Reason: {request.request_reason}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        {request.status === "verified" && <Button size="sm">Process Request</Button>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All DSAR Requests</CardTitle>
              <CardDescription>Complete history of data subject access requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {allRequests.map((request: any) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{request.user_email}</span>
                        {getRequestTypeBadge(request.request_type)}
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(request.created_at).toLocaleDateString()}
                        {request.completed_at && (
                          <> • Completed {new Date(request.completed_at).toLocaleDateString()}</>
                        )}
                        {request.tables_collected > 0 && (
                          <>
                            {" "}
                            • {request.tables_collected} tables, {request.total_records} records
                          </>
                        )}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>DSAR Configuration</CardTitle>
              <CardDescription>Configure how DSAR requests are processed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Verification Settings</h3>
                <p className="text-sm text-muted-foreground">Email verification is required for all DSAR requests</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Processing Timeframes</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Export links expire after 7 days</li>
                  <li>• Deletion requests have a 30-day grace period</li>
                  <li>• Target processing time: 72 hours</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Admin Notifications</h3>
                <p className="text-sm text-muted-foreground">Admins are notified of new DSAR requests via email</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
