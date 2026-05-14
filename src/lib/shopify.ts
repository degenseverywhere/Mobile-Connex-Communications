import rawProducts from "@/data/products.json";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  tags: string[];
  description: string;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  featuredImage: { url: string; altText: string | null } | null;
  images: string[];
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        price: { amount: string; currencyCode: string };
        availableForSale: boolean;
      };
    }[];
  };
};

const ALL_PRODUCTS = rawProducts as ShopifyProduct[];

// ─── Public API ───────────────────────────────────────────────────────────────

export function getAllProducts(limit = 8): ShopifyProduct[] {
  return ALL_PRODUCTS.slice(0, limit);
}

export function getProductsByTag(tag: string, limit = 24): ShopifyProduct[] {
  return ALL_PRODUCTS.filter((p) => p.tags.includes(tag)).slice(0, limit);
}

export function getProductByHandle(handle: string): ShopifyProduct | null {
  return ALL_PRODUCTS.find((p) => p.handle === handle) ?? null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatPrice(amount: string, currency: string): string {
  const num = parseFloat(amount);
  if (num === 0) return "Contact for price";
  return new Intl.NumberFormat("en-SG", { style: "currency", currency }).format(num);
}

export function getBrand(product: ShopifyProduct): string {
  const brands = ["Apple", "Samsung", "OPPO", "Xiaomi", "Google", "OnePlus", "Sony"];
  return brands.find((b) => product.tags.includes(b)) ?? "";
}

export function getCondition(product: ShopifyProduct): string {
  return ["Mint", "Good", "Fair"].find((c) => product.tags.includes(c)) ?? "";
}
