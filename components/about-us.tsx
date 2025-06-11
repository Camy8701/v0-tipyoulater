"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Award, ArrowRight, Heart, TrendingUp, Target, Sparkles, Clock } from "lucide-react"
import { type Language, getTranslation } from "@/lib/translations"
import { useStableIntersection } from "@/lib/resize-observer-fix"

interface AboutUsProps {
  currentLanguage: Language
}

export function AboutUs({ currentLanguage }: AboutUsProps) {
  const [activeTab, setActiveTab] = useState("mission")
  const [animationTriggered, setAnimationTriggered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Use our stable intersection observer
  const { hasIntersected } = useStableIntersection(ref, {
    threshold: 0.1,
    rootMargin: "100px",
  })

  const t = (key: keyof typeof import("@/lib/translations").translations.en, params?: Record<string, string>) =>
    getTranslation(currentLanguage, key, params)

  // Trigger animations when element comes into view
  useEffect(() => {
    if (hasIntersected && !animationTriggered) {
      setAnimationTriggered(true)
    }
  }, [hasIntersected, animationTriggered])

  // Simplified animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: "easeOut",
      },
    }),
  }

  const tabs = [
    { id: "mission", label: "Our Mission" },
    { id: "values", label: "Our Values" },
    { id: "impact", label: "Our Impact" },
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section with CSS-based animations */}
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 py-24 px-6 md:px-12 lg:px-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-white opacity-10 blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-cyan-300 opacity-10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-purple-400 opacity-10 blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-white/10 px-6 py-2 backdrop-blur-sm animate-fade-in-up">
            <span className="mr-2 h-2 w-2 rounded-full bg-cyan-300"></span>
            <span className="text-sm font-medium text-white">Revolutionizing Service Appreciation</span>
          </div>

          <h1 className="mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-5xl font-bold leading-tight tracking-tight text-transparent md:text-6xl lg:text-7xl animate-fade-in-up animation-delay-100">
            Bridging the Gap Between <br className="hidden md:block" />
            Intention and Action
          </h1>

          <p className="mx-auto mb-10 max-w-3xl text-lg text-white/90 md:text-xl animate-fade-in-up animation-delay-200">
            We're revolutionizing the tipping experience by enabling customers to recognize exceptional service even
            after they've left, creating a more flexible and meaningful way to show appreciation.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up animation-delay-300">
            <Button
              size="lg"
              className="group bg-white px-8 py-6 text-base font-semibold text-blue-600 hover:bg-blue-50 btn-hover-glow"
            >
              Join Our Mission
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white/50 bg-transparent px-8 py-6 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/10 btn-hover-glow"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Animated Wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-auto w-full translate-y-1"
          >
            <path
              d="M0 120L48 105C96 90 192 60 288 55C384 50 480 70 576 75C672 80 768 70 864 65C960 60 1056 60 1152 65C1248 70 1344 80 1392 85L1440 90V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
              fill="white"
              className="dark:fill-slate-900"
            />
          </svg>
        </div>
      </div>

      {/* Trust Section */}
      <div className="bg-white dark:bg-slate-900 py-16 px-6 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
            {t("trustedByThousands")}
          </h2>
          <p className="mb-12 text-lg text-slate-600 dark:text-slate-300">{t("joinGrowingCommunity")}</p>

          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-cyan-500 md:text-5xl">10K+</div>
              <div className="text-lg text-slate-600 dark:text-slate-300">{t("happyCustomers")}</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-slate-700 dark:text-slate-300 md:text-5xl">500+</div>
              <div className="text-lg text-slate-600 dark:text-slate-300">{t("partnerRestaurants")}</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-blue-500 md:text-5xl">$2M+</div>
              <div className="text-lg text-slate-600 dark:text-slate-300">{t("tipsProcessed")}</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-slate-700 dark:text-slate-300 md:text-5xl">4.9★</div>
              <div className="text-lg text-slate-600 dark:text-slate-300">{t("averageRating")}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement Section */}
      <div className="bg-white dark:bg-slate-900 py-20 px-6 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 flex flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h2 className="mb-6 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
              Capturing Missed Opportunities
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-slate-600 dark:text-slate-300">
              In today's cashless economy, countless moments of exceptional service go unrewarded simply because
              customers lack immediate means to tip or don't realize the impact of great service until later. We capture
              these missed opportunities, benefiting everyone in the service ecosystem.
            </p>
          </div>

          {/* Tabs Navigation */}
          <div className="mb-12 flex justify-center">
            <div className="inline-flex rounded-full bg-slate-100 dark:bg-slate-800 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Triple Win Solution */}
          <div className="mb-16 flex items-center justify-center">
            <div className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 text-sm font-medium text-white">
              <Sparkles className="mr-2 h-4 w-4" />
              TRIPLE WIN SOLUTION
            </div>
          </div>

          <div ref={ref}>
            <h2 className="mb-16 text-center text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
              {t("creatingValueForEveryone")}
            </h2>

            {/* Value Cards - Using CSS animations instead of Framer Motion */}
            <div className="grid gap-8 md:grid-cols-3">
              {/* Customers Card */}
              <div className={`group ${animationTriggered ? "animate-fade-in-up" : "opacity-0"}`}>
                <Card className="overflow-hidden border-0 bg-white dark:bg-slate-800 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                  <CardContent className="p-8">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg transition-transform duration-300 group-hover:scale-105">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">{t("forCustomers")}</h3>
                    <p className="text-slate-600 dark:text-slate-300">{t("forCustomersDesc")}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Service Workers Card */}
              <div className={`group ${animationTriggered ? "animate-fade-in-up animation-delay-100" : "opacity-0"}`}>
                <Card className="overflow-hidden border-0 bg-white dark:bg-slate-800 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                  <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-500"></div>
                  <CardContent className="p-8">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-500 shadow-lg transition-transform duration-300 group-hover:scale-105">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">{t("forServiceWorkers")}</h3>
                    <p className="text-slate-600 dark:text-slate-300">{t("forServiceWorkersDesc")}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Businesses Card */}
              <div className={`group ${animationTriggered ? "animate-fade-in-up animation-delay-200" : "opacity-0"}`}>
                <Card className="overflow-hidden border-0 bg-white dark:bg-slate-800 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                  <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                  <CardContent className="p-8">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg transition-transform duration-300 group-hover:scale-105">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">{t("forBusinesses")}</h3>
                    <p className="text-slate-600 dark:text-slate-300">{t("forBusinessesDesc")}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-slate-50 dark:bg-slate-800 py-20 px-6 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400">
              <Clock className="mr-2 h-4 w-4" />
              HOW IT WORKS
            </div>
            <h2 className="mb-6 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
              Simple, Fast, Effective
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-slate-600 dark:text-slate-300">
              Our platform makes it easy to recognize and reward exceptional service, even after you've left the
              establishment.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                step: "01",
                title: "Find",
                description: "Locate the business where you received exceptional service",
                gradient: "from-cyan-500 to-blue-500",
              },
              {
                step: "02",
                title: "Select",
                description: "Choose the staff member who provided the outstanding service",
                gradient: "from-blue-500 to-indigo-500",
              },
              {
                step: "03",
                title: "Appreciate",
                description: "Send a tip and optional message of appreciation",
                gradient: "from-indigo-500 to-purple-500",
              },
              {
                step: "04",
                title: "Connect",
                description: "Build lasting relationships with your favorite service providers",
                gradient: "from-purple-500 to-pink-500",
              },
            ].map((item, index) => (
              <div key={index} className="group animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <Card className="h-full border-0 bg-white dark:bg-slate-800 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <CardContent className="flex h-full flex-col p-8">
                    <div
                      className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r ${item.gradient} text-lg font-bold text-white`}
                    >
                      {item.step}
                    </div>
                    <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300">{item.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Future Vision Section */}
      <div className="relative bg-slate-900 dark:bg-slate-950 py-24 px-6 md:px-12 lg:px-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-blue-900/30 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-purple-900/30 blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="mb-8 text-4xl font-bold text-white md:text-5xl animate-fade-in-up">
            Building a Better Service Economy
          </h2>

          <p className="mb-12 text-lg text-white/80 animate-fade-in-up animation-delay-100">
            By transforming tipping from a transactional moment into a thoughtful gesture, we're creating lasting value
            for entire service communities. Join us in building a more rewarding service economy where outstanding
            experiences are celebrated, exceptional workers are recognized, and businesses thrive.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up animation-delay-200">
            <Button
              size="lg"
              className="group bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-6 text-base font-semibold text-white hover:from-cyan-600 hover:to-blue-700 btn-hover-glow"
            >
              Join Our Mission
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white/30 bg-transparent px-8 py-6 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/10 btn-hover-glow"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white dark:bg-slate-900 py-20 px-6 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400">
              <Award className="mr-2 h-4 w-4" />
              TESTIMONIALS
            </div>
            <h2 className="mb-6 text-4xl font-bold text-slate-900 dark:text-white md:text-5xl">
              What People Are Saying
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-slate-600 dark:text-slate-300">
              Hear from customers, service workers, and businesses who have experienced the TipYouLater difference.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                quote:
                  "I was able to tip a server who went above and beyond, even though I had no cash at the time. It felt great to show my appreciation!",
                name: "Sarah Johnson",
                role: "Customer",
                gradient: "from-cyan-500 to-blue-500",
              },
              {
                quote:
                  "I've received tips days after serving customers, which I would have never gotten otherwise. It's like finding money you didn't know you earned!",
                name: "Michael Rodriguez",
                role: "Server",
                gradient: "from-blue-600 to-purple-500",
              },
              {
                quote:
                  "Our staff is more motivated knowing their exceptional service can be recognized and rewarded even after customers leave.",
                name: "Emily Chen",
                role: "Restaurant Owner",
                gradient: "from-purple-500 to-pink-500",
              },
            ].map((item, index) => (
              <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <Card className="h-full border-0 bg-white dark:bg-slate-800 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className={`h-2 bg-gradient-to-r ${item.gradient}`}></div>
                  <CardContent className="flex h-full flex-col p-8">
                    <div className="mb-6 text-4xl text-blue-500">"</div>
                    <p className="mb-8 flex-grow text-slate-600 dark:text-slate-300">{item.quote}</p>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 py-20 px-6 md:px-12 lg:px-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl animate-fade-in-up">
            Ready to Transform the Tipping Experience?
          </h2>

          <p className="mb-10 text-lg text-white/90 animate-fade-in-up animation-delay-100">
            Join us in revolutionizing how appreciation is expressed in the service industry.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up animation-delay-200">
            <Button
              size="lg"
              className="group bg-white px-8 py-6 text-base font-semibold text-blue-600 hover:bg-blue-50 btn-hover-glow"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-white/50 bg-transparent px-8 py-6 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/10 btn-hover-glow"
            >
              Schedule a Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
