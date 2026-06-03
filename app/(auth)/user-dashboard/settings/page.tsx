"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@auth0/nextjs-auth0/client"
import {
  LogOut,
  Mail,
  CheckCircle2,
  Loader2,
  AlertCircle,
  RefreshCw,
  Unlink,
  ShieldCheck,
  Clock,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime()
  if (diffMs < 0) return "just now"
  const seconds = Math.floor(diffMs / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`
  const years = Math.floor(days / 365)
  return `${years} year${years === 1 ? "" : "s"} ago`
}

export default function ConsumerSettingsPage() {
  const { user } = useUser()
  const router = useRouter()

  // Gmail integration state — mirrors the vero-mobile EmailContext shape so the
  // backend can return the same payload to web and mobile clients.
  type EmailAccount = {
    id?: string
    email?: string | null
    provider?: string | null
    last_scan_at?: string | null
    status?: string | null
  }
  type EmailStatus = {
    connected: boolean
    reauth_required?: boolean
    account?: EmailAccount | null
    email_address?: string | null
    last_scanned_at?: string | null
  }
  const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null)
  const [emailStatusLoading, setEmailStatusLoading] = useState(true)
  const [emailActionLoading, setEmailActionLoading] = useState<
    null | "connect" | "disconnect" | "scan" | "force-scan"
  >(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [isSyncingAfterConnect, setIsSyncingAfterConnect] = useState(false)

  const emailAddress = emailStatus?.account?.email ?? emailStatus?.email_address ?? null
  const lastScanAt = emailStatus?.account?.last_scan_at ?? emailStatus?.last_scanned_at ?? null
  const accountStatus = emailStatus?.account?.status ?? null
  const reauthRequired = !!emailStatus?.reauth_required

  const lastScanDate = lastScanAt ? new Date(lastScanAt) : null
  const lastScanAbsolute = lastScanDate
    ? lastScanDate.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : null
  const lastScanRelative = lastScanDate ? formatRelativeTime(lastScanDate) : null

  const apiFetch = useCallback(
    (path: string, init?: RequestInit) =>
      fetch(path, { credentials: "include", ...init }),
    []
  )

  const errorFromResponse = async (
    res: Response,
    fallback: string
  ): Promise<string> => {
    try {
      const text = await res.text()
      if (!text) return `${fallback} (HTTP ${res.status})`
      try {
        const parsed = JSON.parse(text)
        const msg =
          parsed?.error_description || parsed?.error || parsed?.message || parsed?.detail
        if (msg) return `${fallback} (HTTP ${res.status}): ${msg}`
      } catch {
        // Body wasn't JSON.
      }
      return `${fallback} (HTTP ${res.status}): ${text.slice(0, 300)}`
    } catch {
      return `${fallback} (HTTP ${res.status})`
    }
  }

  const fetchEmailStatus = useCallback(async () => {
    try {
      setEmailStatusLoading(true)
      const res = await apiFetch("/api/email/status")
      if (!res.ok) throw new Error(await errorFromResponse(res, "Failed to load email status"))
      const data = await res.json()
      setEmailStatus(data)
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Failed to load email status")
    } finally {
      setEmailStatusLoading(false)
    }
  }, [apiFetch])

  const handleConnectGmail = async () => {
    setEmailError(null)
    setEmailActionLoading("connect")
    try {
      const returnUrl = `${window.location.origin}/user-dashboard/settings?gmail=connected`
      const res = await apiFetch(
        `/api/email/connect/google?return_url=${encodeURIComponent(returnUrl)}`,
        { method: "POST" }
      )
      if (!res.ok) throw new Error(await errorFromResponse(res, "Failed to start Gmail connection"))
      const data = await res.json()
      if (!data.auth_url) throw new Error("No authorization URL returned")
      window.location.href = data.auth_url
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Failed to connect Gmail")
      setEmailActionLoading(null)
    }
  }

  const handleDisconnectGmail = async () => {
    if (!confirm("Disconnect your Gmail account? Vero will stop scanning your inbox for receipts.")) return
    setEmailError(null)
    setEmailActionLoading("disconnect")
    try {
      const res = await apiFetch("/api/email/disconnect", { method: "DELETE" })
      if (!res.ok) throw new Error(await errorFromResponse(res, "Failed to disconnect Gmail"))
      await fetchEmailStatus()
    } catch (err) {
      setEmailError(err instanceof Error ? err.message : "Failed to disconnect Gmail")
    } finally {
      setEmailActionLoading(null)
    }
  }

  const runScan = useCallback(
    async (force: boolean) => {
      setEmailError(null)
      setEmailActionLoading(force ? "force-scan" : "scan")
      try {
        const path = force ? "/api/email/scan/force" : "/api/email/scan"
        const res = await apiFetch(path, { method: "POST" })
        if (!res.ok) throw new Error(await errorFromResponse(res, "Failed to scan inbox"))
        await fetchEmailStatus()
      } catch (err) {
        setEmailError(err instanceof Error ? err.message : "Failed to scan inbox")
      } finally {
        setEmailActionLoading(null)
      }
    },
    [apiFetch, fetchEmailStatus]
  )

  useEffect(() => {
    fetchEmailStatus()
  }, [fetchEmailStatus])

  // After the OAuth round-trip the backend redirects to
  // /user-dashboard/settings?gmail=connected (or ?gmail=error). Mirrors mobile's
  // post-connect behaviour: refresh status, then run the initial scan in the
  // background while showing "Syncing receipts from inbox…".
  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    const result = params.get("gmail")
    if (!result) return

    router.replace("/user-dashboard/settings")

    if (result === "connected") {
      setIsSyncingAfterConnect(true)
      ;(async () => {
        try {
          await fetchEmailStatus()
          await apiFetch("/api/email/scan", { method: "POST" })
          await fetchEmailStatus()
        } catch (err) {
          console.error("[Email] Auto-scan after connect error:", err)
        } finally {
          setIsSyncingAfterConnect(false)
        }
      })()
    } else if (result === "error") {
      setEmailError(params.get("reason") || "Gmail connection failed. Please try again.")
    }
  }, [router, apiFetch, fetchEmailStatus])

  const scanInProgress =
    isSyncingAfterConnect ||
    emailActionLoading === "scan" ||
    emailActionLoading === "force-scan"

  return (
    <div className="mx-auto max-w-2xl space-y-6 w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Manage your account and connected services.
        </p>
      </div>

      {/* Profile (read-only) */}
      <section className="rounded-lg border border-[var(--border)] p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 flex-shrink-0">
            <AvatarImage src={user?.picture || undefined} alt={user?.name || "User"} />
            <AvatarFallback className="bg-[var(--muted)] text-lg">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate">{user?.name || "User"}</p>
            <p className="text-sm text-[var(--muted-foreground)] truncate">{user?.email}</p>
          </div>
          <a
            href="/auth/logout"
            aria-label="Sign out"
            className="inline-flex flex-shrink-0 items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign out</span>
          </a>
        </div>
      </section>

      {/* Email Integration — primary surface for the Google OAuth flow.
          Designed to be self-explanatory for Google's app-verification
          reviewers: explicit scope list, Limited Use disclosure, and
          links to Privacy Policy / Terms. */}
      <section className="rounded-lg border border-[var(--border)]">
        <div className="border-b border-[var(--border)] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-[var(--muted-foreground)]" />
            <h2 className="font-semibold">Gmail</h2>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          <p className="text-sm text-[var(--muted-foreground)]">
            Connect your Gmail account so Vero can find purchase receipts,
            order confirmations, and invoices and attach them to your
            transactions automatically.
          </p>

          {emailStatusLoading ? (
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <Loader2 className="h-4 w-4 animate-spin" />
              Checking connection…
            </div>
          ) : emailStatus?.connected && reauthRequired ? (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900">Gmail access expired</p>
                  <p className="mt-1 text-xs text-amber-800">
                    Your Google authorization was revoked. Reconnect to resume receipt scanning.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={handleConnectGmail}
                      disabled={emailActionLoading !== null}
                      className="inline-flex items-center gap-2 rounded-md bg-amber-600 px-3 py-2 text-xs font-medium text-white hover:bg-amber-700 transition-colors disabled:opacity-60"
                    >
                      {emailActionLoading === "connect" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      Reconnect Gmail
                    </button>
                    <button
                      onClick={handleDisconnectGmail}
                      disabled={emailActionLoading !== null}
                      className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-xs font-medium hover:bg-[var(--muted)] transition-colors disabled:opacity-60"
                    >
                      {emailActionLoading === "disconnect" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Unlink className="h-4 w-4" />
                      )}
                      Disconnect
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : emailStatus?.connected ? (
            <div className="rounded-md border border-[var(--border)] bg-[var(--muted)]/40 p-4 space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {emailAddress || "Gmail account connected"}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)]">Connected</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => runScan(false)}
                    disabled={emailActionLoading !== null || isSyncingAfterConnect}
                    className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors disabled:opacity-60"
                  >
                    {scanInProgress ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    Scan now
                  </button>
                  <button
                    onClick={handleDisconnectGmail}
                    disabled={emailActionLoading !== null || isSyncingAfterConnect}
                    className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-60"
                  >
                    {emailActionLoading === "disconnect" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Unlink className="h-4 w-4" />
                    )}
                    Disconnect
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-3 py-2 text-xs">
                {scanInProgress ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--primary)] flex-shrink-0" />
                ) : (
                  <Clock className="h-3.5 w-3.5 text-[var(--muted-foreground)] flex-shrink-0" />
                )}
                <span className="font-medium text-[var(--foreground)]">Last scan:</span>
                {scanInProgress ? (
                  <span className="text-[var(--muted-foreground)]">Scanning inbox…</span>
                ) : lastScanRelative && lastScanAbsolute ? (
                  <span
                    className="text-[var(--muted-foreground)]"
                    title={lastScanAbsolute}
                  >
                    {lastScanRelative}
                    <span className="hidden sm:inline"> · {lastScanAbsolute}</span>
                  </span>
                ) : (
                  <span className="text-[var(--muted-foreground)]">Never scanned</span>
                )}
                {accountStatus && accountStatus !== "active" && (
                  <span className="ml-auto rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-700">
                    {accountStatus}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={handleConnectGmail}
              disabled={emailActionLoading !== null}
              className="inline-flex items-center gap-2 rounded-md border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium hover:bg-[var(--muted)] transition-colors disabled:opacity-60"
            >
              {emailActionLoading === "connect" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.12c-.22-.66-.35-1.36-.35-2.12s.13-1.46.35-2.12V7.04H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.96l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.04l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
                </svg>
              )}
              Connect Gmail
            </button>
          )}

          {emailError && (
            <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{emailError}</span>
            </div>
          )}

          {/* Permissions disclosure — required for Google OAuth verification.
              Lists every Google API scope the app actually requests. */}
          <div className="rounded-md border border-[var(--border)] p-4 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[var(--muted-foreground)]" />
              <p className="text-sm font-medium">What Vero accesses</p>
            </div>
            <ul className="space-y-2 text-xs text-[var(--muted-foreground)]">
              <li>
                <span className="font-medium text-[var(--foreground)]">Read-only Gmail access</span>
                <span className="block">
                  Used solely to identify receipts, order confirmations, and invoices from
                  merchants and link them to your transactions. We never read or store
                  unrelated email.
                </span>
              </li>
              <li>
                <span className="font-medium text-[var(--foreground)]">Email address &amp; basic profile</span>
                <span className="block">
                  Used to identify your Vero account and label the connected Gmail inbox.
                </span>
              </li>
            </ul>
          </div>

          {/* Google API Services User Data Policy / Limited Use disclosure. */}
          <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
            Vero&apos;s use of information received from Google APIs adheres to the{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[var(--foreground)]"
            >
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements. Read our{" "}
            <Link href="/privacy" className="underline hover:text-[var(--foreground)]">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="underline hover:text-[var(--foreground)]">
              Terms of Service
            </Link>{" "}
            for details. You can disconnect at any time.
          </p>
        </div>
      </section>

    </div>
  )
}
