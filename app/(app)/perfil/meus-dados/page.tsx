"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/ui/AppShell";
import { AvatarUpload } from "@/components/ui/AvatarUpload";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { getUser, updateUser, createChild } from "@/api-client/users";
import { ApiError } from "@/api-client/client";
import { ChevronRightIcon } from "@/components/icons";

function calculateAge(birthDate: string): number | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const hasNotHadBirthdayThisYear =
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
  if (hasNotHadBirthdayThisYear) age -= 1;
  return age;
}

export default function MeusDadosPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => (user?.id ? getUser(user.id) : null),
    enabled: !!user?.id,
  });

  const childrenIds = profile?.familyData?.childrenIds ?? [];
  const childrenQueries = useQueries({
    queries: childrenIds.map((childId) => ({
      queryKey: ["user", childId],
      queryFn: () => getUser(childId),
    })),
  });

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [vehicles, setVehicles] = useState<{ plate: string; model: string }[]>([]);
  const [initialized, setInitialized] = useState(false);

  if (profile && !initialized) {
    setName(profile.name || "");
    setBio(profile.bio || "");
    setPhone(profile.phone || "");
    setCompany(profile.professionalData?.company || "");
    setRole(profile.professionalData?.role || "");
    setBloodType(profile.medicalRecord?.bloodType || "");
    setAllergies((profile.medicalRecord?.allergies || []).join(", "));
    setVehicles(profile.vehicles || []);
    setInitialized(true);
  }

  const photoMutation = useMutation({
    mutationFn: (photoUrl: string) => updateUser(user!.id, { photoUrl }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
    },
  });

  const mutation = useMutation({
    mutationFn: () =>
      updateUser(user!.id, {
        name,
        bio,
        phone,
        professionalData: { company: company || undefined, role: role || undefined },
        medicalRecord: {
          bloodType: bloodType || undefined,
          allergies: allergies
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        },
        vehicles: vehicles.filter((v) => v.plate && v.model),
      }),
    onSuccess: () => {
      setEditing(false);
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
    },
  });

  function addVehicle() {
    setVehicles((prev) => [...prev, { plate: "", model: "" }]);
  }

  function updateVehicle(index: number, field: "plate" | "model", value: string) {
    setVehicles((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)));
  }

  function removeVehicle(index: number) {
    setVehicles((prev) => prev.filter((_, i) => i !== index));
  }

  const spouseId = profile?.familyData?.spouseId;
  const { data: spouse } = useQuery({
    queryKey: ["user", spouseId],
    queryFn: () => getUser(spouseId!),
    enabled: !!spouseId,
  });
  const spousePending = profile?.familyData?.spousePending;

  const [addingChild, setAddingChild] = useState(false);
  const [childName, setChildName] = useState("");
  const [childBirthDate, setChildBirthDate] = useState("");
  const [childPhone, setChildPhone] = useState("");
  const [childEmail, setChildEmail] = useState("");
  const [childPassword, setChildPassword] = useState("");
  const childAge = calculateAge(childBirthDate);
  const childCanLogin = childAge !== null && childAge >= 13;

  const createChildMutation = useMutation({
    mutationFn: () =>
      createChild(user!.id, {
        name: childName,
        birthDate: childBirthDate,
        phone: childPhone || undefined,
        email: childCanLogin && childEmail ? childEmail : undefined,
        password: childCanLogin && childPassword ? childPassword : undefined,
      }),
    onSuccess: () => {
      setAddingChild(false);
      setChildName("");
      setChildBirthDate("");
      setChildPhone("");
      setChildEmail("");
      setChildPassword("");
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
    },
  });

  const [editingSpouse, setEditingSpouse] = useState(false);
  const [spouseName, setSpouseName] = useState(spousePending?.name || "");
  const [spousePhone, setSpousePhone] = useState(spousePending?.phone || "");
  const [spouseEmail, setSpouseEmail] = useState(spousePending?.email || "");

  const spousePendingMutation = useMutation({
    mutationFn: () =>
      updateUser(user!.id, {
        familyData: {
          childrenIds: profile?.familyData?.childrenIds ?? [],
          spousePending: {
            name: spouseName,
            phone: spousePhone || undefined,
            email: spouseEmail || undefined,
          },
        },
      }),
    onSuccess: () => {
      setEditingSpouse(false);
      queryClient.invalidateQueries({ queryKey: ["user", user?.id] });
    },
  });

  return (
    <AuthGuard>
      <AppShell active="/perfil">
        <div className="mx-auto max-w-3xl px-5 pb-10 pt-6 md:max-w-2xl md:px-12 md:py-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Meus Dados</h2>
            {!editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="text-sm font-medium text-accent"
              >
                Editar
              </button>
            )}
          </div>

          <div className="mb-5 flex flex-col items-center">
            <AvatarUpload
              label="Foto de perfil"
              photoUrl={profile?.photoUrl}
              seed={profile?.id || "avatar"}
              size="mb-3 h-20 w-20"
              uploading={photoMutation.isPending}
              onUpload={(dataUrl) => photoMutation.mutate(dataUrl)}
            />
          </div>

          {editing ? (
            <div className="rounded-2xl bg-surface p-4">
              <h6 className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-accent">
                Dados Pessoais
              </h6>
              <div className="mb-4">
                <label className="mb-1 block text-xs font-medium text-text-muted">Nome</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl bg-background px-4 py-2.5 text-sm outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-xs font-medium text-text-muted">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full resize-none rounded-xl bg-background px-4 py-2.5 text-sm outline-none"
                  rows={3}
                />
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-xs font-medium text-text-muted">Telefone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl bg-background px-4 py-2.5 text-sm outline-none"
                />
              </div>

              <h6 className="mb-3 mt-6 text-[11px] font-semibold uppercase tracking-wide text-accent">
                Dados Profissionais
              </h6>
              <div className="mb-4">
                <label className="mb-1 block text-xs font-medium text-text-muted">Empresa</label>
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full rounded-xl bg-background px-4 py-2.5 text-sm outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-xs font-medium text-text-muted">Cargo</label>
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl bg-background px-4 py-2.5 text-sm outline-none"
                />
              </div>

              <h6 className="mb-3 mt-6 text-[11px] font-semibold uppercase tracking-wide text-accent">
                Ficha Médica
              </h6>
              <div className="mb-4">
                <label className="mb-1 block text-xs font-medium text-text-muted">Tipo sanguíneo</label>
                <input
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full rounded-xl bg-background px-4 py-2.5 text-sm outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="mb-1 block text-xs font-medium text-text-muted">
                  Alergias (separadas por vírgula)
                </label>
                <input
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full rounded-xl bg-background px-4 py-2.5 text-sm outline-none"
                />
              </div>

              <h6 className="mb-3 mt-6 text-[11px] font-semibold uppercase tracking-wide text-accent">
                Veículos
              </h6>
              {vehicles.map((vehicle, index) => (
                <div key={index} className="mb-3 flex items-center gap-2">
                  <input
                    value={vehicle.plate}
                    onChange={(e) => updateVehicle(index, "plate", e.target.value)}
                    placeholder="Placa"
                    className="w-1/2 rounded-xl bg-background px-4 py-2.5 text-sm outline-none"
                  />
                  <input
                    value={vehicle.model}
                    onChange={(e) => updateVehicle(index, "model", e.target.value)}
                    placeholder="Modelo"
                    className="w-1/2 rounded-xl bg-background px-4 py-2.5 text-sm outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeVehicle(index)}
                    className="text-xs font-medium text-red-500"
                  >
                    Remover
                  </button>
                </div>
              ))}
              <button type="button" onClick={addVehicle} className="mb-4 text-sm font-medium text-accent">
                + Adicionar veículo
              </button>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-text-muted"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => mutation.mutate()}
                  disabled={mutation.isPending}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
                >
                  {mutation.isPending ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-surface p-4">
              <div className="border-b border-divider py-3">
                <p className="text-xs text-text-muted">Nome</p>
                <p className="text-sm font-medium">{profile?.name || user?.name || "-"}</p>
              </div>
              <div className="border-b border-divider py-3">
                <p className="text-xs text-text-muted">E-mail</p>
                <p className="text-sm font-medium">{profile?.email || user?.email || "-"}</p>
              </div>
              <div className="border-b border-divider py-3">
                <p className="text-xs text-text-muted">Telefone</p>
                <p className="text-sm font-medium">{profile?.phone || "-"}</p>
              </div>
              <div className="border-b border-divider py-3">
                <p className="text-xs text-text-muted">Bio</p>
                <p className="text-sm">{profile?.bio || "-"}</p>
              </div>
              <div className="border-b border-divider py-3">
                <p className="text-xs text-text-muted">Dados profissionais</p>
                <p className="text-sm">
                  {profile?.professionalData?.role || profile?.professionalData?.company
                    ? `${profile?.professionalData?.role || "-"} · ${profile?.professionalData?.company || "-"}`
                    : "-"}
                </p>
              </div>
              <div className="border-b border-divider py-3">
                <p className="text-xs text-text-muted">Ficha médica</p>
                <p className="text-sm">
                  {profile?.medicalRecord?.bloodType || profile?.medicalRecord?.allergies?.length
                    ? `${profile?.medicalRecord?.bloodType || "-"} · ${
                        profile?.medicalRecord?.allergies?.join(", ") || "sem alergias"
                      }`
                    : "-"}
                </p>
              </div>
              <div className="py-3">
                <p className="mb-2 text-xs text-text-muted">Veículos</p>
                {profile?.vehicles?.length ? (
                  profile.vehicles.map((v, i) => (
                    <p key={i} className="text-sm">
                      {v.plate} · {v.model}
                    </p>
                  ))
                ) : (
                  <p className="text-sm">-</p>
                )}
              </div>
            </div>
          )}

          <h6 className="mb-2 mt-6 px-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
            Dados Familiares
          </h6>

          <p className="mb-2 mt-4 px-1 text-xs font-medium text-text-muted">Cônjuge</p>
          <div className="mb-4 rounded-2xl bg-surface p-4">
            {spouseId ? (
              <div className="py-1">
                <p className="text-sm font-medium">{spouse?.name || "Carregando..."}</p>
                <p className="text-xs text-text-muted">Vínculo confirmado</p>
              </div>
            ) : editingSpouse ? (
              <div>
                <div className="mb-3">
                  <label className="mb-1 block text-xs font-medium text-text-muted">Nome</label>
                  <input
                    value={spouseName}
                    onChange={(e) => setSpouseName(e.target.value)}
                    className="w-full rounded-xl bg-background px-4 py-2.5 text-sm outline-none"
                  />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-xs font-medium text-text-muted">Celular</label>
                  <input
                    value={spousePhone}
                    onChange={(e) => setSpousePhone(e.target.value)}
                    className="w-full rounded-xl bg-background px-4 py-2.5 text-sm outline-none"
                  />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-xs font-medium text-text-muted">E-mail</label>
                  <input
                    value={spouseEmail}
                    onChange={(e) => setSpouseEmail(e.target.value)}
                    className="w-full rounded-xl bg-background px-4 py-2.5 text-sm outline-none"
                  />
                </div>
                <p className="mb-3 text-xs text-text-muted">
                  Informe ao menos celular ou e-mail. O cadastro só será concluído quando o(a) cônjuge
                  acessar o app com esse mesmo contato.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingSpouse(false)}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-text-muted"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => spousePendingMutation.mutate()}
                    disabled={!spouseName || (!spousePhone && !spouseEmail) || spousePendingMutation.isPending}
                    className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {spousePendingMutation.isPending ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </div>
            ) : spousePending ? (
              <div className="py-1">
                <p className="text-sm font-medium">{spousePending.name}</p>
                <p className="text-xs text-text-muted">
                  {spousePending.phone || spousePending.email} · Aguardando o(a) cônjuge concluir o cadastro
                </p>
                <button
                  type="button"
                  onClick={() => setEditingSpouse(true)}
                  className="mt-2 text-xs font-medium text-accent"
                >
                  Editar pré-cadastro
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setEditingSpouse(true)}
                className="py-1 text-sm font-medium text-accent"
              >
                + Pré-cadastrar cônjuge
              </button>
            )}
          </div>

          <p className="mb-2 px-1 text-xs font-medium text-text-muted">Filhos</p>
          <div className="rounded-2xl bg-surface p-4">
            {childrenIds.length === 0 ? (
              <p className="py-2 text-sm text-text-muted">Nenhum filho vinculado ao seu cadastro.</p>
            ) : (
              <div className="flex flex-col">
                {childrenQueries.map((query, index) => (
                  <Link
                    key={childrenIds[index]}
                    href={`/perfil/meus-dados/filhos/${childrenIds[index]}`}
                    className="flex items-center gap-3 border-b border-divider py-3 text-sm last:border-b-0"
                  >
                    <span className="flex-1">{query.data?.name || "Carregando..."}</span>
                    <ChevronRightIcon className="h-3.5 w-3.5 text-text-muted" />
                  </Link>
                ))}
              </div>
            )}

            {addingChild ? (
              <div className="mt-3 border-t border-divider pt-3">
                <div className="mb-3">
                  <label className="mb-1 block text-xs font-medium text-text-muted">Nome</label>
                  <input
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    className="w-full rounded-xl bg-background px-4 py-2.5 text-sm outline-none"
                  />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-xs font-medium text-text-muted">Data de nascimento</label>
                  <input
                    type="date"
                    value={childBirthDate}
                    onChange={(e) => setChildBirthDate(e.target.value)}
                    className="w-full rounded-xl bg-background px-4 py-2.5 text-sm outline-none"
                  />
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-xs font-medium text-text-muted">Telefone</label>
                  <input
                    value={childPhone}
                    onChange={(e) => setChildPhone(e.target.value)}
                    className="w-full rounded-xl bg-background px-4 py-2.5 text-sm outline-none"
                  />
                </div>

                {childAge !== null && (
                  <p className="mb-3 text-xs text-text-muted">
                    {childCanLogin
                      ? "A partir de 13 anos, login no app é opcional."
                      : "Menores de 13 anos não têm login próprio — o cadastro fica sob sua gestão."}
                  </p>
                )}

                {childCanLogin && (
                  <>
                    <div className="mb-3">
                      <label className="mb-1 block text-xs font-medium text-text-muted">
                        E-mail (opcional, para login do filho)
                      </label>
                      <input
                        value={childEmail}
                        onChange={(e) => setChildEmail(e.target.value)}
                        className="w-full rounded-xl bg-background px-4 py-2.5 text-sm outline-none"
                      />
                    </div>
                    {childEmail && (
                      <div className="mb-3">
                        <label className="mb-1 block text-xs font-medium text-text-muted">Senha</label>
                        <input
                          type="password"
                          value={childPassword}
                          onChange={(e) => setChildPassword(e.target.value)}
                          className="w-full rounded-xl bg-background px-4 py-2.5 text-sm outline-none"
                        />
                      </div>
                    )}
                  </>
                )}

                {createChildMutation.isError && (
                  <p className="mb-3 text-xs text-red-500">
                    {createChildMutation.error instanceof ApiError
                      ? createChildMutation.error.message
                      : "Não foi possível cadastrar o filho."}
                  </p>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setAddingChild(false)}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-text-muted"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => createChildMutation.mutate()}
                    disabled={
                      !childName ||
                      !childBirthDate ||
                      (childCanLogin && !!childEmail && !childPassword) ||
                      createChildMutation.isPending
                    }
                    className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {createChildMutation.isPending ? "Salvando..." : "Salvar"}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setAddingChild(true)}
                className="mt-3 text-sm font-medium text-accent"
              >
                + Adicionar filho
              </button>
            )}
          </div>
        </div>
      </AppShell>
    </AuthGuard>
  );
}
