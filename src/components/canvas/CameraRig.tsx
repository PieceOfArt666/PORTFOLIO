import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface CameraRigProps {
  scrollProgress: number; // 0 to 1
}

export function CameraRig({ scrollProgress }: CameraRigProps) {
  const { camera, pointer } = useThree();

  // Create smooth centripetal Catmull-Rom spline curves for continuous, seamless cinematic motion
  const { posCurve, lookCurve } = useMemo(() => {
    // Keyframe points matching the exact desired framing:
    const p0 = new THREE.Vector3(1.25, 1.22, 1.7); // Hero tight head focus
    const p1 = new THREE.Vector3(1.7, 0.35, 4.7);  // Philosophy full body reveal
    const p2 = new THREE.Vector3(2.5, 0.75, 2.3);  // Projects 3/4 profile orbit
    const p3 = new THREE.Vector3(1.3, 0.45, 2.6);  // Contact heroic low angle

    const l0 = new THREE.Vector3(1.2, 1.16, 0);    // Head & eyes gaze
    const l1 = new THREE.Vector3(1.2, 0.15, 0);    // Torso & center of mass
    const l2 = new THREE.Vector3(1.2, 0.65, 0);    // Upper chest & collar
    const l3 = new THREE.Vector3(1.2, 0.95, 0);    // Low-angle looking up

    const pos = new THREE.CatmullRomCurve3([p0, p1, p2, p3], false, 'centripetal', 0.5);
    const look = new THREE.CatmullRomCurve3([l0, l1, l2, l3], false, 'centripetal', 0.5);

    return { posCurve: pos, lookCurve: look };
  }, []);

  const smoothedScroll = useRef(scrollProgress);
  const currentLookAt = useRef(new THREE.Vector3(1.2, 1.16, 0));

  useFrame((_, delta) => {
    // 1. Smooth the raw scroll progress with fluid damping to absorb abrupt wheel increments
    smoothedScroll.current = THREE.MathUtils.damp(
      smoothedScroll.current,
      THREE.MathUtils.clamp(scrollProgress, 0, 1),
      5.5,
      delta
    );

    const t = smoothedScroll.current;

    // 2. Evaluate continuous spline trajectory (guaranteed C1 and C2 continuity)
    const targetPos = posCurve.getPoint(t);
    const targetLook = lookCurve.getPoint(t);

    // 3. Ultra-subtle responsive mouse parallax
    const mouseInfluenceX = pointer.x * 0.12;
    const mouseInfluenceY = pointer.y * 0.08;

    // 4. Smooth camera translation damping
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetPos.x + mouseInfluenceX, 4.2, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetPos.y + mouseInfluenceY, 4.2, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPos.z, 4.2, delta);

    // 5. Smooth camera look-at damping
    currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, targetLook.x, 4.2, delta);
    currentLookAt.current.y = THREE.MathUtils.damp(currentLookAt.current.y, targetLook.y, 4.2, delta);
    currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, targetLook.z, 4.2, delta);

    camera.lookAt(currentLookAt.current);
  });

  return null;
}
