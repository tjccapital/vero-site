import { NextRequest, NextResponse } from "next/server"
import { auth0 } from "@/lib/auth0"
import { API_BASE } from "@/lib/api-base"

// Mirrors app/api/plaid/[...path]/route.ts and app/api/transactions/[[...path]]/route.ts.
// Forwards /api/receipts/* calls (notably /api/receipts/:id/items) to the
// Vero backend with a server-issued Auth0 bearer token. Header shape
// matches vero-mobile's apiClient to avoid WAF false-positives on
// datacenter source IPs.
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

  const targetUrl = `${API_BASE}/api/receipts/${path.join("/")}${request.nextUrl.search}`

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
