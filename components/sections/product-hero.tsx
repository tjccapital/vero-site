"use client";

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

export function ProductHero() {
  return (
    <section className="relative flex min-h-[500px] w-full items-center justify-center bg-white overflow-hidden">
      {/* Grid Background */}
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]"
        )}
      />
      {/* Radial gradient fade */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      {/* Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Paper is no longer the
          <br />
          default receipt option
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Free for merchants. Free beta for card issuers. Reduce friendly fraud that costs the industry billions.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-primary-900 hover:bg-primary-800 transition-colors"
          >
            Request beta access
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
          <a
            href="https://docs.veroreceipts.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            View documentation
          </a>
        </div>
      </div>
    </section>
  );
}
