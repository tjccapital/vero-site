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
  Code,
  FileBarChart,
  MoreHorizontal,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Menu,
  X,
  Building2,
  Mail,
  Phone,
  Globe,
  Bell,
  Shield,
  CheckCircle2,
} from "lucide-react"
import { VeroLogo, VeroLogoFull } from "@/components/ui/vero-logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const DOCS_URL = "https://docs.veroreceipts.com"

const mainNavItems = [
  { name: "Overview", href: "/issuer-dashboard", icon: LayoutDashboard, active: false },
  { name: "Receipts", href: "/issuer-dashboard/receipts", icon: Receipt, active: false },
  { name: "Users", href: "/issuer-dashboard/users", icon: Users, active: false },
  { name: "API Keys", href: "/issuer-dashboard/keys", icon: Key, active: false },
]

const documentNavItems = [
  { name: "API Docs", href: DOCS_URL, icon: Code, external: true },
  { name: "Reports", href: DOCS_URL, icon: FileBarChart, external: true },
  { name: "More", href: DOCS_URL, icon: MoreHorizontal, external: true },
]

const bottomNavItems = [
  { name: "Settings", href: "/issuer-dashboard/settings", icon: Settings, active: true },
  { name: "Get Help", href: "/contact", icon: CircleHelp },
  { name: "Search", href: DOCS_URL, icon: Search, external: true },
]

export default function IssuerSettingsPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    organizationName: "First National Bank",
    contactEmail: "integration@fnb.com",
    contactPhone: "+1 (555) 123-4567",
    webhookUrl: "https://api.fnb.com/vero/webhook",
    notifyOnFailure: true,
    notifyOnWeeklyReport: true,
    notifyOnSecurityAlert: true,
    ipWhitelist: "192.168.1.0/24, 10.0.0.0/8",
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
      router.push("/auth/login?returnTo=/issuer-dashboard/settings")
    }
  }, [user, isLoading, router])

  const handleSave = () => {
    // In a real app, this would make an API call
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
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
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "hidden flex-col border-r border-[var(--border)] lg:flex transition-all duration-300 h-full",
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
            <span className="text-sm font-medium">Settings</span>
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
            <div className="mb-2">
              <h1 className="text-2xl font-semibold">Settings</h1>
              <p className="text-sm text-[var(--muted-foreground)]">
                Manage your card issuer account settings and preferences
              </p>
            </div>

            {/* Success Message */}
            {saveSuccess && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Settings saved successfully</span>
                </div>
              </div>
            )}

            {/* Organization Settings */}
            <div className="rounded-lg border border-[var(--border)]">
              <div className="border-b border-[var(--border)] px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[var(--muted-foreground)]" />
                  <h2 className="font-semibold">Organization</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Organization Name</label>
                  <input
                    type="text"
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    className="w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Contact Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                      <input
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        className="w-full rounded-md border border-[var(--border)] pl-10 pr-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Contact Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                      <input
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                        className="w-full rounded-md border border-[var(--border)] pl-10 pr-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Webhook Settings */}
            <div className="rounded-lg border border-[var(--border)]">
              <div className="border-b border-[var(--border)] px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-[var(--muted-foreground)]" />
                  <h2 className="font-semibold">Webhook Configuration</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Webhook URL</label>
                  <input
                    type="url"
                    value={formData.webhookUrl}
                    onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                    placeholder="https://your-api.com/webhook"
                    className="w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm font-mono focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  />
                  <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
                    We&apos;ll send receipt delivery events to this URL
                  </p>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="rounded-lg border border-[var(--border)]">
              <div className="border-b border-[var(--border)] px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-[var(--muted-foreground)]" />
                  <h2 className="font-semibold">Notifications</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-sm font-medium">Delivery Failures</span>
                    <p className="text-xs text-[var(--muted-foreground)]">Get notified when receipt delivery fails</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.notifyOnFailure}
                    onChange={(e) => setFormData({ ...formData, notifyOnFailure: e.target.checked })}
                    className="h-5 w-5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-sm font-medium">Weekly Reports</span>
                    <p className="text-xs text-[var(--muted-foreground)]">Receive weekly summary of receipt activity</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.notifyOnWeeklyReport}
                    onChange={(e) => setFormData({ ...formData, notifyOnWeeklyReport: e.target.checked })}
                    className="h-5 w-5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-sm font-medium">Security Alerts</span>
                    <p className="text-xs text-[var(--muted-foreground)]">Get notified about security-related events</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.notifyOnSecurityAlert}
                    onChange={(e) => setFormData({ ...formData, notifyOnSecurityAlert: e.target.checked })}
                    className="h-5 w-5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                </label>
              </div>
            </div>

            {/* Security Settings */}
            <div className="rounded-lg border border-[var(--border)]">
              <div className="border-b border-[var(--border)] px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[var(--muted-foreground)]" />
                  <h2 className="font-semibold">Security</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">IP Whitelist</label>
                  <textarea
                    value={formData.ipWhitelist}
                    onChange={(e) => setFormData({ ...formData, ipWhitelist: e.target.value })}
                    placeholder="Enter IP addresses or CIDR ranges, separated by commas"
                    rows={3}
                    className="w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm font-mono focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  />
                  <p className="mt-1.5 text-xs text-[var(--muted-foreground)]">
                    Only allow API requests from these IP addresses. Leave empty to allow all.
                  </p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="rounded-md bg-[var(--primary)] px-6 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary)]/90 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
