"use client";

import { useEffect, useRef } from "react";

// Spotify's own embed, driven through its iFrame API so the studio knows when music is playing
// (the ambience steps aside) and can pause it from the corner sound button. Spotify licenses the
// playback: signed-in visitors hear full tracks, everyone else hears previews.

type Controller = {
  pause: () => void;
  destroy: () => void;
  addListener: (
    event: "playback_update",
    cb: (e: { data: { isPaused: boolean } }) => void,
  ) => void;
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
  handle,
  onPlaying,
}: {
  uri: string;
  visible: boolean;
  handle: React.RefObject<SpotifyHandle | null>;
  onPlaying: (playing: boolean) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const report = useRef(onPlaying);
  useEffect(() => {
    report.current = onPlaying;
  }, [onPlaying]);
  useEffect(() => {
    let controller: Controller | null = null;
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
          controller = c;
          handle.current = { pause: () => c.pause() };
          c.addListener("playback_update", (e) =>
            report.current(!e.data.isPaused),
          );
        },
      );
    });
    return () => {
      cancelled = true;
      controller?.destroy();
      el.remove();
      handle.current = null;
      report.current(false);
    };
  }, [uri, handle]);
  return (
    <div
      ref={host}
      className="spotify-player"
      data-visible={visible}
      aria-hidden={!visible}
    />
  );
}
