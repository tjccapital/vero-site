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
              Last updated: February 17, 2026
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

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Email Data (Optional Feature)</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you choose to connect your email account via Google OAuth, we collect the following information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Your Google email address associated with the connected account</li>
                <li>Email receipt messages from merchants (e.g., order confirmations, purchase receipts, shipping notifications)</li>
                <li>Metadata from receipt emails, including sender, subject line, date, and transaction amounts</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do <strong>not</strong> collect or access:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Personal emails unrelated to purchase receipts</li>
                <li>Email drafts, sent messages, or contacts</li>
                <li>Any email content beyond what is necessary to identify and extract receipt information</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Email access is entirely optional. You can use Vero without connecting your email. If you do connect your email, you can disconnect it at any time from your account settings.
              </p>
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
                <li>To match email receipts with your card transactions for a unified receipt history (if you connect your email)</li>
                <li>To extract and display receipt details from your email for your personal review</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                If you connect your Google email account, email data is used <strong>solely</strong> for the purpose of identifying, extracting, and matching purchase receipts to your card transactions. We do not use your email data for advertising, marketing profiling, or any purpose unrelated to providing our receipt management services.
              </p>
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
              <p className="text-gray-700 leading-relaxed">
                Google user data obtained through the Gmail API is never sold, transferred to third parties for advertising, transferred to data brokers, or used for any purpose beyond providing Vero&apos;s receipt-matching feature to you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We retain encrypted receipt metadata for as long as necessary to provide our services and comply with legal obligations. Encrypted receipt content is stored only as long as required by card issuers and can be deleted upon request.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                If you connect your email account, extracted receipt data is retained for as long as your account is active or as needed to provide the receipt-matching service. If you disconnect your email account, we stop accessing new email data immediately. Previously extracted receipt data that has been matched to transactions remains part of your receipt history but no further email data is collected. You may request deletion of all email-derived receipt data at any time by contacting us or through your account settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Google API Services Usage Disclosure</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Vero&apos;s use and transfer of information received from Google APIs to any other app will adhere to the{" "}
                <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                  Google API Services User Data Policy
                </a>, including the Limited Use requirements.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1 What We Access</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you connect your Google account, Vero requests read-only access to your Gmail messages for the sole purpose of identifying and extracting purchase receipt emails. We use the Gmail API with the narrowest scope necessary to provide this feature.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.2 How We Use Google User Data</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Data obtained through Google APIs is used exclusively to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Identify emails that contain purchase receipts or order confirmations</li>
                <li>Extract transaction details (merchant name, items, amounts, dates) from those receipt emails</li>
                <li>Match extracted receipt data with your existing card transactions within Vero</li>
                <li>Display matched receipts in your Vero receipt history</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.3 Limited Use Restrictions</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                In accordance with Google&apos;s Limited Use requirements, Vero:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Does <strong>not</strong> sell Google user data to any third party</li>
                <li>Does <strong>not</strong> use Google user data for advertising, including retargeting, personalized ads, or interest-based advertising</li>
                <li>Does <strong>not</strong> use Google user data to train generalized or non-personalized artificial intelligence (AI) or machine learning (ML) models</li>
                <li>Does <strong>not</strong> allow humans to read your email data unless (a) you have given explicit, affirmative consent for a specific purpose (such as a support request), (b) it is necessary for security purposes (such as investigating abuse), or (c) it is required to comply with applicable law</li>
                <li>Does <strong>not</strong> transfer Google user data to any other app or service except as necessary to provide or improve the receipt-matching feature that you see in Vero&apos;s interface</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.4 Storage and Security of Google User Data</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                All data obtained through Google APIs is encrypted in transit (TLS 1.2+) and at rest (AES-256). Access to this data within our systems is limited to automated receipt-extraction processes. We conduct regular security audits and follow industry best practices for data protection.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.5 Revoking Access</h3>
              <p className="text-gray-700 leading-relaxed">
                You may disconnect your Google account from Vero at any time through your account settings. Upon disconnection, Vero will immediately stop accessing your Gmail data. You may also revoke Vero&apos;s access directly from your{" "}
                <a href="https://myaccount.google.com/permissions" className="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                  Google Account permissions page
                </a>. Previously extracted receipt data that has been matched to your transactions will remain in your Vero account unless you request its deletion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Your Rights</h2>
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
                <li>Disconnection of connected email accounts at any time</li>
                <li>Revocation of Google OAuth access through your Google Account security settings</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                You can disconnect your Google email at any time from your Vero account settings page. When you disconnect, Vero immediately stops accessing your email data. You can also revoke Vero&apos;s access directly from your{" "}
                <a href="https://myaccount.google.com/permissions" className="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                  Google Account permissions page
                </a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement industry-standard security measures to protect your information, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                All Google user data is encrypted in transit using TLS and at rest using AES-256 encryption. Access to email data within our systems is restricted to automated processes that extract receipt information. Human employees do not read your email content unless you have provided explicit, affirmative consent for a specific support request.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Children&apos;s Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. International Data Transfers</h2>
              <p className="text-gray-700 leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Us</h2>
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
