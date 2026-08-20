type LapTraceProps = {
  className?: string;
  draw?: boolean;
  ghost?: boolean;
};

const LINE =
  "M 28 168 C 70 166 118 162 168 154 C 214 147 242 128 252 96 C 262 64 292 42 348 40 C 412 38 458 62 478 92 C 498 122 534 132 582 112 C 632 90 688 86 734 108 C 768 126 780 154 762 176 C 742 200 692 214 628 216 C 552 218 492 202 428 196 C 352 189 278 204 204 214 C 132 224 62 214 28 168";

const GHOST =
  "M 34 174 C 78 176 128 170 176 160 C 220 152 246 134 254 104 C 262 74 296 50 350 50 C 408 50 452 70 470 98 C 490 128 528 140 574 122 C 624 102 680 98 726 116 C 758 132 770 158 754 178 C 736 200 690 212 628 214 C 556 216 498 206 436 202 C 360 197 286 210 214 218 C 142 226 72 220 34 174";

export function LapTrace({ className, draw, ghost = true }: LapTraceProps) {
  return (
    <svg
      className={`graphic ${className ?? ""}`}
      viewBox="0 0 800 250"
      fill="none"
      aria-hidden="true"
    >
      {ghost && (
        <path
          d={GHOST}
          stroke="rgba(235,228,214,0.16)"
          strokeWidth="1.1"
        />
      )}
      <path
        className={draw ? "draw-path" : undefined}
        d={LINE}
        stroke="#d4a35a"
        strokeWidth="1.35"
        pathLength={1}
      />
    </svg>
  );
}
