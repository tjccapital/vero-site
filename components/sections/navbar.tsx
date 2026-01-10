"use client";

import { useState } from "react";
import { Logo } from "@/components/ui/logo";
import { Menu, X, ChevronDown } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
            <button className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Product
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Solutions
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Resources
              <ChevronDown className="w-4 h-4" />
            </button>
            <a href="#" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Docs
            </a>
            <a href="#" className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
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
            <a href="#" className="block text-gray-700 hover:text-gray-900 transition-colors py-2">
              Pricing
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
