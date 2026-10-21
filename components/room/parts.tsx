"use client";

import { RoundedBox } from "@react-three/drei";
import { useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";

export type V3 = [number, number, number];
export const ink = "#292d30";

export function Box({
  at = [0, 0, 0],
  size = [1, 1, 1],
  color = "#ddd",
  rotation = [0, 0, 0],
  round = 0.025,
  smooth = 2,
  shadow = true,
  ...props
}: {
  at?: V3;
  size?: V3;
  color?: string;
  rotation?: V3;
  round?: number;
  /** bevel segments; the stylized pieces use more for a soft edge */
  smooth?: number;
  shadow?: boolean;
  metalness?: number;
  roughness?: number;
}) {
  return (
    <RoundedBox
      position={at}
      args={size}
      radius={Math.min(round, ...size.map((v) => v / 2.01))}
      smoothness={smooth}
      rotation={rotation}
      castShadow={shadow}
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

export function Rod({
  from,
  to,
  radius = 0.025,
  color = ink,
  metalness = 0.3,
  roughness = 0.5,
}: {
  from: V3;
  to: V3;
  radius?: number;
  color?: string;
  metalness?: number;
  roughness?: number;
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
      <cylinderGeometry args={[radius, radius, length, 12]} />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
      />
    </mesh>
  );
}

export function Cylinder({
  at,
  radius = 0.2,
  height = 0.2,
  color = "#ddd",
  rotation = [0, 0, 0],
  top,
  metalness = 0,
  roughness = 0.65,
}: {
  at: V3;
  radius?: number;
  height?: number;
  color?: string;
  rotation?: V3;
  top?: number;
  metalness?: number;
  roughness?: number;
}) {
  return (
    <mesh position={at} rotation={rotation} castShadow receiveShadow>
      <cylinderGeometry args={[top ?? radius, radius, height, 32]} />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
      />
    </mesh>
  );
}

/** A cable (or any bent tube) along a smooth spline through `points`. */
export function Cable({
  points,
  radius = 0.011,
  color = "#b74631",
  closed = false,
}: {
  points: V3[];
  radius?: number;
  color?: string;
  closed?: boolean;
}) {
  const key = JSON.stringify(points);
  // centripetal: long, looping runs don't overshoot between close points
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        (JSON.parse(key) as V3[]).map((p) => new THREE.Vector3(...p)),
        closed,
        "centripetal",
      ),
    [key, closed],
  );
  const segments = Math.max(64, Math.ceil(curve.getLength() / (radius * 1.5)));
  return (
    <mesh castShadow>
      <tubeGeometry args={[curve, Math.min(segments, 1200), radius, 10, closed]} />
      <meshStandardMaterial color={color} roughness={0.55} />
    </mesh>
  );
}

/** Many copies of one geometry in a single draw call (keys, spokes, frets…). */
export function Instanced({
  geometry,
  positions,
  rotation,
  children,
}: {
  geometry: THREE.BufferGeometry;
  positions: V3[];
  rotation?: V3;
  children: ReactNode;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(...(rotation ?? [0, 0, 0])),
    );
    const one = new THREE.Vector3(1, 1, 1);
    positions.forEach((p, i) =>
      mesh.setMatrixAt(i, m.compose(new THREE.Vector3(...p), q, one)),
    );
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [positions, rotation]);
  return (
    <instancedMesh
      ref={ref}
      args={[geometry, undefined, positions.length]}
      castShadow
      receiveShadow
    >
      {children}
    </instancedMesh>
  );
}

/** A small canvas texture, drawn once. */
export function useCanvasTexture(
  width: number,
  height: number,
  draw: (g: CanvasRenderingContext2D) => void,
  options: { repeat?: [number, number]; srgb?: boolean } = {},
) {
  const { repeat, srgb = true } = options;
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = width;
    c.height = height;
    draw(c.getContext("2d")!);
    const t = new THREE.CanvasTexture(c);
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    if (repeat) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(...repeat);
    }
    t.anisotropy = 8;
    return t;
    // drawn once per size: callers pass inline draw functions and literal options
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);
  useLayoutEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

/** A rectangle with rounded corners, centred on the origin. */
export function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return s;
}
