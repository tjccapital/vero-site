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
import { Loader2, Send, Sparkles, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  ChatMessage,
  clearChatHistory,
  fetchChatHistory,
  sendChatMessage,
} from "@/lib/chat"

// Chat with Vero AI. Mirrors vero-mobile's ChatScreen — non-streaming,
// server-persisted history (one conversation per user, fetched on mount and
// refetched after a clear). A sessionStorage cache makes navigation back to
// /consumer/chat feel instant; the network fetch refreshes in the background.

interface DisplayMessage {
  id: string
  role: "user" | "assistant" | "loading" | "error"
  text: string
  timestamp: number
}

const SESSION_CACHE_KEY = "vero.consumerChat.messages.v1"

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

function loadCached(): DisplayMessage[] | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.sessionStorage.getItem(SESSION_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as DisplayMessage[]
    if (!Array.isArray(parsed)) return null
    // Drop transient loading/error placeholders if a prior tab left them behind.
    return parsed.filter((m) => m.role === "user" || m.role === "assistant")
  } catch {
    return null
  }
}

function saveCached(messages: DisplayMessage[]): void {
  if (typeof window === "undefined") return
  try {
    const persistable = messages.filter(
      (m) => m.role === "user" || m.role === "assistant"
    )
    window.sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(persistable))
  } catch {
    // Storage may be full or disabled — non-fatal.
  }
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
  const [messages, setMessages] = useState<DisplayMessage[]>(() => loadCached() ?? [])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [clearing, setClearing] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  // Persist messages to sessionStorage as they change, so coming back to the
  // page (or a tab refresh) shows the last view immediately while the server
  // history fetch resolves.
  useEffect(() => {
    saveCached(messages)
  }, [messages])

  // Load server-persisted history on mount.
  useEffect(() => {
    const controller = new AbortController()
    fetchChatHistory(controller.signal)
      .then((res) => {
        if (controller.signal.aborted) return
        setMessages(fromHistory(res.messages || []))
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        console.warn("Failed to load chat history:", err)
      })
      .finally(() => {
        if (!controller.signal.aborted) setHistoryLoading(false)
      })
    return () => controller.abort()
  }, [])

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
      if (!text || sending) return

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
    [sending]
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

  const handleClear = useCallback(async () => {
    if (clearing) return
    const ok =
      typeof window !== "undefined"
        ? window.confirm("Clear your entire chat history? This cannot be undone.")
        : true
    if (!ok) return
    setClearing(true)
    try {
      await clearChatHistory()
      setMessages([])
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(SESSION_CACHE_KEY)
      }
    } catch (err) {
      console.warn("Failed to clear chat history:", err)
    } finally {
      setClearing(false)
    }
  }, [clearing])

  const showWelcome = !historyLoading && messages.length === 0

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--muted)]">
            <Sparkles className="h-4 w-4 text-[var(--foreground)]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">Vero AI</h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              Ask about your transactions, receipts, and spending.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleClear}
          disabled={clearing || messages.length === 0}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors",
            "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
            "disabled:opacity-50 disabled:pointer-events-none"
          )}
          title="Clear chat history"
        >
          {clearing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
          Clear
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-lg border border-[var(--border)] bg-white px-3 py-4 sm:px-4"
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
            disabled={sending}
            className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm leading-snug outline-none placeholder:text-[var(--muted-foreground)] disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={!input.trim() || sending}
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
  )
}
