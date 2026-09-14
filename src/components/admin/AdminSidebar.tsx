import Link from "next/link";
import {
  BookIcon,
  CalendarIcon,
  CameraIcon,
  ChartIcon,
  ChatIcon,
  HeartIcon,
  HomeIcon,
  MegaphoneIcon,
  RadioIcon,
  SettingsIcon,
  UsersIcon,
} from "@/components/icons";

export function AdminSidebar({
  churchSlug,
  pathname,
}: {
  churchSlug: string;
  pathname: string | null;
}) {
  const base = `/admin_athos/${churchSlug}`;

  const navLinks = [
    { label: "Dashboard", href: base, icon: ChartIcon },
    { label: "Geral", href: `${base}/geral`, icon: SettingsIcon },
    { label: "Conteúdo da Home", href: `${base}/home`, icon: HomeIcon },
    { label: "Eventos", href: `${base}/eventos`, icon: CalendarIcon },
    { label: "Ministérios", href: `${base}/ministerios`, icon: UsersIcon },
    { label: "Reunião nos Lares", href: `${base}/reuniao-nos-lares`, icon: HeartIcon },
    { label: "Devocionais", href: `${base}/devocionais`, icon: BookIcon },
    { label: "Mídias", href: `${base}/midias`, icon: CameraIcon },
    { label: "Anúncios", href: `${base}/anuncios`, icon: MegaphoneIcon },
    { label: "Vinhetas", href: `${base}/vinhetas`, icon: RadioIcon },
    { label: "Acompanhamento Pastoral", href: `${base}/acompanhamento-pastoral`, icon: ChatIcon },
  ];

  return (
    <nav className="scrollbar-hide flex gap-5 overflow-x-auto whitespace-nowrap border-b border-divider px-5 py-3 md:w-56 md:flex-none md:flex-col md:gap-1 md:overflow-visible md:whitespace-normal md:border-b-0 md:border-r md:px-3 md:py-6">
      {navLinks.map(({ label, href, icon: Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-none items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] md:w-full md:rounded-xl md:px-3 md:py-2.5 md:text-sm md:font-medium md:normal-case md:tracking-normal ${
              active ? "text-foreground md:bg-accent-tint md:text-accent-tint-text" : "text-text-muted"
            }`}
          >
            <Icon className="text-base flex-none" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
