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
}

interface ReceiptsListResponse {
  receipts?: ReceiptListItem[] | null
}

export interface UploadReceiptResponse {
  success?: boolean
  receipt: ReceiptListItem & {
    line_items?: ReceiptLineItem[]
    lineItems?: ReceiptLineItem[]
  }
}

export async function fetchReceipts(): Promise<ReceiptListItem[]> {
  const res = await fetch("/api/receipts")
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(
      `GET /api/receipts failed (${res.status}): ${text || res.statusText}`
    )
  }
  const body = (await res.json()) as ReceiptsListResponse
  return body.receipts ?? []
}

// Uploads a single file. The backend field name is `receipt_image` to match the
// mobile client; the browser sets the multipart boundary automatically when we
// pass a FormData body and omit the content-type header here.
export async function uploadReceipt(file: File): Promise<UploadReceiptResponse> {
  const fd = new FormData()
  fd.append("receipt_image", file, file.name)
  const res = await fetch("/api/receipts/upload", {
    method: "POST",
    body: fd,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(
      `POST /api/receipts/upload failed (${res.status}): ${text || res.statusText}`
    )
  }
  return (await res.json()) as UploadReceiptResponse
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

export function receiptImage(r: ReceiptListItem): string | undefined {
  return (
    r.thumbnailUrl ||
    r.thumbnail_url ||
    r.imageUrl ||
    r.image_url ||
    undefined
  )
}
