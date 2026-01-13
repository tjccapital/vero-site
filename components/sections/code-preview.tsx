"use client";

import { ArrowRight, Copy, Check } from "lucide-react";
import { useState } from "react";

const codeExample = `import { Vero } from '@vero/sdk';

// Initialize Vero with your API key
const vero = new Vero({ apiKey: process.env.VERO_API_KEY });

// Register a user's card for digital receipts
const { publicKey } = await vero.keys.generate();
await vero.users.register({
  hashedPan: hashCardNumber(cardNumber),
  publicKey,
});

// That's it! Receipts will now be delivered automatically.`;

export function CodePreview() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div>
            <p className="text-sm font-medium text-blue-400 mb-3">For Developers</p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6 leading-tight">
              Integrate in minutes,<br />not months
            </h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Our SDK handles the complexity of key management and encryption.
              Card issuers can enable digital receipts for their users with just a few lines of code.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://docs.vero.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-[#1e3a8a] hover:bg-blue-800 transition-colors group"
              >
                View Documentation
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="https://docs.vero.com/sdks"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-slate-300 border border-slate-600 hover:border-slate-500 hover:text-white transition-colors"
              >
                Explore SDKs
              </a>
            </div>
          </div>

          {/* Right - Code Block */}
          <div className="relative">
            <div className="bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900/50 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-xs text-slate-500 font-mono">issuer-integration.ts</span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors"
                  title="Copy code"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Code */}
              <div className="p-4 overflow-x-auto">
                <pre className="text-sm font-mono leading-relaxed">
                  <code>
                    <span className="text-purple-400">import</span>
                    <span className="text-slate-300"> {"{"} </span>
                    <span className="text-blue-300">Vero</span>
                    <span className="text-slate-300"> {"}"} </span>
                    <span className="text-purple-400">from</span>
                    <span className="text-green-400"> &apos;@vero/sdk&apos;</span>
                    <span className="text-slate-300">;</span>
                    {"\n\n"}
                    <span className="text-slate-500">{"// Initialize Vero with your API key"}</span>
                    {"\n"}
                    <span className="text-purple-400">const</span>
                    <span className="text-blue-300"> vero</span>
                    <span className="text-slate-300"> = </span>
                    <span className="text-purple-400">new</span>
                    <span className="text-yellow-300"> Vero</span>
                    <span className="text-slate-300">({"{"} </span>
                    <span className="text-blue-300">apiKey</span>
                    <span className="text-slate-300">: </span>
                    <span className="text-blue-300">process</span>
                    <span className="text-slate-300">.</span>
                    <span className="text-blue-300">env</span>
                    <span className="text-slate-300">.</span>
                    <span className="text-blue-300">VERO_API_KEY</span>
                    <span className="text-slate-300"> {"}"});</span>
                    {"\n\n"}
                    <span className="text-slate-500">{"// Register a user's card for digital receipts"}</span>
                    {"\n"}
                    <span className="text-purple-400">const</span>
                    <span className="text-slate-300"> {"{"} </span>
                    <span className="text-blue-300">publicKey</span>
                    <span className="text-slate-300"> {"}"} = </span>
                    <span className="text-purple-400">await</span>
                    <span className="text-blue-300"> vero</span>
                    <span className="text-slate-300">.</span>
                    <span className="text-blue-300">keys</span>
                    <span className="text-slate-300">.</span>
                    <span className="text-yellow-300">generate</span>
                    <span className="text-slate-300">();</span>
                    {"\n"}
                    <span className="text-purple-400">await</span>
                    <span className="text-blue-300"> vero</span>
                    <span className="text-slate-300">.</span>
                    <span className="text-blue-300">users</span>
                    <span className="text-slate-300">.</span>
                    <span className="text-yellow-300">register</span>
                    <span className="text-slate-300">({"{"}</span>
                    {"\n"}
                    <span className="text-slate-300">  </span>
                    <span className="text-blue-300">hashedPan</span>
                    <span className="text-slate-300">: </span>
                    <span className="text-yellow-300">hashCardNumber</span>
                    <span className="text-slate-300">(</span>
                    <span className="text-blue-300">cardNumber</span>
                    <span className="text-slate-300">),</span>
                    {"\n"}
                    <span className="text-slate-300">  </span>
                    <span className="text-blue-300">publicKey</span>
                    <span className="text-slate-300">,</span>
                    {"\n"}
                    <span className="text-slate-300">{"}"});</span>
                    {"\n\n"}
                    <span className="text-slate-500">{"// That's it! Receipts will now be delivered automatically."}</span>
                  </code>
                </pre>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -z-10 top-8 -right-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -z-10 -bottom-8 -left-8 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
