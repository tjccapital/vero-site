import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import {
  Receipt,
  CreditCard,
  Store,
  Shield,
  Zap,
  Link2,
  Lock,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Users,
  FileText,
  Smartphone,
  Building2
} from "lucide-react";

export default function ProductPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                The complete digital receipt platform
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Free for merchants. Free pilot program for card issuers.
                Reduce friendly fraud that costs the industry billions annually.
              </p>
            </div>
          </div>
        </section>

        {/* Value Prop Banner */}
        <section className="py-8 bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white mb-2">$40B+</div>
                <p className="text-gray-400">Annual friendly fraud losses</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">40%</div>
                <p className="text-gray-400">Dispute reduction with receipts</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-2">$0</div>
                <p className="text-gray-400">Cost for merchants to integrate</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Features Grid - Stytch Style */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
              How Vero works
            </h2>

            {/* Row 1: Large card + 2 small cards */}
            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              {/* Large Card - Receipt Flow */}
              <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Seamless receipt delivery
                </h3>
                <p className="text-gray-600 text-sm mb-8 max-w-lg">
                  Receipts flow automatically from the point of sale to the consumer&apos;s card app.
                  No email addresses, no phone numbers, no friction.
                </p>

                {/* Visual Flow */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between gap-4">
                    {/* POS */}
                    <div className="flex-1 text-center">
                      <div className="w-16 h-16 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Store className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">Merchant POS</p>
                      <p className="text-xs text-gray-500">Free plugin</p>
                    </div>

                    <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />

                    {/* Vero */}
                    <div className="flex-1 text-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Lock className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">Vero Network</p>
                      <p className="text-xs text-gray-500">Encrypted</p>
                    </div>

                    <ArrowRight className="w-6 h-6 text-gray-400 flex-shrink-0" />

                    {/* Card App */}
                    <div className="flex-1 text-center">
                      <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Smartphone className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">Card App</p>
                      <p className="text-xs text-gray-500">Instant delivery</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Small Card - Fraud Prevention */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Fraud prevention
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Every receipt is cryptographically linked to its transaction.
                  When disputes arise, you have the proof.
                </p>
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs">
                  <div className="text-gray-500">{"{"}</div>
                  <div className="pl-4">
                    <span className="text-purple-400">&quot;transaction_id&quot;</span>
                    <span className="text-gray-500">:</span>
                    <span className="text-green-400"> &quot;txn_8x7k2&quot;</span>
                    <span className="text-gray-500">,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-purple-400">&quot;receipt_hash&quot;</span>
                    <span className="text-gray-500">:</span>
                    <span className="text-green-400"> &quot;0x8f3...&quot;</span>
                    <span className="text-gray-500">,</span>
                  </div>
                  <div className="pl-4">
                    <span className="text-purple-400">&quot;verified&quot;</span>
                    <span className="text-gray-500">:</span>
                    <span className="text-orange-400"> true</span>
                  </div>
                  <div className="text-gray-500">{"}"}</div>
                </div>
              </div>
            </div>

            {/* Row 2: 3 equal cards */}
            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              {/* Free for Merchants */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Free for merchants
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Download our free plugin for Square, Toast, Clover, Shopify, and all major POS systems.
                  No contracts, no fees.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    5-minute setup
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    No code required
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Eliminate paper costs
                  </li>
                </ul>
              </div>

              {/* Card Issuer Beta */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Card issuer beta
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Join our free pilot program to deliver digital receipts to your cardholders.
                  Reduce disputes and improve customer experience.
                </p>
                <a href="#" className="inline-flex items-center gap-2 text-blue-600 font-medium text-sm hover:text-blue-700">
                  Request beta access
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Real-time Delivery */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Real-time delivery
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Receipts arrive in the card app before the customer leaves the store.
                  Webhooks notify your systems instantly.
                </p>
                <div className="bg-gray-100 rounded-lg p-3 text-xs font-mono">
                  <span className="text-green-600">POST</span>
                  <span className="text-gray-600"> /webhooks/receipt-delivered</span>
                </div>
              </div>
            </div>

            {/* Row 3: 2 wide cards */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Dispute Resolution */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Dispute resolution
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Every dispute costs issuers and merchants time and money.
                      With itemized receipts linked to transactions, you can resolve disputes instantly.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          <span className="text-red-600 text-xs font-bold">!</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Customer disputes $47.99 charge</p>
                          <p className="text-xs text-gray-500">&quot;I don&apos;t recognize this transaction&quot;</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Receipt shows itemized purchase</p>
                          <p className="text-xs text-gray-500">Dinner at Mario&apos;s Italian - 2 entrees, 1 dessert</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connected Apps */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Connected apps
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Consumers can share receipts with expense tools, accounting software,
                  and budgeting apps with a single tap.
                </p>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-900">Share receipt with:</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                      <div className="text-lg mb-1">📊</div>
                      <p className="text-xs text-gray-600">Expensify</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                      <div className="text-lg mb-1">📗</div>
                      <p className="text-xs text-gray-600">QuickBooks</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                      <div className="text-lg mb-1">💰</div>
                      <p className="text-xs text-gray-600">Mint</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 4: 3 equal cards */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* End-to-end Encryption */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  End-to-end encryption
                </h3>
                <p className="text-gray-600 text-sm">
                  Built on the Digital Receipt Protocol (DRP).
                  Card issuers deliver receipts but cannot read them. Only consumers and merchants see the details.
                </p>
              </div>

              {/* Merchant Portal */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Merchant portal
                </h3>
                <p className="text-gray-600 text-sm">
                  Self-serve dashboard for merchants to customize receipt branding,
                  manage delivery settings, and view analytics.
                </p>
              </div>

              {/* API & SDK */}
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-gray-700" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  API & SDK
                </h3>
                <p className="text-gray-600 text-sm">
                  RESTful API and SDKs for Node.js, Python, and mobile.
                  Build custom integrations or use our pre-built plugins.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50 border-t border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to reduce friendly fraud?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Card issuers: Join our free beta program. Merchants: Get started in 5 minutes with our free plugin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
              >
                Request beta access
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Download merchant plugin
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
