"use client";

import { ArrowRight } from "lucide-react";
import { Boxes } from "@/components/ui/boxes";

const logos = [
  { name: "Stripe" },
  { name: "Square" },
  { name: "Visa" },
  { name: "Mastercard" },
  { name: "Shopify" },
];

export function Hero() {
  return (
    <section className="relative bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-slate-900 z-10 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
      <div className="relative z-20 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Announcement banner */}
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-4 py-2 mb-10 text-sm font-medium bg-slate-800 text-white hover:bg-slate-700 transition-colors border border-slate-700"
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Now seeking pilot partners
            <ArrowRight className="w-4 h-4" />
          </a>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-[1.1] mb-6">
            Receipts that prevent
            <br />
            <span className="text-blue-400">chargebacks</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-xl mx-auto text-lg text-slate-300 leading-relaxed mb-10">
            Stop friendly fraud before it starts. Deliver itemized receipts
            directly to banking apps, so customers see exactly what they bought.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-20">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-sm"
            >
              Become a Pilot Partner
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
            <a
              href="/demo"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-transparent border border-slate-600 hover:bg-slate-800 hover:border-slate-500 transition-colors"
            >
              Try the Demo
            </a>
          </div>

          {/* Logo cloud - Hidden for now */}
          {/* <div className="pt-10 border-t border-gray-100">
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
          </div> */}
        </div>
      </div>
    </section>
  );
}
