"use client"

import { useEffect } from "react"
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
  Plus,
  Mail,
  Database,
  FileBarChart,
  Code,
  MoreHorizontal,
  ChevronDown,
  LogOut,
  CreditCard,
  ExternalLink,
  Info,
  CheckCircle,
  Building2,
  MapPin,
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

const mainNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Integrations", href: "/dashboard/integrations", icon: Cable },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard, active: true },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Receipts", href: "/dashboard/receipts", icon: Receipt },
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

// Demo merchant details
const merchantDetails = {
  address: "123 Main Street, Suite 400",
  city: "San Francisco",
  state: "CA",
  zip: "94105",
  size: "Small Business", // Small Business, Regional, Enterprise
}

export default function PaymentsPage() {
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
          <VeroLogo size={48} spinning className="text-[var(--primary)]" />
          <p className="text-sm text-[var(--muted-foreground)]">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Generate Stripe billing portal URL with merchant ID
  const stripeBillingPortalUrl = `https://billing.stripe.com/p/login/test_${user.merchantId}`

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
            <CreditCard className="h-4 w-4 text-[var(--muted-foreground)]" />
            <span className="text-sm font-medium">Payments</span>
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
          <div className="mx-auto max-w-3xl space-y-8">
            {/* Page Header */}
            <div>
              <h1 className="text-2xl font-bold">Payment Configuration</h1>
              <p className="mt-1 text-[var(--muted-foreground)]">
                Manage your payout settings and access the payment portal.
              </p>
            </div>

            {/* Payout Information */}
            <div className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 p-4">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--muted-foreground)]" />
              <div className="text-sm text-[var(--foreground)]">
                <p className="font-medium mb-1">How payouts are calculated</p>
                <p className="text-[var(--muted-foreground)]">
                  Merchant payouts are assessed based on multiple factors including the number of digital receipts sent,
                  quality of receipt metadata, number of consumer inquiries regarding receipts, and other engagement metrics.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={stripeBillingPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[var(--foreground)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--foreground)]/90 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Open Payments Portal
              </Link>
            </div>

            {/* Business Details Card */}
            <div className="rounded-xl border border-[var(--border)] p-6">
              <h2 className="text-lg font-semibold">Business Details</h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <div>
                    <p className="text-sm font-medium">Business Name</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Your registered business name</p>
                  </div>
                  <span className="text-sm font-semibold">{user.name}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <div>
                    <p className="text-sm font-medium">Business Address</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Your primary business location</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{merchantDetails.address}</p>
                    <p className="text-sm text-[var(--muted-foreground)]">{merchantDetails.city}, {merchantDetails.state} {merchantDetails.zip}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Merchant Size</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Your business classification</p>
                  </div>
                  <Badge variant="outline" className="text-sm">{merchantDetails.size}</Badge>
                </div>
              </div>
            </div>

            {/* Merchant Info */}
            <div className="rounded-xl border border-[var(--border)] p-6">
              <h2 className="text-lg font-semibold">Merchant Information</h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <div>
                    <p className="text-sm font-medium">Merchant ID</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Your unique merchant identifier</p>
                  </div>
                  <code className="rounded bg-[var(--muted)] px-2 py-1 text-xs font-mono">{user.merchantId}</code>
                </div>
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <div>
                    <p className="text-sm font-medium">Account Status</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Your account verification status</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">Verified</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Payout Account</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Connected bank account for payouts</p>
                  </div>
                  <span className="text-sm font-semibold">••••4242</span>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="rounded-xl border border-[var(--border)] bg-gradient-to-r from-[var(--primary)]/5 to-transparent p-6">
              <h3 className="text-lg font-semibold">Need help with payments?</h3>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Our support team is available to help with any payment questions or concerns.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--primary)] hover:underline"
              >
                Contact Support
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
