"use client"

import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { VeroLogoFull } from "@/components/ui/vero-logo"
import { ArrowRight } from "lucide-react"

export default function SelectRolePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--muted)] p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <div className="mb-12 text-center">
          <Link href="/" className="inline-flex items-center justify-center mb-6">
            <VeroLogoFull height={32} className="text-[var(--foreground)]" />
          </Link>
          <p className="text-[var(--muted-foreground)]">
            Select your account type to continue
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Card Issuer Card - Left */}
          <Card className="relative mx-auto w-full overflow-hidden pt-0">
            <div className="p-4 pb-0">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md border border-gray-200">
                <Image
                  src="/issuer-simple.png"
                  alt="Card Issuer Dashboard Preview"
                  fill
                  className="object-cover object-top"
                />
              </div>
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

          {/* Merchant Card - Right */}
          <Card className="relative mx-auto w-full overflow-hidden pt-0">
            <div className="p-4 pb-0">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md border border-gray-200">
                <Image
                  src="/merchant-simple.png"
                  alt="Merchant Dashboard Preview"
                  fill
                  className="object-cover object-top"
                />
              </div>
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
