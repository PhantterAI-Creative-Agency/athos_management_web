type IconProps = { className?: string };

function fa(style: "solid" | "brands" | "regular", name: string) {
  return function Icon({ className }: IconProps) {
    return <i className={`fa-${style} fa-${name}${className ? ` ${className}` : ""}`} aria-hidden="true" />;
  };
}

export const HomeIcon = fa("solid", "house");
export const CalendarIcon = fa("solid", "calendar-days");
export const UsersIcon = fa("solid", "users");
export const BookIcon = fa("solid", "book-open");
export const HeartIcon = fa("solid", "heart");
export const CakeIcon = fa("solid", "cake-candles");
export const SearchIcon = fa("solid", "magnifying-glass");
export const ChevronRightIcon = fa("solid", "chevron-right");
export const ChartIcon = fa("solid", "chart-column");
export const IdCardIcon = fa("solid", "id-card");
export const PlayIcon = fa("solid", "play");
export const PauseIcon = fa("solid", "pause");
export const RadioIcon = fa("solid", "tower-broadcast");
export const DetailsIcon = fa("solid", "share-nodes");
export const CheckinIcon = fa("solid", "qrcode");
export const CoinIcon = fa("solid", "coins");
export const MegaphoneIcon = fa("solid", "bullhorn");
export const BellIcon = fa("solid", "bell");
export const SettingsIcon = fa("solid", "gear");
export const ChatIcon = fa("solid", "comment");
export const MenuIcon = fa("solid", "bars");
export const SunIcon = fa("solid", "sun");
export const MoonIcon = fa("solid", "moon");
export const MailIcon = fa("solid", "envelope");
export const WhatsappIcon = fa("brands", "whatsapp");
export const PinIcon = fa("solid", "location-dot");
export const ClockIcon = fa("solid", "clock");
export const FacebookIcon = fa("brands", "facebook");
export const InstagramIcon = fa("brands", "instagram");
export const TwitterIcon = fa("brands", "x-twitter");
export const LinkedinIcon = fa("brands", "linkedin");
export const YoutubeIcon = fa("brands", "youtube");
export const AppleMusicIcon = fa("brands", "itunes-note");
export const CameraIcon = fa("solid", "camera");
export const SpotifyIcon = fa("brands", "spotify");
