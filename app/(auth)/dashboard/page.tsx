"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@auth0/nextjs-auth0/client"
import { cn } from "@/lib/utils"
import {
  Receipt,
  LayoutDashboard,
  Cable,
  BarChart3,
  FileText,
  Settings,
  CircleHelp,
  Search,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Plus,
  Mail,
  Database,
  FileBarChart,
  Code,
  MoreHorizontal,
  ChevronDown,
  LogOut,
  Columns3,
  Check,
  Clock,
  CreditCard,
  Info,
  PanelLeftClose,
  PanelLeft,
  Menu,
  X,
} from "lucide-react"
import { VeroLogo, VeroLogoFull } from "@/components/ui/vero-logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
} from "recharts"

// Chart data for receipts over time - different ranges
const chartData3Months = [
  { date: "Apr 3", sent: 286, rendered: 142 },
  { date: "Apr 9", sent: 305, rendered: 168 },
  { date: "Apr 15", sent: 237, rendered: 124 },
  { date: "Apr 21", sent: 373, rendered: 198 },
  { date: "Apr 27", sent: 309, rendered: 156 },
  { date: "May 3", sent: 414, rendered: 223 },
  { date: "May 9", sent: 378, rendered: 201 },
  { date: "May 15", sent: 289, rendered: 145 },
  { date: "May 21", sent: 339, rendered: 178 },
  { date: "May 28", sent: 287, rendered: 143 },
  { date: "Jun 3", sent: 321, rendered: 167 },
  { date: "Jun 9", sent: 356, rendered: 189 },
  { date: "Jun 15", sent: 412, rendered: 234 },
  { date: "Jun 21", sent: 478, rendered: 270 },
  { date: "Jun 29", sent: 389, rendered: 217 },
]

const chartData30Days = [
  { date: "Jun 1", sent: 312, rendered: 156 },
  { date: "Jun 5", sent: 345, rendered: 178 },
  { date: "Jun 9", sent: 356, rendered: 189 },
  { date: "Jun 13", sent: 398, rendered: 212 },
  { date: "Jun 17", sent: 425, rendered: 245 },
  { date: "Jun 21", sent: 478, rendered: 270 },
  { date: "Jun 25", sent: 412, rendered: 234 },
  { date: "Jun 29", sent: 389, rendered: 217 },
]

const chartData7Days = [
  { date: "Jun 23", sent: 445, rendered: 256 },
  { date: "Jun 24", sent: 412, rendered: 234 },
  { date: "Jun 25", sent: 398, rendered: 221 },
  { date: "Jun 26", sent: 456, rendered: 267 },
  { date: "Jun 27", sent: 423, rendered: 245 },
  { date: "Jun 28", sent: 401, rendered: 228 },
  { date: "Jun 29", sent: 389, rendered: 217 },
]

// POS Integration data
const posIntegrations = [
  {
    id: "int_001",
    name: "Downtown Flagship",
    type: "Square",
    status: "active",
    receipts: 2847,
    receiptsRendered: 1708,
    transactions: 3412,
    lastSync: "2 min ago",
    device: "Square Terminal",
    serialNumber: "SQ-TRM-48291",
    location: "123 Main St, San Francisco, CA",
  },
  {
    id: "int_002",
    name: "University District",
    type: "Square",
    status: "active",
    receipts: 1923,
    receiptsRendered: 1154,
    transactions: 2308,
    lastSync: "3 min ago",
    device: "Square Register",
    serialNumber: "SQ-REG-73845",
    location: "456 College Ave, Berkeley, CA",
  },
  {
    id: "int_003",
    name: "Waterfront Cafe",
    type: "Square",
    status: "active",
    receipts: 1456,
    receiptsRendered: 874,
    transactions: 1747,
    lastSync: "1 min ago",
    device: "Square Terminal",
    serialNumber: "SQ-TRM-29156",
    location: "789 Embarcadero, San Francisco, CA",
  },
  {
    id: "int_004",
    name: "Airport Terminal B",
    type: "Square",
    status: "pending",
    receipts: 0,
    receiptsRendered: 0,
    transactions: 0,
    lastSync: "Pending setup",
    device: "Square Register",
    serialNumber: "SQ-REG-91024",
    location: "SFO Terminal B, Gate 42",
  },
  {
    id: "int_005",
    name: "Suburban Plaza",
    type: "Square",
    status: "active",
    receipts: 892,
    receiptsRendered: 535,
    transactions: 1070,
    lastSync: "5 min ago",
    device: "Square Stand",
    serialNumber: "SQ-STD-56738",
    location: "321 Oak Blvd, Palo Alto, CA",
  },
]

const DOCS_URL = "https://docs.seevero.com/pos-plugins/overview"

const mainNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: true },
  { name: "Integrations", href: "/dashboard/integrations", icon: Cable },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { name: "Analytics", href: DOCS_URL, icon: BarChart3, external: true },
  { name: "Receipts", href: DOCS_URL, icon: Receipt, external: true },
]

const documentNavItems = [
  { name: "Data Library", href: DOCS_URL, icon: Database, external: true },
  { name: "Reports", href: DOCS_URL, icon: FileBarChart, external: true },
  { name: "API Docs", href: DOCS_URL, icon: Code, external: true },
  { name: "More", href: DOCS_URL, icon: MoreHorizontal, external: true },
]

const bottomNavItems = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Get Help", href: "/contact", icon: CircleHelp },
  { name: "Search", href: DOCS_URL, icon: Search, external: true },
]

export default function DashboardPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
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
      router.push("/auth/login?returnTo=/dashboard")
    }
  }, [user, isLoading, router])

  const filteredIntegrations = activeTab === "all"
    ? posIntegrations
    : posIntegrations.filter(i => i.status === activeTab)

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
    <div className="flex min-h-screen w-full bg-white overflow-x-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "hidden flex-col border-r border-[var(--border)] lg:flex transition-all duration-300",
        sidebarCollapsed ? "w-[60px]" : "w-[240px]"
      )}>
        {/* Logo */}
        <div className="flex h-14 items-center px-4">
          <Link href="/dashboard">
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
              {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
                Documents
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
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
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
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
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
            <span className="text-sm font-medium">Merchant Dashboard</span>
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
                    onClick={() => !item.external && setMobileMenuOpen(false)}
                    {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
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
                  Documents
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
            {/* Stats Cards */}
            <div className="relative">
              {/* Sample Data Banner */}
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div className="bg-white/95 backdrop-blur-[2px] rounded-lg px-4 py-3 shadow-[0_0_20px_rgba(0,0,0,0.15),0_0_40px_rgba(0,0,0,0.08),0_0_60px_rgba(0,0,0,0.04)] animate-[halo-pulse_3s_ease-in-out_infinite] pointer-events-auto">
                  <p className="text-sm text-center">
                    <span className="font-medium">Sample Data</span>
                    <span className="text-[var(--muted-foreground)]"> · </span>
                    <Link href="/dashboard/integrations" className="text-[var(--primary)] hover:underline">
                      Configure your POS
                    </Link>
                    <span className="text-[var(--muted-foreground)]"> in Integrations to see real data</span>
                  </p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* 30-Day Payout */}
                <Link
                  href="/dashboard/payments"
                  className="rounded-lg border border-[var(--border)] p-4 hover:bg-[var(--muted)]/50 transition-colors cursor-pointer block"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[var(--muted-foreground)]">30-Day Payout</p>
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      +12.3%
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold">$75.00</p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    <span className="text-green-600">Trailing 30 days</span>
                    <TrendingUp className="ml-1 inline h-3 w-3 text-green-600" />
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">Click to view payment details</p>
                </Link>

                {/* Total Receipts */}
                <div className="rounded-lg border border-[var(--border)] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[var(--muted-foreground)]">Total Receipts</p>
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      +12.5%
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold">7,118</p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    <span className="text-green-600">Trending up this month</span>
                    <TrendingUp className="ml-1 inline h-3 w-3 text-green-600" />
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">Receipts for the last 6 months</p>
                </div>

                {/* Transactions */}
                <div className="rounded-lg border border-[var(--border)] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[var(--muted-foreground)]">Transactions</p>
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      +8.3%
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold">8,537</p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    <span className="text-green-600">Growing steadily</span>
                    <TrendingUp className="ml-1 inline h-3 w-3 text-green-600" />
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">Across all coffee shop locations</p>
                </div>

                {/* Active Integrations */}
                <Link
                  href="/dashboard/integrations"
                  className="rounded-lg border border-[var(--border)] p-4 hover:bg-[var(--muted)]/50 transition-colors cursor-pointer block"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[var(--muted-foreground)]">Active Integrations</p>
                    <span className="flex items-center gap-1 text-xs text-green-600">
                      <TrendingUp className="h-3 w-3" />
                      +12.5%
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold">4</p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    <span className="text-green-600">Strong POS coverage</span>
                    <TrendingUp className="ml-1 inline h-3 w-3 text-green-600" />
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)]">Click to manage integrations</p>
                </Link>
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
                    <Link href="/dashboard/integrations" className="text-[var(--primary)] hover:underline">
                      Configure your POS
                    </Link>
                    <span className="text-[var(--muted-foreground)]"> in Integrations to see real data</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Digital Receipts</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">Total for the {chartPeriodLabel}</p>
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
                      <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#374151" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#374151" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorRendered" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#9ca3af" stopOpacity={0}/>
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
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const sent = payload.find(p => p.dataKey === 'sent')
                          const rendered = payload.find(p => p.dataKey === 'rendered')
                          return (
                            <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                              <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
                              {sent && (
                                <div className="flex items-center justify-between gap-4 text-sm">
                                  <div className="flex items-center gap-2">
                                    <div className="h-2.5 w-2.5 rounded-sm bg-gray-700" />
                                    <span className="text-gray-600">Receipts Sent</span>
                                  </div>
                                  <span className="font-medium">{sent.value}</span>
                                </div>
                              )}
                              {rendered && (
                                <div className="flex items-center justify-between gap-4 text-sm mt-1">
                                  <div className="flex items-center gap-2">
                                    <div className="h-2.5 w-2.5 rounded-sm bg-gray-400" />
                                    <span className="text-gray-600">Receipts Rendered</span>
                                  </div>
                                  <span className="font-medium">{rendered.value}</span>
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
                      dataKey="sent"
                      stroke="#1f2937"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorSent)"
                      name="sent"
                    />
                    <Area
                      type="monotone"
                      dataKey="rendered"
                      stroke="#6b7280"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRendered)"
                      name="rendered"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {/* Legend */}
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-gray-700"></div>
                  <span className="text-sm text-[var(--muted-foreground)]">Receipts Sent</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-gray-400"></div>
                  <span className="text-sm text-[var(--muted-foreground)]">Receipts Rendered</span>
                </div>
              </div>
            </div>

            {/* POS Integrations Table */}
            <div className="relative rounded-lg border border-[var(--border)]">
              {/* Sample Data Banner */}
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div className="bg-white/95 backdrop-blur-[2px] rounded-lg px-4 py-3 shadow-[0_0_20px_rgba(0,0,0,0.15),0_0_40px_rgba(0,0,0,0.08),0_0_60px_rgba(0,0,0,0.04)] animate-[halo-pulse_3s_ease-in-out_infinite] pointer-events-auto">
                  <p className="text-sm text-center">
                    <span className="font-medium">Sample Data</span>
                    <span className="text-[var(--muted-foreground)]"> · </span>
                    <Link href="/dashboard/integrations" className="text-[var(--primary)] hover:underline">
                      Configure your POS
                    </Link>
                    <span className="text-[var(--muted-foreground)]"> in Integrations to see real data</span>
                  </p>
                </div>
              </div>
              {/* Tabs - scrollable on mobile */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border)]">
                <div className="flex overflow-x-auto px-2 sm:px-4">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={cn(
                      "border-b-2 px-3 sm:px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                      activeTab === "all"
                        ? "border-[var(--foreground)] text-[var(--foreground)]"
                        : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    )}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveTab("active")}
                    className={cn(
                      "flex items-center gap-2 border-b-2 px-3 sm:px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                      activeTab === "active"
                        ? "border-[var(--foreground)] text-[var(--foreground)]"
                        : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    )}
                  >
                    Active
                    <span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-xs">4</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("pending")}
                    className={cn(
                      "flex items-center gap-2 border-b-2 px-3 sm:px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                      activeTab === "pending"
                        ? "border-[var(--foreground)] text-[var(--foreground)]"
                        : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    )}
                  >
                    Pending
                    <span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-xs">1</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("inactive")}
                    className={cn(
                      "border-b-2 px-3 sm:px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                      activeTab === "inactive"
                        ? "border-[var(--foreground)] text-[var(--foreground)]"
                        : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    )}
                  >
                    Inactive
                  </button>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-4 py-2">
                  <button className="flex items-center gap-2 rounded-md border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--muted)]">
                    <Columns3 className="h-4 w-4" />
                    Customize Columns
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <Link href="/dashboard/integrations" className="flex items-center gap-2 rounded-md border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--muted)]">
                    <Plus className="h-4 w-4" />
                    Add Integration
                  </Link>
                </div>
              </div>

              {/* Table - scrollable on mobile */}
              <div className="overflow-x-auto">
              <Table className="min-w-[700px]">
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-12">
                      <input type="checkbox" className="rounded border-[var(--border)]" />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Receipts Sent</TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        Receipts Rendered
                        <div className="group relative">
                          <Info className="h-3.5 w-3.5 text-[var(--muted-foreground)] cursor-help" />
                          <div className="absolute right-0 top-full mt-1 z-50 hidden group-hover:block w-64 rounded-md border border-[var(--border)] bg-white p-2 text-xs text-[var(--muted-foreground)] shadow-lg">
                            Receipts rendered is when a consumer actually views the receipt in their card issuer application.
                          </div>
                        </div>
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Transactions</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIntegrations.map((integration) => (
                    <TableRow key={integration.id}>
                      <TableCell>
                        <input type="checkbox" className="rounded border-[var(--border)]" />
                      </TableCell>
                      <TableCell className="font-medium">{integration.name}</TableCell>
                      <TableCell className="text-[var(--muted-foreground)]">{integration.device}</TableCell>
                      <TableCell>
                        {integration.status === "active" && (
                          <div className="flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-green-600" />
                            <span className="text-sm text-green-600">Active</span>
                          </div>
                        )}
                        {integration.status === "pending" && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-yellow-600" />
                            <span className="text-sm text-yellow-600">Pending</span>
                          </div>
                        )}
                        {integration.status === "inactive" && (
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-gray-400" />
                            <span className="text-sm text-gray-500">Inactive</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{integration.receipts.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{integration.receiptsRendered.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{integration.transactions.toLocaleString()}</TableCell>
                      <TableCell className="text-[var(--muted-foreground)]">{integration.lastSync}</TableCell>
                      <TableCell>
                        <button className="rounded-md p-1 hover:bg-[var(--muted)]">
                          <MoreVertical className="h-4 w-4 text-[var(--muted-foreground)]" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
