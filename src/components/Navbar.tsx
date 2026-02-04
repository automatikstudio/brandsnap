"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-bg/80 backdrop-blur-xl border-b border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-fuchsia to-brand-yellow flex items-center justify-center">
              <span className="font-heading font-bold text-white text-sm">B</span>
            </div>
            <span className="font-heading font-bold text-xl text-white">
              Brand<span className="gradient-text">Snap</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-brand-muted hover:text-white transition-colors text-sm font-body">
              Features
            </Link>
            <Link href="/#pricing" className="text-brand-muted hover:text-white transition-colors text-sm font-body">
              Pricing
            </Link>
            <Link
              href="/app"
              className="px-5 py-2 bg-gradient-to-r from-brand-fuchsia to-brand-yellow rounded-btn font-heading font-semibold text-sm text-white hover:opacity-90 transition-opacity"
            >
              Generate Kit →
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link href="/#features" className="block text-brand-muted hover:text-white transition-colors text-sm font-body">
              Features
            </Link>
            <Link href="/#pricing" className="block text-brand-muted hover:text-white transition-colors text-sm font-body">
              Pricing
            </Link>
            <Link
              href="/app"
              className="block px-5 py-2 bg-gradient-to-r from-brand-fuchsia to-brand-yellow rounded-btn font-heading font-semibold text-sm text-white text-center"
            >
              Generate Kit →
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
