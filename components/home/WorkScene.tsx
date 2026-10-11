const range = (n: number) => Array.from({ length: n }, (_, i) => i);

// Wires from the agent out to its tools. Packets ride these same paths.
const wires = [
  { id: "db", d: "M300 250 C420 250 430 110 560 110" },
  { id: "web", d: "M300 250 C430 250 440 250 560 250" },
  { id: "files", d: "M300 250 C420 250 430 390 560 390" },
];
const onward = [
  { id: "db-out", d: "M700 110 C820 110 830 250 940 250" },
  { id: "web-out", d: "M700 250 H940" },
  { id: "files-out", d: "M700 390 C820 390 830 250 940 250" },
];

// A trace: one request, and the spans nested inside it
const spans = [
  { x: 0, w: 1000 },
  { x: 60, w: 380 },
  { x: 120, w: 200 },
  { x: 480, w: 420 },
  { x: 560, w: 170 },
  { x: 760, w: 110 },
];

/**
 * The day job, drawn: an agent calls its tools, packets travel the wires, and one of them
 * turns red and is stopped at the gate. Underneath, a trace fills in span by span.
 * All motion is CSS, so it costs nothing when it is off screen.
 */
export function WorkScene() {
  return (
    <svg className="work-scene" viewBox="0 0 1200 640" role="img" aria-label="A diagram of an AI agent calling tools while a gate inspects each call and blocks one">
      {/* wires */}
      {[...wires, ...onward].map((w) => (
        <path key={w.id} className="wire" d={w.d} />
      ))}

      {/* the agent */}
      <g className="node">
        <circle cx="230" cy="250" r="74" />
        <circle className="fill" cx="205" cy="238" r="9" />
        <circle className="fill" cx="255" cy="238" r="9" />
        <path d="M204 276 Q230 294 256 276" />
        <path d="M230 176 V150" />
        <circle className="fill" cx="230" cy="142" r="9" />
      </g>

      {/* its tools: a database, the web, files */}
      <g className="node">
        <rect x="560" y="60" width="140" height="100" rx="14" />
        <ellipse cx="630" cy="92" rx="34" ry="11" />
        <path d="M596 92 V128 A34 11 0 0 0 664 128 V92" />
      </g>
      <g className="node">
        <rect x="560" y="200" width="140" height="100" rx="14" />
        <circle cx="630" cy="250" r="30" />
        <path d="M600 250 H660 M630 220 C612 238 612 262 630 280 C648 262 648 238 630 220" />
      </g>
      <g className="node">
        <rect x="560" y="340" width="140" height="100" rx="14" />
        <path d="M604 366 H640 L658 384 V416 H604 Z M640 366 V384 H658" />
      </g>

      {/* the gate every call passes through */}
      <g className="gate">
        <path d="M940 176 L1010 202 V258 C1010 302 980 330 940 344 C900 330 870 302 870 258 V202 Z" />
        <path className="tick" d="M912 258 L934 280 L972 234" />
      </g>
      <path className="wire" d="M1010 250 H1200" />

      {/* packets: most go through, one is stopped */}
      {wires.map((w, i) => (
        <circle
          key={w.id}
          className="packet"
          r="9"
          style={{ offsetPath: `path("${w.d}")`, animationDelay: `${i * -1.1}s` }}
        />
      ))}
      {onward.map((w, i) => (
        <circle
          key={w.id}
          className={`packet${i === 2 ? " is-bad" : ""}`}
          r="9"
          style={{ offsetPath: `path("${w.d}")`, animationDelay: `${i * -1.1 - 1.6}s` }}
        />
      ))}
      <circle className="packet" r="9" style={{ offsetPath: 'path("M1010 250 H1200")', animationDelay: "-0.4s" }} />

      {/* the trace */}
      <g transform="translate(100 500)">
        {spans.map((s, i) => (
          <rect
            key={i}
            className={`span${i === 4 ? " is-bad" : ""}`}
            x={s.x}
            y={i * 22}
            width={s.w}
            height="12"
            rx="6"
            style={{ animationDelay: `${i * 0.35}s` }}
          />
        ))}
        {range(11).map((k) => (
          <path key={k} className="tickmark" d={`M${k * 100} -14 V-4`} />
        ))}
      </g>
    </svg>
  );
}
