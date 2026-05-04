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
