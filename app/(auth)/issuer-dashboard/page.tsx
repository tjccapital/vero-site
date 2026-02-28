"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
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
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Code,
  FileBarChart,
  MoreHorizontal,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Menu,
  X,
  Eye,
  AlertCircle,
  Activity,
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
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts"

// Chart data for receipts over time - different ranges
const chartData3Months = [
  { date: "Nov 1", received: 28600, rendered: 24200 },
  { date: "Nov 15", received: 31200, rendered: 26400 },
  { date: "Dec 1", received: 34500, rendered: 29100 },
  { date: "Dec 15", received: 38900, rendered: 32800 },
  { date: "Jan 1", received: 42300, rendered: 35700 },
  { date: "Jan 15", received: 45800, rendered: 38600 },
]

const chartData30Days = [
  { date: "Jan 1", received: 41200, rendered: 34800 },
  { date: "Jan 8", received: 43500, rendered: 36700 },
  { date: "Jan 15", received: 45800, rendered: 38600 },
  { date: "Jan 22", received: 48200, rendered: 40700 },
  { date: "Jan 29", received: 51300, rendered: 43200 },
]

const chartData7Days = [
  { date: "Jan 25", received: 7250, rendered: 6120 },
  { date: "Jan 26", received: 7480, rendered: 6310 },
  { date: "Jan 27", received: 7120, rendered: 6010 },
  { date: "Jan 28", received: 7890, rendered: 6650 },
  { date: "Jan 29", received: 7340, rendered: 6190 },
  { date: "Jan 30", received: 7650, rendered: 6450 },
  { date: "Jan 31", received: 7580, rendered: 6390 },
]

// Recent issues data
const recentIssues = [
  {
    id: "issue_001",
    type: "delivery_failed",
    merchant: "Acme Retail Co",
    transactionId: "txn_8f7e6d5c",
    timestamp: "2 min ago",
    status: "open",
    errorCode: "RECEIPT_TIMEOUT",
  },
  {
    id: "issue_002",
    type: "invalid_format",
    merchant: "Downtown Cafe",
    transactionId: "txn_4a3b2c1d",
    timestamp: "15 min ago",
    status: "open",
    errorCode: "SCHEMA_VALIDATION",
  },
  {
    id: "issue_003",
    type: "delivery_failed",
    merchant: "Tech Store Plus",
    transactionId: "txn_9g8h7i6j",
    timestamp: "1 hour ago",
    status: "resolved",
    errorCode: "NETWORK_ERROR",
  },
  {
    id: "issue_004",
    type: "duplicate",
    merchant: "Fresh Grocery",
    transactionId: "txn_2k3l4m5n",
    timestamp: "2 hours ago",
    status: "resolved",
    errorCode: "DUPLICATE_RECEIPT",
  },
  {
    id: "issue_005",
    type: "invalid_format",
    merchant: "City Pharmacy",
    transactionId: "txn_6o7p8q9r",
    timestamp: "3 hours ago",
    status: "open",
    errorCode: "MISSING_FIELD",
  },
]

// Top merchants by receipt volume
const topMerchants = [
  { name: "Walmart", receipts: 15420, percentage: 12.3 },
  { name: "Target", receipts: 12890, percentage: 10.3 },
  { name: "Costco", receipts: 9870, percentage: 7.9 },
  { name: "Amazon Fresh", receipts: 8540, percentage: 6.8 },
  { name: "Whole Foods", receipts: 7230, percentage: 5.8 },
]

const DOCS_URL = "https://docs.veroreceipts.com"

const mainNavItems = [
  { name: "Overview", href: "/issuer-dashboard", icon: LayoutDashboard, active: true },
  { name: "Receipts", href: "/issuer-dashboard/receipts", icon: Receipt },
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

export default function IssuerDashboardPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [chartRange, setChartRange] = useState("3months")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
      router.push("/auth/login?returnTo=/issuer-dashboard")
    }
  }, [user, isLoading, router])

  const chartData = useMemo(() => {
    switch (chartRange) {
      case "7days":
        return chartData7Days
      case "30days":
        return chartData30Days
      case "3months":
      default:
        return chartData3Months
    }
  }, [chartRange])

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
        {/* Header - Responsive */}
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
            <span className="text-sm font-medium">Card Issuer Dashboard</span>
          </div>
          <Link href="/" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            Back to Site
          </Link>
        </header>

        {/* Mobile Navigation - Full Screen Overlay */}
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
            {/* Welcome Header */}
            <div className="mb-2">
              <h1 className="text-2xl font-semibold">Welcome back</h1>
              <p className="text-sm text-[var(--muted-foreground)]">
                Monitor digital receipt delivery and cardholder engagement
              </p>
            </div>

            {/* Stats Cards */}
            <div className="relative">
              {/* Sample Data Banner */}
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div className="bg-white/95 backdrop-blur-[2px] rounded-lg px-4 py-3 shadow-[0_0_20px_rgba(0,0,0,0.15),0_0_40px_rgba(0,0,0,0.08),0_0_60px_rgba(0,0,0,0.04)] animate-[halo-pulse_3s_ease-in-out_infinite] pointer-events-auto">
                  <p className="text-sm text-center">
                    <span className="font-medium">Sample Data</span>
                    <span className="text-[var(--muted-foreground)]"> · </span>
                    <Link href="/issuer-dashboard/keys" className="text-[var(--primary)] hover:underline">
                      Configure API Keys
                    </Link>
                    <span className="text-[var(--muted-foreground)]"> to connect real data</span>
                  </p>
                </div>
              </div>
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              {/* Total Receipts Received */}
              <Link
                href="/issuer-dashboard/receipts"
                className="rounded-lg border border-[var(--border)] p-4 hover:bg-[var(--muted)]/50 transition-colors cursor-pointer block h-full"
              >
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">Receipts Received</p>
                <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold">125,847</p>
                <p className="mt-1 text-xs text-green-600">+18.2% last 30 days</p>
              </Link>

              {/* Receipts Rendered */}
              <div className="rounded-lg border border-[var(--border)] p-4 h-full">
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">Receipts Rendered</p>
                <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold">106,212</p>
                <p className="mt-1 text-xs text-green-600">84.4% render rate</p>
              </div>

              {/* Active Users */}
              <Link
                href="/issuer-dashboard/users"
                className="rounded-lg border border-[var(--border)] p-4 hover:bg-[var(--muted)]/50 transition-colors cursor-pointer block h-full"
              >
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">Users with Receipts</p>
                <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold">48,392</p>
                <p className="mt-1 text-xs text-green-600">12.4% of cardholders</p>
              </Link>

              {/* Issues */}
              <div className="rounded-lg border border-[var(--border)] p-4 h-full">
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">Open Issues</p>
                <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold">12</p>
                <p className="mt-1 text-xs text-yellow-600">3 new today</p>
              </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="relative rounded-lg border border-[var(--border)] p-4 sm:p-6">
              {/* Sample Data Banner */}
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div className="bg-white/95 backdrop-blur-[2px] rounded-lg px-4 py-3 shadow-[0_0_20px_rgba(0,0,0,0.15),0_0_40px_rgba(0,0,0,0.08),0_0_60px_rgba(0,0,0,0.04)] animate-[halo-pulse_3s_ease-in-out_infinite] pointer-events-auto">
                  <p className="text-sm text-center">
                    <span className="font-medium">Sample Data</span>
                    <span className="text-[var(--muted-foreground)]"> · </span>
                    <Link href="/issuer-dashboard/keys" className="text-[var(--primary)] hover:underline">
                      Configure API Keys
                    </Link>
                    <span className="text-[var(--muted-foreground)]"> to connect real data</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Receipt Activity</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">Receipts received and rendered for the {chartPeriodLabel}</p>
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
              <div className="mt-4 h-[250px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorRenderedIssuer" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
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
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const received = payload.find(p => p.dataKey === 'received')
                          const rendered = payload.find(p => p.dataKey === 'rendered')
                          return (
                            <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                              <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
                              {received && (
                                <div className="flex items-center justify-between gap-4 text-sm">
                                  <div className="flex items-center gap-2">
                                    <div className="h-2.5 w-2.5 rounded-sm bg-blue-900" />
                                    <span className="text-gray-600">Received</span>
                                  </div>
                                  <span className="font-medium">{Number(received.value).toLocaleString()}</span>
                                </div>
                              )}
                              {rendered && (
                                <div className="flex items-center justify-between gap-4 text-sm mt-1">
                                  <div className="flex items-center gap-2">
                                    <div className="h-2.5 w-2.5 rounded-sm bg-blue-400" />
                                    <span className="text-gray-600">Rendered</span>
                                  </div>
                                  <span className="font-medium">{Number(rendered.value).toLocaleString()}</span>
                                </div>
                              )}
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="received"
                      stroke="#1e3a8a"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorReceived)"
                      name="received"
                    />
                    <Area
                      type="monotone"
                      dataKey="rendered"
                      stroke="#60a5fa"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRenderedIssuer)"
                      name="rendered"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-blue-900"></div>
                  <span className="text-sm text-[var(--muted-foreground)]">Receipts Received</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-blue-400"></div>
                  <span className="text-sm text-[var(--muted-foreground)]">Receipts Rendered</span>
                </div>
              </div>
            </div>

            {/* Two Column Layout: Issues and Top Merchants */}
            <div className="relative grid gap-4 lg:grid-cols-2">
              {/* Sample Data Banner */}
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div className="bg-white/95 backdrop-blur-[2px] rounded-lg px-4 py-3 shadow-[0_0_20px_rgba(0,0,0,0.15),0_0_40px_rgba(0,0,0,0.08),0_0_60px_rgba(0,0,0,0.04)] animate-[halo-pulse_3s_ease-in-out_infinite] pointer-events-auto">
                  <p className="text-sm text-center">
                    <span className="font-medium">Sample Data</span>
                    <span className="text-[var(--muted-foreground)]"> · </span>
                    <Link href="/issuer-dashboard/keys" className="text-[var(--primary)] hover:underline">
                      Configure API Keys
                    </Link>
                    <span className="text-[var(--muted-foreground)]"> to connect real data</span>
                  </p>
                </div>
              </div>
              {/* Recent Issues Table */}
              <div className="rounded-lg border border-[var(--border)]">
                <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
                  <div>
                    <h3 className="font-semibold">Recent Issues</h3>
                    <p className="text-xs text-[var(--muted-foreground)]">Delivery failures and errors</p>
                  </div>
                  <Link
                    href="/issuer-dashboard/receipts?filter=issues"
                    className="text-sm text-[var(--primary)] hover:underline"
                  >
                    View all
                  </Link>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Merchant</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden sm:table-cell">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentIssues.slice(0, 5).map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell>
                          <span className="font-medium text-sm">{issue.merchant}</span>
                        </TableCell>
                        <TableCell>
                          {issue.status === "open" ? (
                            <div className="flex items-center gap-1.5">
                              <AlertCircle className="h-3.5 w-3.5 text-yellow-600" />
                              <span className="text-sm text-yellow-600">Open</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                              <span className="text-sm text-green-600">Resolved</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-[var(--muted-foreground)] hidden sm:table-cell">{issue.timestamp}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Top Merchants */}
              <div className="rounded-lg border border-[var(--border)]">
                <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
                  <div>
                    <h3 className="font-semibold">Top Merchants</h3>
                    <p className="text-xs text-[var(--muted-foreground)]">By receipt volume this month</p>
                  </div>
                  <Link
                    href="/issuer-dashboard/receipts"
                    className="text-sm text-[var(--primary)] hover:underline"
                  >
                    View all
                  </Link>
                </div>
                <div className="p-4 space-y-4">
                  {topMerchants.map((merchant, index) => (
                    <div key={merchant.name} className="flex items-center gap-3">
                      <span className="w-5 text-sm font-medium text-[var(--muted-foreground)]">{index + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{merchant.name}</span>
                          <span className="text-sm text-[var(--muted-foreground)]">
                            {merchant.receipts.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-[var(--muted)]">
                          <div
                            className="h-2 rounded-full bg-[var(--primary)]"
                            style={{ width: `${merchant.percentage * 8}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg border border-[var(--border)] p-4 sm:p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                  href="/issuer-dashboard/keys"
                  className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-4 hover:bg-[var(--muted)]/50 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--muted)]">
                    <Key className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Manage API Keys</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Generate or rotate keys</p>
                  </div>
                </Link>
                <Link
                  href="/issuer-dashboard/users"
                  className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-4 hover:bg-[var(--muted)]/50 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--muted)]">
                    <Users className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">View Users</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Manage cardholder access</p>
                  </div>
                </Link>
                <Link
                  href={DOCS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-4 hover:bg-[var(--muted)]/50 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--muted)]">
                    <Code className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">API Documentation</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Integration guides</p>
                  </div>
                </Link>
                <Link
                  href="/issuer-dashboard/settings"
                  className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-4 hover:bg-[var(--muted)]/50 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--muted)]">
                    <Settings className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Settings</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Configure preferences</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
