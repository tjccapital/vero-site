"use client";

import { ArrowRight } from "lucide-react";

export function MerchantCTA() {
  return (
    <section className="py-12 sm:py-20 bg-primary-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-3 sm:mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-base sm:text-lg text-primary-100 mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto">
          Join the Vero Merchant Network today and start delivering digital
          receipts to your customers. Free to integrate, and we pay you for
          every receipt.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-primary-900 bg-white hover:bg-primary-50 transition-colors group shadow-sm"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white border border-white/30 hover:bg-white/10 transition-colors"
          >
            Contact Sales
          </a>
        </div>
      </div>
    </section>
  );
}
