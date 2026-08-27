"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { sendDataDeletionRequest } from "@/api-client/dataDeletionRequests";

type FieldErrors = Partial<Record<"name" | "email", string>>;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function DataDeletionRequestForm({ className = "" }: { className?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (status !== "success" && status !== "error") return;
    const timer = setTimeout(() => setStatus("idle"), 15000);
    return () => clearTimeout(timer);
  }, [status]);

  function validate(): FieldErrors {
    const nextErrors: FieldErrors = {};
    if (!name.trim()) nextErrors.name = "Informe seu nome";
    if (!email.trim()) nextErrors.email = "Informe seu email";
    else if (!isValidEmail(email.trim())) nextErrors.email = "Informe um email válido";
    return nextErrors;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setStatus("idle");
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    try {
      await sendDataDeletionRequest({ name, email, reason: reason.trim() || undefined });
      setStatus("success");
      setName("");
      setEmail("");
      setReason("");
      setErrors({});
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao enviar solicitação";
      setErrorMessage(msg);
      setStatus("error");
    }
  }

  const inputClass = (hasError: boolean) =>
    `rounded-lg border bg-background px-4 py-3 text-sm text-foreground placeholder:text-text-muted focus:outline-none ${
      hasError ? "border-red-500 focus:border-red-500" : "border-divider focus:border-accent"
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className={`flex flex-col gap-3.5 ${className}`}>
      {status === "success" && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Solicitação enviada com sucesso! Entraremos em contato pelo email informado.
        </div>
      )}
      {status === "error" && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>
      )}
      <div>
        <input
          type="text"
          name="name"
          placeholder="Nome"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={!!errors.name}
          className={`w-full ${inputClass(!!errors.name)}`}
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>
      <div>
        <input
          type="email"
          name="email"
          placeholder="Email cadastrado na Plataforma"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!errors.email}
          className={`w-full ${inputClass(!!errors.email)}`}
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
      </div>
      <div>
        <textarea
          name="reason"
          placeholder="Motivo (opcional)"
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={`w-full resize-none ${inputClass(false)}`}
        />
      </div>
      <Button
        type="submit"
        variant="pill-solid"
        tone="accent"
        className="mt-1.5"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Enviando..." : "Solicitar exclusão de dados"}
      </Button>
    </form>
  );
}
