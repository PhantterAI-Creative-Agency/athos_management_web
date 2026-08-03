"use client";

import { AppShell } from "@/components/ui/AppShell";
import { CoverImage } from "@/components/ui/CoverImage";
import { AuthGuard } from "@/components/AuthGuard";

export default function IgrejaPage() {
  return (
    <AuthGuard>
      <AppShell active="/igreja">
        <div className="mx-auto max-w-3xl px-5 pb-10 pt-6 md:max-w-2xl md:px-12 md:py-10">
          <h2 className="mb-1 text-2xl font-semibold">Nossa Igreja</h2>
          <p className="mb-5 text-sm text-text-muted">Princípios de Vida</p>

          <CoverImage
            label="Igreja"
            seed="church-banner"
            overlay
            className="mb-6 h-[200px]"
          >
            <div className="absolute bottom-3.5 left-4 right-4">
              <p className="text-lg font-semibold text-white">Princípios de Vida</p>
              <p className="text-sm text-white/80">Uma igreja para todas as gerações</p>
            </div>
          </CoverImage>
        </div>
      </AppShell>
    </AuthGuard>
  );
}
