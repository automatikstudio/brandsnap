"use client";

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
}

export default function ComingSoonModal({ isOpen, onClose, planName }: ComingSoonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-brand-surface border border-zinc-800 rounded-card p-8 max-w-md w-full text-center">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-fuchsia to-brand-yellow rounded-card opacity-20 blur-xl" />

        <div className="relative">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-fuchsia/20 to-brand-yellow/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-brand-fuchsia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h3 className="font-heading font-bold text-2xl text-white mb-2">Coming Soon!</h3>
          <p className="text-brand-muted font-body mb-6">
            The <span className="text-brand-fuchsia font-semibold">{planName}</span> plan is launching soon.
            We&apos;ll notify you when it&apos;s available!
          </p>

          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-brand-fuchsia to-brand-yellow rounded-btn font-heading font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
