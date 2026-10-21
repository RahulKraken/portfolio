"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import type { V3 } from "./parts";

// Panigale V2 S: Rodin Gen-2.5 at its top settings (Extreme-High, micro detail, 4K PBR), used as
// generated. The only edits are a deeper red on the paint and a mapping that puts its axles on
// the real 1,465 mm wheelbase over 302 / 321 mm tyres; in that frame 1 m = 0.552 model units.
// The axle positions below (metres) are what the paddock stands lift by.
export const K = 0.552;
export const FRONT_AXLE: V3 = [0, 0.302, 0.385 / K];
export const REAR_AXLE: V3 = [0, 0.321, -0.4235 / K];

export function Ducati() {
  const { scene } = useGLTF("/models/ducati-rodin.glb");
  const bike = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) mesh.castShadow = mesh.receiveShadow = true;
    });
    return root;
  }, [scene]);
  return <primitive object={bike} />;
}

useGLTF.preload("/models/ducati-rodin.glb");
