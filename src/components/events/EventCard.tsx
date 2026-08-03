import { CoverImage } from "@/components/ui/CoverImage";
import { Tag } from "@/components/ui/Tag";
import { DetailsIcon } from "@/components/icons";
import type { EventItem } from "@/data/mock";

export function EventCard({ event }: { event: EventItem }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-surface">
      <CoverImage label={`Foto do evento ${event.title}`} seed={event.id} className="h-[140px]">
        <div className="absolute left-2.5 top-2.5 rounded-lg bg-background/80 px-2 py-1 text-center backdrop-blur-sm">
          <div className="text-[15px] font-semibold leading-none">{event.day}</div>
          <div className="text-[9px] uppercase tracking-wide text-foreground/70">
            {event.month}
          </div>
        </div>
      </CoverImage>
      <div className="p-4">
        <p className="mb-1.5 font-semibold leading-tight">{event.title}</p>
        <p className="mb-2.5 text-xs text-text-muted">
          {event.schedule} · {event.location}
        </p>
        <div className="flex items-center justify-between">
          <Tag>{event.price}</Tag>
          <div className="flex items-center gap-2 text-xs font-semibold text-accent">
            <DetailsIcon className="h-4 w-4" />
            Detalhes
          </div>
        </div>
      </div>
    </div>
  );
}
