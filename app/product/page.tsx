import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { ProductHero } from "@/components/sections/product-hero";
import { Metadata } from "next";
import {
  CreditCard,
  Store,
  Shield,
  Zap,
  Lock,
  ArrowRight,
  CheckCircle2,
  Bot,
  FileCode,
  BarChart3,
  BookOpen,
  Wallet,
  Layers,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Product - Digital Receipt Platform",
  description:
    "Everything you need to deliver digital receipts. Free for merchants, beta for card issuers. Reduce friendly fraud by 40% with secure, portable receipts.",
  openGraph: {
    title: "Vero Product - Digital Receipt Platform",
    description:
      "Everything you need to deliver digital receipts. Free for merchants, beta for card issuers.",
    type: "website",
  },
};

export default function ProductPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero with Grid Background */}
        <ProductHero />

        {/* Feature Grid */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <p className="text-sm font-medium text-primary-900 mb-3">Features</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Everything you need to go digital
              </h2>
            </div>

            {/* Row 1 - Main Features */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Fraud Prevention - Primary */}
              <div className="bg-gradient-to-br from-primary-50 to-white border border-primary-100 rounded-2xl p-8">
                <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center mb-5">
                  <Shield className="w-6 h-6 text-primary-900" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Reduce friendly fraud by 40%
                </h3>
                <p className="text-gray-600 mb-6">
                  Itemized receipts linked to transactions help customers recognize charges instantly. No more &quot;I don&apos;t recognize this&quot; disputes.
                </p>
                <div className="bg-white rounded-xl p-5 border border-gray-100">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 bg-red-50 rounded-lg p-3">
                      <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-red-600 text-[10px] font-bold">!</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Dispute: $47.99</p>
                        <p className="text-xs text-gray-500">&quot;I don&apos;t recognize this charge&quot;</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-green-50 rounded-lg p-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Resolved instantly</p>
                        <p className="text-xs text-gray-500">Mario&apos;s Italian - 2 entrees, dessert, tip</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Delivery */}
              <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-8">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mb-5">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Real-time delivery
                </h3>
                <p className="text-gray-600 mb-6">
                  Receipts arrive in the customer&apos;s card app before they leave the store. Instant webhook notifications for your systems.
                </p>
                <div className="bg-gray-900 rounded-xl p-5 font-mono text-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">POST</span>
                    <span className="text-gray-400">/v1/receipts</span>
                  </div>
                  <pre className="text-xs text-gray-400 leading-relaxed">
{`{
  "merchant": "Coffee Shop",
  "total": 11.29,
  "items": [...],
  "encrypted": true
}`}
                  </pre>
                  <div className="mt-3 pt-3 border-t border-gray-800 flex items-center gap-2 text-green-400 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Delivered in 47ms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2 - Three Column */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {/* Free for Merchants */}
              <div className="border border-gray-200 rounded-2xl p-7 bg-white hover:shadow-lg hover:border-gray-300 transition-all">
                <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                  <Store className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Free for merchants
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Download our plugin for Square, Toast, Clover, Shopify. No fees ever.
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
                </ul>
              </div>

              {/* Card Issuer Beta */}
              <div className="border border-gray-200 rounded-2xl p-7 bg-white hover:shadow-lg hover:border-gray-300 transition-all">
                <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                  <CreditCard className="w-5 h-5 text-primary-900" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Card issuer beta
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Join our free pilot to deliver receipts and reduce disputes.
                </p>
                <a href="/contact" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-900 hover:text-primary-800">
                  Request access <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* End-to-end Encryption */}
              <div className="border border-gray-200 rounded-2xl p-7 bg-white hover:shadow-lg hover:border-gray-300 transition-all">
                <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                  <Lock className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  End-to-end encrypted
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Built on DRP. Card issuers deliver but cannot read receipts.
                </p>
                <a href="https://www.digitalreceiptprotocol.org" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900">
                  Learn about DRP <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Row 3 - Two Column */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Connected Apps */}
              <div className="border border-gray-200 rounded-2xl p-7 bg-white">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Connected apps
                </h3>
                <p className="text-gray-600 text-sm mb-5">
                  Consumers share receipts with expense tools, accounting software, and budgeting apps.
                </p>
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors">
                    <BarChart3 className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 font-medium">Expensify</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors">
                    <BookOpen className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 font-medium">QuickBooks</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors">
                    <Wallet className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 font-medium">Mint</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors">
                    <Layers className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-500 font-medium">Your App</p>
                  </div>
                </div>
              </div>

              {/* AI Ready */}
              <div className="border border-gray-200 rounded-2xl p-7 bg-white">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  AI agent ready
                </h3>
                <p className="text-gray-600 text-sm mb-5">
                  Structured receipt data designed for AI agents. Enable autonomous expense tracking and purchase insights.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                    <Bot className="w-6 h-6 text-violet-600" />
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">AI Agent Response</p>
                    <p className="text-sm text-gray-700">&quot;You spent $142 on coffee this month across 12 transactions.&quot;</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 4 - API */}
            <div className="border border-gray-200 rounded-2xl p-8 bg-gradient-to-br from-gray-50 to-white">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center mb-4">
                    <FileCode className="w-6 h-6 text-gray-700" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Developer-friendly API
                  </h3>
                  <p className="text-gray-600 mb-4">
                    RESTful API and SDKs for Node.js, Python, Go, and mobile platforms. Comprehensive documentation and sandbox environment.
                  </p>
                  <a href="https://www.digitalreceiptprotocol.org" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-900 hover:text-primary-800">
                    View documentation <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
                <div className="md:w-80 bg-gray-900 rounded-xl p-5 font-mono text-sm">
                  <div className="text-gray-500 mb-2"># Install SDK</div>
                  <div className="text-green-400 mb-4">npm install @vero/sdk</div>
                  <div className="text-gray-500 mb-2"># Send receipt</div>
                  <pre className="text-xs text-gray-400">
{`import { Vero } from '@vero/sdk'

const vero = new Vero('sk_live_...')
await vero.receipts.create({
  transaction_id: 'txn_123',
  items: [...]
})`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary-900">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to reduce friendly fraud?
            </h2>
            <p className="text-lg text-primary-100 mb-10">
              Card issuers: Join our free beta. Merchants: Get started in 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-primary-900 bg-white rounded-lg hover:bg-primary-50 transition-colors"
              >
                Request beta access
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
              <a
                href="https://www.digitalreceiptprotocol.org"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
              >
                View documentation
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
