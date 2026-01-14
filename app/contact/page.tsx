"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";

export default function ContactPage() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#1e3a8a" },
          dark: { "cal-brand": "#1e3a8a" },
        },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
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
            <p className="text-lg text-gray-500">
              Have questions about Vero? Want to join our beta program? We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="pb-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white border border-gray-200 overflow-hidden" style={{ height: "600px" }}>
              <Cal
                namespace="30min"
                calLink="tommy-cotter-idtw4r/30min"
                style={{ width: "100%", height: "100%", overflow: "scroll" }}
                config={{ layout: "month_view" }}
              />
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
