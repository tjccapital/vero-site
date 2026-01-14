import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { UseCases } from "@/components/sections/use-cases";
import { IntegrationTabs } from "@/components/sections/integration-tabs";
import { Encryption } from "@/components/sections/encryption";
import { ReceiptDemo } from "@/components/sections/receipt-demo";
import { CodePreview } from "@/components/sections/code-preview";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Features />
        <UseCases />
        <ReceiptDemo />
        <CodePreview />
        <IntegrationTabs />
        <Encryption />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
