"use client";

import { useState } from "react";
import type { ServiceFunctionDTO, MinistryVolunteerDTO } from "@/api-client/ministries";
import type { MinistryScheduleDTO, MinistryScheduleInputDTO } from "@/api-client/ministrySchedules";
import { MultiSelect } from "@/components/ui/MultiSelect";

function toDateInputValue(iso?: string): string {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export function MinistryScheduleForm({
  serviceFunctions,
  volunteers,
  volunteerNames,
  initialSchedule,
  onSubmit,
  isSubmitting,
}: {
  serviceFunctions: ServiceFunctionDTO[];
  volunteers: MinistryVolunteerDTO[];
  volunteerNames: Record<string, string>;
  initialSchedule?: MinistryScheduleDTO;
  onSubmit: (data: MinistryScheduleInputDTO) => void;
  isSubmitting: boolean;
}) {
  const [date, setDate] = useState(toDateInputValue(initialSchedule?.date));
  const [title, setTitle] = useState(initialSchedule?.title ?? "");
  const [notes, setNotes] = useState(initialSchedule?.notes ?? "");
  const [assignments, setAssignments] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    for (const fn of serviceFunctions) {
      const existing = initialSchedule?.assignments.find((a) => a.functionId === fn.id);
      initial[fn.id] = existing?.volunteerIds ?? [];
    }
    return initial;
  });

  const volunteerOptions = volunteers.map((v) => ({
    value: v.userId,
    label: volunteerNames[v.userId] ?? v.userId,
  }));

  return (
    <form
      className="flex flex-col gap-4 rounded-2xl bg-surface p-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          date: new Date(date).toISOString(),
          title: title || undefined,
          notes: notes || undefined,
          assignments: serviceFunctions.map((fn) => ({
            functionId: fn.id,
            volunteerIds: assignments[fn.id] ?? [],
          })),
        });
      }}
    >
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Data</span>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Título (opcional)</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex.: Culto de domingo"
          className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
        />
      </label>

      {serviceFunctions.length === 0 && (
        <p className="text-sm text-text-muted">
          Este ministério ainda não tem funções cadastradas — cadastre antes de montar a escala.
        </p>
      )}

      {serviceFunctions.map((fn) => (
        <div key={fn.id}>
          <span className="mb-1 block text-sm font-medium">{fn.name}</span>
          <MultiSelect
            options={volunteerOptions}
            selected={assignments[fn.id] ?? []}
            onChange={(ids) => setAssignments((prev) => ({ ...prev, [fn.id]: ids }))}
            placeholder="Nenhum voluntário ativo neste ministério"
          />
        </div>
      ))}

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Observações (opcional)</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting || serviceFunctions.length === 0}
        className="label-caps mt-2 rounded-full bg-accent px-6 py-2.5 text-background transition-colors hover:bg-accent/90 disabled:opacity-50"
      >
        {isSubmitting ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
