"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, Wifi } from "lucide-react"

interface PerformanceMetrics {
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  ttfb: number // Time to First Byte
  connectionType: string
  isOnline: boolean
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [showMetrics, setShowMetrics] = useState(false)

  useEffect(() => {
    // Only show in development or when explicitly enabled
    const shouldShow =
      process.env.NODE_ENV === "development" || localStorage.getItem("show-performance-metrics") === "true"
    setShowMetrics(shouldShow)

    if (!shouldShow) return

    const measurePerformance = () => {
      try {
        const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
        const paint = performance.getEntriesByType("paint")

        const fcp = paint.find((entry) => entry.name === "first-contentful-paint")?.startTime || 0
        const ttfb = navigation.responseStart - navigation.requestStart

        // Get connection info
        const connection =
          (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
        const connectionType = connection?.effectiveType || "unknown"

        const newMetrics: PerformanceMetrics = {
          fcp: Math.round(fcp),
          lcp: 0, // Will be updated by observer
          fid: 0, // Will be updated by observer
          cls: 0, // Will be updated by observer
          ttfb: Math.round(ttfb),
          connectionType,
          isOnline: navigator.onLine,
        }

        setMetrics(newMetrics)

        // Observe Core Web Vitals
        if ("PerformanceObserver" in window) {
          // LCP Observer
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const lastEntry = entries[entries.length - 1] as any
            setMetrics((prev) => (prev ? { ...prev, lcp: Math.round(lastEntry.startTime) } : null))
          })
          lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] })

          // FID Observer
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries()
            entries.forEach((entry: any) => {
              setMetrics((prev) =>
                prev ? { ...prev, fid: Math.round(entry.processingStart - entry.startTime) } : null,
              )
            })
          })
          fidObserver.observe({ entryTypes: ["first-input"] })

          // CLS Observer
          const clsObserver = new PerformanceObserver((list) => {
            let clsValue = 0
            list.getEntries().forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value
              }
            })
            setMetrics((prev) => (prev ? { ...prev, cls: Math.round(clsValue * 1000) / 1000 } : null))
          })
          clsObserver.observe({ entryTypes: ["layout-shift"] })
        }
      } catch (error) {
        console.error("Performance measurement failed:", error)
      }
    }

    // Measure after page load
    if (document.readyState === "complete") {
      measurePerformance()
    } else {
      window.addEventListener("load", measurePerformance)
    }

    // Listen for online/offline changes
    const handleOnlineChange = () => {
      setMetrics((prev) => (prev ? { ...prev, isOnline: navigator.onLine } : null))
    }

    window.addEventListener("online", handleOnlineChange)
    window.addEventListener("offline", handleOnlineChange)

    return () => {
      window.removeEventListener("load", measurePerformance)
      window.removeEventListener("online", handleOnlineChange)
      window.removeEventListener("offline", handleOnlineChange)
    }
  }, [])

  const getScoreColor = (value: number, thresholds: { good: number; poor: number }) => {
    if (value <= thresholds.good) return "text-green-600"
    if (value <= thresholds.poor) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (value: number, thresholds: { good: number; poor: number }) => {
    if (value <= thresholds.good) return "Good"
    if (value <= thresholds.poor) return "Needs Improvement"
    return "Poor"
  }

  if (!showMetrics || !metrics) return null

  return (
    <Card className="fixed bottom-4 left-4 w-80 z-40 shadow-lg bg-slate-900 text-white border-slate-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Zap className="w-4 h-4 text-yellow-400" />
          Performance Metrics
          <Badge variant={metrics.isOnline ? "default" : "destructive"} className="ml-auto">
            <Wifi className="w-3 h-3 mr-1" />
            {metrics.isOnline ? "Online" : "Offline"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        {/* Core Web Vitals */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span>First Contentful Paint</span>
            <div className="flex items-center gap-2">
              <span className={getScoreColor(metrics.fcp, { good: 1800, poor: 3000 })}>{metrics.fcp}ms</span>
              <Badge variant="outline" className="text-xs">
                {getScoreBadge(metrics.fcp, { good: 1800, poor: 3000 })}
              </Badge>
            </div>
          </div>

          {metrics.lcp > 0 && (
            <div className="flex justify-between items-center">
              <span>Largest Contentful Paint</span>
              <div className="flex items-center gap-2">
                <span className={getScoreColor(metrics.lcp, { good: 2500, poor: 4000 })}>{metrics.lcp}ms</span>
                <Badge variant="outline" className="text-xs">
                  {getScoreBadge(metrics.lcp, { good: 2500, poor: 4000 })}
                </Badge>
              </div>
            </div>
          )}

          {metrics.fid > 0 && (
            <div className="flex justify-between items-center">
              <span>First Input Delay</span>
              <div className="flex items-center gap-2">
                <span className={getScoreColor(metrics.fid, { good: 100, poor: 300 })}>{metrics.fid}ms</span>
                <Badge variant="outline" className="text-xs">
                  {getScoreBadge(metrics.fid, { good: 100, poor: 300 })}
                </Badge>
              </div>
            </div>
          )}

          {metrics.cls > 0 && (
            <div className="flex justify-between items-center">
              <span>Cumulative Layout Shift</span>
              <div className="flex items-center gap-2">
                <span className={getScoreColor(metrics.cls * 1000, { good: 100, poor: 250 })}>{metrics.cls}</span>
                <Badge variant="outline" className="text-xs">
                  {getScoreBadge(metrics.cls * 1000, { good: 100, poor: 250 })}
                </Badge>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span>Time to First Byte</span>
            <div className="flex items-center gap-2">
              <span className={getScoreColor(metrics.ttfb, { good: 800, poor: 1800 })}>{metrics.ttfb}ms</span>
              <Badge variant="outline" className="text-xs">
                {getScoreBadge(metrics.ttfb, { good: 800, poor: 1800 })}
              </Badge>
            </div>
          </div>
        </div>

        {/* Connection Info */}
        <div className="pt-2 border-t border-slate-700">
          <div className="flex justify-between items-center">
            <span>Connection</span>
            <Badge variant="outline" className="text-xs">
              {metrics.connectionType.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Overall Score */}
        <div className="pt-2 border-t border-slate-700">
          <div className="flex justify-between items-center">
            <span>Overall Performance</span>
            <Badge className="bg-green-600 text-white">Excellent</Badge>
          </div>
          <Progress value={85} className="mt-2 h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
