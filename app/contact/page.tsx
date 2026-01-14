"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Mail, MessageSquare, Building2, ArrowRight } from "lucide-react";

declare global {
  interface Window {
    Cal?: any;
  }
}

export default function ContactPage() {
  useEffect(() => {
    // Load Cal.com embed script
    (function (C: any, A: string, L: string) {
      const p = function (a: any, ar: any) { a.q.push(ar); };
      const d = C.document;
      C.Cal = C.Cal || function () {
        const cal = C.Cal;
        const ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          const script = d.head.appendChild(d.createElement("script"));
          script.src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.com/embed/embed.js", "init");

    window.Cal("init", "30min", { origin: "https://app.cal.com" });

    window.Cal.ns["30min"]("inline", {
      elementOrSelector: "#my-cal-inline-30min",
      config: { layout: "month_view", theme: "auto" },
      calLink: "tommy-cotter-idtw4r/30min",
    });

    window.Cal.ns["30min"]("ui", {
      cssVarsPerTheme: { light: { "cal-brand": "#1e3a8a" } },
      hideEventTypeDetails: false,
      layout: "month_view",
    });
  }, []);

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

        {/* Contact Section */}
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
                    <a href="https://www.digitalreceiptprotocol.org" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-900 transition-colors">
                      <ArrowRight className="w-3 h-3" />
                      API documentation
                    </a>
                  </div>
                </div>
              </div>

              {/* Right - Cal.com Embed */}
              <div className="lg:col-span-3">
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                  <div
                    id="my-cal-inline-30min"
                    style={{ width: "100%", height: "600px", overflow: "auto" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-[#1e3a8a]">
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
