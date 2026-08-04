"use client";

import Link from "next/link";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/ui/AppShell";
import { CoverImage } from "@/components/ui/CoverImage";
import { Tag } from "@/components/ui/Tag";
import { YouTubeEmbed } from "@/components/ui/YouTubeEmbed";
import { Footer } from "@/components/ui/Footer";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { useAuth } from "@/hooks/useAuth";
import { listEvents, getPublicEvents } from "@/api-client/events";
import { listDevotionals, getPublicDevotionals } from "@/api-client/devotionals";
import { listMedia, getPublicMedia, type MediaDTO } from "@/api-client/media";
import { getMyChurch, getPublicChurch } from "@/api-client/churches";
import { getUser } from "@/api-client/users";
import { ChevronRightIcon, MailIcon, WhatsappIcon, PinIcon } from "@/components/icons";

const CHURCH_SLUG = process.env.NEXT_PUBLIC_CHURCH_SLUG ?? "principios-de-vida";

const monthNames = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const dayNames = [
  "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
  "Quinta-feira", "Sexta-feira", "Sábado",
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-section-title font-medium text-foreground/80">{children}</h3>;
}

function MediaCarousel({ items }: { items: MediaDTO[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * (el.clientWidth / 3), behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="scrollbar-hide flex gap-3 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory"
      >
        {items.map((item) => (
          <div key={item.id} className="w-[calc((100%-1.5rem)/3)] flex-none snap-start">
            {item.type === "video" && item.youtubeId ? (
              <YouTubeEmbed youtubeId={item.youtubeId} title={item.title} className="aspect-video" />
            ) : (
              <CoverImage label={item.title} seed={`media-${item.id}`} className="aspect-video" />
            )}
            <p className="mb-0.5 mt-2 text-[10px] uppercase tracking-wide text-accent md:text-xs">
              {item.category}
            </p>
            <p className="text-[11px] font-semibold leading-tight md:text-sm">{item.title}</p>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label="Mídias anteriores"
        className="absolute left-0 top-[38%] flex h-8 w-8 -translate-x-1/3 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 shadow-md backdrop-blur-sm"
      >
        <ChevronRightIcon className="h-4 w-4 rotate-180" />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label="Próximas mídias"
        className="absolute right-0 top-[38%] flex h-8 w-8 -translate-y-1/2 translate-x-1/3 items-center justify-center rounded-full bg-background/90 shadow-md backdrop-blur-sm"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

function ContactSection({
  email,
  whatsapp,
  address,
}: {
  email: string;
  whatsapp: string;
  address: string;
}) {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-3xl px-5 py-10 md:max-w-5xl md:px-12 md:py-16">
        <h3 className="text-center text-section-title font-semibold md:text-3xl">Fale Conosco</h3>

        <div className="mt-8 grid grid-cols-1 gap-10 md:mt-12 md:grid-cols-[1.3fr_1px_1fr]">
          <ContactForm />

          <div className="hidden bg-divider md:block" />

          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-3">
              <MailIcon className="mt-0.5 h-5 w-5 flex-none text-accent" />
              <div>
                <p className="text-sm font-semibold">E-mail</p>
                <p className="text-sm text-text-muted">{email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <WhatsappIcon className="mt-0.5 h-5 w-5 flex-none text-accent" />
              <div>
                <p className="text-sm font-semibold">WhatsApp</p>
                <p className="text-sm text-text-muted">{whatsapp}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <PinIcon className="mt-0.5 h-5 w-5 flex-none text-accent" />
              <div>
                <p className="text-sm font-semibold">Visite-nos</p>
                <p className="text-sm text-text-muted">{address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeContent() {
  const { user } = useAuth();
  const today = new Date();
  const dateStr = `${dayNames[today.getDay()]}, ${today.getDate()} de ${monthNames[today.getMonth()]}`;
  const hour = today.getHours();
  const greeting = hour < 6 ? "Boa Madrugada" : hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  const { data: profile } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => (user?.id ? getUser(user.id) : null),
    enabled: !!user?.id,
  });

  const { data: events } = useQuery({
    queryKey: ["events", "upcoming", user?.id],
    queryFn: () => (user ? listEvents(true) : getPublicEvents(CHURCH_SLUG)),
  });

  const { data: devotionals } = useQuery({
    queryKey: ["devotionals", user?.id],
    queryFn: () => (user ? listDevotionals() : getPublicDevotionals(CHURCH_SLUG)),
  });

  const { data: mediaList } = useQuery({
    queryKey: ["media", user?.id],
    queryFn: () => (user ? listMedia() : getPublicMedia(CHURCH_SLUG)),
  });

  const { data: church } = useQuery({
    queryKey: ["churches", user ? "me" : "public", user?.id],
    queryFn: () => (user ? getMyChurch() : getPublicChurch(CHURCH_SLUG)),
  });

  const homeContent = church?.homeContent;
  const contact = church?.contact;

  const bannerEvent =
    events?.find((event) => event.id === homeContent?.bannerEventId) ?? events?.[0];
  const featuredEvents = events?.filter((event) => event.featured) ?? [];
  const latestDevotionals = devotionals?.slice(0, 5);
  const latestMedia = mediaList?.slice(0, 5);

  return (
    <>
      <Reveal as="section" className="bg-background" id="about">
        <div className="mx-auto max-w-2xl px-5 py-12 text-center md:max-w-3xl md:px-12 md:py-20">
          <h2 className="mx-auto text-2xl font-bold leading-snug text-foreground/70 md:text-4xl">
            {homeContent?.intro ??
              "Princípios de Vida é uma igreja que acredita em Jesus, uma igreja que ama a Deus e as pessoas."}
          </h2>
        </div>
      </Reveal>

      <section className="bg-surface">
        <div className="mx-auto max-w-3xl px-5 py-8 md:max-w-5xl md:px-12 md:py-12">
          <RevealStagger className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <RevealItem>
              <p className="label-caps mb-1.5 text-accent">Missão</p>
              <p className="text-sm leading-relaxed">
                {homeContent?.mission ??
                  "Alcançar pessoas com o evangelho de Cristo e discipulá-las para uma vida transformada."}
              </p>
            </RevealItem>
            <RevealItem>
              <p className="label-caps mb-1.5 text-accent">Visão</p>
              <p className="text-sm leading-relaxed">
                {homeContent?.vision ??
                  "Ser uma igreja em constante crescimento, formando líderes e multiplicando comunidades de fé."}
              </p>
            </RevealItem>
            <RevealItem>
              <p className="label-caps mb-1.5 text-accent">Valores</p>
              <p className="text-sm leading-relaxed">
                {homeContent?.values ??
                  "Fé, comunidade, serviço e integridade como base de tudo o que fazemos juntos."}
              </p>
            </RevealItem>
          </RevealStagger>
        </div>
      </section>

      <Reveal as="section" className="bg-background">
        <div className="mx-auto max-w-3xl px-5 pb-8 pt-6 md:max-w-5xl md:px-12 md:py-10">
          <div className="mb-1">
            <p className="text-[22px] font-semibold">{greeting}, {(profile?.name || user?.name)?.split(" ")[0] || "Querido(a)"}</p>
          </div>
          <p className="mb-5 text-sm text-text-muted">{dateStr}</p>

          {bannerEvent && (
            <Link href={`/eventos`}>
              <CoverImage
                label={bannerEvent.title}
                seed={`event-${bannerEvent.id}`}
                overlay="strong"
                className="h-[170px] md:h-[300px]"
              >
                <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="label-caps mb-1 text-white/85">{bannerEvent.title}</p>
                    <p className="text-lg font-semibold text-white">
                      {bannerEvent.date ? new Date(bannerEvent.date).toLocaleDateString("pt-BR") : ""}
                      {bannerEvent.location && ` · ${bannerEvent.location}`}
                    </p>
                  </div>
                  <Tag variant="warm">Em destaque</Tag>
                </div>
              </CoverImage>
            </Link>
          )}
        </div>
      </Reveal>

      {events && events.length > 0 && (
        <Reveal as="section" className="bg-surface" id="eventos">
          <div className="mx-auto max-w-3xl px-5 py-7 md:max-w-5xl md:px-12">
            <div className="mb-2 flex items-baseline justify-between">
              <SectionTitle>Próximos Eventos</SectionTitle>
              <Link href="/eventos" className="text-xs text-accent">Ver tudo</Link>
            </div>
            <RevealStagger className="scrollbar-hide flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
              {events.map((item) => (
                <RevealItem key={item.id} className="w-[260px] flex-none snap-start md:w-[300px]">
                  <CoverImage label={item.title} seed={`event-${item.id}`} className="aspect-video rounded-lg" />
                  <p className="mb-0.5 mt-2 text-[10px] uppercase tracking-wide text-accent md:text-xs">
                    {new Date(item.date).toLocaleDateString("pt-BR")}
                    {item.location && ` · ${item.location}`}
                  </p>
                  <p className="text-[11px] font-semibold leading-tight md:text-sm">{item.title}</p>
                </RevealItem>
              ))}
            </RevealStagger>
          </div>
        </Reveal>
      )}

      {latestMedia && latestMedia.length > 0 && (
        <Reveal as="section" className="bg-background" id="midias">
          <div className="mx-auto max-w-3xl px-5 py-7 md:max-w-5xl md:px-12">
            <div className="mb-2 flex items-baseline justify-between">
              <SectionTitle>Mídias</SectionTitle>
              <Link href="/midias" className="text-xs text-accent">Ver tudo</Link>
            </div>
            <MediaCarousel items={latestMedia} />
          </div>
        </Reveal>
      )}

      {featuredEvents.length > 0 && (
        <Reveal as="section" className="bg-[#1a1a1a] py-12 md:py-16">
          <div className="mx-auto max-w-3xl px-5 md:max-w-5xl md:px-12">
            <h3 className="text-center text-2xl font-bold text-white md:text-3xl">
              Conferências e Eventos
            </h3>
            <RevealStagger className="mt-10 flex flex-wrap justify-center gap-8 md:gap-16">
              {featuredEvents.map((item) => (
                <RevealItem key={item.id} className="w-[260px] md:w-[300px]">
                  <CoverImage
                    label={item.title}
                    seed={`event-${item.id}`}
                    className="aspect-video rounded-lg"
                  />
                  <p className="mt-3 text-sm font-semibold leading-tight text-white md:text-base">
                    {item.title}
                  </p>
                </RevealItem>
              ))}
            </RevealStagger>
          </div>
        </Reveal>
      )}

      {latestDevotionals && latestDevotionals.length > 0 && (
        <Reveal as="section" className="bg-surface" id="devocionais">
          <div className="mx-auto max-w-3xl px-5 py-7 pb-10 md:max-w-5xl md:px-12 md:pb-10">
            <div className="mb-5 flex items-baseline justify-between">
              <SectionTitle>Devocionais</SectionTitle>
              <Link
                href="/devocionais"
                className="flex items-center gap-1 text-xs font-medium text-accent"
              >
                Descubra mais devocionais
                <ChevronRightIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
            <RevealStagger className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {latestDevotionals.slice(0, 3).map((item) => (
                <RevealItem key={item.id}>
                  <Link href="/devocionais" className="block">
                    <CoverImage
                      label={item.title}
                      seed={`dev-${item.id}`}
                      className="aspect-square rounded-none"
                    />
                    <div className="bg-surface px-3.5 py-3">
                      <p className="mb-1.5 text-[11px] uppercase tracking-wide text-text-muted">
                        {new Date(item.publishedAt).toLocaleDateString("pt-BR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-sm font-semibold leading-snug text-foreground">
                        {item.title}
                      </p>
                    </div>
                  </Link>
                </RevealItem>
              ))}
            </RevealStagger>
          </div>
        </Reveal>
      )}

      <Reveal as="section" id="contato">
        <ContactSection
          email={contact?.email ?? "contato@principiosdevida.org.br"}
          whatsapp={contact?.whatsapp ?? "11 99999-0000"}
          address={church?.address ?? "Av. Principal, 1000 - Santo André/SP"}
        />
      </Reveal>

      <Footer />
    </>
  );
}

export default function HomePage() {
  return (
    <AppShell active="/home">
      <HomeContent />
    </AppShell>
  );
}
