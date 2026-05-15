const SHOP  = process.env.SHOPIFY_SHOP!;
const TOKEN = process.env.SHOPIFY_ACCESS_TOKEN!;

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
        image: { url: string; altText: string | null } | null;
      };
    }[];
  };
};

// ─── GraphQL executor ─────────────────────────────────────────────────────────

async function graphql<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const res = await fetch(
    `https://${SHOP}.myshopify.com/api/2025-01/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Shopify-Storefront-Private-Token": TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 300 }, // cache 5 min, re-fetch in background
    }
  );

  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`);
  const { data, errors } = await res.json();
  if (errors?.length) throw new Error(errors[0].message);
  return data as T;
}

// ─── Shared fragment ──────────────────────────────────────────────────────────

const FIELDS = `
  id title handle tags description
  priceRange { minVariantPrice { amount currencyCode } }
  featuredImage { url altText }
  variants(first: 20) {
    edges {
      node { id title price { amount currencyCode } availableForSale image { url altText } }
    }
  }
`;

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getAllProducts(limit = 8): Promise<ShopifyProduct[]> {
  const data = await graphql<{ products: { edges: { node: ShopifyProduct }[] } }>(
    `query($n: Int!) {
       products(first: $n, sortKey: CREATED_AT, reverse: true) {
         edges { node { ${FIELDS} } }
       }
     }`,
    { n: limit }
  );
  return data.products.edges.map((e) => e.node);
}

export async function getProductsByTag(tag: string, limit = 24): Promise<ShopifyProduct[]> {
  const data = await graphql<{ products: { edges: { node: ShopifyProduct }[] } }>(
    `query($q: String!, $n: Int!) {
       products(query: $q, first: $n, sortKey: CREATED_AT, reverse: true) {
         edges { node { ${FIELDS} } }
       }
     }`,
    { q: `tag:${tag}`, n: limit }
  );
  return data.products.edges.map((e) => e.node);
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await graphql<{ product: ShopifyProduct | null }>(
    `query($handle: String!) {
       product(handle: $handle) { ${FIELDS} }
     }`,
    { handle }
  );
  return data.product;
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
