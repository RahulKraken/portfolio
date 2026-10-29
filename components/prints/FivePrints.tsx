"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ViewTransition,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { Ambient } from "@/components/room/ambient";
import { PrintsNavContext } from "@/components/prints/nav";
import {
  LAST_PRINT,
  PRINTS,
  PRINT_COUNT,
  printFromPath,
  printFromQuery,
  printIndex,
  printRgb,
  type Print,
  type PrintId,
} from "@/lib/prints";
import { site, socials } from "@/lib/site";

const FOLLOW = 0.08;
const DRAG_FOLLOW = 0.35;
const VEL_SMOOTH = 0.2;
const INK_STIFF = 0.2;
const INK_DAMP = 0.78;
const WHEEL_SCALE = 600;
const COAST_S = 0.28;
const IDLE_SNAP_MS = 160;
const DRAG_CLICK_PX = 8;
const POS_KEY = "five-prints-pos";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function sheetWidth(mobile: boolean, width: number, height: number) {
  return mobile
    ? Math.min(width * 0.78, 330)
    : Math.min(height * 0.56, 440);
}

function subscribeMuted(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("studio-muted", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("studio-muted", onStoreChange);
  };
}

function getMuted() {
  try {
    return localStorage.getItem("studio-muted") === "1";
  } catch {
    return false;
  }
}

function Speaker({ muted }: { muted: boolean }) {
  return (
    <svg
      width="14"
      height="14"
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
        <path d="M13.6 7.2a4 4 0 010 5.6" />
      )}
    </svg>
  );
}

type Sim = {
  pos: number;
  vel: number;
  target: number;
  inkX: number;
  inkY: number;
  inkVX: number;
  inkVY: number;
  dragging: boolean;
  moved: boolean;
  lastX: number;
  lastT: number;
  dragVel: number;
  dragFrom: number;
  hold: boolean;
  reduced: boolean;
  W: number;
  mobile: boolean;
  gap: number;
  locked: boolean;
};

export default function FivePrints({ children }: { children?: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const chapter = printFromPath(pathname);
  const rootRef = useRef<HTMLElement>(null);
  const labelWordRef = useRef<HTMLElement>(null);
  const labelSubRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const printsRef = useRef<Array<HTMLElement | null>>([]);
  const videosRef = useRef<Array<HTMLVideoElement | null>>([]);
  const ghostsRef = useRef<Array<HTMLElement | null>>([]);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const menuOpenRef = useRef(false);
  const armedRef = useRef(PRINTS.map(() => false));
  const chapterIdRef = useRef<PrintId | null>(chapter?.id ?? null);
  const fromRow = useRef(false);
  const ambient = useRef<Ambient | null>(null);
  const sim = useRef<Sim>({
    pos: 0,
    vel: 0,
    target: 0,
    inkX: 0,
    inkY: 0,
    inkVX: 0,
    inkVY: 0,
    dragging: false,
    moved: false,
    lastX: 0,
    lastT: 0,
    dragVel: 0,
    dragFrom: 0,
    hold: false,
    reduced: false,
    W: 440,
    mobile: false,
    gap: 440 * 1.18,
    locked: Boolean(chapter),
  });
  const snapTimer = useRef<number>(0);
  const menuId = useId();

  const muted = useSyncExternalStore(subscribeMuted, getMuted, () => false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [armed, setArmed] = useState(() => PRINTS.map(() => false));

  useEffect(() => {
    chapterIdRef.current = chapter?.id ?? null;
  }, [chapter]);

  useEffect(() => {
    menuOpenRef.current = menuOpen;
  }, [menuOpen]);

  const layout = useCallback(() => {
    const s = sim.current;
    const root = rootRef.current;
    if (!root) return;
    const mobile = window.innerWidth < 600;
    const W = sheetWidth(mobile, window.innerWidth, window.innerHeight);
    s.mobile = mobile;
    s.W = W;
    s.gap = mobile ? W * 1.08 : W * 1.18;
    root.style.setProperty("--w", `${W}px`);
    root.style.setProperty("--gap", `${s.gap}px`);
    const H = W * (4 / 3);
    const labelTop = window.innerHeight * 0.47 + H / 2 + (mobile ? 28 : 30);
    const dotsTop = window.innerHeight * 0.47 + H / 2 + (mobile ? 100 : 104);
    if (labelRef.current) labelRef.current.style.top = `${labelTop}px`;
    if (dotsRef.current) dotsRef.current.style.top = `${dotsTop}px`;
  }, []);

  const paintGround = useCallback((print: Print) => {
    const rgb = printRgb(print);
    rootRef.current?.style.setProperty("--g", rgb);
    document.documentElement.style.background = rgb;
    document.body.style.background = rgb;
  }, []);

  const snapTo = useCallback(
    (print: Print, lock: boolean) => {
      const index = printIndex(print.id);
      const s = sim.current;
      s.target = index;
      s.pos = index;
      s.vel = 0;
      s.inkX = s.inkY = s.inkVX = s.inkVY = 0;
      s.locked = lock;
      paintGround(print);
    },
    [paintGround],
  );

  const goTo = useCallback((index: number, snap = true) => {
    const s = sim.current;
    s.target = clamp(index, 0, LAST_PRINT);
    if (snap) s.target = Math.round(s.target);
  }, []);

  const open = useCallback(
    (id: PrintId) => {
      const print = PRINTS[printIndex(id)];
      fromRow.current = true;
      returnFocusRef.current = printsRef.current[printIndex(id)];
      setMenuOpen(false);
      snapTo(print, true);
      router.push(`/${id}`, { scroll: false });
    },
    [router, snapTo],
  );

  const close = useCallback(() => {
    setMenuOpen(false);
    sim.current.locked = false;
    if (fromRow.current) {
      fromRow.current = false;
      router.back();
      return;
    }
    router.replace("/", { scroll: false });
  }, [router]);

  const go = useCallback(
    (id: PrintId) => {
      const print = PRINTS[printIndex(id)];
      setMenuOpen(false);
      snapTo(print, true);
      router.replace(`/${id}`, { scroll: false });
    },
    [router, snapTo],
  );

  const nav = useMemo(() => ({ open, close, go }), [open, close, go]);

  const onPrintClick = useCallback(
    (index: number) => {
      if (sim.current.moved || chapter) return;
      const nearest = Math.round(clamp(sim.current.pos, 0, LAST_PRINT));
      if (index === nearest && Math.abs(sim.current.pos - index) < 0.4) {
        open(PRINTS[index].id);
      } else {
        goTo(index);
      }
    },
    [chapter, goTo, open],
  );

  const toggleMute = useCallback(() => {
    const next = !getMuted();
    try {
      localStorage.setItem("studio-muted", next ? "1" : "0");
    } catch {}
    window.dispatchEvent(new Event("studio-muted"));
    if (!ambient.current) {
      ambient.current = new Ambient();
      ambient.current.start(next);
    } else {
      ambient.current.setMuted(next);
    }
  }, []);

  useEffect(() => {
    const s = sim.current;
    const params = new URLSearchParams(window.location.search);
    const queryPrint = printFromQuery(params.get("p"));
    if (!chapter && queryPrint) {
      router.replace(`/${queryPrint.id}`, { scroll: false });
    }
    let start = chapter ? printIndex(chapter.id) : 0;
    if (!chapter && !queryPrint) {
      try {
        const saved = sessionStorage.getItem(POS_KEY);
        if (saved != null) start = clamp(parseFloat(saved) || 0, 0, LAST_PRINT);
      } catch {}
    }
    s.pos = start;
    s.target = start;
    s.vel = clamp(parseFloat(params.get("v") || "0") || 0, -1, 1);
    s.hold = params.has("hold");
    s.locked = Boolean(chapter);
    try {
      s.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {}
    if (s.reduced) rootRef.current?.classList.add("is-reduced");
    layout();
    const print = PRINTS[Math.round(start)];
    paintGround(print);
    rootRef.current?.style.setProperty("--pos", String(s.pos));

    let raf = 0;
    let lastIndex = -1;
    let lastPlay = -1;

    const armNear = (center: number) => {
      if (s.reduced) return;
      let changed = false;
      const next = armedRef.current.map((on, i) => {
        if (Math.abs(i - center) <= 1 && !on) {
          changed = true;
          return true;
        }
        return on;
      });
      if (changed) {
        armedRef.current = next;
        setArmed(next);
      }
    };

    const syncPlayback = (center: number) => {
      videosRef.current.forEach((v, i) => {
        if (!v) return;
        const near =
          !s.reduced &&
          !chapterIdRef.current &&
          Math.abs(i - center) <= 1;
        if (!near) {
          if (!v.paused) v.pause();
          return;
        }
        v.muted = true;
        v.defaultMuted = true;
        v.playsInline = true;
        v.setAttribute("playsinline", "true");
        v.setAttribute("webkit-playsinline", "true");
        if (v.readyState >= 2) {
          const playing = v.play();
          if (playing) playing.catch(() => v.classList.add("is-failed"));
        }
      });
    };

    const render = (pos: number, vel: number) => {
      const reduced = s.reduced;
      const gap = s.gap;
      const openId = chapterIdRef.current;
      PRINTS.forEach((_, i) => {
        const el = printsRef.current[i];
        const ghost = ghostsRef.current[i];
        if (!el) return;
        const d = i - pos;
        const ad = Math.abs(d);
        const centred = !openId && i === Math.round(clamp(pos, 0, LAST_PRINT)) && ad < 0.4;
        el.classList.toggle("is-openable", centred);
        el.classList.toggle("is-in-chapter", openId === PRINTS[i].id);
        if (reduced) {
          el.style.transform = "translate(-50%, -50%)";
          el.style.opacity = openId === PRINTS[i].id ? "0" : String(Math.max(0, 1 - ad));
          el.style.zIndex = String(100 - Math.round(ad * 10));
          if (ghost) {
            ghost.style.opacity = "0";
            ghost.style.transform = "";
          }
          return;
        }
        const scale = 1 - Math.min(ad, 2) * 0.16;
        const ry = -d * 14 + vel * -22;
        const sk = vel * 6;
        const y = ad * 18 + Math.sin((i + pos) * 1.3) * vel * 10;
        el.style.transform = `translate(-50%,-50%) translateX(${d * gap}px) translateY(${y}px) rotateY(${ry}deg) skewY(${sk}deg) scale(${scale})`;
        el.style.zIndex = String(100 - Math.round(ad * 10));
        el.style.opacity = openId === PRINTS[i].id ? "0" : ad > 2.6 ? "0" : "1";
        if (ghost) {
          const drift = Math.max(Math.abs(vel), Math.abs(s.inkX) / 14);
          ghost.style.opacity = String(Math.min(0.75, drift * 1.6));
          ghost.style.transform = `translate(${s.inkX}px,${s.inkY}px)`;
        }
      });

      const i0 = Math.floor(clamp(pos, 0, LAST_PRINT - 0.001));
      const f = clamp(pos - i0, 0, 1);
      const a = PRINTS[i0].color;
      const b = PRINTS[Math.min(LAST_PRINT, i0 + 1)].color;
      const rgb = a.map((v, k) => Math.round(lerp(v, b[k], f))).join(",");
      if (!openId) {
        const ground = `rgb(${rgb})`;
        rootRef.current?.style.setProperty("--g", ground);
        document.documentElement.style.background = ground;
        document.body.style.background = ground;
      }
      rootRef.current?.style.setProperty("--pos", String(pos));

      const c = Math.round(clamp(pos, 0, LAST_PRINT));
      const print = PRINTS[c];
      const ink = print.id === "coffee" ? "dark" : "light";
      if (rootRef.current?.dataset.ink !== ink) {
        rootRef.current?.setAttribute("data-ink", ink);
      }
      if (labelWordRef.current) labelWordRef.current.textContent = print.word;
      if (labelSubRef.current) labelSubRef.current.textContent = print.label;
      if (labelRef.current) {
        labelRef.current.style.opacity = openId
          ? "0"
          : String(1 - Math.min(1, Math.abs(pos - c) * 3));
      }
      dotsRef.current?.querySelectorAll("button").forEach((dot, k) => {
        dot.classList.toggle("on", k === c);
        dot.setAttribute("aria-current", k === c ? "true" : "false");
      });
      if (c !== lastIndex && liveRef.current) {
        liveRef.current.textContent = `${print.word}, ${print.label}`;
        lastIndex = c;
        try {
          sessionStorage.setItem(POS_KEY, String(c));
        } catch {}
      }
      if (c !== lastPlay) {
        lastPlay = c;
        armNear(c);
        syncPlayback(c);
      }
    };

    const loop = () => {
      if (!s.hold) {
        if (s.locked) {
          s.pos = s.target;
          s.vel = 0;
          s.inkX = s.inkY = s.inkVX = s.inkVY = 0;
        } else {
          const follow = s.dragging ? DRAG_FOLLOW : FOLLOW;
          const np = lerp(s.pos, s.target, follow);
          const instant = (np - s.pos) * 8;
          s.vel = lerp(s.vel, s.dragging ? s.dragVel / 8 : instant, VEL_SMOOTH);
          s.pos = np;
        }
        const shownVel = clamp(s.vel, -1, 1);
        if (!s.reduced && !s.locked) {
          const tx = shownVel * 14;
          const ty = shownVel * -5;
          s.inkVX += (tx - s.inkX) * INK_STIFF;
          s.inkVY += (ty - s.inkY) * INK_STIFF;
          s.inkVX *= INK_DAMP;
          s.inkVY *= INK_DAMP;
          s.inkX += s.inkVX;
          s.inkY += s.inkVY;
        } else if (s.reduced || s.locked) {
          s.inkX = s.inkY = s.inkVX = s.inkVY = 0;
        }
        render(s.pos, shownVel);
      } else {
        s.inkX = s.vel * 14;
        s.inkY = s.vel * -5;
        render(s.pos, clamp(s.vel, -1, 1));
      }
      raf = requestAnimationFrame(loop);
    };
    render(s.pos, clamp(s.vel, -1, 1));
    raf = requestAnimationFrame(loop);

    const onWheel = (e: WheelEvent) => {
      if (s.locked || s.hold) return;
      e.preventDefault();
      const raw = e.deltaY + e.deltaX;
      const pixels =
        e.deltaMode === 1 ? raw * 16 : e.deltaMode === 2 ? raw * window.innerHeight : raw;
      s.target = clamp(s.target + pixels / WHEEL_SCALE, 0, LAST_PRINT);
      window.clearTimeout(snapTimer.current);
      snapTimer.current = window.setTimeout(() => {
        s.target = clamp(Math.round(s.target), 0, LAST_PRINT);
      }, IDLE_SNAP_MS);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (menuOpenRef.current) {
          e.preventDefault();
          setMenuOpen(false);
          return;
        }
        if (chapterIdRef.current) {
          e.preventDefault();
          close();
        }
        return;
      }
      if (s.locked || s.hold) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goTo(Math.round(s.target) + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goTo(Math.round(s.target) - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(LAST_PRINT);
      }
    };

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => {
      s.reduced = media.matches;
      rootRef.current?.classList.toggle("is-reduced", s.reduced);
      const c = Math.round(clamp(s.pos, 0, LAST_PRINT));
      lastPlay = -1;
      if (s.reduced) {
        videosRef.current.forEach((v) => v?.pause());
      } else {
        armNear(c);
        syncPlayback(c);
      }
    };
    const onVisible = () => {
      const c = Math.round(clamp(s.pos, 0, LAST_PRINT));
      if (document.hidden) {
        videosRef.current.forEach((v) => v?.pause());
      } else {
        syncPlayback(c);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", layout);
    document.addEventListener("visibilitychange", onVisible);
    media.addEventListener("change", onMotion);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(snapTimer.current);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", layout);
      document.removeEventListener("visibilitychange", onVisible);
      media.removeEventListener("change", onMotion);
      ambient.current?.stop();
      document.documentElement.style.background = "";
      document.body.style.background = "";
    };
    // Mount once for the persistent layout. Path-driven snaps live in a later effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goTo, layout, paintGround, router, close]);

  useEffect(() => {
    videosRef.current.forEach((v, i) => {
      if (!v || !armed[i] || v.dataset.ready === "1") return;
      v.dataset.ready = "1";
      v.muted = true;
      v.defaultMuted = true;
      v.playsInline = true;
      v.setAttribute("webkit-playsinline", "true");
      v.load();
    });
  }, [armed]);

  useEffect(() => {
    if (chapter) {
      snapTo(chapter, true);
      return;
    }
    sim.current.locked = false;
    const restore = returnFocusRef.current;
    returnFocusRef.current = null;
    restore?.focus?.();
  }, [chapter, snapTo]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const onPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    if (sim.current.locked || sim.current.hold) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest("button, a, .five-menu, .five-chapter, .five-dots")) return;
    const s = sim.current;
    s.dragging = true;
    s.moved = false;
    s.lastX = e.clientX;
    s.lastT = e.timeStamp;
    s.dragVel = 0;
    s.dragFrom = s.pos;
    rootRef.current?.classList.add("is-dragging");
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    const s = sim.current;
    if (!s.dragging) return;
    const dx = e.clientX - s.lastX;
    const dt = Math.max(1, e.timeStamp - s.lastT);
    if (Math.abs(dx) > DRAG_CLICK_PX) s.moved = true;
    const dPos = -dx / s.gap;
    s.target = clamp(s.target + dPos, 0, LAST_PRINT);
    s.dragVel = dPos / (dt / 1000);
    s.lastX = e.clientX;
    s.lastT = e.timeStamp;
  };

  const endPointer = (e: ReactPointerEvent<HTMLElement>) => {
    const s = sim.current;
    if (!s.dragging) return;
    s.dragging = false;
    rootRef.current?.classList.remove("is-dragging");
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    if (!s.moved) {
      s.dragVel = 0;
      const dx = e.clientX - window.innerWidth / 2;
      const index = clamp(Math.round(s.pos + dx / s.gap), 0, LAST_PRINT);
      onPrintClick(index);
      return;
    }
    const projected = s.target + s.dragVel * COAST_S;
    const origin = Math.round(s.dragFrom);
    s.target = clamp(
      Math.round(projected),
      Math.max(0, origin - 1),
      Math.min(LAST_PRINT, origin + 1),
    );
    s.dragVel = 0;
  };

  const onPrintKey = (index: number, event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    sim.current.moved = false;
    onPrintClick(index);
  };

  return (
    <PrintsNavContext.Provider value={nav}>
      <main
        ref={rootRef}
        className={`five-prints${chapter ? " is-chapter" : ""}`}
        aria-label="Five prints"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
      >
        <h1 className="sr-only">Rahul Kumar</h1>
        <div ref={liveRef} className="sr-only" aria-live="polite" />

        <div className="five-stage" inert={chapter ? true : undefined}>
          {PRINTS.map((print, i) => {
            const sheet = (
              <div className="five-sheet">
                {i === 0 || armed[i] ? (
                  <Image
                    className="five-plate"
                    src={print.poster}
                    alt=""
                    fill
                    sizes="(max-width: 600px) 78vw, 440px"
                    preload={i === 0}
                    loading={i === 0 ? "eager" : "lazy"}
                    unoptimized
                    style={{ objectFit: "cover" }}
                    draggable={false}
                  />
                ) : null}
                <video
                  ref={(node) => {
                    videosRef.current[i] = node;
                  }}
                  className="five-video"
                  muted
                  loop
                  playsInline
                  preload={armed[i] ? "metadata" : "none"}
                  poster={i === 0 || armed[i] ? print.poster : undefined}
                  width={720}
                  height={960}
                  aria-hidden
                  disablePictureInPicture
                  onError={(e) => e.currentTarget.classList.add("is-failed")}
                  onCanPlay={(e) => {
                    const v = e.currentTarget;
                    v.muted = true;
                    v.playsInline = true;
                    const center = Math.round(
                      clamp(sim.current.pos, 0, LAST_PRINT),
                    );
                    if (
                      !sim.current.reduced &&
                      !chapterIdRef.current &&
                      Math.abs(i - center) <= 1
                    ) {
                      void v.play().catch(() => v.classList.add("is-failed"));
                    }
                  }}
                >
                  {armed[i] ? (
                    <>
                      <source src={print.webm} type="video/webm" />
                      <source src={print.mp4} type="video/mp4" />
                    </>
                  ) : null}
                </video>
                <div
                  className="five-ghost-wrap"
                  ref={(node) => {
                    ghostsRef.current[i] = node;
                  }}
                >
                  {i === 0 || armed[i] ? (
                    <Image
                      className="five-ghost"
                      src={print.poster}
                      alt=""
                      fill
                      sizes="(max-width: 600px) 78vw, 440px"
                      unoptimized
                      style={{ objectFit: "cover" }}
                      draggable={false}
                    />
                  ) : null}
                </div>
                <div className="five-ghost-hover" aria-hidden>
                  {i === 0 || armed[i] ? (
                    <Image
                      className="five-ghost"
                      src={print.poster}
                      alt=""
                      fill
                      sizes="(max-width: 600px) 78vw, 440px"
                      unoptimized
                      style={{ objectFit: "cover" }}
                      draggable={false}
                    />
                  ) : null}
                </div>
                <div className="five-fold" />
              </div>
            );
            return (
              <div
                key={print.id}
                ref={(node) => {
                  printsRef.current[i] = node;
                }}
                className="five-print"
                style={{ "--i": i } as React.CSSProperties}
                data-index={i}
                role="button"
                tabIndex={chapter ? -1 : 0}
                aria-label={`Open ${print.label}: ${print.alt}`}
                onKeyDown={(event) => onPrintKey(i, event)}
              >
                {chapter?.id === print.id ? (
                  sheet
                ) : (
                  <ViewTransition
                    name={`print-${print.id}`}
                    share="morph"
                    default="none"
                  >
                    {sheet}
                  </ViewTransition>
                )}
              </div>
            );
          })}
        </div>

        <header className="five-chrome five-top">
          {chapter ? (
            <button
              type="button"
              className="five-sig"
              onClick={close}
              aria-label={`${site.name}, close chapter`}
            >
              {site.name}
            </button>
          ) : (
            <p className="five-sig">{site.name}</p>
          )}
          <div className="five-ctl">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              aria-pressed={!muted}
            >
              <Speaker muted={muted} />
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={menuOpen}
              aria-controls={menuId}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                <path
                  d="M2 3.5h10M2 7h10M2 10.5h10"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </header>

        {menuOpen && (
          <nav id={menuId} className="five-menu" aria-label="Prints and pages">
            {PRINTS.map((print) => (
              <Link
                key={print.id}
                href={`/${print.id}`}
                aria-current={chapter?.id === print.id ? "page" : undefined}
                onClick={() => {
                  snapTo(print, true);
                  setMenuOpen(false);
                }}
              >
                <i>{print.word}</i>
                <span>{print.label}</span>
              </Link>
            ))}
            <Link href="/room" onClick={() => setMenuOpen(false)}>
              <i>studio</i>
              <span>room</span>
            </Link>
            <a href="/cv.pdf" onClick={() => setMenuOpen(false)}>
              <i>cv</i>
              <span>pdf</span>
            </a>
            <a href={`mailto:${site.email}`} onClick={() => setMenuOpen(false)}>
              <i>write</i>
              <span>mail</span>
            </a>
          </nav>
        )}

        <div ref={labelRef} className="five-label" aria-hidden>
          <b ref={labelWordRef}>{PRINTS[0].word}</b>
          <i ref={labelSubRef}>{PRINTS[0].label}</i>
        </div>

        <div
          ref={dotsRef}
          className="five-dots"
          role="group"
          aria-label="Five prints"
          hidden={Boolean(chapter)}
        >
          {PRINTS.map((print, i) => (
            <button
              key={print.id}
              type="button"
              className={i === 0 ? "on" : undefined}
              aria-label={`${print.word}, ${print.label}`}
              aria-current={i === 0 ? "true" : "false"}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <footer className="five-chrome five-bottom">
          <div className="five-hint">{chapter ? "" : "scroll ↓"}</div>
          <div className="five-soc">
            {socials.map((social) => (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noreferrer"
              >
                {social.label}
              </a>
            ))}
          </div>
        </footer>

        {children}

        <div className="five-grain" aria-hidden />

        <span className="sr-only">{PRINT_COUNT} equal prints</span>
      </main>
    </PrintsNavContext.Provider>
  );
}
