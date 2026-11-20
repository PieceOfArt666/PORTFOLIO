import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';

interface SleekCarProps {
  scrollProgress?: number;
}

export function SleekCar({ scrollProgress = 0 }: SleekCarProps) {
  const carGroupRef = useRef<THREE.Group>(null);
  const frontLeftWheelRef = useRef<THREE.Group>(null);
  const frontRightWheelRef = useRef<THREE.Group>(null);
  const rearLeftWheelRef = useRef<THREE.Group>(null);
  const rearRightWheelRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Animation: Wheels rotation & dynamic steering on scroll/mouse
  useFrame((state, delta) => {
    // Subtle breathing / idle suspension & dynamic scroll inertia
    if (carGroupRef.current) {
      const scrollTilt = Math.sin(scrollProgress * Math.PI * 2) * 0.025;
      const targetPitch = (hovered ? 0.04 : 0) + scrollTilt;
      carGroupRef.current.rotation.x = THREE.MathUtils.damp(
        carGroupRef.current.rotation.x,
        targetPitch,
        4,
        delta
      );

      // Car yaws slightly towards mouse pointer for responsive game feel
      const targetYaw = (state.pointer.x * 0.18);
      carGroupRef.current.rotation.y = THREE.MathUtils.damp(
        carGroupRef.current.rotation.y,
        targetYaw,
        3,
        delta
      );
    }

    // Spin wheels according to scroll activity & idle
    const spinSpeed = delta * (hovered ? 8 : 1.2);
    if (frontLeftWheelRef.current) frontLeftWheelRef.current.rotation.x += spinSpeed;
    if (frontRightWheelRef.current) frontRightWheelRef.current.rotation.x += spinSpeed;
    if (rearLeftWheelRef.current) rearLeftWheelRef.current.rotation.x += spinSpeed;
    if (rearRightWheelRef.current) rearRightWheelRef.current.rotation.x += spinSpeed;

    // Front wheels steer slightly with mouse
    const steerAngle = state.pointer.x * 0.25;
    if (frontLeftWheelRef.current) frontLeftWheelRef.current.rotation.y = steerAngle;
    if (frontRightWheelRef.current) frontRightWheelRef.current.rotation.y = steerAngle;
  });

  // Stardust / energy sparks drifting around the car
  const particles = useMemo(() => {
    const count = 40;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = Math.random() * 2.5 - 0.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return positions;
  }, []);

  const particlesRef = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.04;
    }
  });

  return (
    <group
      ref={carGroupRef}
      position={[1.15, -0.28, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={0.92}
    >
      {/* =========================================================================
          1. SHOWROOM LASER TELEMETRY RINGS (Directly on Showroom Floor)
         ========================================================================= */}
      <mesh position={[0, -0.36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.85, 1.88, 64]} />
        <meshBasicMaterial color="#EF4444" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, -0.36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.15, 2.17, 64]} />
        <meshBasicMaterial color="#DC2626" transparent opacity={0.35} />
      </mesh>

      {/* =========================================================================
          2. CAR CHASSIS / LOWER BODY (Obsidian Black Aerodynamics)
         ========================================================================= */}
      {/* Lower Main Tub */}
      <RoundedBox args={[1.35, 0.28, 2.9]} radius={0.08} smoothness={4} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#111015" roughness={0.2} metalness={0.8} />
      </RoundedBox>

      {/* Front Nose / Splitter */}
      <RoundedBox args={[1.28, 0.12, 0.7]} radius={0.05} smoothness={3} position={[0, -0.06, 1.5]} castShadow>
        <meshStandardMaterial color="#0A0A0C" roughness={0.1} metalness={0.9} />
      </RoundedBox>
      {/* Front Splitter Carbon/Red Lip */}
      <mesh position={[0, -0.11, 1.82]}>
        <boxGeometry args={[1.32, 0.025, 0.12]} />
        <meshStandardMaterial color="#EF4444" roughness={0.3} />
      </mesh>

      {/* Front Hood / Frunk Cover */}
      <RoundedBox args={[1.18, 0.14, 1.05]} radius={0.06} smoothness={3} position={[0, 0.12, 0.85]} castShadow>
        <meshStandardMaterial color="#16141B" roughness={0.18} metalness={0.82} />
      </RoundedBox>

      {/* Hood Aerodynamic Air Vents (Ruby Accent) */}
      <mesh position={[-0.24, 0.2, 0.75]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.16, 0.02, 0.35]} />
        <meshStandardMaterial color="#DC2626" roughness={0.4} />
      </mesh>
      <mesh position={[0.24, 0.2, 0.75]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.16, 0.02, 0.35]} />
        <meshStandardMaterial color="#DC2626" roughness={0.4} />
      </mesh>

      {/* Side Skirts with Crimson Accent Strip */}
      <mesh position={[-0.7, -0.05, 0]} castShadow>
        <boxGeometry args={[0.08, 0.12, 1.8]} />
        <meshStandardMaterial color="#EF4444" roughness={0.3} />
      </mesh>
      <mesh position={[0.7, -0.05, 0]} castShadow>
        <boxGeometry args={[0.08, 0.12, 1.8]} />
        <meshStandardMaterial color="#EF4444" roughness={0.3} />
      </mesh>

      {/* =========================================================================
          3. COCKPIT / GREENHOUSE (Smoked Dark Glass Canopy)
         ========================================================================= */}
      <RoundedBox args={[0.95, 0.34, 1.25]} radius={0.14} smoothness={4} position={[0, 0.26, -0.12]} castShadow>
        <meshPhysicalMaterial
          color="#161217"
          roughness={0.05}
          metalness={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={0.9}
        />
      </RoundedBox>

      {/* Roof Carbon Strip */}
      <mesh position={[0, 0.44, -0.15]}>
        <boxGeometry args={[0.5, 0.02, 0.9]} />
        <meshStandardMaterial color="#0A0A0C" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* =========================================================================
          4. REAR DIFFUSER & HIGH-DOWNFORCE SPOILER
         ========================================================================= */}
      {/* Rear Tail Section */}
      <RoundedBox args={[1.32, 0.26, 0.8]} radius={0.06} smoothness={3} position={[0, 0.04, -1.2]} castShadow>
        <meshStandardMaterial color="#121016" roughness={0.2} metalness={0.8} />
      </RoundedBox>

      {/* Rear Wing Struts */}
      <mesh position={[-0.38, 0.32, -1.35]} castShadow>
        <boxGeometry args={[0.04, 0.32, 0.08]} />
        <meshStandardMaterial color="#0A0A0C" roughness={0.2} />
      </mesh>
      <mesh position={[0.38, 0.32, -1.35]} castShadow>
        <boxGeometry args={[0.04, 0.32, 0.08]} />
        <meshStandardMaterial color="#0A0A0C" roughness={0.2} />
      </mesh>

      {/* Rear Wing / Spoiler Blade */}
      <RoundedBox args={[1.52, 0.04, 0.3]} radius={0.02} smoothness={2} position={[0, 0.48, -1.38]} castShadow>
        <meshStandardMaterial color="#16141B" roughness={0.2} metalness={0.8} />
      </RoundedBox>
      {/* Wing Endplates (Crimson Red) */}
      <mesh position={[-0.77, 0.48, -1.38]}>
        <boxGeometry args={[0.02, 0.12, 0.32]} />
        <meshStandardMaterial color="#EF4444" roughness={0.3} />
      </mesh>
      <mesh position={[0.77, 0.48, -1.38]}>
        <boxGeometry args={[0.02, 0.12, 0.32]} />
        <meshStandardMaterial color="#EF4444" roughness={0.3} />
      </mesh>

      {/* Rear Aerodynamic Diffuser Fins */}
      <mesh position={[-0.3, -0.1, -1.62]}>
        <boxGeometry args={[0.04, 0.12, 0.2]} />
        <meshStandardMaterial color="#EF4444" roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.1, -1.62]}>
        <boxGeometry args={[0.04, 0.12, 0.2]} />
        <meshStandardMaterial color="#EF4444" roughness={0.3} />
      </mesh>
      <mesh position={[0.3, -0.1, -1.62]}>
        <boxGeometry args={[0.04, 0.12, 0.2]} />
        <meshStandardMaterial color="#EF4444" roughness={0.3} />
      </mesh>

      {/* =========================================================================
          5. LIGHTING: HEADLIGHTS & CONTINUOUS CYBER TAILLIGHT
         ========================================================================= */}
      {/* Front Xenon Headlight Strips (Clean White/Ice Blue) */}
      <mesh position={[-0.45, 0.04, 1.76]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.26, 0.035, 0.04]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[0.45, 0.04, 1.76]} rotation={[0, -0.2, 0]}>
        <boxGeometry args={[0.26, 0.035, 0.04]} />
        <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2.5} />
      </mesh>

      {/* Front Headlight Light Beam Spot */}
      <pointLight position={[0, 0.05, 2.2]} color="#FFFFFF" intensity={1.5} distance={3} />

      {/* Full-Width Crimson Cyber Taillight Bar */}
      <mesh position={[0, 0.11, -1.61]}>
        <boxGeometry args={[1.28, 0.045, 0.04]} />
        <meshStandardMaterial
          color="#EF4444"
          emissive="#EF4444"
          emissiveIntensity={hovered ? 5.0 : 3.0}
        />
      </mesh>
      {/* Rear Taillight Glow Light */}
      <pointLight position={[0, 0.11, -1.8]} color="#EF4444" intensity={2.5} distance={2.5} />

      {/* Red Underglow Beneath Chassis */}
      <pointLight position={[0, -0.2, 0]} color="#DC2626" intensity={1.8} distance={2} />

      {/* =========================================================================
          6. WHEELS & BRAKES (Front & Rear, Left & Right)
         ========================================================================= */}
      {/* Front Left Wheel */}
      <group position={[-0.72, -0.12, 0.95]}>
        <group ref={frontLeftWheelRef}>
          {/* Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.16, 24]} />
            <meshStandardMaterial color="#141318" roughness={0.8} />
          </mesh>
          {/* Obsidian Star Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.165, 12]} />
            <meshStandardMaterial color="#0A090D" roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
        {/* Ruby Brake Caliper (Static) */}
        <mesh position={[-0.04, 0.1, 0]}>
          <boxGeometry args={[0.04, 0.09, 0.08]} />
          <meshStandardMaterial color="#EF4444" roughness={0.3} />
        </mesh>
      </group>

      {/* Front Right Wheel */}
      <group position={[0.72, -0.12, 0.95]}>
        <group ref={frontRightWheelRef}>
          {/* Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.16, 24]} />
            <meshStandardMaterial color="#141318" roughness={0.8} />
          </mesh>
          {/* Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.165, 12]} />
            <meshStandardMaterial color="#0A090D" roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
        {/* Caliper */}
        <mesh position={[0.04, 0.1, 0]}>
          <boxGeometry args={[0.04, 0.09, 0.08]} />
          <meshStandardMaterial color="#EF4444" roughness={0.3} />
        </mesh>
      </group>

      {/* Rear Left Wheel */}
      <group position={[-0.73, -0.11, -0.95]}>
        <group ref={rearLeftWheelRef}>
          {/* Wide Rear Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.26, 0.26, 0.19, 24]} />
            <meshStandardMaterial color="#141318" roughness={0.8} />
          </mesh>
          {/* Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.19, 0.19, 0.195, 12]} />
            <meshStandardMaterial color="#0A090D" roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
        {/* Caliper */}
        <mesh position={[-0.04, 0.1, 0]}>
          <boxGeometry args={[0.04, 0.09, 0.08]} />
          <meshStandardMaterial color="#EF4444" roughness={0.3} />
        </mesh>
      </group>

      {/* Rear Right Wheel */}
      <group position={[0.73, -0.11, -0.95]}>
        <group ref={rearRightWheelRef}>
          {/* Wide Rear Tire */}
          <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.26, 0.26, 0.19, 24]} />
            <meshStandardMaterial color="#141318" roughness={0.8} />
          </mesh>
          {/* Rim */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.19, 0.19, 0.195, 12]} />
            <meshStandardMaterial color="#0A090D" roughness={0.2} metalness={0.9} />
          </mesh>
        </group>
        {/* Caliper */}
        <mesh position={[0.04, 0.1, 0]}>
          <boxGeometry args={[0.04, 0.09, 0.08]} />
          <meshStandardMaterial color="#EF4444" roughness={0.3} />
        </mesh>
      </group>

      {/* =========================================================================
          7. FLOATING RED & WHITE ENERGY MOTES
         ========================================================================= */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#EF4444"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
