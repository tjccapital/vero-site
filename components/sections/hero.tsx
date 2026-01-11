"use client";

import { ArrowRight } from "lucide-react";
import { WavyBackground } from "@/components/ui/wavy-background";

const logos = [
  { name: "Stripe", width: 60 },
  { name: "Square", width: 70 },
  { name: "Visa", width: 50 },
  { name: "Mastercard", width: 90 },
  { name: "Shopify", width: 80 },
];

export function Hero() {
  return (
    <section className="relative bg-white overflow-hidden">
      <WavyBackground
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
        containerClassName="pt-24 pb-16"
        colors={["#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#4f46e5"]}
        waveOpacity={0.3}
        blur={20}
        speed="slow"
        waveYPosition={0.25}
      >
        <div className="text-center">
          {/* Announcement banner */}
          <a
            href="#"
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium bg-[#d4f542] text-gray-900 rounded-full hover:bg-[#c8e93d] transition-colors"
          >
            Card issuers and merchants can now join our beta program
            <ArrowRight className="w-4 h-4" />
          </a>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-6">
            Digital receipts for the
            <br />
            modern world
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed mb-8">
            One integration to deliver secure, portable digital receipts.
            Reduce friendly fraud, increase customer loyalty, and provide real value to your users.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <a
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gray-900 border border-gray-900 rounded-md hover:bg-gray-800 transition-colors min-w-[140px]"
            >
              Join the beta
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors min-w-[140px]"
            >
              Read the docs
            </a>
          </div>

          {/* Logo cloud */}
          <div className="border-t border-gray-200 pt-10">
            <p className="text-sm text-gray-500 mb-6">Trusted by leading payment providers</p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-50">
              {logos.map((logo) => (
                <div
                  key={logo.name}
                  className="text-gray-400 font-semibold text-lg tracking-wide"
                  style={{ minWidth: logo.width }}
                >
                  {logo.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </WavyBackground>
    </section>
  );
}
