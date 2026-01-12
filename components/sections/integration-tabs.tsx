"use client";

import { useState } from "react";
import { CreditCard, Store, Users, ArrowRight } from "lucide-react";

const tabs = [
  { id: "issuers", label: "Card Issuers", icon: CreditCard },
  { id: "merchants", label: "Merchants", icon: Store },
  { id: "consumers", label: "Consumers", icon: Users },
];

const tabContent = {
  issuers: {
    headline: "Give cardholders transaction clarity while cutting dispute costs",
    description: "Your banking app retrieves itemized receipts via our API. Customers see what they bought instead of cryptic merchant codes. Disputes drop because customers recognize their purchases.",
    cta: "Talk to us about a pilot",
    features: [
      "Reduce friendly fraud",
      "Lower call center volume",
      "Better digital banking experience",
      "Competitive differentiation",
    ],
  },
  merchants: {
    headline: "One-click install. Free forever.",
    description: "Vero integrates with your existing point-of-sale system. No code changes. No disruption. Your logo and itemized receipts appear in customer bank statements.",
    cta: "Install now",
    features: [
      "Works with Square, Toast, Clover, Shopify",
      "No fees, no subscriptions",
      "Fewer chargebacks",
      "Less customer support calls",
    ],
  },
  consumers: {
    headline: "See what you bought, not cryptic codes",
    description: "No app to download. No accounts to create. Just use your card and see itemized receipts in your banking app. Budget better and never wonder what a charge was for.",
    cta: "Learn more",
    features: [
      "Zero setup required",
      "Itemized details in your bank app",
      "Full privacy protection",
      "Your data, your control",
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
              href="/contact"
              className="inline-flex items-center gap-2 text-gray-900 font-semibold hover:gap-3 transition-all"
            >
              {content.cta}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right side - Visual */}
          <div className="flex items-center justify-center">
            <img
              src="/images/receipt-flow.png"
              alt="Digital receipt flow showing payment complete notification and receipt details"
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
