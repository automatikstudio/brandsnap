import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BrandSnap — AI Brand Identity Kit Generator",
  description:
    "Generate complete brand identity kits in seconds. Color palettes, font pairings, logo concepts, and social media templates — powered by AI.",
  keywords: ["brand identity", "brand kit", "AI branding", "color palette generator", "logo design", "brand guidelines"],
  openGraph: {
    title: "BrandSnap — AI Brand Identity Kit Generator",
    description: "Generate complete brand identity kits in seconds. Color palettes, font pairings, logo concepts, and social templates.",
    type: "website",
    siteName: "BrandSnap",
    url: "https://brandsnap-eight.vercel.app",
    images: [{ url: "https://brandsnap-eight.vercel.app/og-image.png", width: 1200, height: 630, alt: "BrandSnap — AI Brand Identity Kit Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BrandSnap — AI Brand Identity Kit Generator",
    description: "Your brand identity. Generated in seconds.",
    creator: "@automatikstudio",
    images: ["https://brandsnap-eight.vercel.app/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-brand-bg">
        {children}
      </body>
    </html>
  );
}
