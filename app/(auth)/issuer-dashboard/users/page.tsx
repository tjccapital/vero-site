"use client"

import { useEffect, useState } from "react"
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
  RefreshCw,
  Smartphone,
  CreditCard,
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

// Sample users data - cardholders with digital receipts
const usersData = [
  {
    id: "user_001",
    cardLast4: "4582",
    cardType: "Visa",
    digitalReceiptsEnabled: true,
    enrolledDate: "2024-11-15",
    lastActivity: "2 hours ago",
    receiptCount: 47,
    deviceType: "iOS",
  },
  {
    id: "user_002",
    cardLast4: "8923",
    cardType: "Mastercard",
    digitalReceiptsEnabled: true,
    enrolledDate: "2024-10-22",
    lastActivity: "5 hours ago",
    receiptCount: 89,
    deviceType: "Android",
  },
  {
    id: "user_003",
    cardLast4: "1256",
    cardType: "Visa",
    digitalReceiptsEnabled: false,
    enrolledDate: "2024-12-01",
    lastActivity: "1 day ago",
    receiptCount: 12,
    deviceType: "iOS",
  },
  {
    id: "user_004",
    cardLast4: "7341",
    cardType: "Amex",
    digitalReceiptsEnabled: true,
    enrolledDate: "2024-09-08",
    lastActivity: "3 hours ago",
    receiptCount: 156,
    deviceType: "Android",
  },
  {
    id: "user_005",
    cardLast4: "5629",
    cardType: "Visa",
    digitalReceiptsEnabled: true,
    enrolledDate: "2024-11-30",
    lastActivity: "30 min ago",
    receiptCount: 23,
    deviceType: "iOS",
  },
  {
    id: "user_006",
    cardLast4: "3847",
    cardType: "Mastercard",
    digitalReceiptsEnabled: false,
    enrolledDate: "2024-10-15",
    lastActivity: "3 days ago",
    receiptCount: 8,
    deviceType: "Web",
  },
  {
    id: "user_007",
    cardLast4: "9012",
    cardType: "Visa",
    digitalReceiptsEnabled: true,
    enrolledDate: "2024-08-20",
    lastActivity: "1 hour ago",
    receiptCount: 234,
    deviceType: "iOS",
  },
  {
    id: "user_008",
    cardLast4: "6754",
    cardType: "Discover",
    digitalReceiptsEnabled: true,
    enrolledDate: "2024-12-10",
    lastActivity: "15 min ago",
    receiptCount: 5,
    deviceType: "Android",
  },
  {
    id: "user_009",
    cardLast4: "2198",
    cardType: "Mastercard",
    digitalReceiptsEnabled: true,
    enrolledDate: "2024-07-01",
    lastActivity: "4 hours ago",
    receiptCount: 312,
    deviceType: "iOS",
  },
  {
    id: "user_010",
    cardLast4: "8456",
    cardType: "Visa",
    digitalReceiptsEnabled: false,
    enrolledDate: "2024-11-05",
    lastActivity: "1 week ago",
    receiptCount: 3,
    deviceType: "Web",
  },
]

const DOCS_URL = "https://docs.seevero.com"

const mainNavItems = [
  { name: "Overview", href: "/issuer-dashboard", icon: LayoutDashboard },
  { name: "Receipts", href: "/issuer-dashboard/receipts", icon: Receipt },
  { name: "Users", href: "/issuer-dashboard/users", icon: Users, active: true },
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

export default function IssuerUsersPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<"all" | "enabled" | "disabled">("all")
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
      router.push("/auth/login?returnTo=/issuer-dashboard/users")
    }
  }, [user, isLoading, router])

  // Filter users
  const filteredUsers = usersData.filter((u) => {
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "enabled" && u.digitalReceiptsEnabled) ||
      (filterStatus === "disabled" && !u.digitalReceiptsEnabled)
    const matchesSearch =
      searchQuery === "" ||
      u.cardLast4.includes(searchQuery) ||
      u.cardType.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Calculate stats
  const totalUsers = usersData.length
  const enabledUsers = usersData.filter((u) => u.digitalReceiptsEnabled).length
  const disabledUsers = usersData.filter((u) => !u.digitalReceiptsEnabled).length

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
            <span className="text-sm font-medium">Users</span>
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
              <h1 className="text-2xl font-semibold">Cardholders</h1>
              <p className="text-sm text-[var(--muted-foreground)]">
                Manage users with digital receipts on your card network
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-[var(--border)] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--muted)]">
                    <Users className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">Total Enrolled</p>
                    <p className="text-2xl font-semibold">{totalUsers.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-[var(--border)] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">Receipts Enabled</p>
                    <p className="text-2xl font-semibold">{enabledUsers.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-[var(--border)] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <XCircle className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--muted-foreground)]">Receipts Disabled</p>
                    <p className="text-2xl font-semibold">{disabledUsers.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    filterStatus === "all"
                      ? "bg-[var(--foreground)] text-white"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                  )}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus("enabled")}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    filterStatus === "enabled"
                      ? "bg-[var(--foreground)] text-white"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                  )}
                >
                  Enabled
                </button>
                <button
                  onClick={() => setFilterStatus("disabled")}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    filterStatus === "disabled"
                      ? "bg-[var(--foreground)] text-white"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                  )}
                >
                  Disabled
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                  <input
                    type="text"
                    placeholder="Search by card..."
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

            {/* Users Table */}
            <div className="rounded-lg border border-[var(--border)]">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Card</TableHead>
                      <TableHead>Card Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Receipts</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Enrolled</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((userData) => (
                      <TableRow key={userData.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-[var(--muted-foreground)]" />
                            <span className="font-mono">****{userData.cardLast4}</span>
                          </div>
                        </TableCell>
                        <TableCell>{userData.cardType}</TableCell>
                        <TableCell>
                          {userData.digitalReceiptsEnabled ? (
                            <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
                              Enabled
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-100">
                              Disabled
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Smartphone className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                            <span className="text-sm">{userData.deviceType}</span>
                          </div>
                        </TableCell>
                        <TableCell>{userData.receiptCount}</TableCell>
                        <TableCell className="text-[var(--muted-foreground)]">{userData.lastActivity}</TableCell>
                        <TableCell className="text-[var(--muted-foreground)]">{userData.enrolledDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-[var(--border)] px-4 py-3">
                <p className="text-sm text-[var(--muted-foreground)]">
                  Showing {filteredUsers.length} of {totalUsers} users
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
                    disabled={filteredUsers.length < itemsPerPage}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)] hover:bg-[var(--muted)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 p-4">
              <h3 className="font-medium mb-2">About User Data</h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                User privacy is protected. You can only see masked card numbers (last 4 digits), enrollment status,
                and aggregate receipt counts. Individual receipt contents and line items are not accessible from this dashboard.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
