"use client";

import { Store, CreditCard, Users } from "lucide-react";

const useCases = [
  {
    icon: Store,
    title: "For merchants",
    description: "Reduce chargebacks and verify point-of-sale receipt data. Integrated loyalty programs and personalized receipts engage customers while reducing support tickets.",
  },
  {
    icon: CreditCard,
    title: "For consumers",
    description: "Own your purchase history with encrypted records that only you can decrypt. Share with accountants, expense tools, or keep private - your data, your choice.",
  },
  {
    icon: Users,
    title: "For enterprises",
    description: "Decrease receipts-related expenses including printing costs, lost receipt support, expense claims for returns, and receipt reprint requests.",
  },
];

export function UseCases() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Digital receipts that work for everyone
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-8 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-5">
                <useCase.icon className="w-5 h-5 text-gray-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {useCase.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
