"use client"

import { useCallback, useEffect, useState } from "react"
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
  Landmark,
  Plus,
  CreditCard,
  CheckCircle2,
  Shield,
  Loader2,
} from "lucide-react"
import { VeroLogo, VeroLogoFull } from "@/components/ui/vero-logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PlaidLinkButton } from "@/components/plaid-link-button"
import {
  createLinkToken,
  exchangePublicToken,
  fetchPlaidAccounts,
  type PlaidAccount,
} from "@/lib/plaid"

const mainNavItems = [
  { name: "Home", href: "/consumer", icon: LayoutDashboard },
  { name: "Receipts", href: "/consumer/receipts", icon: Receipt },
  { name: "Accounts", href: "/consumer/accounts", icon: Landmark, active: true },
]

const bottomNavItems = [
  { name: "Settings", href: "/consumer/settings", icon: Settings },
  { name: "Get Help", href: "/contact", icon: CircleHelp },
]

export default function ConsumerAccountsPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showPlaidModal, setShowPlaidModal] = useState(false)
  const [accounts, setAccounts] = useState<PlaidAccount[]>([])
  const [accountsLoading, setAccountsLoading] = useState(true)
  const [accountsError, setAccountsError] = useState<string | null>(null)
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [linkTokenError, setLinkTokenError] = useState<string | null>(null)
  const [exchanging, setExchanging] = useState(false)

  const loadAccounts = useCallback(async () => {
    setAccountsLoading(true)
    setAccountsError(null)
    try {
      const res = await fetchPlaidAccounts()
      setAccounts(res.accounts ?? [])
    } catch (err) {
      console.error("[Plaid] Failed to load accounts:", err)
      setAccountsError("Couldn't load your connected accounts. Try refreshing.")
    } finally {
      setAccountsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!user) return
    loadAccounts()
  }, [user, loadAccounts])

  // Fetch the Plaid link_token lazily — only when the user opens the modal,
  // and only if we don't already have one. Tokens are short-lived (~30 min)
  // so we drop them when the modal closes.
  useEffect(() => {
    if (!showPlaidModal) return
    if (linkToken) return
    let cancelled = false
    setLinkTokenError(null)
    createLinkToken()
      .then((res) => {
        if (cancelled) return
        setLinkToken(res.link_token)
      })
      .catch((err) => {
        console.error("[Plaid] Failed to create link token:", err)
        if (cancelled) return
        setLinkTokenError("Couldn't start Plaid Link. Please try again.")
      })
    return () => {
      cancelled = true
    }
  }, [showPlaidModal, linkToken])

  const closePlaidModal = useCallback(() => {
    setShowPlaidModal(false)
    setLinkToken(null)
    setLinkTokenError(null)
  }, [])

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
      router.push("/auth/login?returnTo=/consumer/accounts")
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
        </nav>

        {/* Bottom Navigation */}
        <div className="border-t border-[var(--border)] px-3 py-2">
          {bottomNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              title={sidebarCollapsed ? item.name : undefined}
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
            <span className="text-sm font-medium">Connected Accounts</span>
          </div>
          <Link href="/" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            Back to Site
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

              {/* Bottom Navigation */}
              <div className="py-4 border-t border-[var(--border)]">
                {bottomNavItems.map((item) => (
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold">Connected Accounts</h1>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Manage your linked bank accounts and cards
                </p>
              </div>
              <button
                onClick={() => setShowPlaidModal(true)}
                className="flex items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary)]/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Account
              </button>
            </div>

            {/* Summary Card */}
            <div className="rounded-lg border border-[var(--border)] p-4 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)]/10">
                  <Landmark className="h-6 w-6 text-[var(--primary)]" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold">{accounts.length}</p>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    Account{accounts.length !== 1 ? 's' : ''} connected
                  </p>
                </div>
              </div>
            </div>

            {/* Accounts List */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Your Accounts</h2>

              {accountsLoading ? (
                <div className="rounded-lg border border-dashed border-[var(--border)] p-8 text-center">
                  <Loader2 className="h-6 w-6 mx-auto animate-spin text-[var(--muted-foreground)]" />
                  <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                    Loading your accounts...
                  </p>
                </div>
              ) : accountsError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {accountsError}
                </div>
              ) : accounts.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[var(--border)] p-8 text-center">
                  <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-[var(--muted)]">
                    <Landmark className="h-6 w-6 text-[var(--muted-foreground)]" />
                  </div>
                  <h3 className="mt-4 font-medium">No accounts connected</h3>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    Connect your bank accounts or cards to start receiving digital receipts
                  </p>
                  <button
                    onClick={() => setShowPlaidModal(true)}
                    className="mt-4 inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary)]/90 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Connect Account
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {accounts.map((account) => {
                    const institution =
                      account.institutionName || account.institution_name || account.institution
                    const subtitle = [institution, account.subtype || account.type]
                      .filter(Boolean)
                      .join(" · ")
                    return (
                      <div
                        key={account.id}
                        className="rounded-lg border border-[var(--border)] p-4 sm:p-5"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--muted)]">
                            <CreditCard className="h-6 w-6 text-[var(--muted-foreground)]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold">{account.name}</h3>
                                <p className="text-sm text-[var(--muted-foreground)]">
                                  {subtitle}
                                  {account.mask ? ` ···· ${account.mask}` : null}
                                </p>
                              </div>
                              <div className="flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                                <CheckCircle2 className="h-3 w-3" />
                                Active
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Security Note */}
            <div className="rounded-lg bg-[var(--muted)]/50 p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-[var(--primary)] mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-sm">Bank-level security</h3>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                    Your credentials are encrypted and securely transmitted directly to your bank through Plaid. Vero never sees or stores your login information. We use the same encryption technology that banks use to protect your data.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Plaid Link Modal */}
      {showPlaidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closePlaidModal}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md mx-4 rounded-xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/10">
                  <Landmark className="h-5 w-5 text-[var(--primary)]" />
                </div>
                <div>
                  <h2 className="font-semibold">Link a Bank Account</h2>
                  <p className="text-xs text-[var(--muted-foreground)]">Securely connect via Plaid</p>
                </div>
              </div>
              <button
                onClick={closePlaidModal}
                className="rounded-md p-1 hover:bg-[var(--muted)] transition-colors"
              >
                <X className="h-5 w-5 text-[var(--muted-foreground)]" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-[var(--muted-foreground)]">
                Connect your bank account or credit card to automatically receive digital receipts for your transactions.
              </p>

              {/* Supported Institutions */}
              <div className="grid grid-cols-3 gap-2">
                {['Chase', 'Bank of America', 'Wells Fargo', 'Citi', 'Capital One', 'US Bank'].map((bank) => (
                  <div
                    key={bank}
                    className="flex items-center justify-center rounded-lg border border-[var(--border)] p-3 text-xs font-medium text-[var(--muted-foreground)]"
                  >
                    {bank}
                  </div>
                ))}
              </div>
              <p className="text-xs text-center text-[var(--muted-foreground)]">
                + 10,000 more financial institutions
              </p>

              {/* Plaid Button */}
              {linkTokenError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {linkTokenError}
                </div>
              ) : null}

              {linkToken ? (
                <PlaidLinkButton
                  linkToken={linkToken}
                  disabled={exchanging}
                  onSuccess={async (publicToken, metadata) => {
                    setExchanging(true)
                    try {
                      await exchangePublicToken(publicToken, {
                        institution: metadata?.institution
                          ? {
                              id: metadata.institution.institution_id,
                              name: metadata.institution.name,
                            }
                          : null,
                        accounts: metadata?.accounts?.map((a) => ({
                          id: a.id,
                          name: a.name,
                          mask: a.mask ?? undefined,
                        })),
                      })
                      await loadAccounts()
                      closePlaidModal()
                    } catch (err) {
                      console.error("[Plaid] Exchange failed:", err)
                      setLinkTokenError(
                        "We couldn't finish linking your account. Please try again."
                      )
                    } finally {
                      setExchanging(false)
                    }
                  }}
                  onExit={(err) => {
                    if (err) {
                      console.warn("[Plaid] Link exited with error:", err)
                    }
                  }}
                />
              ) : (
                <button
                  type="button"
                  disabled
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--foreground)] px-4 py-3 text-sm font-medium text-white opacity-60 cursor-not-allowed"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Preparing Plaid...
                </button>
              )}

              {/* Security Note */}
              <div className="flex items-start gap-2 rounded-lg bg-[var(--muted)]/50 p-3">
                <Shield className="h-4 w-4 text-[var(--muted-foreground)] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-[var(--muted-foreground)]">
                  Your credentials are encrypted and securely transmitted directly to your bank through Plaid. Vero never sees or stores your login information.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
