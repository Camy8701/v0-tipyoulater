const CACHE_NAME = "tipyoulater-v1"
const urlsToCache = ["/", "/images/tyl-logo.png", "/images/hero-background.png", "/manifest.json"]

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)))
})

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request)
    }),
  )
})

// Push event for notifications
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "New tip received!",
    icon: "/images/tyl-logo.png",
    badge: "/images/tyl-logo.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "View Details",
        icon: "/images/tyl-logo.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/images/tyl-logo.png",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification("TipYouLater", options))
})

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"))
  }
})
