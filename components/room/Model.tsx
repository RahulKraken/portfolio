"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

type V3 = [number, number, number];
type Axis = "x" | "y" | "z";

export const models = [
  "amp",
  "boots",
  "chair",
  "desk",
  "ducati",
  "guitar",
  "helmet",
  "ktm",
  "laptop-air",
  "laptop-pro",
  "monitor",
  "suit",
] as const;
export type ModelName = (typeof models)[number];

const url = (name: ModelName) => `/models/${name}.glb`;

/**
 * A generated mesh fitted to a footprint. `turn` fixes the source orientation first; `fit`
 * then scales so the given axis measures that many scene units (a partial per-axis map
 * stretches only where the layout needs it). Unless `native`, the result is centred on x/z
 * and rests on y = 0.
 */
export function Model({
  name,
  fit,
  turn = [0, 0, 0],
  position,
  rotation,
  scale,
  native = false,
  gloss,
}: {
  name: ModelName;
  fit: [Axis, number] | Partial<Record<Axis, number>>;
  turn?: V3;
  position?: V3;
  rotation?: V3;
  scale?: V3;
  native?: boolean;
  /** roughness for meshes that ship without a metal/roughness map (Meshy's base-colour-only output) */
  gloss?: number;
}) {
  const { scene } = useGLTF(url(name));
  const key = JSON.stringify([fit, turn, native, gloss]);
  const object = useMemo(() => {
    const inner = scene.clone(true);
    inner.rotation.set(...turn);
    const pivot = new THREE.Group();
    pivot.add(inner);
    pivot.updateMatrixWorld(true);
    const dims = new THREE.Box3().setFromObject(inner).getSize(new THREE.Vector3());
    if (Array.isArray(fit)) {
      inner.scale.setScalar(fit[1] / dims[fit[0]]);
    } else {
      const given = (Object.keys(fit) as Axis[]).filter((a) => fit[a]);
      const uniform = fit[given[0]]! / dims[given[0]];
      inner.scale.set(
        fit.x ? fit.x / dims.x : uniform,
        fit.y ? fit.y / dims.y : uniform,
        fit.z ? fit.z / dims.z : uniform,
      );
    }
    if (!native) {
      pivot.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(inner);
      const center = box.getCenter(new THREE.Vector3());
      inner.position.set(-center.x, -box.min.y, -center.z);
    }
    inner.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const material = mesh.material as THREE.MeshStandardMaterial;
      if (!material.metalnessMap) {
        const own = material.clone();
        own.metalness = 0;
        own.roughness = gloss ?? 0.8;
        mesh.material = own;
      }
    });
    return pivot;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, key]);
  return (
    <primitive
      object={object}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}

for (const name of models) useGLTF.preload(url(name));
