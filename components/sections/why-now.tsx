"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const problems = [
  {
    title: "No universal standard",
    description: "Every POS system, bank, and merchant uses different data formats. There's no common language.",
    image: "/reason-1.png",
  },
  {
    title: "Privacy was an afterthought",
    description: "Previous attempts exposed purchase data to intermediaries. Consumers didn't trust it.",
    image: "/reason-2.png",
  },
  {
    title: "Infrastructure didn't exist",
    description: "No secure way to route receipts from merchants to the right banking app in real-time.",
    image: "/reason-3.png",
  },
  {
    title: "Misaligned incentives",
    description: "Merchants wouldn't pay for it. Banks didn't see the ROI. Consumers had no voice.",
    image: "/reason-4.png",
  },
];

const solutions = [
  {
    title: "Open standard (DRP)",
    description: "The Digital Receipt Protocol creates a universal format that works across all systems.",
    image: "/solution-1.png",
  },
  {
    title: "Privacy-first architecture",
    description: "End-to-end encryption means only you and the merchant see your purchase data.",
    image: "/solution-2.png",
  },
  {
    title: "Zero-friction integration",
    description: "Works with existing POS systems. No code changes. No disruption to checkout.",
    image: "/solution-3.png",
  },
];

export function WhyNow() {
  const [selectedProblem, setSelectedProblem] = useState(0);
  const [selectedSolution, setSelectedSolution] = useState(0);

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-sm font-medium text-primary-900 mb-2">The Problem</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Why don&apos;t digital receipts exist already?
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Here&apos;s what&apos;s been holding the industry back—and how Vero solves it.
          </p>
        </div>

        {/* Interactive Problems Section - Desktop */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16 sm:mb-20">
          {/* Left side - Clickable list */}
          <div className="space-y-2">
            {problems.map((problem, index) => (
              <button
                key={index}
                onClick={() => setSelectedProblem(index)}
                className={`w-full text-left p-4 sm:p-5 transition-all border ${
                  selectedProblem === index
                    ? "bg-gray-50 border-gray-200"
                    : "bg-white border-transparent hover:bg-gray-50"
                }`}
              >
                <h3 className={`font-semibold mb-1 ${
                  selectedProblem === index ? "text-gray-900" : "text-gray-700"
                }`}>
                  {problem.title}
                </h3>
                <p className={`text-sm transition-all ${
                  selectedProblem === index
                    ? "text-gray-600 max-h-20 opacity-100"
                    : "text-gray-400 max-h-0 opacity-0 overflow-hidden"
                }`}>
                  {problem.description}
                </p>
              </button>
            ))}
          </div>

          {/* Right side - Image */}
          <div className="flex items-center justify-center bg-gray-50 p-8 min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedProblem}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative w-full h-[300px]"
              >
                <Image
                  src={problems[selectedProblem].image}
                  alt={problems[selectedProblem].title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                  loading="lazy"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Interactive Problems Section - Mobile (Accordion style) */}
        <div className="lg:hidden space-y-3 mb-16">
          {problems.map((problem, index) => (
            <div key={index} className="border border-gray-200 overflow-hidden">
              <button
                onClick={() => setSelectedProblem(index)}
                className={`w-full text-left p-4 transition-all ${
                  selectedProblem === index ? "bg-gray-50" : "bg-white"
                }`}
              >
                <h3 className="font-semibold text-gray-900">
                  {problem.title}
                </h3>
              </button>
              <AnimatePresence>
                {selectedProblem === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      <p className="text-sm text-gray-600 mb-4">
                        {problem.description}
                      </p>
                      <div className="bg-gray-50 p-4 flex items-center justify-center">
                        <div className="relative w-full h-[200px]">
                          <Image
                            src={problem.image}
                            alt={problem.title}
                            fill
                            sizes="100vw"
                            className="object-contain"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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

        {/* Interactive Solutions Section - Desktop (Image left, text right) */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left side - Image */}
          <div className="flex items-center justify-center bg-gray-50 p-8 min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedSolution}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative w-full h-[300px]"
              >
                <Image
                  src={solutions[selectedSolution].image}
                  alt={solutions[selectedSolution].title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                  loading="lazy"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right side - Clickable list */}
          <div className="space-y-2">
            {solutions.map((solution, index) => (
              <button
                key={index}
                onClick={() => setSelectedSolution(index)}
                className={`w-full text-left p-4 sm:p-5 transition-all border ${
                  selectedSolution === index
                    ? "bg-gray-50 border-gray-200"
                    : "bg-white border-transparent hover:bg-gray-50"
                }`}
              >
                <h3 className={`font-semibold mb-1 ${
                  selectedSolution === index ? "text-gray-900" : "text-gray-700"
                }`}>
                  {solution.title}
                </h3>
                <p className={`text-sm transition-all ${
                  selectedSolution === index
                    ? "text-gray-600 max-h-20 opacity-100"
                    : "text-gray-400 max-h-0 opacity-0 overflow-hidden"
                }`}>
                  {solution.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Solutions Section - Mobile (Accordion style) */}
        <div className="lg:hidden space-y-3">
          {solutions.map((solution, index) => (
            <div key={index} className="border border-gray-200 overflow-hidden">
              <button
                onClick={() => setSelectedSolution(index)}
                className={`w-full text-left p-4 transition-all ${
                  selectedSolution === index ? "bg-gray-50" : "bg-white"
                }`}
              >
                <h3 className="font-semibold text-gray-900">
                  {solution.title}
                </h3>
              </button>
              <AnimatePresence>
                {selectedSolution === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      <p className="text-sm text-gray-600 mb-4">
                        {solution.description}
                      </p>
                      <div className="bg-gray-50 p-4 flex items-center justify-center">
                        <div className="relative w-full h-[200px]">
                          <Image
                            src={solution.image}
                            alt={solution.title}
                            fill
                            sizes="100vw"
                            className="object-contain"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
