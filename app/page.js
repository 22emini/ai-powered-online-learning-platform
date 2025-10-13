"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BookOpen, Search, ArrowRight, Sparkles, Brain, Target, Zap, Users, BarChart3, Shield } from "lucide-react"
import Link from "next/link"

export default function Home() {
   const { userId = null} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userId != null) router.push('/workspace');
  }, [userId, router]);
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">LearnAI</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#courses" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Courses
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Pricing
            </a>
            <a href="#about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              About
            </a>
          </nav>

          <div className="flex items-center gap-3">
    
                    <Link href={'/workspace'}>
                    <Button variant="ghost" className="hidden md:flex">
              Log in
            </Button></Link>
                <Link href={'/workspace'}>
                   <Button>Get Started</Button></Link>
         
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Powered by Advanced AI Technology</span>
              </div>

              <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-balance md:text-6xl lg:text-7xl">
                Learn smarter with{" "}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  AI-powered
                </span>{" "}
                personalized education
              </h1>

              <p className="mb-10 text-lg text-muted-foreground text-pretty md:text-xl">
                Transform your learning journey with intelligent tutoring, adaptive courses, and real-time feedback.
                Master any subject at your own pace with AI that understands how you learn best.
              </p>

              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button size="lg" className="group">
                  Start Learning Free
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button size="lg" variant="outline">
                  Watch Demo
                </Button>
              </div>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>10,000+ active learners</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>500+ courses</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="border-y border-border/40 bg-muted/20 py-12">
          <div className="container mx-auto px-4">
            <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Trusted by students from leading institutions
            </p>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-60 grayscale">
              <div className="text-2xl font-bold">MIT</div>
              <div className="text-2xl font-bold">Stanford</div>
              <div className="text-2xl font-bold">Harvard</div>
              <div className="text-2xl font-bold">Oxford</div>
              <div className="text-2xl font-bold">Cambridge</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24" id="features">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold tracking-tight text-balance md:text-5xl">
                Everything you need to excel
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
                Our platform combines cutting-edge AI technology with proven educational methods to deliver an unmatched
                learning experience.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Brain,
                  title: "AI-Powered Tutoring",
                  description:
                    "Get instant help from an AI tutor that adapts to your learning style and provides personalized explanations.",
                },
                {
                  icon: Target,
                  title: "Adaptive Learning Paths",
                  description:
                    "Courses that adjust difficulty and content based on your progress and comprehension level.",
                },
                {
                  icon: Zap,
                  title: "Real-Time Feedback",
                  description: "Receive immediate feedback on assignments and quizzes to accelerate your learning.",
                },
                {
                  icon: Users,
                  title: "Collaborative Learning",
                  description:
                    "Connect with peers, join study groups, and learn together in an interactive environment.",
                },
                {
                  icon: BarChart3,
                  title: "Progress Analytics",
                  description: "Track your learning journey with detailed insights and performance metrics.",
                },
                {
                  icon: Shield,
                  title: "Expert-Verified Content",
                  description: "All courses are created and reviewed by industry experts and educators.",
                },
              ].map((feature) => (
                <Card
                  key={feature.title}
                  className="group relative overflow-hidden border-border/50 bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  value: "98%",
                  label: "Student satisfaction",
                  subtext: "Based on 10,000+ reviews",
                },
                {
                  value: "3x",
                  label: "Faster learning",
                  subtext: "Compared to traditional methods",
                },
                {
                  value: "500+",
                  label: "Expert courses",
                  subtext: "Across 50+ subjects",
                },
                {
                  value: "24/7",
                  label: "AI tutor support",
                  subtext: "Always available to help",
                },
              ].map((stat) => (
                <Card key={stat.label} className="border-border/50 bg-card p-8 text-center">
                  <div className="mb-2 text-4xl font-bold text-primary md:text-5xl">{stat.value}</div>
                  <div className="mb-1 text-lg font-semibold">{stat.label}</div>
                  <div className="text-sm text-muted-foreground">{stat.subtext}</div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent p-12 md:p-16 lg:p-20">
              <div className="relative z-10 mx-auto max-w-3xl text-center">
                <h2 className="mb-6 text-4xl font-bold text-primary-foreground text-balance md:text-5xl">
                  Ready to transform your learning journey?
                </h2>
                <p className="mb-8 text-lg text-primary-foreground/90 text-pretty">
                  Join thousands of students already learning smarter with AI. Start your free trial today—no credit
                  card required.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="group bg-background text-foreground hover:bg-background/90"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Schedule a Demo
                  </Button>
                </div>
              </div>

              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-foreground/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary-foreground/10 blur-3xl" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <BookOpen className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold">LearnAI</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowering learners worldwide with AI-powered education technology.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Courses
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Enterprise
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="transition-colors hover:text-foreground">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 LearnAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
