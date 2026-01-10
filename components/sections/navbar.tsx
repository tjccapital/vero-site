"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="#" className="text-blue-900 hover:text-blue-600 transition-colors">
              <Logo className="h-7" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-900 transition-colors">
              Features
            </a>
            <a href="#use-cases" className="text-gray-700 hover:text-blue-900 transition-colors">
              Use Cases
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-900 transition-colors">
              Documentation
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-900 transition-colors">
              Spec
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost">Sign in</Button>
            <Button variant="primary" size="sm">
              Get started
            </Button>
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
            <a href="#features" className="block text-gray-700 hover:text-blue-900 transition-colors">
              Features
            </a>
            <a href="#use-cases" className="block text-gray-700 hover:text-blue-900 transition-colors">
              Use Cases
            </a>
            <a href="#" className="block text-gray-700 hover:text-blue-900 transition-colors">
              Documentation
            </a>
            <a href="#" className="block text-gray-700 hover:text-blue-900 transition-colors">
              Spec
            </a>
            <div className="pt-4 space-y-2">
              <Button variant="ghost" className="w-full">
                Sign in
              </Button>
              <Button variant="primary" className="w-full">
                Get started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
