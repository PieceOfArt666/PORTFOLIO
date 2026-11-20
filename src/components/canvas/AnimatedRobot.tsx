import { useRef, useEffect, useMemo, useState } from 'react';
import { useFBX, useAnimations, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AnimatedRobotProps {
  scrollProgress?: number;
}

export function AnimatedRobot({ scrollProgress = 0 }: AnimatedRobotProps) {
  const groupRef = useRef<THREE.Group>(null);
  const fbx = useFBX('/models/robo-warrior-idle.fbx');
  const { actions, names } = useAnimations(fbx.animations, fbx);
  const [hovered, setHovered] = useState(false);

  const spotLightRef = useRef<THREE.SpotLight>(null);
  const targetObj = useMemo(() => {
    const obj = new THREE.Object3D();
    obj.position.set(0, 2.49, 0); // Exact face/eyes relative to group
    return obj;
  }, []);

  // Load the extracted high-resolution PBR textures
  const [colorMap, normalMap, roughnessMap] = useTexture([
    '/models/textures/texture_1_texture_pbr_20250901.png',
    '/models/textures/texture_0_texture_pbr_20250901_normal.png',
    '/models/textures/texture_2_texture_pbr_20250901_metallic-texture_pbr_20250901_roughness.png',
  ]);

  // Configure textures and apply to all SkinnedMeshes in the FBX
  useEffect(() => {
    colorMap.colorSpace = THREE.SRGBColorSpace;
    colorMap.needsUpdate = true;

    fbx.traverse((child) => {
      if ((child as THREE.SkinnedMesh).isSkinnedMesh || (child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.SkinnedMesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        mesh.material = new THREE.MeshStandardMaterial({
          map: colorMap,
          normalMap: normalMap,
          roughnessMap: roughnessMap,
          metalnessMap: roughnessMap,
          roughness: 0.38,
          metalness: 0.72,
          envMapIntensity: 1.8,
        });
      }
    });
  }, [fbx, colorMap, normalMap, roughnessMap]);

  // Connect spotlight target
  useEffect(() => {
    if (spotLightRef.current) {
      spotLightRef.current.target = targetObj;
    }
  }, [targetObj]);

  // Start the Warrior Idle animation loop
  useEffect(() => {
    if (names.length > 0) {
      const animName = names[0];
      const action = actions[animName];
      if (action) {
        action.reset().fadeIn(0.5).play();
        action.timeScale = 0.95; // Smooth realistic breathing speed
      }
    }
  }, [actions, names]);

  // Dynamic animations: Head gaze tracking mouse, subtle floating, scroll reactivity
  useFrame((state, delta) => {
    if (groupRef.current) {
      // 1. Mouse gaze / yaw tracking (robot gently turns to face cursor)
      const targetYaw = state.pointer.x * 0.25;
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetYaw,
        3.8,
        delta
      );

      // 2. Subtle pitch tracking
      const scrollTilt = Math.sin(scrollProgress * Math.PI * 2) * 0.02;
      const targetPitch = -state.pointer.y * 0.12 + scrollTilt;
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetPitch,
        3.8,
        delta
      );

      // 3. Hover reaction
      const targetY = hovered ? 0.04 : 0;
      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y,
        targetY,
        4.0,
        delta
      );
    }
  });

  // Ambient drifting cyber energy sparks around head and collar
  const particles = useMemo(() => {
    const count = 45;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 3.6;
      positions[i * 3 + 1] = Math.random() * 2.8 - 0.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3.6;
    }
    return positions;
  }, []);

  const particlesRef = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <group
      position={[1.2, -1.33, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <primitive object={targetObj} />

      {/* Head & Collar Key Spotlight */}
      <spotLight
        ref={spotLightRef}
        position={[0, 3.4, 2.2]}
        intensity={2.8}
        angle={0.65}
        penumbra={0.6}
        color="#FFFFFF"
      />

      {/* Crimson Rim Lights for Full Silhouette & Head Contours */}
      <pointLight position={[-2.2, 2.45, 0.4]} color="#EF4444" intensity={3.8} distance={4.5} />
      <pointLight position={[2.2, 2.45, 0.4]} color="#EF4444" intensity={3.8} distance={4.5} />

      {/* Chest Arc Reactor / Triangle Glow */}
      <pointLight position={[0, 2.15, 0.9]} color="#EF4444" intensity={2.0} distance={2.5} />

      {/* Full Body Lower Fill Light for Full Body Shot */}
      <pointLight position={[0, 0.6, 1.2]} color="#DC2626" intensity={1.4} distance={2.8} />

      {/* Animated Skinned Robot */}
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Scale 0.029 places eyes at y=1.16 and feet on ground at y=-1.15 */}
        <primitive object={fbx} scale={0.029} position={[0, 0, 0]} />
      </group>

      {/* Drifting Crimson Cyber Sparks around the Head & Bust */}
      <points ref={particlesRef} position={[0, 2.3, 0]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#EF4444"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

useFBX.preload('/models/robo-warrior-idle.fbx');
