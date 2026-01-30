import type { Metadata } from "next";
import Script from "next/script";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";
import "./globals.css";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export const metadata: Metadata = {
  metadataBase: new URL("https://seevero.com"),
  title: {
    default: "Vero - Digital Receipts",
    template: "%s | Vero",
  },
  description:
    "Vero transforms paper receipts into secure, portable digital records. Reduce friendly fraud by 40% with itemized receipts linked to transactions. Free for merchants, beta for card issuers.",
  keywords: [
    "digital receipts",
    "electronic receipts",
    "e-receipts",
    "friendly fraud",
    "chargeback prevention",
    "payment receipts",
    "POS integration",
    "card issuer",
    "merchant receipts",
    "Digital Receipt Protocol",
    "DRP",
  ],
  authors: [{ name: "Vero" }],
  creator: "Vero",
  publisher: "Vero",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://seevero.com",
    siteName: "Vero",
    title: "Vero - Digital Receipts",
    description:
      "Transform paper receipts into secure, portable digital records. Reduce friendly fraud by 40% with itemized receipts linked to transactions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vero - Digital Receipts",
    description:
      "Transform paper receipts into secure, portable digital records. Reduce friendly fraud by 40%.",
    creator: "@seevero",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://seevero.com" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NZ8WQ62Z7K"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NZ8WQ62Z7K');
          `}
        </Script>
      </head>
      <body className="antialiased">
        <Auth0Provider>
          {children}
          <ScrollToTop />
        </Auth0Provider>
      </body>
    </html>
  );
}
