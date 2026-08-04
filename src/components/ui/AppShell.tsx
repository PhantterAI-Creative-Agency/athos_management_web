"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HeroReveal } from "@/components/ui/HeroReveal";
import { useAuth } from "@/hooks/useAuth";
import { getUser } from "@/api-client/users";
import {
  CalendarIcon,
  CameraIcon,
  CoinIcon,
  HomeIcon,
  IdCardIcon,
  HeartIcon,
  MailIcon,
  SettingsIcon,
  UsersIcon,
  MenuIcon,
} from "@/components/icons";

const heroSectionLinks = [
  { label: "Sobre", id: "about" },
  { label: "Eventos", id: "eventos" },
  { label: "Mídias", id: "midias" },
  { label: "Devocionais", id: "devocionais" },
  { label: "Contato", id: "contato" },
];

const SCROLL_TARGET_KEY = "athos:scrollTarget";

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const navEl = document.querySelector<HTMLElement>("div.fixed.inset-x-0.top-0");
  const offset = navEl?.offsetHeight ?? 0;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  const startY = window.scrollY;
  const distance = top - startY;
  const duration = 1400;
  const start = performance.now();

  function step(now: number) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutQuad(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function waitForElementAndScroll(id: string, attempts = 20) {
  const el = document.getElementById(id);
  if (el) {
    scrollToId(id);
    return;
  }
  if (attempts <= 0) return;
  window.setTimeout(() => waitForElementAndScroll(id, attempts - 1), 100);
}

const tabBarLinks = [
  { label: "Início", href: "/home", icon: HomeIcon, authOnly: false },
  { label: "Eventos", href: "/eventos", icon: CalendarIcon, authOnly: false },
  { label: "Mídias", href: "/midias", icon: CameraIcon, authOnly: false },
  { label: "Mural", href: "/mural", icon: HeartIcon, authOnly: true },
  { label: "Comunidade", href: "/comunidade", icon: UsersIcon, authOnly: true },
  { label: "Planos", href: "/planos", icon: CoinIcon, authOnly: true },
  { label: "Contato", href: "/contato", icon: MailIcon, authOnly: false },
  { label: "Perfil", href: "/perfil", icon: IdCardIcon, authOnly: true },
];

export function AppShell({
  active,
  children,
}: {
  active: string;
  children: React.ReactNode;
}) {
  const isHome = active === "/home";
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleSectionNavClick(id: string) {
    if (isHome) {
      scrollToId(id);
      return;
    }
    sessionStorage.setItem(SCROLL_TARGET_KEY, id);
    router.push("/home");
  }

  const { data: profile } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => (user?.id ? getUser(user.id) : null),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!isHome) return;
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  useEffect(() => {
    if (!isHome) return;
    const targetId = sessionStorage.getItem(SCROLL_TARGET_KEY);
    if (!targetId) return;
    sessionStorage.removeItem(SCROLL_TARGET_KEY);
    waitForElementAndScroll(targetId);
  }, [isHome]);

  return (
    <div className="flex min-h-screen flex-col">
      <div
        className={`fixed inset-x-0 top-0 z-50 hidden items-center justify-between border-b px-12 py-5 transition-all duration-300 md:flex ${
          !isHome || scrolled
            ? "translate-y-0 border-divider bg-background/95 opacity-100 backdrop-blur-sm"
            : "pointer-events-none -translate-y-2 border-transparent bg-transparent opacity-0"
        }`}
      >
        <Link href="/home" className="h-10 w-10 overflow-hidden rounded-full">
          <Image
            src="/logo.jpg"
            alt="Princípios de Vida"
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </Link>
        <nav className="flex gap-8">
          {heroSectionLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleSectionNavClick(link.id)}
              className="label-caps text-text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3.5">
          {user ? (
            <>
              <Link href="/configuracoes" aria-label="Configurações">
                <SettingsIcon className="h-5 w-5 text-foreground" />
              </Link>
              <Link
                href="/perfil"
                className="relative h-8 w-8 overflow-hidden rounded-full bg-surface"
                aria-label="Perfil"
              >
                {profile?.photoUrl ? (
                  <Image
                    src={profile.photoUrl}
                    alt={user.name}
                    fill
                    sizes="32px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-text-muted">
                    {user.name?.[0]?.toUpperCase()}
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="label-caps text-text-muted transition-colors hover:text-foreground"
              >
                Sair
              </button>
            </>
          ) : (
            <Link href="/login" className="label-caps text-text-muted transition-colors hover:text-foreground">
              Entrar
            </Link>
          )}
        </div>
      </div>

      {isHome && (
        <nav
          className={`fixed inset-x-0 top-8 z-40 hidden justify-center gap-10 bg-transparent transition-all duration-500 md:flex ${
            scrolled ? "pointer-events-none -translate-y-3 opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          {heroSectionLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleSectionNavClick(link.id)}
              className="label-caps text-white/80 transition-colors hover:text-white"
            >
              {link.label}
            </button>
          ))}
          {!user && (
            <Link href="/login" className="label-caps text-white/80 transition-colors hover:text-white">
              Entrar
            </Link>
          )}
        </nav>
      )}

      {isHome && (
      <header className="relative flex h-[calc(100dvh-6rem)] flex-col overflow-hidden border-b border-divider px-5 py-5 md:h-screen md:px-12">
        <HeroReveal className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/70" />

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-6">
          <div className="h-40 w-40 overflow-hidden rounded-full shadow-2xl md:h-56 md:w-56">
            <Image
              src="/logo.jpg"
              alt="Princípios de Vida"
              width={224}
              height={224}
              className="h-full w-full object-cover"
            />
          </div>
          </div>
          <button
            type="button"
            onClick={() => scrollToId("about")}
            className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce text-white/70 transition-colors hover:text-white"
            aria-label="Rolar para seção Sobre"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
      </header>
      )}

      <main className={`page-transition flex-1 pb-24 md:pb-0 ${isHome ? "" : "md:pt-20"}`}>{children}</main>

      <nav className="sticky bottom-0 flex justify-around border-t border-divider bg-background px-0 py-3 md:hidden">
        {tabBarLinks
          .filter((link) => !link.authOnly || user)
          .map((link) => {
          const Icon = link.icon;
          const isActive = link.href === active;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 ${
                isActive ? "text-accent" : "text-text-muted"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className={`label-caps ${isActive ? "font-semibold" : ""}`}>
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
