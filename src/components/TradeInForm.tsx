"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, CheckCircle, Smartphone, RefreshCw } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const BRANDS = ["Apple", "Samsung", "OPPO", "Xiaomi", "Google", "OnePlus", "Others"];

const MODELS: Record<string, string[]> = {
  Apple: [
    "iPhone 17 Pro Max", "iPhone 17 Pro", "iPhone 17",
    "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16", "iPhone 16e",
    "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15",
    "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14",
    "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13", "iPhone 13 mini",
    "iPhone 12 Pro Max", "iPhone 12 Pro", "iPhone 12", "iPhone 12 mini",
    "iPhone 11 Pro Max", "iPhone 11 Pro", "iPhone 11",
    "iPhone SE (3rd gen)", "iPhone SE (2nd gen)",
  ],
  Samsung: [
    "Galaxy S25 Ultra", "Galaxy S25+", "Galaxy S25",
    "Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24", "Galaxy S24 FE",
    "Galaxy S23 Ultra", "Galaxy S23+", "Galaxy S23", "Galaxy S23 FE",
    "Galaxy Z Fold 6", "Galaxy Z Fold 5", "Galaxy Z Fold 4",
    "Galaxy Z Flip 6", "Galaxy Z Flip 5", "Galaxy Z Flip 4",
    "Galaxy A55 5G", "Galaxy A35 5G", "Galaxy A25 5G",
  ],
  OPPO: [
    "Find X9 Pro", "Find X9", "Find X8 Pro", "Find X8",
    "Reno15 Pro Max", "Reno15 5G", "Reno 15F 5G", "Reno 13F 5G",
    "A6 Pro 5G", "A6x 5G", "A79 5G", "A78 5G",
  ],
  Xiaomi: [
    "Xiaomi 15 Ultra", "Xiaomi 15", "Xiaomi 14 Ultra", "Xiaomi 14",
    "Redmi Note 14 Pro+", "Redmi Note 14 Pro", "Redmi Note 13 Pro+",
    "POCO F6 Pro", "POCO F6", "POCO F5 Pro",
  ],
  Google: [
    "Pixel 9 Pro Fold", "Pixel 9 Pro XL", "Pixel 9 Pro", "Pixel 9",
    "Pixel 8 Pro", "Pixel 8", "Pixel 7 Pro", "Pixel 7",
  ],
  OnePlus: [
    "OnePlus 13", "OnePlus 12", "OnePlus 11",
    "OnePlus 13R", "OnePlus 12R", "OnePlus Nord 4", "OnePlus Nord CE 4",
  ],
  Others: ["Other model (please specify in notes)"],
};

const STORAGE_OPTIONS = ["64GB", "128GB", "256GB", "512GB", "1TB", "2TB"];

const BASE_VALUES: Record<string, number> = {
  "iPhone 17 Pro Max": 1250, "iPhone 17 Pro": 1050, "iPhone 17": 850,
  "iPhone 16 Pro Max": 950, "iPhone 16 Pro": 780, "iPhone 16": 620, "iPhone 16e": 420,
  "iPhone 15 Pro Max": 720, "iPhone 15 Pro": 600, "iPhone 15": 490,
  "iPhone 14 Pro Max": 560, "iPhone 14 Pro": 460, "iPhone 14": 360,
  "iPhone 13 Pro Max": 420, "iPhone 13 Pro": 340, "iPhone 13": 260, "iPhone 13 mini": 210,
  "iPhone 12 Pro Max": 290, "iPhone 12 Pro": 230, "iPhone 12": 190, "iPhone 12 mini": 155,
  "iPhone 11 Pro Max": 205, "iPhone 11 Pro": 170, "iPhone 11": 125,
  "iPhone SE (3rd gen)": 120, "iPhone SE (2nd gen)": 90,
  "Galaxy S25 Ultra": 860, "Galaxy S25+": 710, "Galaxy S25": 590,
  "Galaxy S24 Ultra": 720, "Galaxy S24+": 560, "Galaxy S24": 460, "Galaxy S24 FE": 360,
  "Galaxy S23 Ultra": 560, "Galaxy S23+": 410, "Galaxy S23": 330, "Galaxy S23 FE": 260,
  "Galaxy Z Fold 6": 910, "Galaxy Z Fold 5": 760, "Galaxy Z Fold 4": 580,
  "Galaxy Z Flip 6": 560, "Galaxy Z Flip 5": 430, "Galaxy Z Flip 4": 320,
  "Galaxy A55 5G": 220, "Galaxy A35 5G": 170, "Galaxy A25 5G": 130,
  "Find X9 Pro": 710, "Find X9": 610, "Find X8 Pro": 590, "Find X8": 490,
  "Reno15 Pro Max": 460, "Reno15 5G": 360, "Reno 15F 5G": 260, "Reno 13F 5G": 210,
  "A6 Pro 5G": 200, "A6x 5G": 120,
};

// ─── Valuation ────────────────────────────────────────────────────────────────

function calcValue(s: FormState): number {
  const base = BASE_VALUES[s.model] ?? 150;

  if (s.condition === "new") {
    let v = base * 1.1; // new premium
    if (s.setType === "export") v *= 0.9;
    if (s.activation === "activated") v *= 0.95;
    return Math.round(v);
  }

  // Used
  let v = base;
  const batteryPenalty: Record<string, number> = {
    "90+": 0, "85-89": 30, "80-84": 50, "75-79": 80, "<75": 120,
  };
  const screenPenalty: Record<string, number> = {
    flawless: 0, minor: 30, obvious: 60, cracked: 120,
  };
  const exteriorPenalty: Record<string, number> = {
    flawless: 0, minor: 20, obvious: 40, cracked: 80,
  };
  const conditionMultiplier: Record<string, number> = {
    mint: 1, good: 0.9, fair: 0.8, poor: 0.65,
  };

  v -= batteryPenalty[s.batteryHealth] ?? 0;
  v -= screenPenalty[s.screenCondition] ?? 0;
  v -= exteriorPenalty[s.exteriorCondition] ?? 0;
  v *= conditionMultiplier[s.overallCondition] ?? 1;

  return Math.max(20, Math.round(v));
}

// ─── Types ────────────────────────────────────────────────────────────────────

type FormState = {
  condition: "new" | "used" | "";
  brand: string; model: string; storage: string; color: string;
  activation: "activated" | "unactivated" | "";
  setType: "local" | "export" | "";
  batteryHealth: "90+" | "85-89" | "80-84" | "75-79" | "<75" | "";
  overallCondition: "mint" | "good" | "fair" | "poor" | "";
  screenCondition: "flawless" | "minor" | "obvious" | "cracked" | "";
  exteriorCondition: "flawless" | "minor" | "obvious" | "cracked" | "";
  name: string; email: string; phone: string; notes: string;
};

const INIT: FormState = {
  condition: "", brand: "", model: "", storage: "", color: "",
  activation: "", setType: "",
  batteryHealth: "", overallCondition: "", screenCondition: "", exteriorCondition: "",
  name: "", email: "", phone: "", notes: "",
};

// ─── Damage phone SVGs ────────────────────────────────────────────────────────

function PhoneSVG({ variant }: { variant: "flawless" | "minor" | "obvious" | "cracked" }) {
  return (
    <svg viewBox="0 0 70 120" className="w-full h-full" aria-hidden>
      {/* Body */}
      <rect x="8" y="4" width="54" height="112" rx="9" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1.5"/>
      {/* Screen */}
      <rect x="12" y="16" width="46" height="82" rx="3" fill={
        variant === "cracked" ? "#fde8e8" : "#dbeafe"
      }/>
      {/* Camera notch */}
      <rect x="26" y="8" width="18" height="5" rx="2.5" fill="#9ca3af"/>
      {/* Home/button bar */}
      <rect x="27" y="104" width="16" height="3" rx="1.5" fill="#9ca3af"/>

      {/* Damage overlays */}
      {variant === "minor" && (
        <g stroke="#94a3b8" strokeWidth="0.8" opacity="0.7">
          <line x1="22" y1="30" x2="30" y2="38"/>
          <line x1="40" y1="55" x2="46" y2="60"/>
        </g>
      )}
      {variant === "obvious" && (
        <g stroke="#64748b" strokeWidth="1" opacity="0.8">
          <line x1="18" y1="25" x2="32" y2="42"/>
          <line x1="38" y1="50" x2="50" y2="65"/>
          <line x1="25" y1="60" x2="35" y2="72"/>
          <line x1="42" y1="30" x2="52" y2="40"/>
        </g>
      )}
      {variant === "cracked" && (
        <g stroke="#ef4444" strokeWidth="1.2" opacity="0.85">
          <line x1="28" y1="22" x2="20" y2="38"/>
          <line x1="28" y1="22" x2="42" y2="35"/>
          <line x1="42" y1="35" x2="50" y2="55"/>
          <line x1="20" y1="38" x2="15" y2="65"/>
          <line x1="42" y1="35" x2="38" y2="70"/>
          <line x1="38" y1="70" x2="30" y2="88"/>
          {/* Star burst at impact */}
          <circle cx="28" cy="22" r="3" fill="#fca5a5" stroke="none" opacity="0.6"/>
        </g>
      )}
    </svg>
  );
}

function BackSVG({ variant }: { variant: "flawless" | "minor" | "obvious" | "cracked" }) {
  return (
    <svg viewBox="0 0 70 120" className="w-full h-full" aria-hidden>
      <rect x="8" y="4" width="54" height="112" rx="9" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1.5"/>
      {/* Camera module */}
      <rect x="14" y="12" width="24" height="26" rx="5" fill="#9ca3af"/>
      <circle cx="20" cy="22" r="5" fill="#4b5563"/>
      <circle cx="32" cy="22" r="5" fill="#4b5563"/>
      <circle cx="20" cy="34" r="5" fill="#4b5563"/>
      <circle cx="32" cy="34" r="5" fill="#6b7280"/>
      {variant === "minor" && (
        <g stroke="#94a3b8" strokeWidth="0.8" opacity="0.7">
          <line x1="44" y1="50" x2="55" y2="62"/>
          <line x1="20" y1="70" x2="28" y2="78"/>
        </g>
      )}
      {variant === "obvious" && (
        <g stroke="#64748b" strokeWidth="1" opacity="0.8">
          <line x1="42" y1="48" x2="58" y2="68"/>
          <line x1="18" y1="68" x2="30" y2="82"/>
          <line x1="35" y1="55" x2="45" y2="70"/>
        </g>
      )}
      {variant === "cracked" && (
        <g stroke="#dc2626" strokeWidth="1.3" opacity="0.8">
          <line x1="48" y1="55" x2="38" y2="75"/>
          <line x1="48" y1="55" x2="60" y2="78"/>
          <line x1="38" y1="75" x2="32" y2="98"/>
          <circle cx="48" cy="55" r="3" fill="#fca5a5" stroke="none" opacity="0.6"/>
        </g>
      )}
    </svg>
  );
}

// ─── Damage Picker ────────────────────────────────────────────────────────────

const DAMAGE_OPTIONS = [
  { value: "flawless", label: "Flawless", desc: "No marks at all", deduction: null },
  { value: "minor",    label: "Minor Scratches", desc: "Hard to see", deduction: null },
  { value: "obvious",  label: "Obvious Scratches", desc: "Clearly visible", deduction: null },
  { value: "cracked",  label: "Cracked / Chipped", desc: "Screen broken or dented", deduction: null },
] as const;

type DamageValue = "flawless" | "minor" | "obvious" | "cracked";

function DamagePicker({
  label, type, value, onChange,
}: {
  label: string;
  type: "screen" | "back";
  value: DamageValue | "";
  onChange: (v: DamageValue) => void;
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-mcx-dark mb-3">{label}</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {DAMAGE_OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-center cursor-pointer ${
                selected
                  ? "border-mcx-red bg-mcx-red-light shadow-sm"
                  : "border-gray-200 bg-white hover:border-mcx-red/40"
              }`}
            >
              <div className="w-14 h-24">
                {type === "screen"
                  ? <PhoneSVG variant={opt.value} />
                  : <BackSVG variant={opt.value} />}
              </div>
              <span className={`text-xs font-semibold leading-tight ${selected ? "text-mcx-red" : "text-mcx-dark"}`}>
                {opt.label}
              </span>
              <span className="text-xs text-mcx-gray leading-tight">{opt.desc}</span>
              {selected && (
                <span className="absolute top-2 right-2 w-5 h-5 bg-mcx-red rounded-full flex items-center justify-center">
                  <CheckCircle size={12} className="text-white" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Option Button ────────────────────────────────────────────────────────────

function OptionBtn({
  value, selected, onClick, children,
}: {
  value: string; selected: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
        selected
          ? "border-mcx-red bg-mcx-red text-white"
          : "border-gray-200 bg-white text-mcx-charcoal hover:border-mcx-red/50"
      }`}
    >
      {children}
    </button>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
            i < step ? "bg-mcx-red" : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────

export default function TradeInForm() {
  const [step, setStep]   = useState(1);
  const [form, setForm]   = useState<FormState>(INIT);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof FormState, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const isNew  = form.condition === "new";
  const isUsed = form.condition === "used";
  const totalSteps = isUsed ? 5 : 4;

  const estimatedValue = form.model ? calcValue(form) : 0;

  const canNext: Record<number, boolean> = {
    1: !!form.condition,
    2: !!form.brand && !!form.model,
    3: isNew
      ? !!form.storage && !!form.activation && !!form.setType
      : !!form.storage && !!form.batteryHealth && !!form.overallCondition,
    4: isUsed
      ? !!form.screenCondition && !!form.exteriorCondition
      : !!form.name && !!form.email && !!form.phone,
    5: !!form.name && !!form.email && !!form.phone,
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/trade-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, estimatedValue }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again or WhatsApp us directly.");
    } finally {
      setLoading(false);
    }
  }

  // ── Success ────────────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center py-12 px-4">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-mcx-dark mb-2">Request Submitted!</h2>
        <p className="text-mcx-gray max-w-sm mb-2">
          We&apos;ll contact you within <strong>24 hours</strong> via WhatsApp or email with your trade-in offer.
        </p>
        <div className="mt-6 bg-mcx-red-light border border-mcx-red/20 rounded-xl px-6 py-4 text-mcx-dark">
          <p className="text-sm text-mcx-gray mb-1">Estimated trade-in value</p>
          <p className="text-3xl font-bold text-mcx-red">
            S${estimatedValue.toLocaleString()}
          </p>
          <p className="text-xs text-mcx-gray mt-1">Final offer subject to physical inspection</p>
        </div>
        <button
          onClick={() => { setStep(1); setForm(INIT); setSubmitted(false); }}
          className="mt-8 text-sm text-mcx-red font-semibold hover:underline"
        >
          Submit another device
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressBar step={step - 1} total={totalSteps} />

      {/* ── Step 1: New or Used ──────────────────────────────────────────── */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold text-mcx-dark mb-1">What&apos;s the condition of your device?</h2>
          <p className="text-sm text-mcx-gray mb-6">This determines which valuation path we use.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { value: "new", icon: <Smartphone size={32}/>, label: "New / Sealed", desc: "Unopened box or barely used" },
              { value: "used", icon: <RefreshCw size={32}/>, label: "Used", desc: "Previously activated and used" },
            ].map(({ value, icon, label, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => { set("condition", value); setStep(2); }}
                className={`flex flex-col items-center text-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                  form.condition === value
                    ? "border-mcx-red bg-mcx-red-light"
                    : "border-gray-200 bg-white hover:border-mcx-red/40 hover:bg-mcx-red-light/40"
                }`}
              >
                <span className={form.condition === value ? "text-mcx-red" : "text-mcx-gray"}>{icon}</span>
                <div>
                  <p className="font-bold text-mcx-dark">{label}</p>
                  <p className="text-xs text-mcx-gray mt-0.5">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 2: Brand & Model ────────────────────────────────────────── */}
      {step === 2 && (
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-xl font-bold text-mcx-dark mb-1">Select your device</h2>
            <p className="text-sm text-mcx-gray mb-4">Choose the brand, then the model.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-mcx-dark mb-2">Brand</label>
            <div className="flex flex-wrap gap-2">
              {BRANDS.map((b) => (
                <OptionBtn key={b} value={b} selected={form.brand === b} onClick={() => { set("brand", b); set("model", ""); }}>
                  {b}
                </OptionBtn>
              ))}
            </div>
          </div>
          {form.brand && (
            <div>
              <label className="block text-sm font-semibold text-mcx-dark mb-2">Model</label>
              <select
                value={form.model}
                onChange={(e) => set("model", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-mcx-red bg-white"
              >
                <option value="">Select model…</option>
                {(MODELS[form.brand] ?? []).map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          )}
          {form.model && (
            <div className="bg-mcx-red-light border border-mcx-red/20 rounded-xl px-4 py-3 text-sm text-mcx-charcoal">
              Base estimate: <strong className="text-mcx-red">S${(BASE_VALUES[form.model] ?? 150).toLocaleString()}</strong> — final value depends on condition
            </div>
          )}
        </div>
      )}

      {/* ── Step 3A: New phone details ───────────────────────────────────── */}
      {step === 3 && isNew && (
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-xl font-bold text-mcx-dark mb-1">Device details</h2>
            <p className="text-sm text-mcx-gray">Tell us more about your {form.model}.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-mcx-dark mb-2">Storage</label>
            <div className="flex flex-wrap gap-2">
              {STORAGE_OPTIONS.map((s) => (
                <OptionBtn key={s} value={s} selected={form.storage === s} onClick={() => set("storage", s)}>{s}</OptionBtn>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-mcx-dark mb-2">Colour <span className="font-normal text-mcx-gray">(optional)</span></label>
            <input
              value={form.color}
              onChange={(e) => set("color", e.target.value)}
              placeholder="e.g. Cosmic Orange, Titanium Black"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-mcx-red"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-mcx-dark mb-2">Activation Status</label>
            <div className="flex gap-3">
              {[
                { value: "unactivated", label: "Unactivated", sub: "Never set up" },
                { value: "activated",   label: "Activated",   sub: "−5% from base" },
              ].map(({ value, label, sub }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("activation", value)}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm text-center transition-all ${
                    form.activation === value ? "border-mcx-red bg-mcx-red-light" : "border-gray-200 bg-white hover:border-mcx-red/40"
                  }`}
                >
                  <p className="font-semibold text-mcx-dark">{label}</p>
                  <p className="text-xs text-mcx-gray mt-0.5">{sub}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-mcx-dark mb-2">Set Type</label>
            <div className="flex gap-3">
              {[
                { value: "local",  label: "Local Set",  sub: "Singapore warranty" },
                { value: "export", label: "Export Set", sub: "−10% from base" },
              ].map(({ value, label, sub }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("setType", value)}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm text-center transition-all ${
                    form.setType === value ? "border-mcx-red bg-mcx-red-light" : "border-gray-200 bg-white hover:border-mcx-red/40"
                  }`}
                >
                  <p className="font-semibold text-mcx-dark">{label}</p>
                  <p className="text-xs text-mcx-gray mt-0.5">{sub}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 3B: Used phone details ──────────────────────────────────── */}
      {step === 3 && isUsed && (
        <div className="flex flex-col gap-5">
          <div>
            <h2 className="text-xl font-bold text-mcx-dark mb-1">Device details</h2>
            <p className="text-sm text-mcx-gray">Help us assess your {form.model}.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-mcx-dark mb-2">Storage</label>
            <div className="flex flex-wrap gap-2">
              {STORAGE_OPTIONS.map((s) => (
                <OptionBtn key={s} value={s} selected={form.storage === s} onClick={() => set("storage", s)}>{s}</OptionBtn>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-mcx-dark mb-2">Colour <span className="font-normal text-mcx-gray">(optional)</span></label>
            <input
              value={form.color}
              onChange={(e) => set("color", e.target.value)}
              placeholder="e.g. Midnight Black, Starlight"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-mcx-red"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-mcx-dark mb-2">
              Battery Health
              <span className="ml-2 text-xs font-normal text-mcx-gray">(Settings → Battery → Battery Health)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "90+",   label: "90%+",    sub: "Excellent" },
                { value: "85-89", label: "85–89%",  sub: "Good" },
                { value: "80-84", label: "80–84%",  sub: "Fair  −S$50" },
                { value: "75-79", label: "75–79%",  sub: "Low   −S$80" },
                { value: "<75",   label: "Below 75%",sub:"Poor  −S$120" },
              ].map(({ value, label, sub }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("batteryHealth", value)}
                  className={`flex-col items-center py-2.5 px-4 rounded-xl border-2 text-center text-sm transition-all ${
                    form.batteryHealth === value ? "border-mcx-red bg-mcx-red-light" : "border-gray-200 bg-white hover:border-mcx-red/40"
                  }`}
                >
                  <p className="font-semibold text-mcx-dark">{label}</p>
                  <p className="text-xs text-mcx-gray">{sub}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-mcx-dark mb-2">Overall Condition</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "mint", label: "Mint",  sub: "Like new, barely used" },
                { value: "good", label: "Good",  sub: "Light wear, works perfectly" },
                { value: "fair", label: "Fair",  sub: "Visible wear, fully functional" },
                { value: "poor", label: "Poor",  sub: "Heavy damage or faults" },
              ].map(({ value, label, sub }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("overallCondition", value)}
                  className={`py-3 px-4 rounded-xl border-2 text-sm text-left transition-all ${
                    form.overallCondition === value ? "border-mcx-red bg-mcx-red-light" : "border-gray-200 bg-white hover:border-mcx-red/40"
                  }`}
                >
                  <p className="font-semibold text-mcx-dark">{label}</p>
                  <p className="text-xs text-mcx-gray mt-0.5">{sub}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 4: Visual Damage (Used only) ───────────────────────────── */}
      {step === 4 && isUsed && (
        <div className="flex flex-col gap-7">
          <div>
            <h2 className="text-xl font-bold text-mcx-dark mb-1">Visual Damage Guide</h2>
            <p className="text-sm text-mcx-gray">Select the option that best matches your device.</p>
          </div>
          <DamagePicker
            label="How is your screen?"
            type="screen"
            value={form.screenCondition as DamageValue | ""}
            onChange={(v) => set("screenCondition", v)}
          />
          <DamagePicker
            label="How is the exterior / back?"
            type="back"
            value={form.exteriorCondition as DamageValue | ""}
            onChange={(v) => set("exteriorCondition", v)}
          />
          {form.screenCondition && form.exteriorCondition && (
            <div className="bg-mcx-red-light border border-mcx-red/20 rounded-xl px-4 py-3 text-sm">
              <p className="text-mcx-gray">Estimated trade-in value</p>
              <p className="text-2xl font-bold text-mcx-red mt-0.5">S${estimatedValue.toLocaleString()}</p>
              <p className="text-xs text-mcx-gray mt-1">Subject to physical inspection</p>
            </div>
          )}
        </div>
      )}

      {/* ── Step 4 (New) / Step 5 (Used): Contact Form ──────────────────── */}
      {((step === 4 && isNew) || (step === 5 && isUsed)) && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <h2 className="text-xl font-bold text-mcx-dark mb-1">Almost there!</h2>
            <p className="text-sm text-mcx-gray">Leave your details and we&apos;ll get back within 24 hours.</p>
          </div>

          {/* Summary */}
          <div className="bg-mcx-red-light border border-mcx-red/20 rounded-xl px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-mcx-gray uppercase tracking-wide font-semibold">Your estimated offer</p>
                <p className="text-3xl font-bold text-mcx-red mt-0.5">S${estimatedValue.toLocaleString()}</p>
                <p className="text-xs text-mcx-gray mt-1">
                  {form.model} · {form.storage} · {form.condition === "new" ? "New" : form.overallCondition}
                </p>
              </div>
              <div className="text-right text-xs text-mcx-gray">
                <p>Subject to inspection</p>
                <p className="mt-1">Same-day payment</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-mcx-dark mb-1.5">Full Name *</label>
              <input required value={form.name} onChange={(e) => set("name", e.target.value)}
                placeholder="John Tan"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-mcx-red" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-mcx-dark mb-1.5">Phone / WhatsApp *</label>
              <input required value={form.phone} onChange={(e) => set("phone", e.target.value)}
                placeholder="+65 9123 4567" type="tel"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-mcx-red" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-mcx-dark mb-1.5">Email Address *</label>
            <input required value={form.email} onChange={(e) => set("email", e.target.value)}
              placeholder="john@email.com" type="email"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-mcx-red" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-mcx-dark mb-1.5">Additional notes <span className="font-normal text-mcx-gray">(optional)</span></label>
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={3}
              placeholder="Accessories included, known faults, etc."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-mcx-red resize-none" />
          </div>
          {error && <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-mcx-red text-white font-bold text-base hover:bg-mcx-red-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting…" : "Submit Trade-In Request"}
          </button>
          <p className="text-xs text-center text-mcx-gray">
            By submitting you agree to be contacted by Mobile Connex Communications regarding this trade-in.
          </p>
        </form>
      )}

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      {step > 1 && !((step === 4 && isNew) || (step === 5 && isUsed)) && (
        <div className="flex items-center justify-between mt-8">
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-mcx-gray hover:text-mcx-dark transition-colors"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext[step]}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-mcx-red text-white text-sm font-semibold hover:bg-mcx-red-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue <ChevronRight size={16} />
          </button>
        </div>
      )}
      {step > 1 && ((step === 4 && isNew) || (step === 5 && isUsed)) && (
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-mcx-gray hover:text-mcx-dark transition-colors"
        >
          <ChevronLeft size={16} /> Back
        </button>
      )}
    </div>
  );
}
