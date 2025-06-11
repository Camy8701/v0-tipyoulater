interface RealtimeEvent {
  type: string
  data: any
  timestamp: number
  userId?: string
}

interface RealtimeSubscription {
  id: string
  channel: string
  callback: (event: RealtimeEvent) => void
}

class RealtimeService {
  private ws: WebSocket | null = null
  private subscriptions: Map<string, RealtimeSubscription> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  // Connect to WebSocket
  connect() {
    if (typeof window === "undefined") return

    try {
      // In a real app, this would connect to your WebSocket server
      // For demo purposes, we'll simulate WebSocket events
      console.log("Connecting to realtime service...")

      // Simulate connection
      setTimeout(() => {
        this.simulateRealtimeEvents()
      }, 1000)
    } catch (error) {
      console.error("Failed to connect to realtime service:", error)
      this.handleReconnect()
    }
  }

  // Disconnect from WebSocket
  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.subscriptions.clear()
  }

  // Subscribe to channel
  subscribe(channel: string, callback: (event: RealtimeEvent) => void): string {
    const subscriptionId = Math.random().toString(36).substr(2, 9)

    const subscription: RealtimeSubscription = {
      id: subscriptionId,
      channel,
      callback,
    }

    this.subscriptions.set(subscriptionId, subscription)
    console.log(`Subscribed to channel: ${channel}`)

    return subscriptionId
  }

  // Unsubscribe from channel
  unsubscribe(subscriptionId: string) {
    this.subscriptions.delete(subscriptionId)
    console.log(`Unsubscribed: ${subscriptionId}`)
  }

  // Send message
  send(channel: string, data: any) {
    const event: RealtimeEvent = {
      type: channel,
      data,
      timestamp: Date.now(),
    }

    console.log("Sending realtime event:", event)

    // In a real app, this would send via WebSocket
    // For demo, we'll just log it
  }

  // Handle incoming messages
  private handleMessage(event: RealtimeEvent) {
    this.subscriptions.forEach((subscription) => {
      if (subscription.channel === event.type || subscription.channel === "*") {
        subscription.callback(event)
      }
    })
  }

  // Handle reconnection
  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`)

      setTimeout(() => {
        this.connect()
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }

  // Simulate realtime events for demo
  private simulateRealtimeEvents() {
    const events = [
      {
        type: "tip_received",
        data: { amount: 25, restaurantName: "Bella Vista", staffName: "Marco" },
      },
      {
        type: "restaurant_status_update",
        data: { restaurantId: "rest_001", status: "busy", waitTime: 15 },
      },
      {
        type: "new_review",
        data: { restaurantId: "rest_002", rating: 5, comment: "Amazing food!" },
      },
      {
        type: "staff_online",
        data: { staffId: "staff_001", name: "Sarah", status: "online" },
      },
    ]

    // Send random events every 10-30 seconds
    const sendRandomEvent = () => {
      const event = events[Math.floor(Math.random() * events.length)]
      const realtimeEvent: RealtimeEvent = {
        ...event,
        timestamp: Date.now(),
      }

      this.handleMessage(realtimeEvent)

      // Schedule next event
      setTimeout(sendRandomEvent, Math.random() * 20000 + 10000)
    }

    sendRandomEvent()
  }
}

export const realtimeService = new RealtimeService()

// Notification service
class NotificationService {
  private permission: NotificationPermission = "default"

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    if ("Notification" in window) {
      this.permission = await Notification.requestPermission()
      return this.permission === "granted"
    }
    return false
  }

  // Show notification
  showNotification(title: string, options?: NotificationOptions) {
    if (this.permission === "granted") {
      new Notification(title, {
        icon: "/images/tyl-logo.png",
        badge: "/images/tyl-logo.png",
        ...options,
      })
    }
  }

  // Show push notification (via service worker)
  async showPushNotification(title: string, body: string, data?: any) {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      const registration = await navigator.serviceWorker.ready

      registration.showNotification(title, {
        body,
        icon: "/images/tyl-logo.png",
        badge: "/images/tyl-logo.png",
        vibrate: [100, 50, 100],
        data,
        actions: [
          {
            action: "view",
            title: "View Details",
          },
          {
            action: "dismiss",
            title: "Dismiss",
          },
        ],
      })
    }
  }

  // Subscribe to push notifications
  async subscribeToPush(): Promise<PushSubscription | null> {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration = await navigator.serviceWorker.ready
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

        if (!vapidKey) {
          console.warn("VAPID public key not configured")
          return null
        }

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(vapidKey),
        })

        console.log("Push subscription successful:", subscription)
        return subscription
      } catch (error) {
        console.error("Failed to subscribe to push notifications:", error)
        return null
      }
    }
    return null
  }

  // Convert VAPID key
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }
}

export const notificationService = new NotificationService()
