"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  User,
  Settings,
  CreditCard,
  BarChart3,
  Shield,
  History,
  Star,
  MapPin,
  TrendingUp,
  DollarSign,
} from "lucide-react"
import { type Language, getTranslation } from "@/lib/translations"
import { Suspense, lazy } from "react"
import { GoogleLogin } from "@/components/google-login"
import type { GoogleUser } from "@/lib/google-auth"

// Lazy load analytics and payments components
const AnalyticsDashboard = lazy(() =>
  import("@/components/analytics-dashboard").then((module) => ({ default: module.AnalyticsDashboard })),
)
const PaymentManagement = lazy(() =>
  import("@/components/payment-management").then((module) => ({ default: module.PaymentManagement })),
)

// Define the Currency type
type Currency = "USD" | "EUR" | "GBP"

interface UserProfileProps {
  currentLanguage: Language
  currentCurrency: Currency
}

// Loading component
const ScreenLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="text-center">
      <div className="w-8 h-8 animate-spin text-teal-500 mx-auto mb-4 border-2 border-teal-500 border-t-transparent rounded-full" />
      <p className="text-slate-600 dark:text-slate-400">Loading...</p>
    </div>
  </div>
)

export function UserProfile({ currentLanguage, currentCurrency }: UserProfileProps) {
  const t = (key: keyof typeof import("@/lib/translations").translations.en, params?: Record<string, string>) =>
    getTranslation(currentLanguage, key, params)

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [showGoogleLogin, setShowGoogleLogin] = useState(false)
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null)

  const handleLogin = () => {
    if (username === "user" && password === "user123") {
      setIsLoggedIn(true)
      setShowLoginModal(false)
      setUsername("")
      setPassword("")
    } else {
      alert("Invalid credentials. Use user/user123 for demo.")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const handleGoogleLogin = (user: GoogleUser) => {
    setGoogleUser(user)
    setIsLoggedIn(true)
    setShowGoogleLogin(false)
    // Store in localStorage for persistence
    localStorage.setItem("google_user", JSON.stringify(user))
  }

  // Sample user data
  const userData = googleUser
    ? {
        name: googleUser.name,
        email: googleUser.email,
        phone: "+1 (555) 123-4567",
        joinDate: "2024-01-15",
        totalTips: 1247,
        totalSpent: 3456,
        favoriteRestaurants: 12,
        reviewsWritten: 23,
        level: "Gold Member",
      }
    : {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        joinDate: "2024-01-15",
        totalTips: 1247,
        totalSpent: 3456,
        favoriteRestaurants: 12,
        reviewsWritten: 23,
        level: "Gold Member",
      }

  const recentTips = [
    { id: 1, restaurant: "Mario's Italian Bistro", amount: 25, date: "2024-11-15", rating: 5 },
    { id: 2, restaurant: "The Coffee Corner", amount: 10, date: "2024-11-14", rating: 4 },
    { id: 3, restaurant: "Sakura Sushi", amount: 40, date: "2024-11-13", rating: 5 },
    { id: 4, restaurant: "Brewery & Grill", amount: 15, date: "2024-11-12", rating: 4 },
  ]

  if (!isLoggedIn) {
    return (
      <>
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4">{t("userProfileRequired")}</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">Please log in to access your profile</p>
          <div className="space-y-4">
            <Button
              size="lg"
              onClick={() => setShowGoogleLogin(true)}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button size="lg" onClick={() => setShowLoginModal(true)} variant="outline" className="w-full">
              {t("login")} with Demo Account
            </Button>
          </div>
        </div>

        <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t("userLogin")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("username")}</label>
                <Input placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("password")}</label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <Button onClick={handleLogin} className="w-full">
                {t("login")}
              </Button>
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">Demo: user/user123</p>
            </div>
          </DialogContent>
        </Dialog>
        <GoogleLogin isOpen={showGoogleLogin} onClose={() => setShowGoogleLogin(false)} onLogin={handleGoogleLogin} />
      </>
    )
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex justify-between items-center py-8 px-6 bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {userData.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{userData.name}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">{userData.level}</p>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Member since {new Date(userData.joinDate).getFullYear()}
            </Badge>
          </div>
        </div>
        <Button onClick={handleLogout} variant="outline">
          {t("logout")}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <CardContent className="p-0 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">${userData.totalTips}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Tips Given</div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0 text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">${userData.totalSpent}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Spent</div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0 text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {userData.favoriteRestaurants}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Favorite Places</div>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0 text-center">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                  {userData.reviewsWritten}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Reviews Written</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTips.map((tip) => (
                  <div
                    key={tip.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                  >
                    <div>
                      <div className="font-semibold">{tip.restaurant}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{tip.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600">${tip.amount}</div>
                      <div className="flex items-center gap-1">
                        {[...Array(tip.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Transaction History</h3>
                <p className="text-gray-600 dark:text-gray-400">View all your past transactions and tips</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Suspense fallback={<ScreenLoader />}>
            <AnalyticsDashboard currentLanguage={currentLanguage} />
          </Suspense>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Suspense fallback={<ScreenLoader />}>
            <PaymentManagement currentLanguage={currentLanguage} currentCurrency={currentCurrency} />
          </Suspense>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input defaultValue={userData.name} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input defaultValue={userData.email} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input defaultValue={userData.phone} />
              </div>
              <Button className="w-full">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Password</label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm New Password</label>
                <Input type="password" />
              </div>
              <Button className="w-full">Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
