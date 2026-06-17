import { NextRequest, NextResponse } from "next/server"
import { auth0 } from "@/lib/auth0"

// Same-origin proxy for receipt asset images. The browser can render a
// cross-origin image in an <img> tag without CORS, but converting a HEIC
// receipt photo for preview requires reading the bytes via fetch(), which
// *does* need CORS — and the backend's signed CDN URLs don't always send it.
// Fetching through this route (server-side, no CORS) lets the HEIC converter
// read the bytes. Gated on an authenticated session and a host allowlist so it
// can't be used as an open proxy / SSRF vector.

const ALLOWED_HOST_SUFFIXES = [
  "veroreceipts.com",
  "digitaloceanspaces.com",
  "amazonaws.com",
]

function isAllowedHost(hostname: string): boolean {
  const host = hostname.toLowerCase()
  return ALLOWED_HOST_SUFFIXES.some(
    (suffix) => host === suffix || host.endsWith(`.${suffix}`)
  )
}

export async function GET(request: NextRequest) {
  // Require a logged-in session so this isn't an open proxy.
  try {
    const result = await auth0.getAccessToken()
    const token = typeof result === "string" ? result : result?.token
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
  } catch {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const raw = request.nextUrl.searchParams.get("url")
  if (!raw) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 })
  }

  let target: URL
  try {
    target = new URL(raw)
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 })
  }

  if (target.protocol !== "https:" || !isAllowedHost(target.hostname)) {
    return NextResponse.json({ error: "Host not allowed" }, { status: 403 })
  }

  let upstream: Response
  try {
    upstream = await fetch(target.toString(), {
      headers: { accept: "image/*,*/*" },
    })
  } catch {
    return NextResponse.json({ error: "Upstream fetch failed" }, { status: 502 })
  }

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: `Upstream returned ${upstream.status}` },
      { status: 502 }
    )
  }

  const headers = new Headers()
  headers.set(
    "content-type",
    upstream.headers.get("content-type") || "application/octet-stream"
  )
  // Receipt assets are immutable; let the browser cache the proxied bytes.
  headers.set("cache-control", "private, max-age=3600")

  return new NextResponse(upstream.body, { status: 200, headers })
}
