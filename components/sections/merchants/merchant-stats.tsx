const stats = [
  { value: "80%", label: "Chargeback Reduction" },
  { value: "$0", label: "Integration Cost" },
  { value: "89%", label: "Consumers Want Digital Receipts" },
  { value: "<2 Min", label: "To Go Live" },
];

export function MerchantStats() {
  return (
    <section className="bg-gray-100 py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`text-center ${index > 0 ? "md:border-l md:border-gray-300" : ""}`}
            >
              <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
