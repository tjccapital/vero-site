import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { MerchantHero } from "@/components/sections/merchants/merchant-hero";
import { MerchantStats } from "@/components/sections/merchants/merchant-stats";
import { HowItWorks } from "@/components/sections/merchants/how-it-works";
import { MerchantBenefits } from "@/components/sections/merchants/merchant-benefits";
import { OffsetCosts } from "@/components/sections/merchants/offset-costs";
import { ConsumerDemand } from "@/components/sections/merchants/consumer-demand";
import { MerchantIntegrations } from "@/components/sections/merchants/merchant-integrations";
import { MerchantCTA } from "@/components/sections/merchants/merchant-cta";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merchants - Join the Vero Digital Receipt Network",
  description:
    "Join the growing Vero merchant network. Deliver digital receipts, reduce chargebacks, earn rewards, and get paid for every receipt you send. Free to integrate.",
  openGraph: {
    title: "Vero Merchant Network - Digital Receipts for Merchants",
    description:
      "Join the growing Vero merchant network. Deliver digital receipts, reduce chargebacks, and earn rewards.",
    type: "website",
  },
};

export default function MerchantsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <MerchantHero />
        <MerchantStats />
        <HowItWorks />
        <MerchantBenefits />
        <OffsetCosts />
        <ConsumerDemand />
        <MerchantIntegrations />
        <MerchantCTA />
      </main>
      <Footer />
    </>
  );
}
