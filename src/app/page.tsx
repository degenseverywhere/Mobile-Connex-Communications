import Link from "next/link";
import { ArrowRight, ShieldCheck, RefreshCw, Zap } from "lucide-react";
import { getAllProducts } from "@/lib/shopify";
import ProductCard from "@/components/ProductCard";

export const metadata = {
  title: "Mobile Connex Communications | New & Refurbished Phones Singapore",
  description: "Trusted phone dealer since 2007. Buy new and refurbished phones or trade in your device.",
};

const TRUST = [
  { icon: ShieldCheck, title: "Trusted Since 2007", desc: "18+ years serving Singapore customers" },
  { icon: RefreshCw,   title: "Quality Guaranteed", desc: "Every device tested before sale" },
  { icon: Zap,         title: "Instant Trade-In",   desc: "Get a quote for your device in seconds" },
];

export default function Home() {
  const featured = getAllProducts(4);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-white to-mcx-red-light border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 flex flex-col items-center text-center gap-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-mcx-red-light border border-mcx-red/20 text-mcx-red text-xs font-semibold">
            ⭐ Trusted Since 2007 · Singapore
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-mcx-dark leading-tight max-w-3xl">
            New &amp; Refurbished Phones{" "}
            <span className="text-mcx-red">You Can Trust</span>
          </h1>
          <p className="max-w-xl text-lg text-mcx-gray leading-relaxed">
            Singapore&apos;s go-to phone dealer for new flagship and quality refurbished
            devices — fully tested, honestly priced.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/new-phones"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-mcx-red text-white font-semibold hover:bg-mcx-red-dark transition-colors"
            >
              Shop New Phones <ArrowRight size={16} />
            </Link>
            <Link
              href="/refurbished"
              className="px-6 py-3 rounded-lg border-2 border-mcx-red text-mcx-red font-semibold hover:bg-mcx-red-light transition-colors"
            >
              Shop Refurbished
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TRUST.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-mcx-red-light shrink-0">
                <Icon size={20} className="text-mcx-red" />
              </div>
              <div>
                <p className="font-semibold text-mcx-dark text-sm">{title}</p>
                <p className="text-xs text-mcx-gray mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-mcx-dark">Latest Arrivals</h2>
          <Link
            href="/new-phones"
            className="flex items-center gap-1 text-sm font-semibold text-mcx-red hover:underline"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} badge="New" />
          ))}
        </div>
      </section>

      {/* Trade-in CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="rounded-2xl bg-mcx-dark px-8 py-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            What&apos;s your old phone worth?
          </h2>
          <p className="text-gray-400 max-w-md mx-auto mb-8">
            Get an instant trade-in valuation and put it toward your next device.
          </p>
          <Link
            href="/trade-in"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-mcx-red text-white font-semibold hover:bg-mcx-red-dark transition-colors"
          >
            Get Trade-In Value <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
