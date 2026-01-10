"use client";

import { useState } from "react";
import { Logo } from "@/components/ui/logo";
import { Menu, X, ChevronDown, Receipt, Shield, Building2, Zap, Link2, Bot, FileCheck, ArrowRight } from "lucide-react";

const productItems = [
  {
    icon: Receipt,
    title: "Digital Receipts",
    description: "Secure, portable receipt delivery for merchants and card issuers.",
  },
  {
    icon: Building2,
    title: "Merchant Portal",
    description: "Self-serve admin UI for merchants to manage receipts and settings.",
  },
  {
    icon: Shield,
    title: "Fraud Prevention",
    description: "Reduce friendly fraud with verifiable purchase records.",
  },
  {
    icon: Zap,
    title: "Real-time Delivery",
    description: "Instant receipt delivery at point of sale via webhooks.",
  },
  {
    icon: Link2,
    title: "Connected Apps",
    description: "Enable receipt sharing with expense tools, accounting software, and more.",
  },
  {
    icon: Bot,
    title: "AI Agent Ready",
    description: "Structured receipt data for AI agents and autonomous systems.",
  },
  {
    icon: FileCheck,
    title: "DRP Specification",
    badge: "Open Source",
    description: "Open standard for digital receipt interoperability.",
  },
];

const solutionItems = [
  { title: "For Card Issuers", href: "#" },
  { title: "For Merchants", href: "#" },
  { title: "For Consumers", href: "#" },
  { title: "For Enterprises", href: "#" },
];

const resourceItems = [
  { title: "Documentation", href: "#" },
  { title: "API Reference", href: "#" },
  { title: "Blog", href: "#" },
  { title: "Changelog", href: "#" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#" className="text-gray-900">
              <Logo className="h-6" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Product Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("product")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Product
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === "product" ? "rotate-180" : ""}`} />
              </button>

              {activeDropdown === "product" && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                  <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 w-[700px]">
                    <div className="grid grid-cols-2 gap-4">
                      {productItems.map((item) => (
                        <a
                          key={item.title}
                          href="#"
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 text-sm">{item.title}</span>
                              {item.badge && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                    {/* Bottom CTA bar */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <a
                        href="#"
                        className="flex items-center justify-center gap-2 py-3 bg-cyan-50 text-gray-700 rounded-lg hover:bg-cyan-100 transition-colors text-sm"
                      >
                        <Zap className="w-4 h-4" />
                        <span className="font-medium">Reduce friendly fraud with Vero.</span>
                        <span className="text-gray-500">See how we compare</span>
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Solutions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("solutions")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Solutions
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === "solutions" ? "rotate-180" : ""}`} />
              </button>

              {activeDropdown === "solutions" && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                  <div className="bg-white border border-gray-200 rounded-xl shadow-lg py-2 w-48">
                    {solutionItems.map((item) => (
                      <a
                        key={item.title}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("resources")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Resources
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === "resources" ? "rotate-180" : ""}`} />
              </button>

              {activeDropdown === "resources" && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                  <div className="bg-white border border-gray-200 rounded-xl shadow-lg py-2 w-48">
                    {resourceItems.map((item) => (
                      <a
                        key={item.title}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      >
                        {item.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a href="#" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Docs
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-3">
            <a href="#" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </a>
            <a
              href="#"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
            >
              Log in
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-3">
            <a href="#" className="block text-gray-700 hover:text-gray-900 transition-colors py-2">
              Product
            </a>
            <a href="#" className="block text-gray-700 hover:text-gray-900 transition-colors py-2">
              Solutions
            </a>
            <a href="#" className="block text-gray-700 hover:text-gray-900 transition-colors py-2">
              Resources
            </a>
            <a href="#" className="block text-gray-700 hover:text-gray-900 transition-colors py-2">
              Docs
            </a>
            <div className="pt-4 space-y-2 border-t border-gray-200">
              <a href="#" className="block text-gray-700 hover:text-gray-900 transition-colors py-2">
                Contact
              </a>
              <a
                href="#"
                className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
              >
                Log in
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
