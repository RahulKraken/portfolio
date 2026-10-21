"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Box, Cable, Cylinder, Rod, roundedRect, useCanvasTexture, type V3 } from "./parts";
import { strat } from "./strat";

// The Strat and the Katana, built in centimetres from Fender's traced outlines and the
// makers' published dimensions, then scaled into the room (1 m ≈ 1.7 units).
export const CM = 0.017;

/* --------------------------------------------------------------------------- strat spec */

const SCALE = 64.77; // 25.5"
const BODY_T = 4.45;
const FB = 5.35; // fingerboard surface: the neck sits 0.9 cm proud of the body
const GUARD_TOP = BODY_T + 0.34;
const { nutY, saddleY, neckEndY } = strat;
const fretY = (n: number) => nutY - SCALE * (1 - 2 ** (-n / 12));
const span = nutY - neckEndY;
const neckW = (y: number) => 4.2 + (1.4 * (nutY - y)) / span;
const neckD = (y: number) => 2.05 + (0.3 * (nutY - y)) / span;
// low E (bass side, −x) to high e
const STRING_AT_SADDLE = [-2.64, -1.58, -0.53, 0.53, 1.58, 2.64];
const STRING_AT_NUT = [-1.75, -1.05, -0.35, 0.35, 1.05, 1.75];
const STRING_R = [0.058, 0.048, 0.04, 0.032, 0.026, 0.022];
const WOUND = [true, true, true, false, false, false];
const BREAK_Y = saddleY - 0.15;
const stringX = (i: number, y: number) =>
  STRING_AT_SADDLE[i] +
  ((STRING_AT_NUT[i] - STRING_AT_SADDLE[i]) * (y - BREAK_Y)) / (nutY - BREAK_Y);
const stringZ = (y: number) => 5.81 + ((5.53 - 5.81) * (y - BREAK_Y)) / (nutY - BREAK_Y);
// tuner posts measured on the headstock, low E nearest the nut
const POSTS: [number, number][] = Array.from({ length: 6 }, (_, i) => [
  -2.01 + 0.716 * i,
  84.55 + 2.39 * i,
]);
const TREE: [number, number] = [1.49, 87.97];
const HEAD_FACE = FB - 0.5;
const HEAD_BACK = HEAD_FACE - 1.4;
const PICKUPS: { y: number; tilt: number }[] = [
  { y: 19.44, tilt: -0.18 },
  { y: 25.36, tilt: 0 },
  { y: 31.4, tilt: 0 },
];
const KNOBS: [number, number][] = [
  [5.7, 19.3],
  [9.12, 16.46],
  [12.48, 13.45],
];

const chrome = { color: "#d4d6d8", metalness: 0.92, roughness: 0.22 };
const nickel = { color: "#c7c3b8", metalness: 0.85, roughness: 0.3 };
const cream = "#eadfbe";

function shapeOf(points: [number, number][]) {
  return new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y)));
}

/** A slab from an outline with rounded edges; `z` is its back face. */
function useSlab(
  points: [number, number][],
  thickness: number,
  radius: number,
  segments = 4,
) {
  const geometry = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(shapeOf(points), {
      depth: thickness - 2 * radius,
      bevelEnabled: true,
      bevelThickness: radius,
      bevelSize: radius,
      bevelOffset: -radius,
      bevelSegments: segments,
      curveSegments: 6,
    });
    g.translate(0, 0, radius);
    return g;
  }, [points, thickness, radius, segments]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return geometry;
}

/** The neck: flat fingerboard on top, a C-shaped back, tapering from heel to nut. */
function useNeck() {
  const geometry = useMemo(() => {
    const stations = 32,
      ring = 28;
    const y0 = neckEndY,
      y1 = nutY + 0.25;
    const pos: number[] = [],
      uv: number[] = [],
      index: number[] = [];
    for (let s = 0; s <= stations; s++) {
      const y = y0 + ((y1 - y0) * s) / stations;
      const w = neckW(y) / 2,
        d = neckD(y);
      for (let k = 0; k < ring; k++) {
        const t = k / ring;
        let x: number, z: number;
        if (t < 0.25) {
          // fingerboard, edge to edge, with a soft roll at the corners
          const f = t / 0.25;
          x = w - 2 * w * f;
          z = FB - 0.08 * (Math.abs(x) / w) ** 6;
        } else {
          // the back: half an ellipse from the bass edge round to the treble edge
          const a = Math.PI * ((t - 0.25) / 0.75);
          x = -w * Math.cos(a) * 0.995;
          z = FB - 0.12 - (d - 0.12) * Math.sin(a);
        }
        pos.push(x, y, z);
        uv.push(t, (y - y0) / (y1 - y0));
      }
    }
    for (let s = 0; s < stations; s++)
      for (let k = 0; k < ring; k++) {
        const a = s * ring + k,
          b = s * ring + ((k + 1) % ring),
          c = a + ring,
          d = b + ring;
        index.push(a, c, b, b, c, d);
      }
    // end caps
    for (const s of [0, stations]) {
      const centre = pos.length / 3;
      const y = s === 0 ? y0 : y1;
      pos.push(0, y, FB - neckD(y) / 2);
      uv.push(0.5, s === 0 ? 0 : 1);
      for (let k = 0; k < ring; k++) {
        const a = s * ring + k,
          b = s * ring + ((k + 1) % ring);
        if (s === 0) index.push(centre, b, a);
        else index.push(centre, a, b);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(index);
    g.computeVertexNormals();
    return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return geometry;
}

function useMapleTexture() {
  return useCanvasTexture(256, 1024, (g) => {
    g.fillStyle = "#e4c189";
    g.fillRect(0, 0, 256, 1024);
    for (let i = 0; i < 70; i++) {
      const x0 = (i * 37) % 256;
      g.strokeStyle = `rgba(170,120,60,${0.05 + ((i * 13) % 10) / 90})`;
      g.lineWidth = 0.6 + (i % 3) * 0.6;
      g.beginPath();
      for (let y = 0; y <= 1024; y += 16) {
        const x = x0 + Math.sin(y * 0.01 + i) * 3;
        if (y === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.stroke();
    }
  });
}

/** Strat knob: fluted cap over a skirt printed 0–10. */
function Knob({ at }: { at: [number, number] }) {
  const numbers = useCanvasTexture(512, 64, (g) => {
    g.fillStyle = cream;
    g.fillRect(0, 0, 512, 64);
    g.fillStyle = "#2a2622";
    g.font = "bold 26px sans-serif";
    g.textAlign = "center";
    for (let n = 0; n <= 10; n++) g.fillText(String(n), 23 + n * 42, 42);
  });
  const fluted = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.98, 1.06, 1.25, 72, 1);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i),
        z = p.getZ(i);
      const r = Math.hypot(x, z);
      if (r < 0.5) continue;
      const a = Math.atan2(z, x);
      const k = 1 + 0.035 * Math.cos(a * 24);
      p.setX(i, x * k);
      p.setZ(i, z * k);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  useEffect(() => () => fluted.dispose(), [fluted]);
  return (
    <group position={[at[0], at[1], GUARD_TOP]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[1.22, 1.28, 0.5, 48]} />
        <meshStandardMaterial attach="material-0" map={numbers} roughness={0.45} />
        <meshStandardMaterial attach="material-1" color={cream} roughness={0.45} />
        <meshStandardMaterial attach="material-2" color={cream} roughness={0.45} />
      </mesh>
      <mesh geometry={fluted} position={[0, 1.12, 0]} castShadow>
        <meshStandardMaterial color={cream} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.74, 0]} scale={[1, 0.18, 1]}>
        <sphereGeometry args={[0.98, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={cream} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Pickup({ y, tilt }: { y: number; tilt: number }) {
  const cover = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(roundedRect(6.8, 1.85, 0.9), {
      depth: 0.7,
      bevelEnabled: true,
      bevelThickness: 0.14,
      bevelSize: 0.14,
      bevelOffset: -0.14,
      bevelSegments: 4,
      curveSegments: 10,
    });
    return g;
  }, []);
  useEffect(() => () => cover.dispose(), [cover]);
  const top = GUARD_TOP + 0.98;
  // vintage stagger: the D and G poles stand tallest
  const stagger = [0.02, 0.05, 0.09, 0.09, 0.04, 0.02];
  return (
    <group position={[0, y, GUARD_TOP]} rotation={[0, 0, tilt]}>
      <mesh geometry={cover} castShadow>
        <meshStandardMaterial color={cream} roughness={0.42} />
      </mesh>
      {STRING_AT_NUT.map((_, i) => (
        <Cylinder
          key={i}
          at={[stringX(i, y) / Math.cos(tilt), 0, top - GUARD_TOP + stagger[i] / 2]}
          radius={0.24}
          height={0.12 + stagger[i]}
          rotation={[Math.PI / 2, 0, 0]}
          {...nickel}
        />
      ))}
      {[-1, 1].map((s) => (
        <Cylinder
          key={s}
          at={[s * 3.9, 0, 0.05]}
          radius={0.2}
          height={0.1}
          rotation={[Math.PI / 2, 0, 0]}
          {...chrome}
        />
      ))}
    </group>
  );
}

function Bridge() {
  const plateY = 14.55;
  return (
    <group>
      {/* the base plate sits on the body in the guard's notch */}
      <Box at={[0.22, plateY, BODY_T + 0.1]} size={[7.45, 3.7, 0.2]} round={0.08} {...chrome} />
      <Box at={[0.22, 12.78, BODY_T + 0.55]} size={[7.45, 0.16, 0.9]} round={0.06} {...chrome} />
      {STRING_AT_SADDLE.map((x, i) => {
        const top = stringZ(BREAK_Y) - 0.02;
        return (
          <group key={i}>
            <Box at={[x, 14.6, (BODY_T + 0.2 + top) / 2]} size={[0.9, 2.1, top - BODY_T - 0.2]} round={0.12} {...chrome} />
            {[-0.25, 0.25].map((dx) => (
              <Cylinder key={dx} at={[x + dx, 15.2, top + 0.02]} radius={0.09} height={0.06} rotation={[Math.PI / 2, 0, 0]} color="#5d5f61" metalness={0.6} roughness={0.4} />
            ))}
            {/* intonation screw and spring back to the flange */}
            <Rod from={[x, 13.5, BODY_T + 0.55]} to={[x, 12.7, BODY_T + 0.55]} radius={0.12} {...chrome} />
            <Rod from={[x, 13.55, BODY_T + 0.55]} to={[x, 12.9, BODY_T + 0.55]} radius={0.17} color="#a7a9aa" metalness={0.8} roughness={0.35} />
          </group>
        );
      })}
      {[-3.4, 3.7].map((x) => (
        <Cylinder key={x} at={[x, 16.25, BODY_T + 0.3]} radius={0.32} height={0.3} rotation={[Math.PI / 2, 0, 0]} {...chrome} />
      ))}
      {/* tremolo arm: socket, rise, and the cream tip */}
      <Cylinder at={[3.97, 13.39, BODY_T + 0.45]} radius={0.3} height={0.5} rotation={[Math.PI / 2, 0, 0]} {...chrome} />
      <Cable
        radius={0.19}
        color={chrome.color}
        points={[
          [3.97, 13.39, BODY_T + 0.5],
          [3.97, 13.45, BODY_T + 1.6],
          [4.3, 15.4, BODY_T + 2.5],
          [5.2, 20.0, BODY_T + 2.65],
          [5.85, 24.3, BODY_T + 2.45],
        ]}
      />
      <Cable
        radius={0.3}
        color={cream}
        points={[
          [5.8, 24.0, BODY_T + 2.46],
          [6.1, 25.8, BODY_T + 2.38],
          [6.35, 27.5, BODY_T + 2.3],
        ]}
      />
    </group>
  );
}

function GuardScrews() {
  const screws = useMemo(() => {
    const p = strat.guard;
    // inward normal depends on the outline's winding
    const area = p.reduce((s, [x, y], i) => {
      const [x2, y2] = p[(i + 1) % p.length];
      return s + x * y2 - x2 * y;
    }, 0);
    const sign = area > 0 ? 1 : -1;
    const lengths = p.map(([x, y], i) => {
      const [x2, y2] = p[(i + 1) % p.length];
      return Math.hypot(x2 - x, y2 - y);
    });
    const total = lengths.reduce((a, b) => a + b, 0);
    const out: [number, number][] = [];
    for (let k = 0; k < 11; k++) {
      let d = (total * (k + 0.3)) / 11;
      let i = 0;
      while (d > lengths[i]) d -= lengths[i++];
      const [x, y] = p[i],
        [x2, y2] = p[(i + 1) % p.length];
      const t = d / lengths[i];
      const nx = (-(y2 - y) / lengths[i]) * sign,
        ny = ((x2 - x) / lengths[i]) * sign;
      out.push([x + (x2 - x) * t + nx * 0.5, y + (y2 - y) * t + ny * 0.5]);
    }
    return out;
  }, []);
  return (
    <>
      {screws.map(([x, y], i) => (
        <mesh key={i} position={[x, y, GUARD_TOP]} scale={[1, 1, 0.35]}>
          <sphereGeometry args={[0.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial {...chrome} />
        </mesh>
      ))}
    </>
  );
}

function Headstock({ maple }: { maple: THREE.Texture }) {
  const slab = useSlab(strat.headstock, 1.4, 0.22, 3);
  // extrude UVs are in centimetres, so this copy of the grain is scaled down to match
  const grain = useMemo(() => {
    const t = maple.clone();
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(0.1, 0.05);
    t.needsUpdate = true;
    return t;
  }, [maple]);
  useEffect(() => () => grain.dispose(), [grain]);
  // where the tuner keys poke out past the bass-side edge
  const edge = (y: number) =>
    Math.min(...strat.headstock.filter(([, py]) => Math.abs(py - y) < 1.4).map(([x]) => x));
  return (
    <group>
      <mesh geometry={slab} position={[0, 0, HEAD_BACK]} castShadow receiveShadow>
        <meshStandardMaterial map={grain} roughness={0.32} />
      </mesh>
      {/* truss-rod access and the string tree */}
      <mesh position={[0, 82.35, HEAD_FACE + 0.001]} scale={[0.35, 0.9, 1]}>
        <circleGeometry args={[1, 24]} />
        <meshStandardMaterial color="#2a1e14" roughness={0.6} />
      </mesh>
      <Cylinder at={[TREE[0], TREE[1], HEAD_FACE + 0.2]} radius={0.22} height={0.4} rotation={[Math.PI / 2, 0, 0]} {...chrome} />
      {POSTS.map(([x, y], i) => {
        const keyX = edge(y) - 1.15;
        return (
          <group key={i}>
            <Cylinder at={[x, y, HEAD_FACE + 0.06]} radius={0.44} height={0.12} rotation={[Math.PI / 2, 0, 0]} {...chrome} />
            <Cylinder at={[x, y, HEAD_FACE + 0.55]} radius={0.28} height={1.0} rotation={[Math.PI / 2, 0, 0]} {...chrome} />
            <Box at={[x, y, HEAD_FACE + 1.04]} size={[0.6, 0.07, 0.04]} round={0.01} color="#3a3c3e" />
            {/* gear housing behind, key out past the edge */}
            <Box at={[x - 0.2, y, HEAD_BACK - 0.45]} size={[1.6, 1.3, 0.9]} round={0.25} {...chrome} />
            <Rod from={[x - 0.9, y, HEAD_BACK - 0.45]} to={[keyX, y, HEAD_BACK - 0.45]} radius={0.16} {...chrome} />
            <mesh position={[keyX - 0.5, y, HEAD_BACK - 0.45]} scale={[1, 0.82, 0.32]}>
              <sphereGeometry args={[0.78, 24, 16]} />
              <meshStandardMaterial {...chrome} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Strings() {
  return (
    <>
      {STRING_AT_NUT.map((_, i) => {
        const color = WOUND[i] ? "#b9b4a6" : "#dcdcd8";
        const m = { color, metalness: 0.9, roughness: 0.28 };
        const r = STRING_R[i];
        const [px, py] = POSTS[i];
        const viaTree = i >= 4;
        const nut: V3 = [STRING_AT_NUT[i], nutY + 0.18, 5.53];
        const post: V3 = [px + 0.3, py, HEAD_FACE + 0.5];
        return (
          <group key={i}>
            {/* through the body, over the saddle, down the neck */}
            <Rod from={[STRING_AT_SADDLE[i], 12.9, BODY_T + 0.3]} to={[STRING_AT_SADDLE[i], BREAK_Y, stringZ(BREAK_Y)]} radius={r} {...m} />
            <Rod from={[STRING_AT_SADDLE[i], BREAK_Y, stringZ(BREAK_Y)]} to={nut} radius={r} {...m} />
            {viaTree ? (
              <>
                <Rod from={nut} to={[TREE[0] + (i === 4 ? -0.15 : 0.15), TREE[1], HEAD_FACE + 0.36]} radius={r} {...m} />
                <Rod from={[TREE[0] + (i === 4 ? -0.15 : 0.15), TREE[1], HEAD_FACE + 0.36]} to={post} radius={r} {...m} />
              </>
            ) : (
              <Rod from={nut} to={post} radius={r} {...m} />
            )}
            {/* a few wraps round the post */}
            <Cylinder at={[px, py, HEAD_FACE + 0.45]} radius={0.3 + r} height={0.22} rotation={[Math.PI / 2, 0, 0]} {...m} />
          </group>
        );
      })}
    </>
  );
}

/** Where the cable's plug leaves the guitar's face-mounted jack, in guitar centimetres. */
export const JACK: V3 = [9.35, 9.59, BODY_T];

export function Strat() {
  const maple = useMapleTexture();
  const body = useSlab(strat.body, BODY_T, 0.55, 5);
  const guard = useSlab(strat.guard, GUARD_TOP - BODY_T, 0.07, 2);
  const neck = useNeck();
  const frets = useMemo(() => Array.from({ length: 22 }, (_, n) => fretY(n + 1)), []);
  const dots = [3, 5, 7, 9, 15, 17, 19, 21].map((n) => (fretY(n - 1) + fretY(n)) / 2);
  const twelfth = (fretY(11) + fretY(12)) / 2;
  return (
    <group>
      <mesh geometry={body} castShadow receiveShadow>
        <meshPhysicalMaterial color="#0d0e0f" roughness={0.28} clearcoat={1} clearcoatRoughness={0.08} />
      </mesh>
      <mesh geometry={guard} position={[0, 0, BODY_T]} castShadow receiveShadow>
        <meshStandardMaterial color="#f2efe6" roughness={0.38} />
      </mesh>
      <GuardScrews />
      {PICKUPS.map((p) => (
        <Pickup key={p.y} {...p} />
      ))}
      {KNOBS.map((k) => (
        <Knob key={k[1]} at={k} />
      ))}
      {/* five-way switch in its slot */}
      <group position={[9.6, 20.85, GUARD_TOP]} rotation={[0, 0, -0.55]}>
        <Box at={[0, 0, 0.01]} size={[0.42, 2.3, 0.02]} round={0.01} color="#1a1b1c" />
        <Rod from={[0, 0.2, 0]} to={[0, 0.35, 0.8]} radius={0.12} {...chrome} />
        <mesh position={[0, 0.38, 1.25]} rotation={[Math.PI / 2 - 0.2, 0, 0]}>
          <capsuleGeometry args={[0.33, 0.7, 6, 16]} />
          <meshStandardMaterial color={cream} roughness={0.4} />
        </mesh>
      </group>
      <Bridge />
      {/* football jack on the face of the lower bout */}
      <group position={[JACK[0], JACK[1], BODY_T]} rotation={[0, 0, (59 * Math.PI) / 180]}>
        <mesh position={[0, 0, 0.02]} scale={[1.7, 0.95, 0.1]}>
          <sphereGeometry args={[1, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial {...chrome} />
        </mesh>
        <Cylinder at={[0, 0, 0.12]} radius={0.62} height={0.14} rotation={[Math.PI / 2, 0, 0]} {...chrome} />
      </group>
      {/* strap buttons at the tail and on the upper horn */}
      <Cylinder at={[0, -0.25, BODY_T / 2]} radius={0.5} height={0.6} {...chrome} />
      <Cylinder at={[-10.45, 48.25, BODY_T / 2]} radius={0.5} height={0.6} {...chrome} />
      {/* neck plate and trem cover on the back */}
      <Box at={[0, 37, -0.05]} size={[5.1, 6.4, 0.12]} round={0.4} {...chrome} />
      <Box at={[0, 11.5, -0.05]} size={[8.6, 13.8, 0.12]} round={0.9} color="#f2efe6" />

      <mesh geometry={neck} castShadow receiveShadow>
        <meshStandardMaterial map={maple} roughness={0.32} />
      </mesh>
      <Headstock maple={maple} />
      <Box at={[0, nutY + 0.18, 5.3]} size={[4.25, 0.36, 0.5]} round={0.06} color="#f1ebd9" roughness={0.35} />
      {frets.map((y) => (
        <Box key={y} at={[0, y, FB + 0.07]} size={[neckW(y) - 0.08, 0.24, 0.2]} round={0.09} {...nickel} />
      ))}
      {dots.map((y) => (
        <Cylinder key={y} at={[0, y, FB + 0.004]} radius={0.3} height={0.01} rotation={[Math.PI / 2, 0, 0]} color="#1c1b1a" />
      ))}
      {[-0.9, 0.9].map((x) => (
        <Cylinder key={x} at={[x, twelfth, FB + 0.004]} radius={0.3} height={0.01} rotation={[Math.PI / 2, 0, 0]} color="#1c1b1a" />
      ))}
      {[...dots, twelfth - 0.25, twelfth + 0.25].map((y) => (
        <Cylinder key={`side${y}`} at={[-neckW(y) / 2 - 0.004, y, FB - 0.25]} radius={0.1} height={0.01} rotation={[0, 0, Math.PI / 2]} color="#1c1b1a" />
      ))}
      <Strings />
    </group>
  );
}

/* ------------------------------------------------------------------------- katana amp */

// Boss Katana-50 Gen 3: 47 × 41 × 23.8 cm. Controls measured off Boss's top-down photo.
const AMP = { w: 47, h: 41, d: 23.8, feet: 0.8 };
const CONTROLS = [-12.45, -10.07, -7.7, -5.26, -2.88, -0.56, 1.82, 4.9, 7.7, 10.35];
export const AMP_INPUT: V3 = [-15.95, AMP.feet + AMP.h, -7.3];

function useTolex() {
  return useCanvasTexture(512, 512, (g) => {
    g.fillStyle = "#1c1d1e";
    g.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 9000; i++) {
      const x = (i * 97.13) % 512,
        y = (i * 57.71 + (i % 7) * 13) % 512;
      g.fillStyle = i % 2 ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.25)";
      g.beginPath();
      g.arc(x, y, 1 + (i % 3), 0, Math.PI * 2);
      g.fill();
    }
  }, { repeat: [3, 3] });
}

function useGrille() {
  // a soft basket weave; coarse enough not to shimmer at room distance
  return useCanvasTexture(256, 256, (g) => {
    g.fillStyle = "#18191a";
    g.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 16)
      for (let x = 0; x < 256; x += 16) {
        const across = ((x + y) / 16) % 2 === 0;
        g.fillStyle = "rgba(255,255,255,0.045)";
        if (across) g.fillRect(x + 1, y + 5, 14, 6);
        else g.fillRect(x + 5, y + 1, 6, 14);
      }
  }, { repeat: [6, 5] });
}

function usePanelPrint() {
  return useCanvasTexture(2048, 400, (g) => {
    g.fillStyle = "#141516";
    g.fillRect(0, 0, 2048, 400);
    g.fillStyle = "#e9e7e1";
    g.strokeStyle = "#cfcdc6";
    g.lineWidth = 3;
    g.textAlign = "center";
    const x = (cm: number) => ((cm + 17.65) / 35.3) * 2048;
    g.font = "bold 40px sans-serif";
    (
      [
        ["AMPLIFIER", -10.07],
        ["EQUALIZER", -2.88],
        ["EFFECTS", 4.9],
        ["TONE SETTING", 11.7],
      ] as [string, number][]
    ).forEach(([t, c]) => g.fillText(t, x(c), 64));
    g.font = "bold 30px sans-serif";
    (
      [
        ["INPUT", -15.95],
        ["AMP TYPE", -12.45],
        ["GAIN", -10.07],
        ["VOLUME", -7.7],
        ["BASS", -5.26],
        ["MIDDLE", -2.88],
        ["TREBLE", -0.56],
        ["BOOSTER", 1.82],
        ["FX", 4.9],
        ["REVERB", 7.7],
        ["MASTER", 10.35],
        ["POWER CONTROL", 13.0],
        ["POWER", 15.67],
      ] as [string, number][]
    ).forEach(([t, c]) => g.fillText(t, x(c), 128));
    for (const c of [-6.5, 0.65, 9.0]) {
      g.beginPath();
      g.moveTo(x(c), 40);
      g.lineTo(x(c), 360);
      g.stroke();
    }
  });
}

export function Katana() {
  const tolex = useTolex();
  const grille = useGrille();
  const print = usePanelPrint();
  const { w, h, d, feet } = AMP;
  const top = feet + h;
  const corner = { color: "#262729", roughness: 0.5, metalness: 0.2 };
  const front = d / 2;
  const pipe = useMemo(
    () =>
      roundedRect(w - 5.2, h - 5.4, 1.2)
        .getSpacedPoints(80)
        .map((p) => [p.x, p.y + feet + h / 2, front + 0.12] as V3),
    [w, h, feet, front],
  );
  return (
    <group>
      <Box at={[0, feet + h / 2, 0]} size={[w, h, d]} round={1.4} smooth={4} color="#1d1e1f" roughness={0.85} />
      {/* tolex wrap shows on the sides and top; the grille fills the front */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (w / 2 + 0.01), feet + h / 2, 0]} rotation={[0, (s * Math.PI) / 2, 0]}>
          <planeGeometry args={[d - 2.6, h - 2.6]} />
          <meshStandardMaterial map={tolex} roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, top + 0.01, 3.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w - 2.6, d - 9.6]} />
        <meshStandardMaterial map={tolex} roughness={0.9} />
      </mesh>
      <mesh position={[0, feet + h / 2, front + 0.02]}>
        <planeGeometry args={[w - 2.8, h - 2.8]} />
        <meshStandardMaterial map={grille} roughness={0.95} />
      </mesh>
      <Cable radius={0.16} color="#bdbfc1" points={pipe} closed />
      {/* nameplate and emblem, left blank */}
      <Box at={[0, top - 9.2, front + 0.25]} size={[8.2, 2.1, 0.35]} round={0.3} {...chrome} />
      <Box at={[0, top - 12.0, front + 0.2]} size={[1.6, 1.6, 0.25]} round={0.3} {...chrome} />
      {[-1, 1].flatMap((sx) =>
        [-1, 1].flatMap((sy) =>
          [-1, 1].map((sz) => (
            <group key={`${sx}${sy}${sz}`}>
              <Box
                at={[sx * (w / 2 - 1.6), feet + h / 2 + sy * (h / 2 - 1.6), sz * (d / 2 - 1.6)]}
                size={[3.6, 3.6, 3.6]}
                round={1.2}
                smooth={3}
                {...corner}
              />
            </group>
          )),
        ),
      )}
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <Cylinder key={`${sx}${sz}`} at={[sx * (w / 2 - 3), feet / 2, sz * (d / 2 - 3)]} radius={1.3} height={feet} color="#121314" roughness={0.9} />
        )),
      )}
      {/* recessed control panel along the back of the top */}
      <Box at={[0, top - 0.35, -d / 2 + 3.6]} size={[36.4, 0.9, 7.2]} round={0.4} color="#101112" />
      <mesh position={[0, top + 0.11, -d / 2 + 3.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[35.3, 6.9]} />
        <meshStandardMaterial map={print} roughness={0.7} />
      </mesh>
      {CONTROLS.map((x, i) => (
        <group key={x} position={[x, top + 0.1, AMP_INPUT[2]]} rotation={[0, -0.6 + i * 0.37, 0]}>
          <Cylinder at={[0, 0.45, 0]} radius={i === 0 ? 1.15 : 1.0} top={i === 0 ? 1.0 : 0.88} height={0.9} color="#17181a" roughness={0.45} />
          <Box at={[0, 0.92, 0.45]} size={[0.12, 0.04, 0.7]} round={0.02} color="#efede6" />
        </group>
      ))}
      {[2.6, 5.6, 8.6].map((x) => (
        <Cylinder key={x} at={[x - 1.0, top + 0.13, -d / 2 + 1.6]} radius={0.18} height={0.06} color="#3a2b25" roughness={0.3} />
      ))}
      <group position={[13.0, top + 0.1, AMP_INPUT[2]]} rotation={[0, 0.4, 0]}>
        <Cylinder at={[0, 0.35, 0]} radius={0.85} height={0.7} color="#17181a" />
        <Box at={[0, 0.85, 0.4]} size={[0.5, 0.6, 1.5]} round={0.2} color="#17181a" />
      </group>
      <Box at={[15.67, top + 0.35, AMP_INPUT[2]]} size={[2.2, 0.5, 2.8]} round={0.2} color="#0c0c0d" />
      <Box at={[15.67, top + 0.62, AMP_INPUT[2] - 0.3]} size={[1.6, 0.25, 1.4]} round={0.1} color="#2a2b2c" />
      <Cylinder at={[AMP_INPUT[0], top + 0.12, AMP_INPUT[2]]} radius={0.75} height={0.12} {...chrome} />
      <Cylinder at={[AMP_INPUT[0], top + 0.14, AMP_INPUT[2]]} radius={0.42} height={0.14} color="#050505" />
      {/* strap handle on chrome brackets, and the two top bolts */}
      <Cable
        radius={0.75}
        color="#141516"
        points={[
          [-8.6, top + 0.6, 0.2],
          [-6.8, top + 2.6, 0.2],
          [0, top + 3.3, 0.2],
          [6.8, top + 2.6, 0.2],
          [8.6, top + 0.6, 0.2],
        ]}
      />
      {[-8.7, 8.7].map((x) => (
        <Box key={x} at={[x, top + 0.35, 0.2]} size={[1.0, 0.7, 3.2]} round={0.25} {...chrome} />
      ))}
      {[-15.7, 16.2].map((x) => (
        <mesh key={x} position={[x, top, -2]} scale={[1, 0.35, 1]}>
          <sphereGeometry args={[0.8, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial {...chrome} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------- the music corner */

// The guitar stands on an A-frame stand, leaning back onto its yoke; the amp sits to its
// right; one cable runs from the guitar's jack to the amp's input. Scene units, floor at 0.
const LEAN = new THREE.Euler(-0.08, 0, 0);
const GUITAR_BASE = new THREE.Vector3(0, 0.1, 0);
const AMP_AT: V3 = [0.76, 0, -0.06];

function inGuitar([x, y, z]: V3): V3 {
  return new THREE.Vector3(x * CM, y * CM, (z - BODY_T / 2) * CM)
    .applyEuler(LEAN)
    .add(GUITAR_BASE)
    .toArray() as V3;
}
const inAmp = ([x, y, z]: V3): V3 => [AMP_AT[0] + x * CM, AMP_AT[1] + y * CM, AMP_AT[2] + z * CM];

export function MusicCorner() {
  const plugIn = inGuitar([JACK[0], JACK[1], JACK[2] + 0.2]);
  const plugOut = inGuitar([JACK[0], JACK[1], JACK[2] + 3.4]);
  const input = inAmp(AMP_INPUT);
  const stand = "#1f2123";
  return (
    <group>
      <group rotation={[0, -0.25, 0]}>
        <group position={GUITAR_BASE} rotation={LEAN}>
          <group scale={CM} position={[0, 0, (-BODY_T / 2) * CM]}>
            <Strat />
          </group>
        </group>
        {/* A-frame stand: padded cradle, two front feet, one back leg up to the yoke */}
        <Rod from={[-0.16, 0.09, 0.06]} to={[0.16, 0.09, 0.06]} radius={0.014} color={stand} />
        {[-1, 1].map((s) => (
          <Rod key={s} from={[s * 0.16, 0.09, 0.06]} to={[s * 0.24, 0.01, 0.2]} radius={0.012} color={stand} />
        ))}
        <Rod from={[0, 0.09, 0.06]} to={[0, 0.01, -0.36]} radius={0.012} color={stand} />
        <Rod from={[0, 0.01, -0.36]} to={[0, 0.98, -0.085]} radius={0.012} color={stand} />
        <Rod from={[-0.045, 0.98, -0.085]} to={[0.045, 0.98, -0.085]} radius={0.011} color={stand} />
      </group>
      <group position={AMP_AT} scale={CM}>
        <Katana />
      </group>
      {/* the guitar sits in a group turned −0.25; bring the plug points along */}
      <group rotation={[0, -0.25, 0]}>
        <Rod from={plugIn} to={plugOut} radius={0.008} {...chrome} />
      </group>
      <Cable
        radius={0.0056}
        color="#b74631"
        points={[
          new THREE.Vector3(...plugOut).applyEuler(new THREE.Euler(0, -0.25, 0)).toArray() as V3,
          [0.26, 0.12, 0.3],
          [0.32, 0.012, 0.36],
          [input[0] - 0.12, 0.012, 0.3],
          [input[0] - 0.13, 0.3, 0.17],
          [input[0] - 0.07, input[1] + 0.06, input[2] + 0.02],
          [input[0], input[1] + 0.05, input[2]],
          [input[0], input[1] + 0.012, input[2]],
        ]}
      />
    </group>
  );
}
