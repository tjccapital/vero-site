"use client"

import Link from "next/link"
import { useUser } from "@auth0/nextjs-auth0/client"
import {
  CheckCircle,
  ChevronDown,
  ExternalLink,
  Info,
  Settings,
} from "lucide-react"
import { AffiliateShell } from "@/components/affiliate-shell"
import { Badge } from "@/components/ui/badge"
import { affiliateMerchants } from "@/lib/affiliate-merchants"

export default function AffiliatePaymentsPage() {
  const { user } = useUser()

  const inNetwork = affiliateMerchants.filter((m) => m.status === "in_network")
  const pending = affiliateMerchants.filter((m) => m.status === "pending")
  const lifetimeEarned = inNetwork.reduce((sum, m) => sum + m.reward, 0)
  const pendingPayout = pending.reduce((sum, m) => sum + m.reward, 0)

  const stripeBillingPortalUrl = user?.sub
    ? `https://billing.stripe.com/p/login/test_${user.sub.replace("|", "_")}`
    : "https://billing.stripe.com/p/login"

  return (
    <AffiliateShell
      pageTitle="Payments"
      currentPath="/affiliate-dashboard/payments"
      returnTo="/affiliate-dashboard/payments"
    >
      <div className="mx-auto max-w-3xl space-y-6 w-full">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Manage your payout method and review affiliate rewards.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--border)] p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-[var(--muted-foreground)]">Lifetime Earned</p>
              <p className="text-3xl font-bold mt-1">${lifetimeEarned.toLocaleString()}</p>
              <div className="flex items-center gap-2 mt-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Account verified</span>
              </div>
            </div>
            <Link
              href={stripeBillingPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--foreground)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--foreground)]/90 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Manage Payouts
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--border)] p-5">
            <p className="text-sm text-[var(--muted-foreground)]">Pending Payout</p>
            <p className="mt-1 text-2xl font-semibold">${pendingPayout.toLocaleString()}</p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              {pending.length} merchant{pending.length === 1 ? "" : "s"} awaiting confirmation
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border)] p-5">
            <p className="text-sm text-[var(--muted-foreground)]">Merchants in Network</p>
            <p className="mt-1 text-2xl font-semibold">{inNetwork.length}</p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Earning recurring rewards
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] p-5">
          <h2 className="text-base font-semibold mb-4">Account Details</h2>
          <div className="space-y-3">
            <DetailRow label="Affiliate Name" value={user?.name || "Affiliate"} />
            <DetailRow
              label="Affiliate ID"
              value={
                <code className="rounded bg-[var(--muted)] px-2 py-0.5 text-xs font-mono">
                  {user?.sub?.replace("|", "_").slice(0, 16) || "N/A"}...
                </code>
              }
            />
            <DetailRow label="Payout Account" value="••••4242" />
            <DetailRow
              label="Payout Method"
              value={<Badge variant="outline" className="text-xs">Direct Deposit (ACH)</Badge>}
            />
            <DetailRow
              label="Tax Information"
              value={
                <Link
                  href={stripeBillingPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:underline"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Update in Portal
                </Link>
              }
              noBorder
            />
          </div>
        </div>

        <details className="rounded-xl border border-[var(--border)] p-5 group">
          <summary className="flex items-center justify-between cursor-pointer list-none">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-[var(--muted-foreground)]" />
              <span className="text-sm font-medium">How affiliate rewards work</span>
            </div>
            <ChevronDown className="h-4 w-4 text-[var(--muted-foreground)] transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            Affiliates earn a one-time reward each time a merchant they sign up reaches their first
            full month of activity on the Vero network. Rewards scale with the merchant&apos;s
            transaction volume. Payouts arrive on the 1st and 15th of each month to the bank account
            configured in the Stripe portal.
          </p>
        </details>

        <div className="flex items-center justify-between rounded-xl border border-[var(--border)] p-4">
          <span className="text-sm text-[var(--muted-foreground)]">
            Need help with affiliate payouts?
          </span>
          <Link
            href="/contact"
            className="text-sm font-medium text-[var(--primary)] hover:underline"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </AffiliateShell>
  )
}

function DetailRow({
  label,
  value,
  noBorder = false,
}: {
  label: string
  value: React.ReactNode
  noBorder?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between py-2 ${
        noBorder ? "" : "border-b border-[var(--border)]"
      }`}
    >
      <span className="text-sm text-[var(--muted-foreground)]">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}
