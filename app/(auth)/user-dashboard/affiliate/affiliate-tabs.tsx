"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CreditCard, LayoutDashboard, Store } from "lucide-react"
import { cn } from "@/lib/utils"

// Sub-navigation for the Affiliate section. The Affiliate area lives as a tab
// inside the user dashboard, so it uses an in-page tab bar (rather than the
// main sidebar) to switch between its own pages.
const affiliateTabs = [
  { name: "Overview", href: "/user-dashboard/affiliate", icon: LayoutDashboard },
  { name: "Merchants", href: "/user-dashboard/affiliate/merchants", icon: Store },
  { name: "Payouts", href: "/user-dashboard/affiliate/payments", icon: CreditCard },
]

function isActive(pathname: string, href: string): boolean {
  if (href === "/user-dashboard/affiliate") return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function AffiliateTabs() {
  const pathname = usePathname() ?? "/user-dashboard/affiliate"
  return (
    <div className="border-b border-[var(--border)]">
      <nav className="-mb-px flex gap-1 overflow-x-auto">
        {affiliateTabs.map((tab) => {
          const active = isActive(pathname, tab.href)
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "border-[var(--foreground)] text-[var(--foreground)]"
                  : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

// Shared header for the top-level Affiliate pages: a title plus the tab bar.
// Drill-down pages (e.g. a single merchant) render their own back link instead.
export function AffiliateHeader() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Affiliate</h1>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Grow the Vero network, track the merchants you&apos;ve signed, and manage your payouts.
        </p>
      </div>
      <AffiliateTabs />
    </div>
  )
}
