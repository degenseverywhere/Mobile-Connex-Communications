"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, CheckCircle, ChevronRight, Minus, Plus } from "lucide-react";
import products from "@/data/products.json";
import {
  TRADE_IN, CONDITIONS, BATTERY_OPTIONS,
  type ConditionValue, type BatteryValue,
} from "@/data/tradein";
import { formatPrice, getBrand } from "@/lib/shopify";

// ─── Types ────────────────────────────────────────────────────────────────────

type Product = (typeof products)[number];

type Selection = {
  storage: string;
  condition: ConditionValue | null;
  battery: BatteryValue | null;
};

type ContactForm = { name: string; email: string; phone: string };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcTotal(handle: string, sel: Selection): number | null {
  const cfg = TRADE_IN[handle];
  if (!cfg || !sel.condition || !sel.battery || !sel.storage) return null;
  const storageAdj  = cfg.storage.find((s) => s.label === sel.storage)?.adj ?? 0;
  const conditionAdj = CONDITIONS.find((c) => c.value === sel.condition)?.adj ?? 0;
  const batteryAdj  = BATTERY_OPTIONS.find((b) => b.value === sel.battery)?.adj ?? 0;
  return Math.max(0, cfg.base + storageAdj + conditionAdj + batteryAdj);
}

// ─── Phone SVG condition illustrations ───────────────────────────────────────

function PhoneIllustration({ condition }: { condition: "flawless" | "light" | "heavy" }) {
  return (
    <svg viewBox="0 0 56 96" className="w-full h-full" aria-hidden>
      <rect x="4" y="2" width="48" height="92" rx="8" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1.5"/>
      <rect x="8" y="12" width="40" height="70" rx="3"
        fill={condition === "heavy" ? "#fee2e2" : "#dbeafe"}/>
      <rect x="20" y="5" width="16" height="4" rx="2" fill="#9ca3af"/>
      <rect x="20" y="87" width="16" height="3" rx="1.5" fill="#9ca3af"/>
      {condition === "light" && (
        <g stroke="#94a3b8" strokeWidth="0.8" opacity="0.8">
          <line x1="16" y1="22" x2="24" y2="32"/>
          <line x1="32" y1="45" x2="38" y2="52"/>
        </g>
      )}
      {condition === "heavy" && (
        <g stroke="#ef4444" strokeWidth="1.2" opacity="0.85">
          <line x1="22" y1="16" x2="14" y2="34"/>
          <line x1="22" y1="16" x2="36" y2="28"/>
          <line x1="36" y1="28" x2="44" y2="50"/>
          <line x1="14" y1="34" x2="10" y2="58"/>
          <line x1="36" y1="28" x2="32" y2="62"/>
          <circle cx="22" cy="16" r="3" fill="#fca5a5" stroke="none" opacity="0.7"/>
        </g>
      )}
    </svg>
  );
}

// ─── Option chip ──────────────────────────────────────────────────────────────

function Chip({
  selected, onClick, children, sub,
}: {
  selected: boolean; onClick: () => void; children: React.ReactNode; sub?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center justify-center px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
        selected
          ? "border-mcx-red bg-mcx-red text-white"
          : "border-gray-200 bg-white text-mcx-charcoal hover:border-mcx-red/50"
      }`}
    >
      {children}
      {sub && <span className={`text-xs font-normal mt-0.5 ${selected ? "text-white/80" : "text-mcx-gray"}`}>{sub}</span>}
    </button>
  );
}

// ─── Price breakdown row ──────────────────────────────────────────────────────

function PriceLine({ label, amount, highlight = false }: { label: string; amount: number | null; highlight?: boolean }) {
  if (amount === null) return null;
  const display = amount === 0 ? "—" : (amount > 0 ? `+S$${amount}` : `-S$${Math.abs(amount)}`);
  return (
    <div className={`flex items-center justify-between text-sm ${highlight ? "font-bold text-mcx-dark pt-3 mt-3 border-t border-gray-200 text-base" : "text-mcx-gray"}`}>
      <span>{label}</span>
      <span className={amount < 0 ? "text-red-500" : amount > 0 ? "text-green-600" : "text-mcx-gray"}>{display}</span>
    </div>
  );
}

// ─── Step 1: Product grid ─────────────────────────────────────────────────────

function ProductGrid({ onSelect }: { onSelect: (p: Product) => void }) {
  // Only show products that have a trade-in config
  const eligible = products.filter((p) => TRADE_IN[p.handle]);

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-mcx-dark mb-2">Select your phone</h2>
        <p className="text-mcx-gray text-sm">Choose the model you want to trade in.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {eligible.map((product) => {
          const cfg = TRADE_IN[product.handle];
          const brand = getBrand(product as Parameters<typeof getBrand>[0]);
          return (
            <button
              key={product.id}
              type="button"
              onClick={() => onSelect(product)}
              className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-mcx-red/30 hover:shadow-lg transition-all text-left"
            >
              <div className="aspect-square bg-gray-50 relative overflow-hidden">
                {product.featuredImage ? (
                  <Image
                    src={product.featuredImage.url}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-5xl text-gray-200">📱</div>
                )}
              </div>
              <div className="p-3 flex flex-col gap-1">
                {brand && <p className="text-xs font-bold text-mcx-red uppercase tracking-wide">{brand}</p>}
                <p className="text-sm font-semibold text-mcx-dark leading-snug line-clamp-2 group-hover:text-mcx-red transition-colors">
                  {product.title}
                </p>
                <p className="text-xs text-mcx-gray mt-1">
                  Trade-in from <strong className="text-mcx-dark">S${cfg.base.toLocaleString()}</strong>
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 2: Calculator ───────────────────────────────────────────────────────

function Calculator({
  product, onBack, onNext,
}: {
  product: Product;
  onBack: () => void;
  onNext: (total: number, sel: Selection) => void;
}) {
  const cfg = TRADE_IN[product.handle]!;
  const [sel, setSel] = useState<Selection>({
    storage: cfg.storage[0].label,
    condition: null,
    battery: null,
  });

  const total = calcTotal(product.handle, sel);
  const ready = sel.condition !== null && sel.battery !== null;
  const storageAdj = cfg.storage.find((s) => s.label === sel.storage)?.adj ?? 0;
  const conditionAdj = CONDITIONS.find((c) => c.value === sel.condition)?.adj ?? 0;
  const batteryAdj = BATTERY_OPTIONS.find((b) => b.value === sel.battery)?.adj ?? 0;

  return (
    <div>
      {/* Back */}
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-mcx-gray hover:text-mcx-dark mb-6 transition-colors">
        <ArrowLeft size={15} /> Choose a different phone
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* Left: product identity + price panel */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Product card */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            {product.featuredImage && (
              <div className="relative w-16 h-16 shrink-0">
                <Image
                  src={product.featuredImage.url}
                  alt={product.title}
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-mcx-red uppercase tracking-wide">{getBrand(product as Parameters<typeof getBrand>[0])}</p>
              <p className="font-semibold text-mcx-dark text-sm leading-snug">{product.title}</p>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-mcx-gray mb-4">Price Breakdown</p>

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-mcx-gray">Base trade-in</span>
                <span className="font-semibold text-mcx-dark">S${cfg.base.toLocaleString()}</span>
              </div>

              {storageAdj !== 0 && (
                <PriceLine label={`Storage: ${sel.storage}`} amount={storageAdj} />
              )}
              {sel.condition && (
                <PriceLine
                  label={`Condition: ${CONDITIONS.find(c => c.value === sel.condition)?.label}`}
                  amount={conditionAdj}
                />
              )}
              {sel.battery && (
                <PriceLine
                  label={`Battery: ${BATTERY_OPTIONS.find(b => b.value === sel.battery)?.label}`}
                  amount={batteryAdj}
                />
              )}

              {/* Total */}
              <div className="pt-3 mt-1 border-t border-gray-100">
                {total !== null ? (
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-mcx-dark">Your quote</span>
                    <span className="text-2xl font-bold text-mcx-red">S${total.toLocaleString()}</span>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-xs text-mcx-gray">Select all options to see your price</p>
                    <div className="flex justify-center gap-1.5 mt-2">
                      {[sel.condition === null, sel.battery === null].map((missing, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${missing ? "bg-gray-200" : "bg-mcx-red"}`} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {ready && total !== null && (
            <button
              type="button"
              onClick={() => onNext(total, sel)}
              className="w-full py-4 rounded-xl bg-mcx-red text-white font-bold text-base hover:bg-mcx-red-dark transition-colors flex items-center justify-center gap-2"
            >
              Get this quote <ChevronRight size={18} />
            </button>
          )}
        </div>

        {/* Right: selectors */}
        <div className="lg:col-span-3 flex flex-col gap-7">

          {/* Storage */}
          {cfg.storage.length > 1 && (
            <div>
              <p className="text-sm font-bold text-mcx-dark mb-3">Storage Capacity</p>
              <div className="flex flex-wrap gap-2">
                {cfg.storage.map(({ label, adj }) => (
                  <Chip
                    key={label}
                    selected={sel.storage === label}
                    onClick={() => setSel((s) => ({ ...s, storage: label }))}
                    sub={adj > 0 ? `+S$${adj}` : undefined}
                  >
                    {label}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {/* Condition */}
          <div>
            <p className="text-sm font-bold text-mcx-dark mb-3">Screen &amp; Body Condition</p>
            <div className="grid grid-cols-3 gap-3">
              {CONDITIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setSel((s) => ({ ...s, condition: c.value }))}
                  className={`relative flex flex-col items-center text-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                    sel.condition === c.value
                      ? "border-mcx-red bg-mcx-red-light shadow-sm"
                      : "border-gray-200 bg-white hover:border-mcx-red/40"
                  }`}
                >
                  {sel.condition === c.value && (
                    <span className="absolute top-2 right-2">
                      <CheckCircle size={14} className="text-mcx-red" />
                    </span>
                  )}
                  <div className="w-12 h-20">
                    <PhoneIllustration condition={c.value} />
                  </div>
                  <div>
                    <p className={`text-xs font-bold leading-tight ${sel.condition === c.value ? "text-mcx-red" : "text-mcx-dark"}`}>
                      {c.label}
                    </p>
                    <p className="text-xs text-mcx-gray mt-0.5">{c.desc}</p>
                    {c.adj !== 0 && (
                      <p className="text-xs font-semibold text-red-500 mt-1">−S${Math.abs(c.adj)}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Battery */}
          <div>
            <p className="text-sm font-bold text-mcx-dark mb-1">Battery Health</p>
            <p className="text-xs text-mcx-gray mb-3">
              Find this in <strong>Settings → Battery → Battery Health</strong> (iPhone) or <strong>Settings → Battery</strong> (Android).
            </p>
            <div className="flex flex-col gap-2">
              {BATTERY_OPTIONS.map((b) => (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => setSel((s) => ({ ...s, battery: b.value }))}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-sm ${
                    sel.battery === b.value
                      ? "border-mcx-red bg-mcx-red-light"
                      : "border-gray-200 bg-white hover:border-mcx-red/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Battery icon */}
                    <div className={`flex items-center gap-0.5 ${sel.battery === b.value ? "text-mcx-red" : "text-mcx-gray"}`}>
                      {b.value === "95-100" && (
                        <svg width="22" height="12" viewBox="0 0 22 12"><rect x="1" y="1" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none"/><rect x="2" y="2" width="16" height="8" rx="1.5" fill="currentColor" opacity="0.9"/><path d="M19 4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      )}
                      {b.value === "90-94" && (
                        <svg width="22" height="12" viewBox="0 0 22 12"><rect x="1" y="1" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none"/><rect x="2" y="2" width="13" height="8" rx="1.5" fill="currentColor" opacity="0.85"/><path d="M19 4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      )}
                      {b.value === "85-89" && (
                        <svg width="22" height="12" viewBox="0 0 22 12"><rect x="1" y="1" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none"/><rect x="2" y="2" width="10" height="8" rx="1.5" fill="currentColor" opacity="0.8"/><path d="M19 4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      )}
                      {b.value === "below-85" && (
                        <svg width="22" height="12" viewBox="0 0 22 12"><rect x="1" y="1" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none"/><rect x="2" y="2" width="6" height="8" rx="1.5" fill="#ef4444" opacity="0.9"/><path d="M19 4v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      )}
                    </div>
                    <span className={`font-semibold ${sel.battery === b.value ? "text-mcx-red" : "text-mcx-dark"}`}>{b.label}</span>
                  </div>
                  <span className={`text-xs font-semibold ${b.adj === 0 ? "text-green-600" : "text-red-500"}`}>
                    {b.adj === 0 ? "Full value" : `−S$${Math.abs(b.adj)}`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Contact form ─────────────────────────────────────────────────────

function ContactStep({
  product, total, sel, onBack,
}: {
  product: Product;
  total: number;
  sel: Selection;
  onBack: () => void;
}) {
  const [form, setForm] = useState<ContactForm>({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof ContactForm, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/trade-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          model: product.title,
          handle: product.handle,
          storage: sel.storage,
          condition: CONDITIONS.find(c => c.value === sel.condition)?.label,
          battery: BATTERY_OPTIONS.find(b => b.value === sel.battery)?.label,
          estimatedValue: total,
        }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError("Something went wrong. Please WhatsApp us directly.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center text-center py-14 gap-5">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-mcx-dark mb-1">Quote Submitted!</h2>
          <p className="text-mcx-gray">We&apos;ll contact you within 24 hours to confirm your offer.</p>
        </div>
        <div className="bg-mcx-red-light border border-mcx-red/20 rounded-2xl px-8 py-5 w-full max-w-xs">
          <p className="text-xs text-mcx-gray uppercase tracking-wide font-semibold mb-1">Your estimated offer</p>
          <p className="text-4xl font-bold text-mcx-red">S${total.toLocaleString()}</p>
          <p className="text-xs text-mcx-gray mt-2">{product.title} · {sel.storage}</p>
          <p className="text-xs text-mcx-gray">Subject to in-store inspection</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm text-mcx-gray hover:text-mcx-dark mb-6 transition-colors">
        <ArrowLeft size={15} /> Edit options
      </button>

      {/* Summary banner */}
      <div className="bg-mcx-red-light border border-mcx-red/20 rounded-2xl p-5 mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-mcx-gray font-semibold uppercase tracking-wide mb-0.5">Your quote</p>
          <p className="text-3xl font-bold text-mcx-red">S${total.toLocaleString()}</p>
          <p className="text-xs text-mcx-gray mt-1">
            {product.title} · {sel.storage} · {CONDITIONS.find(c => c.value === sel.condition)?.label}
          </p>
        </div>
        {product.featuredImage && (
          <div className="relative w-16 h-16 shrink-0">
            <Image src={product.featuredImage.url} alt={product.title} fill sizes="64px" className="object-contain" />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-mcx-dark mb-1.5">Full Name *</label>
            <input required value={form.name} onChange={e => set("name", e.target.value)}
              placeholder="John Tan"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-mcx-red" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-mcx-dark mb-1.5">WhatsApp *</label>
            <input required value={form.phone} onChange={e => set("phone", e.target.value)}
              placeholder="+65 9123 4567" type="tel"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-mcx-red" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-mcx-dark mb-1.5">Email *</label>
          <input required value={form.email} onChange={e => set("email", e.target.value)}
            placeholder="john@email.com" type="email"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-mcx-red" />
        </div>
        {error && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full py-4 rounded-xl bg-mcx-red text-white font-bold text-base hover:bg-mcx-red-dark transition-colors disabled:opacity-60">
          {loading ? "Submitting…" : "Confirm Quote & Submit"}
        </button>
        <p className="text-xs text-center text-mcx-gray">
          We&apos;ll reach out via WhatsApp to arrange a time. Payment is made on the spot after inspection.
        </p>
      </form>
    </div>
  );
}

// ─── Root orchestrator ────────────────────────────────────────────────────────

type Step = "select" | "calc" | "contact";

export default function TradeInCalculator() {
  const [step, setStep]        = useState<Step>("select");
  const [product, setProduct]  = useState<Product | null>(null);
  const [total, setTotal]      = useState(0);
  const [finalSel, setFinalSel] = useState<Selection | null>(null);

  return (
    <div>
      {step === "select" && (
        <ProductGrid onSelect={(p) => { setProduct(p); setStep("calc"); }} />
      )}
      {step === "calc" && product && (
        <Calculator
          product={product}
          onBack={() => setStep("select")}
          onNext={(t, s) => { setTotal(t); setFinalSel(s); setStep("contact"); }}
        />
      )}
      {step === "contact" && product && finalSel && (
        <ContactStep
          product={product}
          total={total}
          sel={finalSel}
          onBack={() => setStep("calc")}
        />
      )}
    </div>
  );
}
