interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  userId?: string
  timestamp?: number
}

interface UserBehavior {
  pageViews: number
  tipsSent: number
  searchQueries: number
  timeSpent: number
  lastActive: number
}

class Analytics {
  private events: AnalyticsEvent[] = []
  private userBehavior: UserBehavior = {
    pageViews: 0,
    tipsSent: 0,
    searchQueries: 0,
    timeSpent: 0,
    lastActive: Date.now(),
  }
  private sessionStart = Date.now()

  // Track page views
  trackPageView(page: string, userId?: string) {
    this.track("page_view", { page }, userId)
    this.userBehavior.pageViews++
    this.saveUserBehavior()
  }

  // Track user interactions
  trackClick(element: string, location: string, userId?: string) {
    this.track("click", { element, location }, userId)
  }

  // Track tip sending
  trackTipSent(amount: number, currency: string, restaurantId: string, userId?: string) {
    this.track("tip_sent", { amount, currency, restaurantId }, userId)
    this.userBehavior.tipsSent++
    this.saveUserBehavior()
  }

  // Track search queries
  trackSearch(query: string, results: number, userId?: string) {
    this.track("search", { query, results }, userId)
    this.userBehavior.searchQueries++
    this.saveUserBehavior()
  }

  // Track conversion events
  trackConversion(type: string, value: number, userId?: string) {
    this.track("conversion", { type, value }, userId)
  }

  // Track performance metrics
  trackPerformance(metric: string, value: number) {
    this.track("performance", { metric, value })
  }

  // Track errors
  trackError(error: string, context: string) {
    this.track("error", { error, context })
  }

  // Generic track method
  private track(event: string, properties?: Record<string, any>, userId?: string) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      userId,
      timestamp: Date.now(),
    }

    this.events.push(analyticsEvent)
    this.sendToAnalytics(analyticsEvent)
  }

  // Send events to analytics service
  private async sendToAnalytics(event: AnalyticsEvent) {
    try {
      // In a real app, this would send to your analytics service
      console.log("Analytics Event:", event)

      // Simulate sending to external service
      if (typeof window !== "undefined") {
        // Store in localStorage for demo purposes
        const storedEvents = JSON.parse(localStorage.getItem("analytics_events") || "[]")
        storedEvents.push(event)
        localStorage.setItem("analytics_events", JSON.stringify(storedEvents.slice(-100))) // Keep last 100 events
      }
    } catch (error) {
      console.error("Failed to send analytics event:", error)
    }
  }

  // Get user behavior data
  getUserBehavior(): UserBehavior {
    this.userBehavior.timeSpent = Date.now() - this.sessionStart
    return this.userBehavior
  }

  // Get analytics summary
  getAnalyticsSummary() {
    const events = this.getStoredEvents()
    const summary = {
      totalEvents: events.length,
      pageViews: events.filter((e) => e.event === "page_view").length,
      tipsSent: events.filter((e) => e.event === "tip_sent").length,
      searches: events.filter((e) => e.event === "search").length,
      clicks: events.filter((e) => e.event === "click").length,
      errors: events.filter((e) => e.event === "error").length,
      conversions: events.filter((e) => e.event === "conversion").length,
      userBehavior: this.getUserBehavior(),
    }
    return summary
  }

  // Get stored events from localStorage
  private getStoredEvents(): AnalyticsEvent[] {
    if (typeof window === "undefined") return []
    return JSON.parse(localStorage.getItem("analytics_events") || "[]")
  }

  // Save user behavior to localStorage
  private saveUserBehavior() {
    if (typeof window !== "undefined") {
      this.userBehavior.lastActive = Date.now()
      localStorage.setItem("user_behavior", JSON.stringify(this.userBehavior))
    }
  }

  // Load user behavior from localStorage
  loadUserBehavior() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user_behavior")
      if (stored) {
        this.userBehavior = { ...this.userBehavior, ...JSON.parse(stored) }
      }
    }
  }
}

export const analytics = new Analytics()
