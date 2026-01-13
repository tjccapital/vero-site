"use client";

import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 bg-primary-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
          Become a Pilot Partner
        </h2>
        <p className="text-lg text-primary-100 mb-10 leading-relaxed max-w-xl mx-auto">
          We're working with early partners to prove Vero in production. Shape the product as a founding partner.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-primary-900 bg-white hover:bg-primary-50 transition-colors group shadow-sm"
          >
            Join the Pilot
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="/demo"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white border border-white/30 hover:bg-white/10 transition-colors"
          >
            Try the Demo
          </a>
        </div>
      </div>
    </section>
  );
}
