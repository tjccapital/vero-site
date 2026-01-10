"use client";

import { Github, Twitter, FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-8">
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-4">Vero</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Building the future of digital receipts with open standards and interoperability.
            </p>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold mb-4 text-sm">Product</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#use-cases" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Use Cases
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-semibold mb-4 text-sm">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
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
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2026 Vero. Built on the Digital Receipt Protocol.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-gray-400 hover:text-gray-900 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-900 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-900 transition-colors"
              aria-label="Documentation"
            >
              <FileText className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
