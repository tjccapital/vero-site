"use client"

import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  Loader2,
  PanelLeft,
  PanelLeftClose,
  Plus,
  Search,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  ChatMessage,
  clearChatHistory,
  fetchChatHistory,
  sendChatMessage,
} from "@/lib/chat"
import {
  StoredConversation,
  StoredMessage,
  deleteConversation,
  deriveTitle,
  getActiveConversationId,
  getConversation,
  listConversations,
  makeConversationId,
  setActiveConversationId,
  upsertConversation,
} from "@/lib/chat-conversations"

// Chat with Vero AI. The MCP backend persists a single conversation per user;
// we layer a multi-conversation sidebar on top by snapshotting messages into
// localStorage. Switching conversations clears the server thread and replays
// the snapshot in the UI — the AI loses server-side context for archived
// chats, but the user keeps a navigable history.

interface DisplayMessage {
  id: string
  role: "user" | "assistant" | "loading" | "error"
  text: string
  timestamp: number
}

const SUGGESTIONS = [
  "How much did I spend on food this month?",
  "Who are my top merchants?",
  "Any unusual charges recently?",
  "What were my biggest purchases last week?",
]

function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function fromHistory(messages: ChatMessage[]): DisplayMessage[] {
  return messages.map((m, i) => ({
    id: `hist-${i}-${m.created_at || ""}`,
    role: m.role,
    text: m.content,
    timestamp: m.created_at ? new Date(m.created_at).getTime() : Date.now(),
  }))
}

function toStored(messages: DisplayMessage[]): StoredMessage[] {
  return messages
    .filter((m) => m.role === "user" || m.role === "assistant" || m.role === "error")
    .map((m) => ({
      id: m.id,
      role: m.role as StoredMessage["role"],
      text: m.text,
      timestamp: m.timestamp,
    }))
}

function fromStored(messages: StoredMessage[]): DisplayMessage[] {
  return messages.map((m) => ({
    id: m.id,
    role: m.role,
    text: m.text,
    timestamp: m.timestamp,
  }))
}

// Render a chat string with bare URL detection. We keep this intentionally
// small (no full markdown) — anything fancier should be added when we know
// what the model actually emits.
function MessageText({ text }: { text: string }) {
  const parts = useMemo(() => {
    const regex = /(https?:\/\/[^\s)]+)/g
    const out: Array<{ type: "text" | "link"; value: string }> = []
    let lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        out.push({ type: "text", value: text.slice(lastIndex, match.index) })
      }
      out.push({ type: "link", value: match[0] })
      lastIndex = match.index + match[0].length
    }
    if (lastIndex < text.length) {
      out.push({ type: "text", value: text.slice(lastIndex) })
    }
    return out
  }, [text])

  return (
    <>
      {parts.map((p, i) =>
        p.type === "link" ? (
          <a
            key={i}
            href={p.value}
            target="_blank"
            rel="noreferrer"
            className="underline text-blue-600 hover:text-blue-700 break-words"
          >
            {p.value}
          </a>
        ) : (
          <span key={i}>{p.value}</span>
        )
      )}
    </>
  )
}

export default function ConsumerChatPage() {
  const [messages, setMessages] = useState<DisplayMessage[]>([])
  const [conversations, setConversations] = useState<StoredConversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [search, setSearch] = useState("")
  const [sending, setSending] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [switching, setSwitching] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const activeIdRef = useRef<string | null>(null)
  activeIdRef.current = activeId

  // Refresh the sidebar list from localStorage. Called whenever the active
  // conversation's messages change or after switch/delete operations.
  const refreshConversations = useCallback(() => {
    setConversations(listConversations())
  }, [])

  // Mount: read the conversation list and reconcile the live server thread
  // with whichever conversation is marked active in localStorage.
  useEffect(() => {
    const stored = listConversations()
    setConversations(stored)
    const storedActiveId = getActiveConversationId()
    const controller = new AbortController()

    fetchChatHistory(controller.signal)
      .then((res) => {
        if (controller.signal.aborted) return
        const serverMsgs = fromHistory(res.messages || [])

        // Pick which local conversation the server thread belongs to. Prefer
        // the explicitly-marked active id; if none, reuse the most recent
        // local conversation; otherwise create a fresh one.
        let conv: StoredConversation | null = null
        if (storedActiveId) {
          conv = getConversation(storedActiveId)
        }
        if (!conv && stored.length > 0) {
          conv = stored[0]
        }

        if (!conv) {
          if (serverMsgs.length === 0) {
            // Truly empty state — wait until first message before creating
            // a conversation entry.
            setActiveId(null)
            setActiveConversationId(null)
            setMessages([])
            return
          }
          conv = {
            id: makeConversationId(),
            title: "New chat",
            messages: toStored(serverMsgs),
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }
          conv.title = deriveTitle(conv.messages)
          upsertConversation(conv)
        } else if (serverMsgs.length > 0) {
          // Server is the source of truth for the active conversation.
          conv = {
            ...conv,
            messages: toStored(serverMsgs),
            title: conv.title === "New chat" ? deriveTitle(toStored(serverMsgs)) : conv.title,
            updatedAt: Date.now(),
          }
          upsertConversation(conv)
        }

        setActiveId(conv.id)
        setActiveConversationId(conv.id)
        setMessages(serverMsgs.length > 0 ? serverMsgs : fromStored(conv.messages))
        refreshConversations()
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        console.warn("Failed to load chat history:", err)
        // Fall back to whatever we have in localStorage.
        if (storedActiveId) {
          const conv = getConversation(storedActiveId)
          if (conv) {
            setActiveId(conv.id)
            setMessages(fromStored(conv.messages))
          }
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setHistoryLoading(false)
      })

    return () => controller.abort()
  }, [refreshConversations])

  // Persist message changes to the active conversation in localStorage so
  // the sidebar list stays in sync as messages stream in.
  useEffect(() => {
    if (!activeId) return
    const persistable = toStored(messages)
    if (persistable.length === 0) return
    const existing = getConversation(activeId)
    const conv: StoredConversation = {
      id: activeId,
      title:
        existing?.title && existing.title !== "New chat"
          ? existing.title
          : deriveTitle(persistable),
      messages: persistable,
      createdAt: existing?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
    }
    upsertConversation(conv)
    refreshConversations()
  }, [messages, activeId, refreshConversations])

  // Auto-scroll to the bottom whenever the message list grows.
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages.length, sending])

  // Auto-grow the textarea up to a sensible cap.
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "0px"
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }, [input])

  const submitMessage = useCallback(
    async (raw: string) => {
      const text = raw.trim()
      if (!text || sending || switching) return

      // First message in an empty state needs a fresh conversation entry so
      // subsequent persistence has somewhere to go.
      let convId = activeIdRef.current
      if (!convId) {
        convId = makeConversationId()
        setActiveId(convId)
        setActiveConversationId(convId)
        activeIdRef.current = convId
      }

      const userMsg: DisplayMessage = {
        id: makeId(),
        role: "user",
        text,
        timestamp: Date.now(),
      }
      const loadingMsg: DisplayMessage = {
        id: makeId(),
        role: "loading",
        text: "",
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, userMsg, loadingMsg])
      setInput("")
      setSending(true)

      try {
        const res = await sendChatMessage(text)
        setMessages((prev) =>
          prev.map((m) =>
            m.id === loadingMsg.id
              ? {
                  id: loadingMsg.id,
                  role: "assistant",
                  text: res.response,
                  timestamp: Date.now(),
                }
              : m
          )
        )
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Something went wrong. Please try again."
        setMessages((prev) =>
          prev.map((m) =>
            m.id === loadingMsg.id
              ? { id: loadingMsg.id, role: "error", text: message, timestamp: Date.now() }
              : m
          )
        )
      } finally {
        setSending(false)
      }
    },
    [sending, switching]
  )

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    submitMessage(input)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      submitMessage(input)
    }
  }

  // Snapshot the current conversation, clear the server thread, and switch
  // active state to the target. Used by both "New chat" and clicking an
  // archived conversation in the sidebar.
  const switchToConversation = useCallback(
    async (targetId: string | null) => {
      if (switching || sending) return
      if (targetId && targetId === activeIdRef.current) {
        setMobileSidebarOpen(false)
        return
      }
      setSwitching(true)
      try {
        // The current view's messages are already mirrored to localStorage
        // by the persistence effect — no extra snapshot needed here.
        await clearChatHistory()
      } catch (err) {
        console.warn("Failed to clear server chat thread:", err)
      }

      if (targetId) {
        const conv = getConversation(targetId)
        if (conv) {
          setActiveId(conv.id)
          setActiveConversationId(conv.id)
          setMessages(fromStored(conv.messages))
        } else {
          setActiveId(null)
          setActiveConversationId(null)
          setMessages([])
        }
      } else {
        // New chat — leave the active id null until the first message lands,
        // matching the "How can I help today?" empty state.
        setActiveId(null)
        setActiveConversationId(null)
        setMessages([])
      }
      refreshConversations()
      setMobileSidebarOpen(false)
      setSwitching(false)
    },
    [switching, sending, refreshConversations]
  )

  const handleNewChat = useCallback(() => {
    void switchToConversation(null)
  }, [switchToConversation])

  const handleSelectConversation = useCallback(
    (id: string) => {
      void switchToConversation(id)
    },
    [switchToConversation]
  )

  const handleDeleteConversation = useCallback(
    async (id: string) => {
      if (switching || sending) return
      const ok =
        typeof window !== "undefined"
          ? window.confirm("Delete this conversation? This cannot be undone.")
          : true
      if (!ok) return
      const wasActive = id === activeIdRef.current
      deleteConversation(id)
      if (wasActive) {
        try {
          await clearChatHistory()
        } catch (err) {
          console.warn("Failed to clear server chat thread:", err)
        }
        setActiveId(null)
        setActiveConversationId(null)
        setMessages([])
      }
      refreshConversations()
    },
    [switching, sending, refreshConversations]
  )

  const filteredConversations = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return conversations
    return conversations.filter((c) => {
      if (c.title.toLowerCase().includes(q)) return true
      return c.messages.some((m) => m.text.toLowerCase().includes(q))
    })
  }, [conversations, search])

  const showWelcome = !historyLoading && messages.length === 0
  const activeTitle =
    (activeId && conversations.find((c) => c.id === activeId)?.title) ||
    (messages.length > 0 ? deriveTitle(toStored(messages)) : "New chat")

  return (
    <div className="flex h-full min-h-0">
      {/* Desktop conversation sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-[var(--border)] bg-white transition-all duration-200",
          sidebarOpen ? "w-72" : "w-0 border-r-0 overflow-hidden"
        )}
      >
        <ConversationSidebar
          title="Vero AI"
          conversations={filteredConversations}
          activeId={activeId}
          search={search}
          onSearchChange={setSearch}
          onNewChat={handleNewChat}
          onSelect={handleSelectConversation}
          onDelete={handleDeleteConversation}
          onCollapse={() => setSidebarOpen(false)}
          disabled={switching || sending}
        />
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileSidebarOpen && (
        <>
          <button
            type="button"
            aria-label="Close conversations"
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-80 max-w-[85vw] bg-white shadow-xl"
          >
            <ConversationSidebar
              title="Vero AI"
              conversations={filteredConversations}
              activeId={activeId}
              search={search}
              onSearchChange={setSearch}
              onNewChat={handleNewChat}
              onSelect={handleSelectConversation}
              onDelete={handleDeleteConversation}
              onCollapse={() => setMobileSidebarOpen(false)}
              disabled={switching || sending}
            />
          </div>
        </>
      )}

      {/* Chat pane */}
      <div className="flex flex-1 flex-col min-w-0 px-4 sm:px-6 py-4">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col min-h-0">
          <div className="flex items-center justify-between gap-2 pb-3">
            <div className="flex items-center gap-2 min-w-0">
              {!sidebarOpen && (
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="hidden lg:flex items-center justify-center rounded-md p-1.5 hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
                  title="Show conversations"
                >
                  <PanelLeft className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden flex items-center justify-center rounded-md p-1.5 hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
                title="Show conversations"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--muted)]">
                <Sparkles className="h-4 w-4 text-[var(--foreground)]" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold leading-tight">
                  {activeTitle}
                </h1>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Ask about your transactions, receipts, and spending.
                </p>
              </div>
            </div>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 min-h-0 overflow-y-auto rounded-lg border border-[var(--border)] bg-white px-3 py-4 sm:px-4"
          >
            {historyLoading && messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin text-[var(--muted-foreground)]" />
              </div>
            ) : showWelcome ? (
              <div className="flex h-full flex-col items-center justify-center gap-6 px-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--muted)]">
                  <Sparkles className="h-5 w-5 text-[var(--foreground)]" />
                </div>
                <div>
                  <p className="text-base font-medium">How can I help today?</p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    Try one of these to get started.
                  </p>
                </div>
                <div className="flex w-full max-w-md flex-col gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => submitMessage(s)}
                      className="rounded-md border border-[var(--border)] px-3 py-2 text-left text-sm text-[var(--foreground)] hover:bg-[var(--muted)]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <ul className="space-y-3">
                {messages.map((m) => (
                  <li
                    key={m.id}
                    className={cn(
                      "flex",
                      m.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-sm",
                        m.role === "user" &&
                          "bg-[var(--primary)] text-[var(--primary-foreground)]",
                        m.role === "assistant" &&
                          "bg-[var(--muted)] text-[var(--foreground)]",
                        m.role === "loading" &&
                          "bg-[var(--muted)] text-[var(--muted-foreground)]",
                        m.role === "error" &&
                          "bg-red-50 text-red-700 border border-red-200"
                      )}
                    >
                      {m.role === "loading" ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                          <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                          <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
                        </span>
                      ) : (
                        <MessageText text={m.text} />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form onSubmit={handleSubmit} className="pt-3">
            <div className="flex items-end gap-2 rounded-lg border border-[var(--border)] bg-white px-2 py-2 focus-within:ring-2 focus-within:ring-[var(--ring)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--background)]">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about a transaction, a merchant, or your spending…"
                disabled={sending || switching}
                className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm leading-snug outline-none placeholder:text-[var(--muted-foreground)] disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || sending || switching}
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors",
                  "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90",
                  "disabled:opacity-40 disabled:pointer-events-none"
                )}
                aria-label="Send"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="pt-1.5 text-[11px] text-[var(--muted-foreground)]">
              Press Enter to send, Shift+Enter for a new line.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

interface ConversationSidebarProps {
  title: string
  conversations: StoredConversation[]
  activeId: string | null
  search: string
  onSearchChange: (v: string) => void
  onNewChat: () => void
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onCollapse: () => void
  disabled?: boolean
}

function ConversationSidebar({
  title,
  conversations,
  activeId,
  search,
  onSearchChange,
  onNewChat,
  onSelect,
  onDelete,
  onCollapse,
  disabled,
}: ConversationSidebarProps) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">{title}</h2>
        <button
          type="button"
          onClick={onCollapse}
          className="flex items-center justify-center rounded-md p-1 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
          title="Hide conversations"
          aria-label="Hide conversations"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-1 px-3">
        <button
          type="button"
          onClick={onNewChat}
          disabled={disabled}
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-[var(--foreground)] transition-colors",
            "hover:bg-[var(--muted)] disabled:opacity-50 disabled:pointer-events-none"
          )}
        >
          <Plus className="h-4 w-4 text-[var(--muted-foreground)]" />
          New chat
        </button>
        <div className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)]">
          <Search className="h-4 w-4 flex-shrink-0" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search chats"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted-foreground)] text-[var(--foreground)]"
          />
        </div>
      </div>

      <div className="mt-3 px-5 pb-2 text-[11px] font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
        Recent chats
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {conversations.length === 0 ? (
          <p className="px-2 py-2 text-xs text-[var(--muted-foreground)]">
            {search ? "No matches." : "Your chats will appear here."}
          </p>
        ) : (
          <ul className="space-y-0.5">
            {conversations.map((c) => {
              const active = c.id === activeId
              return (
                <li key={c.id} className="min-w-0">
                  <div
                    className={cn(
                      "group flex min-w-0 items-center gap-1 rounded-md transition-colors",
                      active
                        ? "bg-[var(--muted)]"
                        : "hover:bg-[var(--muted)]"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => onSelect(c.id)}
                      disabled={disabled}
                      title={c.title}
                      className={cn(
                        "min-w-0 flex-1 truncate px-2 py-2 text-left text-sm text-[var(--foreground)]",
                        "disabled:opacity-50 disabled:pointer-events-none"
                      )}
                    >
                      {c.title}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(c.id)
                      }}
                      disabled={disabled}
                      title="Delete conversation"
                      aria-label="Delete conversation"
                      className={cn(
                        "mr-1 hidden rounded p-1 text-[var(--muted-foreground)] hover:text-red-600 group-hover:flex",
                        "disabled:opacity-50 disabled:pointer-events-none"
                      )}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </nav>
    </div>
  )
}
