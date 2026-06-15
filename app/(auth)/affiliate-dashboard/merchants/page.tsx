"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Cable,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  HandCoins,
  Loader2,
  MessageCircle,
  Search,
  Sparkles,
  Store,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { AffiliateShell } from "@/components/affiliate-shell"
import {
  listMerchants,
  type AffiliateMerchant,
  type MerchantStatus,
  type MerchantStatusCounts,
} from "@/lib/affiliate-merchants"
import { Badge } from "@/components/ui/badge"

type TabKey = "all" | "in_network" | "pending" | "prospect"

const TAB_LABELS: Record<TabKey, string> = {
  all: "All",
  in_network: "In Network",
  pending: "Pending",
  prospect: "Prospects",
}

const PAGE_SIZE = 50

const EMPTY_COUNTS: MerchantStatusCounts = {
  all: 0,
  in_network: 0,
  pending: 0,
  prospect: 0,
}

export default function AffiliateMerchantsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")

  const [items, setItems] = useState<AffiliateMerchant[]>([])
  const [counts, setCounts] = useState<MerchantStatusCounts>(EMPTY_COUNTS)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounce the search input so each keystroke doesn't hit the API.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300)
    return () => clearTimeout(t)
  }, [query])

  // Guards against out-of-order responses when filters change quickly.
  const reqRef = useRef(0)

  const load = useCallback(
    async (offset: number) => {
      const reqId = ++reqRef.current
      if (offset === 0) setLoading(true)
      else setLoadingMore(true)
      setError(null)
      try {
        const page = await listMerchants({
          status: activeTab,
          q: debouncedQuery,
          limit: PAGE_SIZE,
          offset,
        })
        if (reqId !== reqRef.current) return // stale response
        setCounts(page.counts)
        setTotal(page.total)
        setItems((prev) => (offset === 0 ? page.items : [...prev, ...page.items]))
      } catch (e) {
        if (reqId !== reqRef.current) return
        setError(e instanceof Error ? e.message : "Failed to load merchants")
      } finally {
        if (reqId === reqRef.current) {
          setLoading(false)
          setLoadingMore(false)
        }
      }
    },
    [activeTab, debouncedQuery]
  )

  // Refetch from the top whenever the tab or search changes.
  useEffect(() => {
    load(0)
  }, [load])

  const canLoadMore = items.length < total

  return (
    <AffiliateShell
      pageTitle="Merchants"
      currentPath="/affiliate-dashboard/merchants"
      returnTo="/affiliate-dashboard/merchants"
    >
      <div className="mx-auto max-w-6xl space-y-4 sm:space-y-6 w-full">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Merchants</h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Browse merchants in the Vero network and the ones still to recruit.
            </p>
          </div>
          <div className="relative sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, category, city..."
              className="w-full rounded-md border border-[var(--border)] bg-transparent py-2 pl-9 pr-3 text-sm focus:border-[var(--foreground)] focus:outline-none"
            />
          </div>
        </div>

        <GettingStartedCard />

        <div className="rounded-lg border border-[var(--border)]">
          <div className="flex overflow-x-auto border-b border-[var(--border)] px-2 sm:px-4">
            {(Object.keys(TAB_LABELS) as TabKey[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-3 sm:px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap",
                  activeTab === tab
                    ? "border-[var(--foreground)] text-[var(--foreground)]"
                    : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                )}
              >
                {TAB_LABELS[tab]}
                <span className="rounded-full bg-[var(--muted)] px-2 py-0.5 text-xs">
                  {tab === "all" ? counts.all : counts[tab]}
                </span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-[var(--muted-foreground)]">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading merchants…
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <Store className="h-8 w-8 text-[var(--muted-foreground)]" />
              <p className="text-sm font-medium">Couldn&apos;t load merchants</p>
              <p className="text-xs text-[var(--muted-foreground)]">{error}</p>
              <button
                onClick={() => load(0)}
                className="mt-2 rounded-md border border-[var(--border)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--muted)]"
              >
                Retry
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <Store className="h-8 w-8 text-[var(--muted-foreground)]" />
              <p className="text-sm font-medium">No merchants match your filters</p>
              <p className="text-xs text-[var(--muted-foreground)]">
                Try clearing the search or switching tabs.
              </p>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-[var(--border)]">
                {items.map((m) => (
                  <li key={m.id}>
                    <Link
                      href={`/affiliate-dashboard/merchants/${m.id}`}
                      className="flex items-center gap-4 px-4 py-4 hover:bg-[var(--muted)]/50 transition-colors"
                    >
                      <MerchantLogo merchant={m} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-medium">{m.name}</p>
                          <StatusBadge status={m.status} />
                        </div>
                        <p className="mt-0.5 truncate text-xs text-[var(--muted-foreground)]">
                          {m.categoryLabel} · {m.posSystem} · {m.city}, {m.state}
                        </p>
                      </div>
                      <div className="hidden sm:block text-right">
                        <p className="text-xs text-[var(--muted-foreground)]">Est. annual value</p>
                        <p className="text-sm font-medium">${m.estimatedValue.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[var(--muted-foreground)]">
                          {m.status === "in_network" ? "Earned" : "Reward"}
                        </p>
                        <p
                          className={cn(
                            "text-sm font-medium",
                            m.status === "in_network" ? "text-green-600" : ""
                          )}
                        >
                          ${m.reward.toLocaleString()}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 flex-shrink-0 text-[var(--muted-foreground)]" />
                    </Link>
                  </li>
                ))}
              </ul>
              {canLoadMore && (
                <div className="flex justify-center border-t border-[var(--border)] p-4">
                  <button
                    onClick={() => load(items.length)}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] disabled:opacity-60"
                  >
                    {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                    Load more ({items.length} of {total})
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AffiliateShell>
  )
}

function MerchantLogo({ merchant }: { merchant: AffiliateMerchant }) {
  if (merchant.logoUrl) {
    return (
      <Image
        src={merchant.logoUrl}
        alt=""
        width={40}
        height={40}
        unoptimized
        className="h-10 w-10 flex-shrink-0 rounded-md object-cover bg-[var(--muted)]"
      />
    )
  }
  return (
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-[var(--muted)]">
      <Store className="h-5 w-5 text-[var(--muted-foreground)]" />
    </div>
  )
}

function GettingStartedCard() {
  const [open, setOpen] = useState(true)
  return (
    <div className="rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--primary)]/5 to-transparent">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 sm:px-5 text-left"
        aria-expanded={open}
      >
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-[var(--primary)]/10">
            <Sparkles className="h-4 w-4 text-[var(--primary)]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">How to become a successful affiliate</p>
            <p className="text-xs text-[var(--muted-foreground)]">
              Vero is on a mission to make digital receipts the default — here&apos;s how you help.
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 flex-shrink-0 text-[var(--muted-foreground)] transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="px-4 pb-5 sm:px-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <Step
              number={1}
              icon={<MessageCircle className="h-4 w-4" />}
              title="Talk to a merchant"
              body="Start the conversation. Share why digital receipts beat paper — searchable, never lost, and they land straight in the customer's banking app."
            />
            <Step
              number={2}
              icon={<Cable className="h-4 w-4" />}
              title="Connect their POS"
              body="Once they're in, Vero plugs into their point-of-sale to capture transactions, organize them, and share them back with the customer automatically."
            />
            <Step
              number={3}
              icon={<HandCoins className="h-4 w-4" />}
              title="Both sides earn"
              body="The merchant gets paid for every receipt sent through Vero, and you earn a finder's fee for every merchant you bring on."
            />
          </div>
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">
            Ready to start? Begin with the merchants you frequent the most — search the list below
            to find them.
          </p>
        </div>
      )}
    </div>
  )
}

function Step({
  number,
  icon,
  title,
  body,
}: {
  number: number
  icon: React.ReactNode
  title: string
  body: string
}) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-4">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--muted)] text-xs font-semibold">
          {number}
        </span>
        <span className="text-[var(--muted-foreground)]">{icon}</span>
      </div>
      <p className="mt-3 text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-[var(--muted-foreground)]">{body}</p>
    </div>
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
