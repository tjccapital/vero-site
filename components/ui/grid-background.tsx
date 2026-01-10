"use client";

import { cn } from "@/lib/utils";

export function GridBackground({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(to right, rgba(229, 231, 235, 0.3) 1px, transparent 1px),
                         linear-gradient(to bottom, rgba(229, 231, 235, 0.3) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />
    </div>
  );
}
