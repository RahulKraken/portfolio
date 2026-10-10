type GaugeProps = {
  label: string;
};

export function Gauge({ label }: GaugeProps) {
  return (
    <div className="gauge">
      <svg viewBox="0 0 200 110" aria-hidden>
        <path
          d="M20 100 A 80 80 0 0 1 180 100"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          opacity="0.45"
        />
        <path
          d="M20 100 A 80 80 0 0 1 118 28"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <circle cx="100" cy="100" r="6" fill="currentColor" />
        <line
          x1="100"
          y1="100"
          x2="58"
          y2="42"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <div className="gauge-label">{label}</div>
    </div>
  );
}
