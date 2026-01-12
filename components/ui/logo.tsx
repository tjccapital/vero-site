import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.svg"
      alt="Vero"
      width={120}
      height={24}
      className={className}
    />
  );
}
