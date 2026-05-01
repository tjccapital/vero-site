import { NextResponse } from "next/server"
import { auth0 } from "@/lib/auth0"

// Debug-only endpoint. Returns whether getAccessToken() succeeds, which
// audience the token was issued for, and when it expires. Useful for
// diagnosing 401s from the email proxy: if `aud` is not the backend API
// identifier, AUTH0_AUDIENCE env / lib/auth0.ts is misconfigured and the
// user may need to log out/in to get a session with an API access token.
//
// Token contents are NOT returned — only the JWT header/payload claims.
//
// Remove or gate this behind NODE_ENV !== 'production' once verified.
export async function GET() {
  let tokenResult: unknown
  let tokenError: string | undefined
  try {
    tokenResult = await auth0.getAccessToken()
  } catch (err) {
    tokenError = err instanceof Error ? `${err.name}: ${err.message}` : String(err)
  }

  const accessToken: string | undefined =
    typeof tokenResult === "string"
      ? tokenResult
      : (tokenResult as { token?: string } | undefined)?.token

  let claims: Record<string, unknown> | undefined
  let header: Record<string, unknown> | undefined
  let isJwt = false
  if (accessToken) {
    const parts = accessToken.split(".")
    if (parts.length === 3) {
      isJwt = true
      try {
        header = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"))
        claims = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"))
      } catch {
        // Not a parseable JWT
      }
    }
  }

  return NextResponse.json({
    hasAccessToken: !!accessToken,
    tokenLength: accessToken?.length ?? 0,
    tokenError,
    isJwt,
    header,
    claims: claims
      ? {
          aud: claims.aud,
          iss: claims.iss,
          sub: claims.sub,
          azp: claims.azp,
          scope: claims.scope,
          exp: claims.exp,
          iat: claims.iat,
          gty: claims.gty,
        }
      : undefined,
    expectedAudience:
      process.env.AUTH0_AUDIENCE || "https://api.veroreceipts.com",
  })
}
