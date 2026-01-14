"use client";

import { useState, useEffect, useCallback } from "react";
import { Lock, EyeOff, Key, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { EvervaultCard, Icon } from "@/components/ui/evervault-card";

const rotatingTexts = [
  "Merchant POS encrypts receipt with your public key",
  "Encrypted data travels through Vero",
  "Card issuer delivers but cannot read",
  "Your private key decrypts in your card app. Voila.",
];

export function Encryption() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % rotatingTexts.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 1000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="py-12 sm:py-20 bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-sm font-medium text-primary-400 mb-2">Security</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white">
            End-to-end encryption by design
          </h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-6">
            <p className="text-gray-400 leading-relaxed text-lg">
              Digital receipts require privacy. Card issuers deliver but cannot read your receipts.
              Built on the open Digital Receipt Protocol (DRP).
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Encrypted at the source</h4>
                  <p className="text-gray-400 text-sm mt-1">
                    Receipt data is encrypted on the merchant&apos;s POS before it ever leaves the store.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                  <EyeOff className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">Card issuers can&apos;t read it</h4>
                  <p className="text-gray-400 text-sm mt-1">
                    They deliver the receipt but cannot decrypt it. Zero-knowledge architecture.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                  <Key className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">You hold the keys</h4>
                  <p className="text-gray-400 text-sm mt-1">
                    Only you can decrypt your receipts. Share with expense tools or keep private.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Evervault Card with rotating text */}
          <div className="border border-white/[0.2] flex flex-col items-start p-4 relative h-[24rem] bg-slate-900/50">
            <Icon className="absolute h-6 w-6 -top-3 -left-3 text-white" />
            <Icon className="absolute h-6 w-6 -bottom-3 -left-3 text-white" />
            <Icon className="absolute h-6 w-6 -top-3 -right-3 text-white" />
            <Icon className="absolute h-6 w-6 -bottom-3 -right-3 text-white" />

            <div className="w-full h-full flex items-center justify-center relative">
              <EvervaultCard />
              {/* Rotating text overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentIndex}
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                    className="text-white text-center font-medium text-base sm:text-lg px-6 max-w-sm"
                  >
                    {rotatingTexts[currentIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-8 sm:mt-10 text-center">
          <a
            href="/product"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 transition-colors"
          >
            Learn more
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
