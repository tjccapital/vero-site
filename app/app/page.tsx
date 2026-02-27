import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Metadata } from "next";
import Image from "next/image";
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
        <section className="relative flex min-h-[calc(100vh-4rem)] w-full items-center bg-white overflow-hidden">
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
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
      </main>
      <Footer />
    </>
  );
}
