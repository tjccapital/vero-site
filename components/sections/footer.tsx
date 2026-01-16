"use client";

import { Github, Twitter } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          <div className="md:col-span-2">
            <Logo className="h-6 text-gray-900 mb-4" />
            <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
              Digital receipts that consumers own, banks can trust.
            </p>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/product" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Overview
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  For Card Issuers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  For Merchants
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold mb-4 text-sm">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="https://docs.seevero.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://docs.seevero.com/api-reference/introduction" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="https://www.digitalreceiptprotocol.org/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                  DRP Specification
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold mb-4 text-sm">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2026 Vero
            </p>
            <div className="flex gap-4 text-sm">
              <a href="/privacy" className="text-gray-500 hover:text-gray-900 transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-500 hover:text-gray-900 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
