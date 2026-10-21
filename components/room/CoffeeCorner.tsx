"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Box, Cylinder, Rod, useCanvasTexture, type V3 } from "./parts";

// The coffee stand, in the same toy style as the rest of the room but with Rahul's actual
// setup: a Hario Switch on a Timemore glass server on the scale, an AeroPress Clear, a black
// cup, all on an end-grain board; the beans (a Corridor Seven bag and the Yung Gun boxes) on
// the shelf below. The glass pieces are turned profiles, (radius, height) pairs from the base up.

const TOP = 1.065; // table top
const BOARD = TOP + 0.035;

function Glass({
  profile,
  at = [0, 0, 0],
  color = "#eef5f2",
  opacity = 0.3,
}: {
  profile: [number, number][];
  at?: V3;
  color?: string;
  opacity?: number;
}) {
  const geometry = useMemo(
    () =>
      new THREE.LatheGeometry(
        profile.map(([r, y]) => new THREE.Vector2(r, y)),
        48,
      ),
    [profile],
  );
  return (
    <mesh geometry={geometry} position={at} renderOrder={2}>
      <meshPhysicalMaterial
        color={color}
        transparent
        opacity={opacity}
        roughness={0.06}
        clearcoat={1}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

function Solid({
  profile,
  at = [0, 0, 0],
  color,
  roughness = 0.6,
}: {
  profile: [number, number][];
  at?: V3;
  color: string;
  roughness?: number;
}) {
  const geometry = useMemo(
    () =>
      new THREE.LatheGeometry(
        profile.map(([r, y]) => new THREE.Vector2(r, y)),
        48,
      ),
    [profile],
  );
  return (
    <mesh geometry={geometry} position={at} castShadow receiveShadow>
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Timemore server: a short neck, sides flaring out to a wide flat base
const SERVER: [number, number][] = [
  [0, 0],
  [0.098, 0],
  [0.108, 0.012],
  [0.108, 0.04],
  [0.098, 0.08],
  [0.082, 0.12],
  [0.068, 0.155],
  [0.062, 0.18],
  [0.062, 0.2],
  [0.066, 0.205],
];
const SERVER_COFFEE: [number, number][] = [
  [0, 0.006],
  [0.1, 0.006],
  [0.103, 0.04],
  [0.097, 0.07],
  [0, 0.07],
];
// Hario Switch: glass cone with a paper filter and the morning's grounds
const CONE: [number, number][] = [
  [0.03, 0],
  [0.06, 0.04],
  [0.095, 0.09],
  [0.122, 0.13],
  [0.126, 0.135],
];
const FILTER: [number, number][] = [
  [0.022, 0.006],
  [0.055, 0.045],
  [0.088, 0.09],
  [0.114, 0.128],
];
const GROUNDS: [number, number][] = [
  [0, 0.03],
  [0.042, 0.03],
  [0.06, 0.05],
  [0, 0.05],
];
// AeroPress Clear: brew chamber with its flange, plunger pushed part way in
const CHAMBER: [number, number][] = [
  [0.062, 0],
  [0.062, 0.2],
  [0.066, 0.205],
];
const FLANGE: [number, number][] = [
  [0.062, 0],
  [0.105, 0],
  [0.105, 0.008],
  [0.062, 0.008],
];
const PLUNGER: [number, number][] = [
  [0.054, 0],
  [0.054, 0.21],
  [0.064, 0.215],
  [0.064, 0.225],
];
const CUP: [number, number][] = [
  [0, 0],
  [0.05, 0],
  [0.058, 0.01],
  [0.064, 0.085],
  [0.06, 0.088],
  [0.055, 0.02],
  [0, 0.02],
];

function useEndGrain() {
  return useCanvasTexture(512, 256, (g) => {
    const browns = ["#7b4a2a", "#8d5833", "#6c3f24", "#9a6439", "#81502e"];
    let seed = 11;
    const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let x = 0; x < 16; x++)
      for (let y = 0; y < 8; y++) {
        g.fillStyle = browns[Math.floor(random() * browns.length)];
        g.fillRect(x * 32, y * 32, 32, 32);
        // growth rings from a corner off the tile
        const cx = x * 32 + (random() < 0.5 ? -10 : 42);
        const cy = y * 32 + (random() < 0.5 ? -10 : 42);
        g.save();
        g.beginPath();
        g.rect(x * 32, y * 32, 32, 32);
        g.clip();
        g.strokeStyle = "rgba(40,20,8,0.22)";
        for (let r = 4; r < 70; r += 3.5 + random() * 2.5) {
          g.lineWidth = 0.6 + random() * 0.6;
          g.beginPath();
          g.arc(cx, cy, r, 0, Math.PI * 2);
          g.stroke();
        }
        g.restore();
        g.strokeStyle = "rgba(30,15,6,0.35)";
        g.strokeRect(x * 32, y * 32, 32, 32);
      }
  });
}

function Board() {
  const grain = useEndGrain();
  return (
    <mesh position={[-0.12, TOP + 0.0175, 0.02]} castShadow receiveShadow>
      <boxGeometry args={[1.02, 0.035, 0.5]} />
      <meshStandardMaterial map={grain} roughness={0.55} />
    </mesh>
  );
}

/** The pour-over stack: scale, Timemore server, Switch on top. */
function PourOver({ at }: { at: V3 }) {
  const scaleTop = 0.03;
  const serverTop = scaleTop + 0.205;
  return (
    <group position={at}>
      {/* the scale: matte black, white ring button, small LCD */}
      <Box
        at={[0, scaleTop / 2, 0]}
        size={[0.34, scaleTop, 0.24]}
        round={0.012}
        color="#24272a"
        roughness={0.5}
      />
      <Cylinder
        at={[-0.135, scaleTop + 0.002, 0.06]}
        radius={0.024}
        height={0.004}
        color="#f1f0ea"
      />
      <Cylinder
        at={[-0.135, scaleTop + 0.003, 0.06]}
        radius={0.014}
        height={0.004}
        color="#24272a"
      />
      <Box
        at={[-0.135, scaleTop + 0.001, -0.03]}
        size={[0.04, 0.003, 0.08]}
        round={0.001}
        color="#a9b0a6"
      />
      {/* the server, a little coffee in it, squared glass handle at the back */}
      <Solid
        profile={SERVER_COFFEE}
        at={[0, scaleTop, 0]}
        color="#170b05"
        roughness={0.2}
      />
      <Glass profile={SERVER} at={[0, scaleTop, 0]} />
      {(
        [
          [
            [0.06, 0.18, 0],
            [0.15, 0.18, 0],
          ],
          [
            [0.15, 0.18, 0],
            [0.15, 0.06, 0],
          ],
          [
            [0.15, 0.06, 0],
            [0.1, 0.035, 0],
          ],
        ] as [V3, V3][]
      ).map(([from, to], i) => (
        <group
          key={i}
          position={[0, scaleTop, 0]}
          rotation={[0, Math.PI / 2, 0]}
        >
          <Rod
            from={from}
            to={to}
            radius={0.009}
            color="#dfe9e5"
            metalness={0}
            roughness={0.1}
          />
        </group>
      ))}
      {/* the Switch: black base with its lever, glass cone, paper filter, grounds */}
      <Cylinder
        at={[0, serverTop + 0.016, 0]}
        radius={0.085}
        top={0.08}
        height={0.032}
        color="#1e2022"
        roughness={0.45}
      />
      <Box
        at={[0.1, serverTop + 0.02, 0]}
        size={[0.07, 0.012, 0.03]}
        round={0.005}
        color="#c9d3cf"
        roughness={0.15}
      />
      <Solid
        profile={FILTER}
        at={[0, serverTop + 0.032, 0]}
        color="#f4f1e8"
        roughness={0.9}
      />
      <Solid
        profile={GROUNDS}
        at={[0, serverTop + 0.032, 0]}
        color="#4a2b17"
        roughness={0.95}
      />
      <Glass profile={CONE} at={[0, serverTop + 0.032, 0]} opacity={0.35} />
    </group>
  );
}

function AeroPress({ at }: { at: V3 }) {
  return (
    <group position={at}>
      {/* filter cap, then the chamber standing on its flange */}
      <Cylinder
        at={[0, 0.012, 0]}
        radius={0.068}
        height={0.024}
        color="#2b2e30"
      />
      <Glass profile={CHAMBER} at={[0, 0.024, 0]} />
      <Glass profile={FLANGE} at={[0, 0.046, 0]} opacity={0.4} />
      {/* the plunger and its grey seal, sitting part way in */}
      <Cylinder
        at={[0, 0.16, 0]}
        radius={0.058}
        height={0.026}
        color="#3c4246"
      />
      <Glass profile={PLUNGER} at={[0, 0.173, 0]} opacity={0.26} />
    </group>
  );
}

/** A bag or box of beans, with a label on the front. */
function Beans({
  at,
  size,
  color,
  label,
  labelColor,
  labelSize,
  rotation = 0,
  mark,
}: {
  at: V3;
  size: V3;
  color: string;
  label: V3;
  labelColor: string;
  labelSize: [number, number];
  rotation?: number;
  mark?: string;
}) {
  return (
    <group position={at} rotation={[0, rotation, 0]}>
      <Box at={[0, size[1] / 2, 0]} size={size} round={0.012} color={color} />
      <Box
        at={label}
        size={[labelSize[0], labelSize[1], 0.004]}
        round={0.002}
        color={labelColor}
      />
      {mark && (
        <Box
          at={[label[0] + labelSize[0] * 0.3, label[1], label[2] + 0.003]}
          size={[0.014, labelSize[1] * 0.6, 0.003]}
          round={0.001}
          color={mark}
        />
      )}
    </group>
  );
}

export function CoffeeCorner() {
  const shelf = 0.375;
  return (
    <group rotation={[0, -Math.PI / 2, 0]}>
      {/* the stand */}
      <Box at={[0, 1.02, 0]} size={[1.55, 0.09, 0.74]} color="#a37c51" />
      {[-0.65, 0.65].flatMap((x) =>
        [-0.27, 0.27].map((z) => (
          <Box
            key={`${x}${z}`}
            at={[x, 0.5, z]}
            size={[0.055, 1, 0.055]}
            color="#474f43"
          />
        )),
      )}
      <Box at={[0, 0.35, 0]} size={[1.4, 0.05, 0.61]} color="#b38d61" />
      <Board />
      <PourOver at={[-0.34, BOARD, 0.02]} />
      <AeroPress at={[0.1, BOARD, -0.08]} />
      <Solid
        profile={CUP}
        at={[0.3, BOARD, 0.14]}
        color="#26282a"
        roughness={0.35}
      />
      {/* the beans on the shelf: Corridor Seven's white bag, the two Yung Gun boxes standing,
          and the yellow one lying flat */}
      <Beans
        at={[-0.42, shelf, 0.02]}
        size={[0.22, 0.36, 0.12]}
        color="#f1efe8"
        label={[0, 0.25, 0.062]}
        labelColor="#ef8a2b"
        labelSize={[0.17, 0.11]}
        mark="#1d1d1d"
      />
      <Beans
        at={[-0.08, shelf, 0.03]}
        size={[0.17, 0.27, 0.13]}
        color="#1f7b83"
        label={[0, 0.13, 0.067]}
        labelColor="#d9b24f"
        labelSize={[0.1, 0.12]}
        rotation={-0.06}
      />
      <Beans
        at={[0.14, shelf, 0.03]}
        size={[0.17, 0.27, 0.13]}
        color="#1c2333"
        label={[0, 0.13, 0.067]}
        labelColor="#f0d443"
        labelSize={[0.1, 0.12]}
        rotation={0.05}
        mark="#e25a6e"
      />
      <Beans
        at={[0.44, shelf, 0.04]}
        size={[0.26, 0.055, 0.19]}
        color="#e7b52e"
        label={[0, 0.028, 0.097]}
        labelColor="#c4392f"
        labelSize={[0.16, 0.026]}
        rotation={0.2}
      />
    </group>
  );
}
