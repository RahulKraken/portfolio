"use client";

import { useEffect, useRef, useState } from "react";

// Spotify's own embed, driven through its iFrame API: it plays while the guitar is open and
// pauses when the visitor leaves, the studio knows when music is playing (the ambience steps
// aside), and the corner sound button can pause it. Spotify licenses the
// playback: signed-in visitors hear full tracks, everyone else hears previews.

type Controller = {
  play: () => void;
  pause: () => void;
  resume: () => void;
  destroy: () => void;
  addListener: {
    (
      event: "playback_update",
      cb: (e: { data: { isPaused: boolean } }) => void,
    ): void;
    (event: "ready", cb: () => void): void;
  };
};
type IFrameAPI = {
  createController: (
    el: HTMLElement,
    options: { uri: string; width: string; height: number },
    cb: (controller: Controller) => void,
  ) => void;
};
declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: IFrameAPI) => void;
  }
}

let api: Promise<IFrameAPI> | null = null;
function loadApi() {
  api ??= new Promise((resolve) => {
    window.onSpotifyIframeApiReady = resolve;
    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;
    document.body.appendChild(script);
  });
  return api;
}

export type SpotifyHandle = { pause: () => void };

export function SpotifyPlayer({
  uri,
  visible,
  play,
  handle,
  onPlaying,
}: {
  uri: string;
  visible: boolean;
  /** whether it should be playing: the guitar is open and the studio isn't muted */
  play: boolean;
  handle: React.RefObject<SpotifyHandle | null>;
  onPlaying: (playing: boolean) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const report = useRef(onPlaying);
  const controller = useRef<Controller | null>(null);
  const ready = useRef(false);
  const started = useRef(false);
  const wanted = useRef(play);
  const playing = useRef(false);
  // Safari and every iPhone/iPad browser only let the embed start from a tap inside it; when
  // a requested start doesn't take, show a small hint at its play button instead
  const [blocked, setBlocked] = useState(false);
  const check = useRef<ReturnType<typeof setTimeout> | null>(null);
  // play from the start the first time, then pick up where it was paused
  const apply = useRef(() => {
    const c = controller.current;
    if (!c || !ready.current) return;
    if (!wanted.current) {
      if (started.current) c.pause();
    } else {
      if (started.current) c.resume();
      else c.play();
      started.current = true;
      if (check.current) clearTimeout(check.current);
      check.current = setTimeout(
        () => setBlocked(wanted.current && !playing.current),
        2500,
      );
    }
  });
  useEffect(() => {
    wanted.current = play;
    apply.current();
  }, [play]);
  useEffect(() => {
    report.current = onPlaying;
  }, [onPlaying]);
  useEffect(() => {
    let cancelled = false;
    // the API replaces the element it is given, so hand it a child React doesn't own
    const el = document.createElement("div");
    host.current?.appendChild(el);
    void loadApi().then((IFrameAPI) => {
      if (cancelled) return;
      IFrameAPI.createController(
        el,
        { uri, width: "100%", height: 152 },
        (c) => {
          controller.current = c;
          handle.current = { pause: () => c.pause() };
          c.addListener("ready", () => {
            ready.current = true;
            apply.current();
          });
          c.addListener("playback_update", (e) => {
            playing.current = !e.data.isPaused;
            if (playing.current) setBlocked(false);
            report.current(playing.current);
          });
        },
      );
    });
    return () => {
      cancelled = true;
      if (check.current) clearTimeout(check.current);
      controller.current?.destroy();
      controller.current = null;
      ready.current = started.current = false;
      el.remove();
      handle.current = null;
      report.current(false);
    };
  }, [uri, handle]);
  return (
    <div
      className="spotify-player"
      data-visible={visible}
      aria-hidden={!visible}
    >
      <div ref={host} />
      {blocked && visible && <p className="spotify-hint">Tap ▶ to play</p>}
    </div>
  );
}
