interface DeploymentConfig {
  environment: "development" | "staging" | "production"
  version: string
  buildTime: string
  features: string[]
}

export const deploymentConfig: DeploymentConfig = {
  environment: (process.env.NODE_ENV as any) || "development",
  version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
  buildTime: process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString(),
  features: [
    "real-time-notifications",
    "payment-processing",
    "analytics-tracking",
    "pwa-support",
    "multi-language",
    "multi-currency",
    "business-dashboard",
    "admin-panel",
  ],
}

export function getFeatureFlags() {
  return {
    enableRealtime: process.env.NEXT_PUBLIC_ENABLE_REALTIME !== "false",
    enablePayments: process.env.NEXT_PUBLIC_ENABLE_PAYMENTS !== "false",
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== "false",
    enablePWA: process.env.NEXT_PUBLIC_ENABLE_PWA !== "false",
    enableNotifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS !== "false",
  }
}

export function isFeatureEnabled(feature: keyof ReturnType<typeof getFeatureFlags>): boolean {
  return getFeatureFlags()[feature]
}
