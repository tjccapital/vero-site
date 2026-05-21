"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { fetchTransactions, refreshTransactions } from "@/lib/transactions"
import type { Transaction } from "@/lib/transactions"

// 30s client-side debounce. The server enforces a separate 30-minute per-Item
// cooldown on the billable refresh — this just stops rapid double-clicks from
// firing duplicate requests over the wire.
const CLIENT_DEBOUNCE_MS = 30_000

interface RefreshButtonProps {
  // Called with the fresh transactions after refresh+fetch succeed. The page
  // owns the transactions list; this component just orchestrates the calls
  // and surfaces UI state.
  onResult: (transactions: Transaction[]) => void
  // Optional: called whether refresh succeeded or failed. Page can use this
  // to flip its loading flag.
  onSettled?: () => void
  className?: string
}

// Mirrors the mobile explicit refresh button on the Transactions screen.
// Always does a two-call POST /refresh + GET /transactions sequence so the
// page always ends up with the latest cache state — even if the server-side
// per-Item cooldown skipped the actual Plaid refresh.
export function RefreshButton({
  onResult,
  onSettled,
  className,
}: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null)
  // Force a re-render every minute so "Last updated X min ago" stays accurate.
  const [, setNowTick] = useState(0)
  const lastClickRef = useRef<number>(0)

  useEffect(() => {
    if (!lastUpdatedAt) return
    const t = setInterval(() => setNowTick((n) => n + 1), 60_000)
    return () => clearInterval(t)
  }, [lastUpdatedAt])

  const debounced = Date.now() - lastClickRef.current < CLIENT_DEBOUNCE_MS

  const onClick = useCallback(async () => {
    const now = Date.now()
    if (now - lastClickRef.current < CLIENT_DEBOUNCE_MS) return
    lastClickRef.current = now

    setIsRefreshing(true)
    try {
      try {
        await refreshTransactions()
      } catch (refreshErr) {
        // Non-fatal — the GET below still reads the latest cache state.
        console.warn("[Refresh] /refresh failed:", refreshErr)
      }
      const res = await fetchTransactions()
      onResult(res.transactions ?? [])
      setLastUpdatedAt(Date.now())
    } catch (err) {
      console.error("[Refresh] fetch failed:", err)
    } finally {
      setIsRefreshing(false)
      onSettled?.()
    }
  }, [onResult, onSettled])

  const label = (() => {
    if (isRefreshing) return "Updating from bank…"
    if (!lastUpdatedAt) return null
    const seconds = Math.floor((Date.now() - lastUpdatedAt) / 1000)
    if (seconds < 60) return "Just now"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `Last updated ${minutes} min ago`
    const hours = Math.floor(minutes / 60)
    return `Last updated ${hours} hr ago`
  })()

  const tooltip = isRefreshing
    ? "Asking your bank for the latest transactions…"
    : debounced
    ? "Already up to date — try again in a moment"
    : "Pull the latest transactions directly from your bank"

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label && (
        <span className="text-xs text-[var(--muted-foreground)] hidden sm:inline">
          {label}
        </span>
      )}
      {/* Tooltip wrapper. We render our own tooltip rather than relying on the
          browser's native `title` attribute, because browsers suppress title
          tooltips on disabled buttons — and this button is disabled while
          refreshing or within the debounce window, which are the exact moments
          we want to explain. group-hover keeps it pure CSS. */}
      <div className="group relative">
        <button
          type="button"
          onClick={onClick}
          disabled={isRefreshing || debounced}
          aria-label={tooltip}
          className={cn(
            "inline-flex h-9 w-9 items-center justify-center rounded-md",
            "border border-[var(--border)] bg-white text-[var(--foreground)]",
            "transition-colors hover:bg-[var(--muted)]",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        >
          <RefreshCw
            className={cn("h-4 w-4", isRefreshing && "animate-spin")}
          />
        </button>
        <div
          role="tooltip"
          className={cn(
            "pointer-events-none absolute right-0 top-full z-10 mt-2",
            "whitespace-nowrap rounded-md bg-[var(--foreground)] px-2.5 py-1.5",
            "text-xs font-normal text-white shadow-lg",
            "opacity-0 translate-y-[-2px] transition-all duration-150",
            "group-hover:opacity-100 group-hover:translate-y-0",
            "group-focus-within:opacity-100 group-focus-within:translate-y-0"
          )}
        >
          {tooltip}
        </div>
      </div>
    </div>
  )
}
