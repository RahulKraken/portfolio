"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type Photo = { src: string; width: number; height: number; alt: string };

/** A strip of photos that scrolls sideways inside the panel; they stay in the panel. */
export function Gallery({ photos }: { photos: Photo[] }) {
  return (
    <div className="photo-strip" tabIndex={0} aria-label="Photos">
      {photos.map((photo) => (
        <div
          key={photo.src}
          style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="240px"
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * A video that plays inside the panel only: its own play, sound and progress controls, no
 * fullscreen or picture-in-picture. It downloads once played and reports when its sound is on.
 */
export function Video({
  src,
  poster,
  label,
  onPlaying,
}: {
  src: string;
  poster: string;
  label: string;
  onPlaying: (playing: boolean) => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const report = useRef(onPlaying);
  useEffect(() => {
    report.current = onPlaying;
  }, [onPlaying]);
  useEffect(() => () => report.current(false), []);
  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };
  const update = (on: boolean) => {
    setPlaying(on);
    report.current(on && !video.current?.muted);
  };
  return (
    <div className="room-video" data-playing={playing}>
      <video
        ref={video}
        src={src}
        poster={poster}
        playsInline
        preload="none"
        disablePictureInPicture
        controlsList="nofullscreen nodownload noremoteplayback"
        aria-label={label}
        onClick={toggle}
        onPlay={() => update(true)}
        onPause={() => update(false)}
        onEnded={() => update(false)}
        onTimeUpdate={(e) =>
          setProgress(
            e.currentTarget.currentTime / (e.currentTarget.duration || 1),
          )
        }
      />
      <button
        className="room-video-play"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
      >
        {playing ? (
          <svg viewBox="0 0 20 20" aria-hidden>
            <path d="M6 4h3v12H6zM11 4h3v12h-3z" />
          </svg>
        ) : (
          <svg viewBox="0 0 20 20" aria-hidden>
            <path d="M6 3.5v13l11-6.5z" />
          </svg>
        )}
      </button>
      <button
        className="room-video-sound"
        onClick={() => {
          const v = video.current;
          if (!v) return;
          v.muted = !v.muted;
          setMuted(v.muted);
          report.current(!v.paused && !v.muted);
        }}
        aria-label={muted ? "Turn video sound on" : "Turn video sound off"}
      >
        {muted ? "Sound off" : "Sound on"}
      </button>
      <input
        className="room-video-progress"
        type="range"
        min={0}
        max={1000}
        value={Math.round(progress * 1000)}
        aria-label="Video position"
        onChange={(e) => {
          const v = video.current;
          if (v?.duration)
            v.currentTime = (+e.currentTarget.value / 1000) * v.duration;
        }}
        style={{ "--progress": `${progress * 100}%` } as React.CSSProperties}
      />
    </div>
  );
}
