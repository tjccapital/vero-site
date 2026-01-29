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
  ArrowRight,
  ExternalLink,
  CreditCard,
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
  { name: "Integrations", href: "/dashboard/integrations", icon: Cable, active: true },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
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

const posPlugins = [
  {
    id: "square",
    name: "Square",
    description: "Full POS integration with real-time receipt sync. Perfect for retail stores, restaurants, and service businesses.",
    docsUrl: "https://docs.seevero.com/pos-plugins/square",
    color: "bg-black",
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="currentColor">
        <path d="M4.5 2A2.5 2.5 0 0 0 2 4.5v15A2.5 2.5 0 0 0 4.5 22h15a2.5 2.5 0 0 0 2.5-2.5v-15A2.5 2.5 0 0 0 19.5 2h-15zm10.03 5.97a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 0 1-1.06-1.06l6-6a.75.75 0 0 1 1.06 0z"/>
      </svg>
    ),
    status: "available",
  },
  {
    id: "toast",
    name: "Toast",
    description: "Restaurant-focused POS with itemized receipts. Includes support for tips, modifiers, and split checks.",
    docsUrl: "https://docs.seevero.com/pos-plugins/toast",
    color: "bg-orange-500",
    icon: <span className="text-2xl font-bold text-white">T</span>,
    status: "coming_soon",
  },
  {
    id: "clover",
    name: "Clover",
    description: "Versatile POS for retail and service businesses. Supports inventory tracking and customer management.",
    docsUrl: "https://docs.seevero.com/pos-plugins/clover",
    color: "bg-green-600",
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
    status: "coming_soon",
  },
  {
    id: "spoton",
    name: "SpotOn",
    description: "All-in-one platform for restaurants and retail. Includes online ordering and loyalty programs.",
    docsUrl: "https://docs.seevero.com/pos-plugins/spoton",
    color: "bg-blue-600",
    icon: <span className="text-2xl font-bold text-white">S</span>,
    status: "coming_soon",
  },
  {
    id: "lightspeed",
    name: "Lightspeed",
    description: "Advanced retail and restaurant POS with powerful analytics and multi-location support.",
    docsUrl: "https://docs.seevero.com/pos-plugins/lightspeed",
    color: "bg-red-500",
    icon: <span className="text-2xl font-bold text-white">L</span>,
    status: "coming_soon",
  },
  {
    id: "shopify",
    name: "Shopify POS",
    description: "Unified commerce platform connecting online and in-store sales with digital receipts.",
    docsUrl: "https://docs.seevero.com/pos-plugins/shopify",
    color: "bg-green-500",
    icon: (
      <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="currentColor">
        <path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.114-.192-.211-.192s-1.929-.136-1.929-.136-1.275-1.274-1.439-1.411c-.045-.037-.075-.057-.121-.074l-.914 21.104h.023zm-5.337-6.979l.816-2.401s-.866-.448-1.923-.448c-1.555 0-1.632.975-1.632 1.219 0 1.341 1.753 1.855 1.753 3.144 0 1.556-1.184 2.557-2.78 2.557-1.913 0-2.892-1.189-2.892-1.189l.512-1.689s1.007.864 1.856.864c.556 0 .783-.436.783-.756 0-1.317-1.439-1.373-1.439-2.962 0-1.524 1.093-3.001 3.3-3.001 1.189 0 1.756.339 1.756.339l-.61 2.323z"/>
      </svg>
    ),
    status: "coming_soon",
  },
]

export default function IntegrationsPage() {
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
            <Cable className="h-4 w-4 text-[var(--muted-foreground)]" />
            <span className="text-sm font-medium">Integrations</span>
          </div>
          <Link href="/" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            Back to Site
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
          <div className="mx-auto max-w-6xl space-y-8">
            {/* Page Header */}
            <div>
              <h1 className="text-2xl font-bold">POS Integrations</h1>
              <p className="mt-1 text-[var(--muted-foreground)]">
                Connect your point-of-sale system to automatically send digital receipts to customers.
              </p>
            </div>

            {/* Available Integrations */}
            <div>
              <h2 className="mb-4 text-lg font-semibold">Available Plugins</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posPlugins.filter(p => p.status === "available").map((plugin) => (
                  <div
                    key={plugin.id}
                    className="group relative rounded-xl border border-[var(--border)] bg-white p-6 transition-all hover:border-[var(--primary)] hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className={cn("flex h-14 w-14 items-center justify-center rounded-xl", plugin.color)}>
                        {plugin.icon}
                      </div>
                      <Badge variant="success" className="text-xs">Available</Badge>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold group-hover:text-[var(--primary)]">
                      {plugin.name}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                      {plugin.description}
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <Link
                        href={plugin.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary)]/90 transition-colors"
                      >
                        View Documentation
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coming Soon */}
            <div>
              <h2 className="mb-4 text-lg font-semibold">Coming Soon</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posPlugins.filter(p => p.status === "coming_soon").map((plugin) => (
                  <div
                    key={plugin.id}
                    className="relative rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className={cn("flex h-14 w-14 items-center justify-center rounded-xl opacity-60", plugin.color)}>
                        {plugin.icon}
                      </div>
                      <Badge variant="outline" className="text-xs">Coming Soon</Badge>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-[var(--muted-foreground)]">
                      {plugin.name}
                    </h3>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                      {plugin.description}
                    </p>
                    <div className="mt-4">
                      <button
                        disabled
                        className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] cursor-not-allowed"
                      >
                        Notify Me
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Integration CTA */}
            <div className="rounded-xl border border-[var(--border)] bg-gradient-to-r from-[var(--primary)]/5 to-transparent p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Need a custom integration?</h3>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    We can build custom plugins for any POS system. Contact our team to discuss your requirements.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors whitespace-nowrap"
                >
                  Contact Sales
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
