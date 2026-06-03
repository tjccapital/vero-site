// Thin wrappers around the /api/plaid/* proxy routes (which forward to
// api.veroreceipts.com with an Auth0 bearer token).
//
// Endpoints documented at api.veroreceipts.com:
//   POST   /api/plaid/create_link_token
//   POST   /api/plaid/exchange_public_token
//   GET    /api/plaid/accounts
//   DELETE /api/plaid/accounts/:accountId

export interface PlaidLinkTokenResponse {
  link_token: string
  expiration?: string
}

export interface PlaidExchangeResponse {
  success?: boolean
  item_id?: string
}

export interface PlaidAccount {
  id: string
  name: string
  mask?: string
  type?: string
  subtype?: string
  institution?: string
  institutionName?: string
  // Backend may use either snake_case or camelCase; surface both for the UI.
  institution_name?: string
}

export interface PlaidAccountsResponse {
  accounts: PlaidAccount[]
}

interface PlaidExchangeMetadata {
  institution?: { id?: string; name?: string } | null
  accounts?: Array<{ id: string; name: string; mask?: string | null }>
}

async function postJson<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: body ? { "content-type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`POST ${url} failed (${res.status}): ${text || res.statusText}`)
  }
  return (await res.json()) as T
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`GET ${url} failed (${res.status}): ${text || res.statusText}`)
  }
  return (await res.json()) as T
}

export function createLinkToken(): Promise<PlaidLinkTokenResponse> {
  return postJson<PlaidLinkTokenResponse>("/api/plaid/create_link_token")
}

export function exchangePublicToken(
  publicToken: string,
  metadata: PlaidExchangeMetadata
): Promise<PlaidExchangeResponse> {
  return postJson<PlaidExchangeResponse>("/api/plaid/exchange_public_token", {
    public_token: publicToken,
    institution_id: metadata?.institution?.id,
    institution_name: metadata?.institution?.name,
    accounts: metadata?.accounts,
  })
}

export function fetchPlaidAccounts(): Promise<PlaidAccountsResponse> {
  return getJson<PlaidAccountsResponse>("/api/plaid/accounts")
}

export async function deletePlaidAccount(accountId: string): Promise<void> {
  const url = `/api/plaid/accounts/${encodeURIComponent(accountId)}`
  const res = await fetch(url, { method: "DELETE" })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(
      `DELETE ${url} failed (${res.status}): ${text || res.statusText}`
    )
  }
}
