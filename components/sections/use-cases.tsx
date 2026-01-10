"use client";

import { CreditCard, Store, Users } from "lucide-react";

const useCases = [
  {
    icon: CreditCard,
    title: "For card issuers",
    description: "Deliver digital receipts directly to cardholders. Reduce friendly fraud, improve customer experience, and provide itemized transaction details in your banking app.",
  },
  {
    icon: Store,
    title: "For merchants",
    description: "Replace paper receipts with secure digital delivery. Reduce chargebacks, build customer loyalty with personalized receipts, and gain insights from purchase data.",
  },
  {
    icon: Users,
    title: "For consumers",
    description: "Access all your receipts in one place. Share with expense tools, track spending, and never lose a receipt again. Your data, your control.",
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
