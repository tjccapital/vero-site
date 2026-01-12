import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { ApiSimulator } from "@/components/api-simulator";
import { Metadata } from "next";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "API Demo - Interactive DRP Simulator",
  description:
    "Experience the Digital Receipt Protocol in action. Walk through the complete API flow for generating cryptographically secure digital receipts.",
  openGraph: {
    title: "Vero API Demo - Interactive DRP Simulator",
    description:
      "Experience the Digital Receipt Protocol in action with our interactive API simulator.",
    type: "website",
  },
};

export default function DemoPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-primary-50 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium bg-primary-100 text-primary-900 rounded-full">
              Interactive Demo
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 leading-[1.15] mb-5">
              See DRP in Action
            </h1>
            <p className="max-w-2xl mx-auto text-base md:text-lg text-gray-500 leading-relaxed">
              Walk through the complete API flow for generating secure digital receipts.
              From key generation to receipt decryption, experience every step.
            </p>
          </div>
        </section>

        {/* Simulator Section */}
        <section className="py-8 md:py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <ApiSimulator />
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary-50 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-primary-900">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">End-to-End Encrypted</h3>
                <p className="text-sm text-gray-500">
                  Receipts are encrypted with the consumer&apos;s public key. Only they can decrypt and view the contents.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary-50 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-primary-900">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Delivery</h3>
                <p className="text-sm text-gray-500">
                  Receipts arrive in milliseconds. Customers see itemized details before leaving the store.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary-50 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-primary-900">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fraud Prevention</h3>
                <p className="text-sm text-gray-500">
                  Itemized receipts help customers recognize charges, reducing friendly fraud by up to 40%.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-primary-900">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
              Ready to integrate?
            </h2>
            <p className="text-base md:text-lg text-primary-100 mb-8 leading-relaxed max-w-xl mx-auto">
              Join our pilot program and start delivering digital receipts to your customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-primary-900 bg-white rounded-lg hover:bg-primary-50 transition-colors group shadow-sm"
              >
                Become a Pilot Partner
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="https://docs.digitalreceiptprotocol.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
              >
                View API Documentation
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
