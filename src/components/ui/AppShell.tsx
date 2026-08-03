"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HeroReveal } from "@/components/ui/HeroReveal";
import { useAuth } from "@/hooks/useAuth";
import { getUser } from "@/api-client/users";
import {
  BookIcon,
  CalendarIcon,
  CoinIcon,
  IdCardIcon,
  HeartIcon,
  SettingsIcon,
  UsersIcon,
  MenuIcon,
} from "@/components/icons";

const topNavLinks = [
  { label: "Início", href: "/home" },
  { label: "Eventos", href: "/eventos" },
  { label: "Mural", href: "/mural" },
  { label: "Ministérios", href: "/ministerios" },
  { label: "Bíblia", href: "/biblia" },
];

const tabBarLinks = [
  { label: "Início", href: "/home", icon: CalendarIcon },
  { label: "Mural", href: "/mural", icon: HeartIcon },
  { label: "Descubra", href: "/descubra", icon: BookIcon },
  { label: "Comunidade", href: "/comunidade", icon: UsersIcon },
  { label: "Perfil", href: "/perfil", icon: IdCardIcon },
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
          {topNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`label-caps ${
                link.href === active ? "text-foreground" : "text-text-muted"
              }`}
            >
              {link.label}
            </Link>
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
            onClick={() => {
              const el = document.getElementById("about");
              if (!el) return;
              const navEl = document.querySelector<HTMLElement>("div.fixed.inset-x-0.top-0");
              const offset = navEl?.offsetHeight ?? 0;
              const top = el.getBoundingClientRect().top + window.scrollY - offset;
              const startY = window.scrollY;
              const distance = top - startY;
              const duration = 1400;
              const start = performance.now();

              function easeInOutQuad(t: number) {
                return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
              }

              function step(now: number) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                window.scrollTo(0, startY + distance * easeInOutQuad(progress));
                if (progress < 1) requestAnimationFrame(step);
              }

              requestAnimationFrame(step);
            }}
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
          .filter((link) => link.href !== "/perfil" || user)
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
