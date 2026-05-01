"use client"

import { useEffect } from "react"
import { usePlaidLink, type PlaidLinkOnSuccess, type PlaidLinkOnExit } from "react-plaid-link"
import { ExternalLink, Plus } from "lucide-react"

interface PlaidLinkButtonProps {
  linkToken: string
  onSuccess: PlaidLinkOnSuccess
  onExit?: PlaidLinkOnExit
  autoOpen?: boolean
  disabled?: boolean
  className?: string
}

// Mounts react-plaid-link's hook once we have a link_token from the backend.
// Kept in its own component because usePlaidLink takes the token at hook
// construction time — we only want it to run once the token has been fetched.
export function PlaidLinkButton({
  linkToken,
  onSuccess,
  onExit,
  autoOpen = false,
  disabled = false,
  className,
}: PlaidLinkButtonProps) {
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onExit,
  })

  useEffect(() => {
    if (autoOpen && ready) {
      open()
    }
  }, [autoOpen, ready, open])

  return (
    <button
      type="button"
      onClick={() => open()}
      disabled={disabled || !ready}
      className={
        className ??
        "flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--foreground)] px-4 py-3 text-sm font-medium text-white hover:bg-[var(--foreground)]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      }
    >
      <Plus className="h-4 w-4" />
      Continue with Plaid
      <ExternalLink className="h-3.5 w-3.5 ml-1" />
    </button>
  )
}
