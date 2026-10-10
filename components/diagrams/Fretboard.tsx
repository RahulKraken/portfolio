export function Fretboard() {
  const strings = [28, 48, 68, 88, 108, 128];
  const frets = [80, 160, 240, 320, 400, 480, 560];

  return (
    <svg viewBox="0 0 640 170" fill="none" aria-hidden>
      <rect x="40" y="20" width="560" height="116" stroke="currentColor" strokeWidth="1.4" />
      {frets.map((x) => (
        <line
          key={x}
          x1={x}
          y1="20"
          x2={x}
          y2="136"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.55"
        />
      ))}
      {strings.map((y) => (
        <line
          key={y}
          x1="40"
          y1={y}
          x2="600"
          y2={y}
          stroke="currentColor"
          strokeWidth={y < 70 ? 1.6 : 1.1}
        />
      ))}
      <circle cx="200" cy="88" r="7" fill="currentColor" />
      <circle cx="280" cy="68" r="7" fill="currentColor" />
      <circle cx="360" cy="48" r="7" fill="currentColor" />
      <path
        data-draw
        d="M200 88 C 240 88, 250 68, 280 68 S 330 48, 360 48"
        stroke="currentColor"
        strokeWidth="2"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset="1"
      />
    </svg>
  );
}
