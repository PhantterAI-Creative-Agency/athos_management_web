"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listUsers } from "@/api-client/users";
import type { GrowthGroupDTO, GrowthGroupInputDTO } from "@/api-client/growthGroups";

export function GrowthGroupForm({
  initialGroup,
  onSubmit,
  isSubmitting,
}: {
  initialGroup?: GrowthGroupDTO;
  onSubmit: (data: GrowthGroupInputDTO) => void;
  isSubmitting: boolean;
}) {
  const [name, setName] = useState(initialGroup?.name ?? "");
  const [leaderId, setLeaderId] = useState(initialGroup?.leaderId ?? "");
  const [hasPendencies, setHasPendencies] = useState(initialGroup?.hasPendencies ?? false);

  const { data: users } = useQuery({ queryKey: ["users"], queryFn: () => listUsers() });

  return (
    <form
      className="flex flex-col gap-4 rounded-2xl bg-surface p-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name, leaderId, hasPendencies });
      }}
    >
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Nome</span>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Líder</span>
        <select
          required
          value={leaderId}
          onChange={(e) => setLeaderId(e.target.value)}
          className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
        >
          <option value="" disabled>
            Selecione um líder
          </option>
          {users?.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={hasPendencies}
          onChange={(e) => setHasPendencies(e.target.checked)}
        />
        Possui pendências
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="label-caps mt-2 rounded-full bg-accent px-6 py-2.5 text-background transition-colors hover:bg-accent/90 disabled:opacity-50"
      >
        {isSubmitting ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
