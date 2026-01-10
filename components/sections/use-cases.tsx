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
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Digital receipts that work for
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {useCases.slice(0, 3).map((useCase, index) => (
            <div key={index} className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#3b82f6] flex items-center justify-center">
                <useCase.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {useCase.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-[15px]">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
