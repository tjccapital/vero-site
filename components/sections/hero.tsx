"use client";

import { Button } from "@/components/ui/button";
import { GridBackground } from "@/components/ui/grid-background";
import { Spotlight } from "@/components/ui/spotlight";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
      <GridBackground />
      <Spotlight />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="space-y-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-900">
            Digital receipts for the
            <span className="block bg-gradient-to-r from-navy via-blue to-navy-light bg-clip-text text-transparent mt-2">
              modern world
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-xl sm:text-2xl text-gray-600 leading-relaxed">
            Vero transforms paper receipts into secure, portable digital records.
            Built on open standards for seamless integration across merchants,
            payment processors, and consumers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" className="group">
              View the spec
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline">
              See documentation
            </Button>
          </div>

          <div className="pt-8 text-sm text-gray-500">
            Open source • Interoperable • Privacy-first
          </div>
        </div>
      </div>
    </section>
  );
}
