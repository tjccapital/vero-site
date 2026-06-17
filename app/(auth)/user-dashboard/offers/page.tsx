"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2, Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import { OfferCard } from "@/components/offer-card"
import { useSavedOffers } from "@/lib/use-saved-offers"
import { fetchOffers, type Offer, type OfferTag } from "@/lib/offers"

// Filter tabs map to the offer `tag` field, plus an "all" pass-through and a
// "saved" view backed by the persisted saved-offers set.
type FilterId = "all" | "saved" | OfferTag

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "you_shop_here", label: "You shop here" },
  { id: "near_you", label: "Near you" },
  { id: "new_merchant", label: "New on Vero" },
  { id: "saved", label: "Saved" },
]

export default function ConsumerOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterId>("all")
  const { saved, toggleSave } = useSavedOffers()

  useEffect(() => {
    let cancelled = false
    fetchOffers()
      .then((res) => {
        if (cancelled) return
        setOffers(res)
      })
      .catch((err) => {
        if (cancelled) return
        console.error("[Offers] Failed to load:", err)
        setError("Couldn't load offers. Try refreshing.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const visibleOffers = useMemo(() => {
    if (filter === "all") return offers
    if (filter === "saved") return offers.filter((o) => saved.has(o.id))
    return offers.filter((o) => o.tag === filter)
  }, [offers, filter, saved])

  const potentialSavings = useMemo(
    () => offers.reduce((sum, o) => sum + o.estimatedSavings, 0),
    [offers]
  )

  return (
    <div className="mx-auto max-w-5xl space-y-6 w-full">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">Offers</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Deals from places you already shop — save on what you already buy
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
        <div className="rounded-lg border border-[var(--border)] p-4">
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">Offers available</p>
          <p className="mt-1 text-xl sm:text-2xl font-semibold">{offers.length}</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] p-4">
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">Saved</p>
          <p className="mt-1 text-xl sm:text-2xl font-semibold">{saved.size}</p>
        </div>
        <div className="col-span-2 sm:col-span-1 rounded-lg border border-[var(--border)] p-4">
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">Potential savings</p>
          <p className="mt-1 text-xl sm:text-2xl font-semibold text-green-600">
            ${potentialSavings.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1">
        {FILTERS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap",
              filter === id
                ? "bg-[var(--foreground)] text-white"
                : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Offers grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-5 w-5 animate-spin text-[var(--muted-foreground)]" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-[var(--border)] px-4 py-12 text-center text-sm text-red-600">
          {error}
        </div>
      ) : visibleOffers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border)] px-4 py-16 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--muted)]">
            <Tag className="h-5 w-5 text-[var(--muted-foreground)]" />
          </div>
          <p className="mt-3 text-sm font-medium">
            {filter === "saved" ? "No saved offers yet" : "No offers here yet"}
          </p>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            {filter === "saved"
              ? "Save an offer to find it here later."
              : "Check back soon — we add new offers as merchants join."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {visibleOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              saved={saved.has(offer.id)}
              onToggleSave={toggleSave}
            />
          ))}
        </div>
      )}
    </div>
  )
}
