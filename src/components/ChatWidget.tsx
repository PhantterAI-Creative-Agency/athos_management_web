"use client";

import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sendChatMessage, sendGuestChatMessage, type ChatMessageCategory } from "@/api-client/aiChat";
import { ChatIcon } from "@/components/icons";

interface ChatEntry {
  role: "user" | "assistant";
  content: string;
  category?: ChatMessageCategory;
}

interface ChatWidgetProps {
  mode: "authenticated" | "guest";
  churchSlug?: string;
}

function createSessionId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function ChatWidget({ mode, churchSlug }: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [sessionId] = useState(createSessionId);
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [input, setInput] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestWhatsapp, setGuestWhatsapp] = useState("");
  const [guestInfoSubmitted, setGuestInfoSubmitted] = useState(mode === "authenticated");

  const mutation = useMutation({
    mutationFn: (message: string) =>
      mode === "authenticated"
        ? sendChatMessage(sessionId, message)
        : sendGuestChatMessage(churchSlug!, { sessionId, message, guestName, guestWhatsapp }),
    onSuccess: (reply) => {
      setMessages((prev) => [...prev, { role: "assistant", content: reply.reply, category: reply.category }]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Não consegui responder agora. Tente novamente em instantes." },
      ]);
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || mutation.isPending) return;
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    mutation.mutate(trimmed);
  }

  function handleGuestInfoSubmit(e: FormEvent) {
    e.preventDefault();
    if (!guestName.trim() || !guestWhatsapp.trim()) return;
    setGuestInfoSubmitted(true);
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 md:bottom-5 md:right-5">
      {open && (
        <div className="absolute bottom-full right-0 mb-3 flex h-[28rem] w-[calc(100vw-2rem)] max-w-80 flex-col overflow-hidden rounded-2xl bg-surface shadow-xl">
          <div className="flex items-center justify-between border-b border-divider px-4 py-3">
            <p className="text-sm font-semibold">Assistente Athos</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-text-muted"
              aria-label="Fechar chat"
            >
              Fechar
            </button>
          </div>

          {!guestInfoSubmitted ? (
            <form onSubmit={handleGuestInfoSubmit} className="flex flex-1 flex-col justify-center gap-3 p-4">
              <p className="text-xs text-text-muted">
                Antes de começar, me diga seu nome e WhatsApp para que possamos te ajudar melhor.
              </p>
              <input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Seu nome"
                className="rounded-xl bg-background p-3 text-sm outline-none"
              />
              <input
                value={guestWhatsapp}
                onChange={(e) => setGuestWhatsapp(e.target.value)}
                placeholder="Seu WhatsApp"
                className="rounded-xl bg-background p-3 text-sm outline-none"
              />
              <button
                type="submit"
                disabled={!guestName.trim() || !guestWhatsapp.trim()}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                Começar conversa
              </button>
            </form>
          ) : (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.length === 0 && (
                  <p className="text-xs text-text-muted">
                    Pergunte algo sobre o site ou sobre a igreja.
                  </p>
                )}
                {messages.map((entry, index) => (
                  <div
                    key={index}
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                      entry.role === "user"
                        ? "ml-auto bg-accent text-white"
                        : "bg-background text-foreground"
                    }`}
                  >
                    {entry.role === "assistant" ? (
                      <div className="space-y-2 [&_a]:underline [&_a]:text-accent [&_code]:rounded [&_code]:bg-divider/50 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:leading-relaxed [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-4">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.content}</ReactMarkdown>
                      </div>
                    ) : (
                      entry.content
                    )}
                  </div>
                ))}
                {mutation.isPending && <p className="text-xs text-text-muted">Digitando...</p>}
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2 border-t border-divider p-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 rounded-xl bg-background px-3 py-2 text-sm outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || mutation.isPending}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Enviar
                </button>
              </form>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg"
        aria-label="Abrir assistente"
      >
        <ChatIcon className="h-6 w-6" />
      </button>
    </div>
  );
}
