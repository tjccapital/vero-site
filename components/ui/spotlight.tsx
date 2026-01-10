"use client";

import { cn } from "@/lib/utils";

export function Spotlight({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-blue/10 blur-3xl opacity-50" />
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full bg-navy-light/10 blur-3xl opacity-30" />
    </div>
  );
}
