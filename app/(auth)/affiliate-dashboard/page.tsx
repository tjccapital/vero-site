"use client"

import Link from "next/link"
import { ArrowRight, Store, CheckCircle, Clock, TrendingUp } from "lucide-react"
import { AffiliateShell } from "@/components/affiliate-shell"
import { affiliateMerchants } from "@/lib/affiliate-merchants"

export default function AffiliateDashboardPage() {
  const inNetwork = affiliateMerchants.filter((m) => m.status === "in_network")
  const pending = affiliateMerchants.filter((m) => m.status === "pending")
  const prospects = affiliateMerchants.filter((m) => m.status === "prospect")

  const earnedRewards = inNetwork.reduce((sum, m) => sum + m.reward, 0)
  const pendingRewards = pending.reduce((sum, m) => sum + m.reward, 0)
  const prospectPipeline = prospects.reduce((sum, m) => sum + m.reward, 0)

  const recent = [...inNetwork]
    .sort((a, b) => (b.signedUpAt || "").localeCompare(a.signedUpAt || ""))
    .slice(0, 4)

  return (
    <AffiliateShell
      pageTitle="Affiliate Dashboard"
      currentPath="/affiliate-dashboard"
      returnTo="/affiliate-dashboard"
    >
      <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6 w-full">
        <div>
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Track the merchants you&apos;ve brought into the Vero network and the prospects still to sign.
          </p>
        </div>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-[var(--border)] p-4 h-full">
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
              Merchants in Network
            </p>
            <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold">
              {inNetwork.length}
            </p>
            <p className="mt-1 text-xs text-green-600">+{inNetwork.length} this quarter</p>
          </div>

          <div className="rounded-lg border border-[var(--border)] p-4 h-full">
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">Pending Signups</p>
            <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold">{pending.length}</p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">Awaiting confirmation</p>
          </div>

          <Link
            href="/affiliate-dashboard/payments"
            className="rounded-lg border border-[var(--border)] p-4 hover:bg-[var(--muted)]/50 transition-colors block h-full"
          >
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">Earned Rewards</p>
            <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold">
              ${earnedRewards.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-green-600">Across {inNetwork.length} merchants</p>
          </Link>

          <div className="rounded-lg border border-[var(--border)] p-4 h-full">
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">Pipeline Value</p>
            <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold">
              ${prospectPipeline.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              From {prospects.length} prospects
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-lg border border-[var(--border)] p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold">Recently Signed</h2>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Merchants you&apos;ve recently added to the network
                </p>
              </div>
              <Link
                href="/affiliate-dashboard/merchants"
                className="hidden sm:inline-flex items-center gap-1 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-2">
              {recent.map((m) => (
                <Link
                  key={m.id}
                  href={`/affiliate-dashboard/merchants/${m.id}`}
                  className="flex items-center justify-between rounded-md border border-[var(--border)] p-3 hover:bg-[var(--muted)]/50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-[var(--muted)]">
                      <Store className="h-4 w-4 text-[var(--muted-foreground)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{m.name}</p>
                      <p className="truncate text-xs text-[var(--muted-foreground)]">
                        {m.category} · {m.city}, {m.state}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-green-600">+${m.reward}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {m.signedUpAt
                        ? new Date(m.signedUpAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })
                        : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[var(--border)] p-4 sm:p-6">
            <h2 className="text-base font-semibold mb-4">Status Breakdown</h2>
            <div className="space-y-3">
              <StatusRow
                icon={<CheckCircle className="h-4 w-4 text-green-600" />}
                label="In network"
                count={inNetwork.length}
                value={`$${earnedRewards.toLocaleString()}`}
              />
              <StatusRow
                icon={<Clock className="h-4 w-4 text-yellow-600" />}
                label="Pending"
                count={pending.length}
                value={`$${pendingRewards.toLocaleString()}`}
              />
              <StatusRow
                icon={<TrendingUp className="h-4 w-4 text-blue-600" />}
                label="Prospects"
                count={prospects.length}
                value={`$${prospectPipeline.toLocaleString()}`}
              />
            </div>
            <Link
              href="/affiliate-dashboard/merchants"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md border border-[var(--border)] px-3 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors"
            >
              Browse all merchants
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </AffiliateShell>
  )
}

function StatusRow({
  icon,
  label,
  count,
  value,
}: {
  icon: React.ReactNode
  label: string
  count: number
  value: string
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[var(--border)] last:border-b-0">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">{count}</p>
        <p className="text-xs text-[var(--muted-foreground)]">{value}</p>
      </div>
    </div>
  )
}
