"use client";

import { Link2, Receipt, BarChart3 } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Integrate",
    description:
      "Connect your POS or payment system with our simple SDK. Works with Square, Toast, Clover, Shopify, and more.",
    icon: Link2,
  },
  {
    number: 2,
    title: "Transact",
    description:
      "Process payments as usual. Vero automatically generates and delivers digital receipts to your customers' banking apps.",
    icon: Receipt,
  },
  {
    number: 3,
    title: "Engage",
    description:
      "Access customer insights and analytics. Understand purchasing patterns and reduce chargebacks with verified receipts.",
    icon: BarChart3,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-12 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-sm font-medium text-primary-900 mb-2">
            Simple setup
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">
            How It Works
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 sm:gap-10">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              {/* Step number */}
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-900 text-white text-lg font-bold mb-5">
                {step.number}
              </div>
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <step.icon className="w-6 h-6 text-primary-600" />
              </div>
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
