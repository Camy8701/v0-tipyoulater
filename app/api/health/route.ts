import { NextResponse } from "next/server"
import { deploymentConfig } from "@/lib/deployment"

export async function GET() {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: deploymentConfig.version,
    environment: deploymentConfig.environment,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    features: deploymentConfig.features,
    services: {
      database: "connected", // In real app, check actual DB connection
      stripe: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? "configured" : "not-configured",
      notifications: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ? "configured" : "not-configured",
    },
  }

  return NextResponse.json(health)
}
