import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";
import type { CameraControls } from "@react-three/drei";
import type { V3 } from "./parts";

// After the visitor has been still for a while, the camera takes a slow breath of its
// own: a gentle orbit around the desk, and every so often a closer look at one object.
// Any input hands the current pose straight back to the orbit controls — no jump.

export const IDLE = {
  /** seconds with no input before the drift begins */
  delay: 8,
  /** seconds of drifting before a glance, picked at random in this range */
  glanceEvery: [20, 30] as readonly [number, number],
  glanceIn: 6.2,
  glanceHold: 4.2,
  glanceOut: 6.2,
  fadeIn: 3.2,
  azimuth: 0.38, // radians of sway around the captured heading (~22°)
  polar: 0.055,
  distance: 0.09, // fraction of the captured distance
  azimuthPeriod: 48,
  polarPeriod: 17,
  distancePeriod: 23,
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

type Phase = "wait" | "drift" | "in" | "hold" | "out";

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
  // cosine ease: zero speed at both ends, no linear start or stop
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

function copyPose(from: Pose, to: Pose) {
  to.az = from.az;
  to.polar = from.polar;
  to.dist = from.dist;
  to.target.copy(from.target);
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
      delay: 1.2,
      glanceEvery: [3.5, 5],
      glanceIn: 2.4,
      glanceHold: 1.8,
      glanceOut: 2.4,
      fadeIn: 1.1,
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
  const { camera, size, setFrameloop, invalidate } = useThree();
  const phase = useRef<Phase>("wait");
  const allowedRef = useRef(allowed);
  const lastSubject = useRef<string | null>(null);
  const subject = useRef<IdleSubject | null>(null);
  const born = useRef(0);
  const blend = useRef(0);
  const glanceAt = useRef(0);
  const startTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const base = useRef(pose());
  const from = useRef(pose());
  const to = useRef(pose());
  const scratch = useRef(pose());
  const eye = useRef(new THREE.Vector3());
  const offset = useRef(new THREE.Vector3());
  const spherical = useRef(new THREE.Spherical());
  const sizeRef = useRef(size);
  const cameraRef = useRef(camera);

  const clearTimers = () => {
    if (startTimer.current) clearTimeout(startTimer.current);
    if (holdTimer.current) clearTimeout(holdTimer.current);
    startTimer.current = null;
    holdTimer.current = null;
  };

  const stop = () => {
    clearTimers();
    phase.current = "wait";
    subject.current = null;
    setFrameloop("demand");
  };

  const driftInto = (into: Pose, now: number) => {
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

  const beginGlance = () => {
    const c = controls.current;
    if (!c || phase.current !== "drift") return;
    const next = pickSubject(lastSubject.current);
    const cam = cameraRef.current as THREE.PerspectiveCamera;
    glancePose(
      next,
      sizeRef.current.width / sizeRef.current.height,
      cam.fov,
      to.current,
      offset.current,
      spherical.current,
    );
    driftInto(from.current, performance.now() / 1000);
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
    phase.current = "drift";
    setFrameloop("always");
  };

  const arm = () => {
    clearTimers();
    if (!allowedRef.current || document.hidden) return;
    startTimer.current = setTimeout(beginDrift, timings().delay * 1000);
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
    if (!c || current === "wait" || current === "hold") return;
    const now = performance.now() / 1000;
    const t = timings();
    if (current === "drift") {
      driftInto(scratch.current, now);
      applyPose(c, scratch.current, eye.current);
      if (now >= glanceAt.current) beginGlance();
      return;
    }
    if (current === "in") {
      const u = ease((now - blend.current) / t.glanceIn);
      mixPose(from.current, to.current, u, scratch.current);
      applyPose(c, scratch.current, eye.current);
      if (u >= 1) {
        phase.current = "hold";
        setFrameloop("demand");
        invalidate();
        holdTimer.current = setTimeout(() => {
          if (phase.current !== "hold" || !allowedRef.current) return;
          copyPose(to.current, from.current);
          blend.current = performance.now() / 1000;
          phase.current = "out";
          setFrameloop("always");
        }, t.glanceHold * 1000);
      }
      return;
    }
    const u = ease((now - blend.current) / t.glanceOut);
    driftInto(to.current, now);
    mixPose(from.current, to.current, u, scratch.current);
    applyPose(c, scratch.current, eye.current);
    if (u >= 1) {
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
    else arm();
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
    interrupt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.width, size.height]);
}
