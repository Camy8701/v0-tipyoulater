"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell, X, Check, DollarSign, Star, Users, Zap } from "lucide-react"
import { realtimeService, notificationService } from "@/lib/realtime"

interface Notification {
  id: string
  type: "tip_received" | "review_posted" | "staff_online" | "restaurant_update"
  title: string
  message: string
  timestamp: number
  read: boolean
  data?: any
}

export function RealtimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    // Initialize realtime connection
    realtimeService.connect()
    setIsConnected(true)

    // Subscribe to all events
    const subscriptionId = realtimeService.subscribe("*", handleRealtimeEvent)

    // Request notification permission
    notificationService.requestPermission()

    return () => {
      realtimeService.unsubscribe(subscriptionId)
      realtimeService.disconnect()
    }
  }, [])

  const handleRealtimeEvent = (event: any) => {
    const notification = createNotificationFromEvent(event)
    if (notification) {
      setNotifications((prev) => [notification, ...prev.slice(0, 9)]) // Keep last 10

      // Show browser notification if page is not visible
      if (document.hidden) {
        notificationService.showNotification(notification.title, {
          body: notification.message,
          icon: "/images/tyl-logo.png",
        })
      }
    }
  }

  const createNotificationFromEvent = (event: any): Notification | null => {
    const id = Math.random().toString(36).substr(2, 9)
    const timestamp = Date.now()

    switch (event.type) {
      case "tip_received":
        return {
          id,
          type: "tip_received",
          title: "New Tip Received!",
          message: `You received $${event.data.amount} from ${event.data.restaurantName}`,
          timestamp,
          read: false,
          data: event.data,
        }

      case "new_review":
        return {
          id,
          type: "review_posted",
          title: "New Review Posted",
          message: `${event.data.rating} star review: "${event.data.comment}"`,
          timestamp,
          read: false,
          data: event.data,
        }

      case "staff_online":
        return {
          id,
          type: "staff_online",
          title: "Staff Member Online",
          message: `${event.data.name} is now available for tips`,
          timestamp,
          read: false,
          data: event.data,
        }

      case "restaurant_status_update":
        return {
          id,
          type: "restaurant_update",
          title: "Restaurant Update",
          message: `Status changed to ${event.data.status}. Wait time: ${event.data.waitTime} min`,
          timestamp,
          read: false,
          data: event.data,
        }

      default:
        return null
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "tip_received":
        return <DollarSign className="w-5 h-5 text-green-500" />
      case "review_posted":
        return <Star className="w-5 h-5 text-yellow-500" />
      case "staff_online":
        return <Users className="w-5 h-5 text-blue-500" />
      case "restaurant_update":
        return <Zap className="w-5 h-5 text-purple-500" />
      default:
        return <Bell className="w-5 h-5 text-slate-500" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative text-white hover:bg-slate-700 p-2"
      >
        <Bell className="w-5 h-5" />
      </Button>

      {/* Connection Status */}
      <div className={`absolute top-0 right-0 w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="absolute top-full right-0 mt-2 w-96 max-h-96 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    <Check className="w-4 h-4 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer ${
                    !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-slate-900 dark:text-white text-sm">{notification.title}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeNotification(notification.id)
                          }}
                          className="p-1 h-auto"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{notification.message}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
