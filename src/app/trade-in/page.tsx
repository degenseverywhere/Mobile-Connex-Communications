import { ArrowRight, CheckCircle } from "lucide-react";

export const metadata = { title: "Trade-In | Mobile Connex Communications" };

const BRANDS = ["Apple", "Samsung", "OPPO", "Xiaomi", "Google", "OnePlus", "Sony", "Other"];
const CONDITIONS = [
  { value: "mint",  label: "Mint",  desc: "Like new — no scratches, perfect screen" },
  { value: "good",  label: "Good",  desc: "Light scratches, works perfectly" },
  { value: "fair",  label: "Fair",  desc: "Visible wear, fully functional" },
  { value: "poor",  label: "Poor",  desc: "Heavy damage or hardware issues" },
];

export default function TradeInPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-mcx-dark mb-2">Get a Trade-In Quote</h1>
      <p className="text-mcx-gray mb-10">
        Fill in your device details and we&apos;ll get back to you with a valuation within 24 hours.
      </p>

      <form
        action="https://formspree.io/f/YOUR_FORM_ID"
        method="POST"
        className="flex flex-col gap-6 bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm"
      >
        {/* Brand */}
        <div>
          <label className="block text-sm font-semibold text-mcx-dark mb-2">Brand *</label>
          <select name="brand" required className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-mcx-red">
            <option value="">Select brand</option>
            {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-semibold text-mcx-dark mb-2">Model *</label>
          <input
            name="model"
            type="text"
            required
            placeholder="e.g. iPhone 15 Pro Max 256GB"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-mcx-red"
          />
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-semibold text-mcx-dark mb-3">Condition *</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CONDITIONS.map(({ value, label, desc }) => (
              <label key={value} className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-mcx-red transition-colors has-[:checked]:border-mcx-red has-[:checked]:bg-mcx-red-light">
                <input type="radio" name="condition" value={value} required className="mt-0.5 accent-[#F06B6B]" />
                <div>
                  <p className="text-sm font-semibold text-mcx-dark">{label}</p>
                  <p className="text-xs text-mcx-gray">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-mcx-dark mb-2">Your Name *</label>
            <input name="name" type="text" required placeholder="John Tan" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-mcx-red" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-mcx-dark mb-2">Phone / WhatsApp *</label>
            <input name="phone" type="tel" required placeholder="+65 9123 4567" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-mcx-red" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-mcx-dark mb-2">Email</label>
          <input name="email" type="email" placeholder="john@email.com" className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-mcx-red" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-mcx-dark mb-2">Additional notes</label>
          <textarea name="notes" rows={3} placeholder="Any accessories included, faults, etc." className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-mcx-red resize-none" />
        </div>

        <button type="submit" className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-mcx-red text-white font-bold text-base hover:bg-mcx-red-dark transition-colors">
          Submit Trade-In Request <ArrowRight size={18} />
        </button>
      </form>

      {/* What happens next */}
      <div className="mt-10 bg-gray-50 rounded-2xl p-6">
        <h2 className="font-bold text-mcx-dark mb-4">What happens next?</h2>
        <div className="flex flex-col gap-3">
          {[
            "We review your submission and check current market value",
            "We contact you within 24 hours with a quote via WhatsApp or email",
            "Bring your device to our store for inspection and same-day payment",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <CheckCircle size={18} className="text-mcx-red shrink-0 mt-0.5" />
              <p className="text-sm text-mcx-gray">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
