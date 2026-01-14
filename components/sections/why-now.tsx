"use client";

import { X, Check, AlertTriangle, Layers, Lock, Zap } from "lucide-react";

const problems = [
  {
    title: "No universal standard",
    description: "Every POS system, bank, and merchant uses different data formats. There's no common language.",
  },
  {
    title: "Privacy was an afterthought",
    description: "Previous attempts exposed purchase data to intermediaries. Consumers didn't trust it.",
  },
  {
    title: "Infrastructure didn't exist",
    description: "No secure way to route receipts from merchants to the right banking app in real-time.",
  },
  {
    title: "Misaligned incentives",
    description: "Merchants wouldn't pay for it. Banks didn't see the ROI. Consumers had no voice.",
  },
];

const solutions = [
  {
    icon: Layers,
    title: "Open standard (DRP)",
    description: "The Digital Receipt Protocol creates a universal format that works across all systems.",
  },
  {
    icon: Lock,
    title: "Privacy-first architecture",
    description: "End-to-end encryption means only you and the merchant see your purchase data.",
  },
  {
    icon: Zap,
    title: "Zero-friction integration",
    description: "Works with existing POS systems. No code changes. No disruption to checkout.",
  },
];

export function WhyNow() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-sm font-medium text-primary-900 mb-2">The Problem</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Why don&apos;t digital receipts exist yet?
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            It&apos;s not for lack of trying. Here&apos;s what&apos;s been holding the industry back.
          </p>
        </div>

        {/* Problems grid */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-16 sm:mb-20">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="flex gap-4 p-5 bg-gray-50 border border-gray-100"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 flex items-center justify-center">
                  <X className="w-4 h-4 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{problem.title}</h3>
                <p className="text-sm text-gray-600">{problem.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Solution header */}
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-sm font-medium text-primary-900 mb-2">The Solution</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            How Vero changes everything
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            We built the infrastructure the industry has been waiting for.
          </p>
        </div>

        {/* Solutions */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {solutions.map((solution, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-primary-100 flex items-center justify-center mx-auto mb-4">
                <solution.icon className="w-6 h-6 text-primary-900" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{solution.title}</h3>
              <p className="text-sm text-gray-600">{solution.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
