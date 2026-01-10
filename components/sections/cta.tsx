"use client";

import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-24 bg-gray-50 border-t border-gray-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Get started with Vero
        </h2>
        <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
          Join the movement towards portable, secure, and interoperable digital receipts. Implement the Digital Receipt Protocol today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gray-900 border border-gray-900 rounded-md hover:bg-gray-800 transition-colors group"
          >
            Read documentation
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
