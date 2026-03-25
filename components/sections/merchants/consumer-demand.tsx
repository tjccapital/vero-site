import { ArrowRight, Check, X } from "lucide-react";

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

const beforeItems = [
  { label: "MSTR STR CFFE 4821", amount: "$11.25" },
  { label: "SQ *LUNCH SPOT NYC", amount: "$24.80" },
  { label: "TST* CORNER BAKERY", amount: "$8.50" },
];

const afterItems = [
  {
    merchant: "Main Street Coffee",
    items: ["Oat Milk Latte", "Blueberry Muffin", "Sparkling Water"],
    amount: "$11.25",
  },
  {
    merchant: "The Lunch Spot",
    items: ["Turkey Club", "Side Salad", "Iced Tea"],
    amount: "$24.80",
  },
  {
    merchant: "Corner Bakery",
    items: ["Croissant", "Drip Coffee"],
    amount: "$8.50",
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
                  className="border border-gray-200 rounded-lg p-5"
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

          {/* Right side - Before/After comparison */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-md space-y-4">
              {/* Before - Bank statement */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-100 px-4 py-2.5 flex items-center gap-2">
                  <X className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Bank Statement
                  </span>
                </div>
                <div className="divide-y divide-gray-100">
                  {beforeItems.map((item) => (
                    <div
                      key={item.label}
                      className="px-4 py-3 flex items-center justify-between"
                    >
                      <span className="text-sm font-mono text-gray-400">
                        {item.label}
                      </span>
                      <span className="text-sm text-gray-400">
                        {item.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full bg-primary-900 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-white rotate-90" />
                </div>
              </div>

              {/* After - Vero receipts */}
              <div className="border border-primary-200 rounded-lg overflow-hidden ring-1 ring-primary-100">
                <div className="bg-primary-50 px-4 py-2.5 flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary-600" />
                  <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
                    With Vero
                  </span>
                </div>
                <div className="divide-y divide-gray-100">
                  {afterItems.map((item) => (
                    <div
                      key={item.merchant}
                      className="px-4 py-3 flex items-start justify-between gap-4"
                    >
                      <div>
                        <span className="text-sm font-semibold text-gray-900">
                          {item.merchant}
                        </span>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.items.join(" · ")}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-gray-900 shrink-0">
                        {item.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
