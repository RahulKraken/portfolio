"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Ducati, FRONT_AXLE, K, REAR_AXLE } from "./Ducati";
import { useGLTF } from "@react-three/drei";
import { Box, Cable, Cylinder, Rod, useCanvasTexture, type V3 } from "./parts";

// Pit-lane corner, in metres in the Ducati's own frame (+z forward, +x the bike's left,
// floor at y = 0): the bike up on front and rear paddock stands on a Ducati Corse pit mat.
const LIFT = 0.03; // both tyres just clear of the mat
const MAT = { length: 2.2, width: 1, thickness: 0.006 };

const ducatiRed = { color: "#b3151d", metalness: 0.25, roughness: 0.32 };
const zinc = { color: "#c9ccd0", metalness: 0.85, roughness: 0.28 };
const anodisedRed = { color: "#c0242c", metalness: 0.6, roughness: 0.3 };
const rubber = { color: "#18191b", roughness: 0.75 };

/** Points for a bent tube: each interior corner is rounded by `bend` metres. */
function bent(points: V3[], bend = 0.05): V3[] {
  const out: V3[] = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    const p = new THREE.Vector3(...points[i]);
    const a = new THREE.Vector3(...points[i - 1]).sub(p);
    const b = new THREE.Vector3(...points[i + 1]).sub(p);
    const r = Math.min(bend, a.length() / 2.2, b.length() / 2.2);
    const before = p.clone().addScaledVector(a.normalize(), r);
    const after = p.clone().addScaledVector(b.normalize(), r);
    const mid = before.clone().add(after).multiplyScalar(0.5).lerp(p, 0.42);
    out.push(before.toArray() as V3, mid.toArray() as V3, after.toArray() as V3);
  }
  out.push(points[points.length - 1]);
  return out;
}

/** A small caster: tyre, hub and the axle bolt, rolling along z. */
function Caster({ at, radius = 0.04, hub = "#c0242c" }: { at: V3; radius?: number; hub?: string }) {
  return (
    <group position={at}>
      <Cylinder at={[0, 0, 0]} radius={radius} height={0.028} rotation={[0, 0, Math.PI / 2]} {...rubber} />
      <Cylinder at={[0, 0, 0]} radius={radius * 0.62} height={0.03} rotation={[0, 0, Math.PI / 2]} color={hub} roughness={0.45} />
      <Cylinder at={[0, 0, 0]} radius={radius * 0.18} height={0.036} rotation={[0, 0, Math.PI / 2]} {...zinc} />
    </group>
  );
}

/**
 * Rear paddock stand: painted U-frame, casters at the corners, uprights carrying rubber
 * cradles with L-hooks under the swingarm bobbins, handle loop resting behind. `bobbin` is the
 * left (+x) bobbin's centre in the bike frame, already lifted.
 */
function RearStand({ bobbin, paint }: { bobbin: V3; paint: object }) {
  const [bx, , bz] = bobbin;
  const ux = bx + 0.055; // uprights just outboard of the bobbins
  const cradleTop = bobbin[1] - 0.016;
  const corner = (s: number): V3 => [s * ux, 0.075, bz + 0.06];
  const tube = 0.016;
  return (
    <group>
      <Cable
        points={bent(
          [
            [ux, cradleTop - 0.06, bz],
            corner(1),
            [ux + 0.02, 0.05, bz - 0.38],
            [0.13, 0.035, bz - 0.74],
            [-0.13, 0.035, bz - 0.74],
            [-ux - 0.02, 0.05, bz - 0.38],
            corner(-1),
            [-ux, cradleTop - 0.06, bz],
          ],
          0.07,
        )}
        radius={tube}
        {...paint}
      />
      {[-1, 1].map((s) => (
        <group key={s}>
          {/* cradle: a stub inboard from the upright, rubber block, zinc L-hook round the bobbin */}
          <Rod from={[s * ux, cradleTop - 0.06, bz]} to={[s * ux, cradleTop - 0.035, bz]} radius={0.02} {...rubber} />
          <Box at={[s * (ux - 0.02), cradleTop - 0.025, bz]} size={[0.06, 0.02, 0.07]} round={0.006} {...rubber} />
          <Box at={[s * (bx + 0.013), cradleTop - 0.01, bz - 0.026]} size={[0.012, 0.03, 0.012]} round={0.003} {...zinc} />
          <Box at={[s * (bx + 0.013), cradleTop - 0.01, bz + 0.026]} size={[0.012, 0.03, 0.012]} round={0.003} {...zinc} />
          {/* knurled adjuster on the outside */}
          <Cylinder at={[s * (ux + 0.023), cradleTop - 0.05, bz]} radius={0.011} height={0.02} rotation={[0, 0, Math.PI / 2]} {...rubber} />
          <Caster at={[s * (ux + 0.03), 0.04, corner(s)[2] + 0.015]} />
          <Caster at={[s * (ux - 0.03), 0.04, corner(s)[2] + 0.015]} />
          {/* sleeve joint where the handle slots into the upright */}
          <Cylinder at={[s * (ux + 0.01), 0.062, bz - 0.16]} radius={0.0185} height={0.02} rotation={[Math.PI / 2 - 0.06, 0, 0]} color="#151515" />
        </group>
      ))}
    </group>
  );
}

/** Lightech-style front stand: zinc frame lifting under the fork bottoms with red cups. */
function FrontStand() {
  const [, fy, fz] = FRONT_AXLE;
  const cup: V3 = [0.105, fy - 0.045 + LIFT, fz + 0.005];
  const tube = 0.014;
  const z0 = cup[2] - 0.035;
  return (
    <group>
      <Cable
        points={bent(
          [
            [0.17, cup[1] - 0.03, cup[2]],
            [0.17, 0.07, z0],
            [0.19, 0.045, z0 + 0.32],
            [0.11, 0.03, z0 + 0.6],
            [-0.11, 0.03, z0 + 0.6],
            [-0.19, 0.045, z0 + 0.32],
            [-0.17, 0.07, z0],
            [-0.17, cup[1] - 0.03, cup[2]],
          ],
          0.06,
        )}
        radius={tube}
        {...zinc}
      />
      {[-1, 1].map((s) => (
        <group key={s}>
          {/* red clamp at the top of the upright, arm across under the fork bottom, cup and pin */}
          <Cylinder at={[s * 0.17, cup[1] - 0.03, cup[2]]} radius={0.02} height={0.03} {...anodisedRed} />
          <Rod from={[s * 0.17, cup[1] - 0.022, cup[2]]} to={[s * 0.105, cup[1] - 0.022, cup[2]]} radius={0.011} {...zinc} />
          <Cylinder at={[s * 0.105, cup[1] - 0.012, cup[2]]} radius={0.021} height={0.022} {...anodisedRed} />
          <Cylinder at={[s * 0.17, 0.16, z0 + 0.005]} radius={0.017} height={0.022} rotation={[0.08, 0, 0]} {...anodisedRed} />
          <Caster at={[s * 0.205, 0.035, z0 - 0.01]} radius={0.035} hub="#e6c21c" />
        </group>
      ))}
    </group>
  );
}

/**
 * Pit mat: black, with chevron bars at each corner and a badge on each long edge: Ducati Corse
 * shields (red bars) or a KTM badge (orange bars).
 */
function PitMat({ brand, width = MAT.width }: { brand: "ducati" | "ktm"; width?: number }) {
  const accent = brand === "ducati" ? "#c8202a" : "#ef6a1e";
  const W = 2048, H = Math.round((2048 * width) / MAT.length);
  const texture = useCanvasTexture(W, H, (g) => {
    g.fillStyle = "#18191b";
    g.fillRect(0, 0, W, H);
    // a faint needle-felt grain so the black reads as fabric
    for (let i = 0; i < 26000; i++) {
      g.fillStyle = `rgba(255,255,255,${Math.random() * 0.035})`;
      g.fillRect(Math.random() * W, Math.random() * H, 2, 2);
    }
    const bar = (x: number, y: number, w: number, h: number, slant: number, color: string) => {
      g.fillStyle = color;
      g.beginPath();
      g.moveTo(x + slant, y);
      g.lineTo(x + w + slant, y);
      g.lineTo(x + w, y + h);
      g.lineTo(x, y + h);
      g.closePath();
      g.fill();
    };
    // one corner's bars, drawn for the top-left and mirrored to the other three
    const corner = () => {
      const red = accent, grey = "#4a4b4e";
      const ry = H * 0.105, rh = H * 0.095, gy = H * 0.012, gh = H * 0.072;
      bar(W * 0.035, ry, W * 0.085, rh, rh * 0.75, red);
      for (let i = 0; i < 4; i++) bar(W * (0.135 + i * 0.05), ry, W * 0.034, rh, rh * 0.75, red);
      for (let i = 0; i < 4; i++) bar(W * (0.1 + i * 0.05), gy, W * 0.034, gh, gh * 0.75, grey);
      bar(W * 0.3, gy, W * 0.085, gh, gh * 0.75, grey);
    };
    for (const [sx, sy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) {
      g.save();
      g.translate(sx < 0 ? W : 0, sy < 0 ? H : 0);
      g.scale(sx, sy);
      corner();
      g.restore();
    }
    // Ducati Corse shield, upright on the near edge and turned over on the far one
    const shield = (cx: number, cy: number, h: number, flip: boolean) => {
      const w = h * 0.84;
      g.save();
      g.translate(cx, cy);
      if (flip) g.rotate(Math.PI);
      const outline = () => {
        g.beginPath();
        g.moveTo(-w / 2 + h * 0.08, -h / 2);
        g.quadraticCurveTo(0, -h / 2 - h * 0.05, w / 2 - h * 0.08, -h / 2);
        g.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + h * 0.1);
        g.bezierCurveTo(w / 2, h * 0.12, w * 0.22, h * 0.36, 0, h / 2);
        g.bezierCurveTo(-w * 0.22, h * 0.36, -w / 2, h * 0.12, -w / 2, -h / 2 + h * 0.1);
        g.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + h * 0.08, -h / 2);
        g.closePath();
      };
      outline();
      g.fillStyle = "#f4f3ef";
      g.fill();
      g.save();
      outline();
      g.clip();
      // red upper field with a sweeping lower edge
      g.fillStyle = "#c8202a";
      g.beginPath();
      g.moveTo(-w, -h);
      g.lineTo(w, -h);
      g.lineTo(w, -h * 0.16);
      g.bezierCurveTo(w * 0.2, -h * 0.02, -w * 0.25, -h * 0.02, -w, h * 0.06);
      g.closePath();
      g.fill();
      g.restore();
      outline();
      g.lineWidth = h * 0.035;
      g.strokeStyle = "#2a2b2d";
      g.stroke();
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillStyle = "#ffffff";
      g.font = `italic 800 ${h * 0.2}px "Helvetica Neue", Arial, sans-serif`;
      g.fillText("DUCATI", 0, -h * 0.26);
      g.fillStyle = "#2a2b2d";
      g.font = `italic 500 ${h * 0.15}px "Helvetica Neue", Arial, sans-serif`;
      g.fillText("CORSE", 0, h * 0.12);
      // tricolore under the lettering
      ["#2b8a3e", "#f4f3ef", "#c8202a"].forEach((c, i) => {
        g.fillStyle = c;
        g.fillRect(-h * 0.09 + i * h * 0.06, h * 0.25, h * 0.06, h * 0.035);
      });
      g.restore();
    };
    // KTM badge: orange plate with the black italic wordmark
    const ktm = (cx: number, cy: number, h: number, flip: boolean) => {
      const w = h * 2.3;
      g.save();
      g.translate(cx, cy);
      if (flip) g.rotate(Math.PI);
      g.fillStyle = accent;
      g.beginPath();
      g.moveTo(-w / 2 + h * 0.18, -h / 2);
      g.lineTo(w / 2, -h / 2);
      g.lineTo(w / 2 - h * 0.18, h / 2);
      g.lineTo(-w / 2, h / 2);
      g.closePath();
      g.fill();
      g.fillStyle = "#121314";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.font = `italic 900 ${h * 0.78}px "Helvetica Neue", Arial, sans-serif`;
      g.fillText("KTM", 0, h * 0.04);
      g.restore();
    };
    const badge = brand === "ducati" ? shield : ktm;
    const size = brand === "ducati" ? H * 0.24 : H * 0.14;
    badge(W / 2, H * 0.17, size, true);
    badge(W / 2, H * 0.83, size, false);
  });
  return (
    <group>
      <Box at={[0, MAT.thickness / 2, 0]} size={[width, MAT.thickness, MAT.length]} round={0.003} color="#141516" roughness={0.9} />
      {/* canvas runs along the mat's length: +u toward the front of the bike */}
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, MAT.thickness + 0.0005, 0]} receiveShadow>
        <planeGeometry args={[MAT.length - 0.004, width - 0.004]} />
        <meshStandardMaterial map={texture} roughness={0.92} />
      </mesh>
    </group>
  );
}

export function TrackCorner() {
  // the bike's centre between its axles, so the mat sits evenly under it
  const centre = useMemo(() => (FRONT_AXLE[2] + REAR_AXLE[2]) / 2, []);
  return (
    <group>
      <group position={[0, 0, centre]}>
        <PitMat brand="ducati" />
      </group>
      <group position={[0, LIFT + MAT.thickness, 0]} scale={1 / K}>
        <Ducati />
      </group>
      <group position={[0, MAT.thickness, 0]}>
        <RearStand bobbin={[0.15, REAR_AXLE[1] + 0.035 + LIFT, REAR_AXLE[2] + 0.11]} paint={ducatiRed} />
        <FrontStand />
      </group>
    </group>
  );
}

// KTM 390 Duke corner, in metres in the bike's own frame (axles 1,357 mm apart around z = 0,
// +z forward): the Rodin model (aligned to its real axles, otherwise as generated) on a KTM mat,
// rear wheel lifted on an orange paddock stand hooked under the swingarm bobbins.
const KTM_AXLES = { front: [0.293, 0.6785], rear: [0.306, -0.6785] } as const;
const ktmOrange = { color: "#e8661c", metalness: 0.25, roughness: 0.35 };

function KtmBike() {
  const { scene } = useGLTF("/models/ktm-rodin.glb");
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

export function KtmCorner() {
  const [ry, rz] = KTM_AXLES.rear, [, fz] = KTM_AXLES.front;
  // pivot about the front tyre's contact patch so the rear tyre clears the mat by LIFT
  const pitch = Math.asin(LIFT / (fz - rz));
  // swingarm bobbins 13 cm ahead of the rear axle, just outboard of the arm
  const bobbin = useMemo((): V3 => {
    const p = new THREE.Vector3(0.125, ry + 0.03, rz + 0.13).sub(new THREE.Vector3(0, 0, fz));
    p.applyAxisAngle(new THREE.Vector3(1, 0, 0), pitch).add(new THREE.Vector3(0, 0, fz));
    return [p.x, p.y, p.z];
  }, [ry, rz, fz, pitch]);
  return (
    <group>
      <PitMat brand="ktm" width={0.9} />
      <group position={[0, MAT.thickness, fz]} rotation={[pitch, 0, 0]}>
        <group position={[0, 0, -fz]}>
          <KtmBike />
          {/* the bobbins the stand lifts by */}
          {[-1, 1].map((s) => (
            <Cylinder key={s} at={[s * 0.125, ry + 0.03, rz + 0.13]} radius={0.016} height={0.03} rotation={[0, 0, Math.PI / 2]} color="#151618" roughness={0.4} />
          ))}
        </group>
      </group>
      <group position={[0, MAT.thickness, 0]}>
        <RearStand bobbin={bobbin} paint={ktmOrange} />
      </group>
    </group>
  );
}

useGLTF.preload("/models/ktm-rodin.glb");
