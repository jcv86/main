"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Brain,
  Target,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  ArrowRight,
  AlertTriangle,
  Info,
  Home,
  Settings,
  User,
  Bell,
} from "lucide-react"
import { useRouter } from "next/navigation"

export function ColorSchemeTest() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Button variant="outline" onClick={() => router.push("/")} className="mb-4">
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-4xl font-bold text-foreground">Color Scheme Test</h1>
          <p className="text-xl text-mutedForeground">
            Testing the minimal gray and white color palette across all UI components
          </p>
        </div>

        {/* Color Palette Display */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Color Palette</CardTitle>
            <CardDescription className="text-mutedForeground">
              Our minimal color scheme using only grays and white, with red for destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="w-full h-16 bg-background border border-border rounded"></div>
                <p className="text-sm text-foreground font-medium">Background</p>
                <p className="text-xs text-mutedForeground">Pure White</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-16 bg-foreground rounded"></div>
                <p className="text-sm text-foreground font-medium">Foreground</p>
                <p className="text-xs text-mutedForeground">Dark Gray</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-16 bg-muted border border-border rounded"></div>
                <p className="text-sm text-foreground font-medium">Muted</p>
                <p className="text-xs text-mutedForeground">Light Gray</p>
              </div>
              <div className="space-y-2">
                <div className="w-full h-16 bg-destructive rounded"></div>
                <p className="text-sm text-foreground font-medium">Destructive</p>
                <p className="text-xs text-mutedForeground">Red Accent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Buttons</CardTitle>
            <CardDescription className="text-mutedForeground">Various button styles and states</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-foreground text-background hover:bg-foreground/90">Primary Button</Button>
              <Button variant="outline" className="border-border hover:bg-muted bg-transparent">
                Outline Button
              </Button>
              <Button variant="secondary" className="bg-muted text-mutedForeground hover:bg-muted/80">
                Secondary Button
              </Button>
              <Button variant="destructive" className="bg-destructive text-destructiveForeground">
                Destructive Button
              </Button>
              <Button variant="ghost" className="hover:bg-muted">
                Ghost Button
              </Button>
              <Button disabled className="opacity-50 cursor-not-allowed">
                Disabled Button
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cards and Badges */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Sample Card</CardTitle>
                <Badge variant="secondary" className="bg-muted text-mutedForeground">
                  New
                </Badge>
              </div>
              <CardDescription className="text-mutedForeground">
                This is a sample card showing the color scheme in action
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-muted text-foreground">JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">John Doe</p>
                    <p className="text-xs text-mutedForeground">Software Engineer</p>
                  </div>
                </div>
                <Progress value={75} className="w-full" />
                <div className="flex space-x-2">
                  <Badge variant="outline" className="border-border text-foreground">
                    React
                  </Badge>
                  <Badge variant="outline" className="border-border text-foreground">
                    TypeScript
                  </Badge>
                  <Badge className="bg-foreground/10 text-foreground border-foreground/20">Expert</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Statistics</CardTitle>
              <CardDescription className="text-mutedForeground">Performance metrics and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-mutedForeground">Completion Rate</span>
                  <span className="text-sm font-medium text-foreground">85%</span>
                </div>
                <Progress value={85} className="w-full" />
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-foreground">12</div>
                    <div className="text-xs text-mutedForeground">Tests</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">94%</div>
                    <div className="text-xs text-mutedForeground">Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">7</div>
                    <div className="text-xs text-mutedForeground">Days</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Forms */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Form Elements</CardTitle>
            <CardDescription className="text-mutedForeground">Input fields and form controls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-foreground">
                    Name
                  </Label>
                  <Input id="name" placeholder="Enter your name" className="border-border focus:border-foreground" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-foreground">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="border-border focus:border-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-foreground">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Enter your message"
                    className="border-border focus:border-foreground"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <Alert className="border-border bg-card">
                  <Info className="h-4 w-4" />
                  <AlertTitle className="text-foreground">Information</AlertTitle>
                  <AlertDescription className="text-mutedForeground">
                    This is an informational alert using our color scheme.
                  </AlertDescription>
                </Alert>
                <Alert variant="destructive" className="border-destructive/50 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>This is a destructive alert showing the red accent color.</AlertDescription>
                </Alert>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Tabs Component</CardTitle>
            <CardDescription className="text-mutedForeground">
              Tabbed interface showing different content sections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-muted">
                <TabsTrigger value="overview" className="data-[state=active]:bg-background">
                  <Target className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-background">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="team" className="data-[state=active]:bg-background">
                  <Users className="h-4 w-4 mr-2" />
                  Team
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-background">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-border rounded-lg">
                    <Brain className="h-8 w-8 text-foreground mx-auto mb-2" />
                    <h3 className="font-semibold text-foreground">AI Insights</h3>
                    <p className="text-sm text-mutedForeground">Powered by advanced algorithms</p>
                  </div>
                  <div className="text-center p-4 border border-border rounded-lg">
                    <BookOpen className="h-8 w-8 text-foreground mx-auto mb-2" />
                    <h3 className="font-semibold text-foreground">Learning Resources</h3>
                    <p className="text-sm text-mutedForeground">Curated content library</p>
                  </div>
                  <div className="text-center p-4 border border-border rounded-lg">
                    <Award className="h-8 w-8 text-foreground mx-auto mb-2" />
                    <h3 className="font-semibold text-foreground">Achievements</h3>
                    <p className="text-sm text-mutedForeground">Track your progress</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="analytics" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground">Assessment Completion</span>
                    <span className="text-foreground font-medium">78%</span>
                  </div>
                  <Progress value={78} />
                  <div className="flex items-center justify-between">
                    <span className="text-foreground">Learning Progress</span>
                    <span className="text-foreground font-medium">65%</span>
                  </div>
                  <Progress value={65} />
                </div>
              </TabsContent>
              <TabsContent value="team" className="mt-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                      <Avatar>
                        <AvatarFallback className="bg-muted text-foreground">U{i}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Team Member {i}</p>
                        <p className="text-sm text-mutedForeground">Role description</p>
                      </div>
                      <Badge variant="outline" className="border-border text-foreground">
                        Active
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="settings" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Notifications</p>
                      <p className="text-sm text-mutedForeground">Receive email updates</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-border hover:bg-muted bg-transparent">
                      <Bell className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">Privacy</p>
                      <p className="text-sm text-mutedForeground">Manage data preferences</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-border hover:bg-muted bg-transparent">
                      <User className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Brain, title: "AI Analysis", desc: "Smart insights from your data" },
            { icon: Target, title: "Goal Tracking", desc: "Monitor your progress" },
            { icon: TrendingUp, title: "Growth Metrics", desc: "Measure improvement" },
            { icon: Users, title: "Team Collaboration", desc: "Work together effectively" },
            { icon: BookOpen, title: "Learning Hub", desc: "Access educational content" },
            { icon: Award, title: "Achievements", desc: "Celebrate milestones" },
          ].map((feature, index) => (
            <Card key={index} className="border-border bg-card hover:shadow-md transition-shadow">
              <CardHeader>
                <feature.icon className="h-8 w-8 text-foreground mb-2" />
                <CardTitle className="text-foreground">{feature.title}</CardTitle>
                <CardDescription className="text-mutedForeground">{feature.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full border-border hover:bg-muted bg-transparent">
                  Learn More
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-border">
          <p className="text-mutedForeground">
            Color scheme test completed. All components use the minimal gray and white palette.
          </p>
          <Button
            onClick={() => router.push("/")}
            className="mt-4 bg-foreground text-background hover:bg-foreground/90"
          >
            <Home className="h-4 w-4 mr-2" />
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  )
}
