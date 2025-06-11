"use client"

import React from "react"

// Global ResizeObserver error suppression
export function suppressResizeObserverErrors() {
  // Suppress ResizeObserver loop errors
  const resizeObserverErrorHandler = (e: ErrorEvent) => {
    if (
      e.message === "ResizeObserver loop completed with undelivered notifications." ||
      e.message === "ResizeObserver loop limit exceeded"
    ) {
      e.stopImmediatePropagation()
      e.preventDefault()
      return false
    }
  }

  // Handle unhandled promise rejections
  const unhandledRejectionHandler = (e: PromiseRejectionEvent) => {
    if (e.reason?.message?.includes("ResizeObserver") || e.reason?.toString?.()?.includes("ResizeObserver")) {
      e.preventDefault()
      return false
    }
  }

  if (typeof window !== "undefined") {
    window.addEventListener("error", resizeObserverErrorHandler)
    window.addEventListener("unhandledrejection", unhandledRejectionHandler)

    // Also patch console.error to suppress these specific errors
    const originalConsoleError = console.error
    console.error = (...args) => {
      const message = args.join(" ")
      if (message.includes("ResizeObserver")) {
        return
      }
      originalConsoleError.apply(console, args)
    }

    return () => {
      window.removeEventListener("error", resizeObserverErrorHandler)
      window.removeEventListener("unhandledrejection", unhandledRejectionHandler)
      console.error = originalConsoleError
    }
  }
}

// Custom intersection observer hook that's more stable
export function useStableIntersection(ref: React.RefObject<Element>, options: IntersectionObserverInit = {}) {
  const [isIntersecting, setIsIntersecting] = React.useState(false)
  const [hasIntersected, setHasIntersected] = React.useState(false)

  React.useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === "undefined") {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsIntersecting(entry.isIntersecting)
          if (entry.isIntersecting && !hasIntersected) {
            setHasIntersected(true)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [ref, hasIntersected, options])

  return { isIntersecting, hasIntersected }
}
