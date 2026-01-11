import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Vero - Digital Receipts",
  description: "News, updates, and insights from the Vero team. Learn about digital receipts, fraud prevention, and the future of payments.",
  openGraph: {
    title: "Blog | Vero - Digital Receipts",
    description: "News, updates, and insights from the Vero team. Learn about digital receipts, fraud prevention, and the future of payments.",
    type: "website",
  },
};

const posts = [
  {
    slug: "introducing-vero",
    title: "Introducing Vero: Digital Receipts for the Modern World",
    excerpt: "We're launching our beta program to help card issuers and merchants reduce friendly fraud with secure, portable digital receipts.",
    date: "Jan 10, 2026",
    category: "Announcements",
    readTime: "3 min read",
    featured: true,
  },
  {
    slug: "reduce-friendly-fraud",
    title: "How Digital Receipts Reduce Friendly Fraud by 40%",
    excerpt: "Friendly fraud costs card issuers billions annually. Learn how itemized digital receipts linked to transactions help resolve disputes instantly.",
    date: "Jan 8, 2026",
    category: "Insights",
    readTime: "5 min read",
  },
  {
    slug: "drp-explained",
    title: "The Digital Receipt Protocol (DRP) Explained",
    excerpt: "A deep dive into the open standard powering secure receipt delivery. End-to-end encryption ensures card issuers can deliver but never read your receipts.",
    date: "Jan 5, 2026",
    category: "Engineering",
    readTime: "8 min read",
  },
  {
    slug: "pos-integration-guide",
    title: "5-Minute Integration: Adding Vero to Your POS",
    excerpt: "Step-by-step guide to integrating digital receipts with Square, Toast, Clover, and Shopify. No code required.",
    date: "Jan 3, 2026",
    category: "Tutorials",
    readTime: "4 min read",
  },
  {
    slug: "card-issuers-digital-receipts",
    title: "Why Card Issuers Are Betting on Digital Receipts",
    excerpt: "From reduced chargebacks to increased customer engagement, here's why leading issuers are joining our beta program.",
    date: "Dec 28, 2025",
    category: "Insights",
    readTime: "6 min read",
  },
  {
    slug: "zero-knowledge-receipts",
    title: "Building for Privacy: Zero-Knowledge Receipt Delivery",
    excerpt: "How we designed a system where card issuers can deliver receipts without ever seeing what you bought.",
    date: "Dec 20, 2025",
    category: "Engineering",
    readTime: "10 min read",
  },
];

export default function BlogPage() {
  const featuredPost = posts.find((p) => p.featured);
  const regularPosts = posts.filter((p) => !p.featured);

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
              Blog
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl">
              News, updates, and insights from the Vero team. Learn about digital receipts, fraud prevention, and the future of payments.
            </p>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="pb-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <a href={`/blog/${featuredPost.slug}`} className="group block bg-blue-900 rounded-2xl p-8 md:p-12 hover:bg-blue-800 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-medium text-blue-300 bg-blue-800 px-3 py-1 rounded-full">
                    {featuredPost.category}
                  </span>
                  <span className="text-xs text-blue-300">{featuredPost.date}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3 group-hover:text-blue-100 transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-blue-200 mb-6 max-w-2xl">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-2 text-white font-medium text-sm">
                  Read more
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            </div>
          </section>
        )}

        {/* Post Grid */}
        <section className="pb-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <a
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{post.date}</span>
                    <span>{post.readTime}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-gray-50 border-t border-gray-200">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Stay in the loop
            </h2>
            <p className="text-gray-500 mb-6">
              Get the latest updates on digital receipts and fraud prevention delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
