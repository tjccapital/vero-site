"use client";

import { CreditCard, Receipt, Scale } from "lucide-react";

const costs = [
  {
    icon: CreditCard,
    title: "Card processing fees",
    rate: "2.5-3% per transaction",
    description:
      "These add up fast. Vero payouts can help offset a meaningful share of what you're paying per swipe.",
  },
  {
    icon: Receipt,
    title: "POS subscription fees",
    rate: "$60-$200 / month",
    description:
      "Your POS isn't free. Monthly Vero payouts can reduce how much of that comes out of your pocket.",
  },
  {
    icon: Scale,
    title: "Chargeback fees",
    rate: "$15-$100 per dispute",
    description:
      "Disputes are costly. Fewer chargebacks from digital receipts plus Vero payouts help recover those losses.",
  },
];

export function OffsetCosts() {
  return (
    <section className="py-12 sm:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - left aligned */}
        <div className="mb-10 sm:mb-14 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 mb-3">
            Offsetting Your Costs
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-4 leading-tight">
            Payouts that work against your operating expenses.
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Running a business comes with unavoidable fees. Vero doesn&apos;t
            eliminate them — but monthly payouts can meaningfully chip away at
            the costs that eat into your margins.
          </p>
        </div>

        {/* Cost cards in a single bordered container */}
        <div className="bg-white border border-gray-200 divide-x-0 md:divide-x md:divide-gray-200 divide-y md:divide-y-0 divide-gray-200 grid md:grid-cols-3">
          {costs.map((cost) => (
            <div key={cost.title} className="p-6 sm:p-8">
              <cost.icon className="w-6 h-6 text-gray-900 mb-4" />
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                {cost.title}
              </h3>
              <p className="text-sm font-semibold text-primary-600 mb-3">
                {cost.rate}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {cost.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
