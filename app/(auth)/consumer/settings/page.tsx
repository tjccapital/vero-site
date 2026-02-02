"use client"

import { useEffect, useState } from "react"
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
  User,
  Mail,
  Bell,
  Shield,
  CheckCircle2,
  Gift,
  CreditCard,
  Smartphone,
  Copy,
  Check,
} from "lucide-react"
import { VeroLogo, VeroLogoFull } from "@/components/ui/vero-logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const mainNavItems = [
  { name: "Home", href: "/consumer", icon: LayoutDashboard },
  { name: "Receipts", href: "/consumer/receipts", icon: Receipt },
]

const bottomNavItems = [
  { name: "Settings", href: "/consumer/settings", icon: Settings, active: true },
  { name: "Get Help", href: "/contact", icon: CircleHelp },
]

export default function ConsumerSettingsPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [referralCopied, setReferralCopied] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    notifyOnNewReceipt: true,
    notifyOnWeeklyDigest: false,
    notifyOnReferralBonus: true,
    enablePushNotifications: true,
    defaultCurrency: "USD",
    autoCategorizeTx: true,
  })

  // Generate a simple referral code based on user
  const referralCode = user?.email ? `VERO${user.email.substring(0, 4).toUpperCase()}5` : "VERO5"

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode)
    setReferralCopied(true)
    setTimeout(() => setReferralCopied(false), 2000)
  }

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
      router.push("/auth/login?returnTo=/consumer/settings")
    }
  }, [user, isLoading, router])

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        displayName: user.name || "",
        email: user.email || "",
      }))
    }
  }, [user])

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
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
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
          <Link href="/consumer" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            Back to Home
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
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
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
                Manage your account settings and preferences
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

            {/* Profile Settings */}
            <div className="rounded-lg border border-[var(--border)]">
              <div className="border-b border-[var(--border)] px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-[var(--muted-foreground)]" />
                  <h2 className="font-semibold">Profile</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.picture || undefined} alt={user.name || "User"} />
                    <AvatarFallback className="bg-[var(--muted)] text-xl">
                      {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name || "User"}</p>
                    <p className="text-sm text-[var(--muted-foreground)]">{user.email}</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Display Name</label>
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      className="w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full rounded-md border border-[var(--border)] bg-[var(--muted)] pl-10 pr-3 py-2 text-sm text-[var(--muted-foreground)]"
                      />
                    </div>
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">Email is managed by your login provider</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Program */}
            <div className="rounded-lg border border-[var(--border)] overflow-hidden">
              <div className="border-b border-[var(--border)] px-4 py-3 sm:px-6 bg-gradient-to-r from-[var(--primary)]/5 to-transparent">
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-[var(--primary)]" />
                  <h2 className="font-semibold">Referral Program</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="font-medium">Earn $5 for every friend you refer</p>
                    <p className="text-sm text-[var(--muted-foreground)]">Share your code and earn when they sign up</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--muted)] px-4 py-2">
                      <span className="font-mono font-bold">{referralCode}</span>
                    </div>
                    <button
                      onClick={copyReferralCode}
                      className="flex items-center justify-center gap-2 rounded-md border border-[var(--border)] px-3 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors"
                    >
                      {referralCopied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                      <span className="font-bold text-green-600">3</span>
                    </div>
                    <span className="text-[var(--muted-foreground)]">Friends referred</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)]/10">
                      <span className="font-bold text-[var(--primary)]">$15</span>
                    </div>
                    <span className="text-[var(--muted-foreground)]">Total earned</span>
                  </div>
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
                    <span className="text-sm font-medium">New Receipt Alerts</span>
                    <p className="text-xs text-[var(--muted-foreground)]">Get notified when a new receipt is received</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.notifyOnNewReceipt}
                    onChange={(e) => setFormData({ ...formData, notifyOnNewReceipt: e.target.checked })}
                    className="h-5 w-5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-sm font-medium">Weekly Spending Digest</span>
                    <p className="text-xs text-[var(--muted-foreground)]">Receive a weekly summary of your spending</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.notifyOnWeeklyDigest}
                    onChange={(e) => setFormData({ ...formData, notifyOnWeeklyDigest: e.target.checked })}
                    className="h-5 w-5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-sm font-medium">Referral Bonus Updates</span>
                    <p className="text-xs text-[var(--muted-foreground)]">Get notified when you earn referral bonuses</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.notifyOnReferralBonus}
                    onChange={(e) => setFormData({ ...formData, notifyOnReferralBonus: e.target.checked })}
                    className="h-5 w-5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-[var(--muted-foreground)]" />
                    <div>
                      <span className="text-sm font-medium">Push Notifications</span>
                      <p className="text-xs text-[var(--muted-foreground)]">Enable push notifications on this device</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.enablePushNotifications}
                    onChange={(e) => setFormData({ ...formData, enablePushNotifications: e.target.checked })}
                    className="h-5 w-5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                </label>
              </div>
            </div>

            {/* Preferences */}
            <div className="rounded-lg border border-[var(--border)]">
              <div className="border-b border-[var(--border)] px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[var(--muted-foreground)]" />
                  <h2 className="font-semibold">Preferences</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Default Currency</label>
                  <select
                    value={formData.defaultCurrency}
                    onChange={(e) => setFormData({ ...formData, defaultCurrency: e.target.value })}
                    className="w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm focus:border-[var(--primary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                  </select>
                </div>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="text-sm font-medium">Auto-categorize Transactions</span>
                    <p className="text-xs text-[var(--muted-foreground)]">Automatically categorize receipts based on merchant</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.autoCategorizeTx}
                    onChange={(e) => setFormData({ ...formData, autoCategorizeTx: e.target.checked })}
                    className="h-5 w-5 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                </label>
              </div>
            </div>

            {/* Account Security */}
            <div className="rounded-lg border border-[var(--border)]">
              <div className="border-b border-[var(--border)] px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[var(--muted-foreground)]" />
                  <h2 className="font-semibold">Security</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Connected Account</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      You're signed in via {user.sub?.includes('google') ? 'Google' : user.sub?.includes('github') ? 'GitHub' : 'Email'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm">Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-lg border border-red-200">
              <div className="border-b border-red-200 bg-red-50 px-4 py-3 sm:px-6">
                <h2 className="font-semibold text-red-800">Danger Zone</h2>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium">Delete Account</p>
                    <p className="text-xs text-[var(--muted-foreground)]">Permanently delete your account and all data</p>
                  </div>
                  <button className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                    Delete Account
                  </button>
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
