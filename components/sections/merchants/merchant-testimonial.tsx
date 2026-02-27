"use client";

import { Quote } from "lucide-react";

export function MerchantTestimonial() {
  return (
    <section className="py-12 sm:py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-gray-200 p-8 sm:p-12 text-center">
          <Quote className="w-8 h-8 text-primary-200 mx-auto mb-6" />
          <blockquote className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-6 italic">
            &ldquo;Since joining the Vero network, our chargebacks dropped by
            35% and customers love seeing their receipts in their banking app.
            Integration took less than an hour.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-gray-900 text-white flex items-center justify-center font-bold text-sm">
              JM
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-gray-900">
                James Mitchell
              </div>
              <div className="text-xs text-gray-500">
                Owner, Downtown Coffee Co.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
