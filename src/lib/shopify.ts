import { URLSearchParams } from "node:url";

const SHOP   = process.env.SHOPIFY_SHOP!;
const ID     = process.env.SHOPIFY_CLIENT_ID!;
const SECRET = process.env.SHOPIFY_CLIENT_SECRET!;

// ─── Token cache (persists across requests in the same serverless worker) ─────

let cachedToken: string | null = null;
let expiresAt = 0;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < expiresAt - 60_000) return cachedToken;

  const res = await fetch(
    `https://${SHOP}.myshopify.com/admin/oauth/access_token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type:    "client_credentials",
        client_id:     ID,
        client_secret: SECRET,
      }),
    }
  );

  if (!res.ok) throw new Error(`Shopify token request failed: ${res.status}`);
  const { access_token, expires_in } = await res.json();
  cachedToken = access_token as string;
  expiresAt   = Date.now() + (expires_in as number) * 1_000;
  return cachedToken;
}

// ─── GraphQL executor (Storefront API, private server-side token) ─────────────

async function graphql<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const token = await getToken();

  const res = await fetch(
    `https://${SHOP}.myshopify.com/api/2025-01/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Shopify-Storefront-Private-Token": token,
      },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) throw new Error(`Shopify GraphQL failed: ${res.status}`);
  const { data, errors } = await res.json();
  if (errors?.length) throw new Error(errors[0].message);
  return data as T;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  tags: string[];
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  featuredImage: { url: string; altText: string | null } | null;
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

type ProductsData = {
  products: { edges: { node: ShopifyProduct }[] };
};

type ProductData = {
  product: ShopifyProduct | null;
};

// ─── Shared fragment ──────────────────────────────────────────────────────────

const FIELDS = `
  id title handle tags
  priceRange { minVariantPrice { amount currencyCode } }
  featuredImage { url altText }
  variants(first: 20) {
    edges {
      node { id title price { amount currencyCode } availableForSale }
    }
  }
`;

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getProductsByTag(tag: string, limit = 24): Promise<ShopifyProduct[]> {
  const data = await graphql<ProductsData>(
    `query($q: String!, $n: Int!) {
       products(query: $q, first: $n, sortKey: CREATED_AT, reverse: true) {
         edges { node { ${FIELDS} } }
       }
     }`,
    { q: `tag:${tag}`, n: limit }
  );
  return data.products.edges.map((e) => e.node);
}

export async function getAllProducts(limit = 8): Promise<ShopifyProduct[]> {
  const data = await graphql<ProductsData>(
    `query($n: Int!) {
       products(first: $n, sortKey: CREATED_AT, reverse: true) {
         edges { node { ${FIELDS} } }
       }
     }`,
    { n: limit }
  );
  return data.products.edges.map((e) => e.node);
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await graphql<ProductData>(
    `query($handle: String!) {
       product(handle: $handle) { ${FIELDS} description descriptionHtml }
     }`,
    { handle }
  );
  return data.product;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatPrice(amount: string, currency: string): string {
  return new Intl.NumberFormat("en-SG", { style: "currency", currency }).format(
    parseFloat(amount)
  );
}

export function getBrand(product: ShopifyProduct): string {
  const brands = ["Apple", "Samsung", "OPPO", "Xiaomi", "Google", "OnePlus", "Sony"];
  return brands.find((b) => product.tags.includes(b)) ?? "";
}

export function getCondition(product: ShopifyProduct): string {
  const conditions = ["Mint", "Good", "Fair"];
  return conditions.find((c) => product.tags.includes(c)) ?? "";
}
