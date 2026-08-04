"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { sendContactMessage } from "@/api-client/contact";

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "subject" | "message", string>>;

function maskPhone(value: string) {
  let digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length > 10) {
    digits = digits.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
  } else if (digits.length > 5) {
    digits = digits.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  } else if (digits.length > 2) {
    digits = digits.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  } else if (digits.length > 0) {
    digits = digits.replace(/^(\d*)/, "($1");
  }
  return digits;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

export function ContactForm({ className = "" }: { className?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function validate(): FieldErrors {
    const nextErrors: FieldErrors = {};
    if (!name.trim()) nextErrors.name = "Informe seu nome";
    if (!email.trim()) nextErrors.email = "Informe seu email";
    else if (!isValidEmail(email.trim())) nextErrors.email = "Informe um email válido";
    if (!phone.trim()) nextErrors.phone = "Informe seu telefone/whatsapp";
    else if (!isValidPhone(phone)) nextErrors.phone = "Informe um telefone válido com DDD";
    if (!subject.trim()) nextErrors.subject = "Informe o assunto";
    if (!message.trim()) nextErrors.message = "Informe sua mensagem";
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
      await sendContactMessage({ name, email, phone, subject, message });
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
      setErrors({});
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao enviar mensagem";
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
          Mensagem enviada com sucesso!
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
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            className={`w-full ${inputClass(!!errors.email)}`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
        </div>
        <div>
          <input
            type="tel"
            name="phone"
            placeholder="Telefone/Whatsapp"
            required
            value={phone}
            onChange={(e) => setPhone(maskPhone(e.target.value))}
            aria-invalid={!!errors.phone}
            maxLength={15}
            className={`w-full ${inputClass(!!errors.phone)}`}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
        </div>
      </div>
      <div>
        <input
          type="text"
          name="subject"
          placeholder="Assunto"
          required
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          aria-invalid={!!errors.subject}
          className={`w-full ${inputClass(!!errors.subject)}`}
        />
        {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject}</p>}
      </div>
      <div>
        <textarea
          name="message"
          placeholder="Mensagem"
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={!!errors.message}
          className={`w-full resize-none ${inputClass(!!errors.message)}`}
        />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
      </div>
      <Button
        type="submit"
        variant="pill-solid"
        tone="accent"
        className="mt-1.5"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Enviando..." : "Enviar"}
      </Button>
    </form>
  );
}
