"use client"

import Link from "next/link"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { VeroLogoFull } from "@/components/ui/vero-logo"
import { ArrowRight, CreditCard, Store } from "lucide-react"

export default function SelectRolePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--muted)] p-6 md:p-10 -mt-16 md:mt-0">
      <div className="w-full max-w-4xl">
        <div className="mb-8 md:mb-12 text-center">
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <VeroLogoFull height={32} className="text-[var(--foreground)]" />
          </Link>
          <p className="text-[var(--muted-foreground)]">
            Select your account type to continue
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Card Issuer Card - Left */}
          <Card className="relative mx-auto w-full">
            <CardHeader className="pt-6">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--muted)]">
                <CreditCard className="h-6 w-6 text-[var(--primary)]" />
              </div>
              <CardTitle className="text-lg">Card Issuer Portal</CardTitle>
              <CardDescription>
                Integrate digital receipts into your banking app. Provide cardholders with instant, itemized receipt data.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link
                href="/contact"
                className="flex w-full items-center justify-center gap-2 rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-medium hover:bg-[var(--muted)] transition-colors"
              >
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>

          {/* Merchant Card - Right */}
          <Card className="relative mx-auto w-full">
            <CardHeader className="pt-6">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--muted)]">
                <Store className="h-6 w-6 text-[var(--primary)]" />
              </div>
              <CardTitle className="text-lg">Merchant Dashboard</CardTitle>
              <CardDescription>
                Connect your POS systems, track receipts, and manage payouts. Perfect for retailers, restaurants, and service businesses.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <a
                href="/auth/login?returnTo=/dashboard"
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
              >
                Continue as Merchant
                <ArrowRight className="h-4 w-4" />
              </a>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-[var(--muted-foreground)]">
            Not sure which option is right for you?{" "}
            <Link href="/contact" className="text-[var(--primary)] hover:underline">
              Talk to our team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
