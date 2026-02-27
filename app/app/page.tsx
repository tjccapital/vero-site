import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Features } from "@/components/sections/features";
import { Metadata } from "next";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
/* eslint-disable @next/next/no-img-element */

export const metadata: Metadata = {
  title: "Vero App - Your Receipts, Right in Your Pocket",
  description:
    "Download the Vero app and see exactly what you bought — itemized receipts delivered automatically every time you tap your card.",
  openGraph: {
    title: "Vero App - Your Receipts, Right in Your Pocket",
    description:
      "Download the Vero app and see exactly what you bought — itemized receipts delivered automatically every time you tap your card.",
    type: "website",
  },
};

export default function AppPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="relative flex w-full items-center bg-white overflow-hidden">
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left - Text Content */}
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1] mb-6">
                  Your receipts,
                  <br />
                  right in your
                  <br />
                  pocket.
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-lg">
                  Download the Vero app and see exactly what you bought —
                  itemized receipts delivered automatically every time you tap
                  your card. No more cryptic bank statement codes.
                </p>
                <a
                  href="https://apps.apple.com/app/vero-receipts/id6504488613"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83"
                    alt="Download on the App Store"
                    width={200}
                    height={67}
                    className="hover:opacity-80 transition-opacity"
                  />
                </a>
              </div>

              {/* Right - Phone Image */}
              <div className="flex justify-center lg:justify-end">
                <Image
                  src="/vero-phones-v4.png"
                  alt="Vero app showing itemized digital receipts on phone"
                  width={580}
                  height={580}
                  className="w-full max-w-[500px] h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <Features />

        {/* CTA */}
        <section className="py-20 bg-primary-900">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to reduce friendly fraud?
            </h2>
            <p className="text-lg text-primary-100 mb-10">
              Card issuers: Join our free beta. Merchants: Get started in 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-primary-900 bg-white hover:bg-primary-50 transition-colors"
              >
                Request beta access
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
              <a
                href="https://docs.seevero.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white border border-white/30 hover:bg-white/10 transition-colors"
              >
                View documentation
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
