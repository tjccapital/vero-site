"use client";

import { useState } from "react";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Mail, MessageSquare, Building2, ArrowRight } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    message: "",
    newsletter: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-primary-50 to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
              Get in touch
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl">
              Have questions about Vero? Want to join our beta program? We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Left - Contact Info */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Let&apos;s talk
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Whether you&apos;re a card issuer looking to reduce friendly fraud,
                    a merchant wanting to go paperless, or just curious about digital receipts,
                    we&apos;re here to help.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary-900" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">Email us</h3>
                      <p className="text-gray-500 text-sm">hello@getvero.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-primary-900" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">Sales inquiries</h3>
                      <p className="text-gray-500 text-sm">sales@getvero.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-primary-900" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">Partnerships</h3>
                      <p className="text-gray-500 text-sm">partners@getvero.com</p>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 text-sm mb-3">Quick links</h3>
                  <div className="space-y-2">
                    <a href="/product" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-900 transition-colors">
                      <ArrowRight className="w-3 h-3" />
                      View product details
                    </a>
                    <a href="/blog" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-900 transition-colors">
                      <ArrowRight className="w-3 h-3" />
                      Read our blog
                    </a>
                    <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-900 transition-colors">
                      <ArrowRight className="w-3 h-3" />
                      API documentation
                    </a>
                  </div>
                </div>
              </div>

              {/* Right - Form */}
              <div className="lg:col-span-3">
                <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-8">
                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent text-sm"
                        placeholder="John Smith"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent text-sm"
                        placeholder="john@company.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent text-sm"
                        placeholder="Acme Inc."
                      />
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                        I am a...
                      </label>
                      <select
                        id="role"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent text-sm bg-white"
                      >
                        <option value="">Select one...</option>
                        <option value="card-issuer">Card Issuer</option>
                        <option value="merchant">Merchant</option>
                        <option value="developer">Developer</option>
                        <option value="investor">Investor</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-5">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent text-sm resize-none"
                      placeholder="Tell us about your needs..."
                      required
                    />
                  </div>

                  {/* Newsletter Checkbox */}
                  <div className="mb-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.newsletter}
                        onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
                        className="mt-0.5 w-4 h-4 text-primary-900 border-gray-300 rounded focus:ring-primary-900"
                      />
                      <span className="text-sm text-gray-600">
                        Subscribe to our newsletter for product updates, industry insights, and tips on reducing friendly fraud.
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-primary-900 text-white font-medium rounded-lg hover:bg-primary-800 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    Send message
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-primary-900">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-3">
              Just want updates?
            </h2>
            <p className="text-primary-100 mb-6">
              Subscribe to our newsletter and stay informed about the latest in digital receipts.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-primary-700 bg-primary-800 text-white placeholder-primary-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-primary-900 font-medium rounded-lg hover:bg-primary-50 transition-colors text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
