"use client";

import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import { Zap, Link2, Bot, Shield, Smartphone, Code2, Receipt, Settings } from "lucide-react";
import { useState, useEffect } from "react";

export function Features() {
  return (
    <section className="py-12 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bento Grid */}
        <BentoGrid>
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              icon={item.icon}
              className={item.className}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}

const TransactionListHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-slate-50 to-white border border-gray-200 overflow-hidden">
    <div className="w-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50/50">
        <span className="text-xs font-medium text-gray-700">Recent Transactions</span>
        <span className="text-[10px] text-gray-400">Today</span>
      </div>
      <div className="p-3 space-y-2">
        {/* Transaction 1 */}
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-gray-600">C</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-900">Coffee Shop</div>
            <div className="text-[10px] text-gray-400">12:30 PM</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-900">-$11.29</span>
            <Receipt className="w-3.5 h-3.5 text-primary-600" />
          </div>
        </div>
        {/* Transaction 2 */}
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-gray-600">G</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-900">Grocery Store</div>
            <div className="text-[10px] text-gray-400">10:15 AM</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-900">-$47.82</span>
            <Receipt className="w-3.5 h-3.5 text-primary-600" />
          </div>
        </div>
        {/* Transaction 3 */}
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-gray-600">P</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-900">Pharmacy</div>
            <div className="text-[10px] text-gray-400">Yesterday</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-900">-$23.50</span>
            <Receipt className="w-3.5 h-3.5 text-primary-600" />
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

const ExpenseChartHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-slate-50 to-white border border-gray-200 overflow-hidden">
    <div className="w-full p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-700">Grocery Breakdown</span>
        <span className="text-[10px] text-gray-400">From receipts</span>
      </div>
      <div className="space-y-1.5">
        {/* Produce */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 w-12 flex-shrink-0">Produce</span>
          <div className="flex-1 h-3 bg-gray-100 rounded-sm overflow-hidden">
            <div className="h-full bg-[#1e3a8a] rounded-sm" style={{ width: "70%" }} />
          </div>
          <span className="text-[10px] font-medium text-gray-700 w-8 text-right">$87</span>
        </div>
        {/* Dairy */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 w-12 flex-shrink-0">Dairy</span>
          <div className="flex-1 h-3 bg-gray-100 rounded-sm overflow-hidden">
            <div className="h-full bg-[#1e3a8a] rounded-sm" style={{ width: "52%" }} />
          </div>
          <span className="text-[10px] font-medium text-gray-700 w-8 text-right">$45</span>
        </div>
        {/* Meat */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 w-12 flex-shrink-0">Meat</span>
          <div className="flex-1 h-3 bg-gray-100 rounded-sm overflow-hidden">
            <div className="h-full bg-[#1e3a8a] rounded-sm" style={{ width: "48%" }} />
          </div>
          <span className="text-[10px] font-medium text-gray-700 w-8 text-right">$42</span>
        </div>
        {/* Bakery */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 w-12 flex-shrink-0">Bakery</span>
          <div className="flex-1 h-3 bg-gray-100 rounded-sm overflow-hidden">
            <div className="h-full bg-[#1e3a8a] rounded-sm" style={{ width: "37%" }} />
          </div>
          <span className="text-[10px] font-medium text-gray-700 w-8 text-right">$32</span>
        </div>
        {/* Snacks */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 w-12 flex-shrink-0">Snacks</span>
          <div className="flex-1 h-3 bg-gray-100 rounded-sm overflow-hidden">
            <div className="h-full bg-[#1e3a8a] rounded-sm" style={{ width: "28%" }} />
          </div>
          <span className="text-[10px] font-medium text-gray-700 w-8 text-right">$24</span>
        </div>
        {/* Beverages */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 w-12 flex-shrink-0">Drinks</span>
          <div className="flex-1 h-3 bg-gray-100 rounded-sm overflow-hidden">
            <div className="h-full bg-[#1e3a8a] rounded-sm" style={{ width: "22%" }} />
          </div>
          <span className="text-[10px] font-medium text-gray-700 w-8 text-right">$19</span>
        </div>
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
          <Bot className="w-3 h-3 text-primary-600" />
        </div>
        <div className="bg-blue-50 border border-blue-100 px-2 py-1.5 text-[10px] text-gray-700">
          Based on your receipts, you spent <span className="font-semibold">$127.43</span> on fruits and vegetables in December.
        </div>
      </div>
    </div>
  </div>
);

const OneClickToggleHeader = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Auto-toggle animation
    const interval = setInterval(() => {
      setEnabled(prev => !prev);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-slate-50 to-white border border-gray-200 overflow-hidden">
      <div className="w-full p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-gray-500" />
          <span className="text-xs font-medium text-gray-700">Digital Receipt Settings</span>
        </div>

        {/* Toggle Row */}
        <div className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg">
          <div>
            <div className="text-xs font-medium text-gray-900">Enable Digital Receipts</div>
            <div className="text-[10px] text-gray-400">Receive itemized receipts for all purchases</div>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
              enabled ? 'bg-[#1e3a8a]' : 'bg-gray-200'
            }`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Status Info */}
        <div className={`mt-3 space-y-1.5 transition-opacity duration-300 ${enabled ? 'opacity-100' : 'opacity-40'}`}>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-gray-500">Status</span>
            <span className={`font-medium ${enabled ? 'text-green-600' : 'text-gray-400'}`}>
              {enabled ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const items = [
  {
    title: "Consumer Native Card App",
    description: "Receipts delivered directly to your customers' banking apps.",
    header: <TransactionListHeader />,
    icon: <Smartphone className="h-4 w-4 text-primary-600" />,
    className: "md:col-span-2",
  },
  {
    title: "Fraud prevention",
    description: "Verifiable purchase records linked to transactions.",
    header: <FraudPreventionHeader />,
    icon: <Shield className="h-4 w-4 text-primary-600" />,
    className: "md:col-span-2",
  },
  {
    title: "Real-time delivery",
    description: "Receipts arrive before customers leave the store via webhooks.",
    header: <RealTimeHeader />,
    icon: <Zap className="h-4 w-4 text-primary-600" />,
    className: "md:col-span-1",
  },
  {
    title: "Better Data Tracking",
    description: "Track spending by category from itemized receipt data.",
    header: <ExpenseChartHeader />,
    icon: <Link2 className="h-4 w-4 text-primary-600" />,
    className: "md:col-span-3",
  },
  {
    title: "AI agent ready",
    description: "Structured data for AI agents enabling autonomous expense tracking.",
    header: <AIAgentHeader />,
    icon: <Bot className="h-4 w-4 text-primary-600" />,
    className: "md:col-span-2",
  },
  {
    title: "One Click Integration",
    description: "Enable digital receipts for your users with a simple toggle.",
    header: <OneClickToggleHeader />,
    icon: <Code2 className="h-4 w-4 text-primary-600" />,
    className: "md:col-span-2",
  },
];
