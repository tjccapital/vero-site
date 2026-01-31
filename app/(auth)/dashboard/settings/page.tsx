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
  Settings,
  CircleHelp,
  Search,
  MoreVertical,
  Database,
  FileBarChart,
  Code,
  MoreHorizontal,
  LogOut,
  CreditCard,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  PanelLeftClose,
  PanelLeft,
  Menu,
  X,
  Save,
  Store,
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

const DOCS_URL = "https://docs.seevero.com/pos-plugins/overview"

const mainNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
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
  { name: "Settings", href: "/dashboard/settings", icon: Settings, active: true },
  { name: "Get Help", href: "/contact", icon: CircleHelp },
  { name: "Search", href: DOCS_URL, icon: Search, external: true },
]

export default function SettingsPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [saved, setSaved] = useState(false)

  // Business information state
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "Sunrise Coffee Co.",
    businessType: "Coffee Shop",
    address: "123 Main Street",
    suite: "Suite 400",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    country: "United States",
    phone: "(415) 555-0123",
    email: "hello@sunrisecoffee.com",
    website: "https://sunrisecoffee.com",
    taxId: "XX-XXXXXXX",
  })

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
      router.push("/auth/login?returnTo=/dashboard/settings")
    }
  }, [user, isLoading, router])

  const handleSave = () => {
    // Simulate saving
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
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
                "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
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
            <span className="text-sm font-medium">Business Settings</span>
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
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
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
              <h1 className="text-2xl font-semibold">Business Settings</h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Manage your business information and preferences
              </p>
            </div>

            {/* Success Message */}
            {saved && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="text-sm text-green-800 font-medium">Settings saved successfully!</p>
              </div>
            )}

            {/* Business Information */}
            <div className="rounded-lg border border-[var(--border)]">
              <div className="border-b border-[var(--border)] p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--muted)]">
                    <Store className="h-5 w-5 text-[var(--foreground)]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Business Information</h2>
                    <p className="text-sm text-[var(--muted-foreground)]">Basic details about your business</p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                {/* Business Name & Type */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Business Name</label>
                    <input
                      type="text"
                      value={businessInfo.businessName}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, businessName: e.target.value })}
                      className="w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Business Type</label>
                    <select
                      value={businessInfo.businessType}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, businessType: e.target.value })}
                      className="w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-white"
                    >
                      <option>Coffee Shop</option>
                      <option>Restaurant</option>
                      <option>Retail Store</option>
                      <option>Food Truck</option>
                      <option>Bakery</option>
                      <option>Bar / Nightclub</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {/* Tax ID */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tax ID / EIN</label>
                  <input
                    type="text"
                    value={businessInfo.taxId}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, taxId: e.target.value })}
                    placeholder="XX-XXXXXXX"
                    className="w-full sm:w-1/2 rounded-md border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="rounded-lg border border-[var(--border)]">
              <div className="border-b border-[var(--border)] p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--muted)]">
                    <MapPin className="h-5 w-5 text-[var(--foreground)]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Business Address</h2>
                    <p className="text-sm text-[var(--muted-foreground)]">Primary location of your business</p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                {/* Street Address */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Street Address</label>
                    <input
                      type="text"
                      value={businessInfo.address}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                      className="w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Suite / Unit</label>
                    <input
                      type="text"
                      value={businessInfo.suite}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, suite: e.target.value })}
                      className="w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* City, State, Zip */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                      type="text"
                      value={businessInfo.city}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, city: e.target.value })}
                      className="w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <input
                      type="text"
                      value={businessInfo.state}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, state: e.target.value })}
                      className="w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code</label>
                    <input
                      type="text"
                      value={businessInfo.zip}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, zip: e.target.value })}
                      className="w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <select
                    value={businessInfo.country}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, country: e.target.value })}
                    className="w-full sm:w-1/2 rounded-md border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent bg-white"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="rounded-lg border border-[var(--border)]">
              <div className="border-b border-[var(--border)] p-4 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--muted)]">
                    <Phone className="h-5 w-5 text-[var(--foreground)]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Contact Information</h2>
                    <p className="text-sm text-[var(--muted-foreground)]">How customers can reach your business</p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <span className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-[var(--muted-foreground)]" />
                        Phone Number
                      </span>
                    </label>
                    <input
                      type="tel"
                      value={businessInfo.phone}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                      className="w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <span className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[var(--muted-foreground)]" />
                        Business Email
                      </span>
                    </label>
                    <input
                      type="email"
                      value={businessInfo.email}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                      className="w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <span className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-[var(--muted-foreground)]" />
                      Website
                    </span>
                  </label>
                  <input
                    type="url"
                    value={businessInfo.website}
                    onChange={(e) => setBusinessInfo({ ...businessInfo, website: e.target.value })}
                    className="w-full sm:w-1/2 rounded-md border border-[var(--border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary)]/90 transition-colors"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
