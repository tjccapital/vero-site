"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { OFFER_PLACEHOLDER_IMAGE, offerTagLabel, type Offer } from "@/lib/offers"

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
  // Fall back to the shared placeholder when the offer has no image or the
  // image 404s (e.g. a merchant photo that hasn't been uploaded yet).
  const [imageFailed, setImageFailed] = useState(false)
  const imageSrc =
    imageFailed || !offer.image ? OFFER_PLACEHOLDER_IMAGE : offer.image

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-[var(--border)] transition-colors hover:border-[var(--foreground)]/20",
        className
      )}
    >
      <div className="relative aspect-[3/2] bg-[var(--muted)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={offer.merchant}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setImageFailed(true)}
        />
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--foreground)] shadow-sm backdrop-blur-sm">
          {offerTagLabel(offer.tag)}
        </span>
        <button
          type="button"
          onClick={() => onToggleSave(offer.id)}
          aria-pressed={saved}
          aria-label={saved ? "Remove saved offer" : "Save offer"}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors",
              saved
                ? "fill-green-600 text-green-600"
                : "text-[var(--muted-foreground)]"
            )}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <div className="flex items-center gap-2">
          <div
            className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
            style={{ backgroundColor: offer.avatarColor }}
          >
            {offer.initial}
          </div>
          <p className="truncate text-xs text-[var(--muted-foreground)]">
            {offer.merchant} · {offer.location}
          </p>
        </div>

        <p className="mt-2 text-sm">
          <OfferTitle title={offer.title} highlight={offer.highlight} />
        </p>

        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          {offer.expiresLabel ?? "No expiry"}
        </p>
      </div>
    </div>
  )
}
