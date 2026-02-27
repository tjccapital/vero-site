"use client";

import { CheckCircle2 } from "lucide-react";

const stats = [
  {
    value: "73%",
    description: "of cardholders have disputed a charge they didn't recognize",
  },
  {
    value: "89%",
    description:
      "say itemized receipts in their banking app would be useful",
  },
];

export function ConsumerDemand() {
  return (
    <section className="py-12 sm:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left side - Text content */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 mb-3">
              Consumer Demand
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-4 leading-tight">
              Your customers are already asking for this.
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8">
              People have wanted itemized digital receipts for years.
              They&apos;re tired of seeing &ldquo;MSTR STR CFFE 4821&rdquo; on
              their bank statement. The Vero app gives them clarity — and
              they&apos;re actively looking for merchants on the network.
            </p>

            {/* Stat cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.value}
                  className="border border-gray-200 p-5"
                >
                  <div className="text-2xl sm:text-3xl font-bold text-primary-600 mb-2">
                    {stat.value}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden w-full max-w-md">
              {/* Top bar chart area */}
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-end gap-1.5 h-12 mb-1">
                  {[40, 65, 50, 80, 55, 70, 45, 60, 75, 50, 85, 65].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-primary-200 rounded-t-sm"
                        style={{ height: `${h}%` }}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Illustration area */}
              <div className="relative bg-primary-900 px-6 pt-8 pb-0 min-h-[160px] flex items-end justify-center">
                {/* Receipt delivered badge */}
                <div className="absolute top-4 right-6 bg-white px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary-600" />
                  <span className="text-xs font-medium text-gray-900">
                    Receipt delivered
                  </span>
                </div>

                {/* People silhouettes */}
                <div className="flex items-end gap-3">
                  <div className="w-12 h-20 bg-primary-400 rounded-t-full" />
                  <div className="w-14 h-24 bg-primary-300 rounded-t-full" />
                  <div className="w-12 h-20 bg-primary-400 rounded-t-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
