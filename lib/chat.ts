// Thin wrappers around the /api/chat/* proxy routes (which forward to the
// MCP host with an Auth0 bearer token attached server-side). Mirrors the
// shape of vero-mobile/src/services/chatApi.ts so both clients agree on
// types and conversation semantics.

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
  created_at: string
}

export interface ChatHistoryResponse {
  id?: string
  user_id?: string
  messages: ChatMessage[]
  previous_response_id?: string | null
}

export interface ChatSendResponse {
  response: string
}

async function readError(res: Response): Promise<string> {
  const text = await res.text().catch(() => "")
  return text || res.statusText || `HTTP ${res.status}`
}

export async function fetchChatHistory(
  signal?: AbortSignal
): Promise<ChatHistoryResponse> {
  const res = await fetch("/api/chat/history", {
    method: "GET",
    headers: { accept: "application/json" },
    signal,
  })
  if (!res.ok) {
    throw new Error(`GET /api/chat/history failed (${res.status}): ${await readError(res)}`)
  }
  return (await res.json()) as ChatHistoryResponse
}

export async function sendChatMessage(
  message: string,
  signal?: AbortSignal
): Promise<ChatSendResponse> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ message }),
    signal,
  })
  if (!res.ok) {
    throw new Error(`POST /api/chat failed (${res.status}): ${await readError(res)}`)
  }
  return (await res.json()) as ChatSendResponse
}

export async function clearChatHistory(signal?: AbortSignal): Promise<void> {
  const res = await fetch("/api/chat/clear", {
    method: "DELETE",
    headers: { accept: "application/json" },
    signal,
  })
  if (!res.ok) {
    throw new Error(`DELETE /api/chat/clear failed (${res.status}): ${await readError(res)}`)
  }
}
