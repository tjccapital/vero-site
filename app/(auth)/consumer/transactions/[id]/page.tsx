"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
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
  ArrowLeft,
  ShoppingBag,
  Coffee,
  Utensils,
  Car,
  Store,
  CreditCard,
  Calendar,
  Hash,
  Download,
  Share2,
  CheckCircle2,
  Landmark,
  FileText,
  Loader2,
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
  fetchTransactionById,
  fetchTransactionReceipt,
  receiptItemDescription,
  receiptItemUnitPrice,
  receiptItemTotalPrice,
  transactionDisplayName,
  TransactionReceiptNotFoundError,
  type Transaction,
  type Receipt as ReceiptModel,
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

function getTransactionIcon(tx: Transaction | null) {
  if (!tx) return Receipt
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

function getCategoryColor(tx: Transaction | null) {
  if (!tx) return "bg-gray-100 text-gray-700"
  const tags = (tx.category || []).map((c) => c.toLowerCase())
  if (tags.some((t) => /grocery|supermarket/.test(t))) return "bg-green-100 text-green-700"
  if (tags.some((t) => /coffee/.test(t))) return "bg-amber-100 text-amber-700"
  if (tags.some((t) => /restaurant|food and drink|dining|fast food/.test(t))) return "bg-orange-100 text-orange-700"
  if (tags.some((t) => /gas|fuel|automotive/.test(t))) return "bg-blue-100 text-blue-700"
  if (tags.some((t) => /shop|retail|merchandise/.test(t))) return "bg-purple-100 text-purple-700"
  return "bg-gray-100 text-gray-700"
}

function getCategoryLabel(tx: Transaction | null): string {
  if (!tx) return "transaction"
  const tags = (tx.category || []).map((c) => c.toLowerCase())
  if (tags.some((t) => /grocery|supermarket/.test(t))) return "groceries"
  if (tags.some((t) => /coffee/.test(t))) return "coffee"
  if (tags.some((t) => /restaurant|food and drink|dining|fast food/.test(t))) return "dining"
  if (tags.some((t) => /gas|fuel|automotive/.test(t))) return "gas"
  if (tags.some((t) => /shop|retail|merchandise/.test(t))) return "shopping"
  return tx.category?.[0]?.toLowerCase() || "other"
}

function formatLongDate(iso?: string): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function TransactionDetailPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const params = useParams()
  const transactionId = params.id as string
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [receipt, setReceipt] = useState<ReceiptModel | null>(null)
  const [matchMethod, setMatchMethod] = useState<string | null>(null)
  const [hasReceipt, setHasReceipt] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      router.push(`/auth/login?returnTo=/consumer/transactions/${transactionId}`)
    }
  }, [user, isLoading, router, transactionId])

  // On mount, fetch the transaction (for the page header) and the matched
  // receipt (for the itemized layout). The receipt request is allowed to
  // 404 — that's the "not yet matched" branch, not a hard error.
  useEffect(() => {
    if (!user || !transactionId) return
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.allSettled([
      fetchTransactionById(transactionId),
      fetchTransactionReceipt(transactionId),
    ]).then(([txResult, receiptResult]) => {
      if (cancelled) return

      if (txResult.status === "fulfilled") {
        setTransaction(txResult.value)
      } else {
        console.error("[Transactions] Failed to load transaction:", txResult.reason)
      }

      if (receiptResult.status === "fulfilled") {
        setReceipt(receiptResult.value.receipt)
        setHasReceipt(!!receiptResult.value.receipt)
        setMatchMethod(
          receiptResult.value.matchMethod || receiptResult.value.match_method || null
        )
      } else {
        if (receiptResult.reason instanceof TransactionReceiptNotFoundError) {
          // Expected — the transaction has no matched receipt yet.
          setReceipt(null)
          setHasReceipt(false)
        } else {
          console.error("[Transactions] Failed to load receipt:", receiptResult.reason)
          setError("Couldn't load this transaction's receipt.")
        }
      }

      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [user, transactionId])

  if (isLoading || loading) {
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

  // If both lookups failed and we have nothing to render, show a not-found
  // page. We accept rendering with `transaction=null` as long as we can show
  // the receipt — but if both are missing, there's nothing to display.
  if (!transaction && !hasReceipt) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-[var(--muted)]">
            <Receipt className="h-8 w-8 text-[var(--muted-foreground)]" />
          </div>
          <h2 className="mt-4 text-lg font-medium">Transaction not found</h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            We couldn&apos;t find this transaction.
          </p>
          <Link
            href="/consumer/transactions"
            className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--primary)] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Transactions
          </Link>
        </div>
      </div>
    )
  }

  const Icon = getTransactionIcon(transaction)
  const categoryColor = getCategoryColor(transaction)
  const categoryLabel = getCategoryLabel(transaction)
  const merchant =
    transaction
      ? transactionDisplayName(transaction)
      : receipt?.merchantName || receipt?.merchant_name || "Transaction"
  const totalAmount =
    transaction
      ? Math.abs(transaction.amount)
      : receipt?.total ?? 0
  const transactionDate = transaction?.date || receipt?.date

  const items = receipt?.items ?? []
  const subtotal = receipt?.subtotal
  const tax = receipt?.tax
  const receiptTotal = receipt?.total ?? totalAmount

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
            <Link
              href="/consumer/transactions"
              className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Transactions</span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!hasReceipt}
              className="flex items-center justify-center gap-2 rounded-md p-2 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Share receipt"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={!hasReceipt}
              className="flex items-center justify-center gap-2 rounded-md p-2 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Download receipt"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
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
          <div className="mx-auto max-w-3xl space-y-6 w-full">
            {error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {/* Transaction Header */}
            <div className="rounded-lg border border-[var(--border)] overflow-hidden">
              <div className="bg-gradient-to-r from-[var(--primary)]/5 to-transparent p-4 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full",
                    categoryColor
                  )}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <h1 className="text-xl font-semibold">{merchant}</h1>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="secondary" className={cn("capitalize", categoryColor)}>
                            {categoryLabel}
                          </Badge>
                          {hasReceipt ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span className="text-xs font-medium">
                                Itemized receipt{matchMethod ? ` · ${matchMethod}` : ""}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-[var(--muted-foreground)]">
                              No itemized receipt yet
                            </span>
                          )}
                          {transaction?.pending ? (
                            <span className="text-xs text-amber-600 font-medium">Pending</span>
                          ) : null}
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta */}
              <div className="border-t border-[var(--border)] p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {transactionDate ? (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-[var(--muted-foreground)]" />
                    <div>
                      <p className="text-xs text-[var(--muted-foreground)]">Date</p>
                      <p className="text-sm font-medium">{formatLongDate(transactionDate)}</p>
                    </div>
                  </div>
                ) : null}
                {transaction?.accountId || transaction?.account_id ? (
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-[var(--muted-foreground)]" />
                    <div>
                      <p className="text-xs text-[var(--muted-foreground)]">Account</p>
                      <p className="text-sm font-medium font-mono">
                        {transaction.accountId || transaction.account_id}
                      </p>
                    </div>
                  </div>
                ) : null}
                <div className="flex items-center gap-3">
                  <Hash className="h-5 w-5 text-[var(--muted-foreground)]" />
                  <div>
                    <p className="text-xs text-[var(--muted-foreground)]">Transaction ID</p>
                    <p className="text-sm font-medium font-mono break-all">{transactionId}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Itemized receipt or empty state */}
            {hasReceipt && receipt ? (
              <>
                <div className="rounded-lg border border-[var(--border)]">
                  <div className="border-b border-[var(--border)] px-4 py-3 sm:px-6">
                    <h2 className="font-semibold">Items ({items.length})</h2>
                  </div>
                  {items.length === 0 ? (
                    <div className="px-4 py-8 sm:px-6 text-center text-sm text-[var(--muted-foreground)]">
                      The merchant didn&apos;t provide line items for this receipt.
                    </div>
                  ) : (
                    <div className="divide-y divide-[var(--border)]">
                      {items.map((item, index) => {
                        const description = receiptItemDescription(item)
                        const unit = receiptItemUnitPrice(item)
                        const total = receiptItemTotalPrice(item)
                        return (
                          <div key={item.id || index} className="flex items-center justify-between p-4 sm:px-6">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">{description}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <p className="text-sm text-[var(--muted-foreground)]">
                                  {item.quantity && item.quantity > 1 && unit !== undefined
                                    ? `${item.quantity} × $${unit.toFixed(2)}`
                                    : unit !== undefined
                                    ? `$${unit.toFixed(2)}`
                                    : null}
                                </p>
                                {item.sku ? (
                                  <span className="text-xs text-[var(--muted-foreground)] font-mono">
                                    {item.sku}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            {total !== undefined ? (
                              <p className="font-semibold ml-4">${total.toFixed(2)}</p>
                            ) : null}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="rounded-lg border border-[var(--border)]">
                  <div className="p-4 sm:p-6 space-y-3">
                    {subtotal !== undefined ? (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--muted-foreground)]">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                    ) : null}
                    {tax !== undefined ? (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--muted-foreground)]">Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                    ) : null}
                    <div className="border-t border-[var(--border)] pt-3 flex items-center justify-between">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold">${receiptTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-[var(--muted)]/50 p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-[var(--muted-foreground)]">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Digital receipt delivered via Vero</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-dashed border-[var(--border)] p-8 text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-[var(--muted)]">
                  <FileText className="h-6 w-6 text-[var(--muted-foreground)]" />
                </div>
                <h3 className="mt-4 font-medium">No itemized receipt yet</h3>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  We haven&apos;t matched a receipt to this transaction yet. Receipts can be
                  matched automatically from your email, or scanned manually.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
