"use client";

import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/ui/AppShell";
import { CoverImage } from "@/components/ui/CoverImage";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import { Tag } from "@/components/ui/Tag";
import { useAuth } from "@/hooks/useAuth";
import { listMedia, getPublicMedia } from "@/api-client/media";

const CHURCH_SLUG = process.env.NEXT_PUBLIC_CHURCH_SLUG ?? "principios-de-vida";

function MidiasContent() {
  const { user } = useAuth();
  const { data: mediaList } = useQuery({
    queryKey: ["media", user?.id],
    queryFn: () => (user ? listMedia() : getPublicMedia(CHURCH_SLUG)),
  });

  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-6 md:max-w-5xl md:px-12 md:py-10">
      <h2 className="mb-1 text-2xl font-semibold">Mídias</h2>
      <p className="mb-5 text-sm text-text-muted">Pregações, louvores e conteúdos da igreja</p>

      <div className="flex flex-col gap-6 md:grid md:grid-cols-2 lg:grid-cols-3">
        {mediaList?.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-2xl bg-surface">
            {item.type === "video" && item.youtubeId ? (
              <YouTubeEmbed
                youtubeId={item.youtubeId}
                title={item.title}
                className="h-[200px]"
              />
            ) : (
              <CoverImage
                label={item.title}
                seed={`media-${item.id}`}
                className="h-[200px]"
              />
            )}
            <div className="p-4">
              <Tag>{item.category}</Tag>
              <p className="mt-1.5 font-semibold leading-tight">{item.title}</p>
            </div>
          </div>
        ))}
        {mediaList?.length === 0 && (
          <p className="col-span-full text-center text-sm text-text-muted">
            Nenhuma mídia encontrada
          </p>
        )}
      </div>
    </div>
  );
}

export default function MidiasPage() {
  return (
    <AppShell active="/midias">
      <MidiasContent />
    </AppShell>
  );
}
