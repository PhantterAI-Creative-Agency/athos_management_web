export function YouTubeEmbed({
  youtubeId,
  title,
  className = "",
}: {
  youtubeId: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-surface ${className}`}>
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
