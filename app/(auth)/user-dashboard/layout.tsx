"use client"

import { useEffect, useState, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@auth0/nextjs-auth0/client"
import {
  ArrowLeft,
  CircleHelp,
  FileImage,
  Handshake,
  Landmark,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Tag,
  MoreVertical,
  PanelLeft,
  PanelLeftClose,
  Receipt,
  Settings as SettingsIcon,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { VeroLogo, VeroLogoFull } from "@/components/ui/vero-logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Shared shell for every page under /user-dashboard. Owns the sidebar (desktop),
// mobile drawer, top bar, and auth gate. Pages render only their main
// content — including their own page-level "not found" / error states —
// so the navigation chrome stays consistent across every state.

const mainNavItems: {
  name: string
  href: string
  icon: typeof LayoutDashboard
  badge?: string
}[] = [
  { name: "Home", href: "/user-dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/user-dashboard/transactions", icon: Receipt },
  { name: "Receipts", href: "/user-dashboard/receipts", icon: FileImage },
  { name: "Offers", href: "/user-dashboard/offers", icon: Tag, badge: "New" },
  { name: "Accounts", href: "/user-dashboard/accounts", icon: Landmark },
  { name: "Affiliate", href: "/user-dashboard/affiliate", icon: Handshake },
  { name: "Chat", href: "/user-dashboard/chat?new=1", icon: MessageSquare },
]

const bottomNavItems = [
  { name: "Settings", href: "/user-dashboard/settings", icon: SettingsIcon },
  { name: "Get Help", href: "/contact", icon: CircleHelp },
  { name: "Back to Site", href: "/", icon: ArrowLeft },
]

function isActive(pathname: string, href: string): boolean {
  // Compare on the path only — nav hrefs may carry a query (e.g. Chat's ?new=1).
  const path = href.split("?")[0]
  if (path === "/user-dashboard") {
    // Match the dashboard exactly — otherwise every /user-dashboard/* page would
    // light up Home as well.
    return pathname === "/user-dashboard"
  }
  return pathname === path || pathname.startsWith(`${path}/`)
}

export default function ConsumerLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const pathname = usePathname() ?? "/user-dashboard"
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  // Auth gate. We don't pass a returnTo here so it falls back to the
  // current pathname.
  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/auth/login?returnTo=${encodeURIComponent(pathname)}`)
    }
  }, [user, isLoading, router, pathname])

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
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden flex-col border-r border-[var(--border)] lg:flex transition-all duration-300 h-full",
          sidebarCollapsed ? "w-[60px]" : "w-[240px]"
        )}
      >
        <div className="flex h-14 items-center px-4">
          <Link href="/user-dashboard">
            {!sidebarCollapsed && (
              <VeroLogoFull height={20} className="text-[var(--foreground)]" />
            )}
            {sidebarCollapsed && (
              <VeroLogo size={20} className="text-[var(--foreground)]" />
            )}
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {mainNavItems.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                title={sidebarCollapsed ? item.name : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-[var(--muted)] font-medium text-[var(--foreground)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
                  sidebarCollapsed && "justify-center px-2"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <span className="flex flex-1 items-center justify-between">
                    {item.name}
                    {item.badge && (
                      <span className="rounded-full bg-[var(--primary)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--primary)]">
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-[var(--border)] px-3 py-2">
          {bottomNavItems.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                title={sidebarCollapsed ? item.name : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-[var(--muted)] font-medium text-[var(--foreground)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]",
                  sidebarCollapsed && "justify-center px-2"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!sidebarCollapsed && item.name}
              </Link>
            )
          })}
        </div>

        <div className="border-t border-[var(--border)] p-3">
          {sidebarCollapsed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex w-full items-center justify-center"
                  title={user.email || user.name || "User"}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.picture || undefined}
                      alt={user.name || "User"}
                    />
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
                <AvatarImage
                  src={user.picture || undefined}
                  alt={user.name || "User"}
                />
                <AvatarFallback className="bg-[var(--muted)] text-sm">
                  {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden" title={user.email || undefined}>
                <p className="truncate text-sm font-medium">{user.name || "User"}</p>
                <p className="truncate text-xs text-[var(--muted-foreground)]">
                  {user.email}
                </p>
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

      {/* Main column */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar — kept intentionally minimal so it works for every page.
            Page-specific headings/actions live inside each page's main
            content. */}
        <header className="flex h-14 items-center justify-between border-b border-[var(--border)] px-4 lg:px-6">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="lg:hidden flex items-center justify-center rounded-md p-2 hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setSidebarCollapsed((v) => !v)}
              className="hidden lg:flex items-center justify-center rounded-md p-1.5 hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <PanelLeft className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
            {/* Logo — only on mobile, where the sidebar's logo is hidden. */}
            <Link href="/user-dashboard" className="lg:hidden flex items-center">
              <VeroLogoFull height={18} className="text-[var(--foreground)]" />
            </Link>
          </div>
        </header>

        {/* Mobile drawer — left-side panel that mirrors the hamburger
            toggle's position and the desktop sidebar. Tap-outside-to-close
            backdrop keeps dismissal obvious without relying on the X. */}
        {mobileMenuOpen && (
          <>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 top-14 z-40 bg-black/40 backdrop-blur-[2px]"
            />
            <div
              role="dialog"
              aria-modal="true"
              className="lg:hidden fixed left-0 top-14 bottom-0 z-50 w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto"
            >
            <div className="px-4 py-4">
              <div className="flex items-center gap-3 pb-4 border-b border-[var(--border)]">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={user.picture || undefined}
                    alt={user.name || "User"}
                  />
                  <AvatarFallback className="bg-[var(--muted)] text-sm">
                    {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden" title={user.email || undefined}>
                  <p className="truncate text-sm font-medium">{user.name || "User"}</p>
                  <p className="truncate text-xs text-[var(--muted-foreground)]">
                    {user.email}
                  </p>
                </div>
              </div>

              <nav className="py-4 space-y-1">
                {mainNavItems.map((item) => {
                  const active = isActive(pathname, item.href)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors",
                        active
                          ? "bg-[var(--muted)] font-medium text-[var(--foreground)]"
                          : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="flex flex-1 items-center justify-between">
                        {item.name}
                        {item.badge && (
                          <span className="rounded-full bg-[var(--primary)]/10 px-1.5 py-0.5 text-[10px] font-medium text-[var(--primary)]">
                            {item.badge}
                          </span>
                        )}
                      </span>
                    </Link>
                  )
                })}
              </nav>

              <div className="py-4 border-t border-[var(--border)]">
                {bottomNavItems.map((item) => {
                  const active = isActive(pathname, item.href)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors",
                        active
                          ? "bg-[var(--muted)] font-medium text-[var(--foreground)]"
                          : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>

              <div className="pt-4 border-t border-[var(--border)]">
                <a
                  href="/auth/logout"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  Log out
                </a>
              </div>
            </div>
            </div>
          </>
        )}

        <main
          className={cn(
            "flex-1 overflow-x-hidden",
            // The chat page owns its own scroll containers and bleeds to the
            // edges so its conversation sidebar can hug the main nav. Every
            // other page uses the standard padded scroll container.
            pathname.startsWith("/user-dashboard/chat")
              ? "min-h-0"
              : "overflow-y-auto p-4 sm:p-6"
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
