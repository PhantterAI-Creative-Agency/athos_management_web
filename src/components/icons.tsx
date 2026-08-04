import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps, children: React.ReactNode, viewBox = "0 0 24 24") {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

export function HomeIcon(props: IconProps) {
  return base(
    props,
    <>
      <path d="M4 11l8-7 8 7" />
      <path d="M6 9.5V20a1 1 0 001 1h10a1 1 0 001-1V9.5" />
      <path d="M9.5 21v-6h5v6" />
    </>
  );
}

export function CalendarIcon(props: IconProps) {
  return base(
    props,
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  );
}

export function UsersIcon(props: IconProps) {
  return base(
    props,
    <>
      <circle cx="9" cy="9" r="3.2" />
      <path d="M3.5 20c0-3.3 2.5-6 6-6" />
      <circle cx="17" cy="10" r="2.6" />
      <path d="M14.8 14.2c2.6.3 4.7 2.6 4.7 5.8" />
    </>
  );
}

export function BookIcon(props: IconProps) {
  return base(
    props,
    <>
      <path d="M4 5.5c2.5-1.3 5.2-1.3 8 0 2.8-1.3 5.5-1.3 8 0v13c-2.5-1.3-5.2-1.3-8 0-2.8-1.3-5.5-1.3-8 0z" />
      <path d="M12 5.5v13" />
    </>
  );
}

export function HeartIcon(props: IconProps) {
  return base(
    props,
    <path d="M12 20s-7.5-4.7-9.5-9.4C1.2 7 3 4 6.3 4c2 0 3.4 1 4.7 2.7C12.3 5 13.7 4 15.7 4 19 4 20.8 7 19.5 10.6 17.5 15.3 12 20 12 20z" />
  );
}

export function CakeIcon(props: IconProps) {
  return base(
    props,
    <>
      <rect x="4" y="10" width="16" height="10" rx="1.5" />
      <path d="M4 14h16" />
      <path d="M12 10V7M12 7c-1.4 0-2.2-1.6-1-2.6C12 3.4 12 5.5 12 7zM12 7c1.4 0 2.2-1.6 1-2.6C12 3.4 12 5.5 12 7z" />
    </>
  );
}

export function SearchIcon(props: IconProps) {
  return base(
    props,
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return base(props, <path d="M9 5l7 7-7 7" />);
}

export function IdCardIcon(props: IconProps) {
  return base(
    props,
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="12" r="2.2" />
      <path d="M13 10h5M13 14h5" />
    </>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6 4l15 8-15 8z" />
    </svg>
  );
}

export function DetailsIcon(props: IconProps) {
  return base(
    props,
    <>
      <circle cx="6" cy="12" r="2.2" />
      <circle cx="18" cy="6" r="2.2" />
      <circle cx="18" cy="18" r="2.2" />
      <path d="M8 11l8-4M8 13l8 4" />
    </>
  );
}

export function CheckinIcon(props: IconProps) {
  return base(
    props,
    <>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="3" height="3" />
      <rect x="18" y="18" width="3" height="3" />
    </>
  );
}

export function CoinIcon(props: IconProps) {
  return base(
    props,
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M15 9.5c0-1.4-1.3-2.5-3-2.5s-3 1.1-3 2.5 1.3 2 3 2.5c1.7.5 3 1.1 3 2.5s-1.3 2.5-3 2.5-3-1.1-3-2.5" />
    </>
  );
}

export function BellIcon(props: IconProps) {
  return base(
    props,
    <>
      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 01-3.4 0" />
    </>
  );
}

export function SettingsIcon(props: IconProps) {
  return base(
    props,
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </>
  );
}

export function ChatIcon(props: IconProps) {
  return base(
    props,
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
  );
}

export function MenuIcon(props: IconProps) {
  return base(props, <path d="M4 6h16M4 12h16M4 18h16" />);
}

export function SunIcon(props: IconProps) {
  return base(
    props,
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v3M12 18.5v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2.5 12h3M18.5 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </>
  );
}

export function MoonIcon(props: IconProps) {
  return base(
    props,
    <path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z" />
  );
}

export function MailIcon(props: IconProps) {
  return base(
    props,
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
    </>
  );
}

export function WhatsappIcon(props: IconProps) {
  return base(
    props,
    <>
      <path d="M6.5 17.5L4 20l2.6-2.4A8 8 0 1112 20a8 8 0 01-5.5-2.5z" />
      <path d="M9 9.7c0-.6.5-1.2 1.1-1.2.3 0 .6.2.8.5l.6 1.2c.2.4.1.9-.2 1.2l-.4.4c-.2.2-.2.5-.1.8.4.8 1.3 1.7 2.1 2.1.3.1.6.1.8-.1l.4-.4c.3-.3.8-.4 1.2-.2l1.2.6c.3.2.5.5.5.8 0 .6-.6 1.1-1.2 1.1-2.9 0-6-3.1-6-6z" />
    </>
  );
}

export function PinIcon(props: IconProps) {
  return base(
    props,
    <>
      <path d="M12 21s-6.5-5.6-6.5-10.5a6.5 6.5 0 1113 0C18.5 15.4 12 21 12 21z" />
      <circle cx="12" cy="10.5" r="2.3" />
    </>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-8.1h2.7l.4-3.2h-3.1V7.6c0-.9.3-1.6 1.6-1.6h1.7V3.1C16.5 3 15.5 3 14.3 3c-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4v3.2h2.7V21z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return base(
    props,
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </>
  );
}

export function TwitterIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21 5.9c-.7.3-1.4.5-2.2.6.8-.5 1.4-1.2 1.7-2.1-.7.4-1.5.7-2.4.9a3.7 3.7 0 00-6.4 3.4A10.6 10.6 0 013 4.9a3.7 3.7 0 001.2 5 3.7 3.7 0 01-1.7-.5v.1a3.7 3.7 0 003 3.6 3.7 3.7 0 01-1.7.1 3.7 3.7 0 003.5 2.6A7.5 7.5 0 013 17.1a10.6 10.6 0 005.7 1.7c6.9 0 10.6-5.7 10.6-10.6v-.5c.7-.5 1.4-1.2 1.7-2z" />
    </svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.9 8.6H3.7V20h3.2zM5.3 4c-1.1 0-1.9.8-1.9 1.8 0 1 .8 1.8 1.9 1.8 1.1 0 1.9-.8 1.9-1.8C7.2 4.8 6.4 4 5.3 4zM20.3 20v-6.3c0-3.4-1.8-5-4.2-5-1.9 0-2.8 1.1-3.2 1.8V8.6H9.6c0 .1 0 8.6 0 11.4h3.2v-6.4c0-.3 0-.7.1-.9.3-.7.9-1.4 2-1.4 1.4 0 2 1.1 2 2.7V20z" />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.6 7.6a2.7 2.7 0 00-1.9-1.9C18.1 5.3 12 5.3 12 5.3s-6.1 0-7.7.4A2.7 2.7 0 002.4 7.6 28 28 0 002 12a28 28 0 00.4 4.4 2.7 2.7 0 001.9 1.9c1.6.4 7.7.4 7.7.4s6.1 0 7.7-.4a2.7 2.7 0 001.9-1.9A28 28 0 0022 12a28 28 0 00-.4-4.4zM10 15V9l5.2 3z" />
    </svg>
  );
}

export function AppleMusicIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17 3.5c.1 1.2-.4 2.2-1.1 3-.7.8-1.8 1.4-2.9 1.3-.1-1.1.4-2.3 1.1-3 .7-.8 1.9-1.4 2.9-1.3zM19.8 17c-.3.7-.6 1.3-1 1.9-.6.9-1.2 1.9-2.2 1.9-.9 0-1.2-.6-2.3-.6s-1.4.6-2.3.6c-.9 0-1.6-1-2.2-1.9-1.2-1.8-2.2-5.1-.9-7.3.6-1.1 1.7-1.8 2.9-1.8 1 0 1.6.6 2.3.6.7 0 1.2-.7 2.4-.7.8 0 1.9.4 2.6 1.3-2.3 1.3-1.9 4.6.7 6z" />
    </svg>
  );
}

export function CameraIcon(props: IconProps) {
  return base(
    props,
    <>
      <path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </>
  );
}

export function SpotifyIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="12" cy="12" r="9.3" fillOpacity="0" stroke="currentColor" strokeWidth={1.6} />
      <path
        d="M6.8 9.7c3-.9 6.9-.7 9.5.9M7 12.6c2.5-.7 5.7-.5 7.9.8M7.2 15.3c2-.5 4.5-.4 6.3.7"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
