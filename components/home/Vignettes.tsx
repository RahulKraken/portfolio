/*
  Small animated drawings, one per thing built. Same rules as the rest of the art:
  outlines in the card's ink, one accent, motion in CSS only.
    .f fill ink · .a fill accent · .sa stroke accent · .flow marching dashes
    .dot rides its offset-path · .blink / .grow loop, staggered by --d
*/

const range = (n: number) => Array.from({ length: n }, (_, i) => i);
const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;
const ride = (path: string, delay: number) =>
  ({ offsetPath: `path("${path}")`, "--d": `${delay}s` }) as React.CSSProperties;

/** Calls drop from a program into the kernel; a probe on the boundary sees each one */
const Kernel = (
  <svg className="vig" viewBox="0 0 400 260">
    <rect x="30" y="24" width="340" height="70" rx="12" />
    <rect className="f" x="52" y="46" width="90" height="10" rx="5" />
    <rect className="f" x="52" y="66" width="56" height="10" rx="5" />
    <path d="M10 150 H390" strokeDasharray="2 9" />
    <rect x="30" y="176" width="340" height="60" rx="12" />
    {range(5).map((k) => (
      <rect key={k} className="f" x={52 + k * 62} y="198" width="42" height="16" rx="4" />
    ))}
    {[110, 200, 290].map((x, i) => {
      const p = `M${x} 94 V176`;
      return (
        <g key={x}>
          <path className="flow" d={p} />
          <circle className={`dot${i === 1 ? " a" : ""}`} r="7" style={ride(p, -i * 0.7)} />
        </g>
      );
    })}
    <circle className="sa blink" cx="200" cy="150" r="20" />
    <circle className="a" cx="200" cy="150" r="7" />
  </svg>
);

/** A locked pipe, with one window where the traffic can be read */
const Encrypted = (
  <svg className="vig" viewBox="0 0 400 260">
    <path d="M0 100 H400 M0 160 H400" />
    {range(9).map((k) => (
      <circle key={k} className="dot f" r="6" style={ride("M-10 130 H410", -k * 0.45)} />
    ))}
    <rect className="vig-window" x="150" y="76" width="100" height="108" rx="12" />
    {range(3).map((k) => (
      <rect key={k} className="a grow" x="166" y={104 + k * 24} width={[68, 44, 58][k]} height="9" rx="4" style={d(k * 0.3)} />
    ))}
    {[60, 340].map((x) => (
      <g key={x} transform={`translate(${x - 16} 30)`}>
        <path d="M6 18 V11 A10 10 0 0 1 26 11 V18" />
        <rect className="f" y="18" width="32" height="24" rx="5" />
      </g>
    ))}
  </svg>
);

/** A laptop, a tunnel, the outside world: every packet takes the one inspected path */
const Tunnel = (
  <svg className="vig" viewBox="0 0 400 260">
    <rect x="16" y="86" width="92" height="64" rx="8" />
    <path d="M4 164 H120" />
    <ellipse cx="170" cy="126" rx="14" ry="38" />
    <path d="M170 88 H262 M170 164 H262" />
    <ellipse className="sa" cx="262" cy="126" rx="14" ry="38" />
    <circle cx="342" cy="126" r="40" />
    <path d="M302 126 H382 M342 86 C320 110 320 142 342 166 C364 142 364 110 342 86" />
    <path className="flow" d="M108 126 H302" />
    {range(4).map((k) => (
      <circle key={k} className={`dot ${k === 2 ? "a" : "f"}`} r="6" style={ride("M108 126 H302", -k * 0.8)} />
    ))}
  </svg>
);

/** One request and everything it set off, as nested spans */
const Traces = (
  <svg className="vig" viewBox="0 0 400 260">
    {range(9).map((k) => (
      <path key={k} d={`M${20 + k * 45} 22 V34`} opacity="0.5" />
    ))}
    {[
      [20, 360],
      [44, 150],
      [70, 84],
      [200, 160],
      [226, 64],
      [300, 56],
      [120, 50],
    ].map(([x, w], k) => (
      <rect key={k} className={`grow ${k === 4 ? "a" : "f"}`} x={x} y={54 + k * 27} width={w} height="13" rx="6" style={d(k * 0.25)} />
    ))}
  </svg>
);

/** Four kinds of bad call, each lighting up in turn */
const Caught = (
  <svg className="vig" viewBox="0 0 400 260">
    {["Prompt injection", "Tool misuse", "Data exfiltration", "Excessive agency"].map((label, k) => (
      <g key={label} transform={`translate(20 ${18 + k * 58})`}>
        <rect width="360" height="44" rx="22" />
        <circle className="a blink" cx="24" cy="22" r="9" style={d(k * 0.9)} />
        <text className="vig-text" x="48" y="28">
          {label}
        </text>
      </g>
    ))}
  </svg>
);

/** One guard in the middle, ten platforms around it */
const Platforms = (
  <svg className="vig" viewBox="0 0 400 260">
    {range(10).map((k) => {
      const a = (k / 10) * Math.PI * 2 - Math.PI / 2;
      const x = (200 + Math.cos(a) * 150).toFixed(1);
      const y = (130 + Math.sin(a) * 104).toFixed(1);
      const p = `M200 130 L${x} ${y}`;
      return (
        <g key={k}>
          <path className="flow" d={p} />
          <rect x={Number(x) - 15} y={Number(y) - 15} width="30" height="30" rx="8" className="vig-node" />
          <circle className="dot f" r="5" style={ride(p, -k * 0.33)} />
        </g>
      );
    })}
    <path className="a" d="M200 92 L234 105 V134 C234 156 219 169 200 176 C181 169 166 156 166 134 V105 Z" stroke="none" />
  </svg>
);

/** Position fixes along a straight: sparse before, twice as dense after */
const LapTimer = (
  <svg className="vig" viewBox="0 0 400 260">
    <path d="M20 70 H380" />
    {range(7).map((k) => (
      <circle key={k} className="f" cx={26 + k * 58} cy="70" r="7" />
    ))}
    <path d="M20 150 H380" />
    {range(13).map((k) => (
      <circle key={k} className="a blink" cx={26 + k * 29} cy="150" r="7" style={d(k * 0.12)} />
    ))}
    <text className="vig-text" x="20" y="42">
      6.6 m
    </text>
    <text className="vig-text" x="20" y="122">
      3.3 m
    </text>
    {/* lean angle: a bar that tips over */}
    <g transform="translate(200 236)">
      <path d="M-60 0 H60" />
      <path className="sa vig-lean" d="M0 0 V-52" />
    </g>
  </svg>
);

/** A solo as a waveform, cut into phrases; one phrase lifts out */
const Solo = (
  <svg className="vig" viewBox="0 0 400 260">
    {range(36).map((k) => {
      const h = 22 + Math.abs(Math.sin(k * 0.9) * Math.cos(k * 0.23)) * 120;
      const phrase = Math.floor(k / 9);
      return (
        <rect
          key={k}
          className={`${phrase === 2 ? "a vig-lift" : "f"}`}
          x={22 + k * 10 + phrase * 6}
          y={130 - h / 2}
          width="6"
          height={h.toFixed(1)}
          rx="3"
        />
      );
    })}
    {range(3).map((k) => (
      <path key={k} d={`M${22 + (k + 1) * 96 - 5} 34 V226`} strokeDasharray="3 8" />
    ))}
  </svg>
);

/** A phone with a week of training on it */
const Coach = (
  <svg className="vig" viewBox="0 0 400 260">
    <rect x="130" y="10" width="140" height="240" rx="24" />
    <rect className="f" x="176" y="22" width="48" height="8" rx="4" />
    {range(7).map((k) => (
      <rect
        key={k}
        className={`grow-up ${k === 4 ? "a" : "f"}`}
        x={148 + k * 16}
        y={150 - [30, 52, 40, 64, 80, 36, 58][k]}
        width="9"
        height={[30, 52, 40, 64, 80, 36, 58][k]}
        rx="4"
        style={d(k * 0.12)}
      />
    ))}
    <rect x="148" y="170" width="104" height="26" rx="13" />
    <rect className="f" x="148" y="208" width="64" height="10" rx="5" />
  </svg>
);

/** A dense page on the left, the same thing in plain words on the right */
const Plain = (
  <svg className="vig" viewBox="0 0 400 260">
    <rect x="20" y="20" width="150" height="220" rx="10" />
    {range(9).map((k) => (
      <rect key={k} className="f" x="36" y={40 + k * 21} width={[118, 104, 118, 90, 118, 110, 118, 70, 100][k]} height="7" rx="3" opacity="0.55" />
    ))}
    <rect className="sa blink" x="30" y="97" width="130" height="34" rx="6" />
    <path className="flow" d="M176 114 H226" />
    <path d="M232 60 H372 A10 10 0 0 1 382 70 V150 A10 10 0 0 1 372 160 H272 L250 186 V160 H242 A10 10 0 0 1 232 150 Z" />
    {range(3).map((k) => (
      <rect key={k} className="a grow" x="250" y={82 + k * 24} width={[110, 84, 60][k]} height="10" rx="5" style={d(k * 0.3)} />
    ))}
  </svg>
);

/** A two-joint arm over a board of traces */
const Robots = (
  <svg className="vig" viewBox="0 0 400 260">
    <path d="M20 232 H380" />
    {range(5).map((k) => (
      <path key={k} d={`M${40 + k * 70} 232 V${206 - (k % 2) * 16} H${70 + k * 70}`} opacity="0.6" />
    ))}
    <rect className="f" x="60" y="206" width="70" height="26" rx="6" />
    <g className="vig-arm">
      <path d="M95 206 L150 110" strokeWidth="10" />
      <circle className="a" cx="150" cy="110" r="14" stroke="none" />
      <g className="vig-forearm">
        <path d="M150 110 L260 86" strokeWidth="10" />
        <path d="M260 86 L286 70 M260 86 L288 98" />
      </g>
    </g>
  </svg>
);

export const vignettes = {
  kernel: Kernel,
  encrypted: Encrypted,
  tunnel: Tunnel,
  traces: Traces,
  caught: Caught,
  platforms: Platforms,
  laptimer: LapTimer,
  solo: Solo,
  coach: Coach,
  plain: Plain,
  robots: Robots,
};

export type VignetteName = keyof typeof vignettes;
