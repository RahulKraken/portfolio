/** Thin wandering lines, like a contour map, behind the pale sections. Drawn from a formula so every load matches. */
export function Contours({ seed = 1 }: { seed?: number }) {
  const lines = Array.from({ length: 7 }, (_, k) => {
    const cx = 200 + ((k * 397 * seed) % 1200);
    const cy = 150 + ((k * 211 * seed) % 600);
    const points = Array.from({ length: 13 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      const r = 180 + k * 46 + Math.sin(a * 3 + k * seed) * 70 + Math.cos(a * 2 - k) * 50;
      return [cx + Math.cos(a) * r * 1.5, cy + Math.sin(a) * r];
    });
    // a smooth closed curve through the points
    const d = points
      .map(([x, y], i) => {
        if (i === 0) return `M${x.toFixed(0)} ${y.toFixed(0)}`;
        const [px, py] = points[i - 1];
        return `Q${px.toFixed(0)} ${py.toFixed(0)} ${((px + x) / 2).toFixed(0)} ${((py + y) / 2).toFixed(0)}`;
      })
      .join(" ");
    return <path key={k} d={d} />;
  });

  return (
    <svg className="contours" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {lines}
    </svg>
  );
}
