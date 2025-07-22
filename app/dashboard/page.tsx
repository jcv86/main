"use client"

import { Shell } from "@/components/shell"
import { DashboardHeader } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { UDDCareerRecommendations } from "@/components/udd-career-recommendations"
import { BookOpen, Target, TrendingUp, Users, Calendar, CheckCircle, Clock, Star } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  // Mock user data
  const user = {
    name: "Demo User",
    completedAssessments: 3,
    totalAssessments: 5,
    skillsProgress: 75,
    careerGoals: ["Software Engineer", "Product Manager"],
    recentActivity: [
      { type: "assessment", name: "Technical Skills", date: "2 days ago", completed: true },
      { type: "coaching", name: "Career Planning Session", date: "1 week ago", completed: true },
      { type: "cv", name: "CV Update", date: "3 days ago", completed: false },
    ],
  }

  const quickActions = [
    {
      title: "Take Skills Assessment",
      description: "Evaluate your technical and soft skills",
      href: "/skills-assessment",
      icon: Target,
      color: "bg-blue-500",
    },
    {
      title: "Career Coaching",
      description: "Get personalized career guidance",
      href: "/career-coach",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Build CV",
      description: "Create or update your resume",
      href: "/cv-builder",
      icon: BookOpen,
      color: "bg-purple-500",
    },
    {
      title: "Job Search",
      description: "Find relevant job opportunities",
      href: "/job-search",
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ]

  return (
    <Shell>
      <DashboardHeader
        heading={`Welcome back, ${user.name}!`}
        text="Track your career development progress and explore new opportunities."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Progress Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assessments Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {user.completedAssessments}/{user.totalAssessments}
            </div>
            <Progress value={(user.completedAssessments / user.totalAssessments) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills Progress</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.skillsProgress}%</div>
            <Progress value={user.skillsProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Career Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.careerGoals.length}</div>
            <div className="flex flex-wrap gap-1 mt-2">
              {user.careerGoals.map((goal, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {goal}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Activities completed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Continue your career development journey</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <div className="flex items-center space-x-4 rounded-lg border p-4 hover:bg-accent transition-colors">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{action.title}</p>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest career development activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${activity.completed ? "bg-green-100" : "bg-yellow-100"}`}>
                    {activity.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.name}</p>
                    <p className="text-sm text-muted-foreground">{activity.date}</p>
                  </div>
                  <Badge variant={activity.completed ? "default" : "secondary"}>
                    {activity.completed ? "Completed" : "In Progress"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* UDD Career Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended UDD Careers</CardTitle>
          <CardDescription>Discover UDD programs that match your profile and interests</CardDescription>
        </CardHeader>
        <CardContent>
          <UDDCareerRecommendations />
        </CardContent>
      </Card>
    </Shell>
  )
}
