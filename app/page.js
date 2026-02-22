"use client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@clerk/nextjs";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { BookOpen, Search, ArrowRight, Sparkles, Brain, Target, Zap, Users, BarChart3, Shield, Star, Bot } from "lucide-react"
import Link from "next/link"
import { m, LazyMotion, domAnimation } from "framer-motion"
import Image from "next/image";

export default function Home() {
  const { userId = null} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (userId != null) router.push('/workspace');
  }, [userId, router]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4 }
  };

  return (
    <LazyMotion features={domAnimation}>
    <div className="min-h-screen bg-gradient-to-b from-[#051B34] via-[#072642] to-[#0A1F3F]">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <m.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <m.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Header */}
      <m.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#051B34]/80 backdrop-blur-xl"
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <m.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            
            <Image src={'/new.png'} alt='logo' width={60} height={60} className="rounded-full object-cover" />
            
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Quorify</span>
          </m.div>

          <nav className="hidden items-center gap-8 md:flex">
            {["Features", "Courses", "Pricing", "About"].map((item, i) => (
              <m.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-gray-300 transition-colors hover:text-white relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.3 }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all group-hover:w-full" />
              </m.a>
            ))}
          </nav>

          <m.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href={'/workspace'}>
              <Button variant="ghost" className=" md:flex text-gray-300 hover:text-white hover:bg-white/10">
                Log in
              </Button>
            </Link>
           
          </m.div>
        </div>
      </m.header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-32 pb-20" style={{ backgroundImage: "url('/background.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-[#051B34]/75" />
          <div className="container mx-auto px-4 relative z-10">
            <m.div
              className="mx-auto max-w-4xl text-center"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <m.div
                variants={fadeInUp}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-1.5 text-sm text-blue-300 backdrop-blur-sm"
              >
                <Bot className="h-4 w-4" />
                <span>Powered by Google Gemini</span>
              </m.div>

              <m.h1
                variants={fadeInUp}
                className="mb-6 text-5xl font-bold leading-tight tracking-tight text-balance md:text-6xl lg:text-7xl text-white"
              >
                Learn smarter with{" "}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  AI-powered
                </span>{" "}
                personalized education
              </m.h1>

              <m.p
                variants={fadeInUp}
                className="mb-10 text-lg text-gray-300 text-pretty md:text-xl"
              >
                Transform your learning journey with intelligent tutoring, adaptive courses, and real-time feedback.
                Master any subject at your own pace with AI that understands how you learn best.
              </m.p>

          

              <m.div
                variants={fadeInUp}
                className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400"
              >
                {[
                  "No credit card required",
                  "10,000+ active learners",
                  "500+ courses"
                ].map((text, i) => (
                  <m.div
                    key={text}
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                    <span>{text}</span>
                  </m.div>
                ))}
              </m.div>
            </m.div>
          </div>
        </section>

        {/* Trusted By Section */}
        <m.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-y border-white/10 bg-[#0A1F3F]/50 py-12"
        >
          <div className="container mx-auto px-4">
            <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-gray-400">
              Trusted by students from leading institutions
            </p>
            <m.div
              className="flex flex-wrap items-center justify-center gap-12"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {["MIT", "Stanford", "Harvard", "Oxford", "Cambridge"].map((uni, i) => (
                <m.div
                  key={uni}
                  variants={scaleIn}
                  className="text-2xl font-bold text-gray-400 hover:text-white transition-colors cursor-default"
                >
                  {uni}
                </m.div>
              ))}
            </m.div>
          </div>
        </m.section>

        {/* Features Section */}
        <section className="py-24" id="features">
          <div className="container mx-auto px-4">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16 text-center"
            >
              <h2 className="mb-4 text-4xl font-bold tracking-tight text-balance md:text-5xl text-white">
                Everything you need to excel
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-300 text-pretty">
                Our platform combines cutting-edge AI technology with proven educational methods to deliver an unmatched
                learning experience.
              </p>
            </m.div>

            <m.div
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[
                {
                  icon: Brain,
                  title: "AI-Powered Tutoring",
                  description: "Get instant help from an AI tutor that adapts to your learning style and provides personalized explanations.",
                },
                {
                  icon: Target,
                  title: "Adaptive Learning Paths",
                  description: "Courses that adjust difficulty and content based on your progress and comprehension level.",
                },
                {
                  icon: Zap,
                  title: "Real-Time Feedback",
                  description: "Receive immediate feedback on assignments and quizzes to accelerate your learning.",
                },
                {
                  icon: Users,
                  title: "Collaborative Learning",
                  description: "Connect with peers, join study groups, and learn together in an interactive environment.",
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
              ].map((feature, i) => (
                <m.div key={feature.title} variants={scaleIn}>
                  <Card className="group relative overflow-hidden border-white/10 bg-[#0A1F3F]/50 backdrop-blur-sm p-6 transition-all hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/20 h-full">
                    <m.div
                      className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400/20 to-cyan-400/20 text-blue-400 transition-all"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <feature.icon className="h-6 w-6" />
                    </m.div>
                    <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                  </Card>
                </m.div>
              ))}
            </m.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-[#0A1F3F]/50 py-20">
          <div className="container mx-auto px-4">
            <m.div
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
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
                <m.div key={stat.label} variants={scaleIn}>
                  <Card className="border-white/10 bg-[#051B34]/50 backdrop-blur-sm p-8 text-center hover:shadow-lg hover:shadow-blue-500/10 transition-all">
                    <m.div
                      className="mb-2 text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent md:text-5xl"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, type: "spring" }}
                    >
                      {stat.value}
                    </m.div>
                    <div className="mb-1 text-lg font-semibold text-white">{stat.label}</div>
                    <div className="text-sm text-gray-400">{stat.subtext}</div>
                  </Card>
                </m.div>
              ))}
            </m.div>
          </div>
        </section>

        
      </main>


    <m.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 border-t pb-4 border-white/10 pt-8 text-center text-sm text-gray-400"
          >
            <p>© 2026 Quorify. All rights reserved.</p>
          </m.div>

      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
    </LazyMotion>
  )
}