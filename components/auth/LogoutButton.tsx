"use client";

export default function LogoutButton({ className }: { className?: string }) {
  return (
    <a
      href="/auth/logout"
      className={className || "inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors"}
    >
      Log Out
    </a>
  );
}
