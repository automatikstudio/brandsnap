import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — BrandSnap",
  description:
    "Tips, guides, and insights on brand identity, startup branding, color palettes, and building a memorable brand with AI.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4">
            Brand<span className="gradient-text">Snap</span> Blog
          </h1>
          <p className="text-brand-muted text-lg font-body mb-12 max-w-2xl">
            Practical guides on brand identity, color psychology, startup branding, and
            how AI is changing the way founders build brands.
          </p>

          {posts.length === 0 ? (
            <p className="text-brand-muted font-body">No posts yet — check back soon!</p>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="group border border-zinc-800/60 rounded-2xl p-6 hover:border-brand-fuchsia/40 transition-colors"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <time className="text-xs text-brand-muted font-body uppercase tracking-wider">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <h2 className="font-heading text-xl md:text-2xl font-semibold text-white mt-2 group-hover:text-brand-fuchsia transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-brand-muted font-body mt-2 line-clamp-2">
                      {post.description}
                    </p>
                    <span className="inline-block mt-4 text-sm font-heading font-semibold text-brand-fuchsia group-hover:text-brand-yellow transition-colors">
                      Read more →
                    </span>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
