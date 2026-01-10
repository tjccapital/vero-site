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
              Embeddable admin portal
            </h3>
            <p className="text-gray-600 text-sm mb-6 max-w-md">
              Let your enterprise customers self-serve receipt configuration, data export setup, and organization settings.
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
                  <span className="text-blue-600 border-b-2 border-blue-600 pb-3 -mb-3">SSO</span>
                  <span>Organization</span>
                  <span>Members</span>
                  <span>SCIM</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-900">Google SAML</span>
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Active</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-900">Okta OIDC</span>
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Active</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-900">Custom SAML</span>
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 hover:border-gray-300 transition-colors">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Enterprise-grade encryption
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              From passkeys, to breach-resistant encryption, to SAML SSO.
            </p>

            {/* Code snippet */}
            <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono overflow-x-auto">
              <div className="text-gray-500">
                <span className="text-purple-400">const</span>{" "}
                <span className="text-blue-300">config</span>{" "}
                <span className="text-white">=</span> {"{"}
              </div>
              <div className="text-gray-500 pl-4">
                products: [
              </div>
              <div className="pl-8">
                <span className="bg-blue-500/20 text-blue-300 px-1 rounded">&apos;passkeys&apos;</span>
              </div>
              <div className="text-gray-500 pl-4">]</div>
              <div className="text-gray-500">{"}"}</div>
            </div>
          </div>
        </div>

        {/* Feature cards - Bottom row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Card 3 */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 hover:border-gray-300 transition-colors">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Connect your users to other applications
            </h3>
            <p className="text-gray-600 text-sm">
              Power cross-application data sharing with secure, user-consented receipt exports.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 hover:border-gray-300 transition-colors">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Machine-to-machine authentication
            </h3>
            <p className="text-gray-600 text-sm">
              Enable your services to securely communicate with receipt APIs using OAuth 2.0.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 hover:border-gray-300 transition-colors">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Turnkey multi-tenancy
            </h3>
            <p className="text-gray-600 text-sm">
              Including organization policies, IdP-driven role mapping, JIT provisioning controls, SCIM and more.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
