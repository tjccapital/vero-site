"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Receipt,
  ArrowLeft,
  CreditCard,
  Calendar,
  Hash,
  Download,
  Share2,
  CheckCircle2,
  FileText,
  Image as ImageIcon,
  Mail,
  ExternalLink,
  Loader2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  fetchReceiptItems,
  fetchTransactionById,
  fetchTransactionReceipt,
  receiptItemDescription,
  receiptItemUnitPrice,
  receiptItemTotalPrice,
  transactionDisplayName,
  TransactionReceiptNotFoundError,
  type ReceiptItem,
  type Transaction,
  type Receipt as ReceiptModel,
} from "@/lib/transactions"
import {
  formatTxLongDate,
  getCategoryColor,
  getCategoryLabel,
  getTransactionIcon,
} from "@/lib/category-display"

function isPdfUrl(url: string | null | undefined): boolean {
  if (!url) return false
  return url.split("?")[0].toLowerCase().endsWith(".pdf")
}

export default function TransactionDetailPage() {
  const params = useParams()
  const transactionId = params.id as string

  const [transaction, setTransaction] = useState<Transaction | null>(null)
  const [receipt, setReceipt] = useState<ReceiptModel | null>(null)
  const [items, setItems] = useState<ReceiptItem[]>([])
  const [itemsLoading, setItemsLoading] = useState(false)
  const [matchMethod, setMatchMethod] = useState<string | null>(null)
  const [hasReceipt, setHasReceipt] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Asset URLs surfaced from the transaction-receipt response — image
  // (typically the photo of the receipt), pdf (image_url ending in .pdf
  // or a separate attachment_url), and the rendered email HTML when the
  // receipt was matched from an inbox scan.
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfLabel, setPdfLabel] = useState<string | null>(null)
  const [emailHtmlUrl, setEmailHtmlUrl] = useState<string | null>(null)

  // On mount, fetch the transaction (for the page header) and the matched
  // receipt (for the itemized layout). The receipt request is allowed to
  // 404 — that's the "not yet matched" branch, not a hard error.
  useEffect(() => {
    if (!transactionId) return
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.allSettled([
      fetchTransactionById(transactionId),
      fetchTransactionReceipt(transactionId),
    ]).then(([txResult, receiptResult]) => {
      if (cancelled) return

      if (txResult.status === "fulfilled") {
        setTransaction(txResult.value)
      } else {
        console.error("[Transactions] Failed to load transaction:", txResult.reason)
      }

      let receiptForItems: ReceiptModel | null = null
      if (receiptResult.status === "fulfilled") {
        const value = receiptResult.value
        const r = value.receipt
        setReceipt(r)
        setHasReceipt(!!r)
        setMatchMethod(value.matchMethod || value.match_method || null)
        // Seed items from whatever the transaction-receipt endpoint
        // returned inline; we'll backfill from /api/receipts/:id/items
        // below if the inline list is empty.
        setItems(r?.items ?? [])
        receiptForItems = r

        // Sort the receipt's primary asset (image or PDF), the email's
        // attached document (usually a PDF invoice) and the rendered email
        // body into the three buckets the "Receipt Files" card renders.
        const primary = r?.imageUrl || r?.image_url || null
        const attachment = value.attachmentUrl || value.attachment_url || null
        const attachmentName = value.attachmentName || value.attachment_name || null
        const html = value.emailHTMLURL || value.email_html_url || null

        let nextImage: string | null = null
        let nextPdf: string | null = null
        let nextPdfLabel: string | null = null
        if (primary) {
          if (isPdfUrl(primary)) {
            nextPdf = primary
          } else {
            nextImage = primary
          }
        }
        if (attachment) {
          if (isPdfUrl(attachment) || (attachmentName && /\.pdf$/i.test(attachmentName))) {
            nextPdf = nextPdf || attachment
            nextPdfLabel = attachmentName
          } else if (!nextImage) {
            nextImage = attachment
          }
        }
        setImageUrl(nextImage)
        setPdfUrl(nextPdf)
        setPdfLabel(nextPdfLabel)
        setEmailHtmlUrl(html)
      } else {
        if (receiptResult.reason instanceof TransactionReceiptNotFoundError) {
          // Expected — the transaction has no matched receipt yet.
          setReceipt(null)
          setHasReceipt(false)
          setImageUrl(null)
          setPdfUrl(null)
          setPdfLabel(null)
          setEmailHtmlUrl(null)
        } else {
          console.error("[Transactions] Failed to load receipt:", receiptResult.reason)
          setError("Couldn't load this transaction's receipt.")
        }
      }

      setLoading(false)

      // Items are served from a separate endpoint
      // (GET /api/receipts/:id/items) and the transaction-receipt response
      // only returns the receipt header. Fetch them after the main page
      // has loaded so the receipt info paints first; the items section
      // shows its own spinner while this resolves.
      if (
        receiptForItems &&
        receiptForItems.id &&
        (!receiptForItems.items || receiptForItems.items.length === 0)
      ) {
        setItemsLoading(true)
        fetchReceiptItems(receiptForItems.id)
          .then((fetched) => {
            if (cancelled) return
            setItems(fetched)
          })
          .catch((err) => {
            if (cancelled) return
            console.error("[Transactions] Failed to load receipt items:", err)
            // Don't surface a hard error — fall through to the
            // "merchant didn't provide line items" empty state.
          })
          .finally(() => {
            if (!cancelled) setItemsLoading(false)
          })
      }
    })

    return () => {
      cancelled = true
    }
  }, [transactionId])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-[var(--muted-foreground)]" />
      </div>
    )
  }

  // If both lookups failed and we have nothing to render, show a not-found
  // page. We accept rendering with `transaction=null` as long as we can show
  // the receipt — but if both are missing, there's nothing to display.
  if (!transaction && !hasReceipt) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-center">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-[var(--muted)]">
            <Receipt className="h-8 w-8 text-[var(--muted-foreground)]" />
          </div>
          <h2 className="mt-4 text-lg font-medium">Transaction not found</h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            We couldn&apos;t find this transaction.
          </p>
          <Link
            href="/consumer/transactions"
            className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--primary)] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Transactions
          </Link>
        </div>
      </div>
    )
  }

  const Icon = getTransactionIcon(transaction)
  const categoryColor = getCategoryColor(transaction)
  const categoryLabel = getCategoryLabel(transaction)
  const merchant =
    transaction
      ? transactionDisplayName(transaction)
      : receipt?.merchantName || receipt?.merchant_name || "Transaction"
  const totalAmount =
    transaction
      ? Math.abs(transaction.amount)
      : receipt?.total ?? 0
  const transactionDate = transaction?.date || receipt?.date

  const subtotal = receipt?.subtotal
  const tax = receipt?.tax
  const receiptTotal = receipt?.total ?? totalAmount

  return (
    <div className="mx-auto max-w-3xl space-y-6 w-full">
      {/* In-content toolbar — back link + share/download actions. The
          layout's top bar handles sidebar/menu toggles and the global
          "Back to Site" link, so page-specific actions live inline. */}
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/consumer/transactions"
          className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] min-w-0"
        >
          <ArrowLeft className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">Back to Transactions</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!hasReceipt}
            className="flex items-center justify-center gap-2 rounded-md p-2 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Share receipt"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={!hasReceipt}
            className="flex items-center justify-center gap-2 rounded-md p-2 text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Download receipt"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {/* Transaction Header */}
      <div className="rounded-lg border border-[var(--border)] overflow-hidden">
        <div className="bg-gradient-to-r from-[var(--primary)]/5 to-transparent p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full",
              categoryColor
            )}>
              <Icon className="h-7 w-7" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div>
                  <h1 className="text-xl font-semibold">{merchant}</h1>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Badge variant="secondary" className={cn("capitalize", categoryColor)}>
                      {categoryLabel}
                    </Badge>
                    {hasReceipt ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">
                          Itemized receipt{matchMethod ? ` · ${matchMethod}` : ""}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-[var(--muted-foreground)]">
                        No itemized receipt yet
                      </span>
                    )}
                    {transaction?.pending ? (
                      <span className="text-xs text-amber-600 font-medium">Pending</span>
                    ) : null}
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-2xl font-bold">${totalAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="border-t border-[var(--border)] p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {transactionDate ? (
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-[var(--muted-foreground)]" />
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">Date</p>
                <p className="text-sm font-medium">{formatTxLongDate(transactionDate)}</p>
              </div>
            </div>
          ) : null}
          {transaction?.accountId || transaction?.account_id ? (
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-[var(--muted-foreground)]" />
              <div>
                <p className="text-xs text-[var(--muted-foreground)]">Account</p>
                <p className="text-sm font-medium font-mono">
                  {transaction.accountId || transaction.account_id}
                </p>
              </div>
            </div>
          ) : null}
          <div className="flex items-center gap-3">
            <Hash className="h-5 w-5 text-[var(--muted-foreground)]" />
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Transaction ID</p>
              <p className="text-sm font-medium font-mono break-all">{transactionId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized receipt or empty state */}
      {hasReceipt && receipt ? (
        <>
          <div className="rounded-lg border border-[var(--border)]">
            <div className="border-b border-[var(--border)] px-4 py-3 sm:px-6">
              <h2 className="font-semibold">
                Items{itemsLoading ? "" : ` (${items.length})`}
              </h2>
            </div>
            {itemsLoading ? (
              <div className="flex items-center justify-center px-4 py-8 sm:px-6">
                <Loader2 className="h-5 w-5 animate-spin text-[var(--muted-foreground)]" />
              </div>
            ) : items.length === 0 ? (
              <div className="px-4 py-8 sm:px-6 text-center text-sm text-[var(--muted-foreground)]">
                The merchant didn&apos;t provide line items for this receipt.
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {items.map((item, index) => {
                  const description = receiptItemDescription(item)
                  const unit = receiptItemUnitPrice(item)
                  const total = receiptItemTotalPrice(item)
                  return (
                    <div key={item.id || index} className="flex items-center justify-between p-4 sm:px-6">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{description}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-sm text-[var(--muted-foreground)]">
                            {item.quantity && item.quantity > 1 && unit !== undefined
                              ? `${item.quantity} × $${unit.toFixed(2)}`
                              : unit !== undefined
                              ? `$${unit.toFixed(2)}`
                              : null}
                          </p>
                          {item.sku ? (
                            <span className="text-xs text-[var(--muted-foreground)] font-mono">
                              {item.sku}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      {total !== undefined ? (
                        <p className="font-semibold ml-4">${total.toFixed(2)}</p>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-[var(--border)]">
            <div className="p-4 sm:p-6 space-y-3">
              {subtotal !== undefined ? (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              ) : null}
              {tax !== undefined ? (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--muted-foreground)]">Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              ) : null}
              <div className="border-t border-[var(--border)] pt-3 flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold">${receiptTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {imageUrl || pdfUrl || emailHtmlUrl ? (
            <div className="rounded-lg border border-[var(--border)]">
              <div className="border-b border-[var(--border)] px-4 py-3 sm:px-6">
                <h2 className="font-semibold">Receipt Files</h2>
                <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                  Open the original receipt or related documents
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
                {imageUrl ? (
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-3 hover:bg-[var(--muted)]/50 transition-colors"
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--muted)]">
                      <ImageIcon className="h-4 w-4 text-[var(--muted-foreground)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">View image</p>
                      <p className="text-xs text-[var(--muted-foreground)]">Receipt photo</p>
                    </div>
                    <ExternalLink className="h-4 w-4 flex-shrink-0 text-[var(--muted-foreground)]" />
                  </a>
                ) : null}
                {pdfUrl ? (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-3 hover:bg-[var(--muted)]/50 transition-colors"
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--muted)]">
                      <FileText className="h-4 w-4 text-[var(--muted-foreground)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">View PDF</p>
                      <p className="truncate text-xs text-[var(--muted-foreground)]">
                        {pdfLabel || "Receipt document"}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 flex-shrink-0 text-[var(--muted-foreground)]" />
                  </a>
                ) : null}
                {emailHtmlUrl ? (
                  <a
                    href={emailHtmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-3 hover:bg-[var(--muted)]/50 transition-colors"
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[var(--muted)]">
                      <Mail className="h-4 w-4 text-[var(--muted-foreground)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">View email</p>
                      <p className="text-xs text-[var(--muted-foreground)]">Original message</p>
                    </div>
                    <ExternalLink className="h-4 w-4 flex-shrink-0 text-[var(--muted-foreground)]" />
                  </a>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="rounded-lg bg-[var(--muted)]/50 p-4 text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-[var(--muted-foreground)]">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Digital receipt delivered via Vero</span>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-lg border border-dashed border-[var(--border)] p-8 text-center">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-[var(--muted)]">
            <FileText className="h-6 w-6 text-[var(--muted-foreground)]" />
          </div>
          <h3 className="mt-4 font-medium">No itemized receipt yet</h3>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            We haven&apos;t matched a receipt to this transaction yet. Receipts can be
            matched automatically from your email, or scanned manually.
          </p>
        </div>
      )}
    </div>
  )
}
