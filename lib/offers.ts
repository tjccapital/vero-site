// Offers data model + (currently stubbed) fetchers for the consumer app.
//
// Offers are merchant-funded deals surfaced to a user. Eventually these will
// be created by merchants and served per-user by the Vero backend, ranked by
// the shopper's location, spending history, and the merchant network — so the
// shape here mirrors what we expect that API to return. For now `fetchOffers`
// resolves a static set of sample offers so the UI can be built and reviewed.

export type OfferTag = "you_shop_here" | "near_you" | "trending" | "new_merchant"

export type Offer = {
  id: string
  /** Merchant display name, e.g. "The Charlevoix". */
  merchant: string
  /** Single-letter avatar fallback + a brand-ish background color. */
  initial: string
  avatarColor: string
  /** Humanized business type, e.g. "Bar", "Café". */
  category: string
  /** Where the merchant is, or distance for nearby ones ("0.3 mi away"). */
  location: string
  /** Drives the corner badge shown on the card. */
  tag: OfferTag
  /** The deal headline, e.g. "10% off your next visit". */
  title: string
  /**
   * A substring of `title` to render in the accent color. Lets the card
   * emphasize the savings ("10% off") or the hook ("any entrée") without
   * hard-coding markup per offer.
   */
  highlight: string
  /**
   * Path to the offer's image under /public. Optional — the card falls back to
   * OFFER_PLACEHOLDER_IMAGE when it's absent or fails to load. Eventually these
   * will be merchant-supplied product/deal photos.
   */
  image?: string
  /** Longer terms shown on the dedicated offers page. */
  terms: string
  /** Human label for expiry, or null when the offer doesn't expire. */
  expiresLabel: string | null
  /** Estimated savings if redeemed, in dollars. */
  estimatedSavings: number
}

const OFFER_TAG_LABELS: Record<OfferTag, string> = {
  you_shop_here: "You shop here",
  near_you: "Near you",
  trending: "Trending",
  new_merchant: "New on Vero",
}

export function offerTagLabel(tag: OfferTag): string {
  return OFFER_TAG_LABELS[tag]
}

/** Fallback image shown when an offer has no image (or it fails to load). */
export const OFFER_PLACEHOLDER_IMAGE = "/placeholder-563x375.jpg"

// Sample offers. Ordered roughly the way we'd rank them for a shopper: the
// places they already spend at first, then nearby and new merchants. The first
// three carry real merchant imagery; the rest fall back to the placeholder.
const SAMPLE_OFFERS: Offer[] = [
  {
    id: "american-tall-flannel",
    merchant: "American Tall",
    initial: "A",
    avatarColor: "#1e3a8a",
    category: "Apparel",
    location: "East Lansing",
    tag: "you_shop_here",
    title: "$20 off flannel shirts",
    highlight: "$20 off",
    image: "/flannel-offer.jpg",
    terms:
      "Take $20 off any flannel shirt. Valid on a single item. Pay with a linked card to redeem automatically.",
    expiresLabel: "Ends Jun 30",
    estimatedSavings: 20,
  },
  {
    id: "kroger-free-eggs",
    merchant: "Kroger",
    initial: "K",
    avatarColor: "#1e40af",
    category: "Groceries",
    location: "East Lansing",
    tag: "you_shop_here",
    title: "Free dozen eggs with $35+",
    highlight: "Free dozen eggs",
    image: "/eggs-offer.jpg",
    terms:
      "Get one free dozen Grade A large eggs with any grocery purchase of $35 or more. Pay with a linked card to qualify.",
    expiresLabel: "Ends Jul 7",
    estimatedSavings: 4,
  },
  {
    id: "grill-house-sandwich-bogo",
    merchant: "The Grill House",
    initial: "G",
    avatarColor: "#92400e",
    category: "Restaurant",
    location: "0.3 mi away",
    tag: "near_you",
    title: "Buy one sandwich, get one free",
    highlight: "get one free",
    image: "/sandwitch-offfer.jpg",
    terms:
      "Buy any sandwich and get a second of equal or lesser value free. Dine-in or takeout. Pay with a linked card to redeem.",
    expiresLabel: "Ends Jul 15",
    estimatedSavings: 12,
  },
  {
    id: "trader-joes-cashback",
    merchant: "Trader Joe's",
    initial: "TJ",
    avatarColor: "#dc2626",
    category: "Groceries",
    location: "East Lansing",
    tag: "you_shop_here",
    title: "5% back on groceries this month",
    highlight: "5% back",
    terms:
      "Earn 5% back as Vero credit on all in-store grocery purchases through the end of the month. Pay with a linked card to qualify.",
    expiresLabel: "Ends Jun 30",
    estimatedSavings: 18,
  },
  {
    id: "grand-river-coffee-2off",
    merchant: "Grand River Coffee",
    initial: "G",
    avatarColor: "#1e3a8a",
    category: "Café",
    location: "0.3 mi away",
    tag: "new_merchant",
    title: "$2 off your first order",
    highlight: "$2 off",
    terms:
      "Valid on your first order only. Minimum purchase of $5. Pay with a linked card to redeem automatically.",
    expiresLabel: null,
    estimatedSavings: 2,
  },
  {
    id: "campus-cycles-tuneup",
    merchant: "Campus Cycles",
    initial: "C",
    avatarColor: "#15803d",
    category: "Retail",
    location: "1.1 mi away",
    tag: "near_you",
    title: "$15 off a bike tune-up",
    highlight: "$15 off",
    terms:
      "Valid on any standard tune-up service. One per customer. Pay with a linked card to redeem automatically.",
    expiresLabel: "Ends Aug 1",
    estimatedSavings: 15,
  },
  {
    id: "willow-bakery-free-pastry",
    merchant: "Willow Bakery",
    initial: "W",
    avatarColor: "#9d174d",
    category: "Bakery",
    location: "0.4 mi away",
    tag: "new_merchant",
    title: "Free pastry with any coffee",
    highlight: "Free pastry",
    terms:
      "One free pastry with the purchase of any coffee drink. While supplies last. Pay with a linked card to redeem.",
    expiresLabel: null,
    estimatedSavings: 5,
  },
  {
    id: "northside-cinema-ticket",
    merchant: "Northside Cinema",
    initial: "N",
    avatarColor: "#4338ca",
    category: "Entertainment",
    location: "2.3 mi away",
    tag: "trending",
    title: "$5 off two tickets",
    highlight: "$5 off",
    terms:
      "Valid on the purchase of two or more standard tickets. Excludes premium formats. Pay with a linked card to redeem.",
    expiresLabel: "Ends Jul 4",
    estimatedSavings: 5,
  },
]

/**
 * Fetch the offers for the current user. Stubbed with sample data today; the
 * signature is async so swapping in a real `/api/offers` call later doesn't
 * ripple through callers.
 */
export async function fetchOffers(): Promise<Offer[]> {
  return SAMPLE_OFFERS
}

/** Synchronous accessor for the sample offers, handy for previews/SSR. */
export function getSampleOffers(): Offer[] {
  return SAMPLE_OFFERS
}
