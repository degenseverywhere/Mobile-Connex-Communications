import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { type ShopifyProduct, formatPrice, getBrand } from "@/lib/shopify";

type Props = { product: ShopifyProduct; badge?: string };

export default function ProductCard({ product, badge }: Props) {
  const { amount, currencyCode } = product.priceRange.minVariantPrice;
  const price = formatPrice(amount, currencyCode);
  const inStock = product.variants.edges.some((e) => e.node.availableForSale);
  const brand = getBrand(product);

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group relative flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-mcx-red/20 transition-all duration-200"
    >
      {badge && (
        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-xs font-semibold bg-mcx-red text-white">
          {badge}
        </span>
      )}
      {!inStock && (
        <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
          Sold Out
        </span>
      )}

      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.featuredImage ? (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-200 text-6xl">📱</div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 gap-1.5">
        {brand && <p className="text-xs font-semibold text-mcx-red uppercase tracking-wide">{brand}</p>}
        <h3 className="text-sm font-semibold text-mcx-dark leading-snug line-clamp-2 group-hover:text-mcx-red transition-colors">
          {product.title}
        </h3>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-mcx-gray">From</p>
            <p className="text-base font-bold text-mcx-dark">{price}</p>
          </div>
          <span className="p-2 rounded-lg bg-mcx-red-light text-mcx-red group-hover:bg-mcx-red group-hover:text-white transition-colors">
            <ShoppingCart size={16} />
          </span>
        </div>
      </div>
    </Link>
  );
}
