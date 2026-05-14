import { getProductByHandle, formatPrice, getBrand, getCondition } from "@/lib/shopify";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShoppingCart } from "lucide-react";

export function generateMetadata({ params }: { params: { handle: string } }) {
  const product = getProductByHandle(params.handle);
  if (!product) return {};
  return {
    title: `${product.title} | Mobile Connex Communications`,
    description: `Buy ${product.title} from Mobile Connex Communications. Trusted since 2007.`,
  };
}

export default function ProductPage({ params }: { params: { handle: string } }) {
  const product = getProductByHandle(params.handle);
  if (!product) notFound();

  const brand     = getBrand(product);
  const condition = getCondition(product);
  const { amount, currencyCode } = product.priceRange.minVariantPrice;
  const inStock = product.variants.edges.some((e) => e.node.availableForSale);

  // Build Shopify checkout URL
  const firstAvailable = product.variants.edges.find((e) => e.node.availableForSale);
  const variantId = firstAvailable?.node.id.split("/").pop();
  const checkoutUrl = variantId
    ? `https://frm6ba-yj.myshopify.com/cart/${variantId}:1`
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <Link href={condition ? "/refurbished" : "/new-phones"} className="inline-flex items-center gap-1.5 text-sm text-mcx-gray hover:text-mcx-red mb-8 transition-colors">
        <ArrowLeft size={14} /> Back
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Image */}
        <div className="relative aspect-square rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden">
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText ?? product.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-8"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-8xl text-gray-200">📱</div>
          )}
          {condition && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-mcx-red text-white">
              {condition}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          {brand && <p className="text-sm font-bold text-mcx-red uppercase tracking-wider">{brand}</p>}
          <h1 className="text-2xl sm:text-3xl font-bold text-mcx-dark leading-snug">{product.title}</h1>

          <p className="text-3xl font-bold text-mcx-dark">{formatPrice(amount, currencyCode)}</p>

          {/* Variants */}
          {product.variants.edges.length > 1 && (
            <div>
              <p className="text-sm font-semibold text-mcx-charcoal mb-2">Options</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.edges.map(({ node }) => (
                  <span
                    key={node.id}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${
                      node.availableForSale
                        ? "border-gray-200 text-mcx-charcoal"
                        : "border-gray-100 text-gray-300 line-through"
                    }`}
                  >
                    {node.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          {checkoutUrl && inStock ? (
            <a
              href={checkoutUrl}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl bg-mcx-red text-white font-bold text-base hover:bg-mcx-red-dark transition-colors"
            >
              <ShoppingCart size={18} /> Buy Now
            </a>
          ) : (
            <button disabled className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl bg-gray-100 text-gray-400 font-bold text-base cursor-not-allowed">
              Sold Out
            </button>
          )}

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
              {product.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs text-mcx-gray">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
