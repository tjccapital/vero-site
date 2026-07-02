"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { MerchantStatusBadge } from "@/components/merchant-status-badge"
import { fetchTransactionCatalogMatch, type CatalogMatch } from "@/lib/transactions"

// "beauty_and_barber_shops" -> "Beauty & Barber Shops"
function humanizeCategory(slug: string): string {
  if (!slug) return ""
  return slug
    .split("_")
    .map((w) => (w === "and" ? "&" : w ? w[0].toUpperCase() + w.slice(1) : ""))
    .filter(Boolean)
    .join(" ")
}

// Shows the business in the Vero merchant network that this transaction maps to.
// Styled as a filled group of clickable tiles so it reads distinctly from the plain
// bordered cards above. Hidden when the transaction isn't mapped to one.
export function CatalogMappingCard({ transactionId }: { transactionId: string }) {
  const [data, setData] = useState<CatalogMatch | null>(null)

  useEffect(() => {
    let active = true
    fetchTransactionCatalogMatch(transactionId)
      .then((d) => {
        if (active) setData(d)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [transactionId])

  if (!data || !data.merchantId) return null

  // Show the outlet(s) this transaction resolved to (userMatches). If Stage 2 hasn't
  // materialized a match yet (eventual consistency) but the brand has a single linked
  // outlet, show that. With multiple unresolved outlets, show nothing rather than
  // listing every outlet of the brand.
  const resolvedIds = new Set(
    data.userMatches.map((m) => m.catalogId).filter((id): id is string => !!id)
  )
  let shown = data.candidates.filter((c) => resolvedIds.has(c.id))
  if (shown.length === 0 && data.candidates.length === 1) {
    shown = data.candidates
  }
  if (shown.length === 0) return null

  return (
    <div className="rounded-xl bg-[var(--muted)] p-3 sm:p-4">
      <p className="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
        Merchant
      </p>
      <div className="space-y-2">
        {shown.map((c) => {
          const sub = [humanizeCategory(c.category), [c.city, c.state].filter(Boolean).join(", ")]
            .filter(Boolean)
            .join(" · ")
          return (
            <Link
              key={c.id}
              href={`/user-dashboard/affiliate/merchants/${c.id}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3 transition-colors hover:border-[var(--primary)]/40 hover:shadow-sm"
            >
              <div className="min-w-0">
                <div className="truncate font-medium">{c.name}</div>
                {sub && (
                  <div className="mt-0.5 truncate text-xs text-[var(--muted-foreground)]">
                    {sub}
                  </div>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <MerchantStatusBadge status={c.status} />
                <ChevronRight className="h-4 w-4 text-[var(--muted-foreground)]" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
