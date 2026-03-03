"use client";

import { useState } from "react";
import Image from "next/image";

const stats = [
  {
    value: "73%",
    description: "of cardholders have disputed a charge they didn't recognize",
  },
  {
    value: "89%",
    description:
      "say itemized receipts in their banking app would be useful",
  },
];

export function ConsumerDemand() {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <section className="py-12 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left side - Text content */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 mb-3">
              Consumer Demand
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-4 leading-tight">
              Your customers are already asking for this.
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-8">
              People have wanted itemized digital receipts for years.
              They&apos;re tired of seeing &ldquo;MSTR STR CFFE 4821&rdquo; on
              their bank statement. The Vero app gives them clarity — and
              they&apos;re actively looking for merchants on the network.
            </p>

            {/* Stat cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.value}
                  className="border border-gray-200 p-5"
                >
                  <div className="text-2xl sm:text-3xl font-bold text-primary-600 mb-2">
                    {stat.value}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="rounded-lg overflow-hidden w-full max-w-md">
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="cursor-zoom-in"
              >
                <Image
                  src="/vero-reddit-mentions.png"
                  alt="vero-reddit-mentions.png"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              </button>
            </div>
          </div>

          {/* Lightbox */}
          {lightboxOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-zoom-out"
              onClick={() => setLightboxOpen(false)}
            >
              <Image
                src="/vero-reddit-mentions.png"
                alt="vero-reddit-mentions.png"
                width={1600}
                height={1200}
                className="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
