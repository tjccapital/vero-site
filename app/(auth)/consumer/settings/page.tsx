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
  ExternalLink,
  Sparkles,
  Landmark,
  Loader2,
  AlertCircle,
  RefreshCw,
  Unlink,
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
  { name: "Accounts", href: "/consumer/accounts", icon: Landmark },
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

  // Gmail integration state
  type EmailStatus = {
    connected: boolean
    email_address?: string | null
    last_scanned_at?: string | null
  }
  const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null)
  const [emailStatusLoading, setEmailStatusLoading] = useState(true)
  const [emailActionLoading, setEmailActionLoading] = useState<null | "connect" | "disconnect" | "scan">(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<{
    emails_scanned: number
    receipts_found: number
    attachments_saved: number
  } | null>(null)

  // Generate a simple referral code based on user
  const referralCode = user?.email ? `VERO${user.email.substring(0, 4).toUpperCase()}5` : "VERO5"

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.veroreceipts.com"
  const apiFetch = (path: string, init?: RequestInit) =>
    fetch(`${API_BASE}${path}`, { credentials: "include", ...init })

  const fetchEmailStatus = async () => {
    try {
      setEmailStatusLoading(true)
      const res = await apiFetch("/api/email/status")
      if (!res.ok) throw new Error("Failed to load email status")
      const data = await res.json()
      setEmailStatus(data)
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Failed to load email status")
    } finally {
      setEmailStatusLoading(false)
    }
  }

  const handleConnectGmail = async () => {
    setEmailError(null)
    setEmailActionLoading("connect")
    try {
      const res = await apiFetch("/api/email/connect/google", { method: "POST" })
      if (!res.ok) throw new Error("Failed to start Gmail connection")
      const data = await res.json()
      if (!data.auth_url) throw new Error("No authorization URL returned")
      window.location.href = data.auth_url
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Failed to connect Gmail")
      setEmailActionLoading(null)
    }
  }

  const handleDisconnectGmail = async () => {
    if (!confirm("Disconnect your Gmail account? Vero will stop scanning your inbox for receipts.")) return
    setEmailError(null)
    setEmailActionLoading("disconnect")
    try {
      const res = await apiFetch("/api/email/disconnect", { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to disconnect Gmail")
      setScanResult(null)
      await fetchEmailStatus()
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Failed to disconnect Gmail")
    } finally {
      setEmailActionLoading(null)
    }
  }

  const handleScanInbox = async () => {
    setEmailError(null)
    setScanResult(null)
    setEmailActionLoading("scan")
    try {
      const res = await apiFetch("/api/email/scan", { method: "POST" })
      if (!res.ok) throw new Error("Failed to scan inbox")
      const data = await res.json()
      if (data?.result) setScanResult(data.result)
      await fetchEmailStatus()
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Failed to scan inbox")
    } finally {
      setEmailActionLoading(null)
    }
  }

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

  // Load Gmail connection status once authenticated
  useEffect(() => {
    if (user) {
      fetchEmailStatus()
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
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "hidden flex-col border-r border-[var(--border)] lg:flex transition-all duration-300 h-full",
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

            {/* Email Integration */}
            <div className="rounded-lg border border-[var(--border)]">
              <div className="border-b border-[var(--border)] px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-[var(--muted-foreground)]" />
                  <h2 className="font-semibold">Email Integration</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Connect Gmail</p>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Let Vero scan your Gmail for receipts, invoices, and order confirmations, and attach them to your transactions automatically.
                  </p>
                </div>

                {emailStatusLoading ? (
                  <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking connection...
                  </div>
                ) : emailStatus?.connected ? (
                  <div className="rounded-md border border-[var(--border)] bg-[var(--muted)]/40 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {emailStatus.email_address || "Gmail account connected"}
                          </p>
                          <p className="text-xs text-[var(--muted-foreground)]">
                            {emailStatus.last_scanned_at
                              ? `Last scanned ${new Date(emailStatus.last_scanned_at).toLocaleString()}`
                              : "No scans yet"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleScanInbox}
                          disabled={emailActionLoading !== null}
                          className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors disabled:opacity-60"
                        >
                          {emailActionLoading === "scan" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                          Scan now
                        </button>
                        <button
                          onClick={handleDisconnectGmail}
                          disabled={emailActionLoading !== null}
                          className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60"
                        >
                          {emailActionLoading === "disconnect" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Unlink className="h-4 w-4" />
                          )}
                          Disconnect
                        </button>
                      </div>
                    </div>
                    {scanResult && (
                      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[var(--border)] pt-4 text-center">
                        <div>
                          <p className="text-lg font-semibold">{scanResult.emails_scanned}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">Emails scanned</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold">{scanResult.receipts_found}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">Receipts found</p>
                        </div>
                        <div>
                          <p className="text-lg font-semibold">{scanResult.attachments_saved}</p>
                          <p className="text-xs text-[var(--muted-foreground)]">Attachments saved</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleConnectGmail}
                    disabled={emailActionLoading !== null}
                    className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors disabled:opacity-60"
                  >
                    {emailActionLoading === "connect" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.12c-.22-.66-.35-1.36-.35-2.12s.13-1.46.35-2.12V7.04H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.96l3.66-2.84z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
                      </svg>
                    )}
                    Connect Gmail
                  </button>
                )}

                {emailError && (
                  <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{emailError}</span>
                  </div>
                )}

                <p className="text-xs text-[var(--muted-foreground)]">
                  Vero only requests read access to your Gmail. You can disconnect at any time.
                </p>
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

            {/* Subscription Settings */}
            <div className="rounded-lg border border-[var(--border)] overflow-hidden">
              <div className="border-b border-[var(--border)] px-4 py-3 sm:px-6 bg-gradient-to-r from-[var(--primary)]/5 to-transparent">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[var(--primary)]" />
                  <h2 className="font-semibold">Subscription</h2>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                        Active Trial
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">Free Trial</p>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        You&apos;re currently on a free 1-week trial. Enjoy full access to all features.
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-[var(--muted-foreground)]">Unlimited receipts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-[var(--muted-foreground)]">Spending insights</span>
                      </div>
                    </div>
                  </div>
                  <a
                    href={`https://billing.stripe.com/p/login/test_${user.sub?.replace('|', '_')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-md border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Manage Subscription
                  </a>
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--border)]">
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Your trial ends in 7 days. After the trial, you&apos;ll be prompted to choose a subscription plan to continue using premium features.
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
