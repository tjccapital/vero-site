import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vero - Digital Receipts for the Modern World",
  description: "Vero transforms paper receipts into secure, portable digital records. Built on the Digital Receipt Protocol for seamless integration across merchants, payment processors, and consumers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
