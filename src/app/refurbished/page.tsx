import { getProductsByTag } from "@/lib/shopify";
import ProductCard from "@/components/ProductCard";
import { RefreshCw } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Refurbished Phones | Mobile Connex Communications" };

const BRANDS     = ["All", "Apple", "Samsung", "OPPO"];
const CONDITIONS = ["All", "Mint", "Good", "Fair"];

const CONDITION_KEY = [
  { label: "Mint", desc: "Like new, minimal signs of use" },
  { label: "Good", desc: "Light scratches, fully functional" },
  { label: "Fair", desc: "Visible wear, 100% working" },
];

export default async function RefurbishedPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string; condition?: string }>;
}) {
  const { brand, condition } = await searchParams;
  const activeBrand     = brand     ?? "All";
  const activeCondition = condition ?? "All";

  const products = await getProductsByTag("Refurbished");
  const filtered = products.filter((p) => {
    const brandOk     = activeBrand     === "All" || p.tags.includes(activeBrand);
    const conditionOk = activeCondition === "All" || p.tags.includes(activeCondition);
    return brandOk && conditionOk;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-2">
        <RefreshCw className="text-mcx-red" size={28} />
        <h1 className="text-3xl font-bold text-mcx-dark">Refurbished Phones</h1>
      </div>
      <p className="text-mcx-gray mb-6">
        Tested, graded, and ready to use — quality devices at honest prices.
      </p>

      {/* Condition key */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CONDITION_KEY.map(({ label, desc }) => (
          <span key={label} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full text-xs">
            <strong className="text-mcx-charcoal">{label}:</strong>
            <span className="text-mcx-gray">{desc}</span>
          </span>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-6 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-mcx-gray uppercase tracking-wide">Brand</span>
          {BRANDS.map((b) => (
            <a
              key={b}
              href={`/refurbished?brand=${b}&condition=${activeCondition}`}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeBrand === b
                  ? "bg-mcx-red text-white border-mcx-red"
                  : "bg-white text-mcx-charcoal border-gray-200 hover:border-mcx-red hover:text-mcx-red"
              }`}
            >
              {b}
            </a>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-mcx-gray uppercase tracking-wide">Condition</span>
          {CONDITIONS.map((c) => (
            <a
              key={c}
              href={`/refurbished?brand=${activeBrand}&condition=${c}`}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeCondition === c
                  ? "bg-mcx-red text-white border-mcx-red"
                  : "bg-white text-mcx-charcoal border-gray-200 hover:border-mcx-red hover:text-mcx-red"
              }`}
            >
              {c}
            </a>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <RefreshCw size={40} className="mx-auto text-gray-200 mb-4" />
          <p className="font-medium text-mcx-gray">No refurbished stock matching those filters.</p>
          <p className="text-sm text-gray-400 mt-1">Check back soon or browse our new phones.</p>
          <Link href="/new-phones" className="inline-flex mt-5 px-5 py-2.5 rounded-lg bg-mcx-red text-white text-sm font-semibold hover:bg-mcx-red-dark transition-colors">
            Shop New Phones
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((p) => {
            const badge = ["Mint", "Good", "Fair"].find((c) => p.tags.includes(c));
            return <ProductCard key={p.id} product={p} badge={badge} />;
          })}
        </div>
      )}
    </div>
  );
}
