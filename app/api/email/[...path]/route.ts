import { NextRequest, NextResponse } from "next/server"
import { auth0 } from "@/lib/auth0"

const API_BASE =
  process.env.VERO_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.veroreceipts.com"

// Headers we never want to forward upstream — Next.js / fetch will set the
// right values, and forwarding them blindly causes hop-by-hop or host issues.
const HOP_BY_HOP = new Set([
  "host",
  "connection",
  "content-length",
  "accept-encoding",
  "transfer-encoding",
  "keep-alive",
  "upgrade",
  "te",
  "trailer",
  "proxy-authorization",
  "proxy-authenticate",
  // Replaced below with the Auth0-issued bearer token.
  "authorization",
  "cookie",
])

async function proxy(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params

  let accessToken: string | undefined
  try {
    const result = await auth0.getAccessToken()
    accessToken = typeof result === "string" ? result : result?.token
  } catch {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    )
  }

  if (!accessToken) {
    return NextResponse.json(
      { error: "No access token available" },
      { status: 401 }
    )
  }

  const targetUrl = `${API_BASE}/api/email/${path.join("/")}${request.nextUrl.search}`

  const headers = new Headers()
  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key.toLowerCase())) headers.set(key, value)
  })
  headers.set("authorization", `Bearer ${accessToken}`)

  const init: RequestInit & { duplex?: "half" } = {
    method: request.method,
    headers,
    redirect: "manual",
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    const body = await request.arrayBuffer()
    if (body.byteLength > 0) init.body = body
  }

  const upstream = await fetch(targetUrl, init)

  // Strip headers that don't apply across the proxy boundary.
  const responseHeaders = new Headers()
  upstream.headers.forEach((value, key) => {
    const lower = key.toLowerCase()
    if (lower === "content-encoding" || lower === "transfer-encoding" || lower === "connection") return
    responseHeaders.set(key, value)
  })

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  })
}

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
}
