// Google OAuth configuration and utilities
export interface GoogleUser {
  id: string
  email: string
  name: string
  picture: string
  given_name: string
  family_name: string
}

export interface GoogleAuthResponse {
  access_token: string
  id_token: string
  scope: string
  token_type: string
  expires_in: number
}

// Google OAuth configuration
export const GOOGLE_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
  redirectUri: typeof window !== "undefined" ? `${window.location.origin}/auth/google/callback` : "",
  scope: "openid email profile",
  responseType: "code",
}

// Generate Google OAuth URL
export function getGoogleAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_CONFIG.clientId,
    redirect_uri: GOOGLE_CONFIG.redirectUri,
    scope: GOOGLE_CONFIG.scope,
    response_type: GOOGLE_CONFIG.responseType,
    access_type: "offline",
    prompt: "consent",
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

// Exchange authorization code for tokens
export async function exchangeCodeForTokens(code: string): Promise<GoogleAuthResponse> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: GOOGLE_CONFIG.clientId,
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      code,
      grant_type: "authorization_code",
      redirect_uri: GOOGLE_CONFIG.redirectUri,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to exchange code for tokens")
  }

  return response.json()
}

// Get user info from Google
export async function getGoogleUserInfo(accessToken: string): Promise<GoogleUser> {
  const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`)

  if (!response.ok) {
    throw new Error("Failed to get user info")
  }

  return response.json()
}

// Verify Google ID token
export async function verifyGoogleToken(idToken: string): Promise<GoogleUser> {
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`)

  if (!response.ok) {
    throw new Error("Invalid Google token")
  }

  const tokenInfo = await response.json()

  if (tokenInfo.aud !== GOOGLE_CONFIG.clientId) {
    throw new Error("Invalid token audience")
  }

  return {
    id: tokenInfo.sub,
    email: tokenInfo.email,
    name: tokenInfo.name,
    picture: tokenInfo.picture,
    given_name: tokenInfo.given_name,
    family_name: tokenInfo.family_name,
  }
}
