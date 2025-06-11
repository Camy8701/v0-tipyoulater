"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, DollarSign, Users, MessageSquare } from "lucide-react"
import { type Language, getTranslation } from "@/lib/translations"

// Update the BusinessDashboard component to accept currentCurrency prop
interface BusinessDashboardProps {
  currentLanguage: Language
  currentCurrency: string
}

const sampleReviews = [
  {
    id: 1,
    customerName: "Sarah M.",
    rating: 5,
    comment: "Amazing service! The waiter was so attentive and friendly. Will definitely be back!",
    tipAmount: 25,
    date: "2024-11-15",
  },
  {
    id: 2,
    customerName: "Mike R.",
    rating: 4,
    comment: "Great food and atmosphere. Service was quick and professional.",
    tipAmount: 18,
    date: "2024-11-14",
  },
  {
    id: 3,
    customerName: "Emma L.",
    rating: 5,
    comment: "Best Italian food in town! The staff made our anniversary dinner perfect.",
    tipAmount: 40,
    date: "2024-11-13",
  },
  {
    id: 4,
    customerName: "David K.",
    rating: 4,
    comment: "Solid experience overall. Good value for money.",
    tipAmount: 15,
    date: "2024-11-12",
  },
]

export function BusinessDashboard({ currentLanguage, currentCurrency }: BusinessDashboardProps) {
  const t = (key: keyof typeof import("@/lib/translations").translations.en, params?: Record<string, string>) =>
    getTranslation(currentLanguage, key, params)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-12 px-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 rounded-3xl">
        <h1 className="text-4xl font-bold mb-4">{t("businessDashboardTitle")}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">{t("manageProfile")}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">$2,847</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide">{t("tipsThisMonth")}</div>
          </CardContent>
        </Card>

        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">156</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide">{t("totalTips")}</div>
          </CardContent>
        </Card>

        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">4.8</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide">{t("averageRating")}</div>
          </CardContent>
        </Card>

        <Card className="text-center p-6 hover:shadow-lg transition-shadow">
          <CardContent className="p-0">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">89</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide">{t("reviews")}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t("recentReviewsAndTips")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sampleReviews.map((review) => (
              <div
                key={review.id}
                className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="font-semibold">{review.customerName}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{formatDate(review.date)}</div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="ml-2 text-sm">({review.rating}/5)</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3">{review.comment}</p>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {t("tip")}: ${review.tipAmount}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
