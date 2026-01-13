"use client";

import { ArrowRight } from "lucide-react";
import { Boxes } from "@/components/ui/boxes";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";

const logos = [
  { name: "Stripe" },
  { name: "Square" },
  { name: "Visa" },
  { name: "Mastercard" },
  { name: "Shopify" },
];

export function Hero() {
  return (
    <section className="relative bg-slate-50 overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-slate-50 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />
      <Boxes />
      <div className="relative z-30 pt-16 pb-12 sm:pt-24 sm:pb-16 pointer-events-none">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Announcement banner */}
          <a
            href="/contact"
            className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 mb-6 sm:mb-8 text-sm font-medium bg-white text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
            Now seeking pilot partners
            <ArrowRight className="w-4 h-4" />
          </a>

          {/* Main headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-slate-900 leading-[1.15] mb-4 sm:mb-6">
            Digital Receipts that
            <br />
            actually work for
            <br />
            <ContainerTextFlip
              words={["Card Issuers", "Merchants", "Consumers", "POS Systems", "Banks", "Credit Unions", "Fintechs"]}
              textClassName="text-primary-600"
            />
          </h1>

          {/* Subtitle */}
          <p className="max-w-xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed mb-6 sm:mb-8">
            Stop friendly fraud before it starts. Deliver itemized receipts
            directly to banking apps, so customers see exactly what they bought.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8 sm:mb-12">
            <a
              href="/contact"
              className="pointer-events-auto inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm"
            >
              Become a Pilot Partner
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
            <a
              href="/demo"
              className="pointer-events-auto inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
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
