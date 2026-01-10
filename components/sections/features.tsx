"use client";

export function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Scales from your first receipt to
            <br />
            Fortune 100 retailers
          </h2>
        </div>

        {/* Feature cards - Top row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Card 1 - Large */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-8 hover:border-gray-300 transition-colors">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Merchant receipt portal
            </h3>
            <p className="text-gray-600 text-sm mb-6 max-w-md">
              Let merchants self-serve receipt configuration, branding, and delivery settings. Full control over receipt data and customer touchpoints.
            </p>

            {/* Mock UI */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 bg-gray-100">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="p-4">
                <div className="flex gap-6 text-sm text-gray-500 border-b border-gray-200 pb-3 mb-4">
                  <span className="text-blue-600 border-b-2 border-blue-600 pb-3 -mb-3">Receipts</span>
                  <span>Branding</span>
                  <span>Webhooks</span>
                  <span>Analytics</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-900">Email delivery</span>
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Active</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-900">SMS delivery</span>
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Active</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-900">Push notifications</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 hover:border-gray-300 transition-colors">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Fraud prevention
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Reduce friendly fraud with verifiable purchase records. Link receipts to transactions for dispute resolution.
            </p>

            {/* Code snippet */}
            <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono overflow-x-auto">
              <div className="text-gray-500">
                <span className="text-purple-400">const</span>{" "}
                <span className="text-blue-300">receipt</span>{" "}
                <span className="text-white">=</span> {"{"}
              </div>
              <div className="text-gray-500 pl-4">
                transactionId: <span className="text-green-300">&quot;txn_123&quot;</span>,
              </div>
              <div className="text-gray-500 pl-4">
                verified: <span className="text-orange-300">true</span>,
              </div>
              <div className="pl-4">
                <span className="bg-blue-500/20 text-blue-300 px-1 rounded">signature: &quot;0x8f3...&quot;</span>
              </div>
              <div className="text-gray-500">{"}"}</div>
            </div>
          </div>
        </div>

        {/* Feature cards - Bottom row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Card 3 */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 hover:border-gray-300 transition-colors">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Connected apps
            </h3>
            <p className="text-gray-600 text-sm">
              Enable receipt sharing with expense management tools, accounting software, and budgeting apps with user consent.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 hover:border-gray-300 transition-colors">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Real-time delivery
            </h3>
            <p className="text-gray-600 text-sm">
              Instant receipt delivery at point of sale via webhooks. Customers get receipts before they leave the store.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 hover:border-gray-300 transition-colors">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              AI agent ready
            </h3>
            <p className="text-gray-600 text-sm">
              Structured receipt data designed for AI agents. Enable autonomous expense tracking, returns, and purchase insights.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
