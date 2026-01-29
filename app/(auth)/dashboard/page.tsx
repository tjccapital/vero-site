"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
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
} from "lucide-react"
import { VeroLogo } from "@/components/ui/vero-logo"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

// Chart data for receipts over time
const chartData = [
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

// POS Integration data
const posIntegrations = [
  {
    id: "int_001",
    name: "Main Store POS",
    type: "Square",
    status: "active",
    receipts: 1842,
    transactions: 2156,
    lastSync: "2 min ago",
  },
  {
    id: "int_002",
    name: "Downtown Location",
    type: "Clover",
    status: "active",
    receipts: 956,
    transactions: 1203,
    lastSync: "5 min ago",
  },
  {
    id: "int_003",
    name: "Airport Kiosk",
    type: "Toast",
    status: "pending",
    receipts: 0,
    transactions: 0,
    lastSync: "Pending setup",
  },
  {
    id: "int_004",
    name: "Online Store",
    type: "Shopify",
    status: "active",
    receipts: 3421,
    transactions: 4102,
    lastSync: "1 min ago",
  },
  {
    id: "int_005",
    name: "Food Truck",
    type: "Square",
    status: "inactive",
    receipts: 234,
    transactions: 289,
    lastSync: "3 days ago",
  },
]

const mainNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, active: true },
  { name: "Integrations", href: "/dashboard/integrations", icon: Cable },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Receipts", href: "/dashboard/receipts", icon: Receipt },
  { name: "Transactions", href: "/dashboard/transactions", icon: FileText },
]

const documentNavItems = [
  { name: "Data Library", href: "/dashboard/data", icon: Database },
  { name: "Reports", href: "/dashboard/reports", icon: FileBarChart },
  { name: "API Docs", href: "/dashboard/api-docs", icon: Code },
  { name: "More", href: "/dashboard/more", icon: MoreHorizontal },
]

const bottomNavItems = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Get Help", href: "/dashboard/help", icon: CircleHelp },
  { name: "Search", href: "/dashboard/search", icon: Search },
]

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [chartRange, setChartRange] = useState("3months")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

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

  const filteredIntegrations = activeTab === "all"
    ? posIntegrations
    : posIntegrations.filter(i => i.status === activeTab)

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Sidebar */}
      <aside className="hidden w-[240px] flex-col border-r border-[var(--border)] lg:flex">
        {/* Logo */}
        <div className="flex h-14 items-center gap-2 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)]">
            <VeroLogo size={18} />
          </div>
          <span className="text-sm font-semibold">Vero Merchant</span>
        </div>

        {/* Quick Create Button */}
        <div className="px-3 py-2">
          <div className="flex items-center gap-2">
            <button className="flex flex-1 items-center gap-2 rounded-md bg-[var(--primary)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--primary)]/90">
              <Plus className="h-4 w-4" />
              Quick Create
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] hover:bg-[var(--muted)]">
              <Mail className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-2">
          {mainNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                item.active
                  ? "bg-[var(--muted)] font-medium text-[var(--foreground)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}

          {/* Documents Section */}
          <div className="pt-4">
            <p className="px-3 py-2 text-xs font-medium text-[var(--muted-foreground)]">
              Documents
            </p>
            {documentNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-[var(--border)] px-3 py-2">
          {bottomNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </div>

        {/* User Profile */}
        <div className="border-t border-[var(--border)] p-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-[var(--muted)] text-sm">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{user.name}</p>
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
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 items-center justify-between border-b border-[var(--border)] px-6">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-[var(--muted-foreground)]" />
            <span className="text-sm font-medium">Dashboard</span>
          </div>
          <Link href="https://docs.seevero.com" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            API Docs
          </Link>
        </header>

        {/* Mobile Header */}
        <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border)]">
              <VeroLogo size={18} />
            </div>
            <span className="text-sm font-semibold">Vero</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-md p-2 hover:bg-[var(--muted)]">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-[var(--muted)] text-xs">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {mainNavItems.map((item) => (
                <DropdownMenuItem key={item.name} asChild>
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-6xl space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total Receipts */}
              <div className="rounded-lg border border-[var(--border)] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[var(--muted-foreground)]">Total Receipts</p>
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    +12.5%
                  </span>
                </div>
                <p className="mt-2 text-2xl font-semibold">6,453</p>
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
                  <span className="flex items-center gap-1 text-xs text-red-600">
                    <TrendingDown className="h-3 w-3" />
                    -20%
                  </span>
                </div>
                <p className="mt-2 text-2xl font-semibold">7,750</p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  <span className="text-red-600">Down 20% this period</span>
                  <TrendingDown className="ml-1 inline h-3 w-3 text-red-600" />
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">Acquisition needs attention</p>
              </div>

              {/* Active Integrations */}
              <div className="rounded-lg border border-[var(--border)] p-4">
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
                <p className="text-xs text-[var(--muted-foreground)]">Engagement exceed targets</p>
              </div>

              {/* Payout Rate */}
              <div className="rounded-lg border border-[var(--border)] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-[var(--muted-foreground)]">Payout Rate</p>
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    +4.5%
                  </span>
                </div>
                <p className="mt-2 text-2xl font-semibold">4.5%</p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  <span className="text-green-600">Steady performance increase</span>
                  <TrendingUp className="ml-1 inline h-3 w-3 text-green-600" />
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">Meets growth projections</p>
              </div>
            </div>

            {/* Chart Section */}
            <div className="rounded-lg border border-[var(--border)] p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Digital Receipts</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">Total for the last 3 months</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setChartRange("3months")}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      chartRange === "3months"
                        ? "bg-[var(--foreground)] text-white"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                    )}
                  >
                    Last 3 months
                  </button>
                  <button
                    onClick={() => setChartRange("30days")}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      chartRange === "30days"
                        ? "bg-[var(--foreground)] text-white"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                    )}
                  >
                    Last 30 days
                  </button>
                  <button
                    onClick={() => setChartRange("7days")}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                      chartRange === "7days"
                        ? "bg-[var(--foreground)] text-white"
                        : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                    )}
                  >
                    Last 7 days
                  </button>
                </div>
              </div>
              <div className="mt-6 h-[300px]">
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
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                      formatter={(value, name) => [
                        value,
                        name === 'sent' ? 'Receipts Sent' : 'Receipts Rendered'
                      ]}
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
            <div className="rounded-lg border border-[var(--border)]">
              {/* Tabs */}
              <div className="flex items-center justify-between border-b border-[var(--border)] px-4">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={cn(
                      "border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                      activeTab === "all"
                        ? "border-[var(--foreground)] text-[var(--foreground)]"
                        : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    )}
                  >
                    All Integrations
                  </button>
                  <button
                    onClick={() => setActiveTab("active")}
                    className={cn(
                      "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                      activeTab === "active"
                        ? "border-[var(--foreground)] text-[var(--foreground)]"
                        : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    )}
                  >
                    Active
                    <span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-xs">3</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("pending")}
                    className={cn(
                      "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
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
                      "border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                      activeTab === "inactive"
                        ? "border-[var(--foreground)] text-[var(--foreground)]"
                        : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    )}
                  >
                    Inactive
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 rounded-md border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--muted)]">
                    <Columns3 className="h-4 w-4" />
                    Customize Columns
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button className="flex items-center gap-2 rounded-md border border-[var(--border)] px-3 py-1.5 text-sm hover:bg-[var(--muted)]">
                    <Plus className="h-4 w-4" />
                    Add Integration
                  </button>
                </div>
              </div>

              {/* Table */}
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-12">
                      <input type="checkbox" className="rounded border-[var(--border)]" />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>POS Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Receipts</TableHead>
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
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {integration.type}
                        </Badge>
                      </TableCell>
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
        </main>
      </div>
    </div>
  )
}
