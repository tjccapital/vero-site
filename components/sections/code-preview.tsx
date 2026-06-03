"use client";

import { ArrowRight, Copy, Check } from "lucide-react";
import { useState } from "react";

const codeExample = `{
  "mcpServers": {
    "vero": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp.veroreceipts.com/mcp"]
    }
  }
}`;

export function CodePreview() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-900 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Code Block - Second on mobile, first on desktop */}
          <div className="relative order-2 lg:order-1 min-w-0">
            <div className="bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl max-w-full">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900/50 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-xs text-slate-500 font-mono">mcp.json</span>
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
              <div className="p-3 sm:p-4 overflow-x-auto">
                <pre className="text-xs sm:text-sm font-mono leading-relaxed">
                  <code>
                    <span className="text-slate-300">{"{"}</span>
                    {"\n"}
                    <span className="text-slate-300">  </span>
                    <span className="text-blue-300">&quot;mcpServers&quot;</span>
                    <span className="text-slate-300">: {"{"}</span>
                    {"\n"}
                    <span className="text-slate-300">    </span>
                    <span className="text-blue-300">&quot;vero&quot;</span>
                    <span className="text-slate-300">: {"{"}</span>
                    {"\n"}
                    <span className="text-slate-300">      </span>
                    <span className="text-blue-300">&quot;command&quot;</span>
                    <span className="text-slate-300">: </span>
                    <span className="text-green-400">&quot;npx&quot;</span>
                    <span className="text-slate-300">,</span>
                    {"\n"}
                    <span className="text-slate-300">      </span>
                    <span className="text-blue-300">&quot;args&quot;</span>
                    <span className="text-slate-300">: [</span>
                    <span className="text-green-400">&quot;mcp-remote&quot;</span>
                    <span className="text-slate-300">, </span>
                    <span className="text-green-400">&quot;https://mcp.veroreceipts.com/mcp&quot;</span>
                    <span className="text-slate-300">]</span>
                    {"\n"}
                    <span className="text-slate-300">    {"}"}</span>
                    {"\n"}
                    <span className="text-slate-300">  {"}"}</span>
                    {"\n"}
                    <span className="text-slate-300">{"}"}</span>
                  </code>
                </pre>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -z-10 top-8 -right-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -z-10 -bottom-8 -left-8 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>

          {/* Text - First on mobile, second on desktop */}
          <div className="order-1 lg:order-2 min-w-0">
            <p className="text-sm font-medium text-blue-400 mb-3">For Developers</p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-6 leading-tight">
              An MCP server for all of your<br />transactions and receipts
            </h2>
            <p className="text-lg text-slate-400 mb-8 leading-relaxed">
              Drop the snippet into your MCP client config to start the Vero
              server, then let your agents query transactions and receipts in
              natural language &mdash; no extra plumbing required.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="https://docs.veroreceipts.com/mcp-server/setup"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 sm:px-6 py-3 text-sm font-medium text-white bg-[#1e3a8a] hover:bg-blue-800 transition-colors group w-full sm:w-auto"
              >
                View Setup Docs
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="https://docs.veroreceipts.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 sm:px-6 py-3 text-sm font-medium text-slate-300 border border-slate-600 hover:border-slate-500 hover:text-white transition-colors w-full sm:w-auto"
              >
                Browse Docs
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
