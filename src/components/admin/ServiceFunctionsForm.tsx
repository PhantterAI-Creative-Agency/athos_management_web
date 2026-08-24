"use client";

import { useState } from "react";
import type { ServiceFunctionDTO } from "@/api-client/ministries";

export function ServiceFunctionsForm({
  initialFunctions,
  onSubmit,
  isSubmitting,
}: {
  initialFunctions: ServiceFunctionDTO[];
  onSubmit: (functions: { id?: string; name: string }[]) => void;
  isSubmitting: boolean;
}) {
  const [functions, setFunctions] = useState<{ id?: string; name: string }[]>(
    initialFunctions.length > 0
      ? initialFunctions.map((f) => ({ id: f.id, name: f.name }))
      : [{ name: "" }],
  );

  function updateName(index: number, name: string) {
    setFunctions((prev) => prev.map((f, i) => (i === index ? { ...f, name } : f)));
  }

  function remove(index: number) {
    setFunctions((prev) => prev.filter((_, i) => i !== index));
  }

  function add() {
    setFunctions((prev) => [...prev, { name: "" }]);
  }

  function move(index: number, direction: -1 | 1) {
    setFunctions((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  return (
    <form
      className="flex flex-col gap-4 rounded-2xl bg-surface p-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(functions.filter((f) => f.name.trim().length > 0));
      }}
    >
      <div className="flex flex-col gap-2">
        {functions.map((fn, index) => (
          <div key={fn.id ?? `new-${index}`} className="flex items-center gap-2">
            <input
              type="text"
              required
              value={fn.name}
              onChange={(e) => updateName(index, e.target.value)}
              placeholder="Ex.: Instrumento, Vocal, Professor..."
              className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => move(index, -1)}
              disabled={index === 0}
              className="text-sm text-text-muted disabled:opacity-30"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              disabled={index === functions.length - 1}
              className="text-sm text-text-muted disabled:opacity-30"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={functions.length === 1}
              className="text-sm font-medium text-red-600 disabled:opacity-30"
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={add} className="label-caps self-start text-accent">
        + Adicionar função
      </button>

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
