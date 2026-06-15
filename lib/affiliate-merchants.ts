// API contract + fetchers for the affiliate merchants catalog. The browser
// calls the Next.js proxy routes under /api/affiliate/* (see
// app/api/affiliate/[[...path]]/route.ts), which attach the Auth0 bearer
// server-side and forward to the Vero backend.

export type MerchantStatus = "in_network" | "prospect" | "pending"

export type AffiliateMerchant = {
  id: string
  name: string
  /** Raw business_type slug (stable key for filtering/search). */
  category: string
  /** Humanized category for display, e.g. "Beauty & Barber Shops". */
  categoryLabel: string
  address: string
  city: string
  state: string
  zip: string
  posSystem: string
  status: MerchantStatus
  estimatedValue: number
  reward: number
  monthlyTransactions: number
  /** Our DO Spaces CDN logo URL; absent until re-hosted. */
  logoUrl?: string
  /** ISO date string, only set when status === "in_network". */
  signedUpAt?: string
  contactEmail?: string
  contactPhone?: string
  notes?: string
}

export type MerchantStatusCounts = {
  all: number
  in_network: number
  pending: number
  prospect: number
}

export type MerchantCatalogPage = {
  items: AffiliateMerchant[]
  total: number
  limit: number
  offset: number
  counts: MerchantStatusCounts
}

export type AffiliateDashboard = {
  inNetworkCount: number
  pendingCount: number
  prospectCount: number
  earnedRewards: number
  pendingRewards: number
  pipelineValue: number
}

export type ListMerchantsParams = {
  status?: MerchantStatus | "all"
  q?: string
  limit?: number
  offset?: number
}

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(path)
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`GET ${path} failed (${res.status}): ${text || res.statusText}`)
  }
  return (await res.json()) as T
}

export async function listMerchants(
  params: ListMerchantsParams = {}
): Promise<MerchantCatalogPage> {
  const sp = new URLSearchParams()
  if (params.status && params.status !== "all") sp.set("status", params.status)
  if (params.q) sp.set("q", params.q)
  if (params.limit != null) sp.set("limit", String(params.limit))
  if (params.offset != null) sp.set("offset", String(params.offset))
  const qs = sp.toString()
  return getJSON<MerchantCatalogPage>(
    `/api/affiliate/merchants${qs ? `?${qs}` : ""}`
  )
}

export async function getMerchant(id: string): Promise<AffiliateMerchant> {
  return getJSON<AffiliateMerchant>(
    `/api/affiliate/merchants/${encodeURIComponent(id)}`
  )
}

export async function getAffiliateDashboard(): Promise<AffiliateDashboard> {
  return getJSON<AffiliateDashboard>(`/api/affiliate/dashboard`)
}
