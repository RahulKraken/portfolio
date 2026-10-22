import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import type { CameraControls } from "@react-three/drei";
import type { V3 } from "./parts";

// As soon as the studio is ready, the camera takes a slow breath of its own: a
// gentle orbit around the desk, and every so often a closer look at one object,
// still moving — the object becomes the orbit centre for a while, then the path
// flows back out to the desk. Any input hands the current pose straight back to
// the orbit controls — no jump.

export const IDLE = {
  /** first start once the room is ready; 0 = immediately */
  delay: 0,
  /** seconds after input before idle resumes, so a drag can finish cleanly */
  resume: 1.6,
  /** seconds of drifting before a glance, picked at random in this range */
  glanceEvery: [20, 30] as readonly [number, number],
  glanceIn: 6.2,
  /** seconds fully on the object orbit; the camera keeps moving the whole time */
  glanceStay: 5.4,
  glanceOut: 6.2,
  fadeIn: 2.2,
  azimuth: 0.38, // radians of sway around the captured heading (~22°)
  polar: 0.055,
  distance: 0.09, // fraction of the captured distance
  azimuthPeriod: 48,
  polarPeriod: 17,
  distancePeriod: 23,
  objectAzimuth: 0.26,
  objectPolar: 0.04,
  objectDistance: 0.06,
  objectAzimuthPeriod: 26,
  objectPolarPeriod: 14,
  objectDistancePeriod: 19,
  minY: 0.48,
  minPolar: 0.16,
  maxPolar: Math.PI / 2 - 0.06,
  minDistance: 2.4,
  /** glances sit a little further back than the click-to-inspect cameras */
  pull: 1.32,
};

type IdleSubject = {
  id: string;
  target: V3;
  direction: V3;
  width: number;
  height: number;
};

// Floor-plan targets match RoomScene's layout; directions follow the inspect cameras
// so a glance frames the object from the same side a visitor would walk up to it.
const SUBJECTS: IdleSubject[] = [
  {
    id: "ducati",
    target: [-5.85, 0.95, 2.25],
    direction: [0.6, 0.55, 0.9],
    width: 4.6,
    height: 3,
  },
  {
    id: "ktm",
    target: [-6.1, 0.95, -0.1],
    direction: [1, 0.6, 0.3],
    width: 4.2,
    height: 2.8,
  },
  {
    id: "music",
    target: [3.3, 0.8, 0.25],
    direction: [-0.56, 0.28, 1],
    width: 1.95,
    height: 2.15,
  },
  {
    id: "coffee",
    target: [5.16, 0.78, 3.0],
    direction: [-1, 0.55, 0.75],
    width: 1.9,
    height: 2.05,
  },
  {
    id: "gear",
    target: [-7.8, 1.15, 4.725],
    direction: [0.85, 0.48, 0.55],
    width: 3.6,
    height: 2.7,
  },
];

type Phase = "wait" | "drift" | "in" | "look" | "out";

type Pose = {
  az: number;
  polar: number;
  dist: number;
  target: THREE.Vector3;
};

const INPUT_EVENTS = [
  "pointerdown",
  "pointermove",
  "touchstart",
  "wheel",
  "keydown",
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function ease(t: number) {
  // cosine: zero derivative at both ends, so blending two live orbits does not
  // kick the camera's speed when a glance begins or ends
  return 0.5 - 0.5 * Math.cos(Math.PI * clamp(t, 0, 1));
}

function fade(t: number, duration: number) {
  const x = clamp(t / duration, 0, 1);
  return x * x * (3 - 2 * x);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpAngle(a: number, b: number, t: number) {
  return a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * t;
}

function wave(t: number, period: number, phase: number) {
  return Math.sin((t * Math.PI * 2) / period + phase);
}

function pose(): Pose {
  return { az: 0, polar: 1, dist: 20, target: new THREE.Vector3() };
}

function readPose(controls: CameraControls, into: Pose) {
  controls.getTarget(into.target, false);
  into.az = controls.azimuthAngle;
  into.polar = controls.polarAngle;
  into.dist = controls.distance;
}

function applyPose(controls: CameraControls, pose: Pose, eye: THREE.Vector3) {
  const polar = clamp(pose.polar, IDLE.minPolar, IDLE.maxPolar);
  const dist = Math.max(IDLE.minDistance, pose.dist);
  eye.setFromSphericalCoords(dist, polar, pose.az).add(pose.target);
  if (eye.y < IDLE.minY) eye.y = IDLE.minY;
  void controls.setLookAt(
    eye.x,
    eye.y,
    eye.z,
    pose.target.x,
    pose.target.y,
    pose.target.z,
    false,
  );
}

function mixPose(a: Pose, b: Pose, t: number, into: Pose) {
  into.az = lerpAngle(a.az, b.az, t);
  into.polar = lerp(a.polar, b.polar, t);
  into.dist = lerp(a.dist, b.dist, t);
  into.target.lerpVectors(a.target, b.target, t);
}

function glancePose(
  subject: IdleSubject,
  aspect: number,
  fovDeg: number,
  into: Pose,
  offset: THREE.Vector3,
  spherical: THREE.Spherical,
) {
  const fov = THREE.MathUtils.degToRad(fovDeg);
  const distance =
    (Math.max(subject.height, subject.width / aspect) /
      (2 * Math.tan(fov / 2))) *
    IDLE.pull;
  into.target.set(...subject.target);
  offset.set(...subject.direction).normalize().multiplyScalar(distance);
  if (into.target.y + offset.y < IDLE.minY)
    offset.y = IDLE.minY - into.target.y;
  spherical.setFromVector3(offset);
  into.az = spherical.theta;
  into.polar = spherical.phi;
  into.dist = spherical.radius;
}

function pickSubject(last: string | null) {
  const pool = last
    ? SUBJECTS.filter((subject) => subject.id !== last)
    : SUBJECTS;
  return pool[Math.floor(Math.random() * pool.length)];
}

let timed: typeof IDLE | null = null;
function timings(): typeof IDLE {
  if (timed) return timed;
  if (
    process.env.NODE_ENV === "development" &&
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("idle") === "fast"
  ) {
    timed = {
      ...IDLE,
      delay: 0,
      resume: 0.45,
      glanceEvery: [3.5, 5],
      glanceIn: 2.8,
      glanceStay: 3.2,
      glanceOut: 2.8,
      fadeIn: 0.9,
    };
    return timed;
  }
  timed = IDLE;
  return timed;
}

export function useAmbientCamera(
  controls: RefObject<CameraControls | null>,
  allowed: boolean,
) {
  const { camera, size, setFrameloop } = useThree();
  const phase = useRef<Phase>("wait");
  const allowedRef = useRef(allowed);
  const started = useRef(false);
  const skipSize = useRef(true);
  const lastSubject = useRef<string | null>(null);
  const subject = useRef<IdleSubject | null>(null);
  const born = useRef(0);
  const blend = useRef(0);
  const glanceAt = useRef(0);
  const lookUntil = useRef(0);
  const startTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const base = useRef(pose());
  const objectBase = useRef(pose());
  const desk = useRef(pose());
  const look = useRef(pose());
  const scratch = useRef(pose());
  const eye = useRef(new THREE.Vector3());
  const offset = useRef(new THREE.Vector3());
  const spherical = useRef(new THREE.Spherical());
  const sizeRef = useRef(size);
  const cameraRef = useRef(camera);

  const clearTimers = () => {
    if (startTimer.current) clearTimeout(startTimer.current);
    startTimer.current = null;
  };

  const stop = () => {
    clearTimers();
    phase.current = "wait";
    subject.current = null;
    setFrameloop("demand");
  };

  const deskOrbit = (into: Pose, now: number) => {
    const t = now - born.current;
    const amount = fade(t, timings().fadeIn);
    const b = base.current;
    into.az = b.az + IDLE.azimuth * wave(t, IDLE.azimuthPeriod, 0) * amount;
    into.polar = clamp(
      b.polar + IDLE.polar * wave(t, IDLE.polarPeriod, 1.15) * amount,
      IDLE.minPolar,
      IDLE.maxPolar,
    );
    into.dist = Math.max(
      IDLE.minDistance,
      b.dist * (1 + IDLE.distance * wave(t, IDLE.distancePeriod, 0.4) * amount),
    );
    into.target.copy(b.target);
    into.target.x += 0.16 * wave(t, 29, 0.3) * amount;
    into.target.y += 0.07 * wave(t, 21, 1.4) * amount;
    into.target.z += 0.12 * wave(t, 33, 2.0) * amount;
  };

  const objectOrbit = (into: Pose, now: number) => {
    // same clock as the desk so this path is already in motion when we blend in
    const t = now - born.current;
    const b = objectBase.current;
    into.az =
      b.az + IDLE.objectAzimuth * wave(t, IDLE.objectAzimuthPeriod, 0.4);
    into.polar = clamp(
      b.polar +
        IDLE.objectPolar * wave(t, IDLE.objectPolarPeriod, 1.7),
      IDLE.minPolar,
      IDLE.maxPolar,
    );
    into.dist = Math.max(
      IDLE.minDistance,
      b.dist *
        (1 +
          IDLE.objectDistance * wave(t, IDLE.objectDistancePeriod, 0.9)),
    );
    into.target.copy(b.target);
  };

  const beginGlance = () => {
    const c = controls.current;
    if (!c || phase.current !== "drift") return;
    const next = pickSubject(lastSubject.current);
    const cam = cameraRef.current as THREE.PerspectiveCamera;
    glancePose(
      next,
      sizeRef.current.width / sizeRef.current.height,
      cam.fov,
      objectBase.current,
      offset.current,
      spherical.current,
    );
    subject.current = next;
    lastSubject.current = next.id;
    blend.current = performance.now() / 1000;
    phase.current = "in";
    setFrameloop("always");
  };

  const beginDrift = () => {
    const c = controls.current;
    if (!c || !allowedRef.current || document.hidden) return;
    if (
      process.env.NODE_ENV === "development" &&
      new URLSearchParams(window.location.search).has("cam")
    ) {
      return;
    }
    readPose(c, base.current);
    born.current = performance.now() / 1000;
    glanceAt.current = born.current + rand(...timings().glanceEvery);
    started.current = true;
    phase.current = "drift";
    setFrameloop("always");
  };

  const arm = (seconds?: number) => {
    clearTimers();
    if (!allowedRef.current || document.hidden) return;
    const wait = seconds ?? timings().resume;
    if (wait <= 0) beginDrift();
    else startTimer.current = setTimeout(beginDrift, wait * 1000);
  };

  const interrupt = () => {
    stop();
    if (allowedRef.current && !document.hidden) arm();
  };

  useFrame(() => {
    sizeRef.current = size;
    cameraRef.current = camera;
    allowedRef.current = allowed;
    const c = controls.current;
    const current = phase.current;
    if (!c || current === "wait") return;
    const now = performance.now() / 1000;
    const t = timings();
    deskOrbit(desk.current, now);
    if (current === "drift") {
      applyPose(c, desk.current, eye.current);
      if (now >= glanceAt.current) beginGlance();
      return;
    }
    objectOrbit(look.current, now);
    let weight = 1;
    if (current === "in") weight = ease((now - blend.current) / t.glanceIn);
    else if (current === "out")
      weight = 1 - ease((now - blend.current) / t.glanceOut);
    mixPose(desk.current, look.current, weight, scratch.current);
    applyPose(c, scratch.current, eye.current);
    if (current === "in" && now - blend.current >= t.glanceIn) {
      phase.current = "look";
      lookUntil.current = now + t.glanceStay;
      return;
    }
    if (current === "look" && now >= lookUntil.current) {
      blend.current = now;
      phase.current = "out";
      return;
    }
    if (current === "out" && now - blend.current >= t.glanceOut) {
      subject.current = null;
      glanceAt.current = now + rand(...t.glanceEvery);
      phase.current = "drift";
    }
  });

  useEffect(() => {
    sizeRef.current = size;
    cameraRef.current = camera;
    allowedRef.current = allowed;
  });

  useEffect(() => {
    if (!allowed) stop();
    else arm(started.current ? timings().resume : timings().delay);
    return () => clearTimers();
    // stop/arm close over setFrameloop; re-arm when eligibility changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed]);

  useEffect(() => {
    const onInput = () => interrupt();
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (allowedRef.current) arm();
    };
    INPUT_EVENTS.forEach((event) =>
      window.addEventListener(event, onInput, { capture: true, passive: true }),
    );
    document.addEventListener("visibilitychange", onVisibility);
    const c = controls.current;
    const onControl = () => interrupt();
    c?.addEventListener("controlstart", onControl);
    if (process.env.NODE_ENV === "development") {
      Object.assign(window, {
        __idle: {
          start: () => {
            if (allowedRef.current) beginDrift();
          },
          glance: () => beginGlance(),
          get phase() {
            return phase.current;
          },
          get subject() {
            return subject.current?.id ?? null;
          },
        },
      });
    }
    return () => {
      INPUT_EVENTS.forEach((event) =>
        window.removeEventListener(event, onInput, { capture: true }),
      );
      document.removeEventListener("visibilitychange", onVisibility);
      c?.removeEventListener("controlstart", onControl);
      stop();
      if (process.env.NODE_ENV === "development") {
        delete (window as Window & { __idle?: unknown }).__idle;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls]);

  // a restage (reset view, resize) should yield so CameraRig can fly the camera
  useEffect(() => {
    if (skipSize.current) {
      skipSize.current = false;
      return;
    }
    interrupt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.width, size.height]);
}
