export function PlateLoading() {
  const plates = [
    { x: 118, w: 18, h: 150, label: "25" },
    { x: 140, w: 14, h: 132, label: "20" },
    { x: 158, w: 14, h: 132, label: "20" },
    { x: 176, w: 10, h: 96, label: "5" },
    { x: 430, w: 10, h: 96, label: "5" },
    { x: 444, w: 14, h: 132, label: "20" },
    { x: 462, w: 14, h: 132, label: "20" },
    { x: 480, w: 18, h: 150, label: "25" },
  ];

  return (
    <svg viewBox="0 0 640 220" fill="none" aria-hidden>
      <line
        x1="40"
        y1="110"
        x2="600"
        y2="110"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {plates.map((p) => (
        <g key={p.x}>
          <rect
            x={p.x}
            y={110 - p.h / 2}
            width={p.w}
            height={p.h}
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
            fill="color-mix(in srgb, currentColor 12%, transparent)"
          />
        </g>
      ))}
      <text
        x="320"
        y="200"
        textAnchor="middle"
        fill="currentColor"
        fontFamily="ui-monospace, monospace"
        fontSize="12"
        letterSpacing="2"
        opacity="0.75"
      >
        20 KG BAR + 70 / SIDE = 160
      </text>
      <path
        data-draw
        d="M70 110 H 570"
        stroke="currentColor"
        strokeWidth="1.5"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset="1"
        opacity="0.4"
      />
    </svg>
  );
}
