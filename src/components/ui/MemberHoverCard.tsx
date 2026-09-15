"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CoverImage } from "@/components/ui/CoverImage";
import { followUser, unfollowUser } from "@/api-client/follows";
import { sendFriendRequest } from "@/api-client/friends";
import type { MuralFriendshipRelationStatus } from "@/api-client/mural";

const friendshipLabel: Record<MuralFriendshipRelationStatus, string> = {
  none: "Adicionar",
  pending_sent: "Convite enviado",
  pending_received: "Aguardando sua resposta",
  accepted: "Amigos",
};

export function MemberHoverCard({
  authorId,
  authorName,
  authorPhotoUrl,
  viewerFollowsAuthor,
  viewerFriendshipStatus,
  children,
}: {
  authorId: string;
  authorName: string;
  authorPhotoUrl?: string;
  viewerFollowsAuthor: boolean;
  viewerFriendshipStatus: MuralFriendshipRelationStatus;
  children: ReactNode;
}) {
  const queryClient = useQueryClient();
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show(e: MouseEvent) {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setPosition((current) => current ?? { x: e.clientX, y: e.clientY });
  }

  function scheduleHide() {
    hideTimeout.current = setTimeout(() => setPosition(null), 150);
  }

  function cancelHide() {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
  }

  const followMutation = useMutation({
    mutationFn: async () => {
      if (viewerFollowsAuthor) {
        await unfollowUser(authorId);
      } else {
        await followUser(authorId);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["mural"] }),
  });

  const addFriendMutation = useMutation({
    mutationFn: () => sendFriendRequest(authorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mural"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  return (
    <span
      className="relative inline-flex items-center gap-2"
      onMouseEnter={show}
      onMouseLeave={scheduleHide}
    >
      {children}

      {position && (
        <div
          className="fixed z-50 w-56 rounded-2xl bg-surface p-4 shadow-xl"
          style={{ left: position.x + 12, top: position.y + 12 }}
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
        >
          <div className="mb-3 flex items-center gap-2">
            <CoverImage
              label={authorName}
              seed={`author-${authorId}`}
              src={authorPhotoUrl}
              className="h-10 w-10 flex-none rounded-full"
            />
            <p className="text-sm font-semibold">{authorName}</p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => followMutation.mutate()}
              disabled={followMutation.isPending}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60 ${
                viewerFollowsAuthor
                  ? "bg-background text-text-muted"
                  : "bg-accent text-white"
              }`}
            >
              {viewerFollowsAuthor ? "Deixar de seguir" : "Seguir"}
            </button>

            <button
              type="button"
              onClick={() => addFriendMutation.mutate()}
              disabled={viewerFriendshipStatus !== "none" || addFriendMutation.isPending}
              className="rounded-lg bg-background px-3 py-1.5 text-xs font-semibold text-text-muted disabled:opacity-60"
            >
              {friendshipLabel[viewerFriendshipStatus]}
            </button>
          </div>
        </div>
      )}
    </span>
  );
}
