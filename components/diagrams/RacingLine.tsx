export function RacingLine() {
  return (
    <svg viewBox="0 0 1200 280" fill="none" aria-hidden>
      <text
        x="118"
        y="248"
        fill="currentColor"
        opacity="0.7"
        fontFamily="ui-monospace, monospace"
        fontSize="14"
        letterSpacing="3"
      >
        START
      </text>
      <path
        data-draw
        d="M80 250 C 180 248, 220 210, 280 170 S 390 90, 470 118 S 560 210, 680 188 S 820 70, 980 92 S 1100 160, 1180 40"
        stroke="currentColor"
        strokeWidth="3"
        pathLength="1"
        strokeDasharray="1"
        strokeDashoffset="1"
        strokeLinecap="round"
      />
      <circle cx="80" cy="250" r="5" fill="currentColor" />
    </svg>
  );
}
