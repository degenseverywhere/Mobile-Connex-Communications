import { getProductsByTag } from "@/lib/shopify";
import ProductCard from "@/components/ProductCard";
import { Smartphone } from "lucide-react";

export const metadata = { title: "New Phones | Mobile Connex Communications" };

const BRANDS = ["All", "Apple", "Samsung", "OPPO"];

export default async function NewPhonesPage({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string }>;
}) {
  const { brand } = await searchParams;
  const active = brand ?? "All";

  const products = await getProductsByTag("New");
  const filtered = active === "All" ? products : products.filter((p) => p.tags.includes(active));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-2">
        <Smartphone className="text-mcx-red" size={28} />
        <h1 className="text-3xl font-bold text-mcx-dark">New Phones</h1>
      </div>
      <p className="text-mcx-gray mb-8">
        Brand-new flagship and mid-range devices — sealed in box with full warranty.
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {BRANDS.map((b) => (
          <a
            key={b}
            href={b === "All" ? "/new-phones" : `/new-phones?brand=${b}`}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              active === b
                ? "bg-mcx-red text-white border-mcx-red"
                : "bg-white text-mcx-charcoal border-gray-200 hover:border-mcx-red hover:text-mcx-red"
            }`}
          >
            {b}
          </a>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center text-mcx-gray">
          No {active} phones in stock right now — check back soon.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} badge="New" />
          ))}
        </div>
      )}
    </div>
  );
}
