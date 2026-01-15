import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { ProductHero } from "@/components/sections/product-hero";
import { Features } from "@/components/sections/features";
import { Metadata } from "next";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Product - Digital Receipt Platform",
  description:
    "Everything you need to deliver digital receipts. Free for merchants, beta for card issuers. Reduce friendly fraud by 40% with secure, portable receipts.",
  openGraph: {
    title: "Vero Product - Digital Receipt Platform",
    description:
      "Everything you need to deliver digital receipts. Free for merchants, beta for card issuers.",
    type: "website",
  },
};

export default function ProductPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero with Grid Background */}
        <ProductHero />

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
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-primary-900 bg-white rounded-lg hover:bg-primary-50 transition-colors"
              >
                Request beta access
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
              <a
                href="https://vero-80b6ce5c.mintlify.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
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
