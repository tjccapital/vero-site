"use client";

import { ArrowRight } from "lucide-react";

const logos = [
  { name: "Stripe", width: 60 },
  { name: "Square", width: 70 },
  { name: "Shopify", width: 80 },
  { name: "Toast", width: 60 },
  { name: "Clover", width: 70 },
];

export function Hero() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px),
                             linear-gradient(to bottom, #000 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center">
          {/* Announcement banner */}
          <a
            href="#"
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium bg-[#d4f542] text-gray-900 rounded-full hover:bg-[#c8e93d] transition-colors"
          >
            Vero joins the Digital Receipt Protocol consortium
            <ArrowRight className="w-4 h-4" />
          </a>

          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-8">
            The receipt platform for
            <br />
            <span className="text-gray-900">humans & AI agents</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 leading-relaxed mb-10">
            One integration for digital receipts, data portability, and privacy,
            making your app <span className="font-semibold text-gray-900">enterprise-ready</span> and <span className="font-semibold text-gray-900">consumer-ready</span>.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <a
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gray-900 border border-gray-900 rounded-md hover:bg-gray-800 transition-colors min-w-[140px]"
            >
              Watch demo
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors min-w-[140px]"
            >
              Talk to an expert
            </a>
          </div>

          {/* Logo cloud */}
          <div className="border-t border-gray-200 pt-12">
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60">
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
      </div>
    </section>
  );
}
