"use client";

import { CheckCircle2 } from "lucide-react";

export function ReceiptDemo() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Make your receipts portable
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Implement the DRP specification to generate encrypted receipt models at point of sale that are instantly available to customers. You control the data you want delivered, while customers maintain true ownership.
            </p>

            <div className="space-y-5 pt-4">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Enable Digital Receipts</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Cloud based encryption and delivery that binds to individual consumer model objects.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Create Payment & Secure Receipt</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Have the system create encrypted receipt packets and securely store them.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">View Receipt</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Use viewing clients to decrypt and query over personally encrypted receipts.
                  </p>
                </div>
              </div>
            </div>

            <a
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gray-900 border border-gray-900 rounded-md hover:bg-gray-800 transition-colors"
            >
              View the spec
            </a>
          </div>

          {/* Right side - Receipt visualization */}
          <div className="relative">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-sm mx-auto">
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white font-bold text-xs">
                      M
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">Merchant POS</span>
                  </div>
                  <span className="text-xs text-gray-500">Order #42</span>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Payment Complete</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Product A</span>
                      <span>$12.99</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Product B</span>
                      <span>$8.50</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Product C</span>
                      <span>$5.25</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>$26.74</span>
                      </div>
                      <div className="flex justify-between text-gray-600 mt-1">
                        <span>Tax</span>
                        <span>$2.14</span>
                      </div>
                      <div className="flex justify-between font-semibold text-gray-900 mt-2">
                        <span>Total</span>
                        <span>$28.88</span>
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

            {/* API Badge */}
            <div className="absolute -top-3 -right-3 bg-gray-900 text-white px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium">
              API Ready
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
