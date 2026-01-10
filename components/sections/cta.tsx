"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 bg-[#1e3a8a] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3b82f6] rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Get started with Vero
        </h2>
        <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-2xl mx-auto">
          Join the movement towards portable, secure, and interoperable digital receipts. Implement the Digital Receipt Protocol today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="primary" className="bg-white text-[#1e3a8a] hover:bg-gray-100 group min-w-[200px]">
            Read documentation
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            size="lg"
            className="bg-transparent border-2 border-white text-white hover:bg-white/10 min-w-[200px]"
          >
            View on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
}
