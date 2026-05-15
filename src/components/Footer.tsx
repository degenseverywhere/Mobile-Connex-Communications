import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function IconX() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Refurbished Phones", href: "/refurbished" },
  { label: "New Phones", href: "/new-phones" },
  { label: "Trade-In", href: "/trade-in" },
];

const supportLinks = [
  { label: "About Us", href: "/about" },
  { label: "Condition Guide", href: "/condition-guide" },
  { label: "FAQs", href: "/faqs" },
  { label: "Contact Us", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-mcx-dark text-white">
      {/* Trade-in CTA band */}
      <div className="bg-mcx-red">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white font-semibold text-base sm:text-lg text-center sm:text-left">
            Know what your device is worth — get an instant trade-in value.
          </p>
          <Link
            href="/trade-in"
            className="shrink-0 inline-flex items-center px-5 py-2.5 rounded-lg bg-white text-mcx-red font-semibold text-sm hover:bg-gray-100 transition-colors"
          >
            Start Trade-In
          </Link>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/">
              <Image
                src="/mcx-logo.png"
                alt="Mobile Connex Communications"
                width={150}
                height={44}
                className="h-11 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Trusted since 2007. We buy, sell, and trade quality devices with
              complete transparency and no hidden fees.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                className="p-2 rounded-full bg-white/10 hover:bg-mcx-red transition-colors"
              >
                <IconFacebook />
              </a>
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="p-2 rounded-full bg-white/10 hover:bg-mcx-red transition-colors"
              >
                <IconInstagram />
              </a>
              <a
                href="https://twitter.com"
                aria-label="Twitter / X"
                className="p-2 rounded-full bg-white/10 hover:bg-mcx-red transition-colors"
              >
                <IconX />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-mcx-red mb-4">
              Shop
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-mcx-red mb-4">
              Support
            </h3>
            <ul className="space-y-2.5">
              {supportLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-mcx-red mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <Phone size={15} className="mt-0.5 shrink-0 text-mcx-red" />
                <a href="tel:+6597782228" className="hover:text-white transition-colors">
                  +65 9778 2228
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <Mail size={15} className="mt-0.5 shrink-0 text-mcx-red" />
                <a href="mailto:mblcnxcommunications@gmail.com" className="hover:text-white transition-colors">
                  mblcnxcommunications@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <MapPin size={15} className="mt-0.5 shrink-0 text-mcx-red" />
                <span>Blk 190 Toa Payoh, #01-580, Singapore 310190</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Mobile Connex Communications. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
