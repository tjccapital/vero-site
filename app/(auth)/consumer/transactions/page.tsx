"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@auth0/nextjs-auth0/client"
import { cn } from "@/lib/utils"
import {
  Receipt,
  LayoutDashboard,
  Settings,
  CircleHelp,
  MoreVertical,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Menu,
  X,
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
import { VeroLogo, VeroLogoFull } from "@/components/ui/vero-logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { PlaidLinkButton } from "@/components/plaid-link-button"
import { createLinkToken, exchangePublicToken } from "@/lib/plaid"
import {
  fetchTransactions,
  transactionDisplayName,
  type Transaction,
} from "@/lib/transactions"

const mainNavItems = [
  { name: "Home", href: "/consumer", icon: LayoutDashboard },
  { name: "Transactions", href: "/consumer/transactions", icon: Receipt, active: true },
  { name: "Accounts", href: "/consumer/accounts", icon: Landmark },
]

const bottomNavItems = [
  { name: "Settings", href: "/consumer/settings", icon: Settings },
  { name: "Get Help", href: "/contact", icon: CircleHelp },
]

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

function getTransactionIcon(tx: Transaction) {
  const tags = (tx.category || []).map((c) => c.toLowerCase())
  const has = (...needles: string[]) =>
    tags.some((tag) => needles.some((n) => tag.includes(n)))
  if (has("grocery", "supermarket")) return ShoppingBag
  if (has("coffee")) return Coffee
  if (has("restaurant", "food and drink", "fast food", "dining")) return Utensils
  if (has("gas", "fuel", "automotive")) return Car
  if (has("shop", "retail", "merchandise")) return Store
  return Receipt
}

function getCategoryFilterMatch(tx: Transaction, filter: CategoryFilter): boolean {
  if (filter === "all") return true
  const def = categoryDefs.find((d) => d.value === filter)
  if (!def) return true
  const tags = (tx.category || []).map((c) => c.toLowerCase())
  return def.needles.some((n) => tags.some((t) => t.includes(n)))
}

function getCategoryColor(tx: Transaction) {
  const tags = (tx.category || []).map((c) => c.toLowerCase())
  if (tags.some((t) => /grocery|supermarket/.test(t))) return "bg-green-100 text-green-700"
  if (tags.some((t) => /coffee/.test(t))) return "bg-amber-100 text-amber-700"
  if (tags.some((t) => /restaurant|food and drink|dining|fast food/.test(t))) return "bg-orange-100 text-orange-700"
  if (tags.some((t) => /gas|fuel|automotive/.test(t))) return "bg-blue-100 text-blue-700"
  if (tags.some((t) => /shop|retail|merchandise/.test(t))) return "bg-purple-100 text-purple-700"
  return "bg-gray-100 text-gray-700"
}

function getCategoryLabel(tx: Transaction): string {
  const tags = (tx.category || []).map((c) => c.toLowerCase())
  if (tags.some((t) => /grocery|supermarket/.test(t))) return "groceries"
  if (tags.some((t) => /coffee/.test(t))) return "coffee"
  if (tags.some((t) => /restaurant|food and drink|dining|fast food/.test(t))) return "dining"
  if (tags.some((t) => /gas|fuel|automotive/.test(t))) return "gas"
  if (tags.some((t) => /shop|retail|merchandise/.test(t))) return "shopping"
  return tx.category?.[0]?.toLowerCase() || "other"
}

function formatTxDate(iso: string): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const dayStart = new Date(d)
  dayStart.setHours(0, 0, 0, 0)
  if (dayStart.getTime() === today.getTime()) return "Today"
  if (dayStart.getTime() === yesterday.getTime()) return "Yesterday"
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

export default function ConsumerTransactionsPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all")
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest")
  const [receiptFilter, setReceiptFilter] = useState<ReceiptFilter>("all")

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [transactionsLoading, setTransactionsLoading] = useState(true)
  const [transactionsError, setTransactionsError] = useState<string | null>(null)

  const [showPlaidModal, setShowPlaidModal] = useState(false)
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [linkTokenError, setLinkTokenError] = useState<string | null>(null)
  const [exchanging, setExchanging] = useState(false)

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login?returnTo=/consumer/transactions")
    }
  }, [user, isLoading, router])

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
    if (!user) return
    loadTransactions()
  }, [user, loadTransactions])

  // Lazily fetch a Plaid link_token when the empty-state modal opens.
  useEffect(() => {
    if (!showPlaidModal) return
    if (linkToken) return
    let cancelled = false
    setLinkTokenError(null)
    createLinkToken()
      .then((res) => {
        if (cancelled) return
        setLinkToken(res.link_token)
      })
      .catch((err) => {
        console.error("[Plaid] Failed to create link token:", err)
        if (cancelled) return
        setLinkTokenError("Couldn't start Plaid Link. Please try again.")
      })
    return () => {
      cancelled = true
    }
  }, [showPlaidModal, linkToken])

  const closePlaidModal = useCallback(() => {
    setShowPlaidModal(false)
    setLinkToken(null)
    setLinkTokenError(null)
  }, [])

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <VeroLogo size={48} spinning className="text-[var(--primary)]" />
          <p className="text-sm text-[var(--muted-foreground)]">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "hidden flex-col border-r border-[var(--border)] lg:flex transition-all duration-300 h-full",
        sidebarCollapsed ? "w-[60px]" : "w-[240px]"
      )}>
        <div className="flex h-14 items-center px-4">
          <Link href="/consumer">
            {!sidebarCollapsed && <VeroLogoFull height={20} className="text-[var(--foreground)]" />}
            {sidebarCollapsed && <VeroLogo size={20} className="text-[var(--foreground)]" />}
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {mainNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              title={sidebarCollapsed ? item.name : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                item.active
                  ? "bg-[var(--muted)] font-medium text-[var(--foreground)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
                sidebarCollapsed && "justify-center px-2"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!sidebarCollapsed && item.name}
            </Link>
          ))}
        </nav>

        <div className="border-t border-[var(--border)] px-3 py-2">
          {bottomNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              title={sidebarCollapsed ? item.name : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
                sidebarCollapsed && "justify-center px-2"
              )}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!sidebarCollapsed && item.name}
            </Link>
          ))}
        </div>

        <div className="border-t border-[var(--border)] p-3">
          {sidebarCollapsed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center justify-center" title={user.email || user.name || "User"}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.picture || undefined} alt={user.name || "User"} />
                    <AvatarFallback className="bg-[var(--muted)] text-sm">
                      {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild className="text-red-600">
                  <a href="/auth/logout">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.picture || undefined} alt={user.name || "User"} />
                <AvatarFallback className="bg-[var(--muted)] text-sm">
                  {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden" title={user.email || undefined}>
                <p className="truncate text-sm font-medium">{user.name || "User"}</p>
                <p className="truncate text-xs text-[var(--muted-foreground)]">{user.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-md p-1 hover:bg-[var(--muted)]">
                    <MoreVertical className="h-4 w-4 text-[var(--muted-foreground)]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild className="text-red-600">
                    <a href="/auth/logout">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-14 items-center justify-between border-b border-[var(--border)] px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center rounded-md p-1.5 hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex items-center justify-center rounded-md p-1.5 hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
            <span className="text-sm font-medium">All Transactions</span>
          </div>
          <Link href="/" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            Back to Site
          </Link>
        </header>

        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-14 z-50 bg-white overflow-y-auto">
            <div className="px-4 py-4">
              <div className="flex items-center gap-3 pb-4 border-b border-[var(--border)]">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.picture || undefined} alt={user.name || "User"} />
                  <AvatarFallback className="bg-[var(--muted)] text-sm">
                    {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden" title={user.email || undefined}>
                  <p className="truncate text-sm font-medium">{user.name || "User"}</p>
                  <p className="truncate text-xs text-[var(--muted-foreground)]">{user.email}</p>
                </div>
              </div>

              <nav className="py-4 space-y-1">
                {mainNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors",
                      item.active
                        ? "bg-[var(--muted)] font-medium text-[var(--foreground)]"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="py-4 border-t border-[var(--border)]">
                {bottomNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t border-[var(--border)]">
                <a
                  href="/auth/logout"
                  className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  Log out
                </a>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
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
                  <button className="flex items-center justify-center gap-2 rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors min-w-[160px]">
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
                  <button className="flex items-center justify-center gap-2 rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors min-w-[160px]">
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
                  <button className="flex items-center justify-center gap-2 rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors min-w-[140px]">
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
                          onClick={() => router.push(`/consumer/transactions/${tx.id}`)}
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
        </main>
      </div>

      {/* Plaid Link Modal — same flow as the dashboard's "Link an account" CTA. */}
      {showPlaidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closePlaidModal}
          />
          <div className="relative w-full max-w-md mx-4 rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/10">
                  <Landmark className="h-5 w-5 text-[var(--primary)]" />
                </div>
                <div>
                  <h2 className="font-semibold">Link a Bank Account</h2>
                  <p className="text-xs text-[var(--muted-foreground)]">Securely connect via Plaid</p>
                </div>
              </div>
              <button
                onClick={closePlaidModal}
                className="rounded-md p-1 hover:bg-[var(--muted)] transition-colors"
              >
                <X className="h-5 w-5 text-[var(--muted-foreground)]" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-[var(--muted-foreground)]">
                Connect your bank or credit card to start receiving transactions and itemized receipts.
              </p>

              {linkTokenError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {linkTokenError}
                </div>
              ) : null}

              {linkToken ? (
                <PlaidLinkButton
                  linkToken={linkToken}
                  disabled={exchanging}
                  onSuccess={async (publicToken, metadata) => {
                    setExchanging(true)
                    try {
                      await exchangePublicToken(publicToken, {
                        institution: metadata?.institution
                          ? {
                              id: metadata.institution.institution_id,
                              name: metadata.institution.name,
                            }
                          : null,
                        accounts: metadata?.accounts?.map((a) => ({
                          id: a.id,
                          name: a.name,
                          mask: a.mask ?? undefined,
                        })),
                      })
                      closePlaidModal()
                      // Refetch transactions — once Plaid syncs, the user
                      // should see real data populate this page.
                      await loadTransactions()
                    } catch (err) {
                      console.error("[Plaid] Exchange failed:", err)
                      setLinkTokenError(
                        "We couldn't finish linking your account. Please try again."
                      )
                    } finally {
                      setExchanging(false)
                    }
                  }}
                  onExit={(err) => {
                    if (err) {
                      console.warn("[Plaid] Link exited with error:", err)
                    }
                  }}
                />
              ) : (
                <button
                  type="button"
                  disabled
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--foreground)] px-4 py-3 text-sm font-medium text-white opacity-60 cursor-not-allowed"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Preparing Plaid...
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
