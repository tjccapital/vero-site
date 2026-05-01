import { NextRequest, NextResponse } from "next/server"
import { auth0 } from "@/lib/auth0"

const API_BASE =
  process.env.VERO_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://api.veroreceipts.com"

// Match the vero-mobile apiClient (vero-mobile/src/services/api.ts) header
// shape exactly: Authorization on every request, Content-Type only when there
// is a JSON body, and nothing else. The browser's native fetch attaches a pile
// of headers (sec-ch-ua, sec-fetch-*, referer, origin, browser User-Agent...)
// that, when forwarded from a Vercel server IP to a backend WAF, look like
// browser fingerprints arriving from a datacenter — a classic "likely bot"
// signal that triggers Bot Fight Mode / WAF challenges and produces opaque
// 403s with HTML interstitials.
//
// We deliberately do NOT pass through cookies (different domain), and we set
// our own Authorization header from the Auth0 access token. The user's browser
// session is replaced by a server-issued bearer token, just like mobile.
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

  // Build a minimal header set that matches the mobile apiClient.
  const headers = new Headers()
  headers.set("authorization", `Bearer ${accessToken}`)
  headers.set("accept", "application/json")
  // Identify ourselves as the web client. A clean, predictable User-Agent
  // avoids the browser fingerprint that WAFs flag when paired with a
  // datacenter source IP.
  headers.set("user-agent", "vero-web/1.0")

  let body: ArrayBuffer | undefined
  if (request.method !== "GET" && request.method !== "HEAD") {
    const buf = await request.arrayBuffer()
    if (buf.byteLength > 0) {
      body = buf
      // Only set Content-Type when we actually have a body, mirroring mobile.
      const ct = request.headers.get("content-type")
      if (ct) headers.set("content-type", ct)
    }
  }

  const upstream = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
    redirect: "manual",
  })

  // Forward the upstream response, stripping headers that don't apply across
  // the proxy boundary.
  const responseHeaders = new Headers()
  upstream.headers.forEach((value, key) => {
    const lower = key.toLowerCase()
    if (
      lower === "content-encoding" ||
      lower === "transfer-encoding" ||
      lower === "connection"
    ) {
      return
    }
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
