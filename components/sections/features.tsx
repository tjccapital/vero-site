"use client";

import { Zap, Link2, Bot, Shield, LayoutDashboard } from "lucide-react";

export function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-indigo-600 mb-3">Platform</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
            Everything you need for digital receipts
          </h2>
        </div>

        {/* Feature cards - Top row */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          {/* Card 1 - Large */}
          <div className="md:col-span-2 bg-gradient-to-br from-slate-50 to-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg hover:shadow-gray-100/50 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Merchant portal
              </h3>
            </div>
            <p className="text-gray-500 text-sm mb-6 max-w-md">
              Self-serve receipt configuration, branding, and delivery settings.
            </p>

            {/* Mock UI */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              </div>
              <div className="p-5">
                <div className="flex gap-6 text-sm text-gray-400 border-b border-gray-100 pb-3 mb-4">
                  <span className="text-indigo-600 border-b-2 border-indigo-600 pb-3 -mb-3 font-medium">Receipts</span>
                  <span>Branding</span>
                  <span className="hidden sm:inline">Webhooks</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2.5 px-3 rounded-lg hover:bg-gray-50">
                    <span className="text-sm text-gray-700">Email delivery</span>
                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">Active</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 px-3 rounded-lg hover:bg-gray-50">
                    <span className="text-sm text-gray-700">Card app delivery</span>
                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">Active</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 px-3 rounded-lg hover:bg-gray-50">
                    <span className="text-sm text-gray-700">Push notifications</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">Setup</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-gradient-to-br from-slate-50 to-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg hover:shadow-gray-100/50 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Fraud prevention
              </h3>
            </div>
            <p className="text-gray-500 text-sm mb-6">
              Verifiable purchase records linked to transactions.
            </p>

            {/* Code snippet */}
            <div className="bg-gray-900 rounded-xl p-4 text-xs font-mono overflow-x-auto">
              <div className="text-gray-500">{"{"}</div>
              <div className="pl-3 text-gray-400">
                <span className="text-purple-400">&quot;txn&quot;</span>: <span className="text-emerald-400">&quot;txn_8x7k2&quot;</span>,
              </div>
              <div className="pl-3 text-gray-400">
                <span className="text-purple-400">&quot;hash&quot;</span>: <span className="text-emerald-400">&quot;0x8f3a...&quot;</span>,
              </div>
              <div className="pl-3 text-gray-400">
                <span className="text-purple-400">&quot;verified&quot;</span>: <span className="text-amber-400">true</span>
              </div>
              <div className="text-gray-500">{"}"}</div>
            </div>
          </div>
        </div>

        {/* Feature cards - Bottom row */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 3 */}
          <div className="bg-gradient-to-br from-slate-50 to-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg hover:shadow-gray-100/50 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Link2 className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Connected apps
              </h3>
            </div>
            <p className="text-gray-500 text-sm">
              Share receipts with expense tools, accounting software, and budgeting apps.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-gradient-to-br from-slate-50 to-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg hover:shadow-gray-100/50 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Real-time delivery
              </h3>
            </div>
            <p className="text-gray-500 text-sm">
              Receipts arrive before customers leave the store via webhooks.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-gradient-to-br from-slate-50 to-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg hover:shadow-gray-100/50 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                <Bot className="w-5 h-5 text-violet-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                AI agent ready
              </h3>
            </div>
            <p className="text-gray-500 text-sm">
              Structured data for AI agents enabling autonomous expense tracking.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
