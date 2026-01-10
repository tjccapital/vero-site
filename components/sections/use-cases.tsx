"use client";

import { Store, CreditCard, Users, TrendingUp } from "lucide-react";

const useCases = [
  {
    icon: Store,
    title: "For merchants",
    description: "Reduce chargebacks and verify point-of-sale receipt data. Integrated loyalty programs and personalized receipts engage customers while helping reduce support tickets.",
  },
  {
    icon: CreditCard,
    title: "Open your purchase history",
    description: "Provide encrypted records that only the consumer who uses their private encrypted model can decrypt and decrypt their historical purchasing records. Share with accountants, expense tools based on your preferred data.",
  },
  {
    icon: Users,
    title: "For retailers",
    description: "Decrease receipts-related expenses that include receipt printing spend, lost receipt support, non-auto expense claims for returns, and receipt reprint requests.",
  },
  {
    icon: TrendingUp,
    title: "Reduce disputes",
    description: "Leverage insights into the point-of-sale purchase flow to decrease returns and increase customer lifetime value through targeted messaging, real-time feedback and loyalty incentive.",
  },
];

export function UseCases() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Digital receipts that work for
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {useCases.map((useCase, index) => (
            <div key={index} className="space-y-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue to-navy-light flex items-center justify-center shadow-lg">
                <useCase.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {useCase.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
