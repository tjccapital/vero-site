"use client"

import { use, useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Mail,
  Phone,
  Receipt,
  Store,
  TrendingUp,
  Sparkles,
} from "lucide-react"
import { AffiliateShell } from "@/components/affiliate-shell"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  getMerchant,
  type AffiliateMerchant,
  type MerchantStatus,
} from "@/lib/affiliate-merchants"

type PageProps = {
  params: Promise<{ id: string }>
}

export default function MerchantDetailsPage({ params }: PageProps) {
  const { id } = use(params)
  const [merchant, setMerchant] = useState<AffiliateMerchant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reqRef = useRef(0)
  const load = useCallback(async () => {
    const reqId = ++reqRef.current
    setLoading(true)
    setError(null)
    try {
      const m = await getMerchant(id)
      if (reqId !== reqRef.current) return
      setMerchant(m)
    } catch (e) {
      if (reqId !== reqRef.current) return
      setError(e instanceof Error ? e.message : "Failed to load merchant")
    } finally {
      if (reqId === reqRef.current) setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <DetailShell merchantId={id}>
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-[var(--muted-foreground)]">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading merchant…
        </div>
      </DetailShell>
    )
  }

  if (error || !merchant) {
    return (
      <DetailShell merchantId={id}>
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <Store className="h-8 w-8 text-[var(--muted-foreground)]" />
          <p className="text-sm font-medium">Merchant not found</p>
          <p className="text-xs text-[var(--muted-foreground)]">{error}</p>
          <Link
            href="/affiliate-dashboard/merchants"
            className="mt-2 rounded-md border border-[var(--border)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--muted)]"
          >
            Back to merchants
          </Link>
        </div>
      </DetailShell>
    )
  }

  return <MerchantDetails initialMerchant={merchant} />
}

function DetailShell({
  merchantId,
  children,
}: {
  merchantId: string
  children: React.ReactNode
}) {
  return (
    <AffiliateShell
      pageTitle="Merchant Details"
      currentPath="/affiliate-dashboard/merchants"
      returnTo={`/affiliate-dashboard/merchants/${merchantId}`}
    >
      <div className="mx-auto max-w-4xl space-y-6 w-full">
        <Link
          href="/affiliate-dashboard/merchants"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to merchants
        </Link>
        {children}
      </div>
    </AffiliateShell>
  )
}

function MerchantDetails({ initialMerchant }: { initialMerchant: AffiliateMerchant }) {
  const [merchant, setMerchant] = useState(initialMerchant)
  const [code, setCode] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [justConfirmed, setJustConfirmed] = useState(false)

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const trimmed = code.trim()
    if (trimmed.length < 4) {
      setError("Enter the confirmation code shared with the merchant.")
      return
    }
    setSubmitting(true)
    // Simulate verification — the real "send signup link" action lands in the
    // attribution slice (PRD Item 2).
    setTimeout(() => {
      setMerchant((prev) => ({
        ...prev,
        status: "in_network",
        signedUpAt: new Date().toISOString().slice(0, 10),
      }))
      setSubmitting(false)
      setJustConfirmed(true)
      setCode("")
    }, 600)
  }

  return (
    <AffiliateShell
      pageTitle="Merchant Details"
      currentPath="/affiliate-dashboard/merchants"
      returnTo={`/affiliate-dashboard/merchants/${merchant.id}`}
    >
      <div className="mx-auto max-w-4xl space-y-6 w-full">
        <Link
          href="/affiliate-dashboard/merchants"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to merchants
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            {merchant.logoUrl ? (
              <Image
                src={merchant.logoUrl}
                alt=""
                width={56}
                height={56}
                unoptimized
                className="h-14 w-14 flex-shrink-0 rounded-xl object-cover bg-[var(--muted)]"
              />
            ) : (
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--muted)]">
                <Store className="h-7 w-7 text-[var(--muted-foreground)]" />
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold">{merchant.name}</h1>
                <StatusBadge status={merchant.status} />
              </div>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {merchant.categoryLabel} · {merchant.posSystem}
              </p>
            </div>
          </div>
        </div>

        {justConfirmed && (
          <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
            <Sparkles className="h-5 w-5 flex-shrink-0 text-green-600" />
            <div className="text-sm">
              <p className="font-medium text-green-800">Signup confirmed</p>
              <p className="text-green-700">
                {merchant.name} is now in the Vero merchant network. ${merchant.reward.toLocaleString()}{" "}
                has been added to your pending payout.
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-[var(--border)] p-4">
            <p className="text-xs text-[var(--muted-foreground)]">Estimated annual value</p>
            <p className="mt-1 text-xl font-semibold">
              ${merchant.estimatedValue.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Based on {merchant.monthlyTransactions.toLocaleString()} monthly transactions
            </p>
          </div>
          <div className="rounded-lg border border-[var(--border)] p-4">
            <p className="text-xs text-[var(--muted-foreground)]">
              {merchant.status === "in_network" ? "Reward earned" : "Reward on signup"}
            </p>
            <p
              className={cn(
                "mt-1 text-xl font-semibold",
                merchant.status === "in_network" && "text-green-600"
              )}
            >
              ${merchant.reward.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">Paid on first full month</p>
          </div>
          <div className="rounded-lg border border-[var(--border)] p-4 col-span-2 lg:col-span-1">
            <p className="text-xs text-[var(--muted-foreground)]">Monthly transactions</p>
            <p className="mt-1 text-xl font-semibold">
              {merchant.monthlyTransactions.toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Approximate volume
            </p>
          </div>
        </div>

        <ConfirmationCard
          merchant={merchant}
          code={code}
          setCode={setCode}
          onSubmit={handleConfirm}
          submitting={submitting}
          error={error}
        />

        <div className="rounded-xl border border-[var(--border)] p-5">
          <h2 className="text-base font-semibold mb-4">Merchant Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <DetailRow
              icon={<Store className="h-4 w-4" />}
              label="Business name"
              value={merchant.name}
            />
            <DetailRow
              icon={<Receipt className="h-4 w-4" />}
              label="Point of sale"
              value={merchant.posSystem}
            />
            <DetailRow
              icon={<MapPin className="h-4 w-4" />}
              label="Address"
              value={`${merchant.address}, ${merchant.city}, ${merchant.state} ${merchant.zip}`}
            />
            <DetailRow
              icon={<TrendingUp className="h-4 w-4" />}
              label="Category"
              value={merchant.categoryLabel}
            />
            {merchant.contactEmail && (
              <DetailRow
                icon={<Mail className="h-4 w-4" />}
                label="Contact email"
                value={merchant.contactEmail}
              />
            )}
            {merchant.contactPhone && (
              <DetailRow
                icon={<Phone className="h-4 w-4" />}
                label="Contact phone"
                value={merchant.contactPhone}
              />
            )}
            {merchant.signedUpAt && (
              <DetailRow
                icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
                label="Signed up"
                value={new Date(merchant.signedUpAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              />
            )}
          </div>
          {merchant.notes && (
            <div className="mt-5 rounded-md bg-[var(--muted)]/60 p-3">
              <p className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
                Notes
              </p>
              <p className="mt-1 text-sm">{merchant.notes}</p>
            </div>
          )}
        </div>
      </div>
    </AffiliateShell>
  )
}

function ConfirmationCard({
  merchant,
  code,
  setCode,
  onSubmit,
  submitting,
  error,
}: {
  merchant: AffiliateMerchant
  code: string
  setCode: (v: string) => void
  onSubmit: (e: React.FormEvent) => void
  submitting: boolean
  error: string | null
}) {
  if (merchant.status === "in_network") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600" />
          <div className="text-sm">
            <p className="font-medium text-green-800">Signup confirmed</p>
            <p className="text-green-700">
              {merchant.name} joined the Vero merchant network
              {merchant.signedUpAt
                ? ` on ${new Date(merchant.signedUpAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}`
                : ""}
              . Track your payout on the{" "}
              <Link
                href="/affiliate-dashboard/payments"
                className="font-medium underline underline-offset-2"
              >
                Payments
              </Link>{" "}
              page.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-[var(--border)] p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-[var(--muted)]">
          <Check className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-base font-semibold">Confirm signup</h2>
          <p className="text-sm text-[var(--muted-foreground)]">
            Enter the confirmation code the merchant received during onboarding to credit this
            signup to your account.
          </p>
        </div>
      </div>

      <label htmlFor="confirmation-code" className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
        Confirmation code
      </label>
      <div className="mt-1 flex flex-col gap-2 sm:flex-row">
        <input
          id="confirmation-code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. VERO-1A2B3C"
          autoComplete="off"
          spellCheck={false}
          className="flex-1 rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm font-mono tracking-wider focus:border-[var(--foreground)] focus:outline-none"
        />
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--foreground)]/90 transition-colors disabled:opacity-60"
        >
          {submitting ? "Confirming..." : "Confirm signup"}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {merchant.status === "pending" && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-yellow-700">
          <Clock className="h-3.5 w-3.5" />
          Onboarding is already in progress — confirming the code will finalize this signup.
        </p>
      )}
    </form>
  )
}

function StatusBadge({ status }: { status: MerchantStatus }) {
  if (status === "in_network") {
    return (
      <Badge variant="outline" className="gap-1 border-green-200 bg-green-50 text-green-700">
        <Check className="h-3 w-3" />
        In network
      </Badge>
    )
  }
  if (status === "pending") {
    return (
      <Badge variant="outline" className="gap-1 border-yellow-200 bg-yellow-50 text-yellow-700">
        <Clock className="h-3 w-3" />
        Pending
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="gap-1 border-blue-200 bg-blue-50 text-blue-700">
      <TrendingUp className="h-3 w-3" />
      Prospect
    </Badge>
  )
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-[var(--muted-foreground)]">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-[var(--muted-foreground)]">{label}</p>
        <p className="text-sm font-medium break-words">{value}</p>
      </div>
    </div>
  )
}
