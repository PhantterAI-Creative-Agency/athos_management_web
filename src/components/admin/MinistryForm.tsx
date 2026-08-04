"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listUsers } from "@/api-client/users";
import type { MinistryDTO, MinistryInputDTO } from "@/api-client/ministries";

export function MinistryForm({
  initialMinistry,
  onSubmit,
  isSubmitting,
}: {
  initialMinistry?: MinistryDTO;
  onSubmit: (data: MinistryInputDTO) => void;
  isSubmitting: boolean;
}) {
  const [name, setName] = useState(initialMinistry?.name ?? "");
  const [iconUrl, setIconUrl] = useState(initialMinistry?.iconUrl ?? "");
  const [contractRequired, setContractRequired] = useState(
    initialMinistry?.contractRequired ?? false,
  );
  const [leaderId, setLeaderId] = useState(initialMinistry?.leaderId ?? "");

  const { data: users } = useQuery({ queryKey: ["users"], queryFn: () => listUsers() });

  return (
    <form
      className="flex flex-col gap-4 rounded-2xl bg-surface p-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          name,
          iconUrl: iconUrl || undefined,
          contractRequired,
          leaderId: leaderId || null,
        });
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
        <span className="mb-1 block text-sm font-medium">URL do ícone (opcional)</span>
        <input
          type="text"
          value={iconUrl}
          onChange={(e) => setIconUrl(e.target.value)}
          className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Líder (opcional)</span>
        <select
          value={leaderId}
          onChange={(e) => setLeaderId(e.target.value)}
          className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
        >
          <option value="">Sem líder definido</option>
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
          checked={contractRequired}
          onChange={(e) => setContractRequired(e.target.checked)}
        />
        Exige termo de compromisso do voluntário
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
