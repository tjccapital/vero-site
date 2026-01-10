import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { ReceiptDemo } from "@/components/sections/receipt-demo";
import { UseCases } from "@/components/sections/use-cases";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Hero />
        <div id="features">
          <Features />
        </div>
        <ReceiptDemo />
        <div id="use-cases">
          <UseCases />
        </div>
        <CTA />
      </main>
      <Footer />
    </>
  );
}
