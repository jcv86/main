"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Brain,
  Target,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  CheckCircle,
  Star,
  ArrowRight,
  Menu,
  X,
  BarChart3,
  MessageSquare,
  Zap,
} from "lucide-react"
import { useRouter } from "next/navigation"

export function LandingPage() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [email, setEmail] = useState("")

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get personalized career recommendations based on advanced AI analysis of your assessment results.",
    },
    {
      icon: Target,
      title: "Career Assessments",
      description:
        "Take scientifically-backed assessments including DISC, Big Five, MBTI, and career interest evaluations.",
    },
    {
      icon: BookOpen,
      title: "Learning Library",
      description: "Access curated books, courses, and resources tailored to your professional development needs.",
    },
    {
      icon: MessageSquare,
      title: "Interactive AI Coach",
      description: "Chat with your personal AI career coach for guidance, advice, and actionable development plans.",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Monitor your growth with detailed analytics and progress reports across all assessments.",
    },
    {
      icon: Users,
      title: "Professional Network",
      description: "Connect with like-minded professionals and build meaningful career relationships.",
    },
  ]

  const assessmentTypes = [
    {
      name: "DISC Assessment",
      description: "Behavioral style analysis",
      icon: Users,
      duration: "10 min",
    },
    {
      name: "Big Five Personality",
      description: "Comprehensive personality evaluation",
      icon: Star,
      duration: "15 min",
    },
    {
      name: "MBTI Type Indicator",
      description: "Psychological preferences mapping",
      icon: Brain,
      duration: "12 min",
    },
    {
      name: "Career Interest (RIASEC)",
      description: "Vocational interest assessment",
      icon: Target,
      duration: "8 min",
    },
    {
      name: "Emotional Intelligence",
      description: "EQ skills evaluation",
      icon: Award,
      duration: "10 min",
    },
    {
      name: "Soft Skills Assessment",
      description: "Professional skills analysis",
      icon: TrendingUp,
      duration: "12 min",
    },
  ]

  const benefits = [
    "Personalized AI career coaching",
    "Scientifically-backed assessments",
    "Comprehensive learning library",
    "Progress tracking and analytics",
    "Professional development plans",
    "24/7 AI support and guidance",
  ]

  const stats = [
    { number: "10,000+", label: "Professionals Served" },
    { number: "95%", label: "User Satisfaction" },
    { number: "6", label: "Assessment Types" },
    { number: "24/7", label: "AI Support" },
  ]

  const handleGetStarted = () => {
    router.push("/dashboard")
  }

  const handleTryAICoach = () => {
    router.push("/ai-coach")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-background" />
              </div>
              <span className="text-xl font-bold text-foreground">CareerDev Pro</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-foreground hover:text-foreground/80 transition-colors">
                Features
              </a>
              <a href="#assessments" className="text-foreground hover:text-foreground/80 transition-colors">
                Assessments
              </a>
              <a href="#about" className="text-foreground hover:text-foreground/80 transition-colors">
                About
              </a>
              <Button
                variant="outline"
                onClick={handleTryAICoach}
                className="border-border hover:bg-muted bg-transparent"
              >
                Try AI Coach
              </Button>
              <Button onClick={handleGetStarted} className="bg-foreground text-background hover:bg-foreground/90">
                Get Started
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden border-border bg-transparent"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-foreground hover:text-foreground/80 transition-colors">
                  Features
                </a>
                <a href="#assessments" className="text-foreground hover:text-foreground/80 transition-colors">
                  Assessments
                </a>
                <a href="#about" className="text-foreground hover:text-foreground/80 transition-colors">
                  About
                </a>
                <Button
                  variant="outline"
                  onClick={handleTryAICoach}
                  className="border-border hover:bg-muted w-full bg-transparent"
                >
                  Try AI Coach
                </Button>
                <Button
                  onClick={handleGetStarted}
                  className="bg-foreground text-background hover:bg-foreground/90 w-full"
                >
                  Get Started
                </Button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-muted text-mutedForeground">
              <Zap className="h-3 w-3 mr-1" />
              AI-Powered Career Development
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Unlock Your Career Potential with <span className="text-foreground">AI Guidance</span>
            </h1>
            <p className="text-xl text-mutedForeground mb-8 leading-relaxed">
              Take scientifically-backed assessments, get personalized AI coaching, and access curated learning
              resources to accelerate your professional growth and achieve your career goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-foreground text-background hover:bg-foreground/90 text-lg px-8 py-6"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleTryAICoach}
                className="border-border hover:bg-muted text-lg px-8 py-6 bg-transparent"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Try AI Coach Free
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.number}</div>
                <div className="text-mutedForeground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need for Career Success
            </h2>
            <p className="text-xl text-mutedForeground max-w-2xl mx-auto">
              Our comprehensive platform combines AI technology with proven career development methodologies to provide
              you with personalized guidance and actionable insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-border bg-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <CardTitle className="text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-mutedForeground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Types Section */}
      <section id="assessments" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Comprehensive Career Assessments</h2>
            <p className="text-xl text-mutedForeground max-w-2xl mx-auto">
              Take scientifically-validated assessments to gain deep insights into your personality, skills, and career
              preferences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessmentTypes.map((assessment, index) => (
              <Card key={index} className="border-border bg-card hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <assessment.icon className="h-8 w-8 text-foreground" />
                    <Badge variant="secondary" className="bg-muted text-mutedForeground">
                      {assessment.duration}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-foreground">{assessment.name}</CardTitle>
                  <CardDescription className="text-mutedForeground">{assessment.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Why Choose CareerDev Pro?</h2>
              <p className="text-lg text-mutedForeground mb-8">
                Our platform combines cutting-edge AI technology with proven career development methodologies to provide
                you with the most comprehensive and personalized career guidance available.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-foreground flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Ready to Get Started?</CardTitle>
                <CardDescription className="text-mutedForeground">
                  Join thousands of professionals who have accelerated their careers with our platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-border"
                  />
                  <Button onClick={handleGetStarted} className="bg-foreground text-background hover:bg-foreground/90">
                    Start Free
                  </Button>
                </div>
                <p className="text-xs text-mutedForeground">
                  No credit card required. Start your free assessment today.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-foreground text-background">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Career?</h2>
          <p className="text-xl text-background/80 mb-8 max-w-2xl mx-auto">
            Take the first step towards unlocking your full potential. Start with a free assessment and get personalized
            AI-powered career guidance today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={handleGetStarted}
              className="bg-background text-foreground hover:bg-background/90 text-lg px-8 py-6"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleTryAICoach}
              className="border-background/20 text-background hover:bg-background/10 text-lg px-8 py-6 bg-transparent"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Try AI Coach
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border bg-muted/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-foreground rounded flex items-center justify-center">
                  <Brain className="h-4 w-4 text-background" />
                </div>
                <span className="font-bold text-foreground">CareerDev Pro</span>
              </div>
              <p className="text-mutedForeground text-sm">
                AI-powered career development platform helping professionals unlock their potential.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-mutedForeground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Assessments
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    AI Coach
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Learning Library
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Progress Tracking
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-mutedForeground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Career Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Success Stories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-mutedForeground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-mutedForeground text-sm">© 2024 CareerDev Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
