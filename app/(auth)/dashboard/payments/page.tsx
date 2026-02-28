"use client"

import { useEffect, useState } from "react"
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
  PanelLeftClose,
  PanelLeft,
  Menu,
  X,
} from "lucide-react"
import { VeroLogo, VeroLogoFull } from "@/components/ui/vero-logo"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const DOCS_URL = "https://docs.veroreceipts.com/pos-plugins/overview"

const mainNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Integrations", href: "/dashboard/integrations", icon: Cable },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard, active: true },
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

// Demo merchant details
const merchantDetails = {
  address: "123 Main Street, Suite 400",
  city: "San Francisco",
  state: "CA",
  zip: "94105",
  size: "Small Business", // Small Business, Regional, Enterprise
}

export default function PaymentsPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
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
      router.push("/auth/login?returnTo=/dashboard/payments")
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

  // Generate Stripe billing portal URL with user sub (Auth0 user ID)
  const stripeBillingPortalUrl = `https://billing.stripe.com/p/login/test_${user.sub?.replace('|', '_')}`

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "hidden flex-col border-r border-[var(--border)] lg:flex transition-all duration-300 h-full",
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
          <div className="pt-4">
            {!sidebarCollapsed && (
              <p className="px-3 py-2 text-xs font-medium text-[var(--muted-foreground)]">
                Documents
              </p>
            )}
            {documentNavItems.map((item) => (
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
        <div className="border-t border-[var(--border)] p-3 min-w-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex items-center gap-3 rounded-md hover:bg-[var(--muted)] p-1 w-full min-w-0",
                sidebarCollapsed && "justify-center"
              )}>
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={user.picture || undefined} alt={user.name || "User"} />
                  <AvatarFallback className="bg-[var(--muted)] text-sm">
                    {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                {!sidebarCollapsed && (
                  <>
                    <div className="flex-1 min-w-0 overflow-hidden text-left" title={user.email || undefined}>
                      <p className="truncate text-sm font-medium">{user.name || "User"}</p>
                      <p className="truncate text-xs text-[var(--muted-foreground)]">{user.email}</p>
                    </div>
                    <MoreVertical className="h-4 w-4 flex-shrink-0 text-[var(--muted-foreground)]" />
                  </>
                )}
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
            <span className="text-sm font-medium">Payments</span>
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
          <div className="mx-auto max-w-3xl space-y-6 w-full">
            {/* Page Header */}
            <div>
              <h1 className="text-2xl font-bold">Payments</h1>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Manage payouts and billing settings.
              </p>
            </div>

            {/* Payout Summary Card */}
            <div className="rounded-xl border border-[var(--border)] p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm text-[var(--muted-foreground)]">30-Day Payout</p>
                  <p className="text-3xl font-bold mt-1">$75.00</p>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Account verified</span>
                  </div>
                </div>
                <Link
                  href={stripeBillingPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--foreground)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--foreground)]/90 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Portal
                </Link>
              </div>
            </div>

            {/* Account Details */}
            <div className="rounded-xl border border-[var(--border)] p-5">
              <h2 className="text-base font-semibold mb-4">Account Details</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                  <span className="text-sm text-[var(--muted-foreground)]">Business Name</span>
                  <span className="text-sm font-medium">{user.name || "User"}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                  <span className="text-sm text-[var(--muted-foreground)]">Merchant ID</span>
                  <code className="rounded bg-[var(--muted)] px-2 py-0.5 text-xs font-mono">{user.sub?.replace('|', '_').slice(0, 16) || "N/A"}...</code>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                  <span className="text-sm text-[var(--muted-foreground)]">Payout Account</span>
                  <span className="text-sm font-medium">••••4242</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[var(--border)]">
                  <span className="text-sm text-[var(--muted-foreground)]">Classification</span>
                  <Badge variant="outline" className="text-xs">{merchantDetails.size}</Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-[var(--muted-foreground)]">Business Info</span>
                  <Link
                    href="/dashboard/settings"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:underline"
                  >
                    <Settings className="h-3.5 w-3.5" />
                    Edit in Settings
                  </Link>
                </div>
              </div>
            </div>

            {/* How Payouts Work - Collapsible/Compact */}
            <details className="rounded-xl border border-[var(--border)] p-5 group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-[var(--muted-foreground)]" />
                  <span className="text-sm font-medium">How payouts work</span>
                </div>
                <ChevronDown className="h-4 w-4 text-[var(--muted-foreground)] transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                Payouts are calculated based on digital receipts sent, receipt quality, consumer engagement, and other metrics.
              </p>
            </details>

            {/* Help Link */}
            <div className="flex items-center justify-between rounded-xl border border-[var(--border)] p-4">
              <span className="text-sm text-[var(--muted-foreground)]">Need help with payments?</span>
              <Link
                href="/contact"
                className="text-sm font-medium text-[var(--primary)] hover:underline"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
