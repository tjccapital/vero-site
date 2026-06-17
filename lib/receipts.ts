// Thin wrappers around the /api/receipts/* proxy routes. Mirrors the shape of
// lib/transactions.ts. Endpoints (documented at api.veroreceipts.com):
//   GET    /api/receipts                  → list a user's receipts
//   POST   /api/receipts/upload           → multipart upload (field: receipt_image)
//   POST   /api/receipts/:id/match        → manually link a receipt to a tx
//   DELETE /api/receipts/:id/match        → unlink
//   DELETE /api/receipts/:id              → delete a receipt
//
// The backend serialises with snake_case but newer endpoints sometimes return
// camelCase, so both shapes are surfaced here. Helpers at the bottom pick the
// correct one without forcing every caller to repeat the logic.

export interface ReceiptLineItem {
  description?: string
  name?: string
  quantity?: number
  price?: number
  unitPrice?: number
  unit_price?: number
}

export interface ReceiptListItem {
  id: string
  imageUrl?: string
  image_url?: string
  thumbnailUrl?: string
  thumbnail_url?: string
  merchantName?: string
  merchant_name?: string
  total?: number
  createdAt?: string
  created_at?: string
  source?: string
  status?: string
  ocrError?: string | null
  ocr_error?: string | null
  // The receipt's own match (when matched). Lets the UI deep-link to the
  // matched transaction without loading the full transactions list.
  match?: { transaction_id?: string; match_method?: string } | null
  linkedTransactionId?: string
  linked_transaction_id?: string
}

interface ReceiptsListResponse {
  receipts?: ReceiptListItem[] | null
  total?: number
  unmatched_count?: number
  limit?: number
  offset?: number
  has_more?: boolean
}

// Query params accepted by GET /api/receipts. Mirrors the backend ReceiptFilter.
export interface ReceiptFilters {
  status?: string
  source?: string
  matchMethod?: string
  search?: string
  dateFrom?: string
  dateTo?: string
  amountMin?: number
  amountMax?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
  // Pagination. limit defaults server-side (50, max 100); offset pages results.
  limit?: number
  offset?: number
}

// A single page of receipts plus pagination metadata.
export interface ReceiptsPage {
  receipts: ReceiptListItem[]
  total: number
  unmatchedCount: number
  limit: number
  offset: number
  hasMore: boolean
}

function buildReceiptQuery(filters?: ReceiptFilters): string {
  if (!filters) return ""
  const params = new URLSearchParams()
  if (filters.status) params.set("status", filters.status)
  if (filters.source) params.set("source", filters.source)
  if (filters.matchMethod) params.set("match_method", filters.matchMethod)
  if (filters.search) params.set("search", filters.search)
  if (filters.dateFrom) params.set("date_from", filters.dateFrom)
  if (filters.dateTo) params.set("date_to", filters.dateTo)
  if (filters.amountMin !== undefined)
    params.set("amount_min", String(filters.amountMin))
  if (filters.amountMax !== undefined)
    params.set("amount_max", String(filters.amountMax))
  if (filters.sortBy) params.set("sort_by", filters.sortBy)
  if (filters.sortOrder) params.set("sort_order", filters.sortOrder)
  if (filters.limit !== undefined) params.set("limit", String(filters.limit))
  if (filters.offset !== undefined) params.set("offset", String(filters.offset))
  const qs = params.toString()
  return qs ? `?${qs}` : ""
}

export interface UploadReceiptResponse {
  success?: boolean
  receipt: ReceiptListItem & {
    line_items?: ReceiptLineItem[]
    lineItems?: ReceiptLineItem[]
  }
  // True when the receipt was accepted asynchronously and is still being OCR'd
  // (status "processing"). The OCR fields fill in later — poll the receipt /
  // list until status leaves "processing".
  processing?: boolean
  // True when the backend detected an exact duplicate and returned the existing
  // receipt instead of creating a new one.
  deduplicated?: boolean
}

// Raw shape of POST /api/receipts/ingest.
interface IngestResponse {
  receipt_id: string
  status?: string
  deduplicated?: boolean
  receipt?: ReceiptListItem & {
    line_items?: ReceiptLineItem[]
    lineItems?: ReceiptLineItem[]
  }
}

export async function fetchReceipts(
  filters?: ReceiptFilters
): Promise<ReceiptsPage> {
  const res = await fetch(`/api/receipts${buildReceiptQuery(filters)}`)
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(
      `GET /api/receipts failed (${res.status}): ${text || res.statusText}`
    )
  }
  const body = (await res.json()) as ReceiptsListResponse
  const receipts = body.receipts ?? []
  const offset = body.offset ?? filters?.offset ?? 0
  const total = body.total ?? receipts.length
  return {
    receipts,
    total,
    unmatchedCount: body.unmatched_count ?? 0,
    limit: body.limit ?? filters?.limit ?? receipts.length,
    offset,
    hasMore: body.has_more ?? offset + receipts.length < total,
  }
}

// Uploads a single file via the async ingest endpoint. The backend stores the
// image, creates a "processing" receipt, and runs OCR in the background
// (returning in ~hundreds of ms). The field name is `receipt_image` to match
// the mobile client; the browser sets the multipart boundary automatically when
// we pass a FormData body and omit the content-type header here.
//
// The returned `receipt` always carries the new `id`/`status`; OCR fields
// (merchant, total, line items) arrive later — callers should poll the receipt
// list until status leaves "processing".
export async function uploadReceipt(file: File): Promise<UploadReceiptResponse> {
  const fd = new FormData()
  fd.append("receipt_image", file, file.name)
  fd.append("source", "upload")
  const res = await fetch("/api/receipts/ingest", {
    method: "POST",
    body: fd,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(
      `POST /api/receipts/ingest failed (${res.status}): ${text || res.statusText}`
    )
  }
  const body = (await res.json()) as IngestResponse
  const receipt = {
    id: body.receipt_id,
    status: body.status,
    ...(body.receipt ?? {}),
  } as UploadReceiptResponse["receipt"]
  return {
    success: true,
    receipt,
    processing: body.status === "processing",
    deduplicated: body.deduplicated,
  }
}

export async function matchReceiptToTransaction(
  receiptId: string,
  transactionId: string,
  accountId?: string
): Promise<void> {
  const res = await fetch(
    `/api/receipts/${encodeURIComponent(receiptId)}/match`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        transaction_id: transactionId,
        account_id: accountId || "",
      }),
    }
  )
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(
      `POST /api/receipts/${receiptId}/match failed (${res.status}): ${
        text || res.statusText
      }`
    )
  }
}

// Promotes a soft-duplicate to a standalone receipt (clears duplicate_of and
// re-runs auto-match). Used by the "Keep" action on a "possible duplicate".
export async function promoteDuplicate(receiptId: string): Promise<void> {
  const res = await fetch(
    `/api/receipts/${encodeURIComponent(receiptId)}/promote-duplicate`,
    { method: "POST" }
  )
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(
      `POST /api/receipts/${receiptId}/promote-duplicate failed (${res.status}): ${
        text || res.statusText
      }`
    )
  }
}

export async function deleteReceipt(receiptId: string): Promise<void> {
  const res = await fetch(`/api/receipts/${encodeURIComponent(receiptId)}`, {
    method: "DELETE",
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(
      `DELETE /api/receipts/${receiptId} failed (${res.status}): ${
        text || res.statusText
      }`
    )
  }
}

export function receiptDisplayName(r: ReceiptListItem): string {
  return r.merchantName || r.merchant_name || "Receipt"
}

export function receiptDate(r: ReceiptListItem): string | undefined {
  return r.createdAt || r.created_at
}

// The id of the transaction this receipt is matched to, if any. Reads the
// receipt's embedded match so callers don't need the full transactions list.
export function receiptMatchedTransactionId(
  r: ReceiptListItem
): string | undefined {
  return (
    r.match?.transaction_id ||
    r.linkedTransactionId ||
    r.linked_transaction_id ||
    undefined
  )
}

export function receiptImage(r: ReceiptListItem): string | undefined {
  return (
    r.thumbnailUrl ||
    r.thumbnail_url ||
    r.imageUrl ||
    r.image_url ||
    undefined
  )
}

// Thumbnail-only variant for list rows. Unlike receiptImage it never falls back
// to the full-size original, so a HEIC upload with no server-generated
// thumbnail resolves to undefined (the UI then shows its placeholder) rather
// than trying to render a full HEIC the browser can't decode.
export function receiptThumbnail(r: ReceiptListItem): string | undefined {
  return r.thumbnailUrl || r.thumbnail_url || undefined
}
