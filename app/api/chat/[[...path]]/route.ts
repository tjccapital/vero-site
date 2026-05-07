import { NextRequest, NextResponse } from "next/server"
import { auth0 } from "@/lib/auth0"
import { MCP_BASE } from "@/lib/api-base"

// Proxy for the AI chat endpoints served by the MCP host
// (see vero-mobile/src/services/chatApi.ts):
//   POST   /api/chat
//   GET    /api/chat/history
//   DELETE /api/chat/clear
//
// Mirrors the same minimal-header shape used by the other proxy routes:
// the user's Auth0 access token is attached server-side, browser fingerprint
// headers are stripped, and the upstream response is forwarded as-is. Optional
// catch-all so a bare /api/chat (the message-send endpoint) routes here.
async function proxy(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> }
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

  const suffix = path && path.length > 0 ? `/${path.join("/")}` : ""
  const targetUrl = `${MCP_BASE}/api/chat${suffix}${request.nextUrl.search}`

  const headers = new Headers()
  headers.set("authorization", `Bearer ${accessToken}`)
  headers.set("accept", "application/json")
  headers.set("user-agent", "vero-web/1.0")

  let body: ArrayBuffer | undefined
  if (request.method !== "GET" && request.method !== "HEAD") {
    const buf = await request.arrayBuffer()
    if (buf.byteLength > 0) {
      body = buf
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
