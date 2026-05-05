"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@auth0/nextjs-auth0/client"
import { cn } from "@/lib/utils"
import {
  Receipt,
  X,
  Gift,
  Copy,
  Check,
  ShoppingBag,
  Coffee,
  Utensils,
  Car,
  Zap,
  Store,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Calendar,
  Users,
  Landmark,
  Plus,
  CreditCard,
  Loader2,
} from "lucide-react"
import { PlaidLinkModal } from "@/components/plaid-link-modal"
import { fetchPlaidAccounts, type PlaidAccount } from "@/lib/plaid"
import {
  cacheTransactionForDetail,
  fetchTransactions,
  transactionDisplayName,
  type Transaction,
} from "@/lib/transactions"
import {
  formatTxShortDate,
  getTransactionIcon,
} from "@/lib/category-display"
import { useMainScrollRestore } from "@/lib/use-main-scroll-restore"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

// Sample receipts shown in the "Recent Transactions" card while we're still
// loading or before the user has connected an account. Once /api/transactions
// returns rows, this fallback is replaced by real data.
const recentReceipts = [
  {
    id: "rcpt_001",
    merchant: "Whole Foods Market",
    amount: 87.45,
    date: "Today, 2:34 PM",
    category: "groceries",
    items: 12,
  },
  {
    id: "rcpt_002",
    merchant: "Starbucks",
    amount: 6.75,
    date: "Today, 9:15 AM",
    category: "coffee",
    items: 2,
  },
  {
    id: "rcpt_003",
    merchant: "Shell Gas Station",
    amount: 52.30,
    date: "Yesterday, 5:45 PM",
    category: "gas",
    items: 1,
  },
  {
    id: "rcpt_004",
    merchant: "Chipotle",
    amount: 14.25,
    date: "Yesterday, 12:30 PM",
    category: "dining",
    items: 3,
  },
  {
    id: "rcpt_005",
    merchant: "Target",
    amount: 156.80,
    date: "Jan 30, 3:20 PM",
    category: "shopping",
    items: 8,
  },
]

// Onboarding steps - status can be 'completed', 'current', or 'pending'
const onboardingSteps = [
  {
    id: 1,
    title: "Connect an account",
    description: "Link your bank or credit card via Plaid",
    status: "completed" as const,
    href: "/consumer/accounts",
  },
  {
    id: 2,
    title: "Make a purchase",
    description: "Shop at a Vero-connected merchant",
    status: "completed" as const,
    href: null,
  },
  {
    id: 3,
    title: "View receipt details",
    description: "See itemized receipt information",
    status: "current" as const,
    href: "/consumer/transactions",
  },
  {
    id: 4,
    title: "Refer a friend",
    description: "Earn $5 for each friend who joins",
    status: "pending" as const,
    href: null,
  },
]

export default function ConsumerDashboardPage() {
  const { user } = useUser()
  const router = useRouter()
  const [chartRange, setChartRange] = useState("7days")
  const [referralCopied, setReferralCopied] = useState(false)
  const [showPlaidModal, setShowPlaidModal] = useState(false)
  const [checklistCollapsed, setChecklistCollapsed] = useState(false)
  const [referralDismissed, setReferralDismissed] = useState(false)
  const [gettingStartedDismissed, setGettingStartedDismissed] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  const [transactionsError, setTransactionsError] = useState<string | null>(null)
  const [accounts, setAccounts] = useState<PlaidAccount[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.localStorage.getItem('vero:consumer:referralDismissed') === '1') {
      setReferralDismissed(true)
    }
    if (window.localStorage.getItem('vero:consumer:gettingStartedDismissed') === '1') {
      setGettingStartedDismissed(true)
    }
  }, [])

  const dismissReferral = useCallback(() => {
    setReferralDismissed(true)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('vero:consumer:referralDismissed', '1')
    }
  }, [])

  const dismissGettingStarted = useCallback(() => {
    setGettingStartedDismissed(true)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('vero:consumer:gettingStartedDismissed', '1')
    }
  }, [])

  // Generate a simple referral code based on user
  const referralCode = user?.email ? `VERO${user.email.substring(0, 4).toUpperCase()}5` : "VERO5"

  const copyReferralLink = () => {
    const referralUrl = `https://veroreceipts.com/signup?ref=${referralCode}`
    navigator.clipboard.writeText(referralUrl)
    setReferralCopied(true)
    setTimeout(() => setReferralCopied(false), 2000)
  }

  // Pull real transactions from /api/transactions. The proxy returns an empty
  // array when no Plaid item is connected, so this is also safe pre-link —
  // the UI just falls back to the sample data below.
  useEffect(() => {
    let cancelled = false
    setTransactionsLoading(true)
    setTransactionsError(null)
    fetchTransactions()
      .then((res) => {
        if (cancelled) return
        setTransactions(res.transactions ?? [])
      })
      .catch((err) => {
        if (cancelled) return
        console.error("[Transactions] Failed to load:", err)
        setTransactionsError("Couldn't load your transactions.")
      })
      .finally(() => {
        if (!cancelled) setTransactionsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Pull the list of Plaid-connected accounts so the "Linked Accounts" card
  // renders the user's real institutions instead of placeholder chips.
  useEffect(() => {
    let cancelled = false
    fetchPlaidAccounts()
      .then((res) => {
        if (cancelled) return
        setAccounts(res.accounts ?? [])
      })
      .catch((err) => {
        if (cancelled) return
        console.error("[Plaid] Failed to load accounts:", err)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Restore the dashboard's scroll position after returning from a
  // transaction detail opened from the "Recent Transactions" card.
  const saveDashboardScroll = useMainScrollRestore(
    "vero:consumer:dashboard:scrollTop",
    !transactionsLoading
  )

  // Derive the "Spending Overview" series from real transactions for the
  // selected range. Plaid expense amounts are positive; negative values are
  // refunds/credits and are excluded from spending totals. Buckets are
  // ordered oldest → newest left-to-right so the chart reads as time
  // moving forward.
  const chartData = useMemo(() => {
    const now = new Date()
    const dayMs = 86_400_000
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    const expenses = transactions.filter((tx) => tx.amount > 0)

    if (chartRange === "7days") {
      const start = new Date(now)
      start.setHours(0, 0, 0, 0)
      start.setDate(start.getDate() - 6)
      const buckets: { date: string; amount: number }[] = []
      for (let i = 0; i < 7; i++) {
        const d = new Date(start.getTime() + i * dayMs)
        buckets.push({ date: dayNames[d.getDay()], amount: 0 })
      }
      for (const tx of expenses) {
        const d = new Date(tx.date)
        if (Number.isNaN(d.getTime())) continue
        d.setHours(0, 0, 0, 0)
        const idx = Math.floor((d.getTime() - start.getTime()) / dayMs)
        if (idx >= 0 && idx < 7) buckets[idx].amount += tx.amount
      }
      return buckets
    }

    if (chartRange === "30days") {
      // Match the previous sample shape: 4 weekly buckets, oldest → newest.
      const start = new Date(now)
      start.setHours(0, 0, 0, 0)
      start.setDate(start.getDate() - 27)
      const buckets = [
        { date: "Week 1", amount: 0 },
        { date: "Week 2", amount: 0 },
        { date: "Week 3", amount: 0 },
        { date: "Week 4", amount: 0 },
      ]
      for (const tx of expenses) {
        const d = new Date(tx.date)
        if (Number.isNaN(d.getTime())) continue
        d.setHours(0, 0, 0, 0)
        const dayIdx = Math.floor((d.getTime() - start.getTime()) / dayMs)
        if (dayIdx < 0 || dayIdx >= 28) continue
        buckets[Math.floor(dayIdx / 7)].amount += tx.amount
      }
      return buckets
    }

    // 3 months: one bucket per recent calendar month, oldest → newest.
    const months: { date: string; amount: number; year: number; month: number }[] = []
    for (let i = 2; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        date: d.toLocaleDateString(undefined, { month: "short" }),
        amount: 0,
        year: d.getFullYear(),
        month: d.getMonth(),
      })
    }
    for (const tx of expenses) {
      const d = new Date(tx.date)
      if (Number.isNaN(d.getTime())) continue
      const target = months.find(
        (m) => m.year === d.getFullYear() && m.month === d.getMonth()
      )
      if (target) target.amount += tx.amount
    }
    return months.map(({ date, amount }) => ({ date, amount }))
  }, [chartRange, transactions])

  const chartPeriodLabel = useMemo(() => {
    switch (chartRange) {
      case "7days":
        return "last 7 days"
      case "30days":
        return "last 30 days"
      case "3months":
      default:
        return "last 3 months"
    }
  }, [chartRange])

  const totalSpending = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.amount, 0)
  }, [chartData])

  // The fallback "sample receipts" list (rendered before the user has linked
  // an account) labels each row by a string category, not a Plaid tag, so
  // it can't share getTransactionIcon. Keep this small mapping local.
  const getSampleReceiptIcon = (category: string) => {
    switch (category) {
      case "groceries":
        return ShoppingBag
      case "coffee":
        return Coffee
      case "dining":
        return Utensils
      case "gas":
        return Car
      case "shopping":
        return Store
      default:
        return Receipt
    }
  }

  const recentTransactions = useMemo(() => transactions.slice(0, 5), [transactions])
  const hasRealTransactions = recentTransactions.length > 0

  // Stats derived from real transactions. "This month" sums positive (expense)
  // amounts whose date falls in the current calendar month. Total Transactions
  // counts every tx we received from /api/transactions. Merchants is the
  // distinct count of merchant display names.
  const thisMonthSpending = useMemo(() => {
    const now = new Date()
    let total = 0
    for (const tx of transactions) {
      if (tx.amount <= 0) continue
      const d = new Date(tx.date)
      if (Number.isNaN(d.getTime())) continue
      if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()) {
        total += tx.amount
      }
    }
    return total
  }, [transactions])

  const merchantCount = useMemo(() => {
    const set = new Set<string>()
    for (const tx of transactions) {
      const name = transactionDisplayName(tx)
      if (name) set.add(name)
    }
    return set.size
  }, [transactions])

  // Spending-by-category bars derived from Plaid PFC tags on each transaction.
  // We map the various tag strings into a small set of display buckets that
  // match the existing UI palette. Buckets with zero spend are filtered out
  // so the bar list collapses gracefully when there's little data.
  const categorySpending = useMemo(() => {
    const defs: Array<{
      name: string
      icon: typeof ShoppingBag
      needles: string[]
    }> = [
      { name: "Groceries", icon: ShoppingBag, needles: ["grocery", "supermarket"] },
      { name: "Dining", icon: Utensils, needles: ["restaurant", "food and drink", "dining", "fast food"] },
      { name: "Gas & Auto", icon: Car, needles: ["gas", "fuel", "automotive"] },
      { name: "Coffee", icon: Coffee, needles: ["coffee"] },
      { name: "Shopping", icon: Store, needles: ["shop", "retail", "merchandise"] },
      { name: "Other", icon: Receipt, needles: [] },
    ]
    const totals = defs.map((d) => ({ ...d, amount: 0 }))
    for (const tx of transactions) {
      if (tx.amount <= 0) continue
      const tags = (tx.category || []).map((c) => c.toLowerCase())
      let placed = false
      for (let i = 0; i < totals.length - 1; i++) {
        if (totals[i].needles.some((n) => tags.some((t) => t.includes(n)))) {
          totals[i].amount += tx.amount
          placed = true
          break
        }
      }
      if (!placed) totals[totals.length - 1].amount += tx.amount
    }
    const grand = totals.reduce((s, b) => s + b.amount, 0)
    return totals
      .filter((b) => b.amount > 0)
      .map((b) => ({
        ...b,
        percentage: grand > 0 ? Math.round((b.amount / grand) * 100) : 0,
      }))
  }, [transactions])

  return (
    <>
      <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6 w-full">
        {/* Referral Banner - Compact */}
        {!referralDismissed && (
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-[var(--primary)] to-blue-600 p-4 sm:p-5 pr-10 sm:pr-12 text-white">
            <button
              onClick={dismissReferral}
              aria-label="Dismiss referral banner"
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 flex-shrink-0">
                  <Gift className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold">Refer a Friend, Get $5</h2>
                  <p className="text-white/80 text-sm hidden sm:block">
                    Share Vero and you both get $5 when they join
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-white/20 rounded px-2.5 py-1.5 font-mono">{referralCode}</span>
                <button
                  onClick={copyReferralLink}
                  className="flex items-center gap-1.5 rounded bg-white px-2.5 py-1.5 text-xs font-medium text-[var(--primary)] hover:bg-white/90 transition-colors"
                >
                  {referralCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{referralCopied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Header */}
        <div>
          <h1 className="text-2xl font-semibold">Welcome back, {user?.name?.split(' ')[0] || 'there'}</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Here&apos;s an overview of your recent spending
          </p>
        </div>

        {/* Getting Started Checklist - Clean Version */}
        {!gettingStartedDismissed && (
        <div className="rounded-lg border border-[var(--border)] overflow-hidden">
          <div className="flex items-stretch hover:bg-[var(--muted)]/30 transition-colors">
            <button
              onClick={() => setChecklistCollapsed(!checklistCollapsed)}
              className="flex flex-1 items-center justify-between px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)]/10">
                  <Zap className="h-3.5 w-3.5 text-[var(--primary)]" />
                </div>
                <div className="text-left">
                  <h2 className="font-medium text-sm">Getting Started</h2>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {onboardingSteps.filter(s => s.status === 'completed').length} of {onboardingSteps.length} completed
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {onboardingSteps.map((step) => (
                    <div
                      key={step.id}
                      className={cn(
                        "h-1.5 w-6 rounded-full transition-colors",
                        step.status === 'completed' ? "bg-green-500" :
                        step.status === 'current' ? "bg-[var(--primary)]" :
                        "bg-[var(--muted)]"
                      )}
                    />
                  ))}
                </div>
                {checklistCollapsed ? (
                  <ChevronDown className="h-4 w-4 text-[var(--muted-foreground)]" />
                ) : (
                  <ChevronUp className="h-4 w-4 text-[var(--muted-foreground)]" />
                )}
              </div>
            </button>
            <button
              onClick={dismissGettingStarted}
              aria-label="Dismiss Getting Started"
              className="flex items-center justify-center px-3 text-[var(--muted-foreground)] hover:text-[var(--foreground)] border-l border-[var(--border)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {!checklistCollapsed && (
            <div className="border-t border-[var(--border)]">
              {/* Mobile: Compact horizontal scroll */}
              <div className="sm:hidden overflow-x-auto">
                <div className="flex gap-3 p-3 min-w-max">
                  {onboardingSteps.map((step) => {
                    const content = (
                      <div
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-3 py-2 min-w-[180px]",
                          step.status === 'completed' ? "bg-green-50" :
                          step.status === 'current' ? "bg-[var(--primary)]/5" :
                          "bg-[var(--muted)]/50"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full flex-shrink-0",
                            step.status === 'completed' ? "bg-green-500 text-white" :
                            step.status === 'current' ? "bg-[var(--primary)] text-white" :
                            "bg-[var(--muted)] text-[var(--muted-foreground)]"
                          )}
                        >
                          {step.status === 'completed' ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <span className="text-xs font-medium">{step.id}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className={cn(
                            "text-xs font-medium truncate",
                            step.status === 'pending' && "text-[var(--muted-foreground)]"
                          )}>
                            {step.title}
                          </p>
                          <p className={cn(
                            "text-[10px]",
                            step.status === 'completed' ? "text-green-600" :
                            step.status === 'current' ? "text-[var(--primary)]" :
                            "text-[var(--muted-foreground)]"
                          )}>
                            {step.status === 'completed' ? "Done" :
                             step.status === 'current' ? "Next" : "Pending"}
                          </p>
                        </div>
                      </div>
                    )
                    return step.href ? (
                      <Link key={step.id} href={step.href}>{content}</Link>
                    ) : (
                      <div key={step.id}>{content}</div>
                    )
                  })}
                </div>
              </div>

              {/* Desktop: Grid layout */}
              <div className="hidden sm:grid sm:grid-cols-4 divide-x divide-[var(--border)]">
                {onboardingSteps.map((step) => {
                  const content = (
                    <div
                      className={cn(
                        "p-4 transition-colors",
                        step.status === 'completed' ? "bg-green-50/50" :
                        step.status === 'current' ? "bg-[var(--primary)]/5" :
                        "bg-transparent",
                        step.href && "hover:bg-[var(--muted)]/50 cursor-pointer"
                      )}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0",
                            step.status === 'completed' ? "bg-green-500 text-white" :
                            step.status === 'current' ? "bg-[var(--primary)] text-white" :
                            "bg-[var(--muted)] text-[var(--muted-foreground)]"
                          )}
                        >
                          {step.status === 'completed' ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <span className="text-sm font-medium">{step.id}</span>
                          )}
                        </div>
                        {step.status === 'current' && (
                          <span className="text-[10px] font-medium text-[var(--primary)] bg-[var(--primary)]/10 px-1.5 py-0.5 rounded">
                            NEXT
                          </span>
                        )}
                      </div>
                      <h3 className={cn(
                        "font-medium text-sm",
                        step.status === 'pending' && "text-[var(--muted-foreground)]"
                      )}>
                        {step.title}
                      </h3>
                      <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  )
                  return step.href ? (
                    <Link key={step.id} href={step.href}>{content}</Link>
                  ) : (
                    <div key={step.id}>{content}</div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
        )}

        {/* Linked Accounts Card */}
        <button
          onClick={() => setShowPlaidModal(true)}
          className="w-full rounded-lg border border-[var(--border)] p-4 sm:p-6 hover:bg-[var(--muted)]/50 hover:border-[var(--primary)]/30 transition-colors text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)]/10">
                <Landmark className="h-6 w-6 text-[var(--primary)]" />
              </div>
              <div>
                <h3 className="font-semibold">Linked Accounts</h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {accounts.length} account{accounts.length !== 1 ? 's' : ''} connected
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {accounts.length > 0 && (
                <div className="hidden sm:flex -space-x-2">
                  {accounts.slice(0, 3).map((account) => {
                    const institution =
                      account.institutionName || account.institution_name || account.institution || account.name
                    return (
                      <div
                        key={account.id}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--muted)] border-2 border-white text-xs font-medium"
                        title={account.name}
                      >
                        {institution?.charAt(0) ?? "?"}
                      </div>
                    )
                  })}
                </div>
              )}
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                <Plus className="h-4 w-4" />
              </div>
            </div>
          </div>
          {accounts.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {accounts.map((account) => {
                const institution =
                  account.institutionName || account.institution_name || account.institution || account.name
                return (
                  <span
                    key={account.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-medium"
                  >
                    <CreditCard className="h-3 w-3" />
                    {institution}
                    {account.mask ? ` ••${account.mask}` : null}
                  </span>
                )
              })}
            </div>
          )}
        </button>

        {/* Stats Cards */}
        <div className="relative">
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-[var(--border)] p-4">
              <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                <Calendar className="h-4 w-4" />
                <p className="text-xs sm:text-sm">This Month</p>
              </div>
              <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold">
                ${thisMonthSpending.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                {hasRealTransactions ? "Spending so far" : "No transactions yet"}
              </p>
            </div>

            <Link
              href="/consumer/transactions"
              className="rounded-lg border border-[var(--border)] p-4 hover:bg-[var(--muted)]/50 transition-colors cursor-pointer block"
            >
              <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                <Receipt className="h-4 w-4" />
                <p className="text-xs sm:text-sm">Total Transactions</p>
              </div>
              <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold">{transactions.length}</p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">All time</p>
            </Link>

            <div className="rounded-lg border border-[var(--border)] p-4">
              <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                <Store className="h-4 w-4" />
                <p className="text-xs sm:text-sm">Merchants</p>
              </div>
              <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold">{merchantCount}</p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">Unique stores</p>
            </div>

            <div className="rounded-lg border border-[var(--border)] p-4">
              <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                <Users className="h-4 w-4" />
                <p className="text-xs sm:text-sm">Referrals</p>
              </div>
              <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold">0</p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">Invite to earn</p>
            </div>
          </div>
        </div>

        {/* Spending Chart */}
        <div className="relative rounded-lg border border-[var(--border)] p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-semibold">Spending Overview</h3>
              <p className="text-sm text-[var(--muted-foreground)]">Your spending for the {chartPeriodLabel}</p>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setChartRange("3months")}
                className={cn(
                  "rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap",
                  chartRange === "3months"
                    ? "bg-[var(--foreground)] text-white"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                )}
              >
                3 months
              </button>
              <button
                onClick={() => setChartRange("30days")}
                className={cn(
                  "rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap",
                  chartRange === "30days"
                    ? "bg-[var(--foreground)] text-white"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                )}
              >
                30 days
              </button>
              <button
                onClick={() => setChartRange("7days")}
                className={cn(
                  "rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap",
                  chartRange === "7days"
                    ? "bg-[var(--foreground)] text-white"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                )}
              >
                7 days
              </button>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">${totalSpending.toFixed(2)}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Total spent</p>
            </div>
          </div>
          <div className="mt-4 h-[200px] sm:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#525252" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#525252" stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  dx={-10}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                          <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
                          <p className="text-lg font-bold text-[var(--foreground)]">
                            ${Number(payload[0].value).toFixed(2)}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#525252"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSpending)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Empty state when there are no real transactions yet */}
          {!hasRealTransactions && (
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
              <div className="bg-white/95 backdrop-blur-[2px] rounded-lg px-4 py-3 shadow-[0_0_20px_rgba(0,0,0,0.15),0_0_40px_rgba(0,0,0,0.08),0_0_60px_rgba(0,0,0,0.04)] animate-[halo-pulse_3s_ease-in-out_infinite] pointer-events-auto">
                <p className="text-sm text-center">
                  <span className="font-medium">No transactions yet</span>
                  <span className="text-[var(--muted-foreground)]"> · </span>
                  <Link href="/consumer/accounts" className="text-[var(--primary)] hover:underline">
                    Link an account
                  </Link>
                  <span className="text-[var(--muted-foreground)]"> to see your spending</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Two Column Layout: Recent Receipts and Categories */}
        <div className="relative">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Recent Transactions */}
            <div className="rounded-lg border border-[var(--border)]">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
                <div>
                  <h3 className="font-semibold">Recent Transactions</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {hasRealTransactions
                      ? "Your latest transactions"
                      : "Your latest transactions (sample)"}
                  </p>
                </div>
                <Link
                  href="/consumer/transactions"
                  className="flex items-center gap-1 text-sm text-[var(--primary)] hover:underline"
                >
                  View all
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              {hasRealTransactions ? (
                <div className="divide-y divide-[var(--border)]">
                  {recentTransactions.map((tx) => {
                    const CategoryIcon = getTransactionIcon(tx)
                    const merchant = transactionDisplayName(tx)
                    // Plaid expense transactions arrive with a positive amount;
                    // payments/credits arrive negative. Display the magnitude
                    // and let the sign decide the prefix so credits read "+$x".
                    const sign = tx.amount < 0 ? "+" : ""
                    const magnitude = Math.abs(tx.amount).toFixed(2)
                    return (
                      <Link
                        key={tx.id}
                        href={`/consumer/transactions/${tx.id}`}
                        onClick={() => {
                          saveDashboardScroll()
                          cacheTransactionForDetail(tx)
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--muted)]/50 transition-colors"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--muted)]">
                          <CategoryIcon className="h-5 w-5 text-[var(--muted-foreground)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{merchant}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            {formatTxShortDate(tx.date)}
                            {tx.pending ? " · Pending" : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{sign}${magnitude}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            {tx.receipt ? "Itemized" : "No receipt"}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : transactionsLoading ? (
                <div className="flex items-center justify-center px-4 py-12">
                  <Loader2 className="h-5 w-5 animate-spin text-[var(--muted-foreground)]" />
                </div>
              ) : transactionsError ? (
                <div className="px-4 py-6 text-sm text-red-600">
                  {transactionsError}
                </div>
              ) : (
                <div className="divide-y divide-[var(--border)]">
                  {recentReceipts.map((receipt) => {
                    const CategoryIcon = getSampleReceiptIcon(receipt.category)
                    return (
                      <Link
                        key={receipt.id}
                        href="/consumer/transactions"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--muted)]/50 transition-colors"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--muted)]">
                          <CategoryIcon className="h-5 w-5 text-[var(--muted-foreground)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{receipt.merchant}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">{receipt.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${receipt.amount.toFixed(2)}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">{receipt.items} items</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Spending by Category */}
            <div className="rounded-lg border border-[var(--border)]">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
                <div>
                  <h3 className="font-semibold">Spending by Category</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">Across your transactions</p>
                </div>
              </div>
              {categorySpending.length === 0 ? (
                <div className="px-4 py-12 text-center text-sm text-[var(--muted-foreground)]">
                  {hasRealTransactions
                    ? "No categorised spending yet."
                    : "Link an account to see your spending breakdown."}
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {categorySpending.map((category) => {
                    const CategoryIcon = category.icon
                    return (
                      <div key={category.name} className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--muted)]">
                          <CategoryIcon className="h-4 w-4 text-[var(--muted-foreground)]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{category.name}</span>
                            <span className="text-sm font-semibold">${category.amount.toFixed(2)}</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-[var(--muted)]">
                            <div
                              className="h-2 rounded-full bg-gray-500"
                              style={{ width: `${category.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <PlaidLinkModal
        open={showPlaidModal}
        onClose={() => setShowPlaidModal(false)}
        onLinked={() => {
          // The dashboard's account list is still sample data; send the
          // user to the accounts page so they see the freshly linked
          // institution from /api/plaid/accounts.
          router.push("/consumer/accounts")
        }}
      />
    </>
  )
}
