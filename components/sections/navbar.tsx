"use client";

import { useState } from "react";
import { Logo } from "@/components/ui/logo";
import { Menu, X, ChevronDown, CreditCard, Store, Users, Play, BookOpen, FileText, History, Mail, ArrowRight } from "lucide-react";

const solutionItems = [
  {
    icon: CreditCard,
    title: "Card Issuers",
    description: "Deliver digital receipts to cardholders and reduce friendly fraud.",
    href: "/#issuers",
  },
  {
    icon: Store,
    title: "Merchants",
    description: "Free plugin for your POS. Send receipts in minutes.",
    href: "/#merchants",
  },
  {
    icon: Users,
    title: "Consumers",
    description: "Your receipts, automatically in your card app.",
    href: "/#consumers",
  },
];

const resourceItems = [
  {
    icon: Play,
    title: "Demo",
    description: "See Vero in action with an interactive demo.",
    href: "#",
  },
  {
    icon: BookOpen,
    title: "Docs",
    description: "API reference and integration guides.",
    href: "#",
    external: true,
  },
  {
    icon: FileText,
    title: "Blog",
    description: "News, updates, and insights from the team.",
    href: "/blog",
  },
  {
    icon: History,
    title: "Changelog",
    description: "Latest product updates and releases.",
    href: "#",
  },
  {
    icon: Mail,
    title: "Contact",
    description: "Get in touch with our team.",
    href: "/contact",
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-gray-900">
              <Logo className="h-6" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {/* Product - Direct Link */}
            <a href="/product" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Product
            </a>

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
                  <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-[400px]">
                    <div className="space-y-1">
                      {solutionItems.map((item) => (
                        <a
                          key={item.title}
                          href={item.href}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-900 text-sm">{item.title}</span>
                            <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                    {/* Bottom CTA bar */}
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <a
                        href="/contact"
                        className="flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                      >
                        Not sure which solution?
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
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
                  <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-[400px]">
                    <div className="space-y-1">
                      {resourceItems.map((item) => (
                        <a
                          key={item.title}
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <item.icon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900 text-sm">{item.title}</span>
                              {item.external && (
                                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-2">
            <a href="/contact" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </a>
            <a
              href="#"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get started
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
            <a href="/product" className="block text-gray-700 hover:text-gray-900 transition-colors py-2">
              Product
            </a>
            <div className="py-2">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Solutions</p>
              <div className="space-y-1 pl-2">
                {solutionItems.map((item) => (
                  <a key={item.title} href={item.href} className="block text-gray-600 hover:text-gray-900 transition-colors py-1.5 text-sm">
                    {item.title}
                  </a>
                ))}
              </div>
            </div>
            <div className="py-2">
              <p className="text-xs uppercase tracking-wider text-gray-400 mb-2">Resources</p>
              <div className="space-y-1 pl-2">
                {resourceItems.map((item) => (
                  <a key={item.title} href={item.href} className="block text-gray-600 hover:text-gray-900 transition-colors py-1.5 text-sm">
                    {item.title}
                  </a>
                ))}
              </div>
            </div>
            <div className="pt-4 space-y-2 border-t border-gray-200">
              <a href="/contact" className="block text-gray-700 hover:text-gray-900 transition-colors py-2">
                Contact
              </a>
              <a
                href="#"
                className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get started
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
