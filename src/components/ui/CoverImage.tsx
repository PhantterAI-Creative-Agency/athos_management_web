import Image from "next/image";

const overlayClasses = {
  subtle: "bg-gradient-to-t from-black/35 via-black/0 to-transparent",
  strong: "bg-gradient-to-t from-black/55 via-black/0 to-transparent",
};

export function CoverImage({
  label,
  seed = "athos",
  className = "",
  overlay = false,
  desaturate = false,
  children,
}: {
  label: string;
  seed?: string | number;
  className?: string;
  overlay?: boolean | "subtle" | "strong";
  desaturate?: boolean;
  children?: React.ReactNode;
}) {
  const overlayVariant = overlay === true ? "strong" : overlay || null;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-surface ${className}`}>
      <Image
        src={`https://picsum.photos/seed/${seed}/800/800`}
        alt={label}
        fill
        sizes="(min-width: 768px) 33vw, 50vw"
        className={`object-cover ${desaturate ? "grayscale contrast-110" : ""}`}
      />
      {overlayVariant && <div className={`absolute inset-0 ${overlayClasses[overlayVariant]}`} />}
      {children}
    </div>
  );
}
