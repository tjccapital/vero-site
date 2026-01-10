"use client";

import { Button } from "@/components/ui/button";
import { GridBackground } from "@/components/ui/grid-background";
import { Spotlight } from "@/components/ui/spotlight";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      <GridBackground />
      <Spotlight />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="space-y-10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            <span className="block text-gray-900 mb-4">Digital receipts for the</span>
            <span className="block text-[#3b82f6]">modern world</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 leading-relaxed">
            Vero transforms paper receipts into secure, portable digital records. Built on open standards for seamless integration across merchants, payment processors, and consumers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Button size="lg" className="group min-w-[180px]">
              View the spec
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="min-w-[180px]">
              See documentation
            </Button>
          </div>

          <div className="pt-6 text-sm text-gray-500 font-medium">
            Open source • Interoperable • Privacy-first
          </div>
        </div>
      </div>
    </section>
  );
}
