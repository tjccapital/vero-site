"use client";

import { Smartphone, Lock, Boxes, Zap } from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "Portable",
    description: "DRP is open source and community designed, built to be the spec that powers a common good. It targets the largest possible number of use-cases.",
  },
  {
    icon: Lock,
    title: "Client side encryption",
    description: "Chain uses encryption natively that only the consumer who owns their receipts model allows to encrypt and decrypt their historical purchasing data.",
  },
  {
    icon: Boxes,
    title: "Interoperable",
    description: "DRP supports flexible data patterns that let you integrate with any device, existing payment infrastructure or POS system to ensure universal compatibility.",
  },
  {
    icon: Zap,
    title: "Real-time updates",
    description: "Implement the DRP specification to generate encrypted receipts at point of sale that are instantly available to customers. You own your data now, with seamless portability.",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Vero?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built on the Digital Receipt Protocol - an open standard for programmable
            receipt flows between merchants, payment processors, and consumers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-blue/10 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-blue" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
