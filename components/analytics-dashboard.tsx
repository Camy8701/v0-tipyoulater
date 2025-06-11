"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Users, DollarSign, Activity, Eye, Download } from "lucide-react"
import { analytics } from "@/lib/analytics"
import { type Language, getTranslation } from "@/lib/translations"

interface AnalyticsDashboardProps {
  currentLanguage: Language
}

export function AnalyticsDashboard({ currentLanguage }: AnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("7d")

  const t = (key: keyof typeof import("@/lib/translations").translations.en, params?: Record<string, string>) =>
    getTranslation(currentLanguage, key, params)

  useEffect(() => {
    // Load analytics data
    const data = analytics.getAnalyticsSummary()
    setAnalyticsData(data)
  }, [])

  // Sample data for charts
  const pageViewData = [
    { name: "Mon", views: 120, tips: 8 },
    { name: "Tue", views: 150, tips: 12 },
    { name: "Wed", views: 180, tips: 15 },
    { name: "Thu", views: 200, tips: 18 },
    { name: "Fri", views: 250, tips: 22 },
    { name: "Sat", views: 300, tips: 28 },
    { name: "Sun", views: 280, tips: 25 },
  ]

  const deviceData = [
    { name: "Mobile", value: 65, color: "#06b6d4" },
    { name: "Desktop", value: 25, color: "#0f172a" },
    { name: "Tablet", value: 10, color: "#64748b" },
  ]

  const conversionData = [
    { step: "Landing", users: 1000, rate: 100 },
    { step: "Search", users: 800, rate: 80 },
    { step: "Select Restaurant", users: 600, rate: 60 },
    { step: "Tip Modal", users: 400, rate: 40 },
    { step: "Payment", users: 300, rate: 30 },
    { step: "Complete", users: 250, rate: 25 },
  ]

  const exportData = () => {
    const data = {
      summary: analyticsData,
      pageViews: pageViewData,
      devices: deviceData,
      conversion: conversionData,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analytics-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin text-teal-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">Track user behavior and app performance</p>
        </div>
        <div className="flex items-center gap-4">
          <Tabs value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
            <TabsList>
              <TabsTrigger value="24h">24h</TabsTrigger>
              <TabsTrigger value="7d">7d</TabsTrigger>
              <TabsTrigger value="30d">30d</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={exportData} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Events</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{analyticsData.totalEvents}</p>
              </div>
              <Activity className="w-8 h-8 text-teal-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+12% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Page Views</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{analyticsData.pageViews}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+8% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Tips Sent</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{analyticsData.tipsSent}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+25% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Conversion Rate</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">25%</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-500">+3% from last week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Page Views & Tips Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Page Views & Tips Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={pageViewData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#06b6d4" strokeWidth={2} />
                <Line type="monotone" dataKey="tips" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Device Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversionData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="step" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="users" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* User Behavior Insights */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>User Behavior</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Average Session Duration</span>
              <Badge variant="secondary">{Math.round(analyticsData.userBehavior.timeSpent / 60000)} min</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Search Queries</span>
              <Badge variant="secondary">{analyticsData.searches}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Click Events</span>
              <Badge variant="secondary">{analyticsData.clicks}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Error Rate</span>
              <Badge variant={analyticsData.errors > 5 ? "destructive" : "secondary"}>
                {((analyticsData.errors / analyticsData.totalEvents) * 100).toFixed(1)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Page Load Time</span>
              <Badge variant="secondary">1.2s</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Time to Interactive</span>
              <Badge variant="secondary">2.1s</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Core Web Vitals</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Good
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">Bounce Rate</span>
              <Badge variant="secondary">32%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
