import { useRef, useMemo, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface UserRobotProps {
  scrollProgress?: number;
}

export function UserRobot({ scrollProgress = 0 }: UserRobotProps) {
  const { scene } = useGLTF('/models/robo.glb');
  const robotRef = useRef<THREE.Group>(null);
  const meshGroupRef = useRef<THREE.Group>(null);
  const chestLightRef = useRef<THREE.PointLight>(null);
  const leftRimRef = useRef<THREE.PointLight>(null);
  const rightRimRef = useRef<THREE.PointLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);

  const [hovered, setHovered] = useState(false);
  const [powerSurge, setPowerSurge] = useState(0); // 0 to 1 decay on click
  const smoothedScrollVelocity = useRef(0);
  const prevScroll = useRef(scrollProgress);

  const targetObj = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(0, 1.8, 0); // Focus on eyes/visor relative to group
    return obj;
  }, []);

  // Connect spotlight target
  useEffect(() => {
    if (spotLightRef.current) {
      spotLightRef.current.target = targetObj;
    }
  }, [targetObj]);

  // Setup materials, enhance normal maps, metallic reflections & crimson glow
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = Math.min(mat.roughness ?? 0.32, 0.48);
          mat.metalness = Math.max(mat.metalness ?? 0.68, 0.82);
          mat.envMapIntensity = 1.85;
          mat.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  // Handle click power surge animation
  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setPowerSurge(1.0);
  };

  // Silky-Smooth Procedural Motion Engine:
  // 1. Unified organic harmonic breathing & micro-hovering (zero conflicting springs)
  // 2. Smooth C^2 continuous autonomous scanning glance cycle
  // 3. Low-pass filtered scroll velocity damping
  // 4. Elastic mouse gaze tracking with coordinated banking roll
  // 5. Breathing chest expansion on model mesh
  // 6. Arc reactor heartbeat glow
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // 1. Exponential decay for interactive click surge
    if (powerSurge > 0) {
      setPowerSurge((prev) => Math.max(0, prev - delta * 2.5));
    }

    // 2. Smoothly filter scroll velocity so wheel increments are absorbed continuously
    const rawScrollDelta = (scrollProgress - prevScroll.current) / Math.max(delta, 0.001);
    prevScroll.current = scrollProgress;
    smoothedScrollVelocity.current = THREE.MathUtils.damp(
      smoothedScrollVelocity.current,
      rawScrollDelta,
      4.0,
      delta
    );

    if (robotRef.current && meshGroupRef.current) {
      // 3. Unified Harmonic Breathing & Floating (Smooth Sine waves, no conflicting Float wrapper)
      const breathPhase = t * 1.8;
      const verticalBreath = Math.sin(breathPhase) * 0.022;
      const microFloat = Math.sin(t * 0.9) * 0.01;
      const hoverLift = hovered ? 0.045 : 0;
      const surgeRecoilY = Math.sin(powerSurge * Math.PI) * 0.04;
      const surgeRecoilZ = -powerSurge * 0.1;

      // Position damping
      const targetY = verticalBreath + microFloat + hoverLift + surgeRecoilY;
      robotRef.current.position.y = THREE.MathUtils.damp(
        robotRef.current.position.y,
        targetY,
        4.5,
        delta
      );
      robotRef.current.position.z = THREE.MathUtils.damp(
        robotRef.current.position.z,
        surgeRecoilZ,
        6.0,
        delta
      );

      // 4. Organic Chest Respiration Expansion (soft scale oscillation)
      const chestExpansion = 1.0 + Math.sin(breathPhase) * 0.006 + powerSurge * 0.02;
      meshGroupRef.current.scale.set(
        2.35 * chestExpansion,
        2.35,
        2.35 * chestExpansion
      );

      // 5. C^2 Smooth Autonomous Scanning Glance (glides smoothly every ~6s)
      const scanPeriod = Math.sin(t * 0.35);
      const scanEnvelope = Math.pow(Math.max(0, scanPeriod), 3); // C^2 continuous ease in & out
      const glanceAngle = Math.sin(t * 1.6) * scanEnvelope * 0.06;

      // 6. Kinetic Mouse Gaze Tracking with Fluid Damping & Natural Banking
      const targetYaw = state.pointer.x * 0.26 + glanceAngle;
      const scrollInertiaPitch = THREE.MathUtils.clamp(smoothedScrollVelocity.current * 0.015, -0.06, 0.06);
      const targetPitch = -state.pointer.y * 0.12 + scrollInertiaPitch - (powerSurge * 0.05);
      const targetRoll = -state.pointer.x * 0.05; // Banking roll tilt into turn

      robotRef.current.rotation.y = THREE.MathUtils.damp(
        robotRef.current.rotation.y,
        targetYaw,
        4.5,
        delta
      );
      robotRef.current.rotation.x = THREE.MathUtils.damp(
        robotRef.current.rotation.x,
        targetPitch,
        4.5,
        delta
      );
      robotRef.current.rotation.z = THREE.MathUtils.damp(
        robotRef.current.rotation.z,
        targetRoll,
        4.0,
        delta
      );
    }

    // 7. Dynamic Lighting Pulse (Arc Reactor Heartbeat & Overdrive Surge)
    if (chestLightRef.current) {
      const heartbeat = Math.sin(t * 2.8) * 0.35;
      const hoverBoost = hovered ? 0.8 : 0;
      const surgeIntensity = powerSurge * 3.0;
      chestLightRef.current.intensity = 2.0 + heartbeat + hoverBoost + surgeIntensity;
    }
    if (leftRimRef.current && rightRimRef.current) {
      const rimPulse = Math.sin(t * 2.0 + 1.0) * 0.25;
      const baseRim = hovered ? 4.4 : 3.8;
      const surgeRim = powerSurge * 2.5;
      leftRimRef.current.intensity = baseRim + rimPulse + surgeRim;
      rightRimRef.current.intensity = baseRim + rimPulse + surgeRim;
    }
  });

  // Ambient cyber energy motes drifting in turbulence around the bust & shoulders
  const particleCount = 55;
  const [positions, initialPos] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const init = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 3.4;
      const y = Math.random() * 3.0 - 0.2;
      const z = (Math.random() - 0.5) * 3.4;
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      init[i * 3] = x;
      init[i * 3 + 1] = y;
      init[i * 3 + 2] = z;
    }
    return [pos, init];
  }, []);

  const particlesRef = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (particlesRef.current) {
      const t = state.clock.elapsedTime * 0.35;
      particlesRef.current.rotation.y = t * 0.1;
      const geom = particlesRef.current.geometry;
      const posAttr = geom.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        array[i3 + 1] = initialPos[i3 + 1] + Math.sin(t * 1.5 + i) * 0.16;
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group
      position={[1.2, -1.15, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      <primitive object={targetObj} />

      {/* Head & Collar Key Spotlight */}
      <spotLight
        ref={spotLightRef}
        position={[0, 2.4, 2.2]}
        intensity={2.8}
        angle={0.65}
        penumbra={0.6}
        color="#FFFFFF"
      />

      {/* Dual Crimson Rim Lights for Flared Collar & Helmet Contours */}
      <pointLight ref={leftRimRef} position={[-2.2, 1.6, 0.4]} color="#EF4444" intensity={3.8} distance={4.5} />
      <pointLight ref={rightRimRef} position={[2.2, 1.6, 0.4]} color="#EF4444" intensity={3.8} distance={4.5} />

      {/* Chest Arc Reactor / Triangle Glowing Core with Heartbeat Pulse */}
      <pointLight ref={chestLightRef} position={[0, 1.35, 0.9]} color="#EF4444" intensity={2.0} distance={2.5} />

      {/* Full Body Lower Fill Light for Full Body Shot */}
      <pointLight position={[0, -0.4, 1.2]} color="#DC2626" intensity={1.4} distance={2.8} />

      {/* Procedurally Animated Living Robot (Unified Silky Damped Motion) */}
      <group ref={robotRef} position={[0, 0, 0]}>
        <group ref={meshGroupRef}>
          <primitive object={scene} position={[0, 0, 0]} />
        </group>
      </group>

      {/* Drifting Crimson Cyber Sparks */}
      <points ref={particlesRef} position={[0, 1.2, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.032}
          color="#EF4444"
          transparent
          opacity={0.88}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

useGLTF.preload('/models/robo.glb');
