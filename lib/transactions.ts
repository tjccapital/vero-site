// Thin wrappers around the /api/transactions/* proxy routes (which forward
// to api.veroreceipts.com with an Auth0 bearer token).
//
// Endpoints documented at api.veroreceipts.com:
//   GET  /api/transactions            (list, filterable)
//   POST /api/transactions/sync       (cursor sync from Plaid)
//   POST /api/transactions/refresh    (force refresh + sync)
//   GET  /api/transactions/:id/receipt

export interface TransactionMerchant {
  id?: string
  canonicalName?: string
  canonical_name?: string
  name?: string
  logoUrl?: string
  logo_url?: string
}

export interface AttachedReceipt {
  id: string
  imageUrl?: string
  image_url?: string
  matchMethod?: string
  match_method?: string
}

export interface Transaction {
  // Backend serialises with json tags that mostly use camelCase, but a few
  // are snake_case-only — surface both so the UI can read whichever shape
  // the upstream sends without re-mapping.
  id: string
  accountId?: string
  account_id?: string
  amount: number
  date: string
  name: string
  merchantName?: string
  merchant_name?: string
  merchant?: TransactionMerchant | null
  category?: string[] | null
  pending?: boolean
  receipt?: AttachedReceipt | null
  isoCurrencyCode?: string
  iso_currency_code?: string
}

export interface TransactionsResponse {
  transactions: Transaction[]
  // SyncResult also exposes added/modified/removed/next_cursor/has_more on
  // the sync endpoints; declare them as optional so one type covers all
  // three responses.
  added?: Transaction[]
  modified?: Transaction[]
  removed?: Array<{ transaction_id?: string; id?: string }>
  next_cursor?: string
  nextCursor?: string
  has_more?: boolean
  hasMore?: boolean
}

export interface TransactionFilters {
  search?: string
  dateFrom?: string
  dateTo?: string
  amountMin?: number
  amountMax?: number
  category?: string
  pfcPrimary?: string
  pfcDetailed?: string
  // "matched" | "unmatched" — accepts the literal strings the backend uses.
  matched?: string
  // "true" | "false" | "only"
  pending?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

function buildQuery(filters?: TransactionFilters): string {
  if (!filters) return ""
  const params = new URLSearchParams()
  if (filters.search) params.set("search", filters.search)
  if (filters.dateFrom) params.set("date_from", filters.dateFrom)
  if (filters.dateTo) params.set("date_to", filters.dateTo)
  if (filters.amountMin !== undefined)
    params.set("amount_min", String(filters.amountMin))
  if (filters.amountMax !== undefined)
    params.set("amount_max", String(filters.amountMax))
  if (filters.category) params.set("category", filters.category)
  if (filters.pfcPrimary) params.set("pfc_primary", filters.pfcPrimary)
  if (filters.pfcDetailed) params.set("pfc_detailed", filters.pfcDetailed)
  if (filters.matched) params.set("matched", filters.matched)
  if (filters.pending) params.set("pending", filters.pending)
  if (filters.sortBy) params.set("sort_by", filters.sortBy)
  if (filters.sortOrder) params.set("sort_order", filters.sortOrder)
  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`GET ${url} failed (${res.status}): ${text || res.statusText}`)
  }
  return (await res.json()) as T
}

async function postJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { method: "POST" })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`POST ${url} failed (${res.status}): ${text || res.statusText}`)
  }
  return (await res.json()) as T
}

export function fetchTransactions(
  filters?: TransactionFilters
): Promise<TransactionsResponse> {
  return getJson<TransactionsResponse>(`/api/transactions${buildQuery(filters)}`)
}

export function syncTransactions(): Promise<TransactionsResponse> {
  return postJson<TransactionsResponse>("/api/transactions/sync")
}

export function refreshTransactions(): Promise<TransactionsResponse> {
  return postJson<TransactionsResponse>("/api/transactions/refresh")
}

// Pull the merchant display name out of a transaction, preferring the
// enriched merchant record when present and falling back to the raw
// transaction name from the bank.
export function transactionDisplayName(tx: Transaction): string {
  return (
    tx.merchant?.canonicalName ||
    tx.merchant?.canonical_name ||
    tx.merchant?.name ||
    tx.merchantName ||
    tx.merchant_name ||
    tx.name
  )
}

// ─── Receipt detail ────────────────────────────────────────────────────────

export interface ReceiptItem {
  id?: string
  // Backends serialise items with a mix of camelCase and snake_case; declare
  // both so the UI doesn't need a mapping layer.
  description?: string
  name?: string
  quantity?: number
  unitPrice?: number
  unit_price?: number
  totalPrice?: number
  total_price?: number
  price?: number
  sku?: string
  sortOrder?: number
  sort_order?: number
}

export interface Receipt {
  id: string
  merchantName?: string
  merchant_name?: string
  merchantAddress?: string
  merchant_address?: string
  total?: number
  subtotal?: number
  tax?: number
  date?: string
  imageUrl?: string
  image_url?: string
  // The transaction-receipt endpoint returns line items inline as
  // `line_items` (snake_case). Newer/CRUD-style endpoints use `items`.
  // Both are surfaced here so callers can read whichever the upstream sent.
  items?: ReceiptItem[]
  line_items?: ReceiptItem[]
}

export interface TransactionReceiptResponse {
  receipt: Receipt | null
  match_method?: string
  matchMethod?: string
  confidence_score?: number
  confidenceScore?: number
  match_reason?: string
  matchReason?: string
  attachment_url?: string | null
  attachmentUrl?: string | null
  attachment_name?: string | null
  attachmentName?: string | null
  email_subject?: string | null
  emailSubject?: string | null
  email_snippet?: string | null
  emailSnippet?: string | null
  email_html_url?: string | null
  emailHTMLURL?: string | null
}

// Thrown when GET /api/transactions/:id/receipt returns 404 — i.e. the
// transaction has no matched receipt yet. Pages can catch this specifically
// to render an "unmatched" empty state without logging it as an error.
export class TransactionReceiptNotFoundError extends Error {
  constructor(public transactionId: string) {
    super(`No receipt matched to transaction ${transactionId}`)
    this.name = "TransactionReceiptNotFoundError"
  }
}

export async function fetchTransactionReceipt(
  transactionId: string
): Promise<TransactionReceiptResponse> {
  const url = `/api/transactions/${encodeURIComponent(transactionId)}/receipt`
  const res = await fetch(url)
  if (res.status === 404) {
    throw new TransactionReceiptNotFoundError(transactionId)
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`GET ${url} failed (${res.status}): ${text || res.statusText}`)
  }
  const body = (await res.json()) as TransactionReceiptResponse
  // The backend returns inline line items under `line_items` on this
  // endpoint (the dedicated /api/receipts/:id/items route is for CRUD).
  // Normalise so the page can always read `receipt.items`.
  if (body.receipt) {
    const r = body.receipt
    if ((!r.items || r.items.length === 0) && r.line_items && r.line_items.length > 0) {
      r.items = r.line_items
    }
  }
  return body
}

// Items live behind their own endpoint
// (GET /api/receipts/:id/items) — the transaction-receipt response only
// returns the receipt header (subtotal, tax, total, match metadata).
export async function fetchReceiptItems(
  receiptId: string
): Promise<ReceiptItem[]> {
  const url = `/api/receipts/${encodeURIComponent(receiptId)}/items`
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`GET ${url} failed (${res.status}): ${text || res.statusText}`)
  }
  const body = (await res.json()) as { items?: ReceiptItem[] | null }
  return body.items ?? []
}

// Pull a single transaction by id. The backend's `?search=` filter only
// matches against name / merchant_name (not transaction id) and there's no
// GET /api/transactions/:id endpoint, so we list and pick. To avoid making
// every detail page reload the whole list, pages that already hold the row
// in memory call cacheTransactionForDetail() before navigating; we read
// from that sessionStorage cache here before falling back to the network.
export async function fetchTransactionById(
  transactionId: string
): Promise<Transaction | null> {
  const cached = readCachedTransaction(transactionId)
  if (cached) return cached
  const res = await fetchTransactions()
  return res.transactions.find((tx) => tx.id === transactionId) ?? null
}

// Per-tab cache used by /user-dashboard/transactions and the dashboard's "Recent
// Transactions" links to seed the detail page without a round-trip. A single
// key holds the most recently clicked row; the detail page validates the id
// before trusting the payload (cache miss is fine — fetchTransactionById
// will fall through to the list endpoint).
const TX_CACHE_KEY = "vero:tx:current"

export function cacheTransactionForDetail(tx: Transaction): void {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(TX_CACHE_KEY, JSON.stringify(tx))
  } catch {
    // sessionStorage can throw on quota / disabled storage — silently fall
    // back to the network path.
  }
}

export function readCachedTransaction(id: string): Transaction | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(TX_CACHE_KEY)
    if (!raw) return null
    const tx = JSON.parse(raw) as Transaction
    return tx?.id === id ? tx : null
  } catch {
    return null
  }
}

// Helpers used by the detail page so callers don't have to re-implement
// the camelCase/snake_case pick logic each time.
export function receiptItemDescription(item: ReceiptItem): string {
  return item.description || item.name || "Item"
}

export function receiptItemUnitPrice(item: ReceiptItem): number | undefined {
  if (item.unitPrice !== undefined) return item.unitPrice
  if (item.unit_price !== undefined) return item.unit_price
  return undefined
}

export function receiptItemTotalPrice(item: ReceiptItem): number | undefined {
  if (item.totalPrice !== undefined) return item.totalPrice
  if (item.total_price !== undefined) return item.total_price
  if (item.price !== undefined) return item.price
  return undefined
}
