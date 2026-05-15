"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const FAQS = [
  {
    category: "Trade-In",
    items: [
      {
        q: "How does the trade-in process work?",
        a: "Submit your device details using our online Trade-In tool. We'll give you an instant estimated value. Bring your device to our store for a quick physical inspection, and we'll pay you on the spot — same day, no waiting.",
      },
      {
        q: "What devices do you accept?",
        a: "We accept all major brands including Apple, Samsung, OPPO, Xiaomi, Google, OnePlus, and more. Devices in any condition are welcome — though the offer will reflect the condition. Even cracked or water-damaged phones may have value.",
      },
      {
        q: "How is my trade-in value calculated?",
        a: "We assess the brand, model, storage, condition, battery health, and any physical damage. Our online estimator gives you a ballpark figure — the final offer is confirmed after a 5-minute in-store inspection.",
      },
      {
        q: "Is the online estimate guaranteed?",
        a: "The online estimate is a guide based on current market rates. The final offer is made after our technician inspects the device in person. In most cases the final offer matches or is close to the online estimate.",
      },
      {
        q: "How quickly do I get paid?",
        a: "Payment is made on the same day as your inspection — cash or bank transfer, your choice. There's no waiting period.",
      },
    ],
  },
  {
    category: "Refurbished Phones",
    items: [
      {
        q: "What does 'refurbished' mean?",
        a: "A refurbished phone has been previously owned, professionally cleaned, tested, and restored to full working condition. All cosmetic faults are graded honestly — Mint, Good, or Fair — so you know exactly what you're getting.",
      },
      {
        q: "What is the condition grading system?",
        a: "Mint: Like new with minimal to no signs of use. Good: Light scratches that are hard to see in normal lighting, fully functional. Fair: Visible wear and scratches, 100% functional. All grades are accurately assessed by our technicians.",
      },
      {
        q: "Do refurbished phones come with a warranty?",
        a: "Yes. All refurbished devices sold by Mobile Connex Communications come with a warranty. Duration varies by device — please ask in-store or contact us for details on a specific model.",
      },
      {
        q: "Can I try the phone before buying?",
        a: "Absolutely. We encourage customers to test any device in-store before purchasing. Our team will walk you through the device and answer any questions.",
      },
    ],
  },
  {
    category: "New Phones",
    items: [
      {
        q: "What's the difference between a Local Set and an Export Set?",
        a: "A Local Set is officially distributed in Singapore with a local warranty valid at authorised service centres. An Export Set is sourced from another country — it may be identical hardware but carries an international warranty, which may not be honoured locally. Export Sets are typically priced lower.",
      },
      {
        q: "Are your new phones genuine?",
        a: "Yes. All new phones we sell are 100% genuine, sourced from authorised distributors or official retail channels. We do not sell counterfeit or grey-market devices without clear disclosure.",
      },
    ],
  },
  {
    category: "Orders & General",
    items: [
      {
        q: "Do you offer delivery?",
        a: "Please contact us directly to enquire about delivery options for your order.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept cash, PayNow, bank transfer, and major credit/debit cards in-store.",
      },
      {
        q: "Can I reserve a device?",
        a: "Yes, we can hold a device for a short period with a deposit. Contact us via WhatsApp or visit the store to arrange.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-4 text-left"
        aria-expanded={open}
      >
        <span className={`text-sm font-semibold leading-relaxed ${open ? "text-mcx-red" : "text-mcx-dark"}`}>{q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 mt-0.5 text-mcx-gray transition-transform duration-200 ${open ? "rotate-180 text-mcx-red" : ""}`}
        />
      </button>
      {open && (
        <p className="pb-4 text-sm text-mcx-gray leading-relaxed">{a}</p>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-mcx-dark mb-3">Frequently Asked Questions</h1>
        <p className="text-mcx-gray">Can&apos;t find what you&apos;re looking for?{" "}
          <Link href="/contact" className="text-mcx-red font-semibold hover:underline">Contact us directly</Link>.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {FAQS.map(({ category, items }) => (
          <div key={category}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-mcx-red mb-3">{category}</h2>
            <div className="bg-white border border-gray-100 rounded-2xl px-5 divide-y divide-gray-100">
              {items.map((item) => <FAQItem key={item.q} {...item} />)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-mcx-red-light border border-mcx-red/20 rounded-2xl px-6 py-8 text-center">
        <h3 className="font-bold text-mcx-dark mb-2">Still have questions?</h3>
        <p className="text-sm text-mcx-gray mb-5">Our team is happy to help via WhatsApp, email, or in-store.</p>
        <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-mcx-red text-white text-sm font-semibold hover:bg-mcx-red-dark transition-colors">
          Get in Touch
        </Link>
      </div>
    </div>
  );
}
