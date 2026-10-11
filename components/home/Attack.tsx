"use client";

import { useRef, useState } from "react";

// The three wires that lead into the gate
const ROUTES = ["M700 110 C820 110 830 250 940 250", "M700 250 H940", "M700 390 C820 390 830 250 940 250"];

/** Wraps the work diagram: every click sends a bad packet down a wire, and the gate stops it. */
export function Attack({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [stopped, setStopped] = useState(0);

  function fire() {
    const svg = ref.current?.querySelector("svg");
    if (!svg) return;
    const packet = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    packet.setAttribute("r", "9");
    packet.setAttribute("class", "packet is-shot");
    packet.style.offsetPath = `path("${ROUTES[stopped % ROUTES.length]}")`;
    packet.addEventListener("animationend", () => {
      packet.remove();
      setStopped((n) => n + 1);
    });
    svg.appendChild(packet);
  }

  return (
    <div className="attack" ref={ref}>
      <button type="button" className="attack-hit" onClick={fire} data-cursor="aim" aria-label="Send a bad request at the agent">
        {children}
      </button>
      <span className="attack-count">
        Stopped <b>{String(stopped).padStart(2, "0")}</b>
      </span>
    </div>
  );
}
