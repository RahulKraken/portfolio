"use client";

import {
  Canvas,
  useFrame,
  useThree,
  type ThreeEvent,
} from "@react-three/fiber";
import { CameraControls, Html, RoundedBox } from "@react-three/drei";
import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import * as THREE from "three";
import type { RoomItem } from "./content";

type V3 = [number, number, number];
type SceneProps = {
  selected: RoomItem | null;
  night: boolean;
  reduced: boolean;
  onSelect: (id: RoomItem) => void;
  onReady: () => void;
};
const ink = "#292d30";

function Box({
  at = [0, 0, 0],
  size = [1, 1, 1],
  color = "#ddd",
  rotation = [0, 0, 0],
  round = 0.025,
  ...props
}: {
  at?: V3;
  size?: V3;
  color?: string;
  rotation?: V3;
  round?: number;
  metalness?: number;
  roughness?: number;
}) {
  return (
    <RoundedBox
      position={at}
      args={size}
      radius={Math.min(round, ...size.map((v) => v / 3))}
      smoothness={2}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={color}
        roughness={props.roughness ?? 0.65}
        metalness={props.metalness ?? 0.05}
      />
    </RoundedBox>
  );
}
function Rod({
  from,
  to,
  radius = 0.025,
  color = ink,
}: {
  from: V3;
  to: V3;
  radius?: number;
  color?: string;
}) {
  const { mid, quat, length } = useMemo(() => {
    const a = new THREE.Vector3(...from),
      b = new THREE.Vector3(...to);
    const direction = b.clone().sub(a);
    return {
      mid: a.clone().add(b).multiplyScalar(0.5),
      length: direction.length(),
      quat: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.normalize(),
      ),
    };
  }, [from, to]);
  return (
    <mesh position={mid} quaternion={quat} castShadow>
      <cylinderGeometry args={[radius, radius, length, 10]} />
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.3} />
    </mesh>
  );
}
function Cylinder({
  at,
  radius = 0.2,
  height = 0.2,
  color = "#ddd",
  rotation = [0, 0, 0],
  top,
}: {
  at: V3;
  radius?: number;
  height?: number;
  color?: string;
  rotation?: V3;
  top?: number;
}) {
  return (
    <mesh position={at} rotation={rotation} castShadow receiveShadow>
      <cylinderGeometry args={[top ?? radius, radius, height, 32]} />
      <meshStandardMaterial color={color} roughness={0.65} />
    </mesh>
  );
}
function Screen({
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
      g.fillStyle = "#343b30";
      g.font = "bold 76px Georgia";
      g.fillText(
        kind === "monitor" ? "Make something." : "Hello, world.",
        65,
        130,
      );
      g.font = "25px monospace";
      g.fillText("a little curiosity goes a long way", 68, 190);
      g.fillStyle = "#313d32";
      g.fillRect(65, 345, 420, 185);
      g.fillStyle = "#e7dfc8";
      g.font = "24px monospace";
      g.fillText("MEUSIC / PILLAR", 90, 400);
      g.fillText("APEX ONE / EXPERIMENTS", 90, 448);
      g.fillStyle = "#454f3f";
      g.font = "20px monospace";
      g.fillText("RAHUL KUMAR                  PERSONAL COMPUTER", 65, 600);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [kind]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={[0, 0, 0.04]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
function Laptop({
  at,
  personal = false,
  rotation = 0,
}: {
  at: V3;
  personal?: boolean;
  rotation?: number;
}) {
  const color = personal ? "#bb9182" : "#666c72";
  return (
    <group position={at} rotation={[0, rotation, 0]}>
      <Box
        size={[0.82, 0.035, 0.56]}
        at={[0, 0.025, 0]}
        color={color}
        metalness={0.65}
      />
      <Box size={[0.69, 0.007, 0.25]} at={[0, 0.046, -0.075]} color="#303337" />
      {Array.from({ length: 5 }, (_, i) => (
        <Box
          key={i}
          at={[0, 0.052, -0.16 + i * 0.045]}
          size={[0.64, 0.004, 0.008]}
          color="#8d9294"
          round={0}
        />
      ))}
      <Box
        at={[0, 0.047, 0.14]}
        size={[0.26, 0.004, 0.12]}
        color={personal ? "#caa99c" : "#85898c"}
      />
      <group position={[0, 0.33, -0.235]} rotation={[-0.17, 0, 0]}>
        <Box size={[0.83, 0.57, 0.027]} color={color} />
        <Box at={[0, 0, 0.017]} size={[0.79, 0.53, 0.007]} color="#101516" />
        <Screen
          kind={personal ? "projects" : "work"}
          width={0.75}
          height={0.475}
        />
      </group>
    </group>
  );
}
function Mug({ at }: { at: V3 }) {
  return (
    <group position={at}>
      <mesh castShadow>
        <cylinderGeometry args={[0.085, 0.075, 0.22, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#f7eee0"
          transparent
          opacity={0.35}
          roughness={0.12}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      <Cylinder
        at={[0, -0.04, 0]}
        radius={0.072}
        height={0.11}
        color="#673c23"
      />
      <mesh position={[0.105, 0, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.068, 0.013, 8, 24]} />
        <meshStandardMaterial color="#d8c9ad" />
      </mesh>
    </group>
  );
}
function Desk({ onSelect }: { onSelect: SceneProps["onSelect"] }) {
  return (
    <group position={[0, 0, -0.7]}>
      <Box
        at={[0, 1.22, 0]}
        size={[2.8, 0.12, 1.18]}
        color="#b5895a"
        round={0.035}
      />
      {[-1.23, 1.23].map((x) => (
        <group key={x}>
          <Rod from={[x, 0.06, 0.48]} to={[x, 1.16, -0.4]} radius={0.035} />
          <Rod from={[x, 0.06, -0.4]} to={[x, 1.16, 0.48]} radius={0.035} />
        </group>
      ))}
      <Box at={[0, 0.55, -0.4]} size={[2.5, 0.045, 0.045]} color={ink} />
      <Cylinder
        at={[-0.2, 1.32, -0.28]}
        radius={0.17}
        height={0.04}
        color="#555957"
      />
      <Rod
        from={[-0.2, 1.32, -0.28]}
        to={[-0.2, 1.64, -0.3]}
        radius={0.04}
        color="#6d716e"
      />
      <group
        position={[-0.2, 1.99, -0.32]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect("projects");
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        <Box size={[1.4, 0.85, 0.055]} color="#272d2c" />
        <Screen kind="monitor" width={1.32} height={0.765} />
      </group>
      <Mug at={[-1.06, 1.39, 0.2]} />
      <Box
        at={[-1.08, 1.29, -0.3]}
        size={[0.28, 0.045, 0.18]}
        color="#e4dfcc"
      />
      <Rod
        from={[-0.2, 1.5, -0.34]}
        to={[0.5, 1.3, -0.4]}
        radius={0.008}
        color="#454a43"
      />
    </group>
  );
}
function Chair() {
  return (
    <group position={[0.12, 0, 1.05]} rotation={[0, -0.2, 0]}>
      <Cylinder at={[0, 0.34, 0]} radius={0.045} height={0.5} color="#646965" />
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i * Math.PI * 2) / 5;
        return (
          <group key={i}>
            <Rod
              from={[0, 0.12, 0]}
              to={[Math.cos(a) * 0.43, 0.09, Math.sin(a) * 0.43]}
              radius={0.026}
              color="#555c59"
            />
            <Cylinder
              at={[Math.cos(a) * 0.43, 0.065, Math.sin(a) * 0.43]}
              radius={0.055}
              height={0.06}
              color="#252b2a"
              rotation={[Math.PI / 2, 0, a]}
            />
          </group>
        );
      })}
      <Box
        at={[0, 0.69, 0]}
        size={[0.72, 0.13, 0.7]}
        color="#778378"
        round={0.09}
      />
      <Box
        at={[0, 1.12, 0.33]}
        size={[0.69, 0.73, 0.12]}
        color="#778378"
        rotation={[-0.1, 0, 0]}
        round={0.07}
      />
      {[-0.42, 0.42].map((x) => (
        <group key={x}>
          <Rod from={[x, 0.64, 0.16]} to={[x, 0.97, 0.16]} radius={0.025} />
          <Box
            at={[x, 0.98, 0.03]}
            size={[0.095, 0.055, 0.43]}
            color="#39413b"
          />
        </group>
      ))}
    </group>
  );
}
function Wheel({ at, sport = false }: { at: V3; sport?: boolean }) {
  return (
    <group position={at}>
      <mesh castShadow>
        <torusGeometry args={[0.32, sport ? 0.095 : 0.075, 12, 40]} />
        <meshStandardMaterial color="#25282b" roughness={0.92} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.255, 0.026, 8, 40]} />
        <meshStandardMaterial
          color={sport ? "#353a3b" : "#ef672f"}
          metalness={0.5}
        />
      </mesh>
      <Cylinder
        at={[0, 0, 0]}
        radius={0.19}
        height={0.035}
        color="#888b85"
        rotation={[Math.PI / 2, 0, 0]}
      />
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i * Math.PI) / 3;
        return (
          <Rod
            key={i}
            from={[0, 0, 0]}
            to={[Math.cos(a) * 0.255, Math.sin(a) * 0.255, 0]}
            radius={0.016}
            color="#434a49"
          />
        );
      })}
      <Cylinder
        at={[0, 0, 0]}
        radius={0.065}
        height={0.19}
        color="#555c58"
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}
function Bike({ sport = false }: { sport?: boolean }) {
  const paint = sport ? "#cf352a" : "#315b93";
  return (
    <group rotation={[0, 0, -0.055]}>
      <Wheel at={[-0.7, 0.43, 0]} sport={sport} />
      <Wheel at={[0.72, 0.43, 0]} sport={sport} />
      <Rod
        from={[-0.7, 0.43, 0]}
        to={[-0.2, 0.7, 0]}
        radius={0.065}
        color="#555b59"
      />
      {[-0.13, 0.13].map((y) => (
        <group key={y}>
          <Rod
            from={[-0.65, 0.46, y]}
            to={[0.18, 1.02, y]}
            color={sport ? "#303a3b" : "#ed6a2a"}
            radius={0.036}
          />
          <Rod
            from={[-0.5, 0.93, y]}
            to={[0.18, 0.57, y]}
            color={sport ? "#303a3b" : "#ed6a2a"}
            radius={0.03}
          />
          <Rod
            from={[0.72, 0.43, y]}
            to={[0.46, 1.12, y]}
            radius={0.037}
            color={sport ? "#d4ad52" : "#7d8585"}
          />
        </group>
      ))}
      <Box
        at={[-0.4, 1.02, 0]}
        size={[0.64, 0.11, 0.32]}
        color="#292e30"
        rotation={[0, 0, -0.05]}
      />
      <Box
        at={[-0.76, 1.08, 0]}
        size={[0.35, 0.13, 0.26]}
        color={paint}
        rotation={[0, 0, -0.15]}
      />
      <Box
        at={[-0.01, 0.91, 0]}
        size={[0.62, 0.39, 0.38]}
        color={paint}
        rotation={[0, 0, -0.2]}
        round={0.11}
      />
      <Cylinder
        at={[-0.04, 0.63, 0]}
        radius={0.19}
        height={0.32}
        color="#555a55"
        rotation={[Math.PI / 2, 0, 0]}
      />
      {sport ? (
        <>
          <Box
            at={[0.26, 0.69, 0]}
            size={[0.65, 0.49, 0.41]}
            color={paint}
            rotation={[0, 0, 0.32]}
            round={0.09}
          />
          <Box
            at={[0.55, 1.05, 0]}
            size={[0.4, 0.3, 0.38]}
            color={paint}
            rotation={[0, 0, -0.25]}
            round={0.08}
          />
          <Box
            at={[0.45, 1.26, 0]}
            size={[0.23, 0.22, 0.28]}
            color="#8eabaf"
            rotation={[0, 0, 0.45]}
            round={0.05}
          />
          <Box
            at={[0.73, 1.085, 0.14]}
            size={[0.1, 0.045, 0.08]}
            color="#fff1c8"
          />
        </>
      ) : (
        <>
          <Box
            at={[0.55, 1.08, 0]}
            size={[0.16, 0.3, 0.22]}
            color="#3b4144"
            rotation={[0, 0, 0.15]}
          />
          <Box at={[0.64, 1.08, 0]} size={[0.025, 0.2, 0.17]} color="#d9e9e4" />
          <Box
            at={[0.18, 0.77, 0.195]}
            size={[0.24, 0.09, 0.025]}
            color="#f57937"
            rotation={[0, 0, -0.25]}
          />
        </>
      )}
      <Rod from={[0.39, 1.18, -0.3]} to={[0.39, 1.18, 0.3]} radius={0.026} />
      <Rod
        from={[-0.2, 0.48, 0.2]}
        to={[-0.65, 0.56, 0.24]}
        radius={0.055}
        color="#6a6b61"
      />
      <Rod from={[-0.2, 0.65, 0.1]} to={[-0.25, 0.04, 0.36]} radius={0.018} />
    </group>
  );
}
function Guitar() {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.08, 0.25);
    s.bezierCurveTo(-0.1, 0.52, -0.3, 0.49, -0.22, 0.17);
    s.bezierCurveTo(-0.5, 0.15, -0.47, -0.18, -0.25, -0.29);
    s.bezierCurveTo(-0.05, -0.43, 0.27, -0.32, 0.3, -0.15);
    s.bezierCurveTo(0.44, 0.1, 0.15, 0.2, 0.2, 0.4);
    s.bezierCurveTo(0.12, 0.52, 0.11, 0.27, 0.08, 0.25);
    s.closePath();
    return s;
  }, []);
  return (
    <group rotation={[0, -0.25, -0.12]}>
      <mesh castShadow>
        <extrudeGeometry
          args={[
            shape,
            {
              depth: 0.075,
              bevelEnabled: true,
              bevelSize: 0.025,
              bevelThickness: 0.025,
              bevelSegments: 2,
              steps: 1,
            },
          ]}
        />
        <meshStandardMaterial color="#171f24" roughness={0.24} />
      </mesh>
      <mesh position={[0, 0, 0.102]} scale={[0.74, 0.77, 0.2]}>
        <extrudeGeometry args={[shape, { depth: 0.03, bevelEnabled: false }]} />
        <meshStandardMaterial color="#f1e8cd" />
      </mesh>
      <Box
        at={[0, 0.65, 0.03]}
        size={[0.085, 0.88, 0.045]}
        color="#c69c59"
        round={0.008}
      />
      <Box
        at={[0.025, 1.16, 0.03]}
        size={[0.16, 0.24, 0.045]}
        color="#d6b375"
        rotation={[0, 0, -0.14]}
      />
      {Array.from({ length: 15 }, (_, i) => (
        <Box
          key={i}
          at={[0, 0.26 + i * 0.051, 0.056]}
          size={[0.083, 0.005, 0.004]}
          color="#bdb5a0"
          round={0}
        />
      ))}
      {[-0.12, 0.015, 0.14].map((y) => (
        <Box
          key={y}
          at={[0, y, 0.14]}
          size={[0.1, 0.035, 0.02]}
          color="#e9dec0"
          rotation={[0, 0, y === -0.12 ? -0.1 : 0]}
        />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <Rod
          key={i}
          from={[-0.03 + i * 0.012, -0.2, 0.151]}
          to={[-0.03 + i * 0.012, 1.22, 0.064]}
          radius={0.0015}
          color="#b5b9a9"
        />
      ))}
      <Box at={[0, -0.21, 0.14]} size={[0.12, 0.07, 0.025]} color="#9c9d92" />
      {[0, 0.1, 0.2].map((y) => (
        <Cylinder
          key={y}
          at={[0.17, -0.09 + y, 0.135]}
          radius={0.018}
          height={0.022}
          rotation={[Math.PI / 2, 0, 0]}
          color="#ece3c7"
        />
      ))}
      <Rod from={[0, -0.35, 0]} to={[0, -0.56, -0.1]} radius={0.025} />
      <Rod
        from={[-0.26, -0.59, 0.16]}
        to={[0.26, -0.59, 0.16]}
        radius={0.025}
      />
    </group>
  );
}
function Amp() {
  return (
    <group>
      <Box size={[0.67, 0.54, 0.35]} color="#242b29" round={0.035} />
      <Box at={[0, -0.025, 0.181]} size={[0.6, 0.42, 0.012]} color="#4c5149" />
      {Array.from({ length: 15 }, (_, i) => (
        <Box
          key={i}
          at={[-0.28 + i * 0.04, -0.025, 0.19]}
          size={[0.005, 0.38, 0.004]}
          color="#77796c"
          round={0}
        />
      ))}
      <Box at={[0, 0.3, 0]} size={[0.25, 0.035, 0.05]} color="#323a35" />
      {Array.from({ length: 6 }, (_, i) => (
        <Cylinder
          key={i}
          at={[-0.24 + i * 0.09, 0.279, 0.05]}
          radius={0.014}
          height={0.014}
          color="#a5a28d"
        />
      ))}
      <Box at={[0, 0.09, 0.2]} size={[0.17, 0.06, 0.005]} color="#d4d3bd" />
    </group>
  );
}
function Plant({ at, scale = 1 }: { at: V3; scale?: number }) {
  return (
    <group position={at} scale={scale}>
      <Cylinder
        at={[0, 0.19, 0]}
        radius={0.21}
        top={0.26}
        height={0.38}
        color="#c4b9a1"
      />
      {Array.from({ length: 8 }, (_, i) => {
        const a = i * 2.4;
        const x = Math.sin(a) * 0.28,
          z = Math.cos(a) * 0.25,
          h = 0.5 + (i % 3) * 0.15;
        return (
          <group key={i}>
            <Rod
              from={[0, 0.35, 0]}
              to={[x, h, z]}
              radius={0.01}
              color="#56664a"
            />
            <mesh
              position={[x, h, z]}
              rotation={[0.3, a, 0.6]}
              scale={[0.13, 0.25, 0.04]}
              castShadow
            >
              <sphereGeometry args={[1, 12, 8]} />
              <meshStandardMaterial color={i % 2 ? "#6c8057" : "#8d9e70"} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
function Coffee() {
  return (
    <group position={[3.25, 0, -1.25]}>
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
      {[-0.4, -0.05, 0.3].map((x, i) => (
        <group key={x} position={[x, 0.6, 0.02]}>
          <Box
            size={[0.25, 0.43, 0.15]}
            color={["#ede2c7", "#7d8c69", "#b77554"][i]}
            rotation={[0, 0, 0.035 * (i - 1)]}
          />
          <Box
            at={[0, 0.015, 0.079]}
            size={[0.17, 0.18, 0.006]}
            color={["#a55a37", "#eee2bc", "#e9d6b1"][i]}
          />
        </group>
      ))}
      <Cylinder
        at={[-0.3, 1.1, 0]}
        radius={0.16}
        height={0.035}
        color="#2e3732"
      />
      <Cylinder
        at={[-0.3, 1.22, 0]}
        radius={0.095}
        top={0.13}
        height={0.2}
        color="#b39c75"
      />
      <Cylinder
        at={[-0.3, 1.35, 0]}
        radius={0.12}
        height={0.06}
        color="#333e37"
      />
      <mesh position={[-0.3, 1.49, 0]}>
        <cylinderGeometry args={[0.2, 0.065, 0.23, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#ece9da"
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
          roughness={0.1}
        />
      </mesh>
      <Cylinder
        at={[0.22, 1.25, 0]}
        radius={0.08}
        height={0.37}
        color="#505c58"
      />
      <Cylinder
        at={[0.22, 1.45, 0]}
        radius={0.115}
        height={0.025}
        color="#2a342e"
      />
      <Cylinder
        at={[0.22, 1.075, 0]}
        radius={0.125}
        height={0.025}
        color="#2a342e"
      />
      <Cylinder
        at={[0.56, 1.21, 0]}
        radius={0.13}
        height={0.25}
        color="#bcbab0"
      />
      <Rod
        from={[0.65, 1.25, 0]}
        to={[0.82, 1.43, 0]}
        radius={0.018}
        color="#babbb1"
      />
    </group>
  );
}
function Lamp({ night, onToggle }: { night: boolean; onToggle: () => void }) {
  return (
    <group
      position={[1, 1.28, -1.03]}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      <Cylinder
        at={[0, 0.015, 0]}
        radius={0.13}
        height={0.035}
        color="#6b775a"
      />
      <Rod from={[0, 0, 0]} to={[0, 0.55, 0]} radius={0.018} color="#7d816c" />
      <mesh position={[0, 0.58, 0]} castShadow>
        <coneGeometry args={[0.2, 0.16, 32, 1, true]} />
        <meshStandardMaterial color="#6d7b58" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.53, 0]}>
        <sphereGeometry args={[0.045, 12, 8]} />
        <meshStandardMaterial
          color="#ffe7ac"
          emissive="#ffbe63"
          emissiveIntensity={night ? 3 : 0}
        />
      </mesh>
      {night && (
        <pointLight
          position={[0, 0.47, 0.1]}
          color="#ffc987"
          intensity={5}
          distance={4}
          decay={2}
        />
      )}
    </group>
  );
}
function Pickable({
  id,
  at,
  label,
  children,
  onSelect,
  selected,
}: {
  id: RoomItem;
  at: V3;
  label: string;
  children: ReactNode;
  onSelect: SceneProps["onSelect"];
  selected: RoomItem | null;
}) {
  const [hover, setHover] = useState(false);
  const ref = useRef<THREE.Group>(null);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(
    () => () => {
      document.body.style.cursor = "";
    },
    [],
  );
  useFrame((_, dt) => {
    if (ref.current) {
      const y = hover && selected !== id ? 0.045 : 0;
      ref.current.position.y = THREE.MathUtils.damp(
        ref.current.position.y,
        at[1] + y,
        9,
        dt,
      );
      if (Math.abs(ref.current.position.y - at[1] - y) > 0.0001) invalidate();
    }
  });
  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHover(true);
    document.body.style.cursor = "pointer";
  };
  return (
    <group
      ref={ref}
      position={at}
      onPointerOver={over}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (e.delta < 4) onSelect(id);
      }}
    >
      {children}
      {hover && !selected && (
        <Html position={[0, 1.65, 0]} center style={{ pointerEvents: "none" }}>
          <span className="object-label">
            {label}
            <span>↗</span>
          </span>
        </Html>
      )}
    </group>
  );
}
const targets: Record<RoomItem, V3> = {
  work: [0.85, 1.5, -0.5],
  projects: [-0.35, 1.5, -0.3],
  travel: [-3.4, 0.65, 0.35],
  track: [-3.65, 0.7, -1.2],
  music: [2.2, 0.8, 0.6],
  coffee: [3.25, 1, -1.25],
};
function CameraRig({
  selected,
  reduced,
}: {
  selected: RoomItem | null;
  reduced: boolean;
}) {
  const controls = useRef<CameraControls>(null);
  const { size } = useThree();
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const mobile = window.matchMedia("(max-width: 700px)").matches;
    const target = selected ? targets[selected] : [0, 0.8, -0.2];
    const offset = selected ? [7, 5, 9] : [10, 8, 13];
    c.smoothTime = reduced ? 0 : 0.85;
    void c.setLookAt(
      target[0] + offset[0],
      target[1] + offset[1],
      target[2] + offset[2],
      ...(target as V3),
      !reduced,
    );
    void c.zoomTo(
      selected
        ? mobile
          ? 65
          : 88
        : mobile
          ? Math.min(window.innerWidth / 12.5, size.height / 10)
          : Math.min(size.width / 16, size.height / 9, 85),
      !reduced,
    );
  }, [selected, reduced, size.width, size.height]);
  return (
    <CameraControls
      ref={controls}
      makeDefault
      minPolarAngle={0.65}
      maxPolarAngle={1.25}
      minAzimuthAngle={-0.3}
      maxAzimuthAngle={1.2}
      minZoom={28}
      maxZoom={120}
      dollyToCursor={false}
      truckSpeed={0}
      mouseButtons={{ left: 1, middle: 0, right: 0, wheel: 0 }}
      touches={{ one: 32, two: 0, three: 0 }}
    />
  );
}
function Room({
  selected,
  night,
  reduced,
  onSelect,
  onReady,
  onToggle,
}: SceneProps & { onToggle: () => void }) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return (
    <>
      <color attach="background" args={[night ? "#20292a" : "#eeeae1"]} />
      <ambientLight intensity={night ? 0.6 : 1.25} />
      <hemisphereLight
        args={[
          night ? "#abbdd3" : "#fff9e9",
          night ? "#3e332c" : "#b6ad95",
          night ? 0.55 : 1.6,
        ]}
      />
      <directionalLight
        position={[-3, 9, 5]}
        intensity={night ? 0.3 : 3.2}
        color={night ? "#9bb8d7" : "#fff0d3"}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
        shadow-normalBias={0.04}
      />
      <group position={[0, -0.08, 0]}>
        <Box
          at={[0, -0.08, -0.25]}
          size={[10.3, 0.25, 6.5]}
          color={night ? "#a39b82" : "#d5ccb5"}
          round={0.1}
        />
        {Array.from({ length: 18 }, (_, i) => (
          <Box
            key={i}
            at={[-4.83 + i * 0.57, 0.051, -0.25]}
            size={[0.012, 0.002, 6.2]}
            color="#bdb39b"
            round={0}
          />
        ))}
        <Box at={[0, 1.55, -3.45]} size={[10.3, 3.2, 0.16]} color="#ded8c8" />
        <Box
          at={[-5.08, 1.55, -0.25]}
          size={[0.14, 3.2, 6.5]}
          color="#d4cfbf"
        />
        <Box at={[0, 0.16, -3.34]} size={[10.1, 0.17, 0.05]} color="#b8b39e" />
        <group position={[-1.6, 1.9, -3.32]}>
          <Box size={[2.9, 1.72, 0.07]} color="#b5af99" />
          <Box
            at={[0, 0, 0.05]}
            size={[2.7, 1.54, 0.04]}
            color={night ? "#536c7c" : "#c1d1cf"}
          />
          <Box at={[0, 0, 0.09]} size={[0.06, 1.58, 0.05]} color="#eeeadc" />
          <Box at={[0, 0, 0.1]} size={[2.74, 0.055, 0.05]} color="#eeeadc" />
          <Box at={[0, -0.88, 0.08]} size={[3.1, 0.09, 0.23]} color="#eee8d8" />
          {[-0.8, 0.45].map((x) => (
            <Box
              key={x}
              at={[x, 0.1, 0.078]}
              size={[0.28, 1.2, 0.006]}
              color={night ? "#405967" : "#b7cbc4"}
            />
          ))}
        </group>
        <Box at={[2.55, 2.05, -3.32]} size={[1.3, 1.1, 0.04]} color="#343d37" />
        <Box
          at={[2.55, 2.05, -3.28]}
          size={[1.15, 0.95, 0.015]}
          color="#e1d2af"
        />
        <mesh position={[2.55, 2.08, -3.26]}>
          <circleGeometry args={[0.3, 40]} />
          <meshStandardMaterial color="#b9583a" />
        </mesh>
        <Box
          at={[0.4, 0.07, 0.85]}
          size={[3.35, 0.025, 2.55]}
          color="#b1b59a"
          round={0.04}
        />
        {Array.from({ length: 12 }, (_, i) => (
          <Box
            key={i}
            at={[-1.12 + i * 0.27, 0.085, 0.85]}
            size={[0.025, 0.002, 2.5]}
            color="#bfc1a9"
            round={0}
          />
        ))}
        <Desk onSelect={onSelect} />
        <Chair />
        <Pickable
          id="projects"
          at={[-0.42, 1.29, -0.31]}
          label="Personal projects"
          onSelect={onSelect}
          selected={selected}
        >
          <Laptop at={[0, 0, 0]} personal rotation={0.07} />
        </Pickable>
        <Pickable
          id="work"
          at={[0.9, 1.29, -0.56]}
          label="The day job"
          onSelect={onSelect}
          selected={selected}
        >
          <Laptop at={[0, 0, 0]} rotation={-0.17} />
        </Pickable>
        <Pickable
          id="travel"
          at={[-3.15, 0.05, 0.58]}
          label="On the road · KTM"
          onSelect={onSelect}
          selected={selected}
        >
          <group rotation={[0, -0.15, 0]}>
            <Bike />
          </group>
        </Pickable>
        <Pickable
          id="track"
          at={[-3.6, 0.05, -1.28]}
          label="On the track · Ducati"
          onSelect={onSelect}
          selected={selected}
        >
          <group rotation={[0, -0.15, 0]}>
            <Bike sport />
          </group>
        </Pickable>
        <Pickable
          id="music"
          at={[2.2, 0.7, 0.6]}
          label="A little Pink Floyd?"
          onSelect={onSelect}
          selected={selected}
        >
          <Guitar />
          <group position={[0.72, -0.36, -0.1]}>
            <Amp />
          </group>
          <Rod
            from={[0.15, -0.22, 0.1]}
            to={[0.58, -0.58, 0.5]}
            radius={0.011}
            color="#b74631"
          />
          <Rod
            from={[0.58, -0.58, 0.5]}
            to={[0.9, -0.56, 0.05]}
            radius={0.011}
            color="#b74631"
          />
        </Pickable>
        <Pickable
          id="coffee"
          at={[0, 0, 0]}
          label="The coffee corner"
          onSelect={onSelect}
          selected={selected}
        >
          <Coffee />
        </Pickable>
        <Plant at={[4.3, 0.08, -2.6]} scale={1.6} />
        <Plant at={[-4.3, 0.08, 2]} scale={1.1} />
        <Lamp night={night} onToggle={onToggle} />
        <group position={[0.2, 2.25, -3.23]}>
          <Box size={[0.7, 0.045, 0.24]} color="#98744e" />
          <Box at={[-0.2, 0.19, 0]} size={[0.08, 0.32, 0.17]} color="#b96743" />
          <Box
            at={[-0.08, 0.17, 0]}
            size={[0.12, 0.28, 0.17]}
            color="#757f62"
          />
          <Box at={[0.07, 0.18, 0]} size={[0.1, 0.3, 0.17]} color="#dfd6b8" />
        </group>
      </group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.24, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <shadowMaterial transparent opacity={night ? 0.15 : 0.12} />
      </mesh>
      <CameraRig selected={selected} reduced={reduced} />
    </>
  );
}
class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="scene-fallback">
        <p>The room couldn’t load on this device.</p>
        <span>You can still explore everything using the menu below.</span>
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function RoomScene(
  props: SceneProps & { onToggle: () => void },
) {
  return (
    <SceneBoundary>
      <Canvas
        frameloop="demand"
        orthographic
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [10, 8, 13], zoom: 70, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.08;
        }}
      >
        <Suspense fallback={null}>
          <Room {...props} />
        </Suspense>
      </Canvas>
    </SceneBoundary>
  );
}
