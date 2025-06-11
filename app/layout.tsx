import type React from "react"
import type { Metadata } from "next"
import ClientRootLayout from "./clientLayout"

export const metadata: Metadata = {
  title: "TipYouLater - Tip Anytime, Anywhere",
  description:
    "Send tips to your favorite restaurants, cafes, and bars even after you've left. Show appreciation when it matters most.",
  manifest: "/manifest.json",
  themeColor: "#06b6d4",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TipYouLater",
  },
  openGraph: {
    title: "TipYouLater - Tip Anytime, Anywhere",
    description: "Send tips to your favorite restaurants, cafes, and bars even after you've left",
    type: "website",
    images: ["/images/hero-background.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "TipYouLater - Tip Anytime, Anywhere",
    description: "Send tips to your favorite restaurants, cafes, and bars even after you've left",
    images: ["/images/hero-background.png"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientRootLayout>{children}</ClientRootLayout>
}


import './globals.css'