// Single source of truth for the upstream Vero API base URL used by the
// server-side proxy routes under app/api/*. Every outbound call must hit the
// `api.veroreceipts.com` host — never the marketing root `veroreceipts.com`,
// which would loop back into this Next.js app.
//
// Env vars (in order of precedence):
//   VERO_API_BASE_URL          — server-only override
//   NEXT_PUBLIC_API_BASE_URL   — shared with the client build
//
// If either env var is set to a bare `veroreceipts.com` host (a common typo),
// we transparently rewrite it to `api.veroreceipts.com` so the proxy can't
// accidentally forward requests back to itself.

const DEFAULT_API_BASE = "https://api.veroreceipts.com"
const DEFAULT_MCP_BASE = "https://mcp.veroreceipts.com"

function normalize(raw: string | undefined, fallback: string): string {
  if (!raw) return fallback
  const trimmed = raw.trim().replace(/\/+$/, "")
  if (!trimmed) return fallback
  try {
    const url = new URL(trimmed)
    if (url.hostname === "veroreceipts.com" || url.hostname === "www.veroreceipts.com") {
      url.hostname = "api.veroreceipts.com"
    }
    return url.origin + (url.pathname === "/" ? "" : url.pathname)
  } catch {
    return fallback
  }
}

export const API_BASE: string = normalize(
  process.env.VERO_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL,
  DEFAULT_API_BASE
)

// The MCP host serves the AI chat endpoints (see vero-mobile's
// src/services/chatApi.ts). It's a separate origin from the main API.
export const MCP_BASE: string = normalize(
  process.env.VERO_MCP_BASE_URL || process.env.NEXT_PUBLIC_MCP_BASE_URL,
  DEFAULT_MCP_BASE
)
