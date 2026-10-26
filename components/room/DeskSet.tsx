"use client";

import { Html } from "@react-three/drei";
import { useEffect, useMemo, type ReactNode } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { RoomItem } from "./content";
import {
  Box,
  Cable,
  Cylinder,
  Instanced,
  Rod,
  roundedRect,
  useCanvasTexture,
  type V3,
} from "./parts";

// Built in code at true scale (1 m ≈ 1.7 units, desk top at 1.28): smooth, softly bevelled
// surfaces carrying the real fine detail — every key, port, grille and cable.

/** deterministic noise so the wood grain doesn't reshuffle on every load */
function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ----------------------------------------------------------------------------- screens */

export function Screen({
  kind,
  width,
  height,
}: {
  kind: "work" | "projects" | "monitor";
  width: number;
  height: number;
}) {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 640;
    const g = c.getContext("2d")!;
    g.fillStyle = kind === "work" ? "#17242c" : "#d9d7c5";
    g.fillRect(0, 0, 1024, 640);
    if (kind === "work") {
      g.fillStyle = "#25333c";
      g.fillRect(0, 0, 1024, 52);
      g.fillStyle = "#c8d9d4";
      g.font = "20px monospace";
      g.fillText("rahul / workspace", 32, 34);
      [
        "// observe. understand. protect.",
        "const agent = await trace();",
        "",
        "  kernel.events()",
        "    .filter(isInteresting)",
        "    .observe(runtime);",
        "",
        "✓ system ready",
      ].forEach((s, i) => {
        g.fillStyle = i === 0 ? "#709a87" : i === 7 ? "#a8c888" : "#d4dad4";
        g.font = "26px monospace";
        g.fillText(s, 45, 115 + i * 55);
      });
    } else {
      g.fillStyle = "#bf6748";
      g.beginPath();
      g.arc(715, 260, 200, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#ede5d1";
      g.beginPath();
      g.arc(630, 220, 155, 0, Math.PI * 2);
      g.fill();
      // Quiet wallpaper: the readable interface is mounted in the physical screen on approach.
      g.fillStyle = "#c7cebb";
      g.fillRect(220, 530, 580, 65);
      ["#8b9e75", "#b8a17d", "#6e8d7f", "#b98365"].forEach((color, i) => {
        g.fillStyle = color;
        g.fillRect(290 + i * 115, 542, 42, 42);
      });
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [kind]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh>
      <planeGeometry args={[width, height]} />
      {/* the picture sits a hair in front of the glass: a depth offset keeps it winning, so it
          doesn't flicker against the glass as the camera moves */}
      <meshBasicMaterial map={texture} toneMapped={false} polygonOffset polygonOffsetFactor={-2} polygonOffsetUnits={-4} />
    </mesh>
  );
}

/* ----------------------------------------------------------------------------- laptops */

type Port = { z: number; w: number; h: number; round?: boolean };
type LaptopSpec = {
  at: V3;
  turn: number;
  width: number;
  depth: number;
  /** base thickness at the hinge and at the front edge (the M1 Air is a wedge) */
  thick: [number, number];
  body: string;
  keys: string;
  /** the 14" Pro sets its keys in a black well and flanks them with speaker grilles */
  pro: boolean;
  trackpad: [number, number];
  lid: { height: number; thick: number; tilt: number };
  /** the display's size and the height of its centre above the hinge */
  screen: { width: number; height: number; y: number };
  ports: { left: Port[]; right: Port[] };
};

// MacBook Pro 14" (space grey) and the rose-gold M1 MacBook Air, at real dimensions.
export const laptops: Record<"work" | "projects", LaptopSpec> = {
  work: {
    at: [0.92, 1.28, -0.58],
    turn: -0.17,
    width: 0.532,
    depth: 0.376,
    thick: [0.0264, 0.0264],
    body: "#55585c",
    keys: "#17181a",
    pro: true,
    trackpad: [0.25, 0.145],
    lid: { height: 0.364, thick: 0.0105, tilt: -0.33 },
    screen: { width: 0.51, height: 0.323, y: 0.188 },
    ports: {
      left: [
        { z: -0.11, w: 0.018, h: 0.004 },
        { z: -0.07, w: 0.014, h: 0.0055 },
        { z: -0.045, w: 0.014, h: 0.0055 },
        { z: 0.11, w: 0.006, h: 0.006, round: true },
      ],
      right: [
        { z: -0.11, w: 0.04, h: 0.0025 },
        { z: -0.045, w: 0.014, h: 0.0055 },
        { z: 0.01, w: 0.024, h: 0.0065 },
      ],
    },
  },
  projects: {
    at: [-0.42, 1.28, -0.31],
    turn: 0.07,
    width: 0.517,
    depth: 0.361,
    thick: [0.0274, 0.007],
    body: "#d6a996",
    keys: "#1e1b1b",
    pro: false,
    trackpad: [0.204, 0.136],
    lid: { height: 0.352, thick: 0.0095, tilt: -0.27 },
    screen: { width: 0.48, height: 0.304, y: 0.18 },
    ports: {
      left: [
        { z: -0.13, w: 0.014, h: 0.0055 },
        { z: -0.1, w: 0.014, h: 0.0055 },
      ],
      right: [{ z: -0.13, w: 0.006, h: 0.006, round: true }],
    },
  },
};
export type LaptopId = keyof typeof laptops;
const feet = 0.003;

function hinge(spec: LaptopSpec) {
  return new THREE.Vector3(
    0,
    feet + spec.thick[0],
    -spec.depth / 2 + spec.lid.thick / 2,
  );
}
/** Where the interactive screen sits, in room coordinates (before the room's floor offset). */
export function laptopScreen(id: LaptopId) {
  const spec = laptops[id];
  const up = new THREE.Vector3(0, 1, 0);
  const tilt = new THREE.Euler(spec.lid.tilt, 0, 0);
  const center = new THREE.Vector3(
    0,
    spec.screen.y,
    spec.lid.thick / 2 + 0.007,
  )
    .applyEuler(tilt)
    .add(hinge(spec))
    .applyAxisAngle(up, spec.turn)
    .add(new THREE.Vector3(...spec.at));
  const normal = new THREE.Vector3(0, 0, 1)
    .applyEuler(tilt)
    .applyAxisAngle(up, spec.turn);
  return { center, normal, width: spec.screen.width, height: spec.screen.height };
}

// Mac layout in key units (every row 14.5 wide); the bottom row's last 3 units are arrows.
const ROWS = [
  [1.5, ...Array(12).fill(1), 1],
  [...Array(13).fill(1), 1.5],
  [1.5, ...Array(12).fill(1), 1],
  [1.75, ...Array(11).fill(1), 1.75],
  [2.25, ...Array(10).fill(1), 2.25],
  [1, 1, 1, 1.25, 5, 1.25, 1],
];

function Keyboard({
  pitch,
  rowPitch,
  halfFnRow,
  color,
}: {
  pitch: number;
  rowPitch: number;
  halfFnRow: boolean;
  color: string;
}) {
  const groups = useMemo(() => {
    const gap = pitch * 0.17;
    const cap = 0.004;
    const keys: { x: number; z: number; w: number; d: number }[] = [];
    let z = 0;
    ROWS.forEach((row, r) => {
      const depth = r === 0 && halfFnRow ? 0.5 : 1;
      let x = 0;
      for (const w of row) {
        keys.push({ x: x + w / 2, z: z + depth / 2, w, d: depth });
        x += w;
      }
      if (r === ROWS.length - 1) {
        // inverted-T arrows: half-height left/right, split up/down
        keys.push({ x: x + 0.5, z: z + 0.75, w: 1, d: 0.5 });
        keys.push({ x: x + 1.5, z: z + 0.25, w: 1, d: 0.5 });
        keys.push({ x: x + 1.5, z: z + 0.75, w: 1, d: 0.5 });
        keys.push({ x: x + 2.5, z: z + 0.75, w: 1, d: 0.5 });
      }
      z += depth;
    });
    const map = new Map<string, { geometry: THREE.BufferGeometry; at: V3[] }>();
    for (const k of keys) {
      const w = k.w * pitch - gap;
      const d = k.d * rowPitch - gap;
      const id = `${w.toFixed(4)}|${d.toFixed(4)}`;
      if (!map.has(id))
        map.set(id, {
          geometry: new RoundedBoxGeometry(w, cap, d, 2, Math.min(w, d) * 0.16),
          at: [],
        });
      map
        .get(id)!
        .at.push([(k.x - 7.25) * pitch, cap / 2, (k.z - z / 2) * rowPitch]);
    }
    return [...map.values()];
  }, [pitch, rowPitch, halfFnRow]);
  useEffect(
    () => () => groups.forEach((g) => g.geometry.dispose()),
    [groups],
  );
  return (
    <>
      {groups.map((g, i) => (
        <Instanced key={i} geometry={g.geometry} positions={g.at}>
          <meshStandardMaterial color={color} roughness={0.55} />
        </Instanced>
      ))}
    </>
  );
}

function useGrilleTexture() {
  return useCanvasTexture(64, 64, (g) => {
    g.fillStyle = "#6f7276";
    g.fillRect(0, 0, 64, 64);
    g.fillStyle = "#1a1b1d";
    for (let y = 4; y < 64; y += 8)
      for (let x = (y / 8) % 2 ? 8 : 4; x < 64; x += 8) {
        g.beginPath();
        g.arc(x, y, 1.6, 0, Math.PI * 2);
        g.fill();
      }
  }, { repeat: [1, 9] });
}

export function Laptop({
  id,
  screenContent,
  interactive = false,
}: {
  id: LaptopId;
  screenContent?: ReactNode;
  interactive?: boolean;
}) {
  const spec = laptops[id];
  const { width, depth, thick, lid, screen } = spec;
  const metal = { color: spec.body, metalness: 0.55, roughness: 0.38 };
  // A rounded slab, tapered toward the front for the wedge-shaped Air.
  const base = useMemo(() => {
    const g = new RoundedBoxGeometry(width, thick[0], depth, 4, 0.011);
    const p = g.attributes.position;
    const ratio = thick[1] / thick[0];
    for (let i = 0; i < p.count; i++) {
      const t = (p.getZ(i) + depth / 2) / depth;
      const y = p.getY(i) + thick[0] / 2;
      p.setY(i, y * (1 + (ratio - 1) * t) - thick[0] / 2);
    }
    g.computeVertexNormals();
    return g;
  }, [width, depth, thick]);
  useEffect(() => () => base.dispose(), [base]);
  const grille = useGrilleTexture();

  const slope = Math.atan((thick[0] - thick[1]) / depth);
  const pitch = 0.0323;
  const margin = 0.022;
  const kbRows = spec.pro ? 6 : 5.5;
  const rowPitch = Math.min(
    pitch,
    (depth - margin - 0.032 - spec.trackpad[1]) / kbRows,
  );
  const kbDepth = kbRows * rowPitch;
  const kbZ = -depth / 2 + margin + kbDepth / 2;
  const padZ = depth / 2 - 0.018 - spec.trackpad[1] / 2;
  const sideY = (z: number) =>
    feet + (thick[0] + (thick[1] - thick[0]) * ((z + depth / 2) / depth)) / 2;
  const h = hinge(spec);

  return (
    <group rotation={[0, spec.turn, 0]}>
      <mesh geometry={base} position={[0, feet + thick[0] / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...metal} />
      </mesh>
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <Cylinder
            key={`${sx}${sz}`}
            at={[sx * (width / 2 - 0.035), feet / 2, sz * (depth / 2 - 0.035)]}
            radius={0.011}
            height={feet}
            color="#1b1c1d"
          />
        )),
      )}
      {/* everything on the deck follows its slope */}
      <group
        position={[0, feet + (thick[0] + thick[1]) / 2, 0]}
        rotation={[slope, 0, 0]}
      >
        {spec.pro && (
          <>
            <Box
              at={[0, 0.0004, kbZ]}
              size={[14.5 * pitch + 0.012, 0.0008, kbDepth + 0.012]}
              round={0.0004}
              color="#121314"
              shadow={false}
            />
            {[-1, 1].map((s) => (
              <mesh
                key={s}
                position={[s * (7.25 * pitch + 0.017), 0.0006, kbZ]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <planeGeometry args={[0.016, kbDepth]} />
                <meshStandardMaterial map={grille} roughness={0.6} metalness={0.3} />
              </mesh>
            ))}
          </>
        )}
        <group position={[0, spec.pro ? 0.0008 : 0, kbZ]}>
          <Keyboard
            pitch={pitch}
            rowPitch={rowPitch}
            halfFnRow={!spec.pro}
            color={spec.keys}
          />
        </group>
        <Box
          at={[0, 0.0005, padZ]}
          size={[spec.trackpad[0], 0.001, spec.trackpad[1]]}
          round={0.0005}
          color={spec.body}
          metalness={0.35}
          roughness={0.22}
          shadow={false}
        />
      </group>
      {(["left", "right"] as const).flatMap((side) =>
        spec.ports[side].map((port, i) => {
          const x = (side === "left" ? -1 : 1) * (width / 2 + 0.0002);
          return port.round ? (
            <Cylinder
              key={`${side}${i}`}
              at={[x, sideY(port.z), port.z]}
              radius={port.w / 2}
              height={0.002}
              rotation={[0, 0, Math.PI / 2]}
              color="#0d0e0f"
            />
          ) : (
            <Box
              key={`${side}${i}`}
              at={[x, sideY(port.z), port.z]}
              size={[0.002, port.h, port.w]}
              round={port.h / 2.2}
              color="#0d0e0f"
              shadow={false}
            />
          );
        }),
      )}
      <Rod
        from={[-width / 2 + 0.04, h.y - 0.003, -depth / 2 + 0.006]}
        to={[width / 2 - 0.04, h.y - 0.003, -depth / 2 + 0.006]}
        radius={0.0065}
        color="#26272a"
      />
      <group position={h} rotation={[lid.tilt, 0, 0]}>
        <Box
          at={[0, lid.height / 2, 0]}
          size={[width, lid.height, lid.thick]}
          round={0.0045}
          smooth={3}
          {...metal}
        />
        {/* black glass front with a camera in the top bezel */}
        <Box
          at={[0, lid.height / 2, lid.thick / 2 + 0.0004]}
          size={[width - 0.006, lid.height - 0.006, 0.0008]}
          round={0.0004}
          color="#0b0c0d"
          roughness={0.18}
          shadow={false}
        />
        <Cylinder
          at={[0, lid.height - 0.009, lid.thick / 2 + 0.0009]}
          radius={0.0028}
          height={0.0004}
          rotation={[Math.PI / 2, 0, 0]}
          color="#1f262c"
          roughness={0.1}
        />
        <group position={[0, screen.y, lid.thick / 2 + 0.0011]}>
          <Screen kind={id} width={screen.width} height={screen.height} />
          {screenContent && (
            <Html
              transform
              position={[0, 0, 0.006]}
              // drei sizes a transformed element at distanceFactor / 400 units per px
              distanceFactor={(screen.width * 400) / 1100}
              className="physical-screen"
              style={{
                width: 1100,
                height: 696,
                pointerEvents: interactive ? "auto" : "none",
                opacity: interactive ? 1 : 0,
                transition: "opacity 220ms ease",
              }}
              zIndexRange={[30, 20]}
            >
              <div
                inert={!interactive}
                aria-hidden={!interactive}
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                {screenContent}
              </div>
            </Html>
          )}
        </group>
      </group>
    </group>
  );
}

/* ----------------------------------------------------------------------- desk & monitor */

const top = 1.28;
const steel = { color: "#2a2d2f", metalness: 0.45, roughness: 0.5 };

function useOakTexture() {
  return useCanvasTexture(2048, 1024, (g) => {
    const random = seeded(7);
    g.fillStyle = "#a9794b";
    g.fillRect(0, 0, 2048, 1024);
    // broad colour drift across planks, then fine wavy grain
    for (let i = 0; i < 9; i++) {
      g.fillStyle = `rgba(${150 + random() * 40},${100 + random() * 30},60,${0.05 + random() * 0.06})`;
      g.fillRect(0, i * 114, 2048, 114);
    }
    for (let i = 0; i < 260; i++) {
      const y0 = random() * 1024;
      const amp = 2 + random() * 9;
      const freq = 0.002 + random() * 0.004;
      const phase = random() * 10;
      g.strokeStyle = `rgba(110,70,38,${0.04 + random() * 0.12})`;
      g.lineWidth = 0.6 + random() * 2.2;
      g.beginPath();
      for (let x = 0; x <= 2048; x += 16) {
        const y = y0 + Math.sin(x * freq + phase) * amp;
        if (x === 0) g.moveTo(x, y);
        else g.lineTo(x, y);
      }
      g.stroke();
    }
  });
}

function Monitor({ onSelect }: { onSelect: (id: RoomItem) => void }) {
  const W = 1.05,
    H = 0.62,
    bottom = 0.2;
  const cy = bottom + H / 2;
  return (
    <group
      position={[-0.2, top, -0.3]}
      onClick={(e) => {
        e.stopPropagation();
        if (e.delta < 4) onSelect("projects");
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      <Cylinder
        at={[0, 0.006, -0.06]}
        radius={0.14}
        height={0.012}
        color="#3b3e41"
        metalness={0.55}
        roughness={0.35}
      />
      <Box at={[0, 0.21, -0.075]} size={[0.062, 0.4, 0.024]} round={0.01} smooth={3} color="#3b3e41" metalness={0.55} roughness={0.35} />
      {/* the stand's cable cut-out */}
      <Box at={[0, 0.13, -0.088]} size={[0.03, 0.06, 0.004]} round={0.012} color="#121314" shadow={false} />
      <Box at={[0, cy - 0.04, -0.05]} size={[0.09, 0.07, 0.05]} round={0.015} color="#303336" />
      {/* rear housing with a vent strip */}
      <Box at={[0, cy, -0.022]} size={[0.62, 0.38, 0.03]} round={0.014} smooth={3} color="#26292b" />
      {Array.from({ length: 14 }, (_, i) => (
        <Box
          key={i}
          at={[-0.234 + i * 0.036, cy + 0.15, -0.0375]}
          size={[0.022, 0.006, 0.002]}
          round={0.0028}
          color="#121314"
          shadow={false}
        />
      ))}
      <Box at={[0, cy, 0]} size={[W, H, 0.016]} round={0.008} smooth={3} color="#232628" />
      <Box at={[0, cy, 0.0085]} size={[W - 0.008, H - 0.008, 0.001]} round={0.0005} color="#0b0c0d" roughness={0.18} shadow={false} />
      <group position={[0, cy + 0.008, 0.0095]}>
        <Screen kind="monitor" width={1.03} height={0.579} />
      </group>
      <Cylinder at={[0.47, bottom + 0.009, 0.0095]} radius={0.0022} height={0.0006} rotation={[Math.PI / 2, 0, 0]} color="#e9e5d8" />
      {/* power, down behind the desk */}
      <Cable
        radius={0.006}
        color="#1d1f20"
        points={[
          [0.12, cy - 0.05, -0.04],
          [0.14, 0.18, -0.12],
          [0.16, 0.008, -0.2],
          [0.18, 0.004, -0.28],
          [0.2, -0.25, -0.31],
          [0.22, -1.27, -0.34],
        ]}
      />
    </group>
  );
}

function Mug({ at }: { at: V3 }) {
  const glass = {
    color: "#f4f1ea",
    transparent: true,
    opacity: 0.16,
    roughness: 0.04,
    metalness: 0,
    clearcoat: 1,
    depthWrite: false,
    side: THREE.DoubleSide,
  } as const;
  return (
    <group position={at}>
      <mesh position={[0, 0.006, 0]}>
        <cylinderGeometry args={[0.066, 0.066, 0.012, 40]} />
        <meshPhysicalMaterial {...glass} opacity={0.3} />
      </mesh>
      <mesh position={[0, 0.062, 0]}>
        <cylinderGeometry args={[0.061, 0.06, 0.1, 40]} />
        <meshStandardMaterial color="#3b2416" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.113, 0]}>
        <cylinderGeometry args={[0.0615, 0.0615, 0.003, 40]} />
        <meshStandardMaterial color="#a8714a" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.066, 0.16, 40, 1, true]} />
        <meshPhysicalMaterial {...glass} />
      </mesh>
      <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.0702, 0.0032, 8, 48]} />
        <meshPhysicalMaterial {...glass} opacity={0.35} />
      </mesh>
      <mesh position={[0.07, 0.085, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.04, 0.008, 10, 24, Math.PI]} />
        <meshPhysicalMaterial {...glass} opacity={0.26} />
      </mesh>
    </group>
  );
}

function Notebook({ at }: { at: V3 }) {
  return (
    <group position={at} rotation={[0, 0.12, 0]}>
      <Box at={[0, 0.001, 0]} size={[0.25, 0.002, 0.36]} round={0.001} color="#3f4a40" />
      <Box at={[0.002, 0.0085, 0]} size={[0.244, 0.013, 0.352]} round={0.002} color="#efe9da" />
      <Box at={[0, 0.0162, 0]} size={[0.25, 0.0022, 0.36]} round={0.001} color="#3f4a40" />
      <Box at={[0.1, 0.0085, 0]} size={[0.006, 0.018, 0.362]} round={0.002} color="#1f2420" />
      <Rod from={[-0.06, 0.024, -0.11]} to={[0.07, 0.024, 0.12]} radius={0.0055} color="#1e2a33" metalness={0.2} />
      <Rod from={[-0.052, 0.03, -0.096]} to={[-0.03, 0.03, -0.057]} radius={0.0016} color="#b9bcbd" metalness={0.8} />
    </group>
  );
}

export function Desk({
  onSelect,
  onEnter,
}: {
  onSelect: (id: RoomItem) => void;
  onEnter: () => void;
}) {
  const oak = useOakTexture();
  const w = 2.8,
    d = 1.18,
    slab = 0.045;
  const board = useMemo(() => new RoundedBoxGeometry(w, slab, d, 4, 0.014), []);
  useEffect(() => () => board.dispose(), [board]);
  const legX = w / 2 - 0.12,
    legZ = d / 2 - 0.1;
  const under = top - slab;
  return (
    <group
      position={[0, 0, -0.7]}
      onClick={(e) => {
        e.stopPropagation();
        if (e.delta < 4) onEnter();
      }}
    >
      <mesh geometry={board} position={[0, top - slab / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial map={oak} roughness={0.62} />
      </mesh>
      {/* steel apron, legs and glides */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <Box at={[0, under - 0.02, s * legZ]} size={[2 * legX, 0.04, 0.03]} round={0.006} {...steel} />
          <Box at={[s * legX, under - 0.02, 0]} size={[0.03, 0.04, 2 * legZ]} round={0.006} {...steel} />
        </group>
      ))}
      {[-1, 1].flatMap((sx) =>
        [-1, 1].map((sz) => (
          <group key={`${sx}${sz}`}>
            <Box
              at={[sx * legX, (under + 0.012) / 2, sz * legZ]}
              size={[0.045, under - 0.012, 0.045]}
              round={0.008}
              {...steel}
            />
            <Cylinder at={[sx * legX, 0.006, sz * legZ]} radius={0.026} height={0.012} color="#4a4e50" />
          </group>
        )),
      )}
      <Monitor onSelect={onSelect} />
      <Mug at={[-1.06, top, 0.2]} />
      <Notebook at={[-1.08, top, -0.3]} />
      {/* USB-C from the monitor to the personal laptop's left port */}
      <Cable
        radius={0.004}
        color="#e8e4da"
        points={[
          [-0.42, top + 0.3, -0.33],
          [-0.4, top + 0.12, -0.38],
          [-0.42, top + 0.005, -0.42],
          [-0.62, top + 0.005, -0.25],
          [-0.77, top + 0.005, 0.08],
          [-0.75, top + 0.008, 0.26],
          [-0.695, top + 0.016, 0.275],
        ]}
      />
    </group>
  );
}

/* ---------------------------------------------------------------------------- chair */

function useMeshTexture() {
  return useCanvasTexture(128, 128, (g) => {
    g.clearRect(0, 0, 128, 128);
    g.strokeStyle = "rgba(38,43,41,0.9)";
    g.lineWidth = 3;
    for (let i = -128; i < 256; i += 16) {
      g.beginPath();
      g.moveTo(i, 0);
      g.lineTo(i + 128, 128);
      g.stroke();
      g.beginPath();
      g.moveTo(i + 128, 0);
      g.lineTo(i, 128);
      g.stroke();
    }
  }, { repeat: [7, 9] });
}

export function Chair() {
  const mesh = useMeshTexture();
  const back = useMemo(() => {
    const shape = roundedRect(0.72, 0.84, 0.13);
    const panel = new THREE.ShapeGeometry(shape, 12);
    // ShapeGeometry UVs are raw coordinates; normalise so the texture repeat means something
    const uv = panel.attributes.uv;
    for (let i = 0; i < uv.count; i++)
      uv.setXY(i, uv.getX(i) / 0.72 + 0.5, uv.getY(i) / 0.84 + 0.5);
    const frame = shape
      .getSpacedPoints(64)
      .map((p) => [p.x, p.y, 0] as V3);
    return { panel, frame };
  }, []);
  useEffect(() => () => back.panel.dispose(), [back]);
  const fabric = "#6f7f78";
  const dark = "#232628";
  return (
    // faces the desk (−z); the back is toward the visitor
    <group position={[0.12, 0, 1.05]}>
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i * Math.PI * 2) / 5 + Math.PI / 2;
        const c = Math.cos(a),
          s = Math.sin(a);
        return (
          <group key={i}>
            <Box
              at={[c * 0.27, 0.115, s * 0.27]}
              size={[0.06, 0.035, 0.46]}
              rotation={[0, Math.PI / 2 - a, 0]}
              round={0.015}
              smooth={3}
              color={dark}
              roughness={0.45}
            />
            <Box at={[c * 0.49, 0.088, s * 0.49]} size={[0.035, 0.04, 0.035]} round={0.01} color={dark} />
            {[-1, 1].map((side) => (
              <Cylinder
                key={side}
                at={[c * 0.49 - s * side * 0.014, 0.042, s * 0.49 + c * side * 0.014]}
                radius={0.042}
                height={0.016}
                rotation={[0, -a, Math.PI / 2]}
                color="#1b1d1e"
                roughness={0.5}
              />
            ))}
          </group>
        );
      })}
      <Cylinder at={[0, 0.12, 0]} radius={0.06} height={0.05} color={dark} />
      <Cylinder at={[0, 0.29, 0]} radius={0.034} height={0.3} color={dark} roughness={0.4} />
      <Cylinder at={[0, 0.5, 0]} radius={0.022} height={0.16} color="#c9cdd0" metalness={0.9} roughness={0.2} />
      <Box at={[0, 0.61, 0]} size={[0.28, 0.05, 0.3]} round={0.012} color={dark} />
      <Rod from={[0.12, 0.6, -0.08]} to={[0.24, 0.585, -0.16]} radius={0.007} color={dark} />
      <Box at={[0, 0.65, 0]} size={[0.78, 0.03, 0.74]} round={0.012} color={dark} />
      <Box at={[0, 0.71, -0.01]} size={[0.82, 0.1, 0.78]} round={0.048} smooth={6} color={fabric} roughness={0.95} />
      {[-1, 1].map((s) => (
        <group key={s}>
          <Box at={[s * 0.39, 0.665, 0.08]} size={[0.07, 0.025, 0.05]} round={0.008} color={dark} />
          <Box at={[s * 0.43, 0.79, 0.08]} size={[0.04, 0.24, 0.05]} round={0.012} color={dark} />
          <Box at={[s * 0.43, 0.925, 0.04]} size={[0.085, 0.035, 0.28]} round={0.016} smooth={4} color="#2c3032" roughness={0.8} />
        </group>
      ))}
      {/* spine from the seat to the mesh back */}
      <Cable
        radius={0.028}
        color={dark}
        points={[
          [0, 0.63, 0.15],
          [0, 0.66, 0.37],
          [0, 0.8, 0.45],
          [0, 0.96, 0.46],
        ]}
      />
      <group position={[0, 1.36, 0.46]} rotation={[0.12, 0, 0]}>
        <Cable radius={0.019} color={dark} points={back.frame} closed />
        <mesh geometry={back.panel}>
          <meshStandardMaterial
            map={mesh}
            color="#55605b"
            transparent
            alphaTest={0.3}
            side={THREE.DoubleSide}
            roughness={0.9}
          />
        </mesh>
        <Box at={[0, -0.24, -0.02]} size={[0.6, 0.1, 0.035]} round={0.016} smooth={4} color={fabric} roughness={0.95} />
      </group>
    </group>
  );
}

/* ----------------------------------------------------------------------------- lamp */

export function Lamp() {
  const olive = "#6d7b58";
  const brass = { color: "#c8a45c", metalness: 0.8, roughness: 0.3 };
  return (
    <group position={[1, top, -1.03]}>
      <Cylinder at={[0, 0.014, 0]} radius={0.095} top={0.09} height={0.028} color={olive} roughness={0.6} />
      <Cylinder at={[0, 0.033, 0]} radius={0.016} height={0.012} {...brass} />
      <Rod from={[0, 0.03, 0]} to={[0, 0.63, 0]} radius={0.008} {...brass} />
      <mesh position={[0, 0.635, 0]} castShadow>
        <sphereGeometry args={[0.016, 16, 12]} />
        <meshStandardMaterial {...brass} />
      </mesh>
      {/* the shade tips forward over the desk */}
      <group position={[0, 0.635, 0.01]} rotation={[-0.75, 0, 0]}>
        <Cylinder at={[0, -0.006, 0]} radius={0.017} height={0.03} {...brass} />
        <mesh position={[0, -0.1, 0]} castShadow>
          <coneGeometry args={[0.11, 0.17, 48, 1, true]} />
          <meshStandardMaterial color={olive} roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <coneGeometry args={[0.108, 0.168, 48, 1, true]} />
          <meshStandardMaterial color="#efe6cf" side={THREE.BackSide} />
        </mesh>
        <mesh position={[0, -0.13, 0]}>
          <sphereGeometry args={[0.03, 16, 12]} />
          <meshStandardMaterial color="#ffe7ac" />
        </mesh>
      </group>
      <Cable
        radius={0.004}
        color="#2b2b2a"
        points={[
          [0, 0.008, -0.09],
          [0.01, 0.004, -0.16],
          [0.05, 0.004, -0.24],
          [0.07, -0.08, -0.27],
          [0.09, -1.27, -0.3],
        ]}
      />
    </group>
  );
}
