"use client"

// Circular badge for a transaction. Renders the enriched merchant logo when
// the backend provides one (merchant.logoUrl / logo_url) and falls back to the
// category icon when there's no logo or the image fails to load. Previously the
// consumer surfaces only ever drew the category icon and silently dropped the
// logo the API returns; vero-mobile renders these logos, so this brings the web
// app in line.

import { useState } from "react"
import { cn } from "@/lib/utils"
import { getTransactionIcon } from "@/lib/category-display"
import { transactionDisplayName, transactionLogoUrl } from "@/lib/transactions"
import type { Transaction } from "@/lib/transactions"

export function TransactionAvatar({
  transaction,
  className,
  iconClassName,
}: {
  transaction: Transaction | null | undefined
  // Sizing/background for the circular container (e.g. "h-10 w-10 bg-[var(--muted)]").
  className?: string
  // Sizing/color for the fallback category icon (e.g. "h-5 w-5 text-[var(--muted-foreground)]").
  iconClassName?: string
}) {
  const [broken, setBroken] = useState(false)
  const logo = transactionLogoUrl(transaction)
  const Icon = getTransactionIcon(transaction)
  const showLogo = logo && !broken

  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-full",
        className
      )}
    >
      {showLogo ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={logo}
          alt={transaction ? `${transactionDisplayName(transaction)} logo` : ""}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setBroken(true)}
        />
      ) : (
        <Icon className={iconClassName} />
      )}
    </div>
  )
}
