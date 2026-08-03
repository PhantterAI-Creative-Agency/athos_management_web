"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/ui/AppShell";
import { CoverImage } from "@/components/ui/CoverImage";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { useChurchSettings } from "@/hooks/useChurchSettings";
import { getUser } from "@/api-client/users";
import { SettingsIcon } from "@/components/icons";

const ROLE_LABELS: Record<string, string> = {
  visitor: "Visitante",
  member: "Membro",
  volunteer: "Voluntário",
  ministryLeader: "Líder de Ministério",
  deacon: "Diácono",
  elder: "Presbítero",
  pastor: "Pastor",
  seniorPastor: "Pastor Presidente",
  admin: "Administrador",
  devAdmin: "Administrador Geral",
};

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="border-b border-divider py-3 last:border-b-0">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="text-sm font-medium">{value || "-"}</p>
    </div>
  );
}

function PerfilContent() {
  const { user } = useAuth();
  const { growthGroupAcronym } = useChurchSettings();

  const { data: profile } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => (user?.id ? getUser(user.id) : null),
    enabled: !!user?.id,
  });

  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-6 md:max-w-2xl md:px-12 md:py-10">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Meu Perfil</h2>
        <Link
          href="/configuracoes"
          aria-label="Configurações"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface"
        >
          <SettingsIcon className="h-5 w-5 text-foreground" />
        </Link>
      </div>

      <div className="mb-5 flex flex-col items-center text-center">
        <CoverImage
          label="Foto de perfil"
          seed={profile?.id || "user-avatar"}
          className="mb-2.5 h-[76px] w-[76px] rounded-full"
        />
        <p className="text-lg font-semibold">{profile?.name || user?.name || "Usuário"}</p>
        {profile?.bio && (
          <p className="max-w-[260px] text-sm italic text-text-muted">{profile.bio}</p>
        )}
        {!!profile?.roles?.length && (
          <div className="mt-2 flex flex-wrap justify-center gap-1.5">
            {profile.roles.map((role) => (
              <span
                key={role}
                className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-text-muted"
              >
                {role === "groupLeader"
                  ? `Líder de ${growthGroupAcronym}`
                  : ROLE_LABELS[role] || role}
              </span>
            ))}
          </div>
        )}
      </div>

      <h6 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
        Dados Pessoais
      </h6>
      <div className="mb-6 rounded-2xl bg-surface p-4">
        <InfoRow label="Nome" value={profile?.name} />
        <InfoRow label="E-mail" value={profile?.email} />
        <InfoRow label="Telefone" value={profile?.phone} />
        <InfoRow label="Bio" value={profile?.bio} />
      </div>

      <h6 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
        Dados Profissionais
      </h6>
      <div className="mb-6 rounded-2xl bg-surface p-4">
        <InfoRow label="Empresa" value={profile?.professionalData?.company} />
        <InfoRow label="Cargo" value={profile?.professionalData?.role} />
      </div>

      <h6 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
        Ficha Médica
      </h6>
      <div className="mb-6 rounded-2xl bg-surface p-4">
        <InfoRow label="Tipo sanguíneo" value={profile?.medicalRecord?.bloodType} />
        <InfoRow
          label="Alergias"
          value={profile?.medicalRecord?.allergies?.join(", ") || undefined}
        />
      </div>

      <h6 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
        Veículos
      </h6>
      <div className="mb-6 rounded-2xl bg-surface p-4">
        {profile?.vehicles?.length ? (
          profile.vehicles.map((v, i) => (
            <div key={i} className="border-b border-divider py-3 text-sm last:border-b-0">
              {v.plate} · {v.model}
            </div>
          ))
        ) : (
          <p className="py-1 text-sm text-text-muted">Nenhum veículo cadastrado.</p>
        )}
      </div>

      <Link
        href="/perfil/meus-dados"
        className="flex w-full items-center justify-center rounded-xl border border-divider py-3 text-sm font-semibold text-accent"
      >
        Editar meus dados
      </Link>
    </div>
  );
}

export default function PerfilPage() {
  return (
    <AuthGuard>
      <AppShell active="/perfil">
        <PerfilContent />
      </AppShell>
    </AuthGuard>
  );
}
