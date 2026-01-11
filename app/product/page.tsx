import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import {
  Receipt,
  CreditCard,
  Store,
  Shield,
  Zap,
  Lock,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  Link2,
  Bot,
  FileCode,
  BarChart3,
  BookOpen,
  Wallet,
  Layers,
} from "lucide-react";

export default function ProductPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Scales from your first receipt to Fortune 100 retailers
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Free for merchants. Free beta for card issuers. Reduce friendly fraud that costs the industry billions.
            </p>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="pb-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Row 1 */}
            <div className="grid lg:grid-cols-5 gap-5 mb-5">
              {/* Large card - Receipt Flow */}
              <div className="lg:col-span-3 border border-gray-200 rounded-2xl p-8 bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Seamless receipt delivery
                </h3>
                <p className="text-gray-600 text-sm mb-8">
                  Receipts flow from POS to consumer&apos;s card app automatically. No email, no phone number, no friction.
                </p>

                {/* Visual */}
                <div className="bg-gray-900 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    {/* POS Receipt */}
                    <div className="bg-gray-800 rounded-lg p-4 w-36">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white text-xs font-medium">Payment Complete</span>
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="space-y-1.5 text-[10px] text-gray-400">
                        <div className="flex justify-between"><span>Latte</span><span>$4.20</span></div>
                        <div className="flex justify-between"><span>Croissant</span><span>$3.50</span></div>
                        <div className="flex justify-between"><span>Espresso</span><span>$2.75</span></div>
                        <div className="border-t border-gray-700 pt-1.5 mt-1.5">
                          <div className="flex justify-between text-white font-medium"><span>Total</span><span>$11.29</span></div>
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-gray-700 text-[9px] text-green-400 text-center">
                        Digital Receipt Sent
                      </div>
                    </div>

                    <ArrowRight className="w-5 h-5 text-gray-600" />

                    {/* API */}
                    <div className="bg-gray-800 rounded-lg p-3 w-44">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">POST</span>
                        <span className="text-gray-400 text-[10px] font-mono">/v1/receipts</span>
                      </div>
                      <pre className="text-[9px] text-gray-400 font-mono leading-relaxed">
{`{
  "merchant": "Coffee Shop",
  "total": 11.29,
  "card_token": "tok_visa",
  "encrypted": true
}`}
                      </pre>
                    </div>

                    <ArrowRight className="w-5 h-5 text-gray-600" />

                    {/* Card App */}
                    <div className="bg-white rounded-lg p-4 w-36 shadow-lg">
                      <div className="mb-2">
                        <p className="text-xs font-semibold text-gray-900">Coffee Shop</p>
                        <p className="text-[9px] text-gray-500">123 Main St</p>
                      </div>
                      <div className="space-y-1.5 text-[10px] text-gray-600">
                        <div className="flex justify-between"><span>Latte</span><span>$4.20</span></div>
                        <div className="flex justify-between"><span>Croissant</span><span>$3.50</span></div>
                        <div className="flex justify-between"><span>Espresso</span><span>$2.75</span></div>
                        <div className="border-t border-gray-200 pt-1.5 mt-1.5">
                          <div className="flex justify-between text-gray-900 font-medium"><span>Total</span><span>$11.29</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fraud Prevention */}
              <div className="lg:col-span-2 border border-gray-200 rounded-2xl p-8 bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Fraud prevention
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Reduce friendly fraud with verifiable purchase records linked to transactions.
                </p>
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs">
                  <div className="text-gray-500">{"{"}</div>
                  <div className="pl-3 text-gray-400">
                    <span className="text-purple-400">&quot;transaction_id&quot;</span>: <span className="text-green-400">&quot;txn_8x7k2&quot;</span>,
                  </div>
                  <div className="pl-3 text-gray-400">
                    <span className="text-purple-400">&quot;receipt_hash&quot;</span>: <span className="text-green-400">&quot;0x8f3a...&quot;</span>,
                  </div>
                  <div className="pl-3 text-gray-400">
                    <span className="text-purple-400">&quot;verified&quot;</span>: <span className="text-orange-400">true</span>
                  </div>
                  <div className="text-gray-500">{"}"}</div>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid lg:grid-cols-3 gap-5 mb-5">
              {/* Free for Merchants */}
              <div className="border border-gray-200 rounded-2xl p-8 bg-white">
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-4">
                  <Store className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Free for merchants
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Download our free plugin for Square, Toast, Clover, Shopify. No fees, no contracts.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    5-minute setup
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    No code required
                  </li>
                </ul>
              </div>

              {/* Card Issuer Beta */}
              <div className="border border-gray-200 rounded-2xl p-8 bg-white">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Card issuer beta
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Join our free pilot to deliver digital receipts to cardholders and reduce disputes.
                </p>
                <a href="#" className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                  Request access <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Real-time */}
              <div className="border border-gray-200 rounded-2xl p-8 bg-white">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Real-time delivery
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Receipts arrive before customers leave the store. Instant webhook notifications.
                </p>
                <div className="bg-gray-100 rounded-lg px-3 py-2 text-xs font-mono text-gray-600">
                  POST /webhooks/receipt
                </div>
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid lg:grid-cols-2 gap-5 mb-5">
              {/* Dispute Resolution */}
              <div className="border border-gray-200 rounded-2xl p-8 bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Dispute resolution
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Every dispute costs time and money. Itemized receipts linked to transactions resolve disputes instantly.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-red-50 rounded-lg p-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 text-xs">!</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Customer disputes $47.99</p>
                      <p className="text-xs text-gray-500">&quot;I don&apos;t recognize this&quot;</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-green-50 rounded-lg p-3">
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Receipt shows itemized purchase</p>
                      <p className="text-xs text-gray-500">Mario&apos;s Italian - 2 entrees, dessert</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connected Apps */}
              <div className="border border-gray-200 rounded-2xl p-8 bg-white">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Connected apps
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Consumers share receipts with expense tools, accounting software, and budgeting apps.
                </p>
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <BarChart3 className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500">Expensify</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <BookOpen className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500">QuickBooks</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <Wallet className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500">Mint</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-center">
                    <Layers className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                    <p className="text-[10px] text-gray-500">Your App</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid lg:grid-cols-3 gap-5">
              {/* End-to-end encryption */}
              <div className="border border-gray-200 rounded-2xl p-8 bg-white">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  End-to-end encryption
                </h3>
                <p className="text-gray-600 text-sm">
                  Built on DRP. Card issuers deliver but cannot read receipts. Only you see your data.
                </p>
              </div>

              {/* AI Ready */}
              <div className="border border-gray-200 rounded-2xl p-8 bg-white">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                  <Bot className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  AI agent ready
                </h3>
                <p className="text-gray-600 text-sm">
                  Structured receipt data for AI agents. Enable autonomous expense tracking and insights.
                </p>
              </div>

              {/* API & SDK */}
              <div className="border border-gray-200 rounded-2xl p-8 bg-white">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                  <FileCode className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  API & SDK
                </h3>
                <p className="text-gray-600 text-sm">
                  RESTful API and SDKs for Node.js, Python, and mobile. Or use our pre-built plugins.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gray-50 border-t border-gray-200">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to reduce friendly fraud?
            </h2>
            <p className="text-gray-600 mb-8">
              Card issuers: Join our free beta. Merchants: Get started in 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
              >
                Request beta access
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Download plugin
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
