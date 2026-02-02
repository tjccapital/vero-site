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
  MoreVertical,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Menu,
  X,
  Search,
  Filter,
  Download,
  ChevronDown,
  ShoppingBag,
  Coffee,
  Utensils,
  Car,
  Store,
  CalendarDays,
  ArrowUpDown,
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

// Extended sample receipts data
const allReceipts = [
  {
    id: "rcpt_001",
    merchant: "Whole Foods Market",
    amount: 87.45,
    date: "2025-02-01",
    dateDisplay: "Today, 2:34 PM",
    category: "groceries",
    items: 12,
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "rcpt_002",
    merchant: "Starbucks",
    amount: 6.75,
    date: "2025-02-01",
    dateDisplay: "Today, 9:15 AM",
    category: "coffee",
    items: 2,
    paymentMethod: "Apple Pay",
  },
  {
    id: "rcpt_003",
    merchant: "Shell Gas Station",
    amount: 52.30,
    date: "2025-01-31",
    dateDisplay: "Yesterday, 5:45 PM",
    category: "gas",
    items: 1,
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "rcpt_004",
    merchant: "Chipotle",
    amount: 14.25,
    date: "2025-01-31",
    dateDisplay: "Yesterday, 12:30 PM",
    category: "dining",
    items: 3,
    paymentMethod: "Mastercard •••• 8888",
  },
  {
    id: "rcpt_005",
    merchant: "Target",
    amount: 156.80,
    date: "2025-01-30",
    dateDisplay: "Jan 30, 3:20 PM",
    category: "shopping",
    items: 8,
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "rcpt_006",
    merchant: "Trader Joe's",
    amount: 68.92,
    date: "2025-01-29",
    dateDisplay: "Jan 29, 6:15 PM",
    category: "groceries",
    items: 15,
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "rcpt_007",
    merchant: "Panera Bread",
    amount: 18.45,
    date: "2025-01-29",
    dateDisplay: "Jan 29, 12:00 PM",
    category: "dining",
    items: 2,
    paymentMethod: "Apple Pay",
  },
  {
    id: "rcpt_008",
    merchant: "Costco",
    amount: 234.56,
    date: "2025-01-28",
    dateDisplay: "Jan 28, 2:30 PM",
    category: "shopping",
    items: 12,
    paymentMethod: "Costco Visa •••• 1234",
  },
  {
    id: "rcpt_009",
    merchant: "Starbucks",
    amount: 5.95,
    date: "2025-01-28",
    dateDisplay: "Jan 28, 8:45 AM",
    category: "coffee",
    items: 1,
    paymentMethod: "Apple Pay",
  },
  {
    id: "rcpt_010",
    merchant: "Chevron",
    amount: 48.75,
    date: "2025-01-27",
    dateDisplay: "Jan 27, 4:20 PM",
    category: "gas",
    items: 1,
    paymentMethod: "Visa •••• 4242",
  },
  {
    id: "rcpt_011",
    merchant: "Amazon Fresh",
    amount: 112.34,
    date: "2025-01-26",
    dateDisplay: "Jan 26, 10:00 AM",
    category: "groceries",
    items: 22,
    paymentMethod: "Amazon Visa •••• 5678",
  },
  {
    id: "rcpt_012",
    merchant: "McDonald's",
    amount: 12.89,
    date: "2025-01-25",
    dateDisplay: "Jan 25, 7:30 PM",
    category: "dining",
    items: 4,
    paymentMethod: "Mastercard •••• 8888",
  },
]

const categories = [
  { value: "all", label: "All Categories" },
  { value: "groceries", label: "Groceries", icon: ShoppingBag },
  { value: "dining", label: "Dining", icon: Utensils },
  { value: "coffee", label: "Coffee", icon: Coffee },
  { value: "gas", label: "Gas & Auto", icon: Car },
  { value: "shopping", label: "Shopping", icon: Store },
]

const mainNavItems = [
  { name: "Home", href: "/consumer", icon: LayoutDashboard },
  { name: "Receipts", href: "/consumer/receipts", icon: Receipt, active: true },
]

const bottomNavItems = [
  { name: "Settings", href: "/consumer/settings", icon: Settings },
  { name: "Get Help", href: "/contact", icon: CircleHelp },
]

export default function ConsumerReceiptsPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "highest" | "lowest">("newest")

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
      router.push("/auth/login?returnTo=/consumer/receipts")
    }
  }, [user, isLoading, router])

  const filteredReceipts = useMemo(() => {
    let result = [...allReceipts]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (receipt) =>
          receipt.merchant.toLowerCase().includes(query) ||
          receipt.paymentMethod.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((receipt) => receipt.category === selectedCategory)
    }

    // Sort
    switch (sortOrder) {
      case "newest":
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case "highest":
        result.sort((a, b) => b.amount - a.amount)
        break
      case "lowest":
        result.sort((a, b) => a.amount - b.amount)
        break
    }

    return result
  }, [searchQuery, selectedCategory, sortOrder])

  const totalAmount = useMemo(() => {
    return filteredReceipts.reduce((sum, receipt) => sum + receipt.amount, 0)
  }, [filteredReceipts])

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "groceries":
        return "bg-green-100 text-green-700"
      case "coffee":
        return "bg-amber-100 text-amber-700"
      case "dining":
        return "bg-orange-100 text-orange-700"
      case "gas":
        return "bg-blue-100 text-blue-700"
      case "shopping":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
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
        "hidden flex-col border-r border-[var(--border)] lg:flex transition-all duration-300",
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
            <span className="text-sm font-medium">All Receipts</span>
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
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold">Your Receipts</h1>
                <p className="text-sm text-[var(--muted-foreground)]">
                  View and manage all your digital receipts
                </p>
              </div>
              <button className="flex items-center justify-center gap-2 rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                <input
                  type="text"
                  placeholder="Search by merchant or payment method..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-[var(--border)] bg-white pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center gap-2 rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors min-w-[160px]">
                    <Filter className="h-4 w-4" />
                    {categories.find((c) => c.value === selectedCategory)?.label || "Category"}
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {categories.map((category) => (
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

              {/* Sort */}
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
                Showing {filteredReceipts.length} receipt{filteredReceipts.length !== 1 ? 's' : ''}
              </p>
              <p className="text-sm font-medium">
                Total: ${totalAmount.toFixed(2)}
              </p>
            </div>

            {/* Receipts Table - Desktop */}
            <div className="hidden md:block rounded-lg border border-[var(--border)] overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[40%]">Merchant</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReceipts.map((receipt) => {
                    const CategoryIcon = getCategoryIcon(receipt.category)
                    return (
                      <TableRow
                        key={receipt.id}
                        className="cursor-pointer hover:bg-[var(--muted)]/50"
                        onClick={() => router.push(`/consumer/receipts/${receipt.id}`)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--muted)]">
                              <CategoryIcon className="h-5 w-5 text-[var(--muted-foreground)]" />
                            </div>
                            <div>
                              <p className="font-medium">{receipt.merchant}</p>
                              <p className="text-xs text-[var(--muted-foreground)]">{receipt.items} items</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={cn("capitalize", getCategoryColor(receipt.category))}>
                            {receipt.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[var(--muted-foreground)]">
                          {receipt.dateDisplay}
                        </TableCell>
                        <TableCell className="text-[var(--muted-foreground)]">
                          {receipt.paymentMethod}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          ${receipt.amount.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Receipts List - Mobile */}
            <div className="md:hidden space-y-3">
              {filteredReceipts.map((receipt) => {
                const CategoryIcon = getCategoryIcon(receipt.category)
                return (
                  <Link
                    key={receipt.id}
                    href={`/consumer/receipts/${receipt.id}`}
                    className="block rounded-lg border border-[var(--border)] p-4 hover:bg-[var(--muted)]/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--muted)]">
                        <CategoryIcon className="h-5 w-5 text-[var(--muted-foreground)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-medium">{receipt.merchant}</p>
                            <p className="text-xs text-[var(--muted-foreground)]">{receipt.dateDisplay}</p>
                          </div>
                          <p className="font-semibold">${receipt.amount.toFixed(2)}</p>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="secondary" className={cn("capitalize text-xs", getCategoryColor(receipt.category))}>
                            {receipt.category}
                          </Badge>
                          <span className="text-xs text-[var(--muted-foreground)]">{receipt.items} items</span>
                        </div>
                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">{receipt.paymentMethod}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Empty State */}
            {filteredReceipts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--muted)]">
                  <Receipt className="h-8 w-8 text-[var(--muted-foreground)]" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No receipts found</h3>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {searchQuery || selectedCategory !== "all"
                    ? "Try adjusting your filters"
                    : "Your receipts will appear here"}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
