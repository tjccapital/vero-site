"use client";

import { useState, useEffect } from "react";
import { CreditCard, Store, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";

const tabs = [
  { id: "issuers", label: "Card Issuers", icon: CreditCard },
  { id: "merchants", label: "Merchants", icon: Store },
  { id: "consumers", label: "Consumers", icon: Users },
];

const validTabIds = tabs.map(t => t.id);

const tabContent = {
  issuers: {
    headline: "Give cardholders transaction clarity while cutting dispute costs",
    description: "Your banking app retrieves itemized receipts via our API. Customers see what they bought instead of cryptic merchant codes. Disputes drop because customers recognize their purchases.",
    cta: "Talk to us about a pilot",
    image: "/issuer-dashboard.png",
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
    image: "/merchant-dashboard.png",
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
    image: "/consumer-app.png",
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

  // Sync tab state with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (validTabIds.includes(hash)) {
        setActiveTab(hash);
      }
    };

    // Check hash on mount
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    // Update URL hash without scrolling
    window.history.replaceState(null, "", `#${tabId}`);
  };

  return (
    <section id="integration" className="py-12 sm:py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-sm font-medium text-primary-900 mb-2">Integration</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900">
            Built for everyone in the ecosystem
          </h2>
        </div>
        {/* Tab navigation */}
        <div className="flex justify-center mb-8 sm:mb-12 px-4">
          <div className="inline-flex flex-wrap justify-center bg-white p-1.5 border border-gray-200 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-gray-900 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-[10px] sm:text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-start min-h-[500px]">
          {/* Left side - Text content */}
          <div className="space-y-6 min-h-[450px] flex flex-col">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight min-h-[120px]">
              {content.headline}
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed min-h-[80px]">
              {content.description}
            </p>

            {/* Image on mobile (replaces checklist) */}
            <div className="lg:hidden relative w-full h-[250px] my-4">
              <Image
                src={content.image}
                alt={content.headline}
                fill
                sizes="100vw"
                className="object-contain"
                loading="lazy"
              />
            </div>

            {/* Checklist - hidden on mobile, shown on desktop */}
            <ul className="hidden lg:flex lg:flex-col space-y-3 pt-2">
              {content.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 text-gray-900 font-semibold hover:gap-3 transition-all pt-2"
            >
              {content.cta}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right side - Visual (desktop only) */}
          <div className="hidden lg:flex items-center justify-center relative w-full h-[400px]">
            <Image
              src={content.image}
              alt={content.headline}
              fill
              sizes="50vw"
              className="object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
