"use client";

import { Shield, Lock, EyeOff, Key, ArrowRight } from "lucide-react";

export function Encryption() {
  return (
    <section className="py-12 sm:py-20 bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-sm font-medium text-primary-400 mb-2">Security</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
            End-to-end encryption by design
          </h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-6">
            <p className="text-gray-400 leading-relaxed text-lg">
              Digital receipts require privacy. Card issuers deliver but cannot read your receipts.
              Built on the open Digital Receipt Protocol (DRP).
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Encrypted at the source</h4>
                  <p className="text-gray-400 text-sm mt-1">
                    Receipt data is encrypted on the merchant&apos;s POS before it ever leaves the store.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                  <EyeOff className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Card issuers can&apos;t read it</h4>
                  <p className="text-gray-400 text-sm mt-1">
                    They deliver the receipt but cannot decrypt it. Zero-knowledge architecture.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                  <Key className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">You hold the keys</h4>
                  <p className="text-gray-400 text-sm mt-1">
                    Only you can decrypt your receipts. Share with expense tools or keep private.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="bg-gray-800 p-8">
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div className="flex-1 bg-gray-700/50 p-4">
                  <p className="text-sm text-white">
                    <span className="font-medium">Merchant POS</span>
                    <span className="text-gray-400"> encrypts receipt with your public key</span>
                  </p>
                </div>
              </div>

              {/* Connector */}
              <div className="flex justify-start pl-5">
                <div className="w-px h-4 bg-gray-700" />
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div className="flex-1 bg-gray-700/50 p-4">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-primary-400" />
                    <p className="text-sm text-white">
                      <span className="font-medium">Encrypted data</span>
                      <span className="text-gray-400"> travels through Vero</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Connector */}
              <div className="flex justify-start pl-5">
                <div className="w-px h-4 bg-gray-700" />
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div className="flex-1 bg-gray-700/50 p-4">
                  <div className="flex items-center gap-2">
                    <EyeOff className="w-4 h-4 text-primary-400" />
                    <p className="text-sm text-white">
                      <span className="font-medium">Card issuer</span>
                      <span className="text-gray-400"> delivers but cannot read</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Connector */}
              <div className="flex justify-start pl-5">
                <div className="w-px h-4 bg-gray-700" />
              </div>

              {/* Step 4 */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  4
                </div>
                <div className="flex-1 bg-gray-700/50 p-4">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-primary-400" />
                    <p className="text-sm text-white">
                      <span className="font-medium">Your private key</span>
                      <span className="text-gray-400"> decrypts in your card app</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-8 sm:mt-10 text-center">
          <a
            href="/product"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 transition-colors"
          >
            Learn more
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
