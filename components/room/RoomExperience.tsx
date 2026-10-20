"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { products } from "@/lib/products";
import { craft } from "@/lib/craft";
import { site } from "@/lib/site";
import { roomItems, type RoomItem } from "./content";

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
function PanelBody({ id, playSound }: { id: RoomItem; playSound: () => void }) {
  if (id === "work")
    return (
      <>
        <p className="panel-caption">THE SPACE-GREY MACBOOK PRO</p>
        <div className="work-list">
          {craft.map((item, i) => (
            <article key={item.id}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3>{item.label}</h3>
                <p>{item.line}</p>
              </div>
            </article>
          ))}
        </div>
        <a className="room-text-link" href={`mailto:${site.email}`}>
          Let’s talk engineering <Arrow />
        </a>
      </>
    );
  if (id === "projects")
    return (
      <>
        <p className="panel-caption">THE ROSE-GOLD MACBOOK AIR</p>
        <div className="project-list">
          {products.map((p, i) => (
            <article key={p.id}>
              <div className={`project-art project-art-${i}`} aria-hidden>
                {i === 0 ? (
                  <div className="waveform">
                    {Array.from({ length: 23 }, (_, j) => (
                      <i
                        key={j}
                        style={{
                          height: 12 + Math.abs(Math.sin(j * 1.7)) * 40,
                        }}
                      />
                    ))}
                  </div>
                ) : i === 1 ? (
                  <div className="tiny-phone">
                    <i />
                    <i />
                    <i />
                  </div>
                ) : i === 2 ? (
                  <div className="telemetry">
                    <span>APEX ONE</span>
                    <svg viewBox="0 0 120 45">
                      <path d="M2 38 20 34 35 10 50 28 67 18 85 24 118 4" />
                    </svg>
                  </div>
                ) : (
                  <span className="question-mark">?</span>
                )}
              </div>
              <span className="project-status">{p.status}</span>
              <h3>{p.name}</h3>
              <p>{p.line}</p>
              {p.href && (
                <a href={p.href} target="_blank" rel="noreferrer">
                  Explore <Arrow />
                </a>
              )}
            </article>
          ))}
        </div>
      </>
    );
  if (id === "track")
    return (
      <>
        <div className="room-photo">
          <Image
            src="/photos/track-337.jpg"
            alt="Rahul riding on the racetrack"
            width={1200}
            height={800}
            sizes="(max-width: 700px) 90vw, 480px"
          />
        </div>
        <div className="spec-line">
          <span>THE BIKE</span>
          <strong>Ducati Panigale V2 S</strong>
          <span>2025</span>
        </div>
        <p className="panel-note">
          Track days, and the details that make the next lap a little better.
          That interest also finds its way into Apex One, my motorcycle
          telemetry project.
        </p>
        <button
          className="room-text-link"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("room-select", { detail: "projects" }),
            )
          }
        >
          See what I’m building <Arrow />
        </button>
      </>
    );
  if (id === "travel")
    return (
      <>
        <div className="road-card">
          <span>
            LESS SCROLLING.
            <br />
            MORE RIDING.
          </span>
          <svg viewBox="0 0 400 180" fill="none" aria-hidden>
            <path
              d="M-20 155C100 100 45 50 180 85s90-70 240-55"
              stroke="#d6ad72"
              strokeWidth="38"
            />
            <path
              d="M-20 155C100 100 45 50 180 85s90-70 240-55"
              stroke="#f7ead2"
              strokeWidth="2"
              strokeDasharray="8 8"
            />
          </svg>
          <small>A GOOD EXCUSE TO GET OUTSIDE</small>
        </div>
        <div className="spec-line">
          <span>THE BIKE</span>
          <strong>KTM Duke 390</strong>
          <span>GEN 3</span>
        </div>
        <p className="panel-note">
          Blue and orange. The Duke is the road-going half of the garage; the
          Panigale gets the track days.
        </p>
      </>
    );
  if (id === "music")
    return (
      <>
        <div className="music-card">
          <div className="record">
            <span />
          </div>
          <div>
            <span>ON REPEAT</span>
            <h3>Pink Floyd</h3>
            <p>A little room to get lost.</p>
          </div>
        </div>
        <div className="gear-list">
          <div>
            <span>GUITAR</span>
            <strong>Fender Stratocaster</strong>
            <p>Black body · maple neck</p>
          </div>
          <div>
            <span>AMPLIFIER</span>
            <strong>Boss Katana</strong>
            <p>Plug in. Stay a while.</p>
          </div>
        </div>
        <button className="strum-button" onClick={playSound}>
          <span>▷</span> Strum the strings <small>SOUND ON REQUEST</small>
        </button>
        <a
          className="room-text-link"
          href="https://open.spotify.com/search/Pink%20Floyd"
          target="_blank"
          rel="noreferrer"
        >
          Listen to Pink Floyd on Spotify <Arrow />
        </a>
      </>
    );
  return (
    <>
      <div className="coffee-illustration" aria-hidden>
        <span className="coffee-steam">∿ ∿ ∿</span>
        <div className="dripper" />
        <div className="coffee-server" />
        <div className="coffee-bag">
          <span>
            FRESH
            <br />
            PERSPECTIVE
          </span>
          <i>COFFEE BEANS</i>
        </div>
      </div>
      <div className="gear-list">
        <div>
          <span>POUR OVER / IMMERSION</span>
          <strong>Hario Switch</strong>
          <p>One dripper. A few ways to brew.</p>
        </div>
        <div>
          <span>THE OTHER REGULAR</span>
          <strong>AeroPress</strong>
          <p>A different approach to the same good ritual.</p>
        </div>
      </div>
      <p className="panel-note">The beans change. The coffee corner stays.</p>
    </>
  );
}
function Dialog({
  id,
  onClose,
  children,
}: {
  id: RoomItem;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement | null;
    dialog.showModal();
    closeRef.current?.focus();
    return () => {
      dialog.close();
      previous?.focus();
    };
  }, []);
  const item = roomItems.find((x) => x.id === id)!;
  return (
    <dialog
      ref={ref}
      className="room-dialog"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="room-panel-title"
    >
      <div className="panel-inner">
        <header className="panel-topline">
          <span>
            <Icon id={id} />
            {item.object}
          </span>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Back to the room"
          >
            ✕
          </button>
        </header>
        <div className="panel-scroll" key={id}>
          <span className="panel-eyebrow">
            A LITTLE MORE ABOUT ME / {item.label.toUpperCase()}
          </span>
          <h2 id="room-panel-title">{item.title}</h2>
          <p className="panel-intro">{item.intro}</p>
          {children}
          <footer className="panel-footer">
            One corner of my world.<span>RAHUL KUMAR</span>
          </footer>
        </div>
      </div>
    </dialog>
  );
}
export default function RoomExperience() {
  const [selected, setSelected] = useState<RoomItem | null>(null);
  const [night, setNight] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [sound, setSound] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const soundTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onReady = useCallback(() => setReady(true), []);
  const toggle = useCallback(() => setNight((v) => !v), []);
  const close = useCallback(() => setSelected(null), []);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    const select = (e: Event) => {
      const id = (e as CustomEvent<RoomItem>).detail;
      if (roomItems.some((item) => item.id === id)) setSelected(id);
    };
    window.addEventListener("room-select", select);
    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener("room-select", select);
      audio.current?.close();
      if (soundTimer.current) clearTimeout(soundTimer.current);
    };
  }, []);
  const playSound = () => {
    audio.current?.close();
    if (soundTimer.current) clearTimeout(soundTimer.current);
    audio.current = strum();
    setSound(true);
    soundTimer.current = setTimeout(() => {
      audio.current?.close();
      setSound(false);
    }, 2500);
  };
  return (
    <main className={`room-experience${night ? " room-night" : ""}`}>
      <header className="room-header">
        <Link className="room-brand" href="/" aria-label="Rahul Kumar home">
          <span className="brand-dot" />
          Rahul Kumar<span className="brand-slash">/</span>
          <span className="brand-sub">a work in progress</span>
        </Link>
        <a className="room-contact" href={`mailto:${site.email}`}>
          Say hello <Arrow />
        </a>
      </header>
      <div className="room-heading">
        <p className="room-eyebrow">
          <span />
          ENGINEERING, MUSIC & OTHER CURIOSITIES.
        </p>
        <h1>
          Make yourself
          <br />
          <em>at home.</em>
        </h1>
        <p>
          A few things I build. A few things I love.
          <br />
          Come have a look around.
        </p>
      </div>
      <div
        className="room-scene"
        aria-label="Interactive 3D studio. Use the buttons below to explore work, projects, motorcycles, music, and coffee."
      >
        <RoomScene
          selected={selected}
          night={night}
          reduced={reduced}
          onSelect={setSelected}
          onReady={onReady}
          onToggle={toggle}
        />
      </div>
      {!ready && (
        <div className="room-loading" role="status">
          <span />
          Opening the studio…
        </div>
      )}
      <aside className="room-side-note">
        <span>01 — THE STUDIO</span>
        <p>
          Usually building something.
          <br />
          Probably needs another coffee.
        </p>
      </aside>
      <div className="room-tools">
        <button
          onClick={toggle}
          aria-label={night ? "Switch to daylight" : "Switch to night"}
          aria-pressed={night}
        >
          <Sun night={night} />
          <span>{night ? "Late night" : "Daylight"}</span>
        </button>
        <span className="tools-divider" />
        <span className="sound-status">
          {sound ? "Playing a chord" : "Sound off"}
        </span>
      </div>
      <footer className="room-footer">
        <div className="explore-caption">
          <span className="explore-circle">↖</span>
          <p>
            Follow your curiosity.<span>Click an object, or start here.</span>
          </p>
        </div>
        <nav className="room-dock" aria-label="Explore the studio">
          {roomItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item.id)}
              aria-label={`Explore ${item.label}: ${item.object}`}
            >
              <Icon id={item.id} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <span className="room-edition">
          PERSONAL SPACE
          <br />
          VOL. 01 / 2026
        </span>
      </footer>
      {selected && (
        <Dialog id={selected} onClose={close}>
          <PanelBody id={selected} playSound={playSound} />
        </Dialog>
      )}
    </main>
  );
}
