"use client";

import { useState, useRef, type FormEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/ui/AppShell";
import { CoverImage } from "@/components/ui/CoverImage";
import { Tag } from "@/components/ui/Tag";
import { useAuth } from "@/hooks/useAuth";
import { listMural, createMuralPost, toggleMuralLike, deleteMuralPost } from "@/api-client/mural";
import { HeartIcon } from "@/components/icons";

function MuralContent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery({
    queryKey: ["mural"],
    queryFn: () => listMural(),
  });

  const createMutation = useMutation({
    mutationFn: () => createMuralPost({ content, authorType: "user", audience: "all" }),
    onSuccess: () => {
      setContent("");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["mural"] });
    },
  });

  const likeMutation = useMutation({
    mutationFn: (postId: string) => toggleMuralLike(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mural"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (postId: string) => deleteMuralPost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mural"] });
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    createMutation.mutate();
  }

  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-6 md:max-w-2xl md:px-12 md:py-10">
      <h2 className="mb-1 text-2xl font-semibold">Mural</h2>
      <p className="mb-5 text-sm text-text-muted">Acompanhe os avisos e novidades da igreja</p>

      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="mb-5 w-full rounded-2xl bg-surface p-4 text-left text-sm text-text-muted transition-colors hover:bg-white/5"
        >
          Compartilhe algo com a igreja...
        </button>
      ) : (
        <div ref={formRef} className="mb-5 rounded-2xl bg-surface p-4">
          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="O que você gostaria de compartilhar?"
              className="mb-3 w-full resize-none rounded-xl bg-background p-3 text-sm outline-none"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setShowForm(false); setContent(""); }}
                className="rounded-lg px-4 py-2 text-sm font-medium text-text-muted"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!content.trim() || createMutation.isPending}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {createMutation.isPending ? "Publicando..." : "Publicar"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {data?.items.map((post) => (
          <div key={post.id} className="rounded-2xl bg-surface p-4">
            <div className="mb-2 flex items-center gap-2">
              <CoverImage
                label="Avatar"
                seed={`author-${post.authorId}`}
                className="h-8 w-8 flex-none rounded-full"
              />
              <div>
                <p className="text-sm font-semibold">
                  {post.authorType === "church" ? "Igreja" : "Membro"}
                </p>
                <p className="text-[10px] text-text-muted">
                  {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
              {post.authorId === user?.id && (
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(post.id)}
                  className="ml-auto text-xs text-text-muted"
                >
                  Excluir
                </button>
              )}
            </div>

            <p className="mb-3 text-sm leading-relaxed">{post.content}</p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => likeMutation.mutate(post.id)}
                className={`flex items-center gap-1 text-xs ${post.liked ? "text-red-500" : "text-text-muted"}`}
              >
                <HeartIcon className={`h-4 w-4 ${post.liked ? "fill-red-500 stroke-red-500" : ""}`} />
                {post.likesCount}
              </button>
              {post.audience !== "all" && <Tag>{post.audience}</Tag>}
            </div>
          </div>
        ))}
        {data?.items.length === 0 && (
          <p className="text-center text-sm text-text-muted">Nenhum post no mural ainda</p>
        )}
      </div>
    </div>
  );
}

export default function MuralPage() {
  return (
    <AppShell active="/mural">
      <MuralContent />
    </AppShell>
  );
}
