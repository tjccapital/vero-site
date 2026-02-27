"use client";

import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

export function MerchantHero() {
  return (
    <section className="relative flex w-full items-center justify-center bg-white overflow-hidden">
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
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Text */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 border border-primary-200 text-primary-900 text-xs font-medium">
              <span className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-pulse" />
              Now accepting merchants
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Join the Vero
              <br />
              Merchant Network
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              Join the growing network of merchants delivering digital receipts
              to customers. Reduce chargebacks, earn rewards, and get paid for
              every receipt you send.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-primary-900 hover:bg-primary-800 transition-colors group"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Right side - Receipt Card */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="bg-white shadow-lg border border-gray-200 p-6 w-80">
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-900 flex items-center justify-center text-white font-bold text-xs">
                        C
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">
                        Coffee Shop
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      Today, 12:30 PM
                    </span>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">
                      Payment Complete
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-gray-600">
                        <span>Latte</span>
                        <span>$4.20</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Croissant</span>
                        <span>$3.50</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Espresso</span>
                        <span>$2.75</span>
                      </div>
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span>$10.45</span>
                        </div>
                        <div className="flex justify-between text-gray-600 mt-1">
                          <span>Tax</span>
                          <span>$0.84</span>
                        </div>
                        <div className="flex justify-between font-semibold text-gray-900 mt-2">
                          <span>Total</span>
                          <span>$11.29</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Digital receipt sent
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="absolute -top-3 -right-3 bg-green-600 text-white px-2.5 py-1.5 shadow-lg flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-semibold">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
