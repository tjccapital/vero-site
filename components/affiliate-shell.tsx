"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@auth0/nextjs-auth0/client"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Store,
  CreditCard,
  Settings,
  CircleHelp,
  Search,
  Database,
  FileBarChart,
  Code,
  MoreHorizontal,
  MoreVertical,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  Menu,
  X,
  type LucideIcon,
  ArrowLeft,
} from "lucide-react"
import { VeroLogo, VeroLogoFull } from "@/components/ui/vero-logo"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const DOCS_URL = "https://docs.veroreceipts.com/pos-plugins/overview"

type NavItem = {
  name: string
  href: string
  icon: LucideIcon
  external?: boolean
}

const mainNavItems: NavItem[] = [
  { name: "Overview", href: "/affiliate-dashboard", icon: LayoutDashboard },
  { name: "Merchants", href: "/affiliate-dashboard/merchants", icon: Store },
  { name: "Payments", href: "/affiliate-dashboard/payments", icon: CreditCard },
]

const documentNavItems: NavItem[] = [
  { name: "Affiliate Guide", href: DOCS_URL, icon: Database, external: true },
  { name: "Reports", href: DOCS_URL, icon: FileBarChart, external: true },
  { name: "API Docs", href: DOCS_URL, icon: Code, external: true },
  { name: "More", href: DOCS_URL, icon: MoreHorizontal, external: true },
]

const bottomNavItems: NavItem[] = [
  { name: "Settings", href: "/affiliate-dashboard/payments", icon: Settings },
  { name: "Get Help", href: "/contact", icon: CircleHelp },
  { name: "Search", href: DOCS_URL, icon: Search, external: true },
  { name: "Back to Site", href: "/", icon: ArrowLeft },
]

function isActive(itemHref: string, currentPath: string) {
  if (itemHref === "/affiliate-dashboard") return currentPath === itemHref
  return currentPath === itemHref || currentPath.startsWith(itemHref + "/")
}

type AffiliateShellProps = {
  pageTitle: string
  currentPath: string
  /** Path Auth0 should return to after login. */
  returnTo: string
  children: React.ReactNode
}

export function AffiliateShell({
  pageTitle,
  currentPath,
  returnTo,
  children,
}: AffiliateShellProps) {
  const { user, isLoading } = useUser()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(`/auth/login?returnTo=${encodeURIComponent(returnTo)}`)
    }
  }, [user, isLoading, router, returnTo])

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
      <aside
        className={cn(
          "hidden flex-col border-r border-[var(--border)] lg:flex transition-all duration-300 h-full",
          sidebarCollapsed ? "w-[60px]" : "w-[240px]"
        )}
      >
        <div className="flex h-14 items-center px-4">
          <Link href="/affiliate-dashboard">
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
            const active = isActive(item.href, currentPath)
            return (
              <Link
                key={item.name}
                href={item.href}
                title={sidebarCollapsed ? item.name : undefined}
                {...(item.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
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

          {!sidebarCollapsed && (
            <div className="pt-4">
              <p className="px-3 py-2 text-xs font-medium text-[var(--muted-foreground)]">
                Documents
              </p>
              {documentNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  {...(item.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
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
                  {...(item.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="flex items-center justify-center rounded-md px-2 py-2 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  <item.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          )}
        </nav>

        <div className="border-t border-[var(--border)] px-3 py-2">
          {bottomNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              title={sidebarCollapsed ? item.name : undefined}
              {...(item.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
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
              <div
                className="flex-1 overflow-hidden"
                title={user.email || undefined}
              >
                <p className="truncate text-sm font-medium">
                  {user.name || "User"}
                </p>
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

      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-14 items-center justify-between border-b border-[var(--border)] px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center rounded-md p-1.5 hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex items-center justify-center rounded-md p-1.5 hover:bg-[var(--muted)] text-[var(--muted-foreground)]"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <PanelLeft className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
            <span className="text-sm font-medium">{pageTitle}</span>
          </div>
        </header>

        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-14 z-50 bg-white overflow-y-auto">
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
                <div
                  className="flex-1 overflow-hidden"
                  title={user.email || undefined}
                >
                  <p className="truncate text-sm font-medium">
                    {user.name || "User"}
                  </p>
                  <p className="truncate text-xs text-[var(--muted-foreground)]">
                    {user.email}
                  </p>
                </div>
              </div>

              <nav className="py-4 space-y-1">
                {mainNavItems.map((item) => {
                  const active = isActive(item.href, currentPath)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => !item.external && setMobileMenuOpen(false)}
                      {...(item.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
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
              </nav>

              <div className="py-4 border-t border-[var(--border)]">
                <p className="px-3 py-2 text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
                  Documents
                </p>
                {documentNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => !item.external && setMobileMenuOpen(false)}
                    {...(item.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="py-4 border-t border-[var(--border)]">
                {bottomNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => !item.external && setMobileMenuOpen(false)}
                    {...(item.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              </div>

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

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
