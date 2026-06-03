// sessionStorage marker written by PlaidLinkModal.onSuccess after a successful
// public-token exchange. Consumed by /user-dashboard/transactions and the dashboard's
// recent-transactions widget to render a "Fetching from {bank}..." waiting
// state instead of the generic "No transactions yet" empty state, since Plaid
// fetches initial transactions asynchronously and they typically take 10-60s
// to land in our cache after Link.

const KEY = "vero.pendingFirstSync"
// Matches the realistic upper bound on Plaid's initial transactions fetch.
// After this window, fall back to the normal empty state — at that point the
// user is better served by a clear "still nothing" message than a perpetual
// spinner.
const TTL_MS = 5 * 60 * 1000

export interface PendingFirstSync {
  institutionName: string
  startedAt: number
}

// Reads and validates the marker. Returns null if missing, malformed, or
// expired. Expired markers are cleared as a side effect so the page falls
// back to the regular empty state on next render.
export function readPendingFirstSync(): PendingFirstSync | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<PendingFirstSync>
    if (
      typeof parsed.institutionName !== "string" ||
      typeof parsed.startedAt !== "number"
    ) {
      sessionStorage.removeItem(KEY)
      return null
    }
    if (Date.now() - parsed.startedAt > TTL_MS) {
      sessionStorage.removeItem(KEY)
      return null
    }
    return parsed as PendingFirstSync
  } catch {
    return null
  }
}

export function clearPendingFirstSync(): void {
  if (typeof window === "undefined") return
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}
