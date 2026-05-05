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
  CalendarDays,
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
type SortOrder = "newest" | "oldest" | "highest" | "lowest"
type ReceiptFilter = "all" | "matched" | "unmatched"

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
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest")
  const [receiptFilter, setReceiptFilter] = useState<ReceiptFilter>("all")

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
    (id: string) => {
      saveListScroll()
      router.push(`/consumer/transactions/${id}`)
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

    switch (sortOrder) {
      case "newest":
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case "highest":
        result.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
        break
      case "lowest":
        result.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount))
        break
    }

    return result
  }, [transactions, searchQuery, selectedCategory, sortOrder, receiptFilter])

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
              <button className="flex w-full items-center justify-center gap-2 rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors sm:w-auto sm:min-w-[140px]">
                <ArrowUpDown className="h-4 w-4" />
                Sort
                <ChevronDown className="h-4 w-4 ml-auto" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setSortOrder("newest")} className={cn(sortOrder === "newest" && "bg-[var(--muted)]")}>
                <CalendarDays className="mr-2 h-4 w-4" />
                Newest first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("oldest")} className={cn(sortOrder === "oldest" && "bg-[var(--muted)]")}>
                <CalendarDays className="mr-2 h-4 w-4" />
                Oldest first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("highest")} className={cn(sortOrder === "highest" && "bg-[var(--muted)]")}>
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Highest amount
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder("lowest")} className={cn(sortOrder === "lowest" && "bg-[var(--muted)]")}>
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Lowest amount
              </DropdownMenuItem>
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
                  <TableHead className="w-[40%]">Merchant</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
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
                      onClick={() => navigateToTransaction(tx.id)}
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
                    navigateToTransaction(tx.id)
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
      >
        <p className="text-sm text-[var(--muted-foreground)]">
          Connect your bank or credit card to start receiving transactions and
          itemized receipts.
        </p>
      </PlaidLinkModal>
    </>
  )
}
