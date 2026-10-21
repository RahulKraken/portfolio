"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { site } from "@/lib/site";
import { roomItems, type RoomItem } from "./content";
import LaptopDesktop from "./LaptopDesktop";
import { Ambient } from "./ambient";
import { SpotifyPlayer, type SpotifyHandle } from "./SpotifyPlayer";
import { Gallery, Video, type Photo } from "./Media";
import { StudioLoader } from "./StudioLoader";

const RoomScene = dynamic(() => import("./RoomScene"), {
  ssr: false,
  loading: () => null,
});
function Arrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      <path d="M5 19 19 5M5 5h14v14" />
    </svg>
  );
}
function Sun({ night = false }: { night?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
    >
      {night ? (
        <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" />
      ) : (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5" />
        </>
      )}
    </svg>
  );
}
function Icon({ id }: { id: RoomItem }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {id === "work" || id === "projects" ? (
        <>
          <rect x="4" y="3" width="16" height="12" rx="1.5" />
          <path d="M2 19h20l-2-4H4l-2 4Z" />
          {id === "projects" ? (
            <path d="m9 7-2 2 2 2m6-4 2 2-2 2" />
          ) : (
            <path d="M9 7h6M9 10h4" />
          )}
        </>
      ) : id === "travel" || id === "track" ? (
        <>
          <circle cx="5" cy="17" r="3" />
          <circle cx="19" cy="17" r="3" />
          <path d="m5 17 5-8 5 8H5m10-13h3l2 13M8 7h4" />
          {id === "track" && <path d="M4 3h5l-1 2h3" />}
        </>
      ) : id === "music" ? (
        <>
          <path d="m14 3 3 3-6 7a4 4 0 1 1-3-3l6-7Z" />
          <path d="m6 16 10-11" />
        </>
      ) : (
        <>
          <path d="M5 8h12v8a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Zm12 1h2a3 3 0 0 1 0 6h-2M8 2v3m4-3v3" />
        </>
      )}
    </svg>
  );
}

function Speaker({ muted }: { muted: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path
        d="M3.5 8v4h3l4 3.2V4.8l-4 3.2h-3z"
        fill="currentColor"
        stroke="none"
      />
      {muted ? (
        <path d="M13.5 8l4 4m0-4l-4 4" />
      ) : (
        <path d="M13.6 7.2a4 4 0 010 5.6M15.6 5.2a7 7 0 010 9.6" />
      )}
    </svg>
  );
}
function strum() {
  const audio = new AudioContext();
  const notes = [164.81, 220, 293.66, 392, 493.88, 659.25];
  notes.forEach((freq, i) => {
    const t = audio.currentTime + i * 0.045;
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    const filter = audio.createBiquadFilter();
    oscillator.type = "triangle";
    oscillator.frequency.value = freq;
    filter.type = "lowpass";
    filter.frequency.value = 1700;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.095, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 2);
    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(audio.destination);
    oscillator.start(t);
    oscillator.stop(t + 2.1);
  });
  return audio;
}
const trackPhotos: Photo[] = Array.from({ length: 10 }, (_, i) => ({
  src: `/track/${String(i + 1).padStart(2, "0")}.jpg`,
  width: 1800,
  height: 1200,
  alt: "Rahul on the Panigale V2 S at the Madras International Circuit",
}));
const coffeePhotos: Photo[] = [
  { n: 1, w: 1200, alt: "Hario Switch on the scale, mid-brew" },
  { n: 2, w: 1350, alt: "AeroPress and the current bags of beans" },
  { n: 3, w: 1350, alt: "AeroPress brewing into a glass server" },
  { n: 4, w: 1350, alt: "Ground coffee in the AeroPress" },
  { n: 5, w: 1350, alt: "AeroPress pressing through" },
  { n: 6, w: 1350, alt: "A bag from Corridor Seven Coffee Roasters" },
].map(({ n, w, alt }) => ({
  src: `/coffee/0${n}.jpg`,
  width: w,
  height: 1800,
  alt,
}));
function PanelBody({
  id,
  playSound,
  onMedia,
}: {
  id: RoomItem;
  playSound: () => void;
  onMedia: (playing: boolean) => void;
}) {
  if (id === "track")
    return (
      <>
        <Video
          src="/track/onboard.mp4"
          poster="/track/onboard.jpg"
          label="Onboard lap at the Madras International Circuit"
          onPlaying={onMedia}
        />
        <div className="spec-line">
          <span>CIRCUIT</span>
          <strong>Madras International Circuit</strong>
          <span>SEP 2026</span>
        </div>
        <Gallery photos={trackPhotos} />
        <button
          className="room-text-link"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("room-select", { detail: "projects" }),
            )
          }
        >
          Apex One, my lap timer <Arrow />
        </button>
      </>
    );
  if (id === "travel") return null;
  if (id === "music")
    return (
      <button className="strum-button" onClick={playSound}>
        <span>▷</span> Strum the strings
      </button>
    );
  return <Gallery photos={coffeePhotos} />;
}
function ObjectInfo({ id, children }: { id: RoomItem; children: ReactNode }) {
  const item = roomItems.find((x) => x.id === id)!;
  return (
    <details className="object-info" key={id}>
      <summary>
        <Icon id={id} />
        <span>{item.object}</span>
        <span className="object-info-plus">+</span>
      </summary>
      <div className="object-info-content">
        <h2>{item.title}</h2>
        <p className="panel-intro">{item.intro}</p>
        {children}
      </div>
    </details>
  );
}
export default function RoomExperience() {
  const [selected, setSelected] = useState<RoomItem | null>(null);
  const [entered, setEntered] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewRevision, setViewRevision] = useState(0);
  const [panMode, setPanMode] = useState(false);
  const [night, setNight] = useState(false);
  const [ready, setReady] = useState(false);
  const [sceneFailed, setSceneFailed] = useState(false);
  const [reduced, setReduced] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const ambient = useRef<Ambient | null>(null);
  const [muted, setMuted] = useState(false);
  // the Spotify player loads the first time the guitar is opened and then stays, so a playlist
  // keeps going while the visitor looks around; the ambience steps aside while it plays
  const spotify = useRef<SpotifyHandle | null>(null);
  const [spotifyLoaded, setSpotifyLoaded] = useState(false);
  // anything else making sound (Spotify, the onboard video) holds the ambience off
  const holders = useRef(new Set<string>());
  const holdAmbient = useCallback((source: string, playing: boolean) => {
    if (playing) holders.current.add(source);
    else holders.current.delete(source);
    ambient.current?.hold(holders.current.size > 0);
  }, []);
  const onSpotifyPlaying = useCallback(
    (playing: boolean) => {
      if (playing) document.querySelectorAll("video").forEach((v) => v.pause());
      holdAmbient("spotify", playing);
    },
    [holdAmbient],
  );
  const onVideoPlaying = useCallback(
    (playing: boolean) => {
      // one soundtrack at a time
      if (playing) spotify.current?.pause();
      holdAmbient("video", playing);
    },
    [holdAmbient],
  );
  // ambience can only start from a gesture; the visitor's mute choice is remembered
  const startAmbient = useCallback(() => {
    if (ambient.current) return;
    let quiet = false;
    try {
      quiet = localStorage.getItem("studio-muted") === "1";
    } catch {}
    setMuted(quiet);
    ambient.current = new Ambient();
    ambient.current.hold(holders.current.size > 0);
    ambient.current.start(quiet);
  }, []);
  const toggleMute = useCallback(() => {
    const next = !muted;
    setMuted(next);
    try {
      localStorage.setItem("studio-muted", next ? "1" : "0");
    } catch {}
    // the corner button is the one switch for all sound, Spotify included
    if (next) {
      spotify.current?.pause();
      document.querySelectorAll("video").forEach((v) => v.pause());
    }
    if (ambient.current) ambient.current.setMuted(next);
    else {
      ambient.current = new Ambient();
      ambient.current.start(next);
    }
  }, [muted]);
  const soundTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // the studio is live as soon as it has loaded: no tap to enter, the controls work from the
  // first frame
  const onReady = useCallback(() => {
    setReady(true);
    setEntered(true);
  }, []);
  const onArrive = useCallback(() => setArrived(true), []);
  const onFailure = useCallback(() => {
    setSceneFailed(true);
    setReady(true);
    setEntered(true);
    setArrived(true);
    setMenuOpen(true);
  }, []);
  const toggle = useCallback(() => setNight((v) => !v), []);
  const enter = useCallback(() => {
    startAmbient();
    setArrived(false);
    setSelected(null);
    setEntered(true);
  }, [startAmbient]);
  const select = useCallback(
    (id: RoomItem) => {
      if (id === selected) return;
      startAmbient();
      setArrived(sceneFailed);
      setMenuOpen(false);
      setEntered(true);
      setSelected(id);
      if (id === "music") setSpotifyLoaded(true);
    },
    [sceneFailed, selected, startAmbient],
  );
  // clicking empty floor or background while an object is open steps back out to the room;
  // the laptops keep their own controls, since you work inside them
  const dismiss = useCallback(() => {
    if (!selected || selected === "projects" || selected === "work") return;
    setArrived(false);
    setSelected(null);
  }, [selected]);
  const back = useCallback(() => {
    setMenuOpen(false);
    if (!selected) return;
    setArrived(false);
    setSelected(null);
  }, [selected]);
  // browsers only allow sound after a gesture, so the ambience starts on the visitor's first
  // touch, click or key, whatever it is
  useEffect(() => {
    const events = ["pointerup", "touchend", "keydown"] as const;
    const start = () => {
      startAmbient();
      events.forEach((e) => window.removeEventListener(e, start));
    };
    events.forEach((e) => window.addEventListener(e, start));
    return () => events.forEach((e) => window.removeEventListener(e, start));
  }, [startAmbient]);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
      audio.current?.close();
      ambient.current?.stop();
      if (soundTimer.current) clearTimeout(soundTimer.current);
    };
  }, []);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (menuOpen) setMenuOpen(false);
        else back();
      }
    };
    const navigate = (e: Event) => {
      const id = (e as CustomEvent<RoomItem>).detail;
      if (roomItems.some((item) => item.id === id)) select(id);
    };
    window.addEventListener("keydown", key);
    window.addEventListener("room-select", navigate);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("room-select", navigate);
    };
  }, [back, menuOpen, select]);
  const playSound = () => {
    audio.current?.close();
    if (soundTimer.current) clearTimeout(soundTimer.current);
    ambient.current?.duck(2.6);
    audio.current = strum();
    soundTimer.current = setTimeout(() => audio.current?.close(), 2500);
  };
  const computer = selected === "projects" || selected === "work";
  useEffect(() => {
    if (!computer || !arrived) return;
    const frame = requestAnimationFrame(() => {
      const controls = Array.from(
        document.querySelectorAll<HTMLButtonElement>(".computer-exit"),
      );
      controls
        .find((button) => button.getClientRects().length > 0)
        ?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [computer, arrived]);
  const screenContent = computer ? (
    <LaptopDesktop work={selected === "work"} onBack={back} />
  ) : null;
  return (
    <main
      className={`room-experience quiet-studio${night ? " room-night" : ""}`}
    >
      <h1 className="sr-only">Rahul Kumar’s interactive studio</h1>
      <div
        className="room-scene"
        aria-label="Interactive studio with a desk, two laptops, motorcycles, guitar, and coffee setup."
      >
        <RoomScene
          selected={selected}
          viewRevision={viewRevision}
          panMode={panMode}
          entered={entered}
          arrived={arrived}
          night={night}
          reduced={reduced}
          onSelect={select}
          onReady={onReady}
          onFailure={onFailure}
          onDismiss={dismiss}
          onToggle={toggle}
          onArrive={onArrive}
          onEnter={enter}
          screenContent={screenContent}
        />
      </div>
      <StudioLoader ready={ready} />
      {entered && !computer && (
        <div className="studio-controls">
          <button
            onClick={back}
            aria-label="Back to the room"
            className={selected ? undefined : "is-hidden"}
            tabIndex={selected ? undefined : -1}
          >
            ←
          </button>
          <div>
            <button
              onClick={() => setViewRevision((value) => value + 1)}
              aria-label="Reset camera view"
              title="Reset camera view"
            >
              ↺
            </button>
            <button
              onClick={() => setPanMode((value) => !value)}
              aria-label={
                panMode ? "Switch to rotate mode" : "Switch to pan mode"
              }
              aria-pressed={panMode}
              title={
                panMode
                  ? "Pan: drag to move. Click to rotate."
                  : "Rotate: drag to orbit. Scroll to zoom. Right-drag to pan."
              }
            >
              {panMode ? "✥" : "⤢"}
            </button>
            <button
              onClick={toggleMute}
              aria-label={muted ? "Play ambient music" : "Mute ambient music"}
              aria-pressed={!muted}
              title={muted ? "Sound off" : "Sound on"}
            >
              <Speaker muted={muted} />
            </button>
            <button
              onClick={toggle}
              aria-label={night ? "Switch to daylight" : "Switch to night"}
              aria-pressed={night}
            >
              <Sun night={night} />
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Explore the studio"
              aria-expanded={menuOpen}
              aria-controls="studio-menu"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                {[5, 13].flatMap((x) =>
                  [5, 13].map((y) => (
                    <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" />
                  )),
                )}
              </svg>
            </button>
          </div>
        </div>
      )}
      {menuOpen && (
        <nav
          id="studio-menu"
          className="studio-menu"
          aria-label="Studio destinations"
        >
          {roomItems.map((item) => (
            <button key={item.id} onClick={() => select(item.id)}>
              <Icon id={item.id} />
              {item.label}
              <span>↗</span>
            </button>
          ))}
          <a href={`mailto:${site.email}`}>
            Contact <Arrow />
          </a>
        </nav>
      )}
      <nav
        className="studio-accessibility"
        aria-label="Accessible studio navigation"
      >
        {roomItems.map((item) => (
          <button key={item.id} onClick={() => select(item.id)}>
            {item.label}
          </button>
        ))}
      </nav>
      {computer && arrived && (
        <div
          className={`mobile-computer${sceneFailed ? " computer-fallback" : ""}`}
        >
          {screenContent}
        </div>
      )}
      {spotifyLoaded && (
        <SpotifyPlayer
          uri="spotify:playlist:37i9dQZF1DZ06evO07zaak"
          visible={selected === "music" && arrived && !menuOpen}
          handle={spotify}
          onPlaying={onSpotifyPlaying}
        />
      )}
      {selected && !computer && arrived && !menuOpen && (
        <ObjectInfo id={selected}>
          <PanelBody
            id={selected}
            playSound={playSound}
            onMedia={onVideoPlaying}
          />
        </ObjectInfo>
      )}
    </main>
  );
}
