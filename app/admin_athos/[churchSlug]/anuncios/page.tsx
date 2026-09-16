"use client";

import { use } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteAd, getAdsSettings, listAds, updateAd, updateAdsSettings } from "@/api-client/ads";

const PLACEMENT_LABELS: Record<string, string> = {
  home_hero: "Home — Banner principal",
  home_cultos: "Home — Cultos",
  home_grid: "Home — Grade",
  home_devocionais: "Home — Devocionais",
  eventos_grid: "Eventos",
  midias_grid: "Mídias",
  devocionais_grid: "Devocionais",
  ministerios_grid: "Ministérios",
};

export default function AdminAdsPage({
  params,
}: {
  params: Promise<{ churchSlug: string }>;
}) {
  const { churchSlug } = use(params);
  const queryClient = useQueryClient();

  const { data: ads, isLoading } = useQuery({
    queryKey: ["ads"],
    queryFn: () => listAds(),
  });

  const { data: adsSettings } = useQuery({
    queryKey: ["ads", "settings"],
    queryFn: getAdsSettings,
  });

  const toggleActive = useMutation({
    mutationFn: (vars: { id: string; active: boolean }) => updateAd(vars.id, { active: vars.active }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ads"] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteAd(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ads"] }),
  });

  const toggleAdsEnabled = useMutation({
    mutationFn: (adsEnabled: boolean) => updateAdsSettings({ adsEnabled }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ads", "settings"] }),
  });

  const togglePlacement = useMutation({
    mutationFn: (vars: { placement: string; disabled: boolean }) => {
      const current = adsSettings?.disabledAdPlacements ?? [];
      const disabledAdPlacements = vars.disabled
        ? [...current, vars.placement]
        : current.filter((placement) => placement !== vars.placement);
      return updateAdsSettings({ disabledAdPlacements });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ads", "settings"] }),
  });

  const adsEnabled = adsSettings?.adsEnabled ?? true;
  const disabledAdPlacements = adsSettings?.disabledAdPlacements ?? [];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Anúncios</h2>
        <Link
          href={`/admin_athos/${churchSlug}/anuncios/novo`}
          className="label-caps rounded-full bg-accent px-5 py-2 text-background"
        >
          Novo Anúncio
        </Link>
      </div>

      <div className="mb-5 flex items-center justify-between rounded-2xl bg-surface p-4">
        <div>
          <p className="text-sm font-semibold">Desativar todos os anúncios</p>
          <p className="text-xs text-text-muted">Remove todos os anúncios e espaços de anúncio da página</p>
        </div>
        <label className="flex items-center gap-1.5 text-xs text-text-muted">
          <input
            type="checkbox"
            checked={!adsEnabled}
            onChange={(e) => toggleAdsEnabled.mutate(!e.target.checked)}
          />
          Desativado
        </label>
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-2xl bg-surface p-4">
        <p className="text-sm font-semibold">Seções de anúncio</p>
        {Object.entries(PLACEMENT_LABELS).map(([placement, label]) => (
          <div key={placement} className="flex items-center justify-between">
            <span className="text-xs text-text-muted">{label}</span>
            <label className="flex items-center gap-1.5 text-xs text-text-muted">
              <input
                type="checkbox"
                checked={!disabledAdPlacements.includes(placement)}
                disabled={!adsEnabled}
                onChange={(e) => togglePlacement.mutate({ placement, disabled: !e.target.checked })}
              />
              Ativo
            </label>
          </div>
        ))}
      </div>

      {isLoading && <p className="text-sm text-text-muted">Carregando...</p>}

      <div className="flex flex-col gap-3">
        {ads?.map((ad) => (
          <div key={ad.id} className="flex items-center justify-between rounded-2xl bg-surface p-4">
            <div>
              <p className="text-sm font-semibold">{ad.title}</p>
              <p className="text-xs text-text-muted">
                {PLACEMENT_LABELS[ad.placement] ?? ad.placement} · {ad.impressions} impressões · {ad.clicks} cliques
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-xs text-text-muted">
                <input
                  type="checkbox"
                  checked={ad.active}
                  onChange={(e) => toggleActive.mutate({ id: ad.id, active: e.target.checked })}
                />
                Ativo
              </label>
              <Link href={`/admin_athos/${churchSlug}/anuncios/${ad.id}`} className="text-sm font-medium text-accent">
                Editar
              </Link>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Excluir "${ad.title}"?`)) remove.mutate(ad.id);
                }}
                className="text-sm font-medium text-red-600"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}

        {ads?.length === 0 && <p className="text-sm text-text-muted">Nenhum anúncio cadastrado.</p>}
      </div>
    </div>
  );
}
