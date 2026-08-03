const variantClasses = {
  default: "bg-accent-tint text-accent-tint-text",
  warm: "bg-accent-warm-tint text-accent-warm-tint-text",
};

export function Tag({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "warm";
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${variantClasses[variant]}`}
    >
      {children}
    </span>
  );
}
