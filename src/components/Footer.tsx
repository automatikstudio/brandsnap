import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/50 bg-brand-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-fuchsia to-brand-yellow flex items-center justify-center">
                <span className="font-heading font-bold text-white text-sm">B</span>
              </div>
              <span className="font-heading font-bold text-xl text-white">
                Brand<span className="gradient-text">Snap</span>
              </span>
            </div>
            <p className="text-brand-muted text-sm font-body max-w-sm">
              Generate complete brand identity kits in seconds. Powered by AI, designed for founders and creators.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/#features" className="text-brand-muted hover:text-white transition-colors text-sm font-body">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-brand-muted hover:text-white transition-colors text-sm font-body">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/app" className="text-brand-muted hover:text-white transition-colors text-sm font-body">
                  Generate Kit
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-brand-muted hover:text-white transition-colors text-sm font-body">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-brand-muted hover:text-white transition-colors text-sm font-body">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-brand-muted hover:text-white transition-colors text-sm font-body">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-800/50 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-brand-muted text-sm font-body">
            © {new Date().getFullYear()} BrandSnap. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-brand-muted text-sm font-body">
            <p>
              Built by{" "}
              <a
                href="https://automatik.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-fuchsia hover:text-brand-yellow transition-colors"
              >
                Automatik.studio
              </a>
            </p>
            <span className="hidden sm:inline">•</span>
            <p>
              BrandSnap is listed on{" "}
              <a
                href="https://aitoolzdir.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-fuchsia hover:text-brand-yellow transition-colors"
              >
                AI Toolz Dir
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
