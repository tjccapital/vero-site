"use client"

import { useCallback, useEffect, useState } from "react"
import {
  Landmark,
  Plus,
  CreditCard,
  CheckCircle2,
  Shield,
  Loader2,
} from "lucide-react"
import { PlaidLinkModal } from "@/components/plaid-link-modal"
import { fetchPlaidAccounts, type PlaidAccount } from "@/lib/plaid"

export default function ConsumerAccountsPage() {
  const [showPlaidModal, setShowPlaidModal] = useState(false)
  const [accounts, setAccounts] = useState<PlaidAccount[]>([])
  const [accountsLoading, setAccountsLoading] = useState(true)
  const [accountsError, setAccountsError] = useState<string | null>(null)

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
                          <div className="flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                            <CheckCircle2 className="h-3 w-3" />
                            Active
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
      >
        <p className="text-sm text-[var(--muted-foreground)]">
          Connect your bank account or credit card to automatically receive
          digital receipts for your transactions.
        </p>

        <div className="grid grid-cols-3 gap-2">
          {['Chase', 'Bank of America', 'Wells Fargo', 'Citi', 'Capital One', 'US Bank'].map((bank) => (
            <div
              key={bank}
              className="flex items-center justify-center rounded-lg border border-[var(--border)] p-3 text-xs font-medium text-[var(--muted-foreground)]"
            >
              {bank}
            </div>
          ))}
        </div>
        <p className="text-xs text-center text-[var(--muted-foreground)]">
          + 10,000 more financial institutions
        </p>
      </PlaidLinkModal>
    </>
  )
}
