"use client"

import { useCallback, useEffect, useState } from "react"
import { Landmark, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { PlaidLinkButton } from "@/components/plaid-link-button"
import { createLinkToken, exchangePublicToken } from "@/lib/plaid"
import { syncTransactions } from "@/lib/transactions"

interface PlaidLinkModalProps {
  open: boolean
  onClose: () => void
  // Called after a successful exchange, before the modal closes. Pages use
  // this to refresh their account/transaction lists or to redirect.
  onLinked?: () => Promise<void> | void
}

// Each /consumer page used to inline the Plaid Link modal — same header,
// same loading button, same security note, with slightly different page-
// specific extras above the call-to-action. We've standardised on a single
// minimal layout so the flow is identical regardless of where the user
// triggered it from.
export function PlaidLinkModal({
  open,
  onClose,
  onLinked,
}: PlaidLinkModalProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [linkTokenError, setLinkTokenError] = useState<string | null>(null)
  const [exchanging, setExchanging] = useState(false)
  // True while Plaid Link is on screen — we hide our own chrome so the
  // user only sees one modal at a time. Plaid renders into a portal on
  // <body>, so hiding ours visually doesn't affect theirs.
  const [plaidVisible, setPlaidVisible] = useState(false)

  // Tokens are short-lived (~30 min); fetch lazily once the modal opens
  // and drop them on close so the next open gets a fresh one.
  useEffect(() => {
    if (!open) return
    if (linkToken) return
    let cancelled = false
    setLinkTokenError(null)
    createLinkToken()
      .then((res) => {
        if (cancelled) return
        setLinkToken(res.link_token)
      })
      .catch((err) => {
        console.error("[Plaid] Failed to create link token:", err)
        if (cancelled) return
        setLinkTokenError("Couldn't start Plaid Link. Please try again.")
      })
    return () => {
      cancelled = true
    }
  }, [open, linkToken])

  const close = useCallback(() => {
    setLinkToken(null)
    setLinkTokenError(null)
    setPlaidVisible(false)
    onClose()
  }, [onClose])

  if (!open) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        // Keep the subtree mounted (PlaidLinkButton owns the active link
        // handler — unmounting it would tear down Plaid's modal) but hide
        // our chrome so Plaid stands alone.
        plaidVisible && "invisible pointer-events-none"
      )}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={close}
      />
      <div className="relative w-full max-w-md mx-4 rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/10">
              <Landmark className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <div>
              <h2 className="font-semibold">Link a Bank Account</h2>
              <p className="text-xs text-[var(--muted-foreground)]">Securely connect via Plaid</p>
            </div>
          </div>
          <button
            onClick={close}
            className="rounded-md p-1 hover:bg-[var(--muted)] transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-[var(--muted-foreground)]" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-[var(--muted-foreground)]">
            Connect your bank account or credit card to automatically receive
            digital receipts for your transactions.
          </p>

          {linkTokenError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {linkTokenError}
            </div>
          ) : null}

          {linkToken ? (
            <PlaidLinkButton
              linkToken={linkToken}
              disabled={exchanging}
              onSuccess={async (publicToken, metadata) => {
                setExchanging(true)
                try {
                  await exchangePublicToken(publicToken, {
                    institution: metadata?.institution
                      ? {
                          id: metadata.institution.institution_id,
                          name: metadata.institution.name,
                        }
                      : null,
                    accounts: metadata?.accounts?.map((a) => ({
                      id: a.id,
                      name: a.name,
                      mask: a.mask ?? undefined,
                    })),
                  })
                  // Pull the new item's transactions into vero before
                  // handing off to the page-specific onLinked refresh.
                  // Plaid's initial sync can return an empty batch
                  // (transactions take ~30s to land); we don't surface
                  // that as an error — webhooks and later loads will
                  // catch up.
                  try {
                    await syncTransactions()
                  } catch (syncErr) {
                    console.warn(
                      "[Plaid] Initial transaction sync failed:",
                      syncErr
                    )
                  }
                  if (onLinked) await onLinked()
                  close()
                } catch (err) {
                  console.error("[Plaid] Exchange failed:", err)
                  setLinkTokenError(
                    "We couldn't finish linking your account. Please try again."
                  )
                } finally {
                  setExchanging(false)
                }
              }}
              onExit={(err) => {
                // Plaid was dismissed without success — bring our chrome
                // back so the user can see the page (or retry).
                setPlaidVisible(false)
                if (err) {
                  console.warn("[Plaid] Link exited with error:", err)
                }
              }}
              onEvent={(eventName) => {
                if (eventName === "OPEN") setPlaidVisible(true)
                else if (eventName === "EXIT") setPlaidVisible(false)
              }}
            />
          ) : (
            <button
              type="button"
              disabled
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--foreground)] px-4 py-3 text-sm font-medium text-white opacity-60 cursor-not-allowed"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Preparing Plaid...
            </button>
          )}

          <div className="flex items-start gap-2 rounded-lg bg-[var(--muted)]/50 p-3">
            <Landmark className="h-4 w-4 text-[var(--muted-foreground)] mt-0.5 flex-shrink-0" />
            <p className="text-xs text-[var(--muted-foreground)]">
              Your credentials are encrypted and securely transmitted directly
              to your bank through Plaid. Vero never sees or stores your login
              information.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
