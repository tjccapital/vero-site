"use client";

import { CreditCard, Store, Users } from "lucide-react";

const useCases = [
  {
    icon: CreditCard,
    title: "For card issuers",
    description: "Banks, credit unions, and fintechs: give your cardholders transaction clarity while cutting dispute costs. Reduce friendly fraud and lower call center volume.",
  },
  {
    icon: Store,
    title: "For merchants",
    description: "Reduce chargebacks with one click. When customers see what they bought, they stop disputing purchases they forgot about. Free forever.",
  },
  {
    icon: Users,
    title: "For consumers",
    description: "See itemized receipts in your banking app instead of cryptic merchant codes. Budget better, track spending, and never wonder what a charge was for.",
  },
];

export function UseCases() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Built for everyone in the payment ecosystem
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
