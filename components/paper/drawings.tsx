/** Small things cut from coloured paper, each in a 100 × 100 box. Flat colours; the shadow comes from CSS. */

export const PaperCone = (
  <g>
    <path d="M50 8 L74 86 H26 Z" fill="#e8613f" />
    <path d="M42 34 H58 L61 46 H39 Z M36 56 H64 L67 68 H33 Z" fill="#f6efe2" />
    <rect x="14" y="84" width="72" height="10" rx="3" fill="#c44a2c" />
  </g>
);

export const PaperFlag = (
  <g>
    <rect x="16" y="6" width="5" height="90" rx="2" fill="#2a2f3d" />
    <g transform="translate(21 8)">
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2, 3, 4].map((c) => (
          <rect key={`${r}${c}`} x={c * 13} y={r * 11} width="13" height="11" fill={(r + c) % 2 ? "#16181f" : "#f6efe2"} />
        )),
      )}
    </g>
  </g>
);

export const PaperAmp = (
  <g>
    <rect x="8" y="18" width="84" height="72" rx="6" fill="#1d1f26" />
    <rect x="8" y="18" width="84" height="16" rx="6" fill="#c9b48a" />
    {[22, 34, 46, 58].map((x) => (
      <circle key={x} cx={x} cy="26" r="3.5" fill="#1d1f26" />
    ))}
    <rect x="16" y="40" width="68" height="42" rx="4" fill="#3a3d48" />
    <circle cx="50" cy="61" r="15" fill="#2a2c34" />
  </g>
);

export const PaperPick = (
  <g>
    <path d="M50 92 C34 72 14 44 18 26 C22 10 78 10 82 26 C86 44 66 72 50 92 Z" fill="#e8613f" />
    <path d="M50 78 C40 64 30 46 32 34 C34 26 66 26 68 34 C70 46 60 64 50 78 Z" fill="#f08a62" />
  </g>
);

export const PaperBeans = (
  <g>
    {[
      [30, 56, -24],
      [64, 48, 28],
      [50, 76, 8],
    ].map(([x, y, r]) => (
      <g key={`${x}${y}`} transform={`rotate(${r} ${x} ${y})`}>
        <ellipse cx={x} cy={y} rx="16" ry="21" fill="#5a3422" />
        <path d={`M${x} ${y - 18} C${x - 7} ${y - 6} ${x + 7} ${y + 6} ${x} ${y + 18}`} fill="none" stroke="#2e1a10" strokeWidth="3" />
      </g>
    ))}
  </g>
);

export const PaperChip = (
  <g>
    {[24, 38, 52, 66].map((v) => (
      <g key={v}>
        <rect x={v} y="8" width="5" height="14" fill="#b9bfca" />
        <rect x={v} y="78" width="5" height="14" fill="#b9bfca" />
        <rect x="8" y={v} width="14" height="5" fill="#b9bfca" />
        <rect x="78" y={v} width="14" height="5" fill="#b9bfca" />
      </g>
    ))}
    <rect x="20" y="20" width="60" height="60" rx="6" fill="#1d2433" />
    <rect x="34" y="34" width="32" height="32" rx="3" fill="#2c4f9e" />
  </g>
);

/** A black guitar with a white scratchplate and a maple neck, cut from paper (100 × 100 box) */
export const PaperGuitar = (
  <g className="pp-drawn">
    <g transform="rotate(-38 50 55)">
      <rect x="45" y="-46" width="10" height="72" rx="2" fill="#e9c88f" />
      <path d="M41 -62 h18 l-2 18 h-14 z" fill="#e9c88f" />
      {[-36, -26, -16, -6, 4, 14].map((y) => (
        <rect key={y} x="45" y={y} width="10" height="1.4" fill="#b8925a" />
      ))}
      <path
        d="M30 30 C22 26 20 42 25 48 C18 55 16 70 22 80 C29 93 47 98 60 93 C74 88 84 75 79 61 C77 53 73 49 77 43 C81 36 76 27 70 31 C64 35 60 37 56 31 L44 31 C40 37 36 35 30 30 Z"
        fill="#16181f"
      />
      <path d="M33 40 C29 48 31 57 33 64 C37 74 49 80 62 76 C56 70 54 60 58 50 C60 43 56 38 50 38 Z" fill="#f6f1e6" />
      {[45, 55, 65].map((y) => (
        <rect key={y} x="41" y={y} width="14" height="3" rx="1.5" fill="#cfc6b4" />
      ))}
      <rect x="39" y="75" width="18" height="5" rx="1" fill="#9aa0aa" />
    </g>
  </g>
);
