"use client"

import { useCallback, useEffect, useState } from "react"
import {
  Landmark,
  Plus,
  CreditCard,
  CheckCircle2,
  Shield,
  Loader2,
  Trash2,
  AlertTriangle,
} from "lucide-react"
import { PlaidLinkModal } from "@/components/plaid-link-modal"
import {
  deletePlaidAccount,
  fetchPlaidAccounts,
  type PlaidAccount,
} from "@/lib/plaid"

export default function ConsumerAccountsPage() {
  const [showPlaidModal, setShowPlaidModal] = useState(false)
  const [accounts, setAccounts] = useState<PlaidAccount[]>([])
  const [accountsLoading, setAccountsLoading] = useState(true)
  const [accountsError, setAccountsError] = useState<string | null>(null)
  // Account pending removal (drives the confirmation dialog), the in-flight
  // delete state, and any error surfaced from the delete call.
  const [confirmAccount, setConfirmAccount] = useState<PlaidAccount | null>(null)
  const [removing, setRemoving] = useState(false)
  const [removeError, setRemoveError] = useState<string | null>(null)

  const loadAccounts = useCallback(async () => {
    setAccountsLoading(true)
    setAccountsError(null)
    try {
      const res = await fetchPlaidAccounts()
      setAccounts(res.accounts ?? [])
    } catch (err) {
      console.error("[Plaid] Failed to load accounts:", err)
      setAccountsError("Couldn't load your connected accounts. Try refreshing.")
    } finally {
      setAccountsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAccounts()
  }, [loadAccounts])

  const handleRemoveAccount = useCallback(async () => {
    if (!confirmAccount) return
    setRemoving(true)
    setRemoveError(null)
    try {
      await deletePlaidAccount(confirmAccount.id)
      // Drop it from the list immediately, then reconcile with the server so
      // sibling accounts on the same Plaid item reflect the real state.
      setAccounts((prev) => prev.filter((a) => a.id !== confirmAccount.id))
      setConfirmAccount(null)
      void loadAccounts()
    } catch (err) {
      console.error("[Plaid] Failed to remove account:", err)
      setRemoveError("Couldn't remove this account. Please try again.")
    } finally {
      setRemoving(false)
    }
  }, [confirmAccount, loadAccounts])

  return (
    <>
      <div className="mx-auto max-w-3xl space-y-6 w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Connected Accounts</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Manage your linked bank accounts and cards
            </p>
          </div>
          <button
            onClick={() => setShowPlaidModal(true)}
            className="flex items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary)]/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Account
          </button>
        </div>

        {/* Summary Card */}
        <div className="rounded-lg border border-[var(--border)] p-4 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)]/10">
              <Landmark className="h-6 w-6 text-[var(--primary)]" />
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold">{accounts.length}</p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Account{accounts.length !== 1 ? 's' : ''} connected
              </p>
            </div>
          </div>
        </div>

        {/* Accounts List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Accounts</h2>

          {accountsLoading ? (
            <div className="rounded-lg border border-dashed border-[var(--border)] p-8 text-center">
              <Loader2 className="h-6 w-6 mx-auto animate-spin text-[var(--muted-foreground)]" />
              <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                Loading your accounts...
              </p>
            </div>
          ) : accountsError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {accountsError}
            </div>
          ) : accounts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[var(--border)] p-8 text-center">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-[var(--muted)]">
                <Landmark className="h-6 w-6 text-[var(--muted-foreground)]" />
              </div>
              <h3 className="mt-4 font-medium">No accounts connected</h3>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Connect your bank accounts or cards to start receiving digital receipts
              </p>
              <button
                onClick={() => setShowPlaidModal(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--primary)]/90 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Connect Account
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {accounts.map((account) => {
                const institution =
                  account.institutionName || account.institution_name || account.institution
                const subtitle = [institution, account.subtype || account.type]
                  .filter(Boolean)
                  .join(" · ")
                return (
                  <div
                    key={account.id}
                    className="rounded-lg border border-[var(--border)] p-4 sm:p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--muted)]">
                        <CreditCard className="h-6 w-6 text-[var(--muted-foreground)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold">{account.name}</h3>
                            <p className="text-sm text-[var(--muted-foreground)]">
                              {subtitle}
                              {account.mask ? ` ···· ${account.mask}` : null}
                            </p>
                          </div>
                          <div className="flex flex-shrink-0 items-center gap-2">
                            <div className="flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                              <CheckCircle2 className="h-3 w-3" />
                              Active
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setRemoveError(null)
                                setConfirmAccount(account)
                              }}
                              aria-label={`Remove ${account.name}`}
                              className="rounded-md p-1.5 text-[var(--muted-foreground)] hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Security Note */}
        <div className="rounded-lg bg-[var(--muted)]/50 p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-[var(--primary)] mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-sm">Bank-level security</h3>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                Your credentials are encrypted and securely transmitted directly to your bank through Plaid. Vero never sees or stores your login information. We use the same encryption technology that banks use to protect your data.
              </p>
            </div>
          </div>
        </div>
      </div>

      <PlaidLinkModal
        open={showPlaidModal}
        onClose={() => setShowPlaidModal(false)}
        onLinked={loadAccounts}
      />

      {confirmAccount ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Remove account"
          onClick={() => {
            if (!removing) setConfirmAccount(null)
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold">Remove account?</h3>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  This disconnects{" "}
                  <span className="font-medium text-[var(--foreground)]">
                    {confirmAccount.name}
                    {confirmAccount.mask ? ` ···· ${confirmAccount.mask}` : ""}
                  </span>{" "}
                  from Vero. We&apos;ll stop receiving new transactions and
                  receipts for it. You can reconnect it anytime.
                </p>
              </div>
            </div>

            {removeError ? (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {removeError}
              </div>
            ) : null}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmAccount(null)}
                disabled={removing}
                className="rounded-md border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRemoveAccount}
                disabled={removing}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {removing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Removing…
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
