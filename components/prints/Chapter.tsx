"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ViewTransition,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { usePrintsNav } from "@/components/prints/nav";
import { CHAPTERS } from "@/lib/chapters";
import {
  adjacentPrint,
  printById,
  printRgb,
  type PrintId,
} from "@/lib/prints";

const SWIPE_CLOSE_PX = 72;

function isInternalHref(href: string, external?: boolean) {
  return href.startsWith("/") && !external && !href.endsWith(".pdf");
}

export default function Chapter({ printId }: { printId: PrintId }) {
  const print = printById(printId)!;
  const copy = CHAPTERS[printId];
  const prev = adjacentPrint(printId, -1);
  const next = adjacentPrint(printId, 1);
  const { close, go } = usePrintsNav();
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const swipe = useRef({ x: 0, y: 0, dy: 0, active: false });
  const [shift, setShift] = useState(0);

  useEffect(() => {
    closeRef.current?.focus();
  }, [printId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      video.pause();
      return;
    }
    const play = video.play();
    if (play) play.catch(() => video.classList.add("is-failed"));
    return () => {
      video.pause();
    };
  }, [printId]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        go(next.id);
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        go(prev.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, next.id, prev.id]);

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse") return;
    const target = event.target as HTMLElement;
    if (target.closest("a, button")) return;
    swipe.current = { x: event.clientX, y: event.clientY, dy: 0, active: true };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    if (!swipe.current.active) return;
    const dy = event.clientY - swipe.current.y;
    const dx = event.clientX - swipe.current.x;
    swipe.current.dy = dy;
    if (Math.abs(dx) > Math.abs(dy) + 8) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && dy > 0) setShift(Math.min(dy, 160));
  };

  const endPointer = () => {
    if (!swipe.current.active) return;
    const { dy } = swipe.current;
    swipe.current.active = false;
    setShift(0);
    if (dy > SWIPE_CLOSE_PX) close();
  };

  return (
    <section
      className="five-chapter"
      aria-labelledby={titleId}
      style={{
        background: printRgb(print),
        transform: shift ? `translateY(${shift}px)` : undefined,
        opacity: shift ? String(1 - Math.min(0.35, shift / 400)) : undefined,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
    >
      <button
        ref={closeRef}
        type="button"
        className="five-chapter-close"
        aria-label="Close chapter"
        onClick={close}
      >
        ×
      </button>
      <button
        type="button"
        className="five-chapter-edge five-chapter-prev"
        aria-label={`Previous: ${prev.word}, ${prev.label}`}
        onClick={() => go(prev.id)}
      >
        ‹
      </button>
      <button
        type="button"
        className="five-chapter-edge five-chapter-next"
        aria-label={`Next: ${next.word}, ${next.label}`}
        onClick={() => go(next.id)}
      >
        ›
      </button>

      <div className="five-chapter-layout">
        <ViewTransition
          name={`print-${print.id}`}
          share="morph"
          default="none"
        >
          <div className="five-chapter-sheet">
            <Image
              className="five-plate"
              src={print.poster}
              alt={print.alt}
              fill
              sizes="(max-width: 600px) 70vw, 38vh"
              unoptimized
              style={{ objectFit: "cover" }}
              priority
            />
            <video
              ref={videoRef}
              className="five-video"
              muted
              loop
              playsInline
              preload="metadata"
              poster={print.poster}
              width={720}
              height={960}
              aria-hidden
              disablePictureInPicture
              onError={(event) => event.currentTarget.classList.add("is-failed")}
            >
              <source src={print.webm} type="video/webm" />
              <source src={print.mp4} type="video/mp4" />
            </video>
            <div className="five-ghost-wrap five-chapter-ink">
              <Image
                className="five-ghost"
                src={print.poster}
                alt=""
                fill
                sizes="(max-width: 600px) 70vw, 38vh"
                unoptimized
                style={{ objectFit: "cover" }}
              />
            </div>
            <div className="five-fold" />
          </div>
        </ViewTransition>

        <div className="five-chapter-copy">
          <h2 id={titleId}>{print.word}</h2>
          <p className="five-chapter-kicker">{print.label}</p>
          {copy.lines.map((line) => (
            <p key={line} className="five-chapter-body">
              {line}
            </p>
          ))}
          {copy.items.length > 0 && (
            <ul className="five-chapter-items">
              {copy.items.map((item) => {
                const body = (
                  <>
                    <b>{item.label}</b>
                    {item.detail ? <span>{item.detail}</span> : null}
                    {item.hrefLabel ? <i>{item.hrefLabel}</i> : null}
                  </>
                );
                return (
                  <li key={item.label}>
                    {item.href ? (
                      isInternalHref(item.href, item.external) ? (
                        <Link href={item.href}>{body}</Link>
                      ) : (
                        <a
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noreferrer" : undefined}
                        >
                          {body}
                        </a>
                      )
                    ) : (
                      body
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
