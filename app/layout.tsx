import type { Metadata } from "next";
import "./globals.css";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export const metadata: Metadata = {
  metadataBase: new URL("https://getvero.com"),
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
    url: "https://getvero.com",
    siteName: "Vero",
    title: "Vero - Digital Receipts for the Modern World",
    description:
      "Transform paper receipts into secure, portable digital records. Reduce friendly fraud by 40% with itemized receipts linked to transactions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vero - Digital Receipts for the Modern World",
    description:
      "Transform paper receipts into secure, portable digital records. Reduce friendly fraud by 40%.",
    creator: "@getvero",
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
        <link rel="canonical" href="https://getvero.com" />
      </head>
      <body className="antialiased">
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
