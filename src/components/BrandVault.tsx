"use client";

import { useState, useEffect } from "react";
import {
  BrandVersion,
  BrandDiff,
  getVersionsForBusiness,
  restoreVersion,
  compareBrandKits,
  formatVersionDate,
  getVersionCount,
} from "@/lib/brandVault";

interface VersionBadgeProps {
  version: number;
  totalVersions: number;
  onClick?: () => void;
}

export const VersionBadge = ({ version, totalVersions, onClick }: VersionBadgeProps) => {
  if (totalVersions <= 1) return null;
  
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-fuchsia/20 border border-brand-fuchsia/30 rounded-full text-xs font-body text-brand-fuchsia hover:bg-brand-fuchsia/30 transition-colors"
      title="View version history"
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      v{version} of {totalVersions}
    </button>
  );
};

interface VersionHistoryPanelProps {
  businessName: string;
  currentVersionId: string;
  onRestore: (version: BrandVersion) => void;
  onCompare: (oldVersion: BrandVersion, newVersion: BrandVersion) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const VersionHistoryPanel = ({
  businessName,
  currentVersionId,
  onRestore,
  onCompare,
  onClose,
  isOpen,
}: VersionHistoryPanelProps) => {
  const [versions, setVersions] = useState<BrandVersion[]>([]);
  const [selectedForCompare, setSelectedForCompare] = useState<string | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && businessName) {
      setVersions(getVersionsForBusiness(businessName));
    }
  }, [isOpen, businessName]);

  const handleRestore = async (version: BrandVersion) => {
    setRestoring(version.id);
    
    // Small delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const restored = restoreVersion(version.id);
    if (restored) {
      onRestore(restored);
      setVersions(getVersionsForBusiness(businessName));
    }
    
    setRestoring(null);
  };

  const handleCompareClick = (version: BrandVersion) => {
    if (!selectedForCompare) {
      setSelectedForCompare(version.id);
    } else {
      const oldVersion = versions.find(v => v.id === selectedForCompare);
      if (oldVersion && oldVersion.id !== version.id) {
        onCompare(oldVersion, version);
      }
      setSelectedForCompare(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative w-full max-w-lg bg-brand-surface border border-zinc-800 rounded-card overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-fuchsia/20 to-brand-yellow/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-brand-fuchsia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div>
                <h2 className="font-heading font-semibold text-lg text-white">Brand Vault</h2>
                <p className="text-brand-muted text-xs font-body">Version history for {businessName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-brand-muted hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Compare mode indicator */}
          {selectedForCompare && (
            <div className="mt-4 p-3 bg-brand-fuchsia/10 border border-brand-fuchsia/30 rounded-xl text-sm font-body text-brand-fuchsia flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Select another version to compare
              <button 
                onClick={() => setSelectedForCompare(null)}
                className="ml-auto hover:text-white"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Version list */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-3">
          {versions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-brand-muted font-body">No versions saved yet</p>
            </div>
          ) : (
            versions.map((version) => (
              <div
                key={version.id}
                className={`p-4 rounded-xl border transition-all ${
                  version.id === currentVersionId
                    ? "bg-brand-fuchsia/10 border-brand-fuchsia/30"
                    : selectedForCompare === version.id
                    ? "bg-brand-yellow/10 border-brand-yellow/30"
                    : "bg-zinc-800/50 border-zinc-700 hover:border-zinc-600"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-heading font-semibold text-white">
                        Version {version.version}
                      </span>
                      {version.id === currentVersionId && (
                        <span className="px-2 py-0.5 bg-brand-fuchsia/20 text-brand-fuchsia text-xs rounded-full font-body">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-brand-muted text-xs font-body">
                      {formatVersionDate(version.createdAt)}
                      {version.industry && ` · ${version.industry}`}
                      {version.style && ` · ${version.style}`}
                    </p>
                    {version.note && (
                      <p className="text-brand-muted text-xs font-body mt-1 italic">
                        {version.note}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {version.id !== currentVersionId && (
                      <>
                        <button
                          onClick={() => handleCompareClick(version)}
                          className={`p-2 rounded-lg transition-colors ${
                            selectedForCompare === version.id
                              ? "bg-brand-yellow/20 text-brand-yellow"
                              : "text-brand-muted hover:text-white hover:bg-zinc-700"
                          }`}
                          title="Compare versions"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleRestore(version)}
                          disabled={restoring === version.id}
                          className="p-2 text-brand-muted hover:text-brand-fuchsia hover:bg-brand-fuchsia/10 rounded-lg transition-colors disabled:opacity-50"
                          title="Restore this version"
                        >
                          {restoring === version.id ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                          )}
                        </button>
                      </>
                    )}
                    {version.id === currentVersionId && selectedForCompare && (
                      <button
                        onClick={() => handleCompareClick(version)}
                        className="p-2 text-brand-muted hover:text-brand-yellow hover:bg-brand-yellow/10 rounded-lg transition-colors"
                        title="Compare with selected"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Color preview */}
                <div className="flex gap-1 mt-3">
                  {version.brandKit.colors.slice(0, 5).map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-md shadow-sm"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
          <p className="text-brand-muted text-xs font-body text-center">
            🔒 Your brand assets are never lost. Every version saved.
          </p>
        </div>
      </div>
    </div>
  );
};

interface DiffViewerProps {
  oldVersion: BrandVersion;
  newVersion: BrandVersion;
  onClose: () => void;
  isOpen: boolean;
}

export const DiffViewer = ({
  oldVersion,
  newVersion,
  onClose,
  isOpen,
}: DiffViewerProps) => {
  const [diff, setDiff] = useState<BrandDiff | null>(null);

  useEffect(() => {
    if (isOpen && oldVersion && newVersion) {
      setDiff(compareBrandKits(oldVersion.brandKit, newVersion.brandKit));
    }
  }, [isOpen, oldVersion, newVersion]);

  if (!isOpen || !diff) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative w-full max-w-2xl bg-brand-surface border border-zinc-800 rounded-card overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-fuchsia/20 to-brand-yellow/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-brand-fuchsia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h2 className="font-heading font-semibold text-lg text-white">Version Diff</h2>
                <p className="text-brand-muted text-xs font-body">
                  Comparing v{oldVersion.version} → v{newVersion.version}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-brand-muted hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Diff content */}
        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
          {!diff.hasChanges ? (
            <div className="text-center py-8">
              <p className="text-brand-muted font-body">No differences found between these versions</p>
            </div>
          ) : (
            <>
              {/* Colors diff */}
              {(diff.colors.added.length > 0 || diff.colors.removed.length > 0) && (
                <div className="space-y-3">
                  <h3 className="font-heading font-semibold text-white flex items-center gap-2">
                    <svg className="w-4 h-4 text-brand-fuchsia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    Color Changes
                  </h3>
                  
                  {diff.colors.added.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {diff.colors.added.map((color, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                          <span className="text-green-400 text-xs">+</span>
                          <div className="w-5 h-5 rounded" style={{ backgroundColor: color.hex }} />
                          <span className="text-white text-sm font-body">{color.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {diff.colors.removed.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {diff.colors.removed.map((color, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
                          <span className="text-red-400 text-xs">−</span>
                          <div className="w-5 h-5 rounded opacity-50" style={{ backgroundColor: color.hex }} />
                          <span className="text-brand-muted text-sm font-body line-through">{color.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Fonts diff */}
              {(diff.fonts.headingChanged || diff.fonts.bodyChanged) && (
                <div className="space-y-3">
                  <h3 className="font-heading font-semibold text-white flex items-center gap-2">
                    <svg className="w-4 h-4 text-brand-fuchsia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
                    </svg>
                    Font Changes
                  </h3>
                  
                  {diff.fonts.headingChanged && (
                    <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl">
                      <span className="text-brand-muted text-xs font-body">Heading:</span>
                      <span className="text-red-400 line-through text-sm">{diff.fonts.oldHeading}</span>
                      <svg className="w-4 h-4 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      <span className="text-green-400 text-sm">{diff.fonts.newHeading}</span>
                    </div>
                  )}
                  
                  {diff.fonts.bodyChanged && (
                    <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl">
                      <span className="text-brand-muted text-xs font-body">Body:</span>
                      <span className="text-red-400 line-through text-sm">{diff.fonts.oldBody}</span>
                      <svg className="w-4 h-4 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      <span className="text-green-400 text-sm">{diff.fonts.newBody}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Brand voice diff */}
              {(diff.brandVoice.toneChanged || diff.brandVoice.taglinesAdded.length > 0 || diff.brandVoice.taglinesRemoved.length > 0) && (
                <div className="space-y-3">
                  <h3 className="font-heading font-semibold text-white flex items-center gap-2">
                    <svg className="w-4 h-4 text-brand-fuchsia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                    Voice Changes
                  </h3>
                  
                  {diff.brandVoice.toneChanged && (
                    <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl">
                      <span className="text-brand-muted text-xs font-body">Tone:</span>
                      <span className="text-red-400 line-through text-sm">{diff.brandVoice.oldTone}</span>
                      <svg className="w-4 h-4 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      <span className="text-green-400 text-sm">{diff.brandVoice.newTone}</span>
                    </div>
                  )}
                  
                  {diff.brandVoice.taglinesAdded.length > 0 && (
                    <div className="space-y-1">
                      {diff.brandVoice.taglinesAdded.map((t, i) => (
                        <div key={i} className="p-2 bg-green-500/10 border border-green-500/30 rounded-lg text-sm text-green-400 flex items-center gap-2">
                          <span>+</span>
                          <span className="italic">&quot;{t}&quot;</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {diff.brandVoice.taglinesRemoved.length > 0 && (
                    <div className="space-y-1">
                      {diff.brandVoice.taglinesRemoved.map((t, i) => (
                        <div key={i} className="p-2 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400 flex items-center gap-2">
                          <span>−</span>
                          <span className="italic line-through">&quot;{t}&quot;</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Logo direction diff */}
              {(diff.logoDirection.conceptChanged || diff.logoDirection.elementsAdded.length > 0 || diff.logoDirection.elementsRemoved.length > 0) && (
                <div className="space-y-3">
                  <h3 className="font-heading font-semibold text-white flex items-center gap-2">
                    <svg className="w-4 h-4 text-brand-fuchsia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                    Logo Direction Changes
                  </h3>
                  
                  {diff.logoDirection.conceptChanged && (
                    <div className="p-3 bg-zinc-800/50 rounded-xl space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-red-400 text-xs mt-1">−</span>
                        <p className="text-red-400/70 text-sm line-through">{diff.logoDirection.oldConcept}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-400 text-xs mt-1">+</span>
                        <p className="text-green-400 text-sm">{diff.logoDirection.newConcept}</p>
                      </div>
                    </div>
                  )}
                  
                  {(diff.logoDirection.elementsAdded.length > 0 || diff.logoDirection.elementsRemoved.length > 0) && (
                    <div className="flex flex-wrap gap-2">
                      {diff.logoDirection.elementsAdded.map((e, i) => (
                        <span key={i} className="px-2 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 text-xs">
                          + {e}
                        </span>
                      ))}
                      {diff.logoDirection.elementsRemoved.map((e, i) => (
                        <span key={i} className="px-2 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-xs line-through">
                          {e}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-zinc-700 rounded-btn font-heading font-semibold text-sm text-white hover:border-brand-fuchsia hover:text-brand-fuchsia transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

interface BrandVaultButtonProps {
  businessName: string;
  onClick: () => void;
}

export const BrandVaultButton = ({ businessName, onClick }: BrandVaultButtonProps) => {
  const [versionCount, setVersionCount] = useState(0);

  useEffect(() => {
    if (businessName) {
      setVersionCount(getVersionCount(businessName));
    }
  }, [businessName]);

  if (versionCount <= 1) return null;

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-btn font-body text-sm text-brand-muted hover:text-white hover:border-brand-fuchsia transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
      Brand Vault ({versionCount} versions)
    </button>
  );
};
