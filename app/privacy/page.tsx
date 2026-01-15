import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Vero",
  description: "Privacy policy for Vero's digital receipt platform.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-8">
              Last updated: January 15, 2026
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Vero ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our digital receipt platform and services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using our services, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Transaction Data</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                When merchants use our platform, we collect transaction information including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Purchase details (items, prices, timestamps)</li>
                <li>Merchant information</li>
                <li>Payment method metadata (not full card numbers)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Technical Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We automatically collect certain technical information including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>IP addresses</li>
                <li>Browser type and version</li>
                <li>Device information</li>
                <li>Access times and dates</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>To provide and maintain our digital receipt services</li>
                <li>To encrypt and securely deliver receipts to cardholders</li>
                <li>To improve and optimize our platform</li>
                <li>To detect and prevent fraud</li>
                <li>To comply with legal obligations</li>
                <li>To communicate with you about our services</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. End-to-End Encryption</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Vero implements end-to-end encryption for all receipt data. This means:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Receipt data is encrypted before leaving the merchant's system</li>
                <li>Only the intended cardholder can decrypt the receipt</li>
                <li>We cannot access the contents of encrypted receipts</li>
                <li>No intermediaries, including Vero, can view your purchase details</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Sharing and Disclosure</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell your personal information. We may share information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>With card issuers to deliver encrypted receipts to your banking app</li>
                <li>With service providers who assist in operating our platform</li>
                <li>When required by law or to protect our legal rights</li>
                <li>In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We retain encrypted receipt metadata for as long as necessary to provide our services and comply with legal obligations. Encrypted receipt content is stored only as long as required by card issuers and can be deleted upon request.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate data</li>
                <li>Deletion of your data</li>
                <li>Restriction of processing</li>
                <li>Data portability</li>
                <li>Objection to processing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement industry-standard security measures to protect your information, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have questions about this Privacy Policy, please contact us through the contact information provided on our website.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
