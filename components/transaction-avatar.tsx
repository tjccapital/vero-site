"use client"

// Circular badge for a transaction. Always renders the category icon — the
// consumer surfaces (dashboard, transactions list, transaction detail)
// intentionally use icons across the board rather than merchant logos, so the
// look stays consistent regardless of whether the backend enriched the
// transaction with a logo.

import { createElement } from "react"
import { cn } from "@/lib/utils"
import { getTransactionIcon } from "@/lib/category-display"
import type { Transaction } from "@/lib/transactions"

export function TransactionAvatar({
  transaction,
  className,
  iconClassName,
}: {
  transaction: Transaction | null | undefined
  // Sizing/background for the circular container (e.g. "h-10 w-10 bg-[var(--muted)]").
  className?: string
  // Sizing/color for the category icon (e.g. "h-5 w-5 text-[var(--muted-foreground)]").
  iconClassName?: string
}) {
  // getTransactionIcon returns a stable, module-level lucide icon component.
  // Render it via createElement (rather than assigning to a capitalized local
  // and using JSX) so the static-components lint doesn't read it as an inline
  // component definition.
  const icon = getTransactionIcon(transaction)

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-full",
        className
      )}
    >
      {createElement(icon, { className: iconClassName })}
    </div>
  )
}
