"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useUser } from "@auth0/nextjs-auth0/client"
import { cn } from "@/lib/utils"
import {
  Receipt,
  LayoutDashboard,
  Users,
  Key,
  Settings,
  CircleHelp,
  Search,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Code,
  FileBarChart,
  MoreHorizontal,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Clock,
  AlertCircle,
  Store,
  Eye,
  Calendar,
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

// Sample receipts data - Note: NO line items shown for privacy
const receiptsData = [
  {
    id: "rcpt_001",
    transactionId: "txn_8f7e6d5c4b",
    merchant: "Walmart Supercenter",
    merchantId: "m_walmart_01",
    cardLast4: "4582",
    amount: 127.43,
    currency: "USD",
    timestamp: "2025-01-31T14:23:45Z",
    status: "delivered",
    rendered: true,
  },
  {
    id: "rcpt_002",
    transactionId: "txn_4a3b2c1d0e",
    merchant: "Target",
    merchantId: "m_target_05",
    cardLast4: "8923",
    amount: 89.99,
    currency: "USD",
    timestamp: "2025-01-31T13:15:22Z",
    status: "delivered",
    rendered: true,
  },
  {
    id: "rcpt_003",
    transactionId: "txn_9g8h7i6j5k",
    merchant: "Costco Wholesale",
    merchantId: "m_costco_12",
    cardLast4: "1256",
    amount: 245.67,
    currency: "USD",
    timestamp: "2025-01-31T12:45:10Z",
    status: "failed",
    rendered: false,
    errorCode: "DELIVERY_TIMEOUT",
  },
  {
    id: "rcpt_004",
    transactionId: "txn_2k3l4m5n6o",
    merchant: "Whole Foods Market",
    merchantId: "m_wholefoods_03",
    cardLast4: "7341",
    amount: 78.32,
    currency: "USD",
    timestamp: "2025-01-31T11:30:00Z",
    status: "delivered",
    rendered: false,
  },
  {
    id: "rcpt_005",
    transactionId: "txn_6o7p8q9r0s",
    merchant: "Best Buy",
    merchantId: "m_bestbuy_08",
    cardLast4: "5629",
    amount: 459.99,
    currency: "USD",
    timestamp: "2025-01-31T10:22:33Z",
    status: "delivered",
    rendered: true,
  },
  {
    id: "rcpt_006",
    transactionId: "txn_1t2u3v4w5x",
    merchant: "Home Depot",
    merchantId: "m_homedepot_15",
    cardLast4: "3847",
    amount: 312.45,
    currency: "USD",
    timestamp: "2025-01-31T09:15:45Z",
    status: "failed",
    rendered: false,
    errorCode: "INVALID_FORMAT",
  },
  {
    id: "rcpt_007",
    transactionId: "txn_6y7z8a9b0c",
    merchant: "Starbucks",
    merchantId: "m_starbucks_22",
    cardLast4: "9012",
    amount: 12.75,
    currency: "USD",
    timestamp: "2025-01-31T08:45:00Z",
    status: "delivered",
    rendered: true,
  },
  {
    id: "rcpt_008",
    transactionId: "txn_1d2e3f4g5h",
    merchant: "Amazon Fresh",
    merchantId: "m_amazonfresh_01",
    cardLast4: "6754",
    amount: 156.89,
    currency: "USD",
    timestamp: "2025-01-30T22:30:15Z",
    status: "delivered",
    rendered: true,
  },
  {
    id: "rcpt_009",
    transactionId: "txn_6i7j8k9l0m",
    merchant: "Trader Joe's",
    merchantId: "m_traderjoes_07",
    cardLast4: "2198",
    amount: 67.23,
    currency: "USD",
    timestamp: "2025-01-30T20:15:30Z",
    status: "pending",
    rendered: false,
  },
  {
    id: "rcpt_010",
    transactionId: "txn_1n2o3p4q5r",
    merchant: "CVS Pharmacy",
    merchantId: "m_cvs_33",
    cardLast4: "8456",
    amount: 34.56,
    currency: "USD",
    timestamp: "2025-01-30T18:45:00Z",
    status: "delivered",
    rendered: false,
  },
]

const DOCS_URL = "https://docs.seevero.com"

const mainNavItems = [
  { name: "Overview", href: "/issuer-dashboard", icon: LayoutDashboard },
  { name: "Receipts", href: "/issuer-dashboard/receipts", icon: Receipt, active: true },
  { name: "Users", href: "/issuer-dashboard/users", icon: Users },
  { name: "API Keys", href: "/issuer-dashboard/keys", icon: Key },
]

const documentNavItems = [
  { name: "API Docs", href: DOCS_URL, icon: Code, external: true },
  { name: "Reports", href: DOCS_URL, icon: FileBarChart, external: true },
  { name: "More", href: DOCS_URL, icon: MoreHorizontal, external: true },
]

const bottomNavItems = [
  { name: "Settings", href: "/issuer-dashboard/settings", icon: Settings },
  { name: "Get Help", href: "/contact", icon: CircleHelp },
  { name: "Search", href: DOCS_URL, icon: Search, external: true },
]

function IssuerReceiptsPageContent() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<"all" | "delivered" | "failed" | "pending">(
    (searchParams.get("filter") === "issues" ? "failed" : "all") as "all" | "delivered" | "failed" | "pending"
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

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
      router.push("/auth/login?returnTo=/issuer-dashboard/receipts")
    }
  }, [user, isLoading, router])

  // Filter receipts
  const filteredReceipts = receiptsData.filter((r) => {
    const matchesStatus =
      filterStatus === "all" || r.status === filterStatus
    const matchesSearch =
      searchQuery === "" ||
      r.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cardLast4.includes(searchQuery)
    return matchesStatus && matchesSearch
  })

  // Calculate stats
  const totalReceipts = receiptsData.length
  const deliveredReceipts = receiptsData.filter((r) => r.status === "delivered").length
  const failedReceipts = receiptsData.filter((r) => r.status === "failed").length
  const renderedReceipts = receiptsData.filter((r) => r.rendered).length

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

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
    <div className="flex min-h-screen w-full bg-white overflow-x-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "hidden flex-col border-r border-[var(--border)] lg:flex transition-all duration-300",
        sidebarCollapsed ? "w-[60px]" : "w-[240px]"
      )}>
        {/* Logo */}
        <div className="flex h-14 items-center px-4">
          <Link href="/issuer-dashboard">
            {!sidebarCollapsed && <VeroLogoFull height={20} className="text-[var(--foreground)]" />}
            {sidebarCollapsed && <VeroLogo size={20} className="text-[var(--foreground)]" />}
          </Link>
        </div>

        {/* Main Navigation */}
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

          {/* Documents Section */}
          {!sidebarCollapsed && (
            <div className="pt-4">
              <p className="px-3 py-2 text-xs font-medium text-[var(--muted-foreground)]">
                Resources
              </p>
              {documentNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          )}
          {sidebarCollapsed && (
            <div className="pt-4 space-y-1">
              {documentNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  title={item.name}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex items-center justify-center rounded-md px-2 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  <item.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          )}
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-[var(--border)] px-3 py-2">
          {bottomNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              title={sidebarCollapsed ? item.name : undefined}
              {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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

        {/* User Profile */}
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
        {/* Header */}
        <header className="flex h-14 items-center justify-between border-b border-[var(--border)] px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center rounded-md p-1.5 hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            {/* Desktop sidebar toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex items-center justify-center rounded-md p-1.5 hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </button>
            <span className="text-sm font-medium">Receipts</span>
          </div>
          <Link href="/issuer-dashboard" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            Back to Dashboard
          </Link>
        </header>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-14 z-50 bg-white overflow-y-auto">
            <div className="px-4 py-4">
              {/* User Profile at top */}
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

              {/* Main Navigation */}
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

              {/* Documents Section */}
              <div className="py-4 border-t border-[var(--border)]">
                <p className="px-3 py-2 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
                  Resources
                </p>
                {documentNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => !item.external && setMobileMenuOpen(false)}
                    {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Bottom Navigation */}
              <div className="py-4 border-t border-[var(--border)]">
                {bottomNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => !item.external && setMobileMenuOpen(false)}
                    {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Logout */}
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

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6 w-full">
            {/* Page Header */}
            <div className="mb-2">
              <h1 className="text-2xl font-semibold">Receipt Tracking</h1>
              <p className="text-sm text-[var(--muted-foreground)]">
                Monitor receipt delivery status and track issues
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-[var(--border)] p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">Total</p>
                <p className="mt-1 text-lg sm:text-2xl font-semibold">{totalReceipts.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border border-[var(--border)] p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">Delivered</p>
                <p className="mt-1 text-lg sm:text-2xl font-semibold text-green-600">{deliveredReceipts.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border border-[var(--border)] p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">Failed</p>
                <p className="mt-1 text-lg sm:text-2xl font-semibold text-red-600">{failedReceipts.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border border-[var(--border)] p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">Rendered</p>
                <p className="mt-1 text-lg sm:text-2xl font-semibold text-blue-600">{renderedReceipts.toLocaleString()}</p>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap",
                    filterStatus === "all"
                      ? "bg-[var(--foreground)] text-white"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                  )}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus("delivered")}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap",
                    filterStatus === "delivered"
                      ? "bg-[var(--foreground)] text-white"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                  )}
                >
                  Delivered
                </button>
                <button
                  onClick={() => setFilterStatus("failed")}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap",
                    filterStatus === "failed"
                      ? "bg-[var(--foreground)] text-white"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                  )}
                >
                  Failed
                </button>
                <button
                  onClick={() => setFilterStatus("pending")}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap",
                    filterStatus === "pending"
                      ? "bg-[var(--foreground)] text-white"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                  )}
                >
                  Pending
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-full rounded-md border border-[var(--border)] bg-white pl-9 pr-4 text-sm placeholder:text-[var(--muted-foreground)] focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] sm:w-[200px]"
                  />
                </div>
                <button className="flex h-9 items-center gap-2 rounded-md border border-[var(--border)] px-3 text-sm hover:bg-[var(--muted)]">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>

            {/* Receipts Table */}
            <div className="rounded-lg border border-[var(--border)]">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Merchant</TableHead>
                      <TableHead className="hidden sm:table-cell">Card</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Viewed</TableHead>
                      <TableHead className="hidden lg:table-cell">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReceipts.map((receipt) => (
                      <TableRow key={receipt.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Store className="h-4 w-4 text-[var(--muted-foreground)] hidden sm:block" />
                            <span className="font-medium text-sm truncate max-w-[120px] sm:max-w-none">{receipt.merchant}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="font-mono text-sm">****{receipt.cardLast4}</span>
                        </TableCell>
                        <TableCell className="font-medium text-sm">
                          {formatCurrency(receipt.amount, receipt.currency)}
                        </TableCell>
                        <TableCell>
                          {receipt.status === "delivered" && (
                            <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
                              Delivered
                            </Badge>
                          )}
                          {receipt.status === "failed" && (
                            <div className="flex flex-col gap-1">
                              <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100">
                                Failed
                              </Badge>
                              {receipt.errorCode && (
                                <span className="text-xs font-mono text-red-600 hidden sm:block">{receipt.errorCode}</span>
                              )}
                            </div>
                          )}
                          {receipt.status === "pending" && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {receipt.rendered ? (
                            <div className="flex items-center gap-1.5 text-green-600">
                              <Eye className="h-3.5 w-3.5" />
                              <span className="text-sm">Yes</span>
                            </div>
                          ) : (
                            <span className="text-sm text-[var(--muted-foreground)]">No</span>
                          )}
                        </TableCell>
                        <TableCell className="text-[var(--muted-foreground)] hidden lg:table-cell">
                          {formatTimestamp(receipt.timestamp)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-3">
                <p className="text-sm text-[var(--muted-foreground)]">
                  Showing {filteredReceipts.length} of {totalReceipts} receipts
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] hover:bg-[var(--muted)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm">Page {currentPage}</span>
                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={filteredReceipts.length < itemsPerPage}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] hover:bg-[var(--muted)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 p-4">
              <h3 className="font-medium mb-2">Receipt Privacy</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                For cardholder privacy, only receipt metadata is displayed. Line items and detailed purchase
                information are not accessible from this dashboard. You can track delivery status, view times,
                and troubleshoot issues without accessing sensitive purchase details.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default function IssuerReceiptsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <VeroLogo size={48} spinning className="text-[var(--primary)]" />
          <p className="text-sm text-[var(--muted-foreground)]">Loading...</p>
        </div>
      </div>
    }>
      <IssuerReceiptsPageContent />
    </Suspense>
  )
}
