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
  /** Short context line under the headline. */
  description: string
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

// Sample offers. Ordered roughly the way we'd rank them for a shopper: the
// places they already spend at first, then nearby and new merchants.
const SAMPLE_OFFERS: Offer[] = [
  {
    id: "charlevoix-10",
    merchant: "The Charlevoix",
    initial: "C",
    avatarColor: "#0f766e",
    category: "Bar",
    location: "East Lansing",
    tag: "you_shop_here",
    title: "10% off your next visit",
    highlight: "10% off",
    description: "You've spent $211 here in the last 90 days",
    terms:
      "Discount applies to your total bill, food and drinks included. Valid for one visit. Pay with a linked card to redeem automatically.",
    expiresLabel: "Ends Jun 30",
    estimatedSavings: 12,
  },
  {
    id: "4th-street-brunch-coffee",
    merchant: "4th Street Brunch",
    initial: "4",
    avatarColor: "#92400e",
    category: "Café",
    location: "Ann Arbor",
    tag: "you_shop_here",
    title: "Free coffee with any entrée",
    highlight: "any entrée",
    description: "Last visit Jun 12 · $37.99",
    terms:
      "One free drip coffee or hot tea with the purchase of any entrée. Dine-in only. Pay with a linked card to redeem.",
    expiresLabel: "Ends Jul 7",
    estimatedSavings: 4,
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
    description: "New Vero merchant on your route",
    terms:
      "Valid on your first order only. Minimum purchase of $5. Pay with a linked card to redeem automatically.",
    expiresLabel: null,
    estimatedSavings: 2,
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
    description: "Your most-visited grocery store",
    terms:
      "Earn 5% back as Vero credit on all in-store grocery purchases through the end of the month. Pay with a linked card to qualify.",
    expiresLabel: "Ends Jun 30",
    estimatedSavings: 18,
  },
  {
    id: "blue-ridge-tacos-bogo",
    merchant: "Blue Ridge Tacos",
    initial: "B",
    avatarColor: "#b45309",
    category: "Restaurant",
    location: "0.6 mi away",
    tag: "near_you",
    title: "Buy one taco, get one free",
    highlight: "get one free",
    description: "Popular with shoppers near you",
    terms:
      "Buy any taco and get a second of equal or lesser value free. Dine-in or takeout. Pay with a linked card to redeem.",
    expiresLabel: "Ends Jul 15",
    estimatedSavings: 4,
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
    description: "Trending with riders this week",
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
    description: "Just joined the Vero network",
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
    description: "Trending in your area this weekend",
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
