import { getPostBySlug, getAllSlugs } from "@/lib/blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — BrandSnap Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      siteName: "BrandSnap",
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="text-sm text-brand-muted hover:text-brand-fuchsia transition-colors font-body mb-6 inline-block"
          >
            ← Back to blog
          </Link>

          <time className="text-xs text-brand-muted font-body uppercase tracking-wider block mb-2">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>

          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-brand-muted text-lg font-body mb-10 border-l-2 border-brand-fuchsia pl-4">
            {post.description}
          </p>

          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-heading prose-headings:text-white
              prose-p:font-body prose-p:text-zinc-300
              prose-a:text-brand-fuchsia prose-a:no-underline hover:prose-a:text-brand-yellow
              prose-strong:text-white
              prose-li:text-zinc-300 prose-li:font-body
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-ul:my-4 prose-ol:my-4
              prose-blockquote:border-brand-fuchsia prose-blockquote:text-zinc-400"
            dangerouslySetInnerHTML={{ __html: post.htmlContent }}
          />

          {/* CTA */}
          <div className="mt-16 p-8 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 text-center">
            <h3 className="font-heading text-2xl font-bold text-white mb-3">
              Ready to build your brand identity?
            </h3>
            <p className="text-brand-muted font-body mb-6 max-w-md mx-auto">
              BrandSnap generates complete brand kits — colors, fonts, logo concepts, and guidelines — in seconds.
            </p>
            <Link
              href="/app"
              className="inline-block px-8 py-3 bg-gradient-to-r from-brand-fuchsia to-brand-yellow rounded-btn font-heading font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Generate Your Brand Kit →
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
