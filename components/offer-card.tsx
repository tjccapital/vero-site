"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { offerTagLabel, type Offer } from "@/lib/offers"

// Renders the savings headline with its `highlight` substring in the accent
// color. Falls back to the plain title if the highlight isn't found so a
// mismatched offer never drops text.
function OfferTitle({ title, highlight }: { title: string; highlight: string }) {
  const idx = highlight ? title.indexOf(highlight) : -1
  if (idx === -1) {
    return <span className="font-semibold">{title}</span>
  }
  const before = title.slice(0, idx)
  const after = title.slice(idx + highlight.length)
  return (
    <span className="font-semibold">
      {before}
      <span className="text-green-600">{highlight}</span>
      {after}
    </span>
  )
}

export type OfferCardProps = {
  offer: Offer
  saved: boolean
  onToggleSave: (id: string) => void
  className?: string
}

export function OfferCard({ offer, saved, onToggleSave, className }: OfferCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-[var(--border)] p-4 transition-colors hover:border-[var(--foreground)]/20",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: offer.avatarColor }}
          >
            {offer.initial}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-sm">{offer.merchant}</p>
            <p className="truncate text-xs text-[var(--muted-foreground)]">
              {offer.category} · {offer.location}
            </p>
          </div>
        </div>
        <span className="flex-shrink-0 rounded-full bg-[var(--muted)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          {offerTagLabel(offer.tag)}
        </span>
      </div>

      <p className="mt-4 text-base">
        <OfferTitle title={offer.title} highlight={offer.highlight} />
      </p>
      <p className="mt-1 text-sm text-[var(--muted-foreground)]">{offer.description}</p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onToggleSave(offer.id)}
          aria-pressed={saved}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            saved
              ? "bg-green-600 text-white hover:bg-green-600/90"
              : "bg-[var(--foreground)] text-white hover:bg-[var(--foreground)]/90"
          )}
        >
          {saved && <Check className="h-3.5 w-3.5" />}
          {saved ? "Saved" : "Save offer"}
        </button>
        <span className="text-xs text-[var(--muted-foreground)]">
          {offer.expiresLabel ?? "No expiry"}
        </span>
      </div>
    </div>
  )
}
