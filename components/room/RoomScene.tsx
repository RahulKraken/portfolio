"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { CameraControls, Html, RoundedBox } from "@react-three/drei";
import {
  Component,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import type { RoomItem } from "./content";
import { Model } from "./Model";

type V3 = [number, number, number];
type SceneProps = {
  selected: RoomItem | null;
  entered: boolean;
  arrived: boolean;
  screenContent: ReactNode;
  viewRevision: number;
  panMode: boolean;
  onArrive: () => void;
  onEnter: () => void;
  night: boolean;
  reduced: boolean;
  onSelect: (id: RoomItem) => void;
  onReady: () => void;
  onFailure: () => void;
};
const ink = "#292d30";
// Floor-plan coordinates: +z is forward, toward the visitor. One scale throughout:
// the desk top (1.28) is 75 cm, so 1 m ≈ 1.7 units.
const layout = {
  duke: [-4.35, -0.04, -0.35] as V3,
  ducati: [-6.15, -0.04, -0.35] as V3,
  gear: [-7.8, -0.04, -0.35] as V3,
  music: [3.05, 0.585, 0.05] as V3,
  coffee: [5.45, 0, 4.15] as V3,
};
// Each laptop is a generated model; `lid` is its screen's pose, measured from the mesh's
// lid front face (centre height, depth and lean), in scene units after fitting to 0.82 wide.
const laptops = {
  work: {
    model: "laptop-pro",
    at: [0.9, 1.28, -0.56] as V3,
    turn: -0.17,
    lid: { y: 0.314, z: -0.214, tilt: -0.314 },
  },
  projects: {
    model: "laptop-air",
    at: [-0.42, 1.28, -0.31] as V3,
    turn: 0.07,
    lid: { y: 0.317, z: -0.176, tilt: -0.094 },
  },
} as const;
// the generated lids are lumpy glass, so a flat bezel sits under the screen
const screen = { width: 0.76, height: 0.48 };
const bezel = { width: 0.79, height: 0.505 };

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
  // the plane floats just proud of the model's own (black) panel
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
    <mesh position={[0, 0, 0.004]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
function Laptop({
  id,
  screenContent,
  interactive = false,
}: {
  id: keyof typeof laptops;
  screenContent?: ReactNode;
  interactive?: boolean;
}) {
  const { model, turn, lid } = laptops[id];
  return (
    <group rotation={[0, turn, 0]}>
      <Model name={model} fit={["x", 0.82]} native />
      <group position={[0, lid.y, lid.z]} rotation={[lid.tilt, 0, 0]}>
        <mesh position={[0, 0, 0.002]}>
          <planeGeometry args={[bezel.width, bezel.height]} />
          <meshStandardMaterial color="#0c0e0f" roughness={0.3} />
        </mesh>
        <Screen kind={id} width={screen.width} height={screen.height} />
        {screenContent && (
          <Html
            transform
            position={[0, 0, 0.007]}
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
  );
}
function Cable({ points }: { points: V3[] }) {
  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))),
    [points],
  );
  return (
    <mesh castShadow>
      <tubeGeometry args={[curve, 64, 0.011, 8, false]} />
      <meshStandardMaterial color="#b74631" roughness={0.55} />
    </mesh>
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
function Desk({
  onSelect,
  onEnter,
}: {
  onSelect: SceneProps["onSelect"];
  onEnter: () => void;
}) {
  return (
    <group
      position={[0, 0, -0.7]}
      onClick={(e) => {
        e.stopPropagation();
        if (e.delta < 4) onEnter();
      }}
    >
      {/* stretched to the floor plan's footprint so the laptops keep their places */}
      <Model name="desk" fit={{ x: 2.8, y: 1.28, z: 1.18 }} />
      <group
        position={[-0.2, 1.28, -0.3]}
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
        <Model name="monitor" fit={["x", 1.4]} native />
        {/* panel centre and face, measured from the mesh at this fit */}
        <group position={[0, 0.81, 0.078]}>
          <Screen kind="monitor" width={1.3} height={0.73} />
        </group>
      </group>
      <Mug at={[-1.06, 1.39, 0.2]} />
      <Box
        at={[-1.08, 1.3, -0.3]}
        size={[0.28, 0.045, 0.18]}
        color="#e4dfcc"
      />
      {/* the personal laptop drives the monitor */}
      <Rod
        from={[-0.2, 1.29, -0.22]}
        to={[-0.42, 1.29, 0.17]}
        radius={0.008}
        color="#454a43"
      />
    </group>
  );
}
function Chair() {
  // turned to face the desk
  return (
    <group position={[0.12, 0, 1.05]}>
      <Model name="chair" fit={["y", 1.5]} turn={[0, Math.PI, 0]} />
    </group>
  );
}
function RidingGear() {
  // drawn at the old 0.65 scale, then brought up to the room's
  return (
    <group scale={1.55}>
      {/* A freestanding rail keeps the leathers readable without adding a wall. */}
      {[-0.37, 0.37].map((x) => (
        <group key={x}>
          <Rod
            from={[x, 0.03, -0.85]}
            to={[x, 1.92, -0.85]}
            radius={0.018}
            color="#626a67"
          />
          <Rod
            from={[x, 0.025, -1.12]}
            to={[x, 0.025, -0.55]}
            radius={0.025}
            color="#626a67"
          />
        </group>
      ))}
      <Rod
        from={[-0.37, 1.92, -0.85]}
        to={[0.37, 1.92, -0.85]}
        radius={0.018}
        color="#626a67"
      />
      <Rod
        from={[0, 1.92, -0.85]}
        to={[0, 1.8, -0.85]}
        radius={0.012}
        color="#9b9a89"
      />
      <Rod
        from={[0, 1.8, -0.85]}
        to={[-0.26, 1.66, -0.85]}
        radius={0.018}
        color="#b4946e"
      />
      <Rod
        from={[0, 1.8, -0.85]}
        to={[0.26, 1.66, -0.85]}
        radius={0.018}
        color="#b4946e"
      />
      {/* the one-piece hangs from the hanger, clear of the floor */}
      <Model name="suit" fit={["y", 1.62]} position={[0, 0.13, -0.85]} />
      <Box at={[0, 0.73, 0.97]} size={[0.76, 0.06, 0.48]} color="#ac8a63" />
      {[-0.3, 0.3].flatMap((x) =>
        [-0.16, 0.16].map((z) => (
          <Box
            key={`${x}-${z}`}
            at={[x, 0.36, 0.97 + z]}
            size={[0.035, 0.72, 0.035]}
            color="#505951"
          />
        )),
      )}
      <Box at={[0, 0.24, 0.97]} size={[0.69, 0.04, 0.4]} color="#ac8a63" />
      <Model
        name="helmet"
        fit={["y", 0.32]}
        position={[0, 0.76, 0.97]}
        rotation={[0, 0.35, 0]}
        gloss={0.22}
      />
      {/* one generated boot, mirrored for the pair */}
      {[-1, 1].map((side) => (
        <Model
          key={side}
          name="boots"
          fit={["y", 0.42]}
          turn={[0, Math.PI / 2, 0]}
          position={[side * 0.13, 0.26, 0.97]}
          scale={[side, 1, 1]}
          gloss={0.45}
        />
      ))}
    </group>
  );
}
function Coffee() {
  return (
    <group rotation={[0, -Math.PI / 2, 0]}>
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
        if (e.delta < 4) onToggle();
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
function StudioEnvironment({ night }: { night: boolean }) {
  const gl = useThree((s) => s.gl);
  const get = useThree((s) => s.get);
  const texture = useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const environment = new RoomEnvironment();
    const map = pmrem.fromScene(environment, 0.04).texture;
    environment.dispose();
    pmrem.dispose();
    return map;
  }, [gl]);
  useEffect(() => () => texture.dispose(), [texture]);
  useEffect(() => {
    get().scene.environmentIntensity = night ? 0.12 : 0.45;
    get().invalidate();
  }, [night, get]);
  return <primitive object={texture} attach="environment" />;
}
function Pickable({
  id,
  at,
  children,
  onSelect,
}: {
  id: RoomItem;
  at: V3;
  label: string;
  children: ReactNode;
  onSelect: SceneProps["onSelect"];
  selected: RoomItem | null;
}) {
  useEffect(
    () => () => {
      document.body.style.cursor = "";
    },
    [],
  );
  return (
    <group
      position={at}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (e.delta < 4) onSelect(id);
      }}
    >
      {children}
    </group>
  );
}
const targets: Record<RoomItem, V3> = {
  work: [0.85, 1.5, -0.5],
  projects: [-0.35, 1.5, -0.3],
  travel: [layout.duke[0], 0.95, layout.duke[2]],
  track: [layout.ducati[0], 0.95, layout.ducati[2]],
  music: [layout.music[0], 0.8, layout.music[2]],
  coffee: [layout.coffee[0], 0.78, layout.coffee[2]],
};
// camera-controls 3.x action flags (CameraControls.ACTION); named here so the numbers can't drift
const ACTION = {
  NONE: 0,
  ROTATE: 1,
  TRUCK: 2,
  DOLLY: 16,
  TOUCH_ROTATE: 64,
  TOUCH_TRUCK: 128,
  TOUCH_DOLLY_TRUCK: 4096,
} as const;

// Independent camera staging: an establishing view, a desk view, then an object view.
function CameraRig({
  selected,
  entered,
  reduced,
  onArrive,
  viewRevision,
  panMode,
}: Pick<
  SceneProps,
  "selected" | "entered" | "reduced" | "onArrive" | "viewRevision" | "panMode"
>) {
  const controls = useRef<CameraControls>(null);
  const { size, camera } = useThree();
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    let cancelled = false;
    const mobile = size.width < 700;
    let eye: V3, target: V3;
    if (!entered) {
      target = [-0.6, 0.7, 1.1];
      const distance = mobile ? 1.85 : 1;
      eye = [11 * distance, 16 * distance, 32 * distance];
    } else if (selected === "projects" || selected === "work") {
      const { at, turn, lid } = laptops[selected];
      const up = new THREE.Vector3(0, 1, 0);
      const tilt = new THREE.Euler(lid.tilt, 0, 0);
      const center = new THREE.Vector3(0, 0, 0.007)
        .applyEuler(tilt)
        .add(new THREE.Vector3(0, lid.y, lid.z))
        .applyAxisAngle(up, turn)
        .add(new THREE.Vector3(at[0], at[1] - 0.08, at[2]));
      const normal = new THREE.Vector3(0, 0, 1)
        .applyEuler(tilt)
        .applyAxisAngle(up, turn);
      const distance =
        (Math.max(screen.height, screen.width / (size.width / size.height)) /
          (2 *
            Math.tan(
              THREE.MathUtils.degToRad(
                (camera as THREE.PerspectiveCamera).fov,
              ) / 2,
            ))) *
        1.25;
      target = center.toArray() as V3;
      eye = center.clone().addScaledVector(normal, distance).toArray() as V3;
    } else if (selected) {
      const profiles = {
        music: { direction: [-0.56, 0.22, 1], width: 1.85, height: 2.0 },
        coffee: { direction: [-1, 0.55, 0.75], width: 1.9, height: 2.05 },
        travel: { direction: [1, 0.4, 1], width: 4.2, height: 2.8 },
        // the Ducati sits between the gear rail and the Duke: a high front three-quarter clears both
        track: { direction: [-0.4, 0.75, 1], width: 4.4, height: 3 },
      };
      const profile = profiles[selected];
      target =
        selected === "music"
          ? [layout.music[0] + 0.25, 0.86, layout.music[2] + 0.16]
          : targets[selected];
      const aspect = size.width / size.height;
      const fov = THREE.MathUtils.degToRad(
        (camera as THREE.PerspectiveCamera).fov,
      );
      const distance =
        (Math.max(profile.height, profile.width / aspect) /
          (2 * Math.tan(fov / 2))) *
        1.2;
      const direction = new THREE.Vector3(...profile.direction).normalize();
      eye = new THREE.Vector3(...target)
        .addScaledVector(direction, distance)
        .toArray() as V3;
    } else {
      target = [-0.6, 0.8, 1];
      eye = mobile ? [8, 15, 43] : [4, 8, 18];
    }
    c.smoothTime = reduced ? 0 : selected ? 0.65 : 0.85;
    void c.setLookAt(...eye, ...target, !reduced).then(() => {
      if (!cancelled) onArrive();
    });
    return () => {
      cancelled = true;
    };
  }, [
    selected,
    entered,
    reduced,
    onArrive,
    viewRevision,
    size.width,
    size.height,
    camera,
  ]);
  return (
    <CameraControls
      ref={controls}
      makeDefault
      enabled={entered && selected !== "projects" && selected !== "work"}
      onControlStart={onArrive}
      minPolarAngle={0.12}
      maxPolarAngle={Math.PI / 2 - 0.035}
      minDistance={selected ? 1.1 : 2}
      maxDistance={!entered ? 100 : 55}
      dollyToCursor={false}
      azimuthRotateSpeed={0.65}
      polarRotateSpeed={0.65}
      dollySpeed={0.7}
      truckSpeed={1}
      draggingSmoothTime={0.15}
      mouseButtons={{
        left: panMode ? ACTION.TRUCK : ACTION.ROTATE,
        middle: ACTION.DOLLY,
        right: ACTION.TRUCK,
        wheel: ACTION.DOLLY,
      }}
      touches={{
        one: panMode ? ACTION.TOUCH_TRUCK : ACTION.TOUCH_ROTATE,
        two: ACTION.TOUCH_DOLLY_TRUCK,
        three: ACTION.TOUCH_TRUCK,
      }}
    />
  );
}
function Room({
  selected,
  entered,
  arrived,
  onArrive,
  onEnter,
  screenContent,
  viewRevision,
  panMode,
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
      <color attach="background" args={[night ? "#20292a" : "#e7e6e2"]} />
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
      <StudioEnvironment night={night} />
      <group position={[0, -0.08, 0]}>
        <Desk onSelect={onSelect} onEnter={onEnter} />
        <Chair />
        {(["projects", "work"] as const).map((id) => (
          <Pickable
            key={id}
            id={id}
            at={laptops[id].at}
            label={id === "projects" ? "Personal projects" : "The day job"}
            onSelect={onSelect}
            selected={selected}
          >
            <Laptop
              id={id}
              screenContent={selected === id ? screenContent : null}
              interactive={arrived}
            />
          </Pickable>
        ))}
        {/* generated models face +z, toward the visitor, like the floor plan expects */}
        <Pickable
          id="travel"
          at={layout.duke}
          label="On the road · KTM"
          onSelect={onSelect}
          selected={selected}
        >
          <Model
            name="ktm"
            fit={["z", 3.4]}
            turn={[0, Math.PI / 2, 0]}
            gloss={0.4}
          />
        </Pickable>
        <Pickable
          id="track"
          at={layout.ducati}
          label="On the track · Ducati"
          onSelect={onSelect}
          selected={selected}
        >
          <Model name="ducati" fit={["z", 3.5]} />
        </Pickable>
        <Pickable
          id="music"
          at={layout.music}
          label="A little Pink Floyd?"
          onSelect={onSelect}
          selected={selected}
        >
          {/* music sits 0.585 above the floor; the Strat's mesh lies face-up, neck along +x */}
          <group rotation={[0, -0.5, 0]} position={[0, -0.585, 0]}>
            {/* leans back onto the stand's yoke */}
            <group position={[0, 0.1, 0]} rotation={[-0.08, -0.25, 0]}>
              <Model
                name="guitar"
                fit={["y", 1.72]}
                turn={[0, Math.PI / 2, Math.PI / 2]}
              />
            </group>
            {/* A-frame stand: cradle and two front feet, a yoke on one back leg */}
            <Rod
              from={[-0.16, 0.1, 0.09]}
              to={[0.16, 0.1, 0.09]}
              radius={0.016}
            />
            {[-1, 1].map((side) => (
              <Rod
                key={side}
                from={[side * 0.16, 0.1, 0.09]}
                to={[side * 0.22, 0.01, 0.22]}
                radius={0.014}
              />
            ))}
            <Rod from={[0, 0.1, 0.09]} to={[0, 0.01, -0.36]} radius={0.014} />
            <Rod from={[0, 0.01, -0.36]} to={[0, 0.98, -0.1]} radius={0.014} />
            <Rod
              from={[-0.05, 0.98, -0.1]}
              to={[0.05, 0.98, -0.1]}
              radius={0.012}
            />
            <Model name="amp" fit={["x", 0.8]} position={[0.78, 0, -0.1]} />
            <Cable
              points={[
                [0.17, 0.3, 0.07],
                [0.24, 0.05, 0.3],
                [0.38, 0.015, 0.4],
                [0.42, 0.35, 0.22],
                [0.44, 0.76, 0.14],
                [0.45, 0.75, 0.06],
              ]}
            />
          </group>
        </Pickable>
        <Pickable
          id="coffee"
          at={layout.coffee}
          label="The coffee corner"
          onSelect={onSelect}
          selected={selected}
        >
          <Coffee />
        </Pickable>
        <Pickable
          id="track"
          at={layout.gear}
          label="Riding gear"
          onSelect={onSelect}
          selected={selected}
        >
          <RidingGear />
        </Pickable>
        <Lamp night={night} onToggle={onToggle} />
      </group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.085, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <shadowMaterial transparent opacity={night ? 0.15 : 0.12} />
      </mesh>
      <CameraRig
        selected={selected}
        entered={entered}
        reduced={reduced}
        onArrive={onArrive}
        viewRevision={viewRevision}
        panMode={panMode}
      />
    </>
  );
}
class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? (
      <div className="scene-fallback">
        <p>The room couldn’t load on this device.</p>
        <span>You can still explore everything using the studio menu.</span>
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
    <SceneBoundary onFailure={props.onFailure}>
      <Canvas
        frameloop="demand"
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [18, 13, 24], fov: 40, near: 0.02, far: 150 }}
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
