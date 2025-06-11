interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  url: string
  userAgent: string
}

interface ErrorReport {
  message: string
  stack?: string
  url: string
  timestamp: number
  userAgent: string
  userId?: string
}

class MonitoringService {
  private apiEndpoint = "/api/analytics"
  private isProduction = process.env.NODE_ENV === "production"

  // Track performance metrics
  trackPerformance(metric: Omit<PerformanceMetric, "timestamp" | "url" | "userAgent">) {
    if (!this.isProduction) return

    const performanceData: PerformanceMetric = {
      ...metric,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    }

    this.sendToAnalytics("performance", performanceData)
  }

  // Track errors
  trackError(error: Error, context?: Record<string, any>) {
    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      ...context,
    }

    console.error("Error tracked:", errorReport)

    if (this.isProduction) {
      this.sendToAnalytics("error", errorReport)
    }
  }

  // Track business metrics
  trackBusinessMetric(event: string, data: Record<string, any>) {
    const businessData = {
      event,
      data,
      timestamp: Date.now(),
      url: window.location.href,
    }

    this.sendToAnalytics("business", businessData)
  }

  // Send data to analytics endpoint
  private async sendToAnalytics(type: string, data: any) {
    try {
      await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          data,
        }),
      })
    } catch (error) {
      console.error("Failed to send analytics:", error)
    }
  }

  // Initialize monitoring
  initialize() {
    if (typeof window === "undefined") return

    // Track Core Web Vitals
    this.trackCoreWebVitals()

    // Track unhandled errors
    window.addEventListener("error", (event) => {
      this.trackError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    })

    // Track unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.trackError(new Error(event.reason), {
        type: "unhandledrejection",
      })
    })

    // Track page visibility changes
    document.addEventListener("visibilitychange", () => {
      this.trackBusinessMetric("page_visibility", {
        visible: !document.hidden,
      })
    })
  }

  // Track Core Web Vitals
  private trackCoreWebVitals() {
    // First Contentful Paint
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          this.trackPerformance({
            name: "FCP",
            value: entry.startTime,
          })
        }
      }
    }).observe({ entryTypes: ["paint"] })

    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      this.trackPerformance({
        name: "LCP",
        value: lastEntry.startTime,
      })
    }).observe({ entryTypes: ["largest-contentful-paint"] })

    // First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.trackPerformance({
          name: "FID",
          value: entry.processingStart - entry.startTime,
        })
      }
    }).observe({ entryTypes: ["first-input"] })

    // Cumulative Layout Shift
    let clsValue = 0
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      }
      this.trackPerformance({
        name: "CLS",
        value: clsValue,
      })
    }).observe({ entryTypes: ["layout-shift"] })
  }
}

export const monitoring = new MonitoringService()
