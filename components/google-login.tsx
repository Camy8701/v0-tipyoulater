"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { getGoogleAuthUrl, type GoogleUser } from "@/lib/google-auth"
import { Chrome, Shield, CheckCircle } from "lucide-react"

interface GoogleLoginProps {
  onLogin?: (user: GoogleUser) => void
  onClose?: () => void
  isOpen?: boolean
}

export function GoogleLogin({ onLogin, onClose, isOpen = false }: GoogleLoginProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Check if Google Client ID is configured
      if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
        // For demo purposes, simulate a successful Google login
        const demoUser: GoogleUser = {
          id: "demo_google_user_123",
          email: "demo@gmail.com",
          name: "Demo Google User",
          picture: "https://lh3.googleusercontent.com/a/default-user=s96-c",
          given_name: "Demo",
          family_name: "User",
        }

        setTimeout(() => {
          onLogin?.(demoUser)
          setIsLoading(false)
        }, 1500)
        return
      }

      // Redirect to Google OAuth
      const authUrl = getGoogleAuthUrl()
      window.location.href = authUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login with Google")
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Chrome className="w-5 h-5 text-blue-500" />
            Sign in with Google
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Demo Notice */}
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Demo Mode</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    This is a demo version. Click below to simulate Google login.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Google Login Button */}
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 animate-spin border-2 border-blue-500 border-t-transparent rounded-full" />
                Signing in...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </div>
            )}
          </Button>

          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Secure OAuth 2.0 authentication
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-500" />
              No password required
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Quick and easy access
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Alternative Login */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Or use demo credentials:</p>
            <Badge variant="outline" className="text-xs">
              admin / admin123
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
