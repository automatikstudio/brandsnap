"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  VersionBadge,
  VersionHistoryPanel,
  DiffViewer,
  BrandVaultButton,
} from "@/components/BrandVault";
import {
  BrandVersion,
  BrandKit,
  saveBrandVersion,
  getVersionsForBusiness,
  getVersionCount,
} from "@/lib/brandVault";

interface BrandColor {
  name: string;
  hex: string;
  usage: string;
}

const industries = [
  "Technology",
  "Food & Beverage",
  "Health & Fitness",
  "Education",
  "Finance",
  "Fashion & Beauty",
  "Real Estate",
  "Travel & Hospitality",
  "Entertainment",
  "E-commerce",
  "Consulting",
  "Non-profit",
  "Art & Design",
  "Automotive",
  "Other",
];

const styles = ["Modern", "Classic", "Playful", "Bold", "Minimalist"];

export default function AppPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [brandKit, setBrandKit] = useState<BrandKit | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Form state
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [stylePreference, setStylePreference] = useState("Modern");

  // Brand Vault state
  const [currentVersion, setCurrentVersion] = useState<BrandVersion | null>(null);
  const [versionCount, setVersionCount] = useState(0);
  const [showVault, setShowVault] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  const [diffVersions, setDiffVersions] = useState<{
    old: BrandVersion;
    new: BrandVersion;
  } | null>(null);

  // Update version count when business name changes
  useEffect(() => {
    if (businessName) {
      setVersionCount(getVersionCount(businessName));
    }
  }, [businessName, currentVersion]);

  const handleGenerate = async () => {
    if (!businessName.trim() || !description.trim()) {
      setError("Please fill in your business name and description.");
      return;
    }

    setError("");
    setLoading(true);
    setStep(2);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: businessName.trim(),
          industry,
          description: description.trim(),
          style: stylePreference,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate brand kit. Please try again.");
      }

      const data = await response.json();
      setBrandKit(data);
      
      // Save to Brand Vault
      const savedVersion = saveBrandVersion(
        businessName.trim(),
        industry,
        stylePreference,
        data
      );
      setCurrentVersion(savedVersion);
      setVersionCount(getVersionCount(businessName.trim()));
      
      setStep(3);

      // Track generation
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "brand_kit_generated",
          product: "brandsnap",
          industry,
          style: stylePreference,
        }),
      }).catch(() => {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHex(text);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const resetForm = () => {
    setStep(1);
    setBrandKit(null);
    setBusinessName("");
    setIndustry("");
    setDescription("");
    setStylePreference("Modern");
    setError("");
    setCurrentVersion(null);
    setVersionCount(0);
  };

  // Handle restoring a previous version
  const handleRestoreVersion = (version: BrandVersion) => {
    setBrandKit(version.brandKit);
    setCurrentVersion(version);
    setBusinessName(version.businessName);
    setIndustry(version.industry);
    setStylePreference(version.style);
    setVersionCount(getVersionCount(version.businessName));
    setShowVault(false);
  };

  // Handle opening the diff viewer
  const handleCompareVersions = (oldVersion: BrandVersion, newVersion: BrandVersion) => {
    setDiffVersions({ old: oldVersion, new: newVersion });
    setShowDiff(true);
    setShowVault(false);
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-3">
              Generate Your <span className="gradient-text">Brand Kit</span>
            </h1>
            <p className="font-body text-brand-muted text-lg">
              Tell us about your business and we&apos;ll create a complete brand identity.
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-heading font-semibold transition-all ${
                    s <= step
                      ? "bg-gradient-to-r from-brand-fuchsia to-brand-yellow text-white"
                      : "bg-zinc-800 text-brand-muted"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 sm:w-20 h-0.5 transition-all ${
                      s < step ? "bg-gradient-to-r from-brand-fuchsia to-brand-yellow" : "bg-zinc-800"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Input Form */}
          {step === 1 && (
            <div className="gradient-border p-6 sm:p-8">
              <div className="relative space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-body">
                    {error}
                  </div>
                )}

                {/* Business Name */}
                <div>
                  <label className="block text-white font-heading font-semibold text-sm mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g., Oceanic Café"
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-btn text-white font-body placeholder:text-zinc-500 focus:border-brand-fuchsia transition-colors"
                  />
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-white font-heading font-semibold text-sm mb-2">
                    Industry
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-btn text-white font-body focus:border-brand-fuchsia transition-colors"
                  >
                    <option value="">Select an industry...</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white font-heading font-semibold text-sm mb-2">
                    Business Description *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what your business does, who your customers are, and what makes you unique..."
                    rows={4}
                    className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700 rounded-btn text-white font-body placeholder:text-zinc-500 focus:border-brand-fuchsia transition-colors resize-none"
                  />
                </div>

                {/* Style Preference */}
                <div>
                  <label className="block text-white font-heading font-semibold text-sm mb-3">
                    Style Preference
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {styles.map((style) => (
                      <button
                        key={style}
                        onClick={() => setStylePreference(style)}
                        className={`px-5 py-2 rounded-btn font-body text-sm transition-all ${
                          stylePreference === style
                            ? "bg-gradient-to-r from-brand-fuchsia to-brand-yellow text-white"
                            : "bg-zinc-800 text-brand-muted border border-zinc-700 hover:border-brand-fuchsia hover:text-white"
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  className="w-full py-4 bg-gradient-to-r from-brand-fuchsia to-brand-yellow rounded-btn font-heading font-semibold text-lg text-white hover:opacity-90 transition-all hover:scale-[1.01] shadow-lg shadow-brand-fuchsia/25"
                >
                  Generate Brand Kit →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Loading */}
          {step === 2 && loading && (
            <div className="gradient-border p-12">
              <div className="relative text-center">
                {/* Animated spinner */}
                <div className="w-20 h-20 mx-auto mb-8 relative">
                  <div className="absolute inset-0 rounded-full border-4 border-zinc-800" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-fuchsia border-r-brand-yellow animate-brand-spin" />
                </div>

                <h3 className="font-heading font-bold text-2xl text-white mb-3">
                  Generating your brand kit...
                </h3>
                <p className="font-body text-brand-muted mb-6">
                  Our AI is crafting a unique identity for <span className="text-brand-fuchsia">{businessName}</span>
                </p>

                <div className="flex flex-col gap-3 max-w-sm mx-auto text-left">
                  {[
                    "Analyzing business description",
                    "Creating color palette",
                    "Selecting font pairings",
                    "Defining brand voice",
                    "Designing logo concepts",
                  ].map((task, i) => (
                    <div key={task} className="flex items-center gap-3 animate-pulse-glow" style={{ animationDelay: `${i * 0.4}s` }}>
                      <div className="w-2 h-2 rounded-full bg-brand-fuchsia" />
                      <span className="text-brand-muted text-sm font-body">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Results */}
          {step === 3 && brandKit && (
            <div className="space-y-6">
              {/* Success header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-fuchsia/20 to-brand-yellow/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand-fuchsia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <h2 className="font-heading font-bold text-2xl text-white">
                    Brand Kit for <span className="gradient-text">{businessName}</span>
                  </h2>
                  {currentVersion && versionCount > 0 && (
                    <VersionBadge
                      version={currentVersion.version}
                      totalVersions={versionCount}
                      onClick={() => setShowVault(true)}
                    />
                  )}
                </div>
                {versionCount > 1 && (
                  <p className="text-brand-muted text-sm font-body">
                    🔒 {versionCount} versions saved in your Brand Vault
                  </p>
                )}
              </div>

              {/* Color Palette */}
              <div className="gradient-border p-6 sm:p-8">
                <div className="relative">
                  <h3 className="font-heading font-semibold text-xl text-white mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-fuchsia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    Color Palette
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                    {brandKit.colors.map((color) => (
                      <div key={color.hex} className="text-center group">
                        <div
                          className="w-full aspect-square rounded-xl shadow-lg mb-3 cursor-pointer group-hover:scale-105 transition-transform"
                          style={{ backgroundColor: color.hex }}
                          onClick={() => copyToClipboard(color.hex)}
                        />
                        <p className="text-white font-heading font-semibold text-sm">{color.name}</p>
                        <button
                          onClick={() => copyToClipboard(color.hex)}
                          className="text-brand-muted text-xs font-mono hover:text-brand-fuchsia transition-colors"
                        >
                          {copiedHex === color.hex ? "Copied!" : color.hex}
                        </button>
                        <p className="text-brand-muted text-xs font-body mt-1">{color.usage}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Font Pairing */}
              <div className="gradient-border p-6 sm:p-8">
                <div className="relative">
                  <h3 className="font-heading font-semibold text-xl text-white mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-fuchsia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                    </svg>
                    Font Pairing
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                    <div className="p-4 bg-zinc-800/50 rounded-xl">
                      <p className="text-brand-muted text-xs font-body mb-1">Heading Font</p>
                      <p className="text-white text-2xl font-heading font-bold">{brandKit.fonts.heading.name}</p>
                      <p className="text-brand-muted text-sm font-body mt-1">
                        {brandKit.fonts.heading.weight} · {brandKit.fonts.heading.style}
                      </p>
                    </div>
                    <div className="p-4 bg-zinc-800/50 rounded-xl">
                      <p className="text-brand-muted text-xs font-body mb-1">Body Font</p>
                      <p className="text-white text-xl font-body">{brandKit.fonts.body.name}</p>
                      <p className="text-brand-muted text-sm font-body mt-1">
                        {brandKit.fonts.body.weight} · {brandKit.fonts.body.style}
                      </p>
                    </div>
                  </div>
                  <p className="text-brand-muted text-sm font-body">{brandKit.fonts.reasoning}</p>
                </div>
              </div>

              {/* Brand Voice */}
              <div className="gradient-border p-6 sm:p-8">
                <div className="relative">
                  <h3 className="font-heading font-semibold text-xl text-white mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-fuchsia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                    Brand Voice
                  </h3>

                  <div className="mb-6">
                    <p className="text-brand-muted text-xs font-body mb-2">Tone</p>
                    <p className="text-white font-body text-lg">{brandKit.brandVoice.tone}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-brand-muted text-xs font-body mb-2">Description</p>
                    <p className="text-brand-muted font-body">{brandKit.brandVoice.description}</p>
                  </div>

                  <div>
                    <p className="text-brand-muted text-xs font-body mb-3">Suggested Taglines</p>
                    <div className="space-y-2">
                      {brandKit.brandVoice.taglines.map((tagline, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl"
                        >
                          <span className="text-brand-fuchsia font-heading font-bold text-sm">{i + 1}</span>
                          <p className="text-white font-body italic">&ldquo;{tagline}&rdquo;</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo Direction */}
              <div className="gradient-border p-6 sm:p-8">
                <div className="relative">
                  <h3 className="font-heading font-semibold text-xl text-white mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-fuchsia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                    Logo Direction
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-brand-muted text-xs font-body mb-2">Concept</p>
                      <p className="text-white font-body text-lg">{brandKit.logoDirection.concept}</p>
                    </div>
                    <div>
                      <p className="text-brand-muted text-xs font-body mb-2">Style</p>
                      <p className="text-brand-muted font-body">{brandKit.logoDirection.style}</p>
                    </div>
                    <div>
                      <p className="text-brand-muted text-xs font-body mb-3">Key Elements</p>
                      <div className="flex flex-wrap gap-2">
                        {brandKit.logoDirection.elements.map((element, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-zinc-800/50 border border-zinc-700 rounded-full text-brand-muted text-sm font-body"
                          >
                            {element}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="gradient-border p-6 sm:p-8">
                <div className="relative">
                  <h3 className="font-heading font-semibold text-xl text-white mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-fuchsia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Social Media Guidelines
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <p className="text-brand-muted text-xs font-body mb-2">Profile Image Guidelines</p>
                      <p className="text-white font-body">{brandKit.socialMedia.profileGuidelines}</p>
                    </div>
                    <div>
                      <p className="text-brand-muted text-xs font-body mb-2">Cover Image Guidelines</p>
                      <p className="text-white font-body">{brandKit.socialMedia.coverGuidelines}</p>
                    </div>

                    <div>
                      <p className="text-brand-muted text-xs font-body mb-3">Platform Sizes</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {brandKit.socialMedia.platforms.map((platform) => (
                          <div
                            key={platform.name}
                            className="p-3 bg-zinc-800/50 rounded-xl"
                          >
                            <p className="text-white font-heading font-semibold text-sm">{platform.name}</p>
                            <p className="text-brand-muted text-xs font-body">
                              Profile: {platform.profileSize} · Cover: {platform.coverSize}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-brand-muted text-xs font-body mb-3">Color Applications</p>
                      <div className="space-y-2">
                        {brandKit.socialMedia.colorApplications.map((app, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-brand-fuchsia flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-brand-muted text-sm font-body">{app}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                {versionCount > 1 && (
                  <BrandVaultButton
                    businessName={businessName}
                    onClick={() => setShowVault(true)}
                  />
                )}
                <button
                  onClick={resetForm}
                  className="px-8 py-3 border border-zinc-700 rounded-btn font-heading font-semibold text-white hover:border-brand-fuchsia hover:text-brand-fuchsia transition-all"
                >
                  Generate Another Kit
                </button>
              </div>
            </div>
          )}

          {/* Brand Vault Modal */}
          <VersionHistoryPanel
            businessName={businessName}
            currentVersionId={currentVersion?.id || ""}
            onRestore={handleRestoreVersion}
            onCompare={handleCompareVersions}
            onClose={() => setShowVault(false)}
            isOpen={showVault}
          />

          {/* Diff Viewer Modal */}
          {diffVersions && (
            <DiffViewer
              oldVersion={diffVersions.old}
              newVersion={diffVersions.new}
              onClose={() => {
                setShowDiff(false);
                setDiffVersions(null);
              }}
              isOpen={showDiff}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
