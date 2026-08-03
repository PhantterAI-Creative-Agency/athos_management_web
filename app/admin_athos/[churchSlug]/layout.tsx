"use client";

import { use } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminGuard } from "@/components/AdminGuard";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ churchSlug: string }>;
}) {
  const { churchSlug } = use(params);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { label: "Geral", href: `/admin_athos/${churchSlug}` },
    { label: "Conteúdo da Home", href: `/admin_athos/${churchSlug}/home` },
    { label: "Eventos", href: `/admin_athos/${churchSlug}/eventos` },
    { label: "Ministérios", href: `/admin_athos/${churchSlug}/ministerios` },
    { label: "Reunião nos Lares", href: `/admin_athos/${churchSlug}/reuniao-nos-lares` },
    { label: "Devocionais", href: `/admin_athos/${churchSlug}/devocionais` },
    { label: "Mídias", href: `/admin_athos/${churchSlug}/midias` },
    { label: "Acompanhamento Pastoral", href: `/admin_athos/${churchSlug}/acompanhamento-pastoral` },
  ];

  return (
    <AdminGuard churchSlug={churchSlug}>
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between border-b border-divider px-5 py-4 md:px-12">
          <Link href={`/admin_athos/${churchSlug}`} className="text-sm font-semibold">
            Administração
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/home" className="label-caps text-text-muted">
              Voltar ao app
            </Link>
            <span className="text-xs text-text-muted">{user?.email}</span>
            <button type="button" onClick={logout} className="label-caps text-accent">
              Sair
            </button>
          </div>
        </header>
        <nav className="scrollbar-hide flex gap-5 overflow-x-auto whitespace-nowrap border-b border-divider px-5 py-3 md:px-12">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`label-caps flex-none ${
                pathname === link.href ? "text-foreground" : "text-text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <main className="flex-1 px-5 py-6 md:px-12 md:py-10">{children}</main>
      </div>
    </AdminGuard>
  );
}
