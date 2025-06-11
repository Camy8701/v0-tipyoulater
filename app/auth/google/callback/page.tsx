"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { exchangeCodeForTokens, getGoogleUserInfo, type GoogleUser } from "@/lib/google-auth"
import { CheckCircle, AlertCircle } from "lucide-react"

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [user, setUser] = useState<GoogleUser | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code")
        const error = searchParams.get("error")

        if (error) {
          throw new Error(`Google OAuth error: ${error}`)
        }

        if (!code) {
          throw new Error("No authorization code received")
        }

        // Exchange code for tokens
        const tokens = await exchangeCodeForTokens(code)

        // Get user info
        const userInfo = await getGoogleUserInfo(tokens.access_token)

        // Store user info in localStorage for demo
        localStorage.setItem("google_user", JSON.stringify(userInfo))
        localStorage.setItem("google_tokens", JSON.stringify(tokens))

        setUser(userInfo)
        setStatus("success")

        // Redirect to main page after 2 seconds
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Authentication failed")
        setStatus("error")
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {status === "loading" && (
            <div className="space-y-4">
              <div className="w-12 h-12 animate-spin border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
              <h2 className="text-xl font-semibold">Authenticating with Google...</h2>
              <p className="text-gray-600 dark:text-gray-400">Please wait while we verify your account</p>
            </div>
          )}

          {status === "success" && user && (
            <div className="space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h2 className="text-xl font-semibold text-green-700 dark:text-green-400">Welcome!</h2>
              <div className="space-y-2">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
              </div>
              <p className="text-sm text-gray-500">Redirecting you to the app...</p>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
              <h2 className="text-xl font-semibold text-red-700 dark:text-red-400">Authentication Failed</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
              <Button onClick={() => router.push("/")} className="w-full">
                Return to Home
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
