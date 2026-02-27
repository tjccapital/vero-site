"use client";

const partners = [
  { name: "Square", letter: "S" },
  { name: "Toast", letter: "T" },
  { name: "Clover", letter: "C" },
  { name: "Shopify", letter: "Sh" },
  { name: "Stripe", letter: "St" },
];

export function MerchantIntegrations() {
  return (
    <section className="py-12 sm:py-20 bg-white">
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
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-12 sm:mb-16">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm hover:border-gray-300 hover:shadow-sm transition-all">
                {partner.letter}
              </div>
              <span className="text-xs text-gray-500">{partner.name}</span>
            </div>
          ))}
        </div>

        {/* Code snippet */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900 border border-gray-700 overflow-hidden">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs text-gray-400">
                integration.js
              </span>
            </div>
            {/* Code */}
            <div className="p-4 sm:p-6 text-sm font-mono overflow-x-auto">
              <div className="text-gray-500">
                {"// Initialize Vero in 3 lines"}
              </div>
              <div className="mt-2">
                <span className="text-blue-400">import</span>
                <span className="text-gray-300">{" { Vero } "}</span>
                <span className="text-blue-400">from</span>
                <span className="text-green-400">
                  {" '@vero/merchant-sdk'"}
                </span>
                <span className="text-gray-300">;</span>
              </div>
              <div className="mt-3">
                <span className="text-blue-400">const</span>
                <span className="text-gray-300"> vero = </span>
                <span className="text-blue-400">new</span>
                <span className="text-yellow-300"> Vero</span>
                <span className="text-gray-300">{"({ "}</span>
                <span className="text-gray-300">merchantId</span>
                <span className="text-gray-300">{": "}</span>
                <span className="text-green-400">
                  {"'your_merchant_id'"}
                </span>
                <span className="text-gray-300">{" });"}
                </span>
              </div>
              <div className="mt-3">
                <span className="text-blue-400">await</span>
                <span className="text-gray-300"> vero.</span>
                <span className="text-yellow-300">sendReceipt</span>
                <span className="text-gray-300">{"(transaction);"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
