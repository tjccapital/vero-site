// Client-side store for multi-conversation chat history.
//
// The MCP backend persists exactly one conversation per user. We layer a
// "conversation list" on top of that single live thread by snapshotting
// messages into localStorage. Switching conversations clears the server
// thread and replays the snapshot in the UI; the AI loses prior server-side
// context, but users keep a navigable history of past chats.

export interface StoredMessage {
  id: string
  role: "user" | "assistant" | "error"
  text: string
  timestamp: number
}

export interface StoredConversation {
  id: string
  title: string
  messages: StoredMessage[]
  createdAt: number
  updatedAt: number
}

const STORAGE_KEY = "vero.consumerChat.conversations.v1"
const ACTIVE_KEY = "vero.consumerChat.activeId.v1"

interface StoreShape {
  conversations: Record<string, StoredConversation>
  order: string[] // most-recent-first
}

function emptyStore(): StoreShape {
  return { conversations: {}, order: [] }
}

function readStore(): StoreShape {
  if (typeof window === "undefined") return emptyStore()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw) as StoreShape
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !parsed.conversations ||
      !Array.isArray(parsed.order)
    ) {
      return emptyStore()
    }
    return parsed
  } catch {
    return emptyStore()
  }
}

function writeStore(store: StoreShape): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // Quota or disabled storage — non-fatal.
  }
}

export function makeConversationId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `c-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function listConversations(): StoredConversation[] {
  const store = readStore()
  return store.order
    .map((id) => store.conversations[id])
    .filter((c): c is StoredConversation => Boolean(c))
}

export function getConversation(id: string): StoredConversation | null {
  const store = readStore()
  return store.conversations[id] ?? null
}

export function upsertConversation(conv: StoredConversation): void {
  const store = readStore()
  store.conversations[conv.id] = conv
  const without = store.order.filter((id) => id !== conv.id)
  store.order = [conv.id, ...without]
  writeStore(store)
}

export function deleteConversation(id: string): void {
  const store = readStore()
  delete store.conversations[id]
  store.order = store.order.filter((x) => x !== id)
  writeStore(store)
}

export function clearAllConversations(): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
    window.localStorage.removeItem(ACTIVE_KEY)
  } catch {
    // ignore
  }
}

export function getActiveConversationId(): string | null {
  if (typeof window === "undefined") return null
  try {
    return window.localStorage.getItem(ACTIVE_KEY)
  } catch {
    return null
  }
}

export function setActiveConversationId(id: string | null): void {
  if (typeof window === "undefined") return
  try {
    if (id === null) {
      window.localStorage.removeItem(ACTIVE_KEY)
    } else {
      window.localStorage.setItem(ACTIVE_KEY, id)
    }
  } catch {
    // ignore
  }
}

// Derive a short title from the first user message, falling back to a
// generic label so the sidebar always has something to show.
export function deriveTitle(messages: StoredMessage[]): string {
  const firstUser = messages.find((m) => m.role === "user")
  if (!firstUser) return "New chat"
  const trimmed = firstUser.text.trim().replace(/\s+/g, " ")
  if (!trimmed) return "New chat"
  return trimmed.length > 48 ? `${trimmed.slice(0, 48)}…` : trimmed
}
