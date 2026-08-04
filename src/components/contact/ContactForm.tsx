"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { sendContactMessage } from "@/api-client/contact";

export function ContactForm({ className = "" }: { className?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao enviar mensagem";
      setErrorMessage(msg);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-3.5 ${className}`}>
      {status === "success" && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Mensagem enviada com sucesso!
        </div>
      )}
      {status === "error" && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>
      )}
      <input
        type="text"
        name="name"
        placeholder="Nome"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded-lg border border-divider bg-background px-4 py-3 text-sm text-foreground placeholder:text-text-muted focus:border-accent focus:outline-none"
      />
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-divider bg-background px-4 py-3 text-sm text-foreground placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Telefone/Whatsapp"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="rounded-lg border border-divider bg-background px-4 py-3 text-sm text-foreground placeholder:text-text-muted focus:border-accent focus:outline-none"
        />
      </div>
      <input
        type="text"
        name="subject"
        placeholder="Assunto"
        required
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="rounded-lg border border-divider bg-background px-4 py-3 text-sm text-foreground placeholder:text-text-muted focus:border-accent focus:outline-none"
      />
      <textarea
        name="message"
        placeholder="Mensagem"
        rows={5}
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="resize-none rounded-lg border border-divider bg-background px-4 py-3 text-sm text-foreground placeholder:text-text-muted focus:border-accent focus:outline-none"
      />
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
