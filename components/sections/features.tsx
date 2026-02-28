"use client";

import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import { Zap, Bot, Receipt, Store, BarChart3, MessageCircleQuestion } from "lucide-react";

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
        <span className="text-xs font-medium text-gray-700">Recent Receipts</span>
        <span className="text-[10px] text-gray-400">Today</span>
      </div>
      <div className="p-3 space-y-2">
        {/* Receipt 1 */}
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-primary-600">C</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-900">Coffee Shop</div>
            <div className="text-[10px] text-gray-400">3 items &middot; 12:30 PM</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-900">$11.29</span>
            <Receipt className="w-3.5 h-3.5 text-primary-600" />
          </div>
        </div>
        {/* Receipt 2 */}
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-green-600">W</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-900">Whole Foods</div>
            <div className="text-[10px] text-gray-400">14 items &middot; 10:15 AM</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-900">$47.82</span>
            <Receipt className="w-3.5 h-3.5 text-primary-600" />
          </div>
        </div>
        {/* Receipt 3 */}
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-purple-600">T</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-900">Target</div>
            <div className="text-[10px] text-gray-400">6 items &middot; Yesterday</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-900">$23.50</span>
            <Receipt className="w-3.5 h-3.5 text-primary-600" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ItemizedReceiptHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-slate-50 to-white border border-gray-200 overflow-hidden">
    <div className="w-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50/50">
        <span className="text-xs font-medium text-gray-700">Whole Foods</span>
        <span className="text-[10px] text-gray-400">$47.82</span>
      </div>
      <div className="p-3 space-y-1.5">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-gray-700">Organic Bananas</span>
          <span className="text-gray-500">$1.49</span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-gray-700">Sourdough Bread</span>
          <span className="text-gray-500">$5.99</span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-gray-700">Greek Yogurt x2</span>
          <span className="text-gray-500">$8.98</span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-gray-700">Chicken Breast</span>
          <span className="text-gray-500">$12.49</span>
        </div>
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-gray-700">Almond Milk</span>
          <span className="text-gray-500">$4.29</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-gray-400">
          <span>+ 9 more items...</span>
        </div>
      </div>
    </div>
  </div>
);

const ExpenseChartHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-slate-50 to-white border border-gray-200 overflow-hidden">
    <div className="w-full p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-700">Monthly Spending</span>
        <span className="text-[10px] text-gray-400">From your receipts</span>
      </div>
      <div className="space-y-1.5">
        {/* Groceries */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 w-16 flex-shrink-0">Groceries</span>
          <div className="flex-1 h-3 bg-gray-100 rounded-sm overflow-hidden">
            <div className="h-full bg-[#1e3a8a] rounded-sm" style={{ width: "70%" }} />
          </div>
          <span className="text-[10px] font-medium text-gray-700 w-10 text-right">$412</span>
        </div>
        {/* Restaurants */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 w-16 flex-shrink-0">Dining</span>
          <div className="flex-1 h-3 bg-gray-100 rounded-sm overflow-hidden">
            <div className="h-full bg-[#1e3a8a] rounded-sm" style={{ width: "48%" }} />
          </div>
          <span className="text-[10px] font-medium text-gray-700 w-10 text-right">$283</span>
        </div>
        {/* Shopping */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 w-16 flex-shrink-0">Shopping</span>
          <div className="flex-1 h-3 bg-gray-100 rounded-sm overflow-hidden">
            <div className="h-full bg-[#1e3a8a] rounded-sm" style={{ width: "38%" }} />
          </div>
          <span className="text-[10px] font-medium text-gray-700 w-10 text-right">$224</span>
        </div>
        {/* Coffee */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 w-16 flex-shrink-0">Coffee</span>
          <div className="flex-1 h-3 bg-gray-100 rounded-sm overflow-hidden">
            <div className="h-full bg-[#1e3a8a] rounded-sm" style={{ width: "25%" }} />
          </div>
          <span className="text-[10px] font-medium text-gray-700 w-10 text-right">$147</span>
        </div>
        {/* Health */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 w-16 flex-shrink-0">Health</span>
          <div className="flex-1 h-3 bg-gray-100 rounded-sm overflow-hidden">
            <div className="h-full bg-[#1e3a8a] rounded-sm" style={{ width: "18%" }} />
          </div>
          <span className="text-[10px] font-medium text-gray-700 w-10 text-right">$106</span>
        </div>
        {/* Gas */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500 w-16 flex-shrink-0">Gas</span>
          <div className="flex-1 h-3 bg-gray-100 rounded-sm overflow-hidden">
            <div className="h-full bg-[#1e3a8a] rounded-sm" style={{ width: "14%" }} />
          </div>
          <span className="text-[10px] font-medium text-gray-700 w-10 text-right">$82</span>
        </div>
      </div>
    </div>
  </div>
);

const RealTimeHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 items-center justify-center">
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-center gap-1">
        <Store className="w-4 h-4 text-gray-500" />
        <span className="text-[8px] text-gray-400">Store</span>
      </div>
      <div className="h-0.5 w-8 bg-blue-300" />
      <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
      <div className="h-0.5 w-8 bg-blue-300" />
      <div className="flex flex-col items-center gap-1">
        <Receipt className="w-4 h-4 text-primary-600" />
        <span className="text-[8px] text-gray-400">You</span>
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
          How much did I spend on coffee this month?
        </div>
      </div>
      {/* Agent response */}
      <div className="flex items-start gap-2">
        <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Bot className="w-3 h-3 text-primary-600" />
        </div>
        <div className="bg-blue-50 border border-blue-100 px-2 py-1.5 text-[10px] text-gray-700">
          You spent <span className="font-semibold">$147.20</span> across 28 visits. Your most frequent stop is Blue Bottle at <span className="font-semibold">$62.40</span>.
        </div>
      </div>
    </div>
  </div>
);

const MerchantDeliveryHeader = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] bg-gradient-to-br from-slate-50 to-white border border-gray-200 overflow-hidden">
    <div className="w-full p-4">
      <div className="flex items-center gap-2 mb-3">
        <Store className="w-4 h-4 text-gray-500" />
        <span className="text-xs font-medium text-gray-700">Connected Merchants</span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-3 p-2 bg-white border border-gray-100 rounded-lg">
          <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
            <span className="text-[9px] font-bold text-green-600">W</span>
          </div>
          <span className="text-[10px] text-gray-700 flex-1">Whole Foods</span>
          <span className="text-[9px] text-green-600 font-medium">142 receipts</span>
        </div>
        <div className="flex items-center gap-3 p-2 bg-white border border-gray-100 rounded-lg">
          <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
            <span className="text-[9px] font-bold text-red-600">T</span>
          </div>
          <span className="text-[10px] text-gray-700 flex-1">Target</span>
          <span className="text-[9px] text-green-600 font-medium">89 receipts</span>
        </div>
        <div className="flex items-center gap-3 p-2 bg-white border border-gray-100 rounded-lg">
          <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
            <span className="text-[9px] font-bold text-blue-600">C</span>
          </div>
          <span className="text-[10px] text-gray-700 flex-1">Costco</span>
          <span className="text-[9px] text-green-600 font-medium">36 receipts</span>
        </div>
      </div>
    </div>
  </div>
);

const items = [
  {
    title: "Receipts delivered automatically",
    description: "Merchants send itemized receipts straight to your Vero app every time you tap your card. No scanning, no email digging.",
    header: <TransactionListHeader />,
    icon: <Receipt className="h-4 w-4 text-primary-600" />,
    className: "col-span-2 md:col-span-2",
  },
  {
    title: "Every item, every purchase",
    description: "See exactly what you bought — every line item, every price, every receipt. No more guessing what that $47.82 charge was.",
    header: <ItemizedReceiptHeader />,
    icon: <Receipt className="h-4 w-4 text-primary-600" />,
    className: "col-span-2 md:col-span-2",
  },
  {
    title: "Instant delivery",
    description: "Receipts arrive moments after you pay.",
    header: <RealTimeHeader />,
    icon: <Zap className="h-4 w-4 text-primary-600" />,
    className: "col-span-1 md:col-span-1",
  },
  {
    title: "All your spending in one place",
    description: "Every receipt from every store, organized by category. Your complete spending picture, powered by real receipt data.",
    header: <ExpenseChartHeader />,
    icon: <BarChart3 className="h-4 w-4 text-primary-600" />,
    className: "col-span-1 md:col-span-3",
  },
  {
    title: "Ask questions about your spending",
    description: "Ask anything about your purchases and get instant answers. Take control of your expenses with data from your actual receipts.",
    header: <AIAgentHeader />,
    icon: <MessageCircleQuestion className="h-4 w-4 text-primary-600" />,
    className: "col-span-2 md:col-span-2",
  },
  {
    title: "Your merchants, all in one app",
    description: "Every store you shop at delivers receipts to Vero. One app for all your itemized purchase history.",
    header: <MerchantDeliveryHeader />,
    icon: <Store className="h-4 w-4 text-primary-600" />,
    className: "col-span-2 md:col-span-2",
  },
];
