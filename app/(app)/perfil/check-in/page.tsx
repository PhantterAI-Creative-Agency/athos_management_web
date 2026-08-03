"use client";

import { AppShell } from "@/components/ui/AppShell";
import { AuthGuard } from "@/components/AuthGuard";

export default function CheckinPage() {
  return (
    <AuthGuard>
      <AppShell active="/perfil">
        <div className="mx-auto max-w-3xl px-5 pb-10 pt-6 md:max-w-2xl md:px-12 md:py-10">
          <h2 className="mb-5 text-2xl font-semibold">Check-in</h2>
          <p className="text-sm text-text-muted">Em breve</p>
        </div>
      </AppShell>
    </AuthGuard>
  );
}
