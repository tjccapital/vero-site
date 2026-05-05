// Shared helpers for rendering Plaid transactions in the consumer surfaces.
// Each /consumer page used to redefine its own icon mapping, date formatter
// and category badge palette; consolidating here keeps them in lockstep when
// the design system shifts (e.g. when we moved category badges to grey).

import {
  Receipt,
  ShoppingBag,
  Coffee,
  Utensils,
  Car,
  Store,
  type LucideIcon,
} from "lucide-react"
import type { Transaction } from "@/lib/transactions"

function categoryTags(tx: Transaction | null | undefined): string[] {
  if (!tx) return []
  return (tx.category || []).map((c) => c.toLowerCase())
}

function tagsMatch(tags: string[], needles: string[]): boolean {
  return needles.some((n) => tags.some((t) => t.includes(n)))
}

export function getTransactionIcon(tx: Transaction | null | undefined): LucideIcon {
  const tags = categoryTags(tx)
  if (tagsMatch(tags, ["grocery", "supermarket"])) return ShoppingBag
  if (tagsMatch(tags, ["coffee"])) return Coffee
  if (tagsMatch(tags, ["restaurant", "food and drink", "fast food", "dining"])) return Utensils
  if (tagsMatch(tags, ["gas", "fuel", "automotive"])) return Car
  if (tagsMatch(tags, ["shop", "retail", "merchandise"])) return Store
  return Receipt
}

// Returns Tailwind classes for the category Badge. We use grey shades rather
// than per-category colors so the list reads as data, not as a heatmap.
export function getCategoryColor(tx: Transaction | null | undefined): string {
  const tags = categoryTags(tx)
  if (tagsMatch(tags, ["grocery", "supermarket"])) return "bg-gray-100 text-gray-700"
  if (tagsMatch(tags, ["coffee"])) return "bg-gray-100 text-gray-600"
  if (tagsMatch(tags, ["restaurant", "food and drink", "dining", "fast food"])) return "bg-gray-200 text-gray-800"
  if (tagsMatch(tags, ["gas", "fuel", "automotive"])) return "bg-gray-100 text-gray-700"
  if (tagsMatch(tags, ["shop", "retail", "merchandise"])) return "bg-gray-200 text-gray-700"
  return "bg-gray-100 text-gray-700"
}

export function getCategoryLabel(tx: Transaction | null | undefined): string {
  const tags = categoryTags(tx)
  if (tagsMatch(tags, ["grocery", "supermarket"])) return "groceries"
  if (tagsMatch(tags, ["coffee"])) return "coffee"
  if (tagsMatch(tags, ["restaurant", "food and drink", "dining", "fast food"])) return "dining"
  if (tagsMatch(tags, ["gas", "fuel", "automotive"])) return "gas"
  if (tagsMatch(tags, ["shop", "retail", "merchandise"])) return "shopping"
  return tx?.category?.[0]?.toLowerCase() || (tx ? "other" : "transaction")
}

// "Today" / "Yesterday" / "MMM d, yyyy" — used in the transactions list.
export function formatTxDate(iso?: string): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const dayStart = new Date(d)
  dayStart.setHours(0, 0, 0, 0)
  if (dayStart.getTime() === today.getTime()) return "Today"
  if (dayStart.getTime() === yesterday.getTime()) return "Yesterday"
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

// "Today" / "Yesterday" / "MMM d" — used in the dashboard's compact lists.
export function formatTxShortDate(iso?: string): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const dayStart = new Date(d)
  dayStart.setHours(0, 0, 0, 0)
  if (dayStart.getTime() === today.getTime()) return "Today"
  if (dayStart.getTime() === yesterday.getTime()) return "Yesterday"
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

// "January 5, 2026" — used in the transaction detail header.
export function formatTxLongDate(iso?: string): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
