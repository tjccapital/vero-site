import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <Image
        src="/logo.svg"
        alt="Vero"
        width={24}
        height={24}
        className="w-6 h-6"
      />
      <span className="text-xl font-semibold tracking-tight">vero</span>
    </div>
  );
}
