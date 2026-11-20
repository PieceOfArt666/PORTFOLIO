import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBox, Float } from '@react-three/drei';

export function CozyDiorama() {
  const groupRef = useRef<THREE.Group>(null);
  const controllerRef = useRef<THREE.Group>(null);
  const mugRef = useRef<THREE.Group>(null);
  const cartridgeRef = useRef<THREE.Group>(null);
  const [controllerHovered, setControllerHovered] = useState(false);
  const [mugHovered, setMugHovered] = useState(false);
  const [cartridgeHovered, setCartridgeHovered] = useState(false);

  // Micro-animations on hover and idle
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }

    if (controllerRef.current) {
      const targetY = controllerHovered ? 0.24 : 0.06;
      controllerRef.current.position.y = THREE.MathUtils.damp(controllerRef.current.position.y, targetY, 5, delta);
      controllerRef.current.rotation.y += delta * (controllerHovered ? 1.4 : 0.2);
    }

    if (mugRef.current) {
      const targetY = mugHovered ? 0.15 : 0.08;
      mugRef.current.position.y = THREE.MathUtils.damp(mugRef.current.position.y, targetY, 4, delta);
    }

    if (cartridgeRef.current) {
      const targetY = cartridgeHovered ? 0.2 : 0.08;
      cartridgeRef.current.position.y = THREE.MathUtils.damp(cartridgeRef.current.position.y, targetY, 4, delta);
    }
  });

  // Floating crimson & starlight sparks
  const particles = useMemo(() => {
    const count = 45;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = Math.random() * 3.5 - 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return positions;
  }, []);

  const particlesRef = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.035;
    }
  });

  return (
    <group ref={groupRef} position={[1.15, -0.4, 0]}>
      {/* 1. Sleek Smoked Glass & Obsidian Desk Mat */}
      <mesh receiveShadow position={[0, 0.005, 0.05]} rotation={[-Math.PI / 2, 0, 0.08]}>
        <planeGeometry args={[1.9, 1.2]} />
        <meshStandardMaterial color="#0E0D12" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Crimson Red Precision Grid Lines */}
      <gridHelper
        args={[1.7, 10, '#EF4444', '#7F1D1D']}
        position={[0, 0.01, 0.05]}
        rotation={[0, 0.08, 0]}
      />

      {/* 2. Interactive Obsidian & Red Gloss Controller */}
      <group
        ref={controllerRef}
        position={[-0.15, 0.06, 0.15]}
        rotation={[0.08, -0.2, 0.04]}
        onPointerOver={() => setControllerHovered(true)}
        onPointerOut={() => setControllerHovered(false)}
      >
        <RoundedBox args={[0.82, 0.16, 0.48]} radius={0.07} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color="#141318" roughness={0.25} metalness={0.8} />
        </RoundedBox>
        {/* D-Pad (Vivid Crimson Red) */}
        <mesh position={[-0.22, 0.09, 0]} castShadow>
          <boxGeometry args={[0.16, 0.05, 0.16]} />
          <meshStandardMaterial color="#DC2626" roughness={0.3} />
        </mesh>
        {/* Face Action Buttons (Ruby Glass & White Accents) */}
        <mesh position={[0.22, 0.09, -0.06]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.04, 12]} />
          <meshStandardMaterial color="#EF4444" roughness={0.2} metalness={0.5} />
        </mesh>
        <mesh position={[0.28, 0.09, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.04, 12]} />
          <meshStandardMaterial color="#B91C1C" roughness={0.2} metalness={0.5} />
        </mesh>
        <mesh position={[0.16, 0.09, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.04, 12]} />
          <meshStandardMaterial color="#EF4444" roughness={0.2} metalness={0.5} />
        </mesh>
        <mesh position={[0.22, 0.09, 0.06]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.04, 12]} />
          <meshStandardMaterial color="#F4F4F6" roughness={0.2} metalness={0.9} />
        </mesh>
      </group>

      {/* 3. Obsidian Ceramic Mug with Red Inner Lip */}
      <group
        ref={mugRef}
        position={[-0.7, 0.08, -0.25]}
        onPointerOver={() => setMugHovered(true)}
        onPointerOut={() => setMugHovered(false)}
      >
        <mesh castShadow receiveShadow position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.15, 0.13, 0.28, 24]} />
          <meshStandardMaterial color="#16151B" roughness={0.15} metalness={0.4} />
        </mesh>
        {/* Red Rim Accent */}
        <mesh position={[0, 0.27, 0]}>
          <torusGeometry args={[0.145, 0.012, 12, 24]} />
          <meshStandardMaterial color="#DC2626" roughness={0.2} />
        </mesh>
        {/* Dark Espresso */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.02, 24]} />
          <meshStandardMaterial color="#120B0D" roughness={0.1} />
        </mesh>
        {/* Handle */}
        <mesh position={[0.16, 0.14, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.08, 0.025, 12, 24, Math.PI]} />
          <meshStandardMaterial color="#16151B" roughness={0.15} metalness={0.4} />
        </mesh>
      </group>

      {/* 4. Sleek Matte Black & Crimson Game Cartridge */}
      <group
        ref={cartridgeRef}
        position={[0.65, 0.08, 0.18]}
        rotation={[-0.1, 0.25, -0.05]}
        onPointerOver={() => setCartridgeHovered(true)}
        onPointerOut={() => setCartridgeHovered(false)}
      >
        <RoundedBox args={[0.34, 0.12, 0.44]} radius={0.03} smoothness={3} castShadow receiveShadow>
          <meshStandardMaterial color="#1B1920" roughness={0.3} metalness={0.5} />
        </RoundedBox>
        {/* Foil Crimson Red Label */}
        <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.26, 0.32]} />
          <meshStandardMaterial color="#DC2626" roughness={0.2} metalness={0.8} />
        </mesh>
      </group>

      {/* 5. Floating Ruby Glass System Nodes */}
      <Float speed={1.8} rotationIntensity={0.35} floatIntensity={0.55}>
        <group position={[0.4, 0.95, -0.2]} rotation={[0.15, -0.35, 0.08]}>
          {/* Core System Node (Ruby Red Crystal Glass) */}
          <RoundedBox args={[0.34, 0.34, 0.34]} radius={0.05} smoothness={3} castShadow>
            <meshStandardMaterial color="#EF4444" roughness={0.1} metalness={0.2} />
          </RoundedBox>
          {/* Sub-node 1 (Smoked Obsidian Glass) */}
          <group position={[-0.5, -0.32, 0.25]}>
            <RoundedBox args={[0.22, 0.22, 0.22]} radius={0.03} smoothness={3} castShadow>
              <meshStandardMaterial color="#1E1C24" roughness={0.2} metalness={0.8} />
            </RoundedBox>
          </group>
          {/* Sub-node 2 (Deep Blood-Red Accent) */}
          <group position={[0.5, 0.28, -0.2]}>
            <RoundedBox args={[0.2, 0.2, 0.2]} radius={0.03} smoothness={3} castShadow>
              <meshStandardMaterial color="#991B1B" roughness={0.15} metalness={0.5} />
            </RoundedBox>
          </group>
        </group>
      </Float>

      {/* 6. Crimson & Starlight Floating Energy Sparks */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.032}
          color="#EF4444"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
