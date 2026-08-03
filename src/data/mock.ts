export type EventStatus = "inscricoes" | "participando" | "participou";

export interface EventItem {
  id: string;
  title: string;
  day: string;
  month: string;
  schedule: string;
  location: string;
  price: string;
  status: EventStatus;
}

export const events: EventItem[] = [
  {
    id: "retiro-homens-2026",
    title: "Retiro de Homens 2026",
    day: "09",
    month: "Ago",
    schedule: "Sáb, 09 ago · 8h",
    location: "Sítio Vale da Bênção",
    price: "Pago · R$ 120",
    status: "inscricoes",
  },
  {
    id: "semana-da-familia",
    title: "Semana da Família",
    day: "23",
    month: "Ago",
    schedule: "Dom, 23 ago · 18h",
    location: "Templo Sede",
    price: "Gratuito",
    status: "inscricoes",
  },
  {
    id: "batismo-nas-aguas",
    title: "Batismo nas Águas",
    day: "30",
    month: "Ago",
    schedule: "Dom, 30 ago · 10h",
    location: "Templo Sede",
    price: "Gratuito",
    status: "inscricoes",
  },
];

export type MediaItem =
  | { id: string; type: "video"; category: string; title: string; youtubeId: string }
  | { id: string; type: "photo"; category: string; title: string };

export const media: MediaItem[] = [
  {
    id: "media-1",
    type: "video",
    category: "Pregação",
    title: "O Evangelho da Graça",
    youtubeId: "aRx5hpaBA-w",
  },
  {
    id: "media-2",
    type: "video",
    category: "Louvor",
    title: "Noite de Adoração — ao vivo",
    youtubeId: "5NZFgqoWMq0",
  },
  {
    id: "media-3",
    type: "video",
    category: "Ensino",
    title: "Estudo de Romanos — Aula 1",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "media-4",
    type: "photo",
    category: "Comunhão",
    title: "Café depois do culto",
  },
  {
    id: "media-5",
    type: "video",
    category: "Pregação",
    title: "A Fé que Move Montanhas",
    youtubeId: "oHg5SJYRHA0",
  },
  {
    id: "media-6",
    type: "photo",
    category: "Ação Social",
    title: "Campanha do Agasalho",
  },
  {
    id: "media-7",
    type: "video",
    category: "Louvor",
    title: "Worship Night — Intimidade",
    youtubeId: "kJQP7kiw5Fk",
  },
  {
    id: "media-8",
    type: "photo",
    category: "Evento",
    title: "Retiro de Homens 2025",
  },
  {
    id: "media-9",
    type: "video",
    category: "Ensino",
    title: "Casais em Harmonia — Workshop",
    youtubeId: "RgKAFK5djSk",
  },
  {
    id: "media-10",
    type: "photo",
    category: "Batismo",
    title: "Batismo nas Águas — Julho",
  },
];

export interface NewsItem {
  id: string;
  title: string;
  meta: string;
}

export const news: NewsItem[] = [
  {
    id: "news-1",
    title: "Escala de voluntários para o Retiro de Homens já está disponível",
    meta: "Há 2 dias · Comunicação",
  },
  {
    id: "news-2",
    title: "Campanha do Agasalho arrecada mais de 500 peças neste mês",
    meta: "Há 5 dias · Ação Social",
  },
];

export const quickAccess = [
  { id: "eventos", label: "Eventos", href: "/eventos", icon: "calendar" },
  { id: "gc", label: "GC", href: "/reuniao-nos-lares", icon: "users" },
  { id: "ensino", label: "Ensino", href: "/ensino", icon: "book" },
  { id: "ministerios", label: "Ministérios", href: "/ministerios", icon: "heart" },
  { id: "aniversariantes", label: "Aniversários", href: "/aniversariantes", icon: "cake" },
] as const;

export interface ProfileMenuLink {
  label: string;
  href: string;
}

export const profilePrincipal: ProfileMenuLink[] = [
  { label: "Eventos", href: "/eventos" },
  { label: "Ensino", href: "/ensino" },
  { label: "Grupos de Crescimento", href: "/reuniao-nos-lares" },
  { label: "Ministérios", href: "/ministerios" },
  { label: "Ofertas | Pagamentos", href: "/ofertas" },
  { label: "Aniversariantes", href: "/aniversariantes" },
];

export const profileConteudos: ProfileMenuLink[] = [
  { label: "Agenda de Eventos", href: "/eventos" },
  { label: "Notícias", href: "/noticias" },
  { label: "Mídias", href: "/midias" },
  { label: "Devocionais", href: "/devocionais" },
  { label: "Bíblia", href: "/biblia" },
];
