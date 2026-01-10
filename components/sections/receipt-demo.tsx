"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export function ReceiptDemo() {
  return (
    <section className="relative py-24 bg-navy overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-light rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="text-white space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Make your receipts portable
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Implement the DRP specification to generate encrypted receipt models at point of
              sale that are instantly available to customers. You control the
              data you want delivered, while customers maintain true ownership.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-6 h-6 text-blue-light flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">1. Enable Digital Receipts</h4>
                  <p className="text-gray-300">
                    Cloud based encryption and delivery that binds to individual consumer model objects, or flat files like NFTs.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-6 h-6 text-blue-light flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">2. Create Payment & Secure Receipt</h4>
                  <p className="text-gray-300">
                    Have the system create encrypted receipt packets from receipt
                    providers you use and securely store them.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-6 h-6 text-blue-light flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">3. View Receipt</h4>
                  <p className="text-gray-300">
                    Use viewing clients to unencrypt and query over personally
                    encrypted receipts, by use application, Receipts by industry, budget
                    analysis.
                  </p>
                </div>
              </div>
            </div>

            <Button size="lg" variant="primary" className="mt-4">
              View the spec →
            </Button>
          </div>

          {/* Right side - Receipt visualization */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto transform hover:scale-105 transition-transform duration-300">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center text-white font-bold">
                      M
                    </div>
                    <span className="font-semibold text-gray-900">Merchant POS</span>
                  </div>
                  <span className="text-sm text-gray-500">Order #42</span>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 text-lg">Payment Complete</h3>
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
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>$26.74</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Tax</span>
                        <span>$2.14</span>
                      </div>
                      <div className="flex justify-between font-semibold text-gray-900 text-base mt-2">
                        <span>Total</span>
                        <span>$28.88</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Digital receipt sent</span>
                  </div>
                </div>
              </div>
            </div>

            {/* API Badge */}
            <div className="absolute -top-4 -right-4 bg-blue text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
              API Ready
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
