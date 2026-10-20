/**
 * The three legs of Man, as on the Isle of Man flag (and on the helmet): three armoured legs, bent at
 * the knee, running clockwise around a centre. It spins, and scroll speed winds it up (data-rush).
 */
export function Triskelion({ className = "" }: { className?: string }) {
  // One leg, pointing right from the hip: a straight thigh, the knee bent down, the shin, and a foot
  // whose toe points the way the legs run (clockwise). Plates on the thigh and shin read as armour.
  const leg = (
    <g>
      <path d="M2 -9 L48 -9 L50 9 L2 9 Z" fill="currentColor" />
      <path d="M40 -8 L58 -2 L66 46 L50 50 L42 10 Z" fill="currentColor" />
      <path d="M50 44 L66 42 L68 56 L30 64 L28 56 Z" fill="currentColor" />
      <path d="M50 56 l-4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M18 -9 L18 9 M32 -9 L32 9" stroke="var(--trisk-line, #fbf6ec)" strokeWidth="2" />
      <path d="M49 20 L60 18 M52 32 L63 30" stroke="var(--trisk-line, #fbf6ec)" strokeWidth="2" />
      <circle cx="48" cy="1" r="9" fill="currentColor" />
    </g>
  );
  return (
    <svg className={`trisk ${className}`} viewBox="-80 -80 160 160" aria-hidden data-rush>
      {[0, 120, 240].map((a) => (
        <g key={a} transform={`rotate(${a})`}>
          {leg}
        </g>
      ))}
      <circle r="12" fill="currentColor" />
    </svg>
  );
}
