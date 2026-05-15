// ─── Per-product trade-in config ─────────────────────────────────────────────
// base: starting trade-in value in SGD
// storage: each option user can select with price adjustment from base

export type StorageOption = { label: string; adj: number };

export type TradeInConfig = {
  base: number;
  storage: StorageOption[];
};

export const TRADE_IN: Record<string, TradeInConfig> = {
  "apple-iphone-17-pro-max": {
    base: 1600,
    storage: [
      { label: "256GB", adj: 0 },
      { label: "512GB", adj: 100 },
      { label: "1TB",   adj: 200 },
      { label: "2TB",   adj: 300 },
    ],
  },
  "samsung-galaxy-s25-ultra-5g": {
    base: 1000,
    storage: [
      { label: "256GB", adj: 0 },
      { label: "512GB", adj: 100 },
      { label: "1TB",   adj: 200 },
    ],
  },
  "oppo-reno15-pro-max": {
    base: 600,
    storage: [
      { label: "512GB", adj: 0 },
    ],
  },
  "oppo-reno15-5g": {
    base: 500,
    storage: [
      { label: "512GB", adj: 0 },
    ],
  },
  "oppo-find-x9-pro": {
    base: 900,
    storage: [
      { label: "512GB", adj: 0 },
    ],
  },
  "oppo-find-x9": {
    base: 750,
    storage: [
      { label: "512GB", adj: 0 },
    ],
  },
  "oppo-reno-15f-5g": {
    base: 350,
    storage: [
      { label: "256GB", adj: 0 },
      { label: "512GB", adj: 50 },
    ],
  },
  "oppo-reno-13f-5g": {
    base: 280,
    storage: [
      { label: "256GB", adj: 0 },
    ],
  },
  "oppo-a6-pro-5g": {
    base: 250,
    storage: [
      { label: "256GB", adj: 0 },
    ],
  },
  "oppo-a6x-5g": {
    base: 150,
    storage: [
      { label: "128GB", adj: 0 },
    ],
  },
};

// ─── Condition options (same for all products) ────────────────────────────────

export const CONDITIONS = [
  {
    value: "flawless",
    label: "Flawless",
    desc: "No marks. Like brand new.",
    adj: 0,
    color: "green",
  },
  {
    value: "light",
    label: "Light Scratches",
    desc: "Minor marks, hard to notice.",
    adj: -100,
    color: "amber",
  },
  {
    value: "heavy",
    label: "Heavily Scratched",
    desc: "Clearly visible scratches or cracks.",
    adj: -200,
    color: "red",
  },
] as const;

// ─── Battery health options (same for all products) ───────────────────────────

export const BATTERY_OPTIONS = [
  { value: "95-100", label: "95% – 100%", adj: 0 },
  { value: "90-94",  label: "90% – 94%",  adj: -100 },
  { value: "85-89",  label: "85% – 89%",  adj: -150 },
  { value: "below-85", label: "Below 85%", adj: -200 },
] as const;

export type ConditionValue  = typeof CONDITIONS[number]["value"];
export type BatteryValue    = typeof BATTERY_OPTIONS[number]["value"];
