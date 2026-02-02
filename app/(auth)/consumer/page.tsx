"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@auth0/nextjs-auth0/client"
import { cn } from "@/lib/utils"
import {
  Receipt,
  LayoutDashboard,
  Settings,
  CircleHelp,
  Search,
  MoreVertical,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Menu,
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
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Landmark,
  Plus,
  CreditCard,
  ExternalLink,
  CheckCircle2,
  Circle,
  FileText,
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
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

// Sample spending data over time
const spendingData7Days = [
  { date: "Mon", amount: 45.20 },
  { date: "Tue", amount: 128.50 },
  { date: "Wed", amount: 32.00 },
  { date: "Thu", amount: 89.75 },
  { date: "Fri", amount: 156.30 },
  { date: "Sat", amount: 234.80 },
  { date: "Sun", amount: 67.45 },
]

const spendingData30Days = [
  { date: "Week 1", amount: 425.50 },
  { date: "Week 2", amount: 512.30 },
  { date: "Week 3", amount: 389.20 },
  { date: "Week 4", amount: 478.60 },
]

const spendingData3Months = [
  { date: "Nov", amount: 1245.80 },
  { date: "Dec", amount: 1892.30 },
  { date: "Jan", amount: 1156.45 },
]

// Sample recent receipts
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

// Category spending breakdown
const categorySpending = [
  { name: "Groceries", amount: 423.50, percentage: 32, icon: ShoppingBag, color: "bg-green-500" },
  { name: "Dining", amount: 287.20, percentage: 22, icon: Utensils, color: "bg-orange-500" },
  { name: "Gas & Auto", amount: 198.45, percentage: 15, icon: Car, color: "bg-blue-500" },
  { name: "Coffee", amount: 89.30, percentage: 7, icon: Coffee, color: "bg-amber-600" },
  { name: "Shopping", amount: 312.60, percentage: 24, icon: Store, color: "bg-purple-500" },
]

// Sample linked accounts data
const linkedAccounts = [
  { id: "acc_001", name: "Chase Sapphire", type: "Credit Card", last4: "4242", institution: "Chase" },
  { id: "acc_002", name: "Bank of America Checking", type: "Checking", last4: "8821", institution: "Bank of America" },
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
    href: "/consumer/receipts",
  },
  {
    id: 4,
    title: "Refer a friend",
    description: "Earn $5 for each friend who joins",
    status: "pending" as const,
    href: null,
  },
]

const mainNavItems = [
  { name: "Home", href: "/consumer", icon: LayoutDashboard, active: true },
  { name: "Receipts", href: "/consumer/receipts", icon: Receipt },
  { name: "Accounts", href: "/consumer/accounts", icon: Landmark },
]

const bottomNavItems = [
  { name: "Settings", href: "/consumer/settings", icon: Settings },
  { name: "Get Help", href: "/contact", icon: CircleHelp },
]

export default function ConsumerDashboardPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [chartRange, setChartRange] = useState("7days")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [referralCopied, setReferralCopied] = useState(false)
  const [showPlaidModal, setShowPlaidModal] = useState(false)
  const [checklistCollapsed, setChecklistCollapsed] = useState(false)

  // Generate a simple referral code based on user
  const referralCode = user?.email ? `VERO${user.email.substring(0, 4).toUpperCase()}5` : "VERO5"

  const copyReferralLink = () => {
    const referralUrl = `https://seevero.com/signup?ref=${referralCode}`
    navigator.clipboard.writeText(referralUrl)
    setReferralCopied(true)
    setTimeout(() => setReferralCopied(false), 2000)
  }

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
      router.push("/auth/login?returnTo=/consumer")
    }
  }, [user, isLoading, router])

  const chartData = useMemo(() => {
    switch (chartRange) {
      case "7days":
        return spendingData7Days
      case "30days":
        return spendingData30Days
      case "3months":
      default:
        return spendingData3Months
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

  const totalSpending = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.amount, 0)
  }, [chartData])

  const getCategoryIcon = (category: string) => {
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
        "hidden flex-col border-r border-[var(--border)] lg:flex transition-all duration-300 sticky top-0 h-screen",
        sidebarCollapsed ? "w-[60px]" : "w-[240px]"
      )}>
        {/* Logo */}
        <div className="flex h-14 items-center px-4">
          <Link href="/consumer">
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
        </nav>

        {/* Bottom Navigation */}
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
            <span className="text-sm font-medium">My Receipts</span>
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

              {/* Bottom Navigation */}
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
            {/* Referral Banner - Compact */}
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-[var(--primary)] to-blue-600 p-4 sm:p-5 text-white">
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
                  <span className="text-xs bg-white/20 rounded px-2 py-1 font-mono">{referralCode}</span>
                  <button
                    onClick={copyReferralLink}
                    className="flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-[var(--primary)] hover:bg-white/90 transition-colors"
                  >
                    {referralCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span className="hidden sm:inline">{referralCopied ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Welcome Header */}
            <div>
              <h1 className="text-2xl font-semibold">Welcome back, {user.name?.split(' ')[0] || 'there'}</h1>
              <p className="text-sm text-[var(--muted-foreground)]">
                Here&apos;s an overview of your recent spending
              </p>
            </div>

            {/* Getting Started Checklist - Clean Version */}
            <div className="rounded-lg border border-[var(--border)] overflow-hidden">
              <button
                onClick={() => setChecklistCollapsed(!checklistCollapsed)}
                className="flex w-full items-center justify-between px-4 py-3 hover:bg-[var(--muted)]/30 transition-colors"
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
                      {linkedAccounts.length} account{linkedAccounts.length !== 1 ? 's' : ''} connected
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {linkedAccounts.length > 0 && (
                    <div className="hidden sm:flex -space-x-2">
                      {linkedAccounts.slice(0, 3).map((account) => (
                        <div
                          key={account.id}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--muted)] border-2 border-white text-xs font-medium"
                          title={account.name}
                        >
                          {account.institution.charAt(0)}
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                    <Plus className="h-4 w-4" />
                  </div>
                </div>
              </div>
              {linkedAccounts.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {linkedAccounts.map((account) => (
                    <span
                      key={account.id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[var(--muted)] px-3 py-1 text-xs font-medium"
                    >
                      <CreditCard className="h-3 w-3" />
                      {account.institution} ••{account.last4}
                    </span>
                  ))}
                </div>
              )}
            </button>

            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-[var(--border)] p-4">
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <Calendar className="h-4 w-4" />
                  <p className="text-xs sm:text-sm">This Month</p>
                </div>
                <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold">$1,311.05</p>
                <p className="mt-1 text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  -12% vs last month
                </p>
              </div>

              <Link
                href="/consumer/receipts"
                className="rounded-lg border border-[var(--border)] p-4 hover:bg-[var(--muted)]/50 transition-colors cursor-pointer block"
              >
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <Receipt className="h-4 w-4" />
                  <p className="text-xs sm:text-sm">Total Receipts</p>
                </div>
                <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold">247</p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">All time</p>
              </Link>

              <div className="rounded-lg border border-[var(--border)] p-4">
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <Store className="h-4 w-4" />
                  <p className="text-xs sm:text-sm">Merchants</p>
                </div>
                <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold">34</p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">Unique stores</p>
              </div>

              <div className="rounded-lg border border-[var(--border)] p-4">
                <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                  <Users className="h-4 w-4" />
                  <p className="text-xs sm:text-sm">Referrals</p>
                </div>
                <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold">3</p>
                <p className="mt-1 text-xs text-green-600">$15 earned</p>
              </div>
            </div>

            {/* Spending Chart */}
            <div className="rounded-lg border border-[var(--border)] p-4 sm:p-6">
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
                        <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0.1}/>
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
                              <p className="text-lg font-bold text-[var(--primary)]">
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
                      stroke="#1e3a8a"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorSpending)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Two Column Layout: Recent Receipts and Categories */}
            <div className="grid gap-4 lg:grid-cols-2">
              {/* Recent Receipts */}
              <div className="rounded-lg border border-[var(--border)]">
                <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
                  <div>
                    <h3 className="font-semibold">Recent Receipts</h3>
                    <p className="text-xs text-[var(--muted-foreground)]">Your latest transactions</p>
                  </div>
                  <Link
                    href="/consumer/receipts"
                    className="flex items-center gap-1 text-sm text-[var(--primary)] hover:underline"
                  >
                    View all
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="divide-y divide-[var(--border)]">
                  {recentReceipts.map((receipt) => {
                    const CategoryIcon = getCategoryIcon(receipt.category)
                    return (
                      <Link
                        key={receipt.id}
                        href={`/consumer/receipts/${receipt.id}`}
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
              </div>

              {/* Spending by Category */}
              <div className="rounded-lg border border-[var(--border)]">
                <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
                  <div>
                    <h3 className="font-semibold">Spending by Category</h3>
                    <p className="text-xs text-[var(--muted-foreground)]">This month's breakdown</p>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  {categorySpending.map((category) => {
                    const CategoryIcon = category.icon
                    return (
                      <div key={category.name} className="flex items-center gap-3">
                        <div className={cn("flex h-8 w-8 items-center justify-center rounded-full", category.color)}>
                          <CategoryIcon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{category.name}</span>
                            <span className="text-sm font-semibold">${category.amount.toFixed(2)}</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-[var(--muted)]">
                            <div
                              className={cn("h-2 rounded-full", category.color)}
                              style={{ width: `${category.percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Plaid Link Modal */}
      {showPlaidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPlaidModal(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md mx-4 rounded-xl bg-white shadow-2xl">
            {/* Header */}
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
                onClick={() => setShowPlaidModal(false)}
                className="rounded-md p-1 hover:bg-[var(--muted)] transition-colors"
              >
                <X className="h-5 w-5 text-[var(--muted-foreground)]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-[var(--muted-foreground)]">
                Connect your bank account or credit card to automatically receive digital receipts for your transactions.
              </p>

              {/* Current Accounts */}
              {linkedAccounts.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
                    Connected Accounts
                  </p>
                  <div className="space-y-2">
                    {linkedAccounts.map((account) => (
                      <div
                        key={account.id}
                        className="flex items-center justify-between rounded-lg border border-[var(--border)] p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--muted)]">
                            <CreditCard className="h-4 w-4 text-[var(--muted-foreground)]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{account.name}</p>
                            <p className="text-xs text-[var(--muted-foreground)]">
                              {account.type} •••• {account.last4}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-green-600 font-medium">Connected</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Plaid Button */}
              <a
                href="https://plaid.com/docs/link/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--foreground)] px-4 py-3 text-sm font-medium text-white hover:bg-[var(--foreground)]/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add New Account
                <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </a>

              {/* Security Note */}
              <div className="flex items-start gap-2 rounded-lg bg-[var(--muted)]/50 p-3">
                <Landmark className="h-4 w-4 text-[var(--muted-foreground)] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[var(--muted-foreground)]">
                  Your credentials are encrypted and securely transmitted directly to your bank through Plaid. Vero never sees or stores your login information.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
