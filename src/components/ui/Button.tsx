import Link from "next/link";

type ButtonVariant = "pill-outline" | "pill-solid";
type ButtonTone = "neutral" | "accent" | "warm";

const toneClasses: Record<ButtonVariant, Record<ButtonTone, string>> = {
  "pill-outline": {
    neutral: "border-divider text-foreground hover:bg-foreground/5",
    accent: "border-accent text-accent hover:bg-accent/5",
    warm: "border-accent-warm text-accent-warm hover:bg-accent-warm/5",
  },
  "pill-solid": {
    neutral: "bg-foreground text-background hover:bg-foreground/90",
    accent: "bg-accent text-background hover:bg-accent/90",
    warm: "bg-accent-warm text-background hover:bg-accent-warm/90",
  },
};

const baseClasses: Record<ButtonVariant, string> = {
  "pill-outline": "label-caps rounded-full border px-6 py-2.5 transition-colors",
  "pill-solid": "label-caps rounded-full px-6 py-2.5 transition-colors",
};

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  href?: string;
  className?: string;
} & (
  | ({ href: string } & Omit<React.ComponentProps<typeof Link>, "href" | "className">)
  | ({ href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">)
);

export function Button({
  children,
  variant = "pill-outline",
  tone = "neutral",
  href,
  className = "",
  ...rest
}: ButtonProps) {
  const classes = `${baseClasses[variant]} ${toneClasses[variant][tone]} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(rest as Omit<React.ComponentProps<typeof Link>, "href" | "className">)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      {...(rest as Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">)}
    >
      {children}
    </button>
  );
}
