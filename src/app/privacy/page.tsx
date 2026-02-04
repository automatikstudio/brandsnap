import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <Navbar />

      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-white mb-8">
            Privacy <span className="gradient-text">Policy</span>
          </h1>

          <div className="prose prose-invert max-w-none space-y-6 font-body text-brand-muted">
            <p className="text-sm">Last updated: February 2026</p>

            <section>
              <h2 className="font-heading font-semibold text-xl text-white mt-8 mb-4">1. Introduction</h2>
              <p>
                BrandSnap (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is operated by Automatik.studio. This Privacy Policy explains how we collect,
                use, and protect your information when you use our AI-powered brand identity kit generator service.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-xl text-white mt-8 mb-4">2. Information We Collect</h2>
              <p>We may collect the following information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Business information you provide (name, description, industry)</li>
                <li>Style preferences and selections</li>
                <li>Usage data and analytics (pages visited, features used)</li>
                <li>Device information (browser type, operating system)</li>
                <li>IP address and approximate location</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-xl text-white mt-8 mb-4">3. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Generate brand identity kits based on your input</li>
                <li>Improve our AI models and service quality</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Send service-related communications</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-xl text-white mt-8 mb-4">4. Data Sharing</h2>
              <p>
                We do not sell your personal information. We may share data with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>AI service providers (Anthropic) to process your brand kit requests</li>
                <li>Analytics providers to understand service usage</li>
                <li>Hosting providers (Vercel) for service delivery</li>
                <li>Law enforcement if required by applicable law</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-xl text-white mt-8 mb-4">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your information. However,
                no internet transmission is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-xl text-white mt-8 mb-4">6. Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal data.
                Contact us at automatikstudiomail@gmail.com for any privacy-related requests.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-xl text-white mt-8 mb-4">7. Cookies</h2>
              <p>
                We use essential cookies for service functionality and analytics cookies to understand usage patterns.
                You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-xl text-white mt-8 mb-4">8. Changes to This Policy</h2>
              <p>
                We may update this policy from time to time. We will notify you of any material changes by posting
                the new policy on this page.
              </p>
            </section>

            <section>
              <h2 className="font-heading font-semibold text-xl text-white mt-8 mb-4">9. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:{" "}
                <a href="mailto:automatikstudiomail@gmail.com" className="text-brand-fuchsia hover:text-brand-yellow transition-colors">
                  automatikstudiomail@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
