import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { Metadata } from "next";

// This would typically come from a CMS or database
const posts: Record<string, {
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  authorRole: string;
  category: string;
  readTime: string;
}> = {
  "introducing-vero": {
    title: "Introducing Vero: Digital Receipts for the Modern World",
    excerpt: "We're launching our beta program to help card issuers and merchants reduce friendly fraud with secure, portable digital receipts.",
    content: `
      <p>Today, we're excited to announce the launch of Vero, a platform that transforms how receipts work in the digital age.</p>

      <h2>The Problem with Paper Receipts</h2>
      <p>Every year, billions of paper receipts are printed, most of which end up in the trash within days. But the real cost isn't environmental—it's the friction they create in the payment ecosystem.</p>
      <p>When a customer disputes a charge, merchants and card issuers scramble to find proof of purchase. Without itemized receipts linked to transactions, "friendly fraud" costs the industry billions annually.</p>

      <h2>Our Solution</h2>
      <p>Vero creates a seamless bridge between point-of-sale systems and consumer banking apps. When you make a purchase, an itemized digital receipt is automatically delivered to your card app—no email, no phone number, no friction.</p>

      <h2>Privacy First</h2>
      <p>We built Vero on the Digital Receipt Protocol (DRP), an open standard that ensures end-to-end encryption. Card issuers can deliver receipts but cannot read them. Only you have access to your purchase data.</p>

      <h2>Join Our Beta</h2>
      <p>We're now accepting applications from card issuers and merchants who want to be among the first to offer digital receipts. For card issuers, our beta is completely free. For merchants, our plugins for Square, Toast, Clover, and Shopify are free forever.</p>
      <p>Ready to reduce friendly fraud and provide real value to your users? Get in touch today.</p>
    `,
    date: "January 10, 2026",
    author: "Vero Team",
    authorRole: "Product",
    category: "Announcements",
    readTime: "3 min read",
  },
  "reduce-friendly-fraud": {
    title: "How Digital Receipts Reduce Friendly Fraud by 40%",
    excerpt: "Friendly fraud costs card issuers billions annually. Learn how itemized digital receipts linked to transactions help resolve disputes instantly.",
    content: `
      <p>Friendly fraud—when customers dispute legitimate charges—costs the payment industry over $40 billion annually. But there's a simple solution that's been hiding in plain sight: digital receipts.</p>

      <h2>Understanding Friendly Fraud</h2>
      <p>Not all disputed charges are malicious. Many customers genuinely don't recognize transactions on their statements. A charge from "ACME PAYMENTS LLC" could be anything—a restaurant, a retail store, or a subscription service.</p>
      <p>Without context, customers often dispute these charges "just to be safe," triggering a costly chargeback process that hurts merchants and issuers alike.</p>

      <h2>The Receipt Solution</h2>
      <p>When digital receipts are linked to transactions, everything changes. Instead of seeing a cryptic merchant name, customers see exactly what they purchased—item by item, with the store name, address, and timestamp.</p>
      <p>"Oh, that was my coffee order from Tuesday" replaces "I don't recognize this charge."</p>

      <h2>The Numbers</h2>
      <p>Early data from our beta partners shows a 40% reduction in friendly fraud disputes when digital receipts are available. That translates to millions in savings for card issuers and reduced operational burden for merchants.</p>

      <h2>Beyond Fraud Prevention</h2>
      <p>Digital receipts aren't just about preventing fraud. They enable expense tracking, warranty management, returns without paper receipts, and integration with accounting software. It's a better experience for everyone.</p>
    `,
    date: "January 8, 2026",
    author: "Sarah Chen",
    authorRole: "Head of Product",
    category: "Insights",
    readTime: "5 min read",
  },
  "drp-explained": {
    title: "The Digital Receipt Protocol (DRP) Explained",
    excerpt: "A deep dive into the open standard powering secure receipt delivery. End-to-end encryption ensures card issuers can deliver but never read your receipts.",
    content: `
      <p>At the heart of Vero is the Digital Receipt Protocol (DRP)—an open standard we developed to solve the privacy challenges inherent in digital receipt delivery.</p>

      <h2>The Privacy Challenge</h2>
      <p>Digital receipts seem simple until you consider the privacy implications. If card issuers can see your itemized purchases, that's a massive breach of trust. Your bank knowing that you bought coffee is one thing; knowing exactly what medications you purchased is another.</p>
      <p>We needed a system where receipts could flow through card networks without being readable by intermediaries.</p>

      <h2>How DRP Works</h2>
      <p>DRP uses public-key cryptography to ensure end-to-end encryption:</p>
      <ol>
        <li><strong>Key Generation:</strong> When you link your card to receive digital receipts, a unique key pair is generated on your device.</li>
        <li><strong>Encryption at Source:</strong> The merchant's POS system encrypts receipt data using your public key before it leaves the store.</li>
        <li><strong>Blind Delivery:</strong> Card issuers route the encrypted receipt to your device without being able to decrypt it.</li>
        <li><strong>Local Decryption:</strong> Your banking app uses your private key to decrypt and display the receipt.</li>
      </ol>

      <h2>Open Standard</h2>
      <p>DRP is open source and available for anyone to implement. We believe that digital receipts should be an open ecosystem, not a walled garden controlled by any single company.</p>

      <h2>Learn More</h2>
      <p>The full DRP specification is available on our documentation site. We welcome contributions and feedback from the developer community.</p>
    `,
    date: "January 5, 2026",
    author: "Alex Rivera",
    authorRole: "CTO",
    category: "Engineering",
    readTime: "8 min read",
  },
};

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    return {
      title: "Post Not Found | Vero Blog",
    };
  }

  return {
    title: `${post.title} | Vero Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="pt-16">
          <section className="py-24">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-3xl font-semibold text-gray-900 mb-4">Post not found</h1>
              <p className="text-gray-500 mb-8">The article you're looking for doesn't exist.</p>
              <a href="/blog" className="text-primary-900 hover:text-blue-700 font-medium">
                Back to blog
              </a>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-12 bg-gradient-to-b from-blue-50 to-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <a
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to blog
            </a>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-medium text-primary-900 bg-primary-50 px-3 py-1 rounded-full">
                {post.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
                <span className="text-gray-300">·</span>
                <span>{post.authorRole}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="prose prose-lg prose-gray max-w-none
                prose-headings:font-semibold prose-headings:text-gray-900
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-primary-900 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-ol:text-gray-600 prose-ol:my-6 prose-ol:pl-6
                prose-ul:text-gray-600 prose-ul:my-6 prose-ul:pl-6
                prose-li:mb-2"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </section>

        {/* Author & CTA */}
        <section className="py-12 border-t border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-primary-50 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ready to get started?
              </h3>
              <p className="text-gray-600 mb-6">
                Join our beta program and be among the first to deliver digital receipts.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-primary-900 rounded-lg hover:bg-primary-800 transition-colors"
              >
                Get Involved with Beta
              </a>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-8 text-center">More from the blog</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(posts)
                .filter(([key]) => key !== slug)
                .slice(0, 2)
                .map(([key, relatedPost]) => (
                  <a
                    key={key}
                    href={`/blog/${key}`}
                    className="group block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all"
                  >
                    <span className="text-xs font-medium text-primary-900 bg-primary-50 px-2.5 py-1 rounded-full">
                      {relatedPost.category}
                    </span>
                    <h4 className="text-lg font-semibold text-gray-900 mt-3 mb-2 group-hover:text-primary-900 transition-colors">
                      {relatedPost.title}
                    </h4>
                    <p className="text-sm text-gray-500 line-clamp-2">{relatedPost.excerpt}</p>
                  </a>
                ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
