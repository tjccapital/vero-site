"use client"

import {
  FormEvent,
  KeyboardEvent,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowUpRight,
  ExternalLink,
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
  ConversationSummary,
  deleteThread,
  fetchChatHistory,
  getThreads,
  sendChatMessage,
} from "@/lib/chat"

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

type Token =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "link"; raw: string; label?: string }

// Tokenize a chat string into markdown links ([label](url)), bold (**text**),
// bare URLs, and plain text. Kept deliberately small — the assistant only
// emits these inline constructs.
function tokenize(text: string): Token[] {
  const pattern =
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\*\*([^*]+?)\*\*|(https?:\/\/[^\s)]+)/g
  const out: Token[] = []
  let last = 0
  let m: RegExpExecArray | null
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) out.push({ type: "text", value: text.slice(last, m.index) })
    if (m[1] !== undefined && m[2] !== undefined) {
      out.push({ type: "link", raw: m[2], label: m[1] })
    } else if (m[3] !== undefined) {
      out.push({ type: "bold", value: m[3] })
    } else if (m[4] !== undefined) {
      out.push({ type: "link", raw: m[4] })
    }
    last = m.index + m[0].length
  }
  if (last < text.length) out.push({ type: "text", value: text.slice(last) })
  return out
}

// Resolve a raw URL into something we can render: links back to our own
// dashboard become app-relative (rewriting the legacy /consumer prefix) and
// open in-app; everything else (e.g. signed receipt-image URLs) opens in a new
// tab. A friendly label is derived when the markdown didn't supply one.
function resolveLink(rawHref: string, label?: string): {
  href: string
  label: string
  internal: boolean
} {
  try {
    const u = new URL(rawHref, "https://veroreceipts.com")
    const isVero =
      u.hostname === "veroreceipts.com" || u.hostname.endsWith(".veroreceipts.com")
    if (isVero) {
      const path = u.pathname.replace(/^\/consumer(?=\/|$)/, "/user-dashboard")
      const isTx = /\/transactions\//.test(path)
      return {
        href: `${path}${u.search}`,
        label: label || (isTx ? "View transaction" : "Open in Vero"),
        internal: true,
      }
    }
  } catch {
    // fall through to the raw href
  }
  return { href: rawHref, label: label || "View receipt", internal: false }
}

function MessageLink({ raw, label }: { raw: string; label?: string }) {
  const link = resolveLink(raw, label)
  const Icon = link.internal ? ArrowUpRight : ExternalLink
  const className =
    "inline-flex items-center gap-0.5 font-medium underline underline-offset-2 hover:opacity-80 break-words"
  const inner = (
    <>
      {link.label}
      <Icon className="h-3 w-3 flex-shrink-0" />
    </>
  )
  if (link.internal) {
    return (
      <Link href={link.href} className={className}>
        {inner}
      </Link>
    )
  }
  return (
    <a href={link.href} target="_blank" rel="noreferrer" className={className}>
      {inner}
    </a>
  )
}

// Render a chat string with markdown links, bold, and bare-URL detection.
function MessageText({ text }: { text: string }) {
  const tokens = useMemo(() => tokenize(text), [text])
  return (
    <>
      {tokens.map((t, i) => {
        if (t.type === "link") return <MessageLink key={i} raw={t.raw} label={t.label} />
        if (t.type === "bold") return <strong key={i}>{t.value}</strong>
        return <span key={i}>{t.value}</span>
      })}
    </>
  )
}

function ConsumerChatPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<DisplayMessage[]>([])
  const [threads, setThreads] = useState<ConversationSummary[]>([])
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [search, setSearch] = useState("")
  const [sending, setSending] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [switching, setSwitching] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const activeConversationIdRef = useRef<string | null>(null)
  activeConversationIdRef.current = activeConversationId

  // Load thread list and most-recent thread's history on mount — unless we
  // arrived via the sidebar Chat icon (?new), in which case we start fresh.
  useEffect(() => {
    const startNew = searchParams.get("new") != null
    const controller = new AbortController()

    getThreads(controller.signal)
      .then(async (list) => {
        if (controller.signal.aborted) return
        setThreads(list)
        if (!startNew && list.length > 0) {
          const first = list[0]
          const history = await fetchChatHistory(first.id, controller.signal)
          if (controller.signal.aborted) return
          setMessages(fromHistory(history.messages || []))
          setActiveConversationId(first.id)
        }
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        console.warn("Failed to load chat threads:", err)
      })
      .finally(() => {
        if (!controller.signal.aborted) setHistoryLoading(false)
      })

    return () => controller.abort()
    // Mount-only: the ?new reset is handled by the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Whenever we land here with ?new (sidebar Chat icon), clear the conversation
  // to a blank slate and strip the param so refresh/back don't re-trigger it.
  useEffect(() => {
    if (searchParams.get("new") == null) return
    setActiveConversationId(null)
    activeConversationIdRef.current = null
    setMessages([])
    setHistoryLoading(false)
    setMobileSidebarOpen(false)
    router.replace("/user-dashboard/chat")
  }, [searchParams, router])

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

  const refreshThreads = useCallback(async () => {
    try {
      const list = await getThreads()
      setThreads(list)
    } catch (err) {
      console.warn("Failed to refresh thread list:", err)
    }
  }, [])

  const submitMessage = useCallback(
    async (raw: string) => {
      const text = raw.trim()
      if (!text || sending || switching) return

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
        const res = await sendChatMessage(text, activeConversationIdRef.current ?? undefined)

        // If this was a new thread, the server created one — update active ID.
        if (res.conversationId !== activeConversationIdRef.current) {
          setActiveConversationId(res.conversationId)
          activeConversationIdRef.current = res.conversationId
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === loadingMsg.id
              ? { id: loadingMsg.id, role: "assistant", text: res.response, timestamp: Date.now() }
              : m
          )
        )

        // Refresh sidebar to show the new/updated thread (title may have changed).
        await refreshThreads()
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
    [sending, switching, refreshThreads]
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

  const handleNewChat = useCallback(() => {
    if (switching || sending) return
    setActiveConversationId(null)
    setMessages([])
    setMobileSidebarOpen(false)
  }, [switching, sending])

  const handleSelectConversation = useCallback(
    async (id: string) => {
      if (switching || sending) return
      if (id === activeConversationIdRef.current) {
        setMobileSidebarOpen(false)
        return
      }
      setSwitching(true)
      try {
        const history = await fetchChatHistory(id)
        setMessages(fromHistory(history.messages || []))
        setActiveConversationId(id)
      } catch (err) {
        console.warn("Failed to load thread history:", err)
      } finally {
        setSwitching(false)
        setMobileSidebarOpen(false)
      }
    },
    [switching, sending]
  )

  const handleDeleteThread = useCallback(
    async (id: string) => {
      if (switching || sending) return
      const ok =
        typeof window !== "undefined"
          ? window.confirm("Delete this conversation? This cannot be undone.")
          : true
      if (!ok) return
      try {
        await deleteThread(id)
        setThreads((prev) => prev.filter((t) => t.id !== id))
        if (id === activeConversationIdRef.current) {
          setActiveConversationId(null)
          setMessages([])
        }
      } catch (err) {
        console.warn("Failed to delete thread:", err)
      }
    },
    [switching, sending]
  )

  const filteredThreads = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return threads
    return threads.filter((t) => t.title.toLowerCase().includes(q))
  }, [threads, search])

  const showWelcome = !historyLoading && messages.length === 0
  const activeTitle =
    (activeConversationId && threads.find((t) => t.id === activeConversationId)?.title) ||
    "New chat"

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
          threads={filteredThreads}
          activeId={activeConversationId}
          search={search}
          onSearchChange={setSearch}
          onNewChat={handleNewChat}
          onSelect={handleSelectConversation}
          onDelete={handleDeleteThread}
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
              threads={filteredThreads}
              activeId={activeConversationId}
              search={search}
              onSearchChange={setSearch}
              onNewChat={handleNewChat}
              onSelect={handleSelectConversation}
              onDelete={handleDeleteThread}
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
            {historyLoading ? (
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

export default function ConsumerChatPage() {
  return (
    <Suspense fallback={null}>
      <ConsumerChatPageInner />
    </Suspense>
  )
}

interface ConversationSidebarProps {
  title: string
  threads: ConversationSummary[]
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
  threads,
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
        {threads.length === 0 ? (
          <p className="px-2 py-2 text-xs text-[var(--muted-foreground)]">
            {search ? "No matches." : "Your chats will appear here."}
          </p>
        ) : (
          <ul className="space-y-0.5">
            {threads.map((t) => {
              const active = t.id === activeId
              return (
                <li key={t.id} className="min-w-0">
                  <div
                    className={cn(
                      "group flex min-w-0 items-center gap-1 rounded-md transition-colors",
                      active ? "bg-[var(--muted)]" : "hover:bg-[var(--muted)]"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => onSelect(t.id)}
                      disabled={disabled}
                      title={t.title}
                      className={cn(
                        "min-w-0 flex-1 truncate px-2 py-2 text-left text-sm text-[var(--foreground)]",
                        "disabled:opacity-50 disabled:pointer-events-none"
                      )}
                    >
                      {t.title}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(t.id)
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
