"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  CheckCircle2,
  ExternalLink,
  FileImage,
  LayoutGrid,
  List,
  Loader2,
  Receipt as ReceiptIcon,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ReceiptDropzone,
  type UploadPhase,
} from "@/components/receipt-dropzone"
import {
  deleteReceipt,
  fetchReceipts,
  receiptDate,
  receiptDisplayName,
  receiptImage,
  uploadReceipt,
  type ReceiptListItem,
} from "@/lib/receipts"
import {
  fetchTransactions,
  type Transaction,
} from "@/lib/transactions"
import { formatTxShortDate } from "@/lib/category-display"

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

// How long we keep showing "Matching…" before declaring the upload done and
// folding the row back into the receipts list. The backend's OCR + match is
// usually fast (a few seconds); after this window we just trust whatever
// `fetchReceipts()` returned.
const MATCH_GRACE_MS = 6000

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
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([])
  const [view, setView] = useState<ViewMode>("grid")
  // Track image loads that 404 / error so we can swap in the avatar fallback
  // without ever paying for a re-fetch. Set is keyed by receipt id.
  const [brokenImages, setBrokenImages] = useState<Set<string>>(new Set())

  // Hydrate the view preference from localStorage on first paint. Kept in a
  // dedicated effect so the initial server-render uses the default ("grid")
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

  const loadReceipts = useCallback(async () => {
    setError(null)
    try {
      const [rs, tx] = await Promise.all([
        fetchReceipts(),
        fetchTransactions().then((r) => r.transactions ?? []),
      ])
      setReceipts(rs)
      setTransactions(tx)
    } catch (err) {
      console.error("[Receipts] Failed to load:", err)
      setError("Couldn't load your receipts.")
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    loadReceipts().finally(() => setLoading(false))
  }, [loadReceipts])

  // Build a lookup of receipt id → transaction (mirrors mobile's
  // buildDisplayReceipts). The backend returns the matched receipt embedded on
  // the transaction; we cross-reference here so a library row can deep-link to
  // its matched transaction.
  const matchByReceiptId = useMemo(() => {
    const map = new Map<string, Transaction>()
    for (const tx of transactions) {
      if (tx.receipt?.id) {
        map.set(tx.receipt.id, tx)
      }
    }
    return map
  }, [transactions])

  // Drop / pick handler for the library dropzone. Each file is uploaded
  // independently so a transient failure on one image doesn't tank the rest.
  // We don't call /match here — the backend's auto-match heuristics handle
  // that for library uploads. The "matching" phase is a visual grace window
  // that gives those heuristics time to land before we refresh the list.
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
          setPendingUploads((prev) =>
            prev.map((p) =>
              p.key === key
                ? { ...p, phase: "matching", receiptId: id }
                : p
            )
          )

          // Refresh from the server (the new receipt is now in the list) and
          // give the backend's OCR/auto-match a moment to attach it to a
          // transaction. After the grace window expires we fold the pending
          // row away; the static row below it now reflects whatever match
          // state the backend reached.
          await loadReceipts()
          window.setTimeout(() => {
            setPendingUploads((prev) =>
              prev.filter((p) => p.key !== key)
            )
            // Pull the latest match state in case the backend matched
            // *during* the grace window.
            void loadReceipts()
          }, MATCH_GRACE_MS)
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
    [loadReceipts]
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {receipts.map((r) => {
            const matchedTx = matchByReceiptId.get(r.id)
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
                    {matchedTx ? (
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
                  <div className="mt-auto flex items-center justify-between gap-2">
                    {matchedTx ? (
                      <Link
                        href={`/consumer/transactions/${matchedTx.id}`}
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
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <ul className="divide-y divide-[var(--border)] overflow-hidden rounded-lg border border-[var(--border)] bg-white">
          {receipts.map((r) => {
            const matchedTx = matchByReceiptId.get(r.id)
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
                  {matchedTx ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                      <CheckCircle2 className="h-3 w-3" />
                      Matched
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--muted)] px-2 py-0.5 text-[10px] font-medium text-[var(--muted-foreground)]">
                      Unmatched
                    </span>
                  )}
                  {matchedTx ? (
                    <Link
                      href={`/consumer/transactions/${matchedTx.id}`}
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
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
