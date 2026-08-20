export function Fretboard() {
  const strings = [22, 38, 54, 70, 86, 102];
  const frets = [40, 88, 136, 184, 232, 280];
  const notes = [
    { x: 112, y: 38 },
    { x: 160, y: 54 },
    { x: 208, y: 38 },
    { x: 256, y: 22 },
  ];

  return (
    <svg className="graphic motif" viewBox="0 0 320 124" fill="none" aria-hidden="true">
      {strings.map((y) => (
        <line
          key={y}
          x1="24"
          y1={y}
          x2="300"
          y2={y}
          stroke="rgba(235,228,214,0.28)"
          strokeWidth={y === 22 || y === 102 ? 1.15 : 0.85}
        />
      ))}
      {frets.map((x) => (
        <line
          key={x}
          x1={x}
          y1="22"
          x2={x}
          y2="102"
          stroke="rgba(235,228,214,0.18)"
          strokeWidth="1"
        />
      ))}
      <line x1="24" y1="22" x2="24" y2="102" stroke="#d4a35a" strokeWidth="2.2" />
      {notes.map((n) => (
        <circle key={`${n.x}-${n.y}`} cx={n.x} cy={n.y} r="4.2" fill="#d4a35a" stroke="none" />
      ))}
    </svg>
  );
}
