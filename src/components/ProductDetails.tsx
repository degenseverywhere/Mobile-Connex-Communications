"use client";

import { useState } from "react";
import Image from "next/image";
import { ShoppingCart, CheckCircle } from "lucide-react";
import { type ShopifyProduct, formatPrice } from "@/lib/shopify";

// ─── Color swatch lookup ──────────────────────────────────────────────────────

const COLOR_HEX: Record<string, string> = {
  // Neutrals / metals
  "black": "#1A1A1A", "titanium black": "#1A1A1A", "midnight black": "#1A1A1A",
  "graphite grey": "#4A4A4A", "titanium charcoal": "#3D3D3D", "titanium grey": "#6B7280",
  "silver": "#C8C8CA", "titanium whitesilver": "#E0E0E0", "silk white": "#F5F5F2",
  "white": "#F8F8F8", "aurora white": "#F0F4FF", "starlight": "#FAF6EF",
  "natural": "#C8BBA8",

  // Blues
  "deep blue": "#1C3D6B", "titanium silverblue": "#6A8FA5", "blue": "#2979D2",
  "aurora blue": "#70B5E8", "twilight blue": "#4A7BAF",

  // Reds / Pinks
  "velvet red": "#B22222", "product red": "#FF3B30", "cosmic orange": "#F5863C",
  "stellar pink": "#E88A9A", "titanium pinkgold": "#D4A0A0",

  // Greens
  "titanium jadegreen": "#3D7A6B",

  // Yellows / Golds
  "aura gold": "#C8A84B", "gold": "#D4AF37", "desert titanium": "#C9A882",

  // Purples / Browns
  "dusk brown": "#8B6347", "plume purple": "#7B68EE", "violet purple": "#6A0DAD",
  "graphite": "#454545",
};

function swatchColor(colorName: string): string {
  const key = colorName.toLowerCase().trim();
  // Exact match
  if (COLOR_HEX[key]) return COLOR_HEX[key];
  // Partial match
  for (const [k, v] of Object.entries(COLOR_HEX)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return "#9CA3AF"; // fallback gray
}

// ─── Variant parsing ──────────────────────────────────────────────────────────

type ParsedVariant = {
  id: string;
  title: string;
  color: string | null;
  storage: string | null;
  price: { amount: string; currencyCode: string };
  availableForSale: boolean;
};

function isStoragePart(s: string): boolean {
  return /\d+\s*(GB|TB|mb|\+)/i.test(s);
}

function parseVariant(node: ShopifyProduct["variants"]["edges"][number]["node"]): ParsedVariant {
  const parts = node.title.split(" / ").map((p) => p.trim());
  let color: string | null = null;
  let storage: string | null = null;

  for (const part of parts) {
    if (isStoragePart(part)) storage = part;
    else color = part;
  }

  // "Default Title" — single-variant products
  if (node.title === "Default Title") { color = null; storage = null; }

  return { id: node.id, title: node.title, color, storage, price: node.price, availableForSale: node.availableForSale };
}

function uniqueOrdered<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductDetails({
  product,
  brand,
  condition,
}: {
  product: ShopifyProduct;
  brand: string;
  condition: string;
}) {
  const parsed = product.variants.edges.map((e) => parseVariant(e.node));

  const colors   = uniqueOrdered(parsed.map((v) => v.color).filter(Boolean) as string[]);
  const storages = uniqueOrdered(parsed.map((v) => v.storage).filter(Boolean) as string[]);

  const hasColors   = colors.length > 0;
  const hasStorages = storages.length > 0;
  const isMultiVariant = product.variants.edges.length > 1;

  // Default selections — first available
  const firstAvailable = parsed.find((v) => v.availableForSale);
  const [selColor,   setSelColor]   = useState<string | null>(firstAvailable?.color ?? colors[0] ?? null);
  const [selStorage, setSelStorage] = useState<string | null>(firstAvailable?.storage ?? storages[0] ?? null);

  // Active variant: match both selected color and storage
  const activeVariant = parsed.find(
    (v) =>
      (!hasColors   || v.color   === selColor) &&
      (!hasStorages || v.storage === selStorage)
  ) ?? parsed[0];

  // Image: map color → image by index in images array
  const colorIndex   = selColor ? colors.indexOf(selColor) : 0;
  const activeImage  =
    (product.images?.length > 0 && colorIndex >= 0)
      ? (product.images[Math.min(colorIndex, product.images.length - 1)] ?? product.featuredImage?.url)
      : product.featuredImage?.url;

  const activeImageAlt = `${product.title}${selColor ? ` — ${selColor}` : ""}`;

  // Price from active variant
  const displayPrice = activeVariant
    ? formatPrice(activeVariant.price.amount, activeVariant.price.currencyCode)
    : formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode);

  // Checkout URL
  const variantNumId = activeVariant?.id.split("/").pop();
  const checkoutUrl  = activeVariant?.availableForSale && variantNumId
    ? `https://frm6ba-yj.myshopify.com/cart/${variantNumId}:1`
    : null;

  // Is a storage available given the current selected color?
  function storageAvailable(storage: string): boolean {
    return parsed.some((v) => (!hasColors || v.color === selColor) && v.storage === storage);
  }

  // Is a color available given the current selected storage?
  function colorAvailable(color: string): boolean {
    return parsed.some((v) => v.color === color && (!hasStorages || v.storage === selStorage));
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">

      {/* ── Image ───────────────────────────────────────────────────────── */}
      <div className="relative aspect-square rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden">
        {activeImage ? (
          <Image
            key={activeImage}
            src={activeImage}
            alt={activeImageAlt}
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
        {/* Color label overlay */}
        {selColor && (
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm whitespace-nowrap">
            {selColor}
          </span>
        )}
      </div>

      {/* ── Info ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5">
        {brand && <p className="text-sm font-bold text-mcx-red uppercase tracking-wider">{brand}</p>}
        <h1 className="text-2xl sm:text-3xl font-bold text-mcx-dark leading-snug">{product.title}</h1>
        <p className="text-3xl font-bold text-mcx-dark">{displayPrice}</p>

        {isMultiVariant && (
          <div className="flex flex-col gap-5">

            {/* Color row */}
            {hasColors && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-sm font-semibold text-mcx-dark">Colour</p>
                  {selColor && (
                    <span className="text-sm text-mcx-gray">— {selColor}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {colors.map((color) => {
                    const available = colorAvailable(color);
                    const selected  = selColor === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        title={color}
                        disabled={!available}
                        onClick={() => setSelColor(color)}
                        className={`relative w-9 h-9 rounded-full border-2 transition-all ${
                          selected
                            ? "border-mcx-red scale-110 shadow-md"
                            : available
                            ? "border-gray-200 hover:border-mcx-red/60 hover:scale-105"
                            : "border-gray-100 opacity-30 cursor-not-allowed"
                        }`}
                        style={{ backgroundColor: swatchColor(color) }}
                      >
                        {selected && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <CheckCircle
                              size={16}
                              className={
                                swatchColor(color) === "#F8F8F8" || swatchColor(color) === "#F5F5F2"
                                  ? "text-mcx-red"
                                  : "text-white"
                              }
                            />
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

            {/* Storage row */}
            {hasStorages && (
              <div>
                <p className="text-sm font-semibold text-mcx-dark mb-3">Storage</p>
                <div className="flex flex-wrap gap-2">
                  {storages.map((storage) => {
                    const available = storageAvailable(storage);
                    const selected  = selStorage === storage;
                    return (
                      <button
                        key={storage}
                        type="button"
                        disabled={!available}
                        onClick={() => setSelStorage(storage)}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${
                          selected
                            ? "border-mcx-red bg-mcx-red text-white"
                            : available
                            ? "border-gray-200 text-mcx-charcoal hover:border-mcx-red/50"
                            : "border-gray-100 text-gray-300 line-through cursor-not-allowed"
                        }`}
                      >
                        {storage}
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
          <a
            href={checkoutUrl}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl bg-mcx-red text-white font-bold text-base hover:bg-mcx-red-dark transition-colors"
          >
            <ShoppingCart size={18} /> Buy Now
          </a>
        ) : (
          <button
            disabled
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-xl bg-gray-100 text-gray-400 font-bold text-base cursor-not-allowed"
          >
            Sold Out
          </button>
        )}

        {/* Description */}
        {product.description && (
          <div className="pt-4 border-t border-gray-100">
            <p className="text-sm font-semibold text-mcx-dark mb-2">About this device</p>
            <p className="text-sm text-mcx-gray leading-relaxed">{product.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
