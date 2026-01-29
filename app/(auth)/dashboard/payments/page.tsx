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

// Merchant tiers configuration
const merchantTiers = {
  starter: {
    name: "Starter",
    price: "Free",
    receiptsPerMonth: "Up to 500",
    payoutRate: "3%",
  },
  growth: {
    name: "Growth",
    price: "$49/mo",
    receiptsPerMonth: "Up to 5,000",
    payoutRate: "4%",
  },
  professional: {
    name: "Professional",
    price: "$149/mo",
    receiptsPerMonth: "Up to 25,000",
    payoutRate: "4.5%",
  },
  enterprise: {
    name: "Enterprise",
    price: "Custom",
    receiptsPerMonth: "Unlimited",
    payoutRate: "5%+",
  },
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

  // Demo merchant is on Growth tier
  const currentTier = merchantTiers.growth

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
                Manage your subscription, payment methods, and payout settings.
              </p>
            </div>

            {/* Upgrade Notice */}
            <div className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--muted)]/30 p-4">
              <Info className="mt-0.5 h-5 w-5 text-[var(--muted-foreground)]" />
              <p className="text-sm text-[var(--foreground)]">
                To upgrade to our new plans, please contact sales.
              </p>
            </div>

            {/* Current Plan */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[var(--foreground)]">
                  You are currently on the <span className="font-semibold">{currentTier.name}</span> plan.
                </p>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  To cancel your subscription, update your payment method, or view your billing history, please visit our billing portal.
                </p>
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
                  Open Billing Portal
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-medium hover:bg-[var(--muted)] transition-colors"
                >
                  Change Plan
                </Link>
              </div>
            </div>

            {/* Plan Details Card */}
            <div className="rounded-xl border border-[var(--border)] p-6">
              <h2 className="text-lg font-semibold">Plan Details</h2>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <div>
                    <p className="text-sm font-medium">Current Plan</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Your active subscription tier</p>
                  </div>
                  <Badge variant="success" className="text-sm">{currentTier.name}</Badge>
                </div>
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <div>
                    <p className="text-sm font-medium">Monthly Price</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Billed monthly to your payment method</p>
                  </div>
                  <span className="text-sm font-semibold">{currentTier.price}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
                  <div>
                    <p className="text-sm font-medium">Receipts Included</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Digital receipts per month</p>
                  </div>
                  <span className="text-sm font-semibold">{currentTier.receiptsPerMonth}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Payout Rate</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Revenue share on processed receipts</p>
                  </div>
                  <span className="text-sm font-semibold">{currentTier.payoutRate}</span>
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
              <h3 className="text-lg font-semibold">Need help with billing?</h3>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Our support team is available to help with any billing questions or concerns.
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
