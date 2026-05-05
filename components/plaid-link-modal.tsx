"use client"

import { useCallback, useEffect, useState, type ReactNode } from "react"
import { Landmark, Loader2, X } from "lucide-react"
import { PlaidLinkButton } from "@/components/plaid-link-button"
import { createLinkToken, exchangePublicToken } from "@/lib/plaid"

interface PlaidLinkModalProps {
  open: boolean
  onClose: () => void
  // Called after a successful exchange, before the modal closes. Pages use
  // this to refresh their account/transaction lists or to redirect.
  onLinked?: () => Promise<void> | void
  // Page-specific copy and extras (intro paragraph, supported-institutions
  // grid, connected-accounts list, etc.) rendered above the Plaid button.
  children?: ReactNode
}

// Each /consumer page used to inline the Plaid Link modal — same header,
// same loading button, same security note, slightly different page-specific
// extras above the call-to-action. Centralising the chrome here keeps the
// flow consistent and means the link_token lifecycle (lazy fetch on open,
// reset on close) is implemented once.
export function PlaidLinkModal({
  open,
  onClose,
  onLinked,
  children,
}: PlaidLinkModalProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [linkTokenError, setLinkTokenError] = useState<string | null>(null)
  const [exchanging, setExchanging] = useState(false)

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
    onClose()
  }, [onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
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
          {children}

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
                if (err) {
                  console.warn("[Plaid] Link exited with error:", err)
                }
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
