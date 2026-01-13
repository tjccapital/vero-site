"use client";

import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import { Zap, Link2, Bot, Shield, LayoutDashboard, Code2 } from "lucide-react";

export function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-blue-600 mb-3">Platform</p>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
            Everything you need for digital receipts
          </h2>
        </div>

        {/* Bento Grid */}
        <BentoGrid>
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              icon={item.icon}
              className="md:col-span-2"
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}

const MerchantPortalHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-slate-50 to-white border border-gray-200 overflow-hidden">
    <div className="w-full">
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-gray-100 bg-gray-50/50">
        <div className="w-2 h-2 rounded-full bg-gray-300" />
        <div className="w-2 h-2 rounded-full bg-gray-300" />
        <div className="w-2 h-2 rounded-full bg-gray-300" />
      </div>
      <div className="p-4">
        <div className="flex gap-4 text-xs text-gray-400 border-b border-gray-100 pb-2 mb-3">
          <span className="text-blue-600 border-b-2 border-blue-600 pb-2 -mb-2 font-medium">Receipts</span>
          <span>Branding</span>
          <span className="hidden sm:inline">Webhooks</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center py-1.5 px-2 hover:bg-gray-50">
            <span className="text-xs text-gray-700">Email delivery</span>
            <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">Active</span>
          </div>
          <div className="flex justify-between items-center py-1.5 px-2 hover:bg-gray-50">
            <span className="text-xs text-gray-700">Card app delivery</span>
            <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">Active</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FraudPreventionHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] bg-gray-900 border border-gray-700 p-4">
    <div className="text-xs font-mono w-full">
      <div className="text-gray-500">{"{"}</div>
      <div className="pl-3 text-gray-400">
        <span className="text-blue-400">&quot;txn&quot;</span>: <span className="text-blue-300">&quot;txn_8x7k2&quot;</span>,
      </div>
      <div className="pl-3 text-gray-400">
        <span className="text-blue-400">&quot;hash&quot;</span>: <span className="text-blue-300">&quot;0x8f3a...&quot;</span>,
      </div>
      <div className="pl-3 text-gray-400">
        <span className="text-blue-400">&quot;verified&quot;</span>: <span className="text-blue-300">true</span>
      </div>
      <div className="text-gray-500">{"}"}</div>
    </div>
  </div>
);

const ConnectedAppsHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 items-center justify-center">
    <div className="flex gap-2">
      <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 flex items-center justify-center">
        <div className="w-5 h-5 bg-blue-500" />
      </div>
      <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 flex items-center justify-center">
        <div className="w-5 h-5 bg-blue-400" />
      </div>
      <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 flex items-center justify-center">
        <div className="w-5 h-5 bg-blue-600" />
      </div>
    </div>
  </div>
);

const RealTimeHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 items-center justify-center">
    <div className="flex items-center gap-3">
      <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
      <div className="h-0.5 w-12 bg-blue-300" />
      <div className="w-8 h-8 bg-white shadow-sm border border-gray-100 flex items-center justify-center">
        <Zap className="w-4 h-4 text-blue-500" />
      </div>
    </div>
  </div>
);

const AIAgentHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-4">
    <div className="w-full space-y-3">
      {/* User message */}
      <div className="flex items-start gap-2">
        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
          <span className="text-[8px] text-gray-600 font-medium">U</span>
        </div>
        <div className="bg-white border border-gray-200 px-2 py-1.5 text-[10px] text-gray-700">
          How much did I spend on fruits and vegetables last month?
        </div>
      </div>
      {/* Agent response */}
      <div className="flex items-start gap-2">
        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Bot className="w-3 h-3 text-blue-600" />
        </div>
        <div className="bg-blue-50 border border-blue-100 px-2 py-1.5 text-[10px] text-gray-700">
          Based on your receipts, you spent <span className="font-semibold">$127.43</span> on fruits and vegetables in December.
        </div>
      </div>
    </div>
  </div>
);

const DeveloperAPIHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] bg-gray-900 border border-gray-700 p-4">
    <div className="text-xs font-mono w-full">
      <div className="text-gray-500">$ curl -X POST https://api.vero.com/receipts</div>
      <div className="text-gray-400 mt-2">
        <span className="text-blue-400">{"{"}</span>
      </div>
      <div className="pl-3 text-gray-400">
        <span className="text-blue-300">&quot;status&quot;</span>: <span className="text-blue-300">&quot;delivered&quot;</span>,
      </div>
      <div className="pl-3 text-gray-400">
        <span className="text-blue-300">&quot;receipt_id&quot;</span>: <span className="text-blue-300">&quot;rec_9x2k4&quot;</span>
      </div>
      <div className="text-gray-400">
        <span className="text-blue-400">{"}"}</span>
      </div>
    </div>
  </div>
);

const items = [
  {
    title: "Merchant portal",
    description: "Self-serve receipt configuration, branding, and delivery settings.",
    header: <MerchantPortalHeader />,
    icon: <LayoutDashboard className="h-4 w-4 text-blue-600" />,
  },
  {
    title: "Fraud prevention",
    description: "Verifiable purchase records linked to transactions.",
    header: <FraudPreventionHeader />,
    icon: <Shield className="h-4 w-4 text-blue-600" />,
  },
  {
    title: "Connected apps",
    description: "Share receipts with expense tools, accounting software, and budgeting apps.",
    header: <ConnectedAppsHeader />,
    icon: <Link2 className="h-4 w-4 text-blue-600" />,
  },
  {
    title: "Real-time delivery",
    description: "Receipts arrive before customers leave the store via webhooks.",
    header: <RealTimeHeader />,
    icon: <Zap className="h-4 w-4 text-blue-600" />,
  },
  {
    title: "AI agent ready",
    description: "Structured data for AI agents enabling autonomous expense tracking.",
    header: <AIAgentHeader />,
    icon: <Bot className="h-4 w-4 text-blue-600" />,
  },
  {
    title: "Developer API",
    description: "RESTful API with webhooks, SDKs, and comprehensive documentation.",
    header: <DeveloperAPIHeader />,
    icon: <Code2 className="h-4 w-4 text-blue-600" />,
  },
];
