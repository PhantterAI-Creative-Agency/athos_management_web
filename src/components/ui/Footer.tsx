import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
  YoutubeIcon,
  AppleMusicIcon,
  SpotifyIcon,
} from "@/components/icons";

type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };
type FooterSocialLink = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const footerAbout = {
  title: "Sobre",
  text: "A missão de Princípios de Vida é o reavivamento — a expansão pessoal, regional e global do reino de Deus por meio de Sua presença manifesta.",
};

const footerColumns: FooterColumn[] = [
  {
    title: "Conectar",
    links: [
      { label: "Fins de Semana", href: "/eventos" },
      { label: "Envolva-se", href: "/ministerios" },
      { label: "Calendário", href: "/eventos" },
      { label: "Eventos em destaque", href: "/eventos" },
      { label: "Escolas", href: "#" },
      { label: "Contate-nos", href: "/contato" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Athos Online", href: "#" },
      { label: "Música", href: "#" },
      { label: "Aconselhamento", href: "#" },
      { label: "Rede de Líderes", href: "#" },
      { label: "Podcasts", href: "#" },
      { label: "Loja", href: "#" },
    ],
  },
  {
    title: "Mais",
    links: [
      { label: "Dar", href: "#" },
      { label: "Carreiras", href: "#" },
      { label: "Notícias", href: "#" },
      { label: "Privacidade", href: "#" },
      { label: "Termos de Serviço", href: "/termos-de-servico" },
      { label: "Exclusão de Dados", href: "/exclusao-de-dados" },
    ],
  },
];

const footerSocialLinks: FooterSocialLink[] = [
  { label: "Facebook", href: "#", icon: FacebookIcon },
  { label: "Instagram", href: "#", icon: InstagramIcon },
  { label: "Twitter", href: "#", icon: TwitterIcon },
  { label: "LinkedIn", href: "#", icon: LinkedinIcon },
  { label: "YouTube", href: "#", icon: YoutubeIcon },
  { label: "Apple Music", href: "#", icon: AppleMusicIcon },
  { label: "Spotify", href: "#", icon: SpotifyIcon },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#141414] text-white/70">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-12 md:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="label-caps mb-4 text-white/90">{footerAbout.title}</p>
            <p className="text-sm leading-relaxed text-white/60">{footerAbout.text}</p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="label-caps mb-4 text-white/90">{column.title}</p>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-white/60 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="label-caps mb-4 text-white/90">Social</p>
            <ul className="flex flex-col gap-3">
              {footerSocialLinks.map((social) => (
                <li key={social.label}>
                  <Link
                    href={social.href}
                    className="flex items-center gap-2.5 text-sm text-white/60 hover:text-white"
                  >
                    <social.icon className="h-4 w-4" />
                    {social.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-white/40">
            © 2022 - {year} Princípios de Vida. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
