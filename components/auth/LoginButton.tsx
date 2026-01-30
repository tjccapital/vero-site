"use client";

export default function LoginButton({ className }: { className?: string }) {
  return (
    <a
      href="/auth/login"
      className={className || "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"}
    >
      Log In
    </a>
  );
}
