"use client";

import Image from "next/image";

const useCases = [
  {
    image: "/issuer-dashboard.png",
    title: "Card Issuers",
    description: "Banks, credit unions, and fintechs: give your cardholders transaction clarity while cutting dispute costs. Reduce friendly fraud and lower call center volume.",
  },
  {
    image: "/merchant-dashboard.png",
    title: "Merchants",
    description: "Reduce chargebacks with one click. When customers see what they bought, they stop disputing purchases they forgot about. Free forever.",
  },
  {
    image: "/consumer-app.png",
    title: "Consumers",
    description: "See itemized receipts in your banking app instead of cryptic merchant codes. Budget better, track spending, and never wonder what a charge was for.",
  },
];

export function UseCases() {
  return (
    <section className="py-16 sm:py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            Built for everyone in the payment ecosystem
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] bg-gray-100">
                <Image
                  src={useCase.image}
                  alt={useCase.title}
                  fill
                  className="object-contain p-4"
                />
              </div>

              {/* Text */}
              <div className="p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
