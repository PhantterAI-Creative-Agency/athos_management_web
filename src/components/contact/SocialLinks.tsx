import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
  YoutubeIcon,
  AppleMusicIcon,
  SpotifyIcon,
} from "@/components/icons";
import type { SocialLinkDTO, SocialPlatform } from "@/api-client/churches";

const SOCIAL_META: Record<SocialPlatform, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  facebook: { label: "Facebook", icon: FacebookIcon },
  instagram: { label: "Instagram", icon: InstagramIcon },
  twitter: { label: "Twitter", icon: TwitterIcon },
  linkedin: { label: "LinkedIn", icon: LinkedinIcon },
  youtube: { label: "YouTube", icon: YoutubeIcon },
  spotify: { label: "Spotify", icon: SpotifyIcon },
  applemusic: { label: "Apple Music", icon: AppleMusicIcon },
};

export function SocialLinks({
  links,
  className = "",
}: {
  links: SocialLinkDTO[];
  className?: string;
}) {
  if (links.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {links.map((link) => {
        const meta = SOCIAL_META[link.platform];
        if (!meta) return null;
        return (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={meta.label}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-divider text-foreground/70 transition-colors hover:border-accent hover:text-accent"
          >
            <meta.icon className="h-4 w-4" />
          </a>
        );
      })}
    </div>
  );
}
