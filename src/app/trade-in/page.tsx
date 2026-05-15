import TradeInCalculator from "@/components/TradeInCalculator";

export const metadata = {
  title: "Trade-In | Mobile Connex Communications",
  description: "Get an instant trade-in price for your phone. Select your model and condition for a live quote.",
};

export default function TradeInPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-block px-3 py-1 rounded-full bg-mcx-red-light text-mcx-red text-xs font-semibold mb-4">
          Instant Quote
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-mcx-dark mb-3">
          Trade-In Calculator
        </h1>
        <p className="text-mcx-gray max-w-md mx-auto text-sm sm:text-base">
          Select your phone, pick your options, and get a real quote instantly.
          Bring it in-store for same-day payment.
        </p>
      </div>

      {/* Trust strip */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {[
          { icon: "⚡", label: "Instant quote" },
          { icon: "💰", label: "Same-day payment" },
          { icon: "🔒", label: "No obligation" },
        ].map(({ icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1 bg-gray-50 rounded-xl py-3 px-2 text-center border border-gray-100">
            <span className="text-lg">{icon}</span>
            <span className="text-xs font-medium text-mcx-charcoal">{label}</span>
          </div>
        ))}
      </div>

      <TradeInCalculator />
    </div>
  );
}
