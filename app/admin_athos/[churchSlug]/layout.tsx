"use client";

import { use } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminGuard } from "@/components/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAuth } from "@/hooks/useAuth";
import { isAdmin } from "@/lib/rbac";

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
        <div className="flex flex-1 flex-col md:flex-row">
          {isAdmin(user) && <AdminSidebar churchSlug={churchSlug} pathname={pathname} />}
          <main className="flex-1 px-5 py-6 md:px-8 md:py-10">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
