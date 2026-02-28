import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { ApiSimulator } from "@/components/api-simulator";
import { Metadata } from "next";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "API Demo - Interactive Vero Simulator",
  description:
    "Experience Vero in action. Walk through the complete API flow for generating cryptographically secure digital receipts.",
  openGraph: {
    title: "Vero API Demo - Interactive Simulator",
    description:
      "Experience Vero in action with our interactive API simulator.",
    type: "website",
  },
};

export default function DemoPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 bg-white">
        {/* Hero Section */}
        <section className="pt-16 pb-8 md:pt-20 md:pb-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4 block">
              HOW IT WORKS
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-[1.15] mb-5">
              Make your receipts portable
            </h1>
            <p className="max-w-xl text-base md:text-lg text-gray-600 leading-relaxed">
              Implement the DRP specification to generate encrypted receipt objects, so that any compatible wallet or application can securely render and display purchase data.
            </p>
          </div>
        </section>

        {/* Simulator Section */}
        <section className="py-8 md:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <ApiSimulator />
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">1. Enable Digital Receipts</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  The card issuer generates a key pair and stores the private key in the consumer&apos;s secure enclave (iOS) or keychain (Android). The public key is registered with the protocol.
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">2. Create Payment & Encrypt Receipt</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  The merchant POS creates the payment and encrypts the receipt with the user&apos;s public key. Only the consumer&apos;s private key can decrypt it.
                </p>
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">3. View Receipt</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  The consumer&apos;s private key decrypts the receipt locally on their device. The private key never leaves the secure enclave.
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
                Join the Vero Merchant Network
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="https://docs.veroreceipts.com"
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
