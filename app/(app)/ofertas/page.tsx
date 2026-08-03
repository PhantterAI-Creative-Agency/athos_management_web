"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/ui/AppShell";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { listOfferings, createOffering } from "@/api-client/offerings";
import { Tag } from "@/components/ui/Tag";

function OfertasContent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"contribution" | "donation">("contribution");
  const [showForm, setShowForm] = useState(false);

  const { data: offerings } = useQuery({
    queryKey: ["offerings", user?.id],
    queryFn: () => listOfferings({ userId: user?.id }),
    enabled: !!user?.id,
  });

  const mutation = useMutation({
    mutationFn: () =>
      createOffering({
        type,
        amount: parseFloat(amount),
        provider: "mercadopago",
      }),
    onSuccess: () => {
      setAmount("");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["offerings"] });
    },
  });

  const paidOfferings = offerings?.filter((o) => o.status === "paid") || [];
  const totalPaid = paidOfferings.reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-6 md:max-w-2xl md:px-12 md:py-10">
      <h2 className="mb-1 text-2xl font-semibold">Ofertas</h2>
      <p className="mb-5 text-sm text-text-muted">Contribua com a obra de Deus</p>

      <div className="mb-6 rounded-2xl bg-surface p-5">
        <p className="mb-1 text-xs text-text-muted">Total contribuído</p>
        <p className="text-3xl font-bold">
          {totalPaid.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </p>
        <p className="text-xs text-text-muted">{paidOfferings.length} contribuições</p>
      </div>

      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mb-6 w-full rounded-2xl bg-accent py-3 text-sm font-semibold text-white"
        >
          Fazer Oferta
        </button>
      ) : (
        <div className="mb-6 rounded-2xl bg-surface p-4">
          <div className="mb-3 flex gap-2">
            <button
              type="button"
              onClick={() => setType("contribution")}
              className={`flex-1 rounded-xl py-2 text-sm font-medium ${type === "contribution" ? "bg-accent text-white" : "bg-background text-text-muted"}`}
            >
              Dízimo
            </button>
            <button
              type="button"
              onClick={() => setType("donation")}
              className={`flex-1 rounded-xl py-2 text-sm font-medium ${type === "donation" ? "bg-accent text-white" : "bg-background text-text-muted"}`}
            >
              Oferta
            </button>
          </div>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Valor (R$)"
            className="mb-3 w-full rounded-xl bg-background px-4 py-2.5 text-sm outline-none"
          />
          <button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={!amount || parseFloat(amount) <= 0 || mutation.isPending}
            className="w-full rounded-xl bg-accent py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {mutation.isPending ? "Processando..." : "Contribuir"}
          </button>
          {mutation.data && (
            <div className="mt-3 rounded-xl bg-accent-tint p-3 text-xs text-accent-tint-text">
              {mutation.data.pixQrCode && (
                <img src={mutation.data.pixQrCode} alt="QR Code PIX" className="mx-auto mb-2 h-32 w-32" />
              )}
              {mutation.data.pixCopyPaste && (
                <>
                  <p className="mb-1 font-semibold">Código PIX:</p>
                  <p className="break-all font-mono text-[10px]">{mutation.data.pixCopyPaste}</p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent">
        Histórico
      </h3>
      <div className="flex flex-col gap-2">
        {offerings?.map((offering) => (
          <div key={offering.id} className="flex items-center justify-between rounded-xl bg-surface p-3">
            <div>
              <p className="text-sm font-medium">
                {offering.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
              <p className="text-[10px] text-text-muted">
                {new Date(offering.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <Tag>
              {offering.status === "paid" ? "Pago" : offering.status === "pending" ? "Pendente" : offering.status}
            </Tag>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OfertasPage() {
  return (
    <AuthGuard>
      <AppShell active="/ofertas">
        <OfertasContent />
      </AppShell>
    </AuthGuard>
  );
}
