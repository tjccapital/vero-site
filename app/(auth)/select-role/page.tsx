"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { VeroLogoFull } from "@/components/ui/vero-logo"
import { Building2, CreditCard, ArrowRight } from "lucide-react"

export default function SelectRolePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--muted)] p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <div className="mb-12 text-center">
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <VeroLogoFull height={32} className="text-[var(--foreground)]" />
          </Link>
          <h1 className="text-2xl font-bold mb-2">Welcome to Vero</h1>
          <p className="text-[var(--muted-foreground)]">
            Select your account type to continue
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Merchant Card */}
          <Card className="relative mx-auto w-full overflow-hidden pt-0">
            <div className="absolute inset-x-0 top-0 z-30 aspect-[16/7] bg-gradient-to-b from-black/50 to-transparent" />
            <div className="relative z-20 aspect-[16/7] w-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center">
              <Building2 className="h-16 w-16 text-white/80" />
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Merchant</Badge>
              </div>
              <CardTitle className="text-xl">Merchant Dashboard</CardTitle>
              <CardDescription>
                Connect your POS systems, track receipts, and manage payouts. Perfect for retailers, restaurants, and service businesses.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link
                href="/login"
                className="flex w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
              >
                Continue as Merchant
                <ArrowRight className="h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>

          {/* Card Issuer Card */}
          <Card className="relative mx-auto w-full overflow-hidden pt-0">
            <div className="absolute inset-x-0 top-0 z-30 aspect-[16/7] bg-gradient-to-b from-black/50 to-transparent" />
            <div className="relative z-20 aspect-[16/7] w-full bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center">
              <CreditCard className="h-16 w-16 text-white/80" />
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline">Card Issuer</Badge>
              </div>
              <CardTitle className="text-xl">Card Issuer Portal</CardTitle>
              <CardDescription>
                Integrate digital receipts into your banking app. Provide cardholders with instant, itemized receipt data.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link
                href="/contact"
                className="flex w-full items-center justify-center gap-2 rounded-md border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-medium hover:bg-[var(--muted)] transition-colors"
              >
                Contact Sales
                <ArrowRight className="h-4 w-4" />
              </Link>
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
