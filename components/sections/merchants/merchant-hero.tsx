"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function MerchantHero() {
  return (
    <section className="relative flex w-full items-center justify-center bg-white overflow-hidden">
      {/* Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left side - Text */}
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Join the Vero
              <br />
              Merchant Network
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8 max-w-lg">
              Deliver digital receipts to your customers, reduce chargebacks,
              and get paid for every receipt you send. Free to integrate.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-primary-900 hover:bg-primary-800 transition-colors"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-lg aspect-[1908/1156] overflow-hidden">
              <Image
                src="/pos-to-app.png"
                alt="POS to banking app digital receipt flow"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
                loading="eager"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
