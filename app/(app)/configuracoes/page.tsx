"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { AppShell } from "@/components/ui/AppShell";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { useChurchSettings } from "@/hooks/useChurchSettings";
import { getMyChurch } from "@/api-client/churches";
import { isAdmin } from "@/lib/rbac";
import { ChevronRightIcon } from "@/components/icons";

const menuConteudos = [
  { label: "Eventos", href: "/eventos" },
  { label: "Mural", href: "/mural" },
  { label: "Devocionais", href: "/devocionais" },
  { label: "Bíblia", href: "/biblia" },
  { label: "Planos", href: "/planos" },
];

function MenuSection({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="mb-6">
      <h6 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
        {title}
      </h6>
      <div className="rounded-2xl bg-surface px-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 border-b border-divider py-3 text-sm last:border-b-0"
          >
            <span className="flex-1">{link.label}</span>
            <ChevronRightIcon className="h-3.5 w-3.5 text-text-muted" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function ConfiguracoesPage() {
  const { user, logout } = useAuth();
  const { growthGroupName } = useChurchSettings();
  const { data: church } = useQuery({
    queryKey: ["churches", "me"],
    queryFn: getMyChurch,
    enabled: !!user,
  });

  const menuPrincipal = [
    { label: "Eventos", href: "/eventos" },
    { label: growthGroupName, href: "/reuniao-nos-lares" },
    { label: "Ministérios", href: "/ministerios" },
    { label: "Ofertas | Pagamentos", href: "/ofertas" },
    { label: "Aniversariantes", href: "/aniversariantes" },
  ];

  return (
    <AuthGuard>
      <AppShell active="/perfil">
        <div className="mx-auto max-w-3xl px-5 pb-10 pt-6 md:max-w-2xl md:px-12 md:py-10">
          <h2 className="mb-5 text-2xl font-semibold">Configurações</h2>

          <MenuSection title="Principal" links={menuPrincipal} />
          <MenuSection title="Conteúdos" links={menuConteudos} />
          <MenuSection
            title="Nossa Igreja"
            links={[{ label: "Igreja Princípios de Vida", href: "/igreja" }]}
          />

          <h6 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
            Conta
          </h6>
          <div className="mb-6 rounded-2xl bg-surface px-4">
            <Link
              href="/perfil/meus-dados"
              className="flex items-center gap-3 border-b border-divider py-3 text-sm"
            >
              <span className="flex-1">Meus Dados</span>
              <ChevronRightIcon className="h-3.5 w-3.5 text-text-muted" />
            </Link>
            <div className="flex items-center justify-between border-b border-divider py-3">
              <span className="text-sm">Notificações</span>
              <span className="text-xs text-text-muted">Em breve</span>
            </div>
            <div className="flex items-center justify-between border-b border-divider py-3">
              <span className="text-sm">Tema escuro</span>
              <span className="text-xs text-text-muted">Automático</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm">Conta</span>
              <span className="text-xs text-text-muted">{user?.email}</span>
            </div>
          </div>

          {isAdmin(user) && church && (
            <Link
              href={`/admin_athos/${church.slug}`}
              className="mb-6 flex w-full items-center justify-between rounded-2xl bg-surface px-4 py-3 text-sm font-medium"
            >
              Administração
              <span className="text-xs text-text-muted">Gerenciar igreja</span>
            </Link>
          )}

          <button
            type="button"
            onClick={logout}
            className="w-full rounded-2xl border border-divider py-3 text-sm font-semibold text-red-500"
          >
            Sair da Conta
          </button>
        </div>
      </AppShell>
    </AuthGuard>
  );
}
