"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@auth0/nextjs-auth0/client"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { VeroLogoFull } from "@/components/ui/vero-logo"

export default function LoginPage() {
  const { user, isLoading } = useUser()
  const router = useRouter()

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--muted)] p-6 md:p-10">
        <div className="flex flex-col items-center gap-4">
          <VeroLogoFull height={32} className="text-[var(--foreground)]" />
          <p className="text-sm text-[var(--muted-foreground)]">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is logged in, show nothing while redirecting
  if (user) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--muted)] p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader className="text-center">
              <Link href="/" className="flex items-center justify-center mb-4">
                <VeroLogoFull height={32} className="text-[var(--foreground)]" />
              </Link>
              <CardTitle className="text-xl">Merchant Dashboard</CardTitle>
              <CardDescription>
                Sign in to manage your receipts and payouts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <a
                  href="/auth/login?returnTo=/dashboard"
                  className="w-full rounded-md bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity text-center"
                >
                  Sign in
                </a>
                <a
                  href="/auth/login?screen_hint=signup&returnTo=/dashboard"
                  className="w-full rounded-md border border-[var(--border)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors text-center"
                >
                  Create an account
                </a>
              </div>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-[var(--muted-foreground)]">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-[var(--primary)]">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-[var(--primary)]">
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  )
}
