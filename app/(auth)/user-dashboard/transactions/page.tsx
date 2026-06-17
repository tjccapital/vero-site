"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Receipt,
  Search,
  Filter,
  Calendar as CalendarIcon,
  ChevronDown,
  ShoppingBag,
  Coffee,
  Utensils,
  Car,
  Store,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Landmark,
  CheckCircle2,
  Loader2,
  Plus,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PlaidLinkModal } from "@/components/plaid-link-modal"
import { RefreshButton } from "@/components/refresh-button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { type DateRange } from "react-day-picker"
import {
  format,
  startOfDay,
  subDays,
  subMonths,
  startOfMonth,
  startOfYear,
} from "date-fns"
import {
  cacheTransactionForDetail,
  fetchTransactions,
  syncTransactions,
  transactionDisplayName,
  type Transaction,
  type TransactionFilters,
} from "@/lib/transactions"
import { LoadMore } from "@/components/ui/load-more"
import {
  readPendingFirstSync,
  clearPendingFirstSync,
} from "@/lib/pending-first-sync"
import {
  formatTxDate,
  getCategoryColor,
  getCategoryLabel,
} from "@/lib/category-display"
import { TransactionAvatar } from "@/components/transaction-avatar"
import { useMainScrollRestore } from "@/lib/use-main-scroll-restore"

type CategoryFilter = "all" | "groceries" | "dining" | "coffee" | "gas" | "shopping"
type SortColumn = "merchant" | "category" | "date" | "receipt" | "amount"
type SortDirection = "asc" | "desc"
type ReceiptFilter = "all" | "matched" | "unmatched"

// Transactions are paginated server-side; PAGE_SIZE rows per request and
// "Load more" appends the next page. SEARCH_DEBOUNCE_MS keeps a keystroke from
// firing a request per character.
const PAGE_SIZE = 50
const SEARCH_DEBOUNCE_MS = 300

const sortLabels: Record<SortColumn, string> = {
  merchant: "Merchant",
  category: "Category",
  date: "Date",
  receipt: "Receipt",
  amount: "Amount",
}

// What direction to start a column in when the user picks it cold. Date and
// amount default to desc (newest / highest first); name-like columns default
// to asc; receipt defaults to "matched first".
const defaultSortDirection: Record<SortColumn, SortDirection> = {
  merchant: "asc",
  category: "asc",
  date: "desc",
  receipt: "desc",
  amount: "desc",
}

const categoryDefs: Array<{
  value: CategoryFilter
  label: string
  icon?: typeof ShoppingBag
  needles: string[]
}> = [
  { value: "all", label: "All Categories", needles: [] },
  { value: "groceries", label: "Groceries", icon: ShoppingBag, needles: ["grocery", "supermarket"] },
  { value: "dining", label: "Dining", icon: Utensils, needles: ["restaurant", "food and drink", "dining", "fast food"] },
  { value: "coffee", label: "Coffee", icon: Coffee, needles: ["coffee"] },
  { value: "gas", label: "Gas & Auto", icon: Car, needles: ["gas", "fuel", "automotive"] },
  { value: "shopping", label: "Shopping", icon: Store, needles: ["shop", "retail", "merchandise"] },
]

function SortableTableHead({
  column,
  sortColumn,
  sortDirection,
  onSort,
  align,
  className,
  children,
}: {
  column: SortColumn
  sortColumn: SortColumn
  sortDirection: SortDirection
  onSort: (col: SortColumn) => void
  align?: "right"
  className?: string
  children: React.ReactNode
}) {
  const active = sortColumn === column
  return (
    <TableHead className={cn("p-0", className)}>
      <button
        type="button"
        onClick={() => onSort(column)}
        aria-sort={active ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
        className={cn(
          "flex w-full items-center gap-1.5 px-4 py-3 text-left text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors select-none",
          align === "right" && "justify-end text-right"
        )}
      >
        <span>{children}</span>
        {active ? (
          sortDirection === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5" />
          )
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5 opacity-30" />
        )}
      </button>
    </TableHead>
  )
}

function getCategoryFilterMatch(tx: Transaction, filter: CategoryFilter): boolean {
  if (filter === "all") return true
  const def = categoryDefs.find((d) => d.value === filter)
  if (!def) return true
  const tags = (tx.category || []).map((c) => c.toLowerCase())
  return def.needles.some((n) => tags.some((t) => t.includes(n)))
}

export default function ConsumerTransactionsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all")
  const [sortColumn, setSortColumn] = useState<SortColumn>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [receiptFilter, setReceiptFilter] = useState<ReceiptFilter>("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  // Quick-pick presets shown alongside the calendar in the popover.
  const datePresets = useMemo(() => {
    const today = new Date()
    return [
      { label: "Last 7 days", range: { from: subDays(startOfDay(today), 6), to: today } },
      { label: "Last 30 days", range: { from: subDays(startOfDay(today), 29), to: today } },
      { label: "This month", range: { from: startOfMonth(today), to: today } },
      { label: "Last 3 months", range: { from: subMonths(startOfDay(today), 3), to: today } },
      { label: "This year", range: { from: startOfYear(today), to: today } },
    ]
  }, [])

  const dateRangeButtonLabel = useMemo(() => {
    if (!dateRange?.from) return "Any date"
    if (dateRange.to) {
      return `${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d")}`
    }
    return `From ${format(dateRange.from, "MMM d")}`
  }, [dateRange])

  const handleSort = useCallback((col: SortColumn) => {
    setSortColumn((prevCol) => {
      if (prevCol === col) {
        // Same column — flip direction.
        setSortDirection((d) => (d === "asc" ? "desc" : "asc"))
        return prevCol
      }
      // New column — start at its sensible default direction.
      setSortDirection(defaultSortDirection[col])
      return col
    })
  }, [])

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [transactionsLoading, setTransactionsLoading] = useState(true)
  const [transactionsError, setTransactionsError] = useState<string | null>(null)
  // Server-side pagination + filter-aware aggregates.
  const [total, setTotal] = useState(0)
  const [totalSpent, setTotalSpent] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  // Filters sent to the server. search/date/receipt map cleanly to backend
  // params, so total + total_spent + the loaded page all reflect them. The
  // category quick-chip and sort are applied client-side over loaded rows
  // (the backend can't express the multi-keyword category match or the
  // absolute-value amount sort), so they are intentionally NOT sent here.
  const serverFilters = useMemo<TransactionFilters>(() => {
    const f: TransactionFilters = {}
    const q = searchQuery.trim()
    if (q) f.search = q
    if (dateRange?.from) f.dateFrom = format(dateRange.from, "yyyy-MM-dd")
    if (dateRange?.to) f.dateTo = format(dateRange.to, "yyyy-MM-dd")
    if (receiptFilter === "matched") f.matched = "matched"
    else if (receiptFilter === "unmatched") f.matched = "unmatched"
    return f
  }, [searchQuery, dateRange, receiptFilter])

  const [showPlaidModal, setShowPlaidModal] = useState(false)

  // sessionStorage marker indicating the user just linked a bank account and
  // Plaid may still be fetching transactions in the background. Drives the
  // "Fetching from {bank}..." waiting state below. Re-read after every
  // transaction load so the marker clears once data arrives.
  const [pendingFirstSync, setPendingFirstSync] = useState<{
    institutionName: string
  } | null>(null)
  useEffect(() => {
    const marker = readPendingFirstSync()
    if (marker && transactions.length === 0) {
      setPendingFirstSync({ institutionName: marker.institutionName })
    } else {
      // Either no marker, or transactions arrived — clear the marker so a
      // future visit doesn't trigger the waiting state when it isn't needed.
      if (marker) clearPendingFirstSync()
      setPendingFirstSync(null)
    }
  }, [transactions.length])

  // Loads the first page for the current server filters, replacing the list.
  const reload = useCallback(async () => {
    setTransactionsLoading(true)
    setTransactionsError(null)
    try {
      const res = await fetchTransactions({
        ...serverFilters,
        limit: PAGE_SIZE,
        offset: 0,
      })
      setTransactions(res.transactions ?? [])
      setTotal(res.total ?? res.transactions?.length ?? 0)
      setTotalSpent(res.total_spent ?? 0)
      setHasMore(res.has_more ?? res.hasMore ?? false)
    } catch (err) {
      console.error("[Transactions] Failed to load:", err)
      setTransactionsError("Couldn't load your transactions.")
    } finally {
      setTransactionsLoading(false)
    }
  }, [serverFilters])

  // Syncs from Plaid, then loads the first page. Used on initial mount and
  // after a new bank link. Sync is included in the per-Item monthly
  // Transactions fee, not billed per call. Filter changes use `reload`
  // directly so typing/toggling doesn't trigger a sync each time.
  const loadTransactions = useCallback(async () => {
    try {
      await syncTransactions()
    } catch (syncErr) {
      // Non-fatal — the cache read below still returns whatever's there.
      console.warn("[Transactions] Sync before fetch failed:", syncErr)
    }
    await reload()
  }, [reload])

  // Appends the next page, offset by the rows already loaded.
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    try {
      const res = await fetchTransactions({
        ...serverFilters,
        limit: PAGE_SIZE,
        offset: transactions.length,
      })
      const next = res.transactions ?? []
      setTransactions((prev) => {
        const seen = new Set(prev.map((t) => t.id))
        return [...prev, ...next.filter((t) => !seen.has(t.id))]
      })
      setTotal(res.total ?? total)
      setTotalSpent(res.total_spent ?? totalSpent)
      setHasMore(res.has_more ?? res.hasMore ?? false)
    } catch (err) {
      console.error("[Transactions] Failed to load more:", err)
    } finally {
      setLoadingMore(false)
    }
  }, [serverFilters, transactions.length, hasMore, loadingMore, total, totalSpent])

  // Initial mount syncs + loads; later filter changes do a debounced reload
  // (no sync). The ref distinguishes the first run from filter changes.
  const didInitialLoad = useRef(false)
  useEffect(() => {
    if (!didInitialLoad.current) {
      didInitialLoad.current = true
      void loadTransactions()
      return
    }
    const timer = window.setTimeout(() => void reload(), SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(timer)
  }, [loadTransactions, reload])

  // Restore the list's scroll position after returning from a transaction
  // detail. Restored once the rows have rendered (transactionsLoading flips
  // to false); the value is cleared after replay so a later, unrelated
  // navigation back to the list doesn't get yanked to a stale spot.
  const saveListScroll = useMainScrollRestore(
    "vero:consumer:transactions:scrollTop",
    !transactionsLoading
  )

  const navigateToTransaction = useCallback(
    (tx: Transaction) => {
      saveListScroll()
      // Stash the row so the detail page can render without re-listing.
      cacheTransactionForDetail(tx)
      router.push(`/user-dashboard/transactions/${tx.id}`)
    },
    [router, saveListScroll]
  )

  // Client-side refinement over the loaded page. search / date / receipt
  // filters are applied server-side (so they also drive total + total_spent),
  // so the only filter repeated here is the category quick-chip, whose
  // multi-keyword match the backend can't express. Sorting is client-side
  // too — it orders the loaded rows (the backend can't sort by absolute
  // amount or by category/receipt presence).
  const displayedTransactions = useMemo(() => {
    let result = transactions
    if (selectedCategory !== "all") {
      result = result.filter((tx) => getCategoryFilterMatch(tx, selectedCategory))
    }
    return [...result].sort((a, b) => {
      let cmp: number
      switch (sortColumn) {
        case "merchant":
          cmp = transactionDisplayName(a).localeCompare(transactionDisplayName(b))
          break
        case "category":
          cmp = (a.category?.[0] || "").localeCompare(b.category?.[0] || "")
          break
        case "date":
          cmp = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case "receipt":
          cmp = (a.receipt ? 1 : 0) - (b.receipt ? 1 : 0)
          break
        case "amount":
          cmp = Math.abs(a.amount) - Math.abs(b.amount)
          break
      }
      return sortDirection === "asc" ? cmp : -cmp
    })
  }, [transactions, selectedCategory, sortColumn, sortDirection])

  return (
    <>
      <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6 w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Your Transactions</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Click any transaction to see its itemized receipt
            </p>
          </div>
          <RefreshButton
            onResult={(txs) => setTransactions(txs)}
          />
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search by merchant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-[var(--border)] bg-white pl-10 pr-4 py-2 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            />
          </div>

          {/* Filter chips: two columns on mobile, a single wrapping row on
              sm+. Sort is pushed to the far right on desktop. */}
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex min-w-0 w-full items-center justify-center gap-1.5 rounded-md border border-[var(--border)] px-2 sm:px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors sm:w-auto sm:min-w-[160px]">
                <Filter className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{categoryDefs.find((c) => c.value === selectedCategory)?.label || "Category"}</span>
                <ChevronDown className="h-4 w-4 flex-shrink-0 sm:ml-auto" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {categoryDefs.map((category) => (
                <DropdownMenuItem
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={cn(
                    selectedCategory === category.value && "bg-[var(--muted)]"
                  )}
                >
                  {category.icon && <category.icon className="mr-2 h-4 w-4" />}
                  {category.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover>
            <PopoverTrigger asChild>
              <button className="flex min-w-0 w-full items-center justify-center gap-1.5 rounded-md border border-[var(--border)] px-2 sm:px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors sm:w-auto sm:min-w-[160px]">
                <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{dateRangeButtonLabel}</span>
                <ChevronDown className="h-4 w-4 flex-shrink-0 sm:ml-auto" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="flex w-auto flex-col sm:flex-row">
              <div className="flex flex-row flex-wrap gap-1 border-b border-[var(--border)] p-2 sm:w-40 sm:flex-col sm:border-b-0 sm:border-r">
                {datePresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setDateRange(preset.range)}
                    className="rounded-md px-2 py-1.5 text-left text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setDateRange(undefined)}
                  className="rounded-md px-2 py-1.5 text-left text-sm text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                  Clear
                </button>
              </div>
              <Calendar
                mode="range"
                numberOfMonths={1}
                selected={dateRange}
                onSelect={setDateRange}
                defaultMonth={dateRange?.from}
              />
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex min-w-0 w-full items-center justify-center gap-1.5 rounded-md border border-[var(--border)] px-2 sm:px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors sm:w-auto sm:min-w-[160px]">
                <Receipt className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{receiptFilter === "all" ? "All receipts" : receiptFilter === "matched" ? "With receipt" : "No receipt"}</span>
                <ChevronDown className="h-4 w-4 flex-shrink-0 sm:ml-auto" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setReceiptFilter("all")} className={cn(receiptFilter === "all" && "bg-[var(--muted)]")}>All receipts</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setReceiptFilter("matched")} className={cn(receiptFilter === "matched" && "bg-[var(--muted)]")}>With itemized receipt</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setReceiptFilter("unmatched")} className={cn(receiptFilter === "unmatched" && "bg-[var(--muted)]")}>No receipt yet</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex min-w-0 w-full items-center justify-center gap-1.5 rounded-md border border-[var(--border)] px-2 sm:px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors sm:w-auto sm:min-w-[170px] sm:ml-auto">
                <ArrowUpDown className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{sortLabels[sortColumn]}</span>
                {sortDirection === "asc" ? (
                  <ArrowUp className="h-3.5 w-3.5 flex-shrink-0" />
                ) : (
                  <ArrowDown className="h-3.5 w-3.5 flex-shrink-0" />
                )}
                <ChevronDown className="h-4 w-4 flex-shrink-0 sm:ml-auto" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {(["date", "amount", "merchant", "category", "receipt"] as const).map((col) => (
                <DropdownMenuItem
                  key={col}
                  onClick={() => handleSort(col)}
                  className={cn(
                    "flex items-center justify-between",
                    sortColumn === col && "bg-[var(--muted)]"
                  )}
                >
                  <span>{sortLabels[col]}</span>
                  {sortColumn === col ? (
                    sortDirection === "asc" ? (
                      <ArrowUp className="h-3.5 w-3.5" />
                    ) : (
                      <ArrowDown className="h-3.5 w-3.5" />
                    )
                  ) : null}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </div>

        {/* Summary */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[var(--muted-foreground)]">
            Showing{" "}
            <span className="font-medium text-[var(--foreground)]">
              {displayedTransactions.length}
            </span>{" "}
            of {total} transaction{total !== 1 ? "s" : ""}
          </p>
          <div className="flex items-baseline gap-2 rounded-lg border border-[var(--border)] bg-[var(--muted)]/40 px-3.5 py-1.5">
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Total spent
            </span>
            <span className="text-lg font-semibold tabular-nums">
              {totalSpent.toLocaleString(undefined, {
                style: "currency",
                currency: "USD",
              })}
            </span>
          </div>
        </div>

        {/* Loading state */}
        {transactionsLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--muted-foreground)]" />
          </div>
        )}

        {/* Error state */}
        {!transactionsLoading && transactionsError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {transactionsError}
          </div>
        )}

        {/* Empty - just-linked, Plaid still fetching */}
        {!transactionsLoading && !transactionsError && transactions.length === 0 && pendingFirstSync && (
          <div className="rounded-lg border border-dashed border-[var(--border)] p-8 text-center">
            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-[var(--muted)]">
              <Loader2 className="h-6 w-6 text-[var(--muted-foreground)] animate-spin" />
            </div>
            <h3 className="mt-4 font-medium">
              Fetching your transactions from {pendingFirstSync.institutionName}…
            </h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              This can take up to a minute. We&apos;ll keep this page in sync as soon as they arrive.
            </p>
          </div>
        )}

        {/* Empty - no transactions and not in the just-linked window */}
        {!transactionsLoading && !transactionsError && transactions.length === 0 && !pendingFirstSync && (
          <div className="rounded-lg border border-dashed border-[var(--border)] p-8 text-center">
            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-[var(--muted)]">
              <Landmark className="h-6 w-6 text-[var(--muted-foreground)]" />
            </div>
            <h3 className="mt-4 font-medium">No transactions yet</h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Link a bank account or card to start receiving transactions and itemized receipts.
            </p>
            <button
              onClick={() => setShowPlaidModal(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary)]/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Link an account
            </button>
          </div>
        )}

        {/* Empty - filters return nothing */}
        {!transactionsLoading && !transactionsError && transactions.length > 0 && displayedTransactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--muted)]">
              <Receipt className="h-8 w-8 text-[var(--muted-foreground)]" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No matching transactions</h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Try adjusting your filters
            </p>
          </div>
        )}

        {/* Transactions Table - Desktop */}
        {displayedTransactions.length > 0 && (
          <div className="hidden md:block rounded-lg border border-[var(--border)] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <SortableTableHead
                    column="merchant"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    className="w-[40%]"
                  >
                    Merchant
                  </SortableTableHead>
                  <SortableTableHead
                    column="category"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  >
                    Category
                  </SortableTableHead>
                  <SortableTableHead
                    column="date"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  >
                    Date
                  </SortableTableHead>
                  <SortableTableHead
                    column="receipt"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  >
                    Receipt
                  </SortableTableHead>
                  <SortableTableHead
                    column="amount"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                    align="right"
                  >
                    Amount
                  </SortableTableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedTransactions.map((tx) => {
                  const merchant = transactionDisplayName(tx)
                  const sign = tx.amount < 0 ? "+" : ""
                  const magnitude = Math.abs(tx.amount).toFixed(2)
                  return (
                    <TableRow
                      key={tx.id}
                      className="cursor-pointer hover:bg-[var(--muted)]/50"
                      onClick={() => navigateToTransaction(tx)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <TransactionAvatar
                            transaction={tx}
                            className="h-10 w-10 bg-[var(--muted)]"
                            iconClassName="h-5 w-5 text-[var(--muted-foreground)]"
                          />
                          <div>
                            <p className="font-medium">{merchant}</p>
                            {tx.pending && (
                              <p className="text-xs text-[var(--muted-foreground)]">Pending</p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn("capitalize", getCategoryColor(tx))}>
                          {getCategoryLabel(tx)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[var(--muted-foreground)]">
                        {formatTxDate(tx.date)}
                      </TableCell>
                      <TableCell>
                        {tx.receipt ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                            <CheckCircle2 className="h-3 w-3" />
                            Itemized
                          </span>
                        ) : (
                          <span className="text-xs text-[var(--muted-foreground)]">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {sign}${magnitude}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Transactions List - Mobile */}
        {displayedTransactions.length > 0 && (
          <div className="md:hidden space-y-3">
            {displayedTransactions.map((tx) => {
              const merchant = transactionDisplayName(tx)
              const sign = tx.amount < 0 ? "+" : ""
              const magnitude = Math.abs(tx.amount).toFixed(2)
              return (
                <Link
                  key={tx.id}
                  href={`/user-dashboard/transactions/${tx.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    navigateToTransaction(tx)
                  }}
                  className="block rounded-lg border border-[var(--border)] p-4 hover:bg-[var(--muted)]/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <TransactionAvatar
                      transaction={tx}
                      className="h-10 w-10 bg-[var(--muted)]"
                      iconClassName="h-5 w-5 text-[var(--muted-foreground)]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-medium">{merchant}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            {formatTxDate(tx.date)}
                            {tx.pending ? " · Pending" : ""}
                          </p>
                        </div>
                        <p className="font-semibold">{sign}${magnitude}</p>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="secondary" className={cn("capitalize text-xs", getCategoryColor(tx))}>
                          {getCategoryLabel(tx)}
                        </Badge>
                        {tx.receipt ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                            <CheckCircle2 className="h-3 w-3" />
                            Itemized
                          </span>
                        ) : (
                          <span className="text-xs text-[var(--muted-foreground)]">No receipt</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {!transactionsLoading && !transactionsError && hasMore && (
          <LoadMore
            onClick={() => void loadMore()}
            loading={loadingMore}
            loaded={transactions.length}
            total={total}
          />
        )}
      </div>

      <PlaidLinkModal
        open={showPlaidModal}
        onClose={() => setShowPlaidModal(false)}
        onLinked={loadTransactions}
      />
    </>
  )
}
