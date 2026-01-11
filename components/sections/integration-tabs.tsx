"use client";

import { useState } from "react";
import { CreditCard, Store, Users, ArrowRight, Lock, Shield, Eye, EyeOff } from "lucide-react";

const tabs = [
  { id: "issuers", label: "Card Issuers", icon: CreditCard },
  { id: "merchants", label: "Merchants", icon: Store },
  { id: "consumers", label: "Consumers", icon: Users },
];

const tabContent = {
  issuers: {
    headline: "Super simple API that bridges POS systems and native card apps",
    description: "Integrate once and deliver digital receipts to all your cardholders. No merchant relationships required — receipts flow automatically through the Vero network.",
    cta: "View API docs",
    features: [
      "Single API integration",
      "Automatic merchant onboarding",
      "Real-time receipt delivery",
      "Reduce friendly fraud by 40%",
    ],
  },
  merchants: {
    headline: "Free plugin for your existing POS system",
    description: "Download our free plugin and start sending digital receipts in minutes. Works with Square, Toast, Clover, Shopify, and all major POS systems.",
    cta: "Download plugin",
    features: [
      "5-minute setup",
      "No code required",
      "Works with existing hardware",
      "Eliminate paper receipt costs",
    ],
  },
  consumers: {
    headline: "Your receipts, automatically in your card app",
    description: "No app to download. No accounts to create. Just use your card like normal and see itemized receipts appear in your banking app instantly.",
    cta: "Learn more",
    features: [
      "Zero setup required",
      "Works with any card",
      "Full privacy protection",
      "Export to expense tools",
    ],
  },
};

export function IntegrationTabs() {
  const [activeTab, setActiveTab] = useState("issuers");
  const content = tabContent[activeTab as keyof typeof tabContent];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary-900 mb-3">Integration</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Built for everyone in the ecosystem
          </h2>
        </div>
        {/* Tab navigation */}
        <div className="flex justify-center mb-16 px-4">
          <div className="inline-flex flex-wrap justify-center bg-white rounded-full p-1.5 border border-gray-200 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-gray-900 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Text content */}
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary-900" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {content.headline}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {content.description}
            </p>
            <ul className="space-y-3 pt-2">
              {content.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-700">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href="https://www.digitalreceiptprotocol.org"
              className="inline-flex items-center gap-2 text-gray-900 font-semibold hover:gap-3 transition-all"
            >
              {content.cta}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right side - Visual flow */}
          <div className="bg-gray-900 rounded-2xl p-6 lg:p-8 shadow-2xl overflow-x-auto">
            <div className="flex items-center justify-between gap-4 min-w-[520px]">
              {/* POS Receipt */}
              <div className="bg-gray-800 rounded-xl p-4 w-44 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-medium text-sm">Payment Complete</span>
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-300">
                    <span>1x Latte</span>
                    <span>$4.20</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>1x Croissant</span>
                    <span>$3.50</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>1x Espresso</span>
                    <span>$2.75</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between text-gray-400 text-[10px]">
                      <span>Subtotal</span>
                      <span>$10.45</span>
                    </div>
                    <div className="flex justify-between text-gray-400 text-[10px]">
                      <span>Tax</span>
                      <span>$0.84</span>
                    </div>
                    <div className="flex justify-between text-white font-semibold mt-1">
                      <span>Total</span>
                      <span>$11.29</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="flex items-center gap-2 text-gray-400 text-[10px]">
                    <CreditCard className="w-3 h-3" />
                    <span>Visa •••• 4242</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-center gap-1 text-green-400 text-[10px]">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Digital Receipt Sent</span>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0">
                <ArrowRight className="w-5 h-5 text-primary-400" />
              </div>

              {/* API Code */}
              <div className="bg-gray-800 rounded-xl p-3 w-48 flex-shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">POST</span>
                  <span className="text-gray-400 text-[10px] font-mono">/v1/receipts</span>
                </div>
                <pre className="text-[9px] font-mono leading-relaxed overflow-hidden">
                  <span className="text-gray-500">{"{"}</span>{"\n"}
                  <span className="text-purple-400">&quot;merchant&quot;</span><span className="text-gray-500">:</span> <span className="text-green-400">&quot;Coffee Shop&quot;</span><span className="text-gray-500">,</span>{"\n"}
                  <span className="text-purple-400">&quot;total&quot;</span><span className="text-gray-500">:</span> <span className="text-orange-400">11.29</span><span className="text-gray-500">,</span>{"\n"}
                  <span className="text-purple-400">&quot;items&quot;</span><span className="text-gray-500">: [</span>{"\n"}
                  <span className="text-gray-500">  {"{"}</span><span className="text-purple-400">&quot;name&quot;</span><span className="text-gray-500">:</span> <span className="text-green-400">&quot;Latte&quot;</span><span className="text-gray-500">{"}"},</span>{"\n"}
                  <span className="text-gray-500">  {"{"}</span><span className="text-purple-400">&quot;name&quot;</span><span className="text-gray-500">:</span> <span className="text-green-400">&quot;Croissant&quot;</span><span className="text-gray-500">{"}"},</span>{"\n"}
                  <span className="text-gray-500">],</span>{"\n"}
                  <span className="text-purple-400">&quot;encrypted&quot;</span><span className="text-gray-500">:</span> <span className="text-orange-400">true</span>{"\n"}
                  <span className="text-gray-500">{"}"}</span>
                </pre>
              </div>

              {/* Arrow */}
              <div className="flex-shrink-0">
                <ArrowRight className="w-5 h-5 text-primary-400" />
              </div>

              {/* Card App Receipt */}
              <div className="bg-white rounded-xl p-4 w-44 flex-shrink-0 shadow-lg">
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-900 text-sm">Coffee Shop</h4>
                  <p className="text-[10px] text-gray-500">123 Main St, New York, NY 10001</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 mb-3">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>12/18/2025, 7:30:00 AM</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>1x Latte</span>
                    <span>$4.20</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>1x Croissant</span>
                    <span>$3.50</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>1x Espresso</span>
                    <span>$2.75</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between text-gray-500 text-[10px]">
                      <span>Subtotal</span>
                      <span>$10.45</span>
                    </div>
                    <div className="flex justify-between text-gray-500 text-[10px]">
                      <span>Tax</span>
                      <span>$0.84</span>
                    </div>
                    <div className="flex justify-between text-gray-900 font-semibold mt-1">
                      <span>Total</span>
                      <span>$11.29</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-2 text-gray-500">
                      <CreditCard className="w-3 h-3" />
                      <span>Visa •••• 4242</span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
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
