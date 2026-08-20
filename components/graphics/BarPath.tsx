export function BarPath() {
  return (
    <svg className="graphic" viewBox="0 0 360 220" fill="none" aria-hidden="true">
      <line x1="48" y1="200" x2="312" y2="200" stroke="rgba(235,228,214,0.14)" strokeWidth="1" />
      <line x1="48" y1="200" x2="48" y2="18" stroke="rgba(235,228,214,0.14)" strokeWidth="1" />
      <path
        className="draw-path"
        d="M 176 196 C 174 170 170 150 168 128 C 166 104 172 86 180 64 C 186 48 184 32 182 22"
        stroke="#d4a35a"
        strokeWidth="1.4"
        pathLength={1}
      />
    </svg>
  );
}
