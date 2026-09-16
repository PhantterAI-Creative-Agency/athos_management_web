"use client";

import { useState } from "react";
import { FormSection } from "@/components/admin/form-layout/FormSection";

export interface UserFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export function UserForm({
  onSubmit,
  isSubmitting,
  errorMessage,
}: {
  onSubmit: (data: UserFormData) => void;
  isSubmitting: boolean;
  errorMessage?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <form
      className="mx-auto max-w-2xl"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name, email, password, phone });
      }}
    >
      <FormSection
        title="Dados do usuário"
        description="Ele já entra ativo no sistema. Desative depois na listagem se preferir revisar antes."
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
          <span className="mb-1 block text-sm font-medium">E-mail</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Senha</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
          />
          <span className="mt-1 block text-xs text-text-muted">Mínimo de 8 caracteres.</span>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Telefone (opcional)</span>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-divider bg-background px-3 py-2 text-sm"
          />
        </label>
      </FormSection>

      {errorMessage && <p className="mt-3 text-sm text-red-600">{errorMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="label-caps mt-6 rounded-full bg-accent px-6 py-2.5 text-background transition-colors hover:bg-accent/90 disabled:opacity-50"
      >
        {isSubmitting ? "Salvando..." : "Cadastrar"}
      </button>
    </form>
  );
}
