"use client";

import { CheckCircle2, ShieldCheck } from "lucide-react";

export function ReceiptDemo() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Replace cryptic codes with clear receipts
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Customers dispute transactions they don't recognize. Vero delivers itemized receipts directly to banking apps, so customers see exactly what they bought instead of cryptic merchant codes.
            </p>

            <div className="space-y-5 pt-4">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Customers recognize transactions</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    When customers see itemized details instead of cryptic codes, they stop disputing purchases.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Instant delivery to banking apps</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Receipts arrive in real-time directly in your customers' banking apps.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Stop friendly fraud</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Legitimate purchases disputed by mistake cost billions annually. Vero prevents them.
                  </p>
                </div>
              </div>
            </div>

            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gray-900 border border-gray-900 rounded-md hover:bg-gray-800 transition-colors"
            >
              Become a Pilot Partner
            </a>
          </div>

          {/* Right side - Receipt visualization */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 w-80">
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold text-xs">
                        C
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">Coffee Shop</span>
                    </div>
                    <span className="text-xs text-gray-500">Today, 12:30 PM</span>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Payment Complete</h3>
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
                      <span className="text-sm font-medium">Digital receipt sent</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Badge */}
              <div className="absolute -top-3 -right-3 bg-green-600 text-white px-2.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
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
