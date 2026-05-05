"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Receipt,
  Search,
  Filter,
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
import {
  cacheTransactionForDetail,
  fetchTransactions,
  transactionDisplayName,
  type Transaction,
} from "@/lib/transactions"
import {
  formatTxDate,
  getCategoryColor,
  getCategoryLabel,
  getTransactionIcon,
} from "@/lib/category-display"
import { useMainScrollRestore } from "@/lib/use-main-scroll-restore"

type CategoryFilter = "all" | "groceries" | "dining" | "coffee" | "gas" | "shopping"
type SortColumn = "merchant" | "category" | "date" | "receipt" | "amount"
type SortDirection = "asc" | "desc"
type ReceiptFilter = "all" | "matched" | "unmatched"

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

  const [showPlaidModal, setShowPlaidModal] = useState(false)

  const loadTransactions = useCallback(async () => {
    setTransactionsLoading(true)
    setTransactionsError(null)
    try {
      const res = await fetchTransactions()
      setTransactions(res.transactions ?? [])
    } catch (err) {
      console.error("[Transactions] Failed to load:", err)
      setTransactionsError("Couldn't load your transactions.")
    } finally {
      setTransactionsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTransactions()
  }, [loadTransactions])

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
      router.push(`/consumer/transactions/${tx.id}`)
    },
    [router, saveListScroll]
  )

  const filteredTransactions = useMemo(() => {
    let result = [...transactions]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter((tx) => {
        const merchant = transactionDisplayName(tx).toLowerCase()
        return merchant.includes(query) || (tx.name || "").toLowerCase().includes(query)
      })
    }

    if (selectedCategory !== "all") {
      result = result.filter((tx) => getCategoryFilterMatch(tx, selectedCategory))
    }

    if (receiptFilter === "matched") {
      result = result.filter((tx) => !!tx.receipt)
    } else if (receiptFilter === "unmatched") {
      result = result.filter((tx) => !tx.receipt)
    }

    result.sort((a, b) => {
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

    return result
  }, [transactions, searchQuery, selectedCategory, sortColumn, sortDirection, receiptFilter])

  const totalSpent = useMemo(() => {
    return filteredTransactions.reduce((sum, tx) => {
      // Plaid expense amounts are positive; refunds/credits are negative.
      // For the "Total" line we sum only expenses.
      return tx.amount > 0 ? sum + tx.amount : sum
    }, 0)
  }, [filteredTransactions])

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
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search by merchant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-[var(--border)] bg-white pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center justify-center gap-2 rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors sm:w-auto sm:min-w-[160px]">
                <Filter className="h-4 w-4" />
                {categoryDefs.find((c) => c.value === selectedCategory)?.label || "Category"}
                <ChevronDown className="h-4 w-4 ml-auto" />
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center justify-center gap-2 rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors sm:w-auto sm:min-w-[160px]">
                <Receipt className="h-4 w-4" />
                {receiptFilter === "all" ? "All receipts" : receiptFilter === "matched" ? "With receipt" : "No receipt"}
                <ChevronDown className="h-4 w-4 ml-auto" />
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
              <button className="flex w-full items-center justify-center gap-2 rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors sm:w-auto sm:min-w-[170px]">
                <ArrowUpDown className="h-4 w-4" />
                {sortLabels[sortColumn]}
                {sortDirection === "asc" ? (
                  <ArrowUp className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDown className="h-3.5 w-3.5" />
                )}
                <ChevronDown className="h-4 w-4 ml-auto" />
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

        {/* Summary */}
        <div className="flex items-center justify-between py-2 px-1">
          <p className="text-sm text-[var(--muted-foreground)]">
            Showing {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
          </p>
          <p className="text-sm font-medium">
            Total spent: ${totalSpent.toFixed(2)}
          </p>
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

        {/* Empty - no transactions at all */}
        {!transactionsLoading && !transactionsError && transactions.length === 0 && (
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
        {!transactionsLoading && !transactionsError && transactions.length > 0 && filteredTransactions.length === 0 && (
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
        {filteredTransactions.length > 0 && (
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
                {filteredTransactions.map((tx) => {
                  const Icon = getTransactionIcon(tx)
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
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--muted)]">
                            <Icon className="h-5 w-5 text-[var(--muted-foreground)]" />
                          </div>
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
        {filteredTransactions.length > 0 && (
          <div className="md:hidden space-y-3">
            {filteredTransactions.map((tx) => {
              const Icon = getTransactionIcon(tx)
              const merchant = transactionDisplayName(tx)
              const sign = tx.amount < 0 ? "+" : ""
              const magnitude = Math.abs(tx.amount).toFixed(2)
              return (
                <Link
                  key={tx.id}
                  href={`/consumer/transactions/${tx.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    navigateToTransaction(tx)
                  }}
                  className="block rounded-lg border border-[var(--border)] p-4 hover:bg-[var(--muted)]/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--muted)]">
                      <Icon className="h-5 w-5 text-[var(--muted-foreground)]" />
                    </div>
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
      </div>

      <PlaidLinkModal
        open={showPlaidModal}
        onClose={() => setShowPlaidModal(false)}
        onLinked={loadTransactions}
      />
    </>
  )
}
