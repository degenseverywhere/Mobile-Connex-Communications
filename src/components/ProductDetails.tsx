"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, CheckCircle, ChevronRight } from "lucide-react";
import { type ShopifyProduct, formatPrice, getBrand } from "@/lib/shopify";

// ─── Color swatch lookup ──────────────────────────────────────────────────────

const COLOR_HEX: Record<string, string> = {
  "black": "#1A1A1A", "titanium black": "#1A1A1A", "midnight black": "#1A1A1A", "jetblack": "#1A1A1A",
  "graphite grey": "#4A4A4A", "titanium charcoal": "#3D3D3D", "titanium grey": "#6B7280",
  "silver": "#C8C8CA", "titanium whitesilver": "#E0E0E0", "silk white": "#F5F5F2",
  "white": "#F8F8F8", "aurora white": "#EEF2FF", "starlight": "#FAF6EF",
  "deep blue": "#1C3D6B", "titanium silverblue": "#6A8FA5",
  "blue": "#2979D2", "aurora blue": "#70B5E8", "twilight blue": "#4A7BAF",
  "velvet red": "#B22222", "cosmic orange": "#F5863C",
  "stellar pink": "#E88A9A", "titanium pinkgold": "#D4A0A0",
  "titanium jadegreen": "#3D7A6B",
  "aura gold": "#C8A84B", "gold": "#D4AF37",
  "dusk brown": "#8B6347", "plume purple": "#7B68EE", "violet purple": "#6A0DAD",
};

function swatchColor(name: string): string {
  const key = name.toLowerCase().trim();
  if (COLOR_HEX[key]) return COLOR_HEX[key];
  for (const [k, v] of Object.entries(COLOR_HEX)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return "#9CA3AF";
}

function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 180;
}

// ─── Spec formatter ───────────────────────────────────────────────────────────

const SPEC_ICONS: Record<string, string> = {
  display: "🖥️", screen: "🖥️",
  processor: "⚡", chip: "⚡",
  camera: "📷", "camera system": "📷",
  battery: "🔋",
  storage: "💾", "ram & storage": "💾", "ram": "💾",
  design: "✦", features: "✦",
  video: "🎬",
  durability: "🛡️",
};

function SpecLine({ label, value }: { label: string; value: string }) {
  const icon = SPEC_ICONS[label.toLowerCase()] ?? "•";
  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
      <span className="text-base mt-0.5 shrink-0 w-5 text-center">{icon}</span>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-mcx-gray mb-0.5">{label}</p>
        <p className="text-sm text-mcx-charcoal leading-relaxed">{value}</p>
      </div>
    </div>
  );
}

function formatSpecs(raw: string): Array<{ label: string; value: string }> | null {
  if (!raw) return null;
  // Try to parse "Label: value. Label: value." format
  const lines: Array<{ label: string; value: string }> = [];
  // Split on ". " boundary followed by a capital letter then ":"
  const parts = raw.split(/\.\s+(?=[A-Z][^:]+:)/);
  for (const part of parts) {
    const colonIdx = part.indexOf(":");
    if (colonIdx > 0 && colonIdx < 35) {
      const label = part.slice(0, colonIdx).replace(/^Phone:\s*/i, "").trim();
      const value = part.slice(colonIdx + 1).replace(/\.$/, "").trim();
      if (label && value) lines.push({ label, value });
    }
  }
  return lines.length >= 2 ? lines : null;
}

// ─── Variant parsing ──────────────────────────────────────────────────────────

type ParsedVariant = {
  id: string; title: string;
  color: string | null; storage: string | null;
  price: { amount: string; currencyCode: string };
  availableForSale: boolean;
  image: { url: string; altText: string | null } | null;
};

function isStoragePart(s: string) { return /\d+\s*(GB|TB|mb|\+)/i.test(s); }

function parseVariant(node: ShopifyProduct["variants"]["edges"][number]["node"]): ParsedVariant {
  const parts = node.title.split(" / ").map((p) => p.trim());
  let color: string | null = null;
  let storage: string | null = null;
  for (const part of parts) {
    if (isStoragePart(part)) storage = part;
    else color = part;
  }
  if (node.title === "Default Title") { color = null; storage = null; }
  return { id: node.id, title: node.title, color, storage, price: node.price, availableForSale: node.availableForSale, image: node.image ?? null };
}

function unique<T>(arr: T[]): T[] { return Array.from(new Set(arr)); }

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductDetails({
  product, brand, condition, allProducts,
}: {
  product: ShopifyProduct;
  brand: string;
  condition: string;
  allProducts: ShopifyProduct[];
}) {
  const parsed  = product.variants.edges.map((e) => parseVariant(e.node));
  const colors  = unique(parsed.map((v) => v.color).filter(Boolean) as string[]);
  const storages = unique(parsed.map((v) => v.storage).filter(Boolean) as string[]);
  const hasColors  = colors.length > 0;
  const hasStorages = storages.length > 0;

  const firstAvailable = parsed.find((v) => v.availableForSale);
  const [selColor,   setSelColor]   = useState<string | null>(firstAvailable?.color ?? colors[0] ?? null);
  const [selStorage, setSelStorage] = useState<string | null>(firstAvailable?.storage ?? storages[0] ?? null);

  // Active variant
  const activeVariant = parsed.find(
    (v) => (!hasColors || v.color === selColor) && (!hasStorages || v.storage === selStorage)
  ) ?? parsed[0];

  // Image: use variant's own image, fallback to featuredImage
  const activeImage = activeVariant?.image?.url ?? product.featuredImage?.url ?? null;

  const displayPrice = activeVariant
    ? formatPrice(activeVariant.price.amount, activeVariant.price.currencyCode)
    : formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode);

  const variantNumId = activeVariant?.id.split("/").pop();
  const checkoutUrl  = activeVariant?.availableForSale && variantNumId
    ? `https://frm6ba-yj.myshopify.com/cart/${variantNumId}:1`
    : null;

  function storageAvailable(s: string) {
    return parsed.some((v) => (!hasColors || v.color === selColor) && v.storage === s);
  }
  function colorAvailable(c: string) {
    return parsed.some((v) => v.color === c && (!hasStorages || v.storage === selStorage));
  }

  const specs = formatSpecs(product.description);
  const others = allProducts.filter((p) => p.handle !== product.handle);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">

        {/* ── Image ─────────────────────────────────────────────────────── */}
        <div className="sticky top-24">
          <div className="relative aspect-square rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden">
            {activeImage ? (
              <Image
                key={activeImage}
                src={activeImage}
                alt={`${product.title}${selColor ? ` — ${selColor}` : ""}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-8 transition-opacity duration-200"
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
          {/* Thumbnail strip */}
          {colors.length > 1 && (
            <div className="flex gap-2 mt-3 justify-center">
              {colors.map((color) => {
                const variant = parsed.find((v) => v.color === color);
                if (!variant?.image?.url) return null;
                return (
                  <button
                    key={color}
                    onClick={() => setSelColor(color)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      selColor === color ? "border-mcx-red" : "border-gray-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={variant.image.url} alt={color} width={56} height={56} className="object-contain w-full h-full p-1" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Info ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          {brand && <p className="text-sm font-bold text-mcx-red uppercase tracking-wider">{brand}</p>}
          <h1 className="text-2xl sm:text-3xl font-bold text-mcx-dark leading-snug">{product.title}</h1>
          <p className="text-3xl font-bold text-mcx-dark">{displayPrice}</p>

          {parsed.length > 1 && (
            <div className="flex flex-col gap-5">

              {/* Colour */}
              {hasColors && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-sm font-semibold text-mcx-dark">Colour</p>
                    {selColor && <span className="text-sm text-mcx-gray">— {selColor}</span>}
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {colors.map((color) => {
                      const available = colorAvailable(color);
                      const selected  = selColor === color;
                      const hex       = swatchColor(color);
                      const light     = isLight(hex);
                      return (
                        <button
                          key={color}
                          type="button"
                          title={color}
                          disabled={!available}
                          onClick={() => setSelColor(color)}
                          className={`relative w-9 h-9 rounded-full border-2 transition-all ${
                            selected  ? "border-mcx-red scale-110 shadow-md"
                            : available ? "border-gray-200 hover:border-mcx-red/60 hover:scale-105"
                            : "border-gray-100 opacity-30 cursor-not-allowed"
                          }`}
                          style={{ backgroundColor: hex }}
                        >
                          {selected && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <CheckCircle size={16} className={light ? "text-mcx-red" : "text-white"} />
                            </span>
                          )}
                          {!available && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="w-0.5 h-6 bg-gray-300 rotate-45 rounded-full" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Storage */}
              {hasStorages && (
                <div>
                  <p className="text-sm font-semibold text-mcx-dark mb-3">Storage</p>
                  <div className="flex flex-wrap gap-2">
                    {storages.map((s) => {
                      const available = storageAvailable(s);
                      const selected  = selStorage === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          disabled={!available}
                          onClick={() => setSelStorage(s)}
                          className={`px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${
                            selected  ? "border-mcx-red bg-mcx-red text-white"
                            : available ? "border-gray-200 text-mcx-charcoal hover:border-mcx-red/50"
                            : "border-gray-100 text-gray-300 line-through cursor-not-allowed"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CTA */}
          {checkoutUrl ? (
            <a href={checkoutUrl}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl bg-mcx-red text-white font-bold text-base hover:bg-mcx-red-dark transition-colors">
              <ShoppingCart size={18} /> Buy Now
            </a>
          ) : (
            <button disabled
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl bg-gray-100 text-gray-400 font-bold text-base cursor-not-allowed">
              Sold Out
            </button>
          )}

          {/* Specs */}
          {specs ? (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm font-bold text-mcx-dark mb-2">Specifications</p>
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                {specs.map(({ label, value }) => (
                  <SpecLine key={label} label={label} value={value} />
                ))}
              </div>
            </div>
          ) : product.description ? (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm font-bold text-mcx-dark mb-2">About this device</p>
              <p className="text-sm text-mcx-gray leading-relaxed">{product.description}</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* ── Browse other products ────────────────────────────────────────── */}
      {others.length > 0 && (
        <div className="mt-16 pt-10 border-t border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-mcx-dark">Browse Other Models</h2>
            <Link href="/new-phones" className="inline-flex items-center gap-1 text-sm font-semibold text-mcx-red hover:underline">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {others.slice(0, 4).map((p) => {
              const pb = getBrand(p);
              const inStock = p.variants.edges.some((e) => e.node.availableForSale);
              return (
                <Link key={p.id} href={`/products/${p.handle}`}
                  className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-mcx-red/30 hover:shadow-md transition-all">
                  <div className="aspect-square bg-gray-50 relative overflow-hidden">
                    {p.featuredImage ? (
                      <Image src={p.featuredImage.url} alt={p.title} fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-4xl text-gray-200">📱</div>
                    )}
                    {!inStock && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-gray-100 text-gray-400 text-xs font-medium rounded-full">Sold Out</span>
                    )}
                  </div>
                  <div className="p-3">
                    {pb && <p className="text-xs font-bold text-mcx-red uppercase tracking-wide mb-0.5">{pb}</p>}
                    <p className="text-sm font-semibold text-mcx-dark line-clamp-2 group-hover:text-mcx-red transition-colors leading-snug">
                      {p.title}
                    </p>
                    <p className="text-sm font-bold text-mcx-dark mt-1.5">
                      {formatPrice(p.priceRange.minVariantPrice.amount, p.priceRange.minVariantPrice.currencyCode)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
