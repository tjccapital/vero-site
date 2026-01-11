"use client";

import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 bg-blue-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
          Ready to reduce friendly fraud?
        </h2>
        <p className="text-lg text-blue-100 mb-10 leading-relaxed max-w-xl mx-auto">
          Join our beta program and be among the first to deliver digital receipts.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-blue-900 bg-white rounded-lg hover:bg-blue-50 transition-colors group shadow-sm"
          >
            Request beta access
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
          >
            Read the docs
          </a>
        </div>
      </div>
    </section>
  );
}
