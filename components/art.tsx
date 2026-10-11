/*
  Hand-drawn scenery. Every piece uses the same three inks, set by CSS on the element that holds it:
    i  = the zone's ink (currentColor)      r  = the accent
    p  = the opposite of the ink (cut-outs) s / sr / sp = the same three as outlines
*/

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/**
 * A face: two eyes and a small smile. Eyes.tsx moves the pupils toward the pointer,
 * which is most of what makes these drawings feel alive.
 */
const face = (x: number, y: number, size = 1, smile = true) => (
  <g className="face" transform={`translate(${x} ${y}) scale(${size})`}>
    <circle className="eye-white" cx="-16" r="11" />
    <circle className="eye-white" cx="16" r="11" />
    <circle className="pupil" cx="-16" r="5" />
    <circle className="pupil" cx="16" r="5" />
    {smile ? <path className="mouth" d="M-9 17 Q0 26 9 17" /> : null}
  </g>
);


const Tyres = (
  <svg className="art" viewBox="0 0 200 264">
    {range(3).map((k) => (
      <g key={k} transform={`translate(0 ${k * 88})`}>
        <rect className={k === 1 ? "r" : "i"} width="200" height="80" rx="30" />
        {range(6).map((t) => (
          <rect key={t} className="p" x={22 + t * 30} y="12" width="8" height="56" rx="4" />
        ))}
      </g>
    ))}
    {face(100, 40, 0.9)}
  </svg>
);

const Cone = (
  <svg className="art" viewBox="0 0 120 160">
    <polygon className="r" points="60,0 102,132 18,132" />
    <polygon className="i" points="46,44 74,44 80,64 40,64" />
    <polygon className="i" points="35,82 85,82 91,102 29,102" />
    <rect className="i" y="132" width="120" height="24" rx="6" />
    {face(60, 114, 0.6, false)}
  </svg>
);

/** Start lights: a gantry wide enough to ride under */
const Lights = (
  <svg className="art" viewBox="0 0 2400 900">
    <rect className="i" x="40" width="50" height="900" />
    <rect className="i" x="2310" width="50" height="900" />
    <rect className="i" width="2400" height="150" />
    {range(5).map((k) => (
      <g key={k} transform={`translate(${655 + k * 230} 18)`}>
        <rect className="p" width="170" height="114" rx="22" />
        <circle className="r" cx="85" cy="57" r="40" />
        <circle className="sp" cx="85" cy="57" r="40" />
      </g>
    ))}
  </svg>
);

const Flag = (
  <svg className="art" viewBox="0 0 230 420">
    <rect className="i" x="8" width="12" height="420" rx="6" />
    {range(4).flatMap((row) =>
      range(6).map((col) =>
        (row + col) % 2 === 0 ? (
          <rect key={`${row}-${col}`} className="i" x={24 + col * 32} y={10 + row * 32} width="32" height="32" />
        ) : null,
      ),
    )}
    <rect className="s" x="24" y="10" width="192" height="128" />
  </svg>
);

const Palm = (
  <svg className="art" viewBox="0 0 320 640">
    <path className="s" style={{ strokeWidth: 22 }} d="M150 640 C138 470 176 320 162 180" />
    {[
      "M162 180 Q80 100 6 164",
      "M162 180 Q92 44 26 52",
      "M162 180 Q150 40 118 6",
      "M162 180 Q236 46 300 58",
      "M162 180 Q258 108 314 184",
      "M162 180 Q214 168 250 266",
      "M162 180 Q106 176 76 270",
    ].map((d) => (
      <path key={d} className="s" style={{ strokeWidth: 15 }} d={d} />
    ))}
    <circle className="r" cx="150" cy="196" r="15" />
    <circle className="r" cx="176" cy="200" r="13" />
  </svg>
);

/** A low retro sun, cut into bars toward the horizon */
const Sun = (
  <svg className="art" viewBox="0 0 800 800">
    <clipPath id="sun-disc">
      <circle cx="400" cy="400" r="400" />
    </clipPath>
    <g clipPath="url(#sun-disc)">
      {[
        [0, 430],
        [452, 42],
        [518, 40],
        [586, 36],
        [654, 30],
        [718, 24],
        [772, 16],
      ].map(([y, h]) => (
        <rect key={y} className="r" y={y} width="800" height={h} />
      ))}
    </g>
    {face(400, 250, 5)}
  </svg>
);

const Stand = (
  <svg className="art" viewBox="0 0 720 380">
    <polygon className="i" points="0,70 720,0 720,34 0,104" />
    <rect className="i" x="20" y="90" width="14" height="290" />
    <rect className="i" x="686" y="24" width="14" height="356" />
    {range(5).map((row) => (
      <g key={row}>
        <rect className="s" x={40 + row * 14} y={140 + row * 46} width={640 - row * 14} height="46" />
        {range(14 - row).map((k) => (
          <circle
            key={k}
            className={(k * 7 + row * 3) % 5 === 0 ? "r" : "i"}
            cx={72 + row * 14 + k * 44}
            cy={163 + row * 46}
            r="11"
          />
        ))}
      </g>
    ))}
  </svg>
);

/** Braking marker: the number is how far there is to go */
const marker = (n: number) => (
  <svg className="art" viewBox="0 0 200 330">
    <rect className="i" x="90" y="150" width="20" height="180" />
    <rect className="i" width="200" height="170" rx="10" />
    <polygon className="r" points="0,170 0,120 50,170" />
    <text className="p art-num" x="100" y="122" textAnchor="middle">
      {n}
    </text>
  </svg>
);

/** A loaded bar on a rack, wide enough to ride under. More plates the further you go. */
const bar = (plates: number) => {
  const sizes = [266, 226, 226, 180];
  return (
    <svg className="art" viewBox="0 0 2200 800">
      <rect className="i" x="250" y="150" width="44" height="650" />
      <rect className="i" x="1906" y="150" width="44" height="650" />
      <rect className="i" x="200" y="770" width="144" height="30" />
      <rect className="i" x="1856" y="770" width="144" height="30" />
      <rect className="i" y="150" width="2200" height="26" rx="13" />
      {range(plates).flatMap((k) => {
        const h = sizes[k];
        const w = k === 0 ? 50 : 40;
        const offset = 330 + k * 56;
        return [offset, 2200 - offset - w].map((x) => (
          <rect key={`${k}-${x}`} className={k === 0 ? "r" : "i"} x={x} y={163 - h / 2} width={w} height={h} rx="8" />
        ));
      })}
      <rect className="p" x="318" y="146" width="12" height="34" />
      <rect className="p" x="1870" y="146" width="12" height="34" />
    </svg>
  );
};

const Plate = (
  <svg className="art" viewBox="0 0 300 300">
    <circle className="i" cx="150" cy="150" r="150" />
    <circle className="sp" cx="150" cy="150" r="116" />
    <circle className="r" cx="150" cy="150" r="62" />
    <circle className="p" cx="150" cy="150" r="18" />
    {range(3).map((k) => (
      <rect key={k} className="p" x="134" y="22" width="32" height="56" rx="16" transform={`rotate(${k * 120} 150 150)`} />
    ))}
    {face(150, 140, 1.25)}
  </svg>
);

const Kettlebell = (
  <svg className="art" viewBox="0 0 220 300">
    <path className="s" style={{ strokeWidth: 30 }} d="M58 128 C30 14 190 14 162 128" />
    <circle className="i" cx="110" cy="192" r="104" />
    <rect className="i" x="46" y="270" width="128" height="30" rx="8" />
    <circle className="r" cx="110" cy="192" r="46" />
    {face(110, 188, 1.15)}
  </svg>
);

const Dumbbell = (
  <svg className="art" viewBox="0 0 380 170">
    <rect className="i" x="80" y="68" width="220" height="34" rx="10" />
    {[0, 290].map((x) => (
      <g key={x}>
        <rect className="i" x={x} y="6" width="90" height="158" rx="18" />
        <rect className="r" x={x + 30} y="6" width="30" height="158" />
      </g>
    ))}
  </svg>
);

const Chip = (
  <svg className="art" viewBox="0 0 380 270">
    {range(8).map((k) => (
      <rect key={k} className="i" x={62 + k * 34} y="180" width="16" height="90" />
    ))}
    <rect className="i" x="30" y="20" width="320" height="180" rx="10" />
    <circle className="p" cx="62" cy="52" r="12" />
    <rect className="p" x="110" y="80" width="170" height="12" />
    <rect className="p" x="110" y="108" width="110" height="12" />
    <rect className="r" x="110" y="140" width="60" height="22" />
    {face(292, 62, 0.8, false)}
  </svg>
);

const Capacitor = (
  <svg className="art" viewBox="0 0 150 420">
    <rect className="i" x="44" y="300" width="9" height="120" />
    <rect className="i" x="97" y="300" width="9" height="120" />
    <rect className="i" x="10" width="130" height="310" rx="28" />
    <rect className="r" x="92" y="14" width="30" height="282" />
    {range(4).map((k) => (
      <rect key={k} className="p" x="98" y={50 + k * 62} width="18" height="6" />
    ))}
    <rect className="sp" x="10" y="18" width="130" height="1" />
    {face(64, 150, 0.9)}
  </svg>
);

const Resistor = (
  <svg className="art" viewBox="0 0 440 120">
    <rect className="i" y="54" width="440" height="12" />
    <rect className="i" x="110" y="16" width="220" height="88" rx="44" />
    {[
      [150, "r"],
      [190, "p"],
      [230, "r"],
      [280, "p"],
    ].map(([x, c]) => (
      <rect key={x} className={c as string} x={x} y="16" width="20" height="88" />
    ))}
  </svg>
);

const Iron = (
  <svg className="art" viewBox="0 0 560 560">
    <path className="s" d="M400 30 C430 70 370 100 400 140 C430 180 380 200 396 232" />
    <g transform="rotate(-38 280 300)">
      <path className="s" style={{ strokeWidth: 12 }} d="M70 300 C20 300 30 380 -20 380" />
      <rect className="r" x="70" y="268" width="230" height="64" rx="32" />
      <rect className="p" x="250" y="268" width="14" height="64" />
      <rect className="i" x="300" y="284" width="160" height="32" />
      <polygon className="i" points="460,284 540,300 460,316" />
    </g>
  </svg>
);

const wave = range(81)
  .map((k) => {
    const x = k * 20;
    const y = 150 + Math.sin(k / 4) * 110 * Math.cos(k / 23);
    return `${k === 0 ? "M" : "L"}${x} ${y.toFixed(1)}`;
  })
  .join(" ");

/** An oscilloscope trace, hung in the sky */
const Scope = (
  <svg className="art" viewBox="0 0 1600 300">
    <path className="sr" style={{ strokeWidth: 10 }} d={wave} />
  </svg>
);

const Led = (
  <svg className="art" viewBox="0 0 140 330">
    <rect className="i" x="42" y="190" width="9" height="140" />
    <rect className="i" x="90" y="190" width="9" height="110" />
    <path className="r" d="M20 176 V92 A50 50 0 0 1 120 92 V176 Z" />
    <rect className="i" x="8" y="170" width="124" height="28" rx="6" />
    <path className="sp" style={{ strokeWidth: 8 }} d="M44 96 A28 28 0 0 1 72 66" />
    {face(70, 122, 0.8)}
  </svg>
);

const Guitar = (
  <svg className="art" viewBox="0 0 440 1240">
    <path className="i" d="M176 150 L170 60 C168 20 200 0 236 8 C262 14 268 44 256 70 L250 150 Z" />
    {range(6).map((k) => (
      <circle key={k} className="p" cx={188 + (k % 2) * 46} cy={36 + Math.floor(k / 2) * 34} r="9" />
    ))}
    <rect className="i" x="182" y="150" width="62" height="540" />
    {range(11).map((k) => (
      <rect key={k} className="p" x="182" y={186 + k * 46 - k * k * 0.8} width="62" height="5" />
    ))}
    <path
      className="r"
      d="M212 660 C150 612 96 566 86 640 C80 700 132 736 110 800 C52 900 50 1080 126 1160 C190 1226 312 1214 352 1128 C404 1014 350 892 328 814 C316 754 362 712 350 650 C338 584 272 614 212 660 Z"
    />
    <path
      className="i"
      d="M150 760 C190 720 300 730 318 800 C340 900 330 990 290 1050 C250 1090 170 1070 150 1010 C120 930 110 820 150 760 Z"
    />
    {[800, 880, 960].map((y) => (
      <rect key={y} className="p" x="166" y={y} width="120" height="26" rx="13" />
    ))}
    <rect className="p" x="176" y="1040" width="100" height="26" />
    <circle className="p" cx="306" cy="1010" r="13" />
    <circle className="p" cx="322" cy="1062" r="13" />
    {range(6).map((k) => (
      <rect key={k} className="p" x={190 + k * 9.2} y="70" width="2.4" height="980" />
    ))}
    {face(232, 1112, 1.7)}
  </svg>
);

const Amp = (
  <svg className="art" viewBox="0 0 440 440">
    <rect className="i" width="440" height="440" rx="22" />
    <rect className="p" x="28" y="112" width="384" height="300" rx="10" />
    <circle className="s" cx="220" cy="262" r="118" />
    <circle className="s" cx="220" cy="262" r="70" />
    <circle className="i" cx="220" cy="262" r="28" />
    {range(6).map((k) => (
      <circle key={k} className={k === 5 ? "r" : "p"} cx={60 + k * 64} cy="58" r="17" />
    ))}
    {face(220, 258, 1.9)}
  </svg>
);

const Pick = (
  <svg className="art" viewBox="0 0 160 184">
    <path className="r" d="M80 184 C40 130 0 86 4 46 C8 14 44 0 80 0 C116 0 152 14 156 46 C160 86 120 130 80 184 Z" />
    {face(80, 72, 1.1)}
  </svg>
);

/** Rings of sound to ride through */
const Rings = (
  <svg className="art" viewBox="0 0 1000 1000">
    <circle className="sr" style={{ strokeWidth: 16 }} cx="500" cy="500" r="490" />
    <circle className="s" style={{ strokeWidth: 8 }} cx="500" cy="500" r="430" />
    <circle className="s" style={{ strokeWidth: 4 }} cx="500" cy="500" r="380" />
  </svg>
);

const Dripper = (
  <svg className="art" viewBox="0 0 360 570">
    <path className="s" d="M300 96 Q356 110 330 170 Q318 196 276 192" />
    <rect className="i" x="20" y="40" width="320" height="28" rx="14" />
    <polygon className="i" points="40,68 320,68 232,236 128,236" />
    {range(5).map((k) => (
      <path key={k} className="sp" style={{ strokeWidth: 5 }} d={`M${86 + k * 47} 82 L${150 + k * 15} 222`} />
    ))}
    <rect className="i" x="112" y="236" width="136" height="20" rx="6" />
    <circle className="r" cx="180" cy="286" r="9" />
    <path className="s" d="M110 312 H250 L302 524 Q306 556 272 556 H88 Q54 556 58 524 Z" />
    <path className="r" d="M82 430 H278 L298 522 Q300 548 272 548 H88 Q60 548 62 522 Z" />
    {face(180, 474, 1.5)}
  </svg>
);

const Cup = (
  <svg className="art" viewBox="0 0 320 400">
    {[80, 130, 180].map((x) => (
      <path key={x} className="s" d={`M${x} 150 C${x - 30} 110 ${x + 30} 80 ${x} 40 C${x - 14} 22 ${x + 8} 10 ${x} 0`} />
    ))}
    <path className="s" style={{ strokeWidth: 22 }} d="M232 226 Q306 222 306 272 Q306 322 232 318" />
    <path className="i" d="M30 180 H236 V312 Q236 370 176 370 H90 Q30 370 30 312 Z" />
    <ellipse className="r" cx="133" cy="184" rx="94" ry="16" />
    <rect className="i" y="376" width="270" height="16" rx="8" />
    {face(133, 270, 1.6)}
  </svg>
);

const Kettle = (
  <svg className="art" viewBox="0 0 480 380">
    <path className="s" style={{ strokeWidth: 20 }} d="M150 262 C60 262 86 130 14 108" />
    <path className="s" style={{ strokeWidth: 24 }} d="M350 130 C460 120 470 290 372 300" />
    <path className="i" d="M150 110 H350 L390 340 Q392 368 362 368 H138 Q108 368 110 340 Z" />
    <rect className="i" x="170" y="80" width="160" height="30" rx="10" />
    <circle className="r" cx="250" cy="62" r="24" />
    <rect className="p" x="150" y="150" width="200" height="8" />
    {face(250, 250, 1.9)}
  </svg>
);

const Books = (
  <svg className="art" viewBox="0 0 320 380">
    {[
      [20, 300, 280, "i"],
      [0, 224, 300, "r"],
      [34, 152, 260, "i"],
      [12, 84, 290, "i"],
      [50, 16, 230, "r"],
    ].map(([x, y, w, c]) => (
      <g key={y as number}>
        <rect className={c as string} x={x as number} y={y as number} width={w as number} height="68" rx="6" />
        <rect className="p" x={(x as number) + 26} y={(y as number) + 14} width="8" height="40" />
        <rect className="p" x={(x as number) + (w as number) - 90} y={(y as number) + 28} width="60" height="10" />
      </g>
    ))}
    {face(165, 48, 0.9, false)}
  </svg>
);

const Brick = (
  <svg className="art" viewBox="0 0 330 220">
    {range(4).map((k) => (
      <g key={k}>
        <rect className="r" x={22 + k * 76} y="8" width="58" height="50" rx="8" />
        <rect className="p" x={30 + k * 76} y="16" width="42" height="6" rx="3" />
      </g>
    ))}
    <rect className="r" y="50" width="330" height="170" rx="8" />
    <rect className="p" x="14" y="64" width="302" height="6" rx="3" />
    {face(165, 138, 1.6)}
  </svg>
);

const Bean = (
  <svg className="art" viewBox="0 0 100 70">
    <ellipse className="i" cx="50" cy="35" rx="50" ry="35" />
    <path className="sp" style={{ strokeWidth: 6 }} d="M14 44 C40 48 54 20 86 24" />
    {face(50, 30, 0.5, false)}
  </svg>
);

/** A terminal window with a prompt and a few lines of output */
const Terminal = (
  <svg className="art" viewBox="0 0 440 320">
    <rect className="i" width="440" height="320" rx="22" />
    <rect className="p" x="14" y="56" width="412" height="250" rx="10" />
    {[34, 66, 98].map((x, k) => (
      <circle key={x} className={k === 0 ? "r" : "p"} cx={x} cy="29" r="10" />
    ))}
    <path className="s" style={{ strokeWidth: 12 }} d="M48 104 L84 132 L48 160" />
    <rect className="i" x="104" y="150" width="70" height="12" />
    <rect className="i" x="48" y="198" width="220" height="12" />
    <rect className="r" x="48" y="232" width="130" height="12" />
    <rect className="i" x="48" y="266" width="280" height="12" />
    {face(336, 132, 1.2)}
  </svg>
);

/** A shield with a tick: the thing that stands between an agent and a bad idea */
const Shield = (
  <svg className="art" viewBox="0 0 300 360">
    <path className="i" d="M150 0 L300 56 V176 C300 270 236 330 150 360 C64 330 0 270 0 176 V56 Z" />
    <path className="r" d="M150 44 L262 86 V176 C262 246 216 292 150 316 Z" />
    <path className="sp" style={{ strokeWidth: 22 }} d="M92 180 L136 224 L212 132" />
    {face(150, 104, 1.1, false)}
  </svg>
);

/** A handlebar lap timer: a board with a screen, an antenna and two buttons */
const Timer = (
  <svg className="art" viewBox="0 0 420 340">
    <path className="s" d="M330 60 V20 C330 4 380 4 380 20" />
    <rect className="i" y="56" width="420" height="284" rx="28" />
    <rect className="p" x="34" y="92" width="270" height="150" rx="10" />
    {face(169, 160, 1.9)}
    <circle className="r" cx="358" cy="126" r="26" />
    <circle className="p" cx="358" cy="202" r="26" />
    {range(6).map((k) => (
      <rect key={k} className="p" x={40 + k * 44} y="276" width="26" height="26" rx="4" />
    ))}
  </svg>
);

export const art = {
  terminal: Terminal,
  shield: Shield,
  timer: Timer,
  tyres: Tyres,
  cone: Cone,
  lights: Lights,
  flag: Flag,
  palm: Palm,
  sun: Sun,
  stand: Stand,
  marker300: marker(300),
  marker200: marker(200),
  marker100: marker(100),
  bar1: bar(1),
  bar2: bar(2),
  bar3: bar(3),
  bar4: bar(4),
  plate: Plate,
  kettlebell: Kettlebell,
  dumbbell: Dumbbell,
  chip: Chip,
  capacitor: Capacitor,
  resistor: Resistor,
  iron: Iron,
  scope: Scope,
  led: Led,
  guitar: Guitar,
  amp: Amp,
  pick: Pick,
  rings: Rings,
  dripper: Dripper,
  cup: Cup,
  kettle: Kettle,
  books: Books,
  brick: Brick,
  bean: Bean,
};

export type ArtName = keyof typeof art;
