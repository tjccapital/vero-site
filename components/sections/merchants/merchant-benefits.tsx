"use client";

import {
  Receipt,
  Users,
  ShieldCheck,
  Plug,
  BarChart3,
  DollarSign,
} from "lucide-react";

const benefits = [
  {
    icon: Receipt,
    title: "Digital Receipts",
    description:
      "Deliver itemized digital receipts directly to customer banking apps. No paper, no email collection needed.",
  },
  {
    icon: Users,
    title: "Customer Insights",
    description:
      "Understand purchasing patterns and customer behavior with anonymized, aggregated analytics.",
  },
  {
    icon: ShieldCheck,
    title: "Fraud Protection",
    description:
      "Reduce chargebacks and friendly fraud with verified, tamper-proof digital receipts tied to transactions.",
  },
  {
    icon: Plug,
    title: "Easy Integration",
    description:
      "Connect in minutes with your existing POS or payment system. Works with all major providers.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description:
      "Track transactions, receipt delivery, and customer engagement metrics in real-time.",
  },
  {
    icon: DollarSign,
    title: "Earn Revenue",
    description:
      "Get paid for every receipt you send. The Vero network rewards merchants for participating.",
  },
];

export function MerchantBenefits() {
  return (
    <section className="py-12 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-sm font-medium text-primary-900 mb-2">Benefits</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
            Why Join the Network?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to modernize your receipt experience and grow
            your business.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-white border border-gray-200 p-4 sm:p-6 hover:shadow-lg hover:border-gray-300 transition-all"
            >
              <div className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-50 text-primary-900 mb-3 sm:mb-4">
                <benefit.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 sm:mb-2">
                {benefit.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
