"use client";

import { Shield, Lock, EyeOff, Key, CheckCircle2, XCircle } from "lucide-react";

export function Encryption() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            End-to-end encrypted
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Privacy that makes digital receipts possible
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Digital receipts haven&apos;t existed until now because of one critical problem: privacy.
            Card issuers seeing your itemized purchases would be a massive breach of trust.
          </p>
        </div>

        {/* Problem/Solution Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* The Problem */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Without encryption</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">Card issuers see everything you buy</p>
                  <p className="text-gray-600 text-sm mt-1">Every item, every purchase, stored in their databases forever.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">Data sold to advertisers</p>
                  <p className="text-gray-600 text-sm mt-1">Your purchase history becomes a product. Targeted ads follow you everywhere.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">Competitive intelligence leaks</p>
                  <p className="text-gray-600 text-sm mt-1">Merchants&apos; sales data exposed to competitors through data brokers.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* The Solution */}
          <div className="bg-green-50 border border-green-100 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">With DRP encryption</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">Only you and the merchant see details</p>
                  <p className="text-gray-600 text-sm mt-1">Receipt data is encrypted before it ever leaves the POS system.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">Card issuers can&apos;t decrypt</p>
                  <p className="text-gray-600 text-sm mt-1">They deliver the receipt but cannot read it. Zero knowledge architecture.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 font-medium">You control your data</p>
                  <p className="text-gray-600 text-sm mt-1">Share with expense tools, accountants, or keep it completely private.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* DRP Protocol Section */}
        <div className="bg-gray-900 rounded-2xl p-8 md:p-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                <Key className="w-4 h-4" />
                Open Source Protocol
              </div>
              <h3 className="text-3xl font-bold text-white">
                Built on Digital Receipt Protocol (DRP)
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Vero is built on DRP — an open source protocol that encrypts receipt data at the source.
                The encryption happens on the merchant&apos;s POS system before data ever reaches Vero or
                the card issuer. This isn&apos;t just a feature, it&apos;s the foundation.
              </p>
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <Lock className="w-5 h-5 text-blue-400" />
                  <span>AES-256 encryption at point of sale</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <EyeOff className="w-5 h-5 text-blue-400" />
                  <span>Zero-knowledge receipt delivery</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span>Consumer-held decryption keys</span>
                </div>
              </div>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors"
              >
                Read the DRP specification
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Visual encryption flow */}
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1 bg-gray-700 rounded-lg p-3">
                    <p className="text-sm text-gray-300">
                      <span className="text-white font-medium">Merchant POS</span> encrypts receipt with your public key
                    </p>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="w-px h-6 bg-gray-700" />
                </div>

                {/* Step 2 */}
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1 bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-green-400" />
                      <p className="text-sm text-gray-300">
                        <span className="text-white font-medium">Encrypted data</span> sent through Vero network
                      </p>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="w-px h-6 bg-gray-700" />
                </div>

                {/* Step 3 */}
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1 bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <EyeOff className="w-4 h-4 text-yellow-400" />
                      <p className="text-sm text-gray-300">
                        <span className="text-white font-medium">Card issuer</span> delivers but cannot read
                      </p>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center">
                  <div className="w-px h-6 bg-gray-700" />
                </div>

                {/* Step 4 */}
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1 bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-blue-400" />
                      <p className="text-sm text-gray-300">
                        <span className="text-white font-medium">Your private key</span> decrypts in your card app
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
