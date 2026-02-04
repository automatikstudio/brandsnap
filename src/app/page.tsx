"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComingSoonModal from "@/components/ComingSoonModal";

const exampleColors = [
  { name: "Deep Ocean", hex: "#1E3A5F" },
  { name: "Coral Bloom", hex: "#FF6B6B" },
  { name: "Sunlit Gold", hex: "#F5C542" },
  { name: "Soft Cloud", hex: "#F0F0F0" },
  { name: "Midnight", hex: "#0D1B2A" },
];

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: "Color Palettes",
    description: "5 harmonious colors with hex codes, RGB values, and usage guidelines tailored to your brand.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
      </svg>
    ),
    title: "Font Pairings",
    description: "Perfectly matched heading + body font combinations with sizing and weight recommendations.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
      </svg>
    ),
    title: "Logo Concepts",
    description: "Detailed logo direction descriptions covering style, shape, typography, and symbolism.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
    title: "Brand Voice",
    description: "Tone guidelines, tagline suggestions, and messaging framework that fits your brand personality.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Social Templates",
    description: "Recommended dimensions, color applications, and layout guidelines for every social platform.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Instant Generation",
    description: "Go from business description to complete brand kit in under 30 seconds. No design skills needed.",
  },
];

const pricing = [
  {
    name: "Free",
    price: "$0",
    description: "Preview your brand kit",
    features: ["3 color palette", "1 font pairing", "Basic brand voice", "Limited preview"],
    cta: "Try Free",
    highlighted: false,
  },
  {
    name: "Starter",
    price: "$19",
    period: "one-time",
    description: "Everything you need to start",
    features: [
      "5 color palette with usage guide",
      "3 font pairings",
      "Full brand voice & taglines",
      "Logo direction",
      "Download as PDF",
    ],
    cta: "Get Starter",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "$39",
    period: "one-time",
    description: "Complete brand identity kit",
    features: [
      "Everything in Starter",
      "Social media templates",
      "Brand guidelines document",
      "Multiple variations",
      "Priority generation",
      "Commercial license",
    ],
    cta: "Get Pro",
    highlighted: false,
  },
];

export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPlan, setModalPlan] = useState("");

  const handlePricingClick = (planName: string) => {
    // Track the click
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "pricing_click",
        plan: planName,
        product: "brandsnap",
      }),
    }).catch(() => {});

    if (planName === "Free") {
      window.location.href = "/app";
      return;
    }

    setModalPlan(planName);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-fuchsia/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-800 bg-brand-surface/50 mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-fuchsia animate-pulse" />
            <span className="text-brand-muted text-sm font-body">Powered by AI</span>
          </div>

          <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-7xl text-white mb-6 leading-tight">
            Your brand identity.
            <br />
            <span className="gradient-text">Generated in seconds.</span>
          </h1>

          <p className="font-body text-brand-muted text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Enter your business name and description. Get a complete brand kit — colors, fonts, logo concepts, and more — instantly with AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/app"
              className="px-8 py-4 bg-gradient-to-r from-brand-fuchsia to-brand-yellow rounded-btn font-heading font-semibold text-lg text-white hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-brand-fuchsia/25"
            >
              Generate Your Brand Kit →
            </Link>
            <Link
              href="#how-it-works"
              className="px-8 py-4 border border-zinc-700 rounded-btn font-heading font-semibold text-lg text-brand-muted hover:text-white hover:border-zinc-500 transition-all"
            >
              See How It Works
            </Link>
          </div>

          {/* Example Brand Kit Preview */}
          <div className="max-w-4xl mx-auto">
            <div className="gradient-border p-6 sm:p-8">
              <div className="relative">
                <p className="text-brand-muted text-sm font-body mb-4 text-left">
                  Example output for &quot;Oceanic Café — a coastal coffee shop&quot;
                </p>

                {/* Color swatches */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {exampleColors.map((color) => (
                    <div key={color.hex} className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-lg shadow-lg"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="text-left">
                        <p className="text-white text-xs font-body font-medium">{color.name}</p>
                        <p className="text-brand-muted text-xs font-mono">{color.hex}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Font preview */}
                <div className="flex flex-col sm:flex-row gap-6 mb-6">
                  <div className="flex-1 text-left">
                    <p className="text-brand-muted text-xs font-body mb-1">Heading Font</p>
                    <p className="text-white text-2xl font-heading font-bold">Playfair Display</p>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-brand-muted text-xs font-body mb-1">Body Font</p>
                    <p className="text-white text-lg font-body">Source Sans Pro</p>
                  </div>
                </div>

                {/* Tagline */}
                <div className="text-left p-4 bg-zinc-800/50 rounded-xl">
                  <p className="text-brand-muted text-xs font-body mb-1">Suggested Tagline</p>
                  <p className="text-white text-lg font-body italic">&quot;Where the ocean meets your morning brew&quot;</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-surface/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-4">
              How it <span className="gradient-text">works</span>
            </h2>
            <p className="font-body text-brand-muted text-lg max-w-xl mx-auto">
              Three simple steps to a complete brand identity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Describe Your Business",
                description: "Enter your business name, industry, and a brief description. Choose your preferred style.",
              },
              {
                step: "02",
                title: "AI Generates Your Kit",
                description: "Our AI analyzes your input and creates a tailored brand identity kit in under 30 seconds.",
              },
              {
                step: "03",
                title: "Download & Use",
                description: "Get your complete kit with colors, fonts, logo concepts, voice guidelines, and social templates.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-fuchsia/20 to-brand-yellow/20 flex items-center justify-center group-hover:from-brand-fuchsia/30 group-hover:to-brand-yellow/30 transition-all">
                  <span className="gradient-text font-heading font-bold text-2xl">{item.step}</span>
                </div>
                <h3 className="font-heading font-semibold text-xl text-white mb-3">{item.title}</h3>
                <p className="font-body text-brand-muted">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-4">
              Everything in your <span className="gradient-text">brand kit</span>
            </h2>
            <p className="font-body text-brand-muted text-lg max-w-xl mx-auto">
              Every element you need to launch with a professional brand identity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="gradient-border p-6 hover:scale-[1.02] transition-transform cursor-default"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-fuchsia/20 to-brand-yellow/20 flex items-center justify-center text-brand-fuchsia mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-white mb-2">{feature.title}</h3>
                  <p className="font-body text-brand-muted text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-surface/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-4">
              Simple <span className="gradient-text">pricing</span>
            </h2>
            <p className="font-body text-brand-muted text-lg max-w-xl mx-auto">
              One-time payment. No subscriptions. Your brand kit forever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricing.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-card p-6 ${
                  plan.highlighted
                    ? "bg-gradient-to-b from-brand-fuchsia/10 to-brand-surface border-2 border-brand-fuchsia/50"
                    : "bg-brand-surface border border-zinc-800"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-brand-fuchsia to-brand-yellow rounded-full text-xs font-heading font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="font-heading font-semibold text-lg text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-heading font-bold text-4xl text-white">{plan.price}</span>
                    {plan.period && <span className="text-brand-muted text-sm font-body">/{plan.period}</span>}
                  </div>
                  <p className="text-brand-muted text-sm font-body mt-2">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-brand-fuchsia flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-brand-muted text-sm font-body">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePricingClick(plan.name)}
                  className={`w-full py-3 rounded-btn font-heading font-semibold text-sm transition-all ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-brand-fuchsia to-brand-yellow text-white hover:opacity-90"
                      : "border border-zinc-700 text-white hover:border-brand-fuchsia hover:text-brand-fuchsia"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-brand-fuchsia/20 to-brand-yellow/20 rounded-card blur-xl" />
            <div className="relative bg-brand-surface border border-zinc-800 rounded-card p-12">
              <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-4">
                Ready to build your brand?
              </h2>
              <p className="font-body text-brand-muted text-lg mb-8 max-w-xl mx-auto">
                Join thousands of founders who&apos;ve generated their brand identity with BrandSnap.
              </p>
              <Link
                href="/app"
                className="inline-flex px-8 py-4 bg-gradient-to-r from-brand-fuchsia to-brand-yellow rounded-btn font-heading font-semibold text-lg text-white hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-brand-fuchsia/25"
              >
                Generate Your Brand Kit — Free →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <ComingSoonModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        planName={modalPlan}
      />
    </div>
  );
}
