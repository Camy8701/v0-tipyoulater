"use client"

import { useState, useEffect, Suspense, lazy } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Star,
  Calculator,
  Building2,
  Moon,
  Sun,
  Utensils,
  Sparkles,
  Zap,
  Shield,
  Home,
  Info,
  Loader2,
} from "lucide-react"
import { TipModal } from "@/components/tip-modal"
import { LanguageSelector } from "@/components/language-selector"
import { CurrencySelector } from "@/components/currency-selector"
import { Footer } from "@/components/footer"
import { RealtimeNotifications } from "@/components/realtime-notifications"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type Language, getTranslation } from "@/lib/translations"
import type { Currency } from "@/lib/currency"
import { analytics } from "@/lib/analytics"
import { realtimeService, notificationService } from "@/lib/realtime"
import Image from "next/image"

// Lazy load components for better performance
const RestaurantSearch = lazy(() =>
  import("@/components/restaurant-search").then((module) => ({ default: module.RestaurantSearch })),
)
const BusinessDashboard = lazy(() =>
  import("@/components/business-dashboard").then((module) => ({ default: module.BusinessDashboard })),
)
const TipCalculator = lazy(() =>
  import("@/components/tip-calculator").then((module) => ({ default: module.TipCalculator })),
)
const BusinessApplication = lazy(() =>
  import("@/components/business-application").then((module) => ({ default: module.BusinessApplication })),
)
const CurrencyConverter = lazy(() => import("@/components/currency-converter"))
const AboutUs = lazy(() => import("@/components/about-us").then((module) => ({ default: module.AboutUs })))
const AnalyticsDashboard = lazy(() =>
  import("@/components/analytics-dashboard").then((module) => ({ default: module.AnalyticsDashboard })),
)
const PaymentManagement = lazy(() =>
  import("@/components/payment-management").then((module) => ({ default: module.PaymentManagement })),
)

// Import AdminPanel directly (not lazy) to avoid issues
import AdminPanel from "@/components/admin-panel"

type Screen =
  | "welcome"
  | "search"
  | "business"
  | "calculator"
  | "admin"
  | "converter"
  | "about"
  | "analytics"
  | "payments"
  | "profile"

// Loading component for lazy-loaded screens
const ScreenLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin text-teal-500 mx-auto mb-4" />
      <p className="text-slate-600 dark:text-slate-400">Loading...</p>
    </div>
  </div>
)

export default function TipYouLaterApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRestaurant, setSelectedRestaurant] = useState<any>(null)
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en")
  const [currentCurrency, setCurrentCurrency] = useState<Currency>("USD")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [userId] = useState(() => `user_${Math.random().toString(36).substr(2, 9)}`)
  const [mounted, setMounted] = useState(false)

  const t = (key: keyof typeof import("@/lib/translations").translations.en, params?: Record<string, string>) =>
    getTranslation(currentLanguage, key, params)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  useEffect(() => {
    if (!mounted) return

    // Initialize PWA features
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("Service Worker registered"))
        .catch((error) => console.log("Service Worker registration failed:", error))
    }

    // Initialize analytics
    analytics.loadUserBehavior()
    analytics.trackPageView("welcome", userId)

    // Initialize realtime services
    realtimeService.connect()
    notificationService.requestPermission()

    return () => {
      realtimeService.disconnect()
    }
  }, [userId, mounted])

  const features = [
    {
      icon: <Utensils className="w-8 h-8" />,
      title: t("findAnyRestaurant"),
      description: t("findAnyRestaurantDesc"),
      gradient: "from-slate-600 to-slate-700",
      action: () => handleScreenChange("search"),
      bgImage: "/restaurant-search-bg.png",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: t("tipAndReview"),
      description: t("tipAndReviewDesc"),
      gradient: "from-cyan-500 to-blue-600",
      action: () => handleScreenChange("search"),
      bgImage: "/tip-review-bg.png",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t("instantAndSecure"),
      description: t("instantAndSecureDesc"),
      gradient: "from-slate-700 to-slate-800",
      action: () => {},
      bgImage: "/security-bg.png",
    },
    {
      icon: <Calculator className="w-8 h-8" />,
      title: t("smartCalculator"),
      description: t("smartCalculatorDesc"),
      gradient: "from-cyan-500 to-blue-600",
      action: () => handleScreenChange("calculator"),
      bgImage: "/calculator-bg.png",
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: t("businessDashboard"),
      description: t("businessDashboardDesc"),
      gradient: "from-slate-600 to-blue-500",
      action: () => handleScreenChange("business"),
      bgImage: "/business-dashboard-bg.png",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: t("lowFees"),
      description: t("lowFeesDesc"),
      gradient: "from-blue-500 to-slate-600",
      action: () => {},
      bgImage: "/low-fees-bg.png",
    },
  ]

  const stats = [
    { value: "10K+", label: "Happy Customers", color: "text-cyan-500" },
    { value: "500+", label: "Partner Restaurants", color: "text-slate-700 dark:text-slate-300" },
    { value: "$2M+", label: "Tips Processed", color: "text-blue-500" },
    { value: "4.9★", label: "Average Rating", color: "text-slate-700 dark:text-slate-300" },
  ]

  const handleGlobalSearch = (query: string) => {
    setSearchQuery(query)
    analytics.trackSearch(query, 0, userId)
    handleScreenChange("search")
  }

  const handleScreenChange = (screen: Screen) => {
    setIsTransitioning(true)
    analytics.trackPageView(screen, userId)
    analytics.trackClick("navigation", screen, userId)

    setTimeout(() => {
      setCurrentScreen(screen)
      setIsTransitioning(false)
    }, 150)
  }

  const renderScreen = () => {
    if (isTransitioning) {
      return <ScreenLoader />
    }

    switch (currentScreen) {
      case "welcome":
        return (
          <div className="space-y-20">
            {/* Enhanced Hero Section with Background Image */}
            <div className="relative text-center py-24 px-6 rounded-3xl overflow-hidden">
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/restaurant-ambiance-bg.png"
                  alt="Restaurant ambiance"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
              </div>

              {/* Business Background Image */}
              <div className="absolute inset-0 z-10">
                <Image
                  src="/modern-restaurant-interior.png"
                  alt="Restaurant interior"
                  fill
                  className="object-cover opacity-30 mix-blend-overlay"
                />
              </div>

              {/* Content */}
              <div className="relative z-20">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6 animate-bounce">
                  <Sparkles className="w-4 h-4" />
                  {t("tipAnytimeAnywhere")}
                </div>
                <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight animate-in slide-in-from-bottom duration-1000">
                  <span className="bg-gradient-to-r from-white via-slate-200 to-cyan-200 bg-clip-text text-transparent">
                    {t("heroTitle")}
                  </span>
                </h1>
                <p className="text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed animate-in slide-in-from-bottom duration-1000 delay-200">
                  {t("heroSubtitle")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom duration-1000 delay-400">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg"
                    onClick={() => handleScreenChange("search")}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    {t("startTipping")}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg backdrop-blur-sm"
                    onClick={() => handleScreenChange("business")}
                  >
                    <Building2 className="w-5 h-5 mr-2" />
                    Add to Your Business
                  </Button>
                </div>
              </div>
            </div>

            {/* Video Section */}
            <div className="flex justify-center items-center py-12">
              <div className="w-full max-w-6xl mx-auto">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto rounded-2xl shadow-2xl"
                  style={{ maxHeight: "600px", objectFit: "cover" }}
                >
                  <source
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/utop-ai-3vJSt2wnFz2uTAXDjXadXDq7TUjDbM.mp4"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

            {/* Enhanced Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white dark:bg-slate-800 animate-in slide-in-from-bottom duration-500 cursor-pointer rounded-xl"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={feature.action}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={feature.bgImage || "/placeholder.svg"}
                      alt={feature.title}
                      fill
                      className="object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-500"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500 from-slate-500 to-blue-500 z-10"></div>
                  <div className="p-8 relative z-20">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-cyan-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Stats Section */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-12 animate-in slide-in-from-bottom duration-1000">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Trusted by Thousands</h2>
                <p className="text-xl text-slate-600 dark:text-slate-300">
                  Join the growing community of happy customers and businesses
                </p>
              </div>
              <div className="grid md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center animate-in slide-in-from-bottom duration-500"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                    <div className="text-slate-600 dark:text-slate-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      case "about":
        return (
          <Suspense fallback={<ScreenLoader />}>
            <AboutUs currentLanguage={currentLanguage} />
          </Suspense>
        )
      case "search":
        return (
          <Suspense fallback={<ScreenLoader />}>
            <RestaurantSearch
              searchQuery={searchQuery}
              onSelectRestaurant={setSelectedRestaurant}
              currentLanguage={currentLanguage}
              currentCurrency={currentCurrency}
            />
          </Suspense>
        )
      case "business":
        return (
          <Suspense fallback={<ScreenLoader />}>
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800">
                <TabsTrigger
                  value="dashboard"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 transition-all duration-200"
                >
                  {t("dashboard")}
                </TabsTrigger>
                <TabsTrigger
                  value="apply"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 transition-all duration-200"
                >
                  {t("apply")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="dashboard">
                <BusinessDashboard currentLanguage={currentLanguage} currentCurrency={currentCurrency} />
              </TabsContent>
              <TabsContent value="apply">
                <BusinessApplication currentLanguage={currentLanguage} />
              </TabsContent>
            </Tabs>
          </Suspense>
        )
      case "calculator":
        return (
          <Suspense fallback={<ScreenLoader />}>
            <TipCalculator currentLanguage={currentLanguage} currentCurrency={currentCurrency} />
          </Suspense>
        )
      case "admin":
        return <AdminPanel currentLanguage={currentLanguage} currentCurrency={currentCurrency} />
      case "converter":
        return (
          <Suspense fallback={<ScreenLoader />}>
            <CurrencyConverter
              currentLanguage={currentLanguage}
              currentCurrency={currentCurrency}
              onCurrencyChange={setCurrentCurrency}
            />
          </Suspense>
        )
      case "analytics":
        return (
          <Suspense fallback={<ScreenLoader />}>
            <AnalyticsDashboard currentLanguage={currentLanguage} />
          </Suspense>
        )
      case "payments":
        return (
          <Suspense fallback={<ScreenLoader />}>
            <PaymentManagement currentLanguage={currentLanguage} currentCurrency={currentCurrency} />
          </Suspense>
        )
      default:
        return null
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading TipYouLater...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col">
      {/* Fixed Header - No Animation */}
      <header className="sticky top-0 z-50 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-700 shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            {/* Left Side: Home Button + Logo */}
            <div className="flex items-center gap-2 md:gap-4">
              <Button
                variant={currentScreen === "welcome" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => handleScreenChange("welcome")}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white p-2 transition-all duration-200 hover:scale-105"
              >
                <Home className="w-4 h-4 md:w-5 md:h-5" />
                <span className="sr-only">{t("home")}</span>
              </Button>

              <div
                className="flex items-center gap-2 md:gap-3 cursor-pointer hover:scale-105 transition-transform group"
                onClick={() => handleScreenChange("welcome")}
              >
                <div className="relative w-24 h-24 md:w-36 md:h-36 flex items-center justify-center">
                  <Image
                    src="/images/tyl-logo.png"
                    alt="TYL Logo"
                    width={96}
                    height={96}
                    className="md:w-36 md:h-36 object-contain group-hover:scale-110 transition-transform duration-300"
                    priority
                  />
                </div>
                <span className="text-lg md:text-2xl font-bold text-white leading-none hidden sm:block">
                  {t("appName")}
                </span>
              </div>
            </div>

            {/* Enhanced Global Search */}
            <div className="flex-1 max-w-2xl mx-2 md:mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder={
                    typeof window !== "undefined" && window.innerWidth < 768 ? "Search..." : t("searchPlaceholder")
                  }
                  className="pl-10 h-10 md:h-12 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 focus:bg-slate-700/50 focus:border-cyan-500 backdrop-blur-sm text-sm md:text-base transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleGlobalSearch(searchQuery)}
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Realtime Notifications */}
              <RealtimeNotifications />

              {/* Currency Selector - Hidden on small screens */}
              <div className="hidden sm:block">
                <CurrencySelector currentCurrency={currentCurrency} onCurrencyChange={setCurrentCurrency} />
              </div>

              {/* Language Selector - Hidden on small screens */}
              <div className="hidden sm:block">
                <LanguageSelector currentLanguage={currentLanguage} onLanguageChange={setCurrentLanguage} />
              </div>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="text-white hover:bg-slate-700 p-2 transition-all duration-200 hover:scale-105"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              {/* Admin Access Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleScreenChange("admin")}
                className="text-white hover:bg-red-600/20 p-2 transition-all duration-200 hover:scale-105 border border-red-500/30"
              >
                <Shield className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Secondary Navigation */}
      <div className="bg-slate-800/80 dark:bg-slate-900/80 border-b border-slate-700 shadow-lg backdrop-blur-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-2 overflow-x-auto">
            {[
              { key: "about", label: "About Us", icon: Info },
              { key: "search", label: t("findPlaces"), icon: Search },
              { key: "calculator", label: t("tipCalculator"), icon: Calculator },
              { key: "converter", label: t("currencyConverter"), icon: Zap },
            ].map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={currentScreen === key ? "secondary" : "ghost"}
                size="sm"
                onClick={() => handleScreenChange(key as Screen)}
                className={`
                  transition-all duration-300 hover:scale-105 whitespace-nowrap
                  ${
                    currentScreen === key
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                      : "text-white hover:bg-white/10 backdrop-blur-sm"
                  }
                `}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="animate-in fade-in duration-300">{renderScreen()}</div>
      </main>

      {/* Footer */}
      <Footer currentLanguage={currentLanguage} />

      {/* Enhanced Tip Modal */}
      {selectedRestaurant && (
        <TipModal
          restaurant={selectedRestaurant}
          onClose={() => setSelectedRestaurant(null)}
          currentLanguage={currentLanguage}
          currentCurrency={currentCurrency}
        />
      )}

      {/* Quick Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="lg"
          onClick={() => handleScreenChange("search")}
          className="rounded-full w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-110"
        >
          <Sparkles className="w-6 h-6" />
          <span className="sr-only">Quick Tip</span>
        </Button>
      </div>

      {/* Admin Quick Access Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          size="lg"
          onClick={() => handleScreenChange("admin")}
          className="rounded-full w-16 h-16 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-red-500/20 transition-all duration-300 hover:scale-110"
          title="Admin Access"
        >
          <Shield className="w-6 h-6" />
          <span className="sr-only">Admin Access</span>
        </Button>
      </div>
    </div>
  )
}
