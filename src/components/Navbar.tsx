"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Refurbished Phones", href: "/refurbished" },
  { label: "New Phones", href: "/new-phones" },
  { label: "Trade-In", href: "/trade-in" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white transition-shadow duration-200 ${
        scrolled ? "shadow-md" : "border-b border-gray-100"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/mcx-logo.png"
              alt="Mobile Connex Communications"
              width={140}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 rounded-md text-sm font-medium text-mcx-charcoal hover:text-mcx-red hover:bg-mcx-red-light transition-colors duration-150"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+1-800-MCX-PHONE"
              className="flex items-center gap-1.5 text-sm text-mcx-gray hover:text-mcx-red transition-colors"
            >
              <Phone size={15} />
              <span>1-800-MCX-PHONE</span>
            </a>
            <Link
              href="/trade-in"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-mcx-red text-white text-sm font-semibold hover:bg-mcx-red-dark transition-colors duration-150"
            >
              Get Trade-In Value
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-mcx-charcoal hover:text-mcx-red hover:bg-mcx-red-light transition-colors"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 shadow-lg">
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-md text-sm font-medium text-mcx-charcoal hover:text-mcx-red hover:bg-mcx-red-light transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
            <a
              href="tel:+1-800-MCX-PHONE"
              className="flex items-center gap-2 px-4 py-2 text-sm text-mcx-gray"
            >
              <Phone size={15} />
              <span>1-800-MCX-PHONE</span>
            </a>
            <Link
              href="/trade-in"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center px-4 py-3 rounded-lg bg-mcx-red text-white text-sm font-semibold hover:bg-mcx-red-dark transition-colors"
            >
              Get Trade-In Value
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
