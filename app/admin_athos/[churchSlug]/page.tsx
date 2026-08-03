"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyChurch, updateMyChurch, type ChurchDTO } from "@/api-client/churches";

export default function AdminDashboardPage() {
  const queryClient = useQueryClient();
  const { data: church, isLoading } = useQuery({
    queryKey: ["churches", "me"],
    queryFn: getMyChurch,
  });

  const [form, setForm] = useState<{ name: string; address: string } | null>(null);
  const editing = form ?? (church ? { name: church.name, address: church.address ?? "" } : null);

  const mutation = useMutation({
    mutationFn: (data: Partial<Pick<ChurchDTO, "name" | "address">>) => updateMyChurch(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(["churches", "me"], updated);
      setForm(null);
    },
  });

  if (isLoading || !editing) {
    return <p className="text-sm text-text-muted">Carregando...</p>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-1 text-2xl font-semibold">Gestão da Igreja</h2>
      <p className="mb-6 text-sm text-text-muted">{church?.slug}</p>

      <form
        className="rounded-2xl bg-surface p-4"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate({ name: editing.name, address: editing.address });
        }}
      >
        <label className="mb-3 block">
          <span className="mb-1 block text-sm font-medium">Nome</span>
          <input
            type="text"
            value={editing.name}
            onChange={(e) => setForm({ ...editing, name: e.target.value })}
            className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
          />
        </label>

        <label className="mb-4 block">
          <span className="mb-1 block text-sm font-medium">Endereço</span>
          <input
            type="text"
            value={editing.address}
            onChange={(e) => setForm({ ...editing, address: e.target.value })}
            className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
          />
        </label>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="label-caps rounded-full bg-accent px-6 py-2.5 text-background transition-colors hover:bg-accent/90 disabled:opacity-50"
        >
          {mutation.isPending ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}
