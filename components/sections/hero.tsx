"use client";

import { ArrowRight } from "lucide-react";
import { WavyBackground } from "@/components/ui/wavy-background";

const logos = [
  { name: "Stripe" },
  { name: "Square" },
  { name: "Visa" },
  { name: "Mastercard" },
  { name: "Shopify" },
];

export function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      <WavyBackground
        className="w-full"
        containerClassName="pt-28 pb-20"
        colors={["#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6"]}
        waveOpacity={0.25}
        blur={30}
        speed="slow"
        waveYPosition={0.2}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Announcement banner */}
          <a
            href="#"
            className="inline-flex items-center gap-2 px-4 py-2 mb-10 text-sm font-medium bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors border border-blue-100"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Card issuers and merchants can now join our beta
            <ArrowRight className="w-4 h-4" />
          </a>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-gray-900 leading-[1.1] mb-6">
            Digital receipts for the
            <br />
            <span className="text-blue-600">modern world</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-xl mx-auto text-lg text-gray-500 leading-relaxed mb-10">
            One integration to deliver secure, portable digital receipts.
            Reduce friendly fraud and provide real value to your users.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-20">
            <a
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
            >
              Join the beta
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              Read the docs
            </a>
          </div>

          {/* Logo cloud */}
          <div className="pt-10 border-t border-gray-100">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-8">Trusted by leading payment providers</p>
            <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
              {logos.map((logo) => (
                <span
                  key={logo.name}
                  className="text-gray-300 font-medium text-sm tracking-wide"
                >
                  {logo.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </WavyBackground>
    </section>
  );
}
