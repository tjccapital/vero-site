// Thin wrappers around the /api/chat/* proxy routes (which forward to the
// MCP host with an Auth0 bearer token attached server-side).

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
  created_at: string
}

export interface ChatHistoryResponse {
  id?: string
  user_id?: string
  title?: string
  messages: ChatMessage[]
  previous_response_id?: string | null
}

export interface ChatSendResponse {
  response: string
  conversationId: string
}

export interface ConversationSummary {
  id: string
  title: string
  updated_at: string
}

async function readError(res: Response): Promise<string> {
  const text = await res.text().catch(() => "")
  return text || res.statusText || `HTTP ${res.status}`
}

export async function getThreads(signal?: AbortSignal): Promise<ConversationSummary[]> {
  const res = await fetch("/api/chat/threads", {
    method: "GET",
    headers: { accept: "application/json" },
    signal,
  })
  if (!res.ok) {
    throw new Error(`GET /api/chat/threads failed (${res.status}): ${await readError(res)}`)
  }
  return (await res.json()) as ConversationSummary[]
}

export async function fetchChatHistory(
  conversationId: string,
  signal?: AbortSignal
): Promise<ChatHistoryResponse> {
  const res = await fetch(`/api/chat/history?conversationId=${encodeURIComponent(conversationId)}`, {
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
  conversationId?: string,
  signal?: AbortSignal
): Promise<ChatSendResponse> {
  const body: Record<string, string> = { message }
  if (conversationId) body.conversationId = conversationId

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
    signal,
  })
  if (!res.ok) {
    throw new Error(`POST /api/chat failed (${res.status}): ${await readError(res)}`)
  }
  return (await res.json()) as ChatSendResponse
}

export async function deleteThread(conversationId: string, signal?: AbortSignal): Promise<void> {
  const res = await fetch(`/api/chat/clear?conversationId=${encodeURIComponent(conversationId)}`, {
    method: "DELETE",
    headers: { accept: "application/json" },
    signal,
  })
  if (!res.ok) {
    throw new Error(`DELETE /api/chat/clear failed (${res.status}): ${await readError(res)}`)
  }
}
