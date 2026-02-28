"use client";

import Image from "next/image";

const partners = [
  { name: "Square", logo: "/square-logo.png" },
  { name: "Toast", logo: "/toast-logo.png" },
  { name: "Clover", logo: "/clover-logo.png" },
  { name: "Shopify", logo: "/shopify-logo.png" },
  { name: "Stripe", logo: "/stripe-logo.png" },
  { name: "SpotOn", logo: "/spoton-logo.png" },
];

export function MerchantIntegrations() {
  return (
    <section className="py-12 sm:py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-sm font-medium text-primary-900 mb-2">
            Integrations
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
            Seamless Integration
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with the tools you already use. Vero works with all major
            POS and payment platforms.
          </p>
        </div>

        {/* Partner logos */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex flex-col items-center gap-2"
            >
              <a
                href="https://docs.veroreceipts.com/pos-plugins/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={50}
                  height={50}
                  className="object-contain"
                />
              </a>
              <span className="text-xs text-gray-500">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
