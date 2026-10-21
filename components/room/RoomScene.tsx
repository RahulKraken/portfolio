"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
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
import { Chair, Desk, Lamp, Laptop, laptopScreen, laptops } from "./DeskSet";
import { Model } from "./Model";
import { MusicCorner } from "./MusicSet";
import { Box, Cylinder, Rod, type V3 } from "./parts";
import { KtmCorner, TrackCorner } from "./TrackCorner";

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
  /** a click on empty floor or background: leave the object view for the room */
  onDismiss: () => void;
};
// Floor-plan coordinates: +z is forward, toward the visitor. One scale throughout:
// the desk top (1.28) is 75 cm, so 1 m ≈ 1.7 units.
// Floor plan from Rahul's sketch, scaled by the desk (2.8 units = 404 px), then opened up: the
// two bikes side by side at the back left, well clear of the desk and angled in toward it;
// leathers rail and helmet table in front of them; guitar corner back right; coffee station
// forward on the right.
const layout = {
  // the mats rest on the floor (the room group sits 0.08 down, the floor 0.085)
  duke: [-6.1, -0.005, -0.1] as V3,
  ducati: [-5.85, -0.005, 2.25] as V3,
  leathers: [-8.5, -0.04, 4.7] as V3,
  table: [-7.1, -0.04, 4.75] as V3,
  music: [3.05, 0.585, 0.05] as V3,
  coffee: [5.16, 0, 3.0] as V3,
};
// both bikes point the same way: nose toward the desk, a little back from straight across
const BIKE_YAW = 1.79;
function LeathersRail() {
  // drawn at the old 0.65 scale, then brought up to the room's
  return (
    <group scale={1.55}>
      {/* A freestanding rail keeps the leathers readable without adding a wall. */}
      {[-0.37, 0.37].map((x) => (
        <group key={x}>
          <Rod
            from={[x, 0.03, 0]}
            to={[x, 1.92, 0]}
            radius={0.018}
            color="#626a67"
          />
          <Rod
            from={[x, 0.025, -0.27]}
            to={[x, 0.025, 0.3]}
            radius={0.025}
            color="#626a67"
          />
        </group>
      ))}
      <Rod
        from={[-0.37, 1.92, 0]}
        to={[0.37, 1.92, 0]}
        radius={0.018}
        color="#626a67"
      />
      <Rod
        from={[0, 1.92, 0]}
        to={[0, 1.8, 0]}
        radius={0.012}
        color="#9b9a89"
      />
      <Rod
        from={[0, 1.8, 0]}
        to={[-0.26, 1.66, 0]}
        radius={0.018}
        color="#b4946e"
      />
      <Rod
        from={[0, 1.8, 0]}
        to={[0.26, 1.66, 0]}
        radius={0.018}
        color="#b4946e"
      />
      {/* the one-piece hangs from the hanger, clear of the floor */}
      <Model name="suit-rodin" fit={["y", 1.62]} position={[0, 0.13, 0]} />
    </group>
  );
}
function GearTable() {
  return (
    <group scale={1.55}>
      <Box at={[0, 0.73, 0]} size={[0.76, 0.06, 0.48]} color="#ac8a63" />
      {[-0.3, 0.3].flatMap((x) =>
        [-0.16, 0.16].map((z) => (
          <Box
            key={`${x}-${z}`}
            at={[x, 0.36, z]}
            size={[0.035, 0.72, 0.035]}
            color="#505951"
          />
        )),
      )}
      <Box at={[0, 0.24, 0]} size={[0.69, 0.04, 0.4]} color="#ac8a63" />
      <Model
        name="helmet-rodin"
        fit={["y", 0.32]}
        position={[0, 0.76, 0]}
        rotation={[0, 0.35, 0]}
      />
      {/* one generated boot, mirrored for the pair */}
      {[-1, 1].map((side) => (
        <Model
          key={side}
          name="boots-rodin"
          fit={["y", 0.42]}
          position={[side * 0.13, 0.26, 0]}
          scale={[side, 1, 1]}
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
  const { size, camera, invalidate } = useThree();
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    // dev-only handle for inspecting details from the console:
    // `__room.setLookAt(...)` then `__draw()` (the canvas renders on demand)
    if (process.env.NODE_ENV === "development") {
      Object.assign(window, { __room: c, __draw: () => invalidate(2) });
      // ?cam=ex,ey,ez,tx,ty,tz pins the camera for reference renders
      const cam = new URLSearchParams(window.location.search).get("cam");
      if (cam) {
        const v = cam.split(",").map(Number) as [
          number,
          number,
          number,
          number,
          number,
          number,
        ];
        void c.setLookAt(...v, false).then(() => invalidate(2));
        return;
      }
    }
    let cancelled = false;
    const mobile = size.width < 700;
    // a portrait phone can't fit the room's long side across the screen, so it looks down the
    // room from the coffee end instead: bikes at the top, the coffee stand at the bottom
    const portrait = size.width < size.height * 0.8;
    const along: V3 = [19.8, 15.4, 1.8];
    let eye: V3, target: V3;
    if (!entered && portrait) {
      target = [-1.8, 0.6, 1.7];
      eye = along.map((d, i) => target[i] + d * 1.35) as V3;
    } else if (!entered) {
      target = [-0.6, 0.7, 1.1];
      const distance = mobile ? 1.85 : 1;
      eye = [11 * distance, 16 * distance, 32 * distance];
    } else if (selected === "projects" || selected === "work") {
      const screen = laptopScreen(selected);
      // the room sits 0.08 below the floor plan's origin
      const center = screen.center.clone().add(new THREE.Vector3(0, -0.08, 0));
      const normal = screen.normal;
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
        // tall enough to keep the cable's floor loops in shot
        music: { direction: [-0.56, 0.28, 1], width: 1.95, height: 2.15 },
        coffee: { direction: [-1, 0.55, 0.75], width: 1.9, height: 2.05 },
        // the KTM from ahead of its nose (the Ducati stands on its other side); the Ducati
        // from its right, exhaust side
        travel: { direction: [1, 0.6, 0.3], width: 4.2, height: 2.8 },
        track: { direction: [0.6, 0.55, 0.9], width: 4.6, height: 3 },
      };
      const profile = profiles[selected];
      target =
        selected === "music"
          ? [layout.music[0] + 0.25, 0.8, layout.music[2] + 0.2]
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
    } else if (portrait) {
      target = [-1.8, 0.6, 1.7];
      eye = along.map((d, i) => target[i] + d) as V3;
    } else {
      target = [-2.4, 0.8, 2.8];
      eye = mobile ? [7.4, 17.5, 51] : [3.4, 10.5, 24.5];
    }
    c.smoothTime = reduced ? 0 : selected ? 0.65 : 0.85;
    // the distant view is where the camera starts, so it is placed rather than flown to
    void c.setLookAt(...eye, ...target, !reduced && entered).then(() => {
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
    invalidate,
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
  onDismiss,
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
          <group rotation={[0, BIKE_YAW, 0]} scale={1.7}>
            <KtmCorner />
          </group>
        </Pickable>
        <Pickable
          id="track"
          at={layout.ducati}
          label="On the track · Ducati"
          onSelect={onSelect}
          selected={selected}
        >
          {/* on its paddock stands and pit mat, nose turned in toward the desk so the main view
              meets its exhaust side, not its headlights (1 m = 1.7 units) */}
          <group rotation={[0, BIKE_YAW, 0]} scale={1.7}>
            <TrackCorner />
          </group>
        </Pickable>
        <Pickable
          id="music"
          at={layout.music}
          label="A little Pink Floyd?"
          onSelect={onSelect}
          selected={selected}
        >
          {/* music sits 0.585 above the floor */}
          <group rotation={[0, -0.5, 0]} position={[0, -0.585, 0]}>
            <MusicCorner />
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
          at={layout.leathers}
          label="Riding gear"
          onSelect={onSelect}
          selected={selected}
        >
          {/* the suit faces into the room */}
          <group rotation={[0, Math.PI / 2, 0]}>
            <LeathersRail />
          </group>
        </Pickable>
        <Pickable
          id="track"
          at={layout.table}
          label="Riding gear"
          onSelect={onSelect}
          selected={selected}
        >
          <group rotation={[0, Math.PI / 2, 0]}>
            <GearTable />
          </group>
        </Pickable>
        <Lamp night={night} onToggle={onToggle} />
      </group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.085, 0]}
        receiveShadow
        onClick={(e) => {
          // a click on bare floor (not the end of a drag) steps back out to the room
          if (e.delta < 4) onDismiss();
        }}
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
        onPointerMissed={(e) => {
          if (e.type === "click") props.onDismiss();
        }}
        frameloop="demand"
        shadows
        dpr={[1, 1.75]}
        // near at 0.08: the closest view (a laptop close-up) is ~0.86 away, and a larger near
        // plane buys the depth precision that keeps thin layers like screens from flickering
        camera={{ position: [18, 13, 24], fov: 40, near: 0.08, far: 150 }}
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
