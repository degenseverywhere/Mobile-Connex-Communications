import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Users, Award, Zap } from "lucide-react";

export const metadata = {
  title: "About Us | Mobile Connex Communications",
  description: "Trusted Singapore phone dealer since 2007. Learn about our story, values, and commitment to transparency.",
};

const VALUES = [
  { icon: ShieldCheck, title: "Transparency First", desc: "Every device is graded honestly. The condition you see is exactly what you get — no hidden surprises after purchase." },
  { icon: Users,       title: "Customer-Centric", desc: "We've built our reputation on repeat customers and referrals. Your satisfaction is the only metric that matters to us." },
  { icon: Award,       title: "Quality Assured",  desc: "All refurbished devices go through a rigorous 25-point inspection before they reach you. We only sell what we'd use ourselves." },
  { icon: Zap,         title: "Fast & Fair",       desc: "Trade-in valuations in minutes, same-day payment. No lengthy negotiations, no lowball offers." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-14">

      {/* Hero */}
      <div className="text-center mb-14">
        <span className="inline-block px-3 py-1 rounded-full bg-mcx-red-light text-mcx-red text-xs font-semibold mb-4">
          Since 2007
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-mcx-dark mb-4 leading-tight">
          Trusted phones,<br /><span className="text-mcx-red">honest prices.</span>
        </h1>
        <p className="text-mcx-gray text-lg max-w-xl mx-auto leading-relaxed">
          Mobile Connex Communications has been Singapore&apos;s go-to destination for new and refurbished phones for over 18 years.
        </p>
      </div>

      {/* Logo */}
      <div className="flex justify-center mb-14">
        <div className="bg-mcx-dark rounded-2xl px-10 py-8 flex items-center justify-center">
          <Image src="/mcx-logo.png" alt="Mobile Connex Communications" width={200} height={60} className="h-14 w-auto brightness-0 invert" />
        </div>
      </div>

      {/* Story */}
      <div className="prose-lg text-mcx-gray leading-relaxed mb-14 space-y-4 max-w-2xl mx-auto">
        <p>
          What started as a small mobile phone repair shop in 2007 has grown into one of Singapore&apos;s most trusted names in pre-owned and new device sales. We&apos;ve served tens of thousands of customers across the island — from students looking for their first smartphone to professionals upgrading to the latest flagship.
        </p>
        <p>
          We believe that buying a phone should be simple, transparent, and fair. That&apos;s why we grade every refurbished device rigorously, price everything honestly, and stand behind every sale with full after-sales support.
        </p>
        <p>
          Our trade-in programme was built around one idea: get the best value for your old device without the hassle. Walk in, get an offer, get paid. No appointments, no waiting weeks for a cheque.
        </p>
      </div>

      {/* Values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
        {VALUES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="p-2.5 rounded-lg bg-mcx-red-light shrink-0">
              <Icon size={20} className="text-mcx-red" />
            </div>
            <div>
              <h3 className="font-semibold text-mcx-dark mb-1">{title}</h3>
              <p className="text-sm text-mcx-gray leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-mcx-dark rounded-2xl px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">Ready to trade in or shop?</h2>
        <p className="text-gray-400 mb-8 max-w-sm mx-auto">
          Browse our full range of devices or get an instant quote for yours.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/new-phones" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-mcx-red text-white font-semibold hover:bg-mcx-red-dark transition-colors">
            Shop Phones <ArrowRight size={16} />
          </Link>
          <Link href="/trade-in" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors">
            Get Trade-In Value
          </Link>
        </div>
      </div>
    </div>
  );
}
