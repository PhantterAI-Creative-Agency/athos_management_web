import Link from "next/link";
import { ReactNode } from "react";

export function FormPageHeader({
  title,
  backHref,
  backLabel,
  actions,
}: {
  title: string;
  backHref: string;
  backLabel: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Link
          href={backHref}
          className="label-caps mb-1 block text-xs text-text-muted hover:text-foreground"
        >
          ← {backLabel}
        </Link>
        <h2 className="text-2xl font-semibold">{title}</h2>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
