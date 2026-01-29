"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { cn } from "@/lib/utils"
import {
  Receipt,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Settings,
  LogOut,
  Home,
  FileText,
  Wallet,
  Bell,
  ChevronDown,
  Search,
  MoreHorizontal,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

// Sample data for the dashboard
const recentReceipts = [
  {
    id: "REC-001",
    merchant: "Coffee Shop Downtown",
    amount: 15.50,
    date: "2025-01-29",
    status: "processed",
  },
  {
    id: "REC-002",
    merchant: "Tech Store",
    amount: 299.99,
    date: "2025-01-28",
    status: "pending",
  },
  {
    id: "REC-003",
    merchant: "Restaurant & Bar",
    amount: 87.25,
    date: "2025-01-28",
    status: "processed",
  },
  {
    id: "REC-004",
    merchant: "Gas Station",
    amount: 45.00,
    date: "2025-01-27",
    status: "processed",
  },
  {
    id: "REC-005",
    merchant: "Grocery Market",
    amount: 156.78,
    date: "2025-01-27",
    status: "processed",
  },
]

const recentPayouts = [
  {
    id: "PAY-001",
    amount: 1250.00,
    date: "2025-01-25",
    status: "completed",
    receipts: 42,
  },
  {
    id: "PAY-002",
    amount: 890.50,
    date: "2025-01-18",
    status: "completed",
    receipts: 31,
  },
  {
    id: "PAY-003",
    amount: 2100.75,
    date: "2025-01-11",
    status: "completed",
    receipts: 68,
  },
]

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home, active: true },
  { name: "Receipts", href: "/dashboard/receipts", icon: Receipt },
  { name: "Payouts", href: "/dashboard/payouts", icon: Wallet },
  { name: "Transactions", href: "/dashboard/transactions", icon: FileText },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
          <p className="text-sm text-[var(--muted-foreground)]">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-[var(--border)] bg-[var(--card)] lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-[var(--border)] px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]">
            <Receipt className="h-4 w-4" />
          </div>
          <span className="text-lg font-bold">Vero</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                item.active
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="border-t border-[var(--border)] p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="" alt={user.name} />
              <AvatarFallback className="bg-[var(--primary)] text-[var(--primary-foreground)] text-sm">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-[var(--muted-foreground)]">{user.email}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-md p-1.5 hover:bg-[var(--muted)]">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
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
        <header className="flex h-16 items-center gap-4 border-b border-[var(--border)] bg-[var(--card)] px-6">
          <div className="flex lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]">
                <Receipt className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold">Vero</span>
            </Link>
          </div>
          <div className="flex-1">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <Input
                type="search"
                placeholder="Search receipts, transactions..."
                className="pl-9"
              />
            </div>
          </div>
          <button className="relative rounded-md p-2 hover:bg-[var(--muted)]">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-md p-2 hover:bg-[var(--muted)] lg:hidden">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[var(--primary)] text-[var(--primary-foreground)] text-sm">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {navItems.map((item) => (
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
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[var(--muted)] p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page Title */}
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-[var(--muted-foreground)]">
                Welcome back, {user.name}. Here&apos;s your business overview.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Receipts</CardTitle>
                  <Receipt className="h-4 w-4 text-[var(--muted-foreground)]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,284</div>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    <span className="inline-flex items-center text-green-600">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      +12.5%
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-[var(--muted-foreground)]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    <span className="inline-flex items-center text-green-600">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      +20.1%
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
                  <CreditCard className="h-4 w-4 text-[var(--muted-foreground)]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$2,350.00</div>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    <span className="inline-flex items-center text-red-600">
                      <ArrowDownRight className="mr-1 h-3 w-3" />
                      -4.5%
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-[var(--muted-foreground)]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98.5%</div>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    <span className="inline-flex items-center text-green-600">
                      <ArrowUpRight className="mr-1 h-3 w-3" />
                      +2.1%
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tables Section */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Receipts */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Receipts</CardTitle>
                  <CardDescription>Your latest processed receipts</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Merchant</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentReceipts.map((receipt) => (
                        <TableRow key={receipt.id}>
                          <TableCell className="font-medium">{receipt.id}</TableCell>
                          <TableCell>{receipt.merchant}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                receipt.status === "processed" ? "success" : "warning"
                              }
                            >
                              {receipt.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            ${receipt.amount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Recent Payouts */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Payouts</CardTitle>
                  <CardDescription>Your latest payout transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Receipts</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentPayouts.map((payout) => (
                        <TableRow key={payout.id}>
                          <TableCell className="font-medium">{payout.id}</TableCell>
                          <TableCell>{payout.receipts} receipts</TableCell>
                          <TableCell>
                            <Badge variant="success">{payout.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            ${payout.amount.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Merchant Configuration Section */}
            <Card>
              <CardHeader>
                <CardTitle>Merchant Configuration</CardTitle>
                <CardDescription>
                  Configure your merchant details and payout settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Business Information</h4>
                    <div className="space-y-3 rounded-lg border border-[var(--border)] p-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-[var(--muted-foreground)]">
                          Merchant ID
                        </span>
                        <span className="text-sm font-mono">{user.merchantId}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-[var(--muted-foreground)]">
                          Business Name
                        </span>
                        <span className="text-sm">{user.name}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-[var(--muted-foreground)]">Email</span>
                        <span className="text-sm">{user.email}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-[var(--muted-foreground)]">Status</span>
                        <Badge variant="success">Active</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Payout Settings</h4>
                    <div className="space-y-3 rounded-lg border border-[var(--border)] p-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-[var(--muted-foreground)]">
                          Payout Schedule
                        </span>
                        <span className="text-sm">Weekly (Every Monday)</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-[var(--muted-foreground)]">
                          Bank Account
                        </span>
                        <span className="text-sm font-mono">****4242</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-[var(--muted-foreground)]">
                          Minimum Payout
                        </span>
                        <span className="text-sm">$100.00</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-[var(--muted-foreground)]">
                          Next Payout
                        </span>
                        <span className="text-sm">Feb 3, 2025</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Link
                    href="/dashboard/settings"
                    className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
                  >
                    <Settings className="h-4 w-4" />
                    Edit Settings
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
