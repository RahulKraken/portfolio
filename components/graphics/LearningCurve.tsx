export function LearningCurve() {
  return (
    <svg className="graphic" viewBox="0 0 800 180" fill="none" aria-hidden="true">
      <line x1="8" y1="152" x2="792" y2="152" stroke="rgba(235,228,214,0.14)" strokeWidth="1" />
      <line x1="8" y1="152" x2="8" y2="16" stroke="rgba(235,228,214,0.14)" strokeWidth="1" />
      <path
        className="draw-path"
        d="M 8 148 L 318 142 C 368 140 392 136 410 118 C 440 86 470 42 792 22"
        stroke="#ebe4d6"
        strokeWidth="1.35"
        pathLength={1}
      />
      <circle cx="410" cy="118" r="3.2" fill="#d4a35a" stroke="none" />
      <text
        x="422"
        y="108"
        fill="#d4a35a"
        fontSize="11"
        fontFamily="var(--font-mono), ui-monospace, monospace"
        letterSpacing="1.6"
      >
        CLICK
      </text>
    </svg>
  );
}
