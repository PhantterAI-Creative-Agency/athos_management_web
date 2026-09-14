"use client";

import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPublicJingles } from "@/api-client/jingles";
import { PlayIcon, PauseIcon, RadioIcon } from "@/components/icons";

const CHURCH_SLUG = process.env.NEXT_PUBLIC_CHURCH_SLUG ?? "principios-de-vida";

export function RadioPlayer() {
  const { data: jingles } = useQuery({
    queryKey: ["public-jingles", CHURCH_SLUG],
    queryFn: () => getPublicJingles(CHURCH_SLUG),
    staleTime: 5 * 60 * 1000,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const playlist = jingles ?? [];
  const currentTrack = playlist[trackIndex];

  if (!playlist.length) return null;

  function playTrack(index: number) {
    const audio = audioRef.current;
    const track = playlist[index];
    if (!audio || !track) return;
    audio.src = track.url;
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  }

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }
    playTrack(trackIndex);
  }

  function handleEnded() {
    const next = (trackIndex + 1) % playlist.length;
    setTrackIndex(next);
    playTrack(next);
  }

  function skip() {
    const next = (trackIndex + 1) % playlist.length;
    setTrackIndex(next);
    playTrack(next);
  }

  return (
    <div className="fixed bottom-32 left-4 z-50 md:bottom-20">
      <audio ref={audioRef} onEnded={handleEnded} preload="none" />
      <div
        className={`flex items-center gap-2 rounded-full border border-divider bg-background shadow-lg transition-all ${
          playing ? "px-3 py-2" : ""
        }`}
      >
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pausar rádio" : "Ouvir rádio da igreja"}
          aria-pressed={playing}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5"
        >
          {playing ? <PauseIcon className="text-base" /> : <RadioIcon className="text-base" />}
        </button>
        {playing && currentTrack && (
          <>
            <span className="max-w-32 truncate text-xs text-text-muted">{currentTrack.title}</span>
            <button
              type="button"
              onClick={skip}
              aria-label="Próxima vinheta"
              className="shrink-0 text-text-muted transition-colors hover:text-foreground"
            >
              <PlayIcon className="text-xs" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
