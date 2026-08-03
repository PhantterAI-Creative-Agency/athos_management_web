"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/ui/AppShell";
import { AvatarUpload } from "@/components/ui/AvatarUpload";
import { AuthGuard } from "@/components/AuthGuard";
import { getUser, updateUser } from "@/api-client/users";
import { ApiError } from "@/api-client/client";

export default function EditarDadosFilhoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
    retry: false,
  });

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [vehicles, setVehicles] = useState<{ plate: string; model: string }[]>([]);
  const [initialized, setInitialized] = useState(false);

  if (profile && !initialized) {
    setName(profile.name || "");
    setBio(profile.bio || "");
    setPhone(profile.phone || "");
    setBirthDate(profile.birthDate ? profile.birthDate.slice(0, 10) : "");
    setBloodType(profile.medicalRecord?.bloodType || "");
    setAllergies((profile.medicalRecord?.allergies || []).join(", "));
    setVehicles(profile.vehicles || []);
    setInitialized(true);
  }

  const photoMutation = useMutation({
    mutationFn: (photoUrl: string) => updateUser(id, { photoUrl }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
  });

  const mutation = useMutation({
    mutationFn: () =>
      updateUser(id, {
        name,
        bio,
        phone,
        birthDate: birthDate || undefined,
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
      queryClient.invalidateQueries({ queryKey: ["user", id] });
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

  return (
    <AuthGuard>
      <AppShell active="/perfil">
        <div className="mx-auto max-w-3xl px-5 pb-10 pt-6 md:max-w-2xl md:px-12 md:py-10">
          <Link href="/perfil/meus-dados" className="mb-4 inline-block text-sm text-text-muted">
            ← Meus Dados
          </Link>

          {isLoading && <p className="text-sm text-text-muted">Carregando...</p>}

          {error && (
            <p className="text-sm text-red-500">
              {error instanceof ApiError && error.status === 403
                ? "Você não tem permissão para editar os dados deste filho."
                : "Não foi possível carregar os dados deste filho."}
            </p>
          )}

          {profile && (
            <>
              <h2 className="mb-5 text-2xl font-semibold">Dados de {profile.name}</h2>

              <div className="mb-5 flex flex-col items-center">
                <AvatarUpload
                  label="Foto de perfil"
                  photoUrl={profile.photoUrl}
                  seed={profile.id}
                  size="mb-3 h-20 w-20"
                  uploading={photoMutation.isPending}
                  onUpload={(dataUrl) => photoMutation.mutate(dataUrl)}
                />
              </div>

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
                <div className="mb-4">
                  <label className="mb-1 block text-xs font-medium text-text-muted">
                    Data de nascimento
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
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

                <div className="mt-4 flex justify-end">
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
            </>
          )}
        </div>
      </AppShell>
    </AuthGuard>
  );
}
