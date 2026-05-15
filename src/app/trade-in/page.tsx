import TradeInForm from "@/components/TradeInForm";

export const metadata = {
  title: "Trade-In | Mobile Connex Communications",
  description: "Get an instant trade-in valuation for your phone. We buy new and used devices — Apple, Samsung, OPPO and more.",
};

export default function TradeInPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-block px-3 py-1 rounded-full bg-mcx-red-light text-mcx-red text-xs font-semibold mb-4">
          Instant Valuation
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-mcx-dark mb-3">
          What&apos;s your device worth?
        </h1>
        <p className="text-mcx-gray max-w-lg mx-auto">
          Get a real-time estimate in minutes. No obligation — we&apos;ll contact you with a final offer after a quick inspection.
        </p>
      </div>

      {/* Trust strip */}
      <div className="grid grid-cols-3 gap-4 mb-10 text-center">
        {[
          { icon: "⚡", label: "Same-day payment" },
          { icon: "🔒", label: "No hidden fees" },
          { icon: "📱", label: "All brands accepted" },
        ].map(({ icon, label }) => (
          <div key={label} className="bg-gray-50 rounded-xl py-3 px-2">
            <p className="text-xl mb-1">{icon}</p>
            <p className="text-xs font-medium text-mcx-charcoal">{label}</p>
          </div>
        ))}
      </div>

      {/* Form card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
        <TradeInForm />
      </div>
    </div>
  );
}
