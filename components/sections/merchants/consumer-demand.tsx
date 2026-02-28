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
    <section className="py-12 sm:py-20 bg-white">
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
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden w-full max-w-md">
              {/* Chart header */}
              <div className="px-6 pt-5 pb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Consumer Interest in Digital Receipts</span>
                <span className="text-xs text-gray-400">2020–2025</span>
              </div>

              {/* Bar chart area */}
              <div className="px-6 pb-6">
                <div className="flex items-end gap-2 h-40">
                  {[
                    { h: 30, label: "'20" },
                    { h: 42, label: "" },
                    { h: 48, label: "'21" },
                    { h: 55, label: "" },
                    { h: 62, label: "'22" },
                    { h: 68, label: "" },
                    { h: 72, label: "'23" },
                    { h: 78, label: "" },
                    { h: 82, label: "'24" },
                    { h: 88, label: "" },
                    { h: 93, label: "'25" },
                    { h: 98, label: "" },
                  ].map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-primary-600 rounded-t-sm"
                        style={{ height: `${bar.h}%` }}
                      />
                      {bar.label && (
                        <span className="text-[10px] text-gray-400">{bar.label}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom stat bar */}
              <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">89% want digital receipts</span>
                </div>
                <span className="text-xs text-green-600 font-medium">+12% YoY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
