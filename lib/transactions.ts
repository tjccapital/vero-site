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
  // Brand logo URL. The list endpoint returns it as a top-level `merchantLogo`
  // (snake_case `merchant_logo` on some endpoints); the enriched `merchant`
  // record may also carry it as logoUrl/logo_url. transactionLogoUrl() reads
  // whichever is present.
  merchantLogo?: string
  merchant_logo?: string
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
  // Offset pagination metadata (List endpoint).
  total?: number
  limit?: number
  offset?: number
  // Sum of expense (positive) amounts across ALL filter-matching transactions,
  // independent of the current page. Drives the "Total spent" figure.
  total_spent?: number
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
  // Pagination. limit defaults server-side (50, max 100); offset pages results.
  limit?: number
  offset?: number
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
  if (filters.limit !== undefined) params.set("limit", String(filters.limit))
  if (filters.offset !== undefined) params.set("offset", String(filters.offset))
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

// ─── Lightweight per-tab caching ─────────────────────────────────────────────
// Reloading a dashboard page shouldn't re-hit the API every time. We cache list
// responses in sessionStorage keyed by their query string (so each filter combo
// caches independently) with a short TTL, and throttle the Plaid sync so it
// runs at most once per window per tab. Both are best-effort — any storage
// error or cache miss falls through to the network. sessionStorage (not local)
// scopes the cache to the tab and clears it when the tab closes.

const LIST_CACHE_PREFIX = "vero:tx:list:"
const LIST_CACHE_TTL_MS = 60_000 // serve a cached list for up to 60s
const SYNC_THROTTLE_KEY = "vero:tx:lastSync"
const SYNC_THROTTLE_MS = 5 * 60_000 // sync at most once every 5 min per tab

interface CachedList {
  at: number
  data: TransactionsResponse
}

function listCacheKey(filters?: TransactionFilters): string {
  return LIST_CACHE_PREFIX + (buildQuery(filters) || "_all")
}

function readListCache(key: string): TransactionsResponse | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return null
    const entry = JSON.parse(raw) as CachedList
    if (Date.now() - entry.at > LIST_CACHE_TTL_MS) return null
    return entry.data
  } catch {
    return null
  }
}

function writeListCache(key: string, data: TransactionsResponse): void {
  if (typeof window === "undefined") return
  try {
    const entry: CachedList = { at: Date.now(), data }
    sessionStorage.setItem(key, JSON.stringify(entry))
  } catch {
    // Quota/availability errors are non-fatal — we just skip caching.
  }
}

// Cached variant of fetchTransactions: returns a recent sessionStorage copy
// when one exists, otherwise fetches and caches the response. Pass
// { force: true } to bypass the cache (e.g. an explicit refresh).
export async function fetchTransactionsCached(
  filters?: TransactionFilters,
  opts?: { force?: boolean }
): Promise<TransactionsResponse> {
  const key = listCacheKey(filters)
  if (!opts?.force) {
    const cached = readListCache(key)
    if (cached) return cached
  }
  const data = await fetchTransactions(filters)
  writeListCache(key, data)
  return data
}

// The list endpoint caps a single response (server default 50, max 100). Pages
// that aggregate across full history — e.g. the dashboard spending chart and
// category breakdown — need every row, not just the first page, so we walk the
// pages here. ALL_MAX_PAGES is a safety ceiling so a huge account can't spin
// forever; total_spent/total come from the first page (they're computed across
// ALL filter-matching rows server-side, independent of the page).
const ALL_PAGE_LIMIT = 100
const ALL_MAX_PAGES = 20

export async function fetchAllTransactions(
  filters?: TransactionFilters
): Promise<TransactionsResponse> {
  const all: Transaction[] = []
  let first: TransactionsResponse | null = null
  let offset = 0
  for (let page = 0; page < ALL_MAX_PAGES; page++) {
    const res = await fetchTransactions({
      ...filters,
      limit: ALL_PAGE_LIMIT,
      offset,
    })
    if (!first) first = res
    const batch = res.transactions ?? []
    all.push(...batch)
    const more = res.has_more ?? res.hasMore ?? false
    offset += batch.length
    if (!more || batch.length === 0) break
  }
  return {
    ...(first ?? { transactions: [] }),
    transactions: all,
    total: first?.total ?? all.length,
    total_spent: first?.total_spent,
  }
}

// Cached fetch-all, keyed separately from the single-page cache so the two
// don't clobber each other. Cleared by clearTransactionsCache() alongside the
// rest.
export async function fetchAllTransactionsCached(
  filters?: TransactionFilters,
  opts?: { force?: boolean }
): Promise<TransactionsResponse> {
  const key = LIST_CACHE_PREFIX + "all:" + (buildQuery(filters) || "_all")
  if (!opts?.force) {
    const cached = readListCache(key)
    if (cached) return cached
  }
  const data = await fetchAllTransactions(filters)
  writeListCache(key, data)
  return data
}

// True when no sync has run within the throttle window (so the caller should
// sync). Pure check — call markTransactionsSynced() after a successful sync.
function shouldSyncTransactions(): boolean {
  if (typeof window === "undefined") return true
  try {
    const raw = sessionStorage.getItem(SYNC_THROTTLE_KEY)
    const last = raw ? Number(raw) : 0
    return Date.now() - last >= SYNC_THROTTLE_MS
  } catch {
    return true
  }
}

function markTransactionsSynced(): void {
  if (typeof window === "undefined") return
  try {
    sessionStorage.setItem(SYNC_THROTTLE_KEY, String(Date.now()))
  } catch {
    // ignore
  }
}

// Sync from Plaid at most once per throttle window per tab. On rapid reloads
// the redundant syncs are skipped — the cached list is already fresh enough.
// Throws on a real sync failure so callers can keep their existing non-fatal
// handling; the throttle timestamp is only recorded on success so a failed
// sync is retried on the next load.
export async function maybeSyncTransactions(): Promise<void> {
  if (!shouldSyncTransactions()) return
  await syncTransactions()
  markTransactionsSynced()
}

// Drops every cached list and resets the sync throttle. Call after an explicit
// refresh so a later reload re-fetches instead of serving the pre-refresh copy.
export function clearTransactionsCache(): void {
  if (typeof window === "undefined") return
  try {
    const keys: string[] = []
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i)
      if (k && k.startsWith(LIST_CACHE_PREFIX)) keys.push(k)
    }
    keys.forEach((k) => sessionStorage.removeItem(k))
    sessionStorage.removeItem(SYNC_THROTTLE_KEY)
  } catch {
    // ignore
  }
}

// Pull the merchant logo URL out of a transaction. The backend enriches
// transactions with a merchant record that carries the brand logo (camelCase
// `logoUrl`, but a few endpoints serialise it snake_case) — surface whichever
// is present so the UI can render the merchant's logo instead of a generic
// category icon. Returns undefined when no logo is available.
export function transactionLogoUrl(
  tx: Transaction | null | undefined
): string | undefined {
  return (
    tx?.merchantLogo ||
    tx?.merchant_logo ||
    tx?.merchant?.logoUrl ||
    tx?.merchant?.logo_url ||
    undefined
  )
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
