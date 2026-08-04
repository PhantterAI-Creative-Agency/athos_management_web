"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/ui/AppShell";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { EventCard } from "@/components/events/EventCard";
import { AuthGuard } from "@/components/AuthGuard";
import { listEvents, listMyRegistrations } from "@/api-client/events";
import type { EventDTO } from "@/api-client/events";
import { formatEventSchedule } from "@/lib/date";

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr);
  return { day: String(d.getDate()).padStart(2, "0"), month: MONTHS[d.getMonth()] };
}

const statusMap: Record<string, string> = {
  inscricoes: "inscricoes",
  participando: "attending",
  participou: "attended",
};

function EventosContent() {
  const [tab, setTab] = useState("Inscrições");

  const { data: events } = useQuery({
    queryKey: ["events", "upcoming"],
    queryFn: () => listEvents(true),
  });

  const { data: registrations } = useQuery({
    queryKey: ["registrations", statusMap[tab]],
    queryFn: () => listMyRegistrations(statusMap[tab]),
    enabled: tab !== "Inscrições",
  });

  const displayEvents: (EventDTO & { day?: string; month?: string; status?: string; schedule?: string })[] = [];

  if (tab === "Inscrições" && events) {
    for (const ev of events) {
      const { day, month } = formatEventDate(ev.date);
      displayEvents.push({
        ...ev,
        day,
        month,
        status: "inscricoes",
        schedule: formatEventSchedule(ev.date),
      });
    }
  } else if (registrations) {
    for (const reg of registrations) {
      const evMatch = events?.find((e) => e.id === reg.eventId);
      if (evMatch) {
        const { day, month } = formatEventDate(evMatch.date);
        displayEvents.push({
          ...evMatch,
          day,
          month,
          status: tab === "Participando" ? "participando" : "participou",
          schedule: formatEventSchedule(evMatch.date),
        });
      }
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-6 md:max-w-5xl md:px-12 md:py-10">
      <h2 className="mb-1 text-2xl font-semibold">Eventos</h2>
      <p className="mb-5 hidden text-sm text-text-muted md:block">
        Inscreva-se e acompanhe sua participação
      </p>

      <div className="mb-5 md:w-fit">
        <SegmentedControl
          options={["Inscrições", "Participando", "Participou"]}
          onChange={setTab}
        />
      </div>

      <div className="flex flex-col gap-4 md:grid md:grid-cols-3">
        {displayEvents.map((event) => (
          <EventCard
            key={event.id}
            event={{
              id: event.id,
              title: event.title,
              day: event.day || "",
              month: event.month || "",
              schedule: event.schedule || new Date(event.date).toLocaleDateString("pt-BR"),
              location: event.location || "",
              price: event.price && event.price > 0 ? `Pago · R$ ${event.price}` : "Gratuito",
              status: (event.status || "inscricoes") as "inscricoes" | "participando" | "participou",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function EventosPage() {
  return (
    <AuthGuard>
      <AppShell active="/eventos">
        <EventosContent />
      </AppShell>
    </AuthGuard>
  );
}
