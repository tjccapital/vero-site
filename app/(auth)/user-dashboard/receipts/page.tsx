"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  FileImage,
  LayoutGrid,
  List,
  Loader2,
  Receipt as ReceiptIcon,
  Search,
  Trash2,
} from "lucide-react"
import { format } from "date-fns"
import { type DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ReceiptDropzone,
  type UploadPhase,
} from "@/components/receipt-dropzone"
import {
  deleteReceipt,
  fetchReceipts,
  promoteDuplicate,
  receiptDate,
  receiptDisplayName,
  receiptImage,
  receiptMatchedTransactionId,
  uploadReceipt,
  type ReceiptFilters,
  type ReceiptListItem,
} from "@/lib/receipts"
import { formatTxShortDate } from "@/lib/category-display"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { LoadMore } from "@/components/ui/load-more"

// One row per in-flight upload. We surface a "Matching…" state for a few
// seconds after the upload succeeds so the user can see that work is still
// happening before the row collapses back into the static receipts list.
interface PendingUpload {
  key: string
  fileName: string
  // 'uploading' → bytes still in flight to the API.
  // 'matching'  → upload done; we're polling the backend for the auto-match.
  // 'done'      → matched (or grace period elapsed) — row is about to be
  //                replaced by the real receipt entry on the next refresh.
  // 'error'     → upload or match failed; user can dismiss.
  phase: "uploading" | "matching" | "done" | "error"
  error?: string
  receiptId?: string
}

// Uploads are async: the backend stores the image and OCRs it in the
// background ("processing" status). We poll the receipt list until the new
// receipt leaves "processing", then fold the pending row away. POLL_TIMEOUT_MS
// caps how long we keep polling before trusting whatever the list shows.
const POLL_INTERVAL_MS = 4000
const POLL_TIMEOUT_MS = 120000

// Receipts are paginated server-side; PAGE_SIZE rows are fetched per request and
// "Load more" appends the next page.
const PAGE_SIZE = 50

// Debounce window for the server-side search box so each keystroke doesn't fire
// a request.
const SEARCH_DEBOUNCE_MS = 300

type ViewMode = "grid" | "list"
const VIEW_STORAGE_KEY = "vero:consumer:receipts:view"

// First non-whitespace character of the merchant name, upper-cased — used by
// the avatar fallback when there's no thumbnail (typically PDF receipts).
// Mirrors the `<Avatar fallback={merchantName} />` shape on mobile.
function merchantInitial(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return "?"
  return trimmed.charAt(0).toUpperCase()
}

export default function ConsumerReceiptsPage() {
  const [receipts, setReceipts] = useState<ReceiptListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([])
  const [view, setView] = useState<ViewMode>("list")
  const [search, setSearch] = useState("")
  // Date-range filter (applied server-side via date_from / date_to).
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  // Server-side pagination state.
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  // Track image loads that 404 / error so we can swap in the avatar fallback
  // without ever paying for a re-fetch. Set is keyed by receipt id.
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set())

  // Hydrate the view preference from localStorage on first paint. Kept in a
  // dedicated effect so the initial server-render uses the default ("list")
  // and the client swap-over is the only place that touches storage.
  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = window.localStorage.getItem(VIEW_STORAGE_KEY)
    if (stored === "list" || stored === "grid") {
      setView(stored)
    }
  }, [])

  const changeView = useCallback((next: ViewMode) => {
    setView(next)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(VIEW_STORAGE_KEY, next)
    }
  }, [])

  const markImageBroken = useCallback((id: string) => {
    setBrokenImages((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }, [])

  // Server-side filters derived from the search box and date range. Memoised so
  // the load effect re-runs only when a filter actually changes. Dates are sent
  // as plain YYYY-MM-DD, which is what the backend compares against.
  const filters = useMemo<ReceiptFilters>(() => {
    const f: ReceiptFilters = {}
    const q = search.trim()
    if (q) f.search = q
    if (dateRange?.from) f.dateFrom = format(dateRange.from, "yyyy-MM-dd")
    if (dateRange?.to) f.dateTo = format(dateRange.to, "yyyy-MM-dd")
    return f
  }, [search, dateRange])

  // Loads the first page for the current filters, replacing the list. Used by
  // the initial load, filter changes, and the upload poller.
  const loadReceipts = useCallback(async () => {
    setError(null)
    try {
      const page = await fetchReceipts({ ...filters, limit: PAGE_SIZE, offset: 0 })
      setReceipts(page.receipts)
      setTotal(page.total)
      setHasMore(page.hasMore)
    } catch (err) {
      console.error("[Receipts] Failed to load:", err)
      setError("Couldn't load your receipts.")
    }
  }, [filters])

  // Appends the next page. Offsets by the number of rows already loaded.
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    try {
      const page = await fetchReceipts({
        ...filters,
        limit: PAGE_SIZE,
        offset: receipts.length,
      })
      setReceipts((prev) => {
        const seen = new Set(prev.map((r) => r.id))
        return [...prev, ...page.receipts.filter((r) => !seen.has(r.id))]
      })
      setTotal(page.total)
      setHasMore(page.hasMore)
    } catch (err) {
      console.error("[Receipts] Failed to load more:", err)
    } finally {
      setLoadingMore(false)
    }
  }, [filters, hasMore, loadingMore, receipts.length])

  // (Re)load the first page whenever filters change, debounced so typing in the
  // search box doesn't fire a request per keystroke.
  useEffect(() => {
    setLoading(true)
    const timer = window.setTimeout(() => {
      void loadReceipts().finally(() => setLoading(false))
    }, SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [loadReceipts])

  // Keep polling while ANY receipt is still "processing" (background OCR),
  // independent of this session's pendingUploads. This covers reloading the
  // page mid-processing (pendingUploads is wiped on reload) and receipts that
  // are processing from another surface — otherwise a processing row would be
  // left hanging until a manual refresh.
  const hasProcessing = receipts.some((r) => r.status === "processing")
  useEffect(() => {
    if (!hasProcessing) return
    const timer = window.setInterval(() => {
      void loadReceipts()
    }, POLL_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [hasProcessing, loadReceipts])

  // Polls the receipt list until the freshly-ingested receipt leaves the
  // "processing" status (background OCR done), then folds its pending row away.
  // A receipt that vanishes from the list resolved to a hidden soft-duplicate;
  // that's also "done". Caps at POLL_TIMEOUT_MS.
  const pollReceipt = useCallback(
    (key: string, id?: string) => {
      const startedAt = Date.now()
      const timer = window.setInterval(async () => {
        let done = false
        try {
          // Newly-uploaded receipts land on the first page (default created_at
          // DESC), so polling page 0 is enough to detect when OCR completes.
          const page = await fetchReceipts({
            ...filters,
            limit: PAGE_SIZE,
            offset: 0,
          })
          setReceipts(page.receipts)
          setTotal(page.total)
          setHasMore(page.hasMore)
          const r = id ? page.receipts.find((x) => x.id === id) : undefined
          if (!id || !r || (r.status && r.status !== "processing")) {
            done = true
          }
        } catch {
          // Transient fetch error — keep polling until the timeout.
        }
        if (done || Date.now() - startedAt > POLL_TIMEOUT_MS) {
          window.clearInterval(timer)
          setPendingUploads((prev) => prev.filter((p) => p.key !== key))
          // Final refresh to pick up match state too.
          void loadReceipts()
        }
      }, POLL_INTERVAL_MS)
    },
    [filters, loadReceipts]
  )

  // Drop / pick handler for the library dropzone. Each file is uploaded
  // independently so a transient failure on one image doesn't tank the rest.
  // We don't call /match here — the backend's auto-match heuristics handle that
  // for library uploads. Uploads are async: the receipt appears immediately as
  // "processing" and we poll until OCR fills it in.
  const handleFiles = useCallback(
    async (files: File[]) => {
      for (const file of files) {
        const key = `pending_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
        setPendingUploads((prev) => [
          ...prev,
          { key, fileName: file.name, phase: "uploading" },
        ])

        try {
          const result = await uploadReceipt(file)
          const id = result.receipt?.id

          // Exact duplicate (or resolved synchronously): nothing to poll —
          // refresh and drop the pending row.
          if (result.deduplicated || result.processing === false) {
            setPendingUploads((prev) => prev.filter((p) => p.key !== key))
            await loadReceipts()
            continue
          }

          // Accepted as "processing": show the OCR-in-progress state, refresh
          // so the new row appears, and poll until it resolves.
          setPendingUploads((prev) =>
            prev.map((p) =>
              p.key === key ? { ...p, phase: "matching", receiptId: id } : p
            )
          )
          await loadReceipts()
          pollReceipt(key, id)
        } catch (err) {
          console.error("[Receipts] Upload failed:", err)
          setPendingUploads((prev) =>
            prev.map((p) =>
              p.key === key
                ? {
                    ...p,
                    phase: "error",
                    error:
                      err instanceof Error
                        ? err.message
                        : "Upload failed.",
                  }
                : p
            )
          )
        }
      }
    },
    [loadReceipts, pollReceipt]
  )

  const dismissPending = useCallback((key: string) => {
    setPendingUploads((prev) => prev.filter((p) => p.key !== key))
  }, [])

  const handleDelete = useCallback(
    async (receiptId: string) => {
      if (typeof window !== "undefined") {
        const ok = window.confirm("Delete this receipt? This can't be undone.")
        if (!ok) return
      }
      try {
        await deleteReceipt(receiptId)
        setReceipts((prev) => prev.filter((r) => r.id !== receiptId))
      } catch (err) {
        console.error("[Receipts] Delete failed:", err)
        alert("Couldn't delete that receipt — please try again.")
      }
    },
    []
  )

  // "Keep" on a possible-duplicate: promote it to a standalone receipt and
  // refresh so it picks up its (now-attempted) match state.
  const handleKeepDuplicate = useCallback(
    async (receiptId: string) => {
      try {
        await promoteDuplicate(receiptId)
        await loadReceipts()
      } catch (err) {
        console.error("[Receipts] Promote duplicate failed:", err)
        alert("Couldn't keep that receipt — please try again.")
      }
    },
    [loadReceipts]
  )

  // Phase shown on the main dropzone. While anything is uploading we hold the
  // dropzone in the appropriate active state so the user sees the work; once
  // every pending row is gone we fall back to idle.
  const dropzonePhase: UploadPhase = useMemo(() => {
    if (pendingUploads.some((p) => p.phase === "uploading"))
      return "uploading"
    if (pendingUploads.some((p) => p.phase === "matching")) return "matching"
    if (
      pendingUploads.length === 0 &&
      receipts.length > 0 &&
      !loading &&
      !error
    ) {
      return "idle"
    }
    return "idle"
  }, [pendingUploads, receipts.length, loading, error])

  const showViewToggle = !loading && !error && receipts.length > 0

  // Whether a server-side filter is currently narrowing the list.
  const hasActiveFilter = search.trim() !== "" || dateRange?.from !== undefined

  // Show the search + date-range controls whenever there are receipts OR a
  // filter is active — otherwise a filter that returns nothing would hide the
  // very controls needed to clear it.
  const showFilters = !loading && !error && (receipts.length > 0 || hasActiveFilter)

  // Human-readable label for the date-range trigger button.
  const dateRangeLabel = useMemo(() => {
    if (!dateRange?.from) return "Any date"
    if (dateRange.to) {
      return `${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d")}`
    }
    return `From ${format(dateRange.from, "MMM d")}`
  }, [dateRange])

  return (
    <div className="mx-auto max-w-5xl space-y-4 sm:space-y-6 w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Receipts</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Upload photos or PDFs and we&apos;ll match them to the right
            transactions automatically.
          </p>
        </div>
        {showViewToggle ? (
          <div
            role="group"
            aria-label="View mode"
            className="inline-flex items-center gap-1 rounded-md border border-[var(--border)] p-1 self-start"
          >
            <button
              type="button"
              onClick={() => changeView("grid")}
              aria-pressed={view === "grid"}
              aria-label="Grid view"
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded transition-colors",
                view === "grid"
                  ? "bg-[var(--foreground)] text-white"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => changeView("list")}
              aria-pressed={view === "list"}
              aria-label="List view"
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded transition-colors",
                view === "list"
                  ? "bg-[var(--foreground)] text-white"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
              )}
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : null}
      </div>

      {showFilters ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search receipts by merchant or item…"
              aria-label="Search receipts"
              className="w-full rounded-md border border-[var(--border)] bg-white py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-[var(--foreground)] focus:ring-1 focus:ring-[var(--foreground)]"
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex w-full min-w-0 items-center justify-center gap-1.5 rounded-md border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors sm:w-auto sm:min-w-[160px]">
                <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{dateRangeLabel}</span>
                <ChevronDown className="h-4 w-4 flex-shrink-0 sm:ml-auto" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
              />
              {dateRange?.from ? (
                <div className="border-t border-[var(--border)] p-2">
                  <button
                    type="button"
                    onClick={() => setDateRange(undefined)}
                    className="w-full rounded-md px-2 py-1.5 text-left text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                  >
                    Clear dates
                  </button>
                </div>
              ) : null}
            </PopoverContent>
          </Popover>
        </div>
      ) : null}

      <ReceiptDropzone
        onFiles={handleFiles}
        phase={dropzonePhase}
        idleTitle="Drop receipts here to auto-match"
        idleHint="Drag & drop one or more images / PDFs, or click to choose files"
      />

      {pendingUploads.length > 0 && (
        <div className="space-y-2">
          {pendingUploads.map((p) => (
            <div
              key={p.key}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3",
                p.phase === "error"
                  ? "border-red-200 bg-red-50"
                  : "border-[var(--border)] bg-[var(--muted)]/40"
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full",
                  p.phase === "error"
                    ? "bg-red-100 text-red-600"
                    : "bg-white text-[var(--muted-foreground)]"
                )}
              >
                {p.phase === "uploading" || p.phase === "matching" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : p.phase === "done" ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : p.phase === "error" ? (
                  <Trash2 className="h-4 w-4" />
                ) : (
                  <FileImage className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p.fileName}</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {p.phase === "uploading"
                    ? "Uploading…"
                    : p.phase === "matching"
                    ? "Matching to your transactions…"
                    : p.phase === "done"
                    ? "Uploaded"
                    : p.error || "Upload failed."}
                </p>
              </div>
              {p.phase === "error" ? (
                <button
                  type="button"
                  onClick={() => dismissPending(p.key)}
                  className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  Dismiss
                </button>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--muted-foreground)]" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : receipts.length === 0 && hasActiveFilter ? (
        <div className="rounded-lg border border-dashed border-[var(--border)] p-8 text-center">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-[var(--muted)]">
            <Search className="h-6 w-6 text-[var(--muted-foreground)]" />
          </div>
          <h3 className="mt-4 font-medium">No matching receipts</h3>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            No receipts match your current search and date filters. Try widening
            them.
          </p>
        </div>
      ) : receipts.length === 0 && pendingUploads.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--border)] p-8 text-center">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-[var(--muted)]">
            <ReceiptIcon className="h-6 w-6 text-[var(--muted-foreground)]" />
          </div>
          <h3 className="mt-4 font-medium">No receipts yet</h3>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Drop a photo or PDF above to get started. Receipts you upload here
            will be auto-matched to your transactions.
          </p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {receipts.map((r) => {
            const matchedTxId = receiptMatchedTransactionId(r)
            const rawImg = receiptImage(r)
            const img = rawImg && !brokenImages.has(r.id) ? rawImg : undefined
            const date = receiptDate(r)
            const name = receiptDisplayName(r)
            return (
              <div
                key={r.id}
                className="group flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-white"
              >
                <div className="relative aspect-[4/3] bg-[var(--muted)]/40">
                  {img ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={img}
                      alt={`${name} receipt`}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      onError={() => markImageBroken(r.id)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Avatar className="h-16 w-16 rounded-md">
                        <AvatarFallback className="rounded-md bg-[var(--muted)] text-xl font-medium text-[var(--muted-foreground)]">
                          {merchantInitial(name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    {r.status === "processing" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Pending
                      </span>
                    ) : r.status === "duplicate" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-700">
                        Possible duplicate
                      </span>
                    ) : matchedTxId ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                        <CheckCircle2 className="h-3 w-3" />
                        Matched
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-[var(--muted-foreground)]">
                        Unmatched
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {date ? formatTxShortDate(date) : "—"}
                      {typeof r.total === "number"
                        ? ` · $${r.total.toFixed(2)}`
                        : ""}
                    </p>
                  </div>
                  {r.status === "duplicate" ? (
                    <div className="mt-auto flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleKeepDuplicate(r.id)}
                        className="flex-1 rounded-md border border-[var(--border)] px-2 py-1 text-xs font-medium hover:bg-[var(--muted)]"
                      >
                        Keep
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        className="flex-1 rounded-md border border-[var(--border)] px-2 py-1 text-xs font-medium text-red-600 hover:bg-[var(--muted)]"
                      >
                        Discard
                      </button>
                    </div>
                  ) : (
                    <div className="mt-auto flex items-center justify-between gap-2">
                      {r.status === "processing" ? (
                        <span className="text-xs text-[var(--muted-foreground)]">
                          Reading receipt…
                        </span>
                      ) : matchedTxId ? (
                        <Link
                          href={`/user-dashboard/transactions/${matchedTxId}`}
                          className="inline-flex items-center gap-1 text-xs text-[var(--primary)] hover:underline"
                        >
                          View transaction
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      ) : (
                        <span className="text-xs text-[var(--muted-foreground)]">
                          Not yet matched
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        aria-label="Delete receipt"
                        className="rounded-md p-1 text-[var(--muted-foreground)] opacity-0 transition-opacity hover:bg-[var(--muted)] hover:text-red-600 group-hover:opacity-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <ul className="divide-y divide-[var(--border)] overflow-hidden rounded-lg border border-[var(--border)] bg-white">
          {receipts.map((r) => {
            const matchedTxId = receiptMatchedTransactionId(r)
            const rawImg = receiptImage(r)
            const img = rawImg && !brokenImages.has(r.id) ? rawImg : undefined
            const date = receiptDate(r)
            const name = receiptDisplayName(r)
            return (
              <li
                key={r.id}
                className="group flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-[var(--muted)]/50 sm:px-4 sm:py-3"
              >
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-[var(--muted)]/40">
                  {img ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={img}
                      alt={`${name} receipt`}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      onError={() => markImageBroken(r.id)}
                    />
                  ) : (
                    <Avatar className="h-14 w-14 rounded-md">
                      <AvatarFallback className="rounded-md bg-[var(--muted)] text-base font-medium text-[var(--muted-foreground)]">
                        {merchantInitial(name)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{name}</p>
                  <p className="truncate text-xs text-[var(--muted-foreground)]">
                    {date ? formatTxShortDate(date) : "—"}
                    {typeof r.total === "number"
                      ? ` · $${r.total.toFixed(2)}`
                      : ""}
                  </p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2 sm:gap-3">
                  {r.status === "processing" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Pending
                    </span>
                  ) : r.status === "duplicate" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-700">
                      Possible duplicate
                    </span>
                  ) : matchedTxId ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                      <CheckCircle2 className="h-3 w-3" />
                      Matched
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--muted)] px-2 py-0.5 text-[10px] font-medium text-[var(--muted-foreground)]">
                      Unmatched
                    </span>
                  )}
                  {r.status === "duplicate" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleKeepDuplicate(r.id)}
                        className="rounded-md border border-[var(--border)] px-2 py-1 text-xs font-medium hover:bg-[var(--muted)]"
                      >
                        Keep
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        className="rounded-md border border-[var(--border)] px-2 py-1 text-xs font-medium text-red-600 hover:bg-[var(--muted)]"
                      >
                        Discard
                      </button>
                    </>
                  ) : (
                    <>
                      {matchedTxId ? (
                        <Link
                          href={`/user-dashboard/transactions/${matchedTxId}`}
                          className="hidden items-center gap-1 text-xs text-[var(--primary)] hover:underline sm:inline-flex"
                        >
                          View
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        aria-label="Delete receipt"
                        className="rounded-md p-1 text-[var(--muted-foreground)] opacity-0 transition-opacity hover:bg-[var(--muted)] hover:text-red-600 group-hover:opacity-100 sm:opacity-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {!loading && !error && hasMore ? (
        <LoadMore
          onClick={() => void loadMore()}
          loading={loadingMore}
          loaded={receipts.length}
          total={total}
        />
      ) : null}
    </div>
  )
}
