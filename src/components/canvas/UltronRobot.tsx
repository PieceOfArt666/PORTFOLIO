import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBox } from '@react-three/drei';

interface UltronRobotProps {
  scrollProgress?: number;
}

export function UltronRobot({ scrollProgress = 0 }: UltronRobotProps) {
  const robotGroupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Dynamic animations: Head tracks cursor, idle breathing/hovering, scroll reaction
  useFrame((state, delta) => {
    // 1. Hovering levitation / breathing cycle
    if (robotGroupRef.current) {
      const hoverFloat = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      const scrollSquat = Math.sin(scrollProgress * Math.PI * 2) * 0.04;
      robotGroupRef.current.position.y = -0.15 + hoverFloat + scrollSquat;

      // Slight torso turn following cursor
      const targetTorsoYaw = state.pointer.x * 0.15;
      robotGroupRef.current.rotation.y = THREE.MathUtils.damp(
        robotGroupRef.current.rotation.y,
        targetTorsoYaw,
        3,
        delta
      );
    }

    // 2. Head Gaze: Tracks mouse cursor directly (sinister Ultron gaze!)
    if (headRef.current) {
      const targetHeadYaw = state.pointer.x * 0.45;
      const targetHeadPitch = -state.pointer.y * 0.3;
      headRef.current.rotation.y = THREE.MathUtils.damp(
        headRef.current.rotation.y,
        targetHeadYaw,
        5,
        delta
      );
      headRef.current.rotation.x = THREE.MathUtils.damp(
        headRef.current.rotation.x,
        targetHeadPitch,
        5,
        delta
      );
    }

    // 3. Subtle arm breathing
    if (leftArmRef.current && rightArmRef.current) {
      const armBob = Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
      leftArmRef.current.rotation.z = -0.1 + armBob;
      rightArmRef.current.rotation.z = 0.1 - armBob;
    }
  });

  // Ambient cyber-energy sparks drifting around the robot
  const particles = useMemo(() => {
    const count = 50;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = Math.random() * 4 - 1.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return positions;
  }, []);

  const particlesRef = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.05;
    }
  });

  // Pulse effect for the chest reactor
  const [coreIntensity, setCoreIntensity] = useState(3);
  useFrame((state) => {
    const pulse = 3 + Math.sin(state.clock.elapsedTime * 4) * 0.8;
    setCoreIntensity(hovered ? 6 : pulse);
  });

  return (
    <group
      ref={robotGroupRef}
      position={[1.15, -0.15, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={1.05}
    >
      {/* =========================================================================
          1. ANTI-GRAVITY LEVITATION DAIS / TELEMETRY RINGS
         ========================================================================= */}
      <mesh position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 0.94, 64]} />
        <meshBasicMaterial color="#EF4444" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.3, 1.33, 64]} />
        <meshBasicMaterial color="#DC2626" transparent opacity={0.4} />
      </mesh>
      {/* Downward Repulsor Energy Light */}
      <pointLight position={[0, -1.1, 0]} color="#EF4444" intensity={2.0} distance={2} />

      {/* =========================================================================
          2. TORSO & CHEST REACTOR (Segmented Obsidian Alloy)
         ========================================================================= */}
      {/* Main Chest Armor Block */}
      <RoundedBox args={[0.88, 0.65, 0.44]} radius={0.08} smoothness={4} position={[0, 0.45, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#131217" roughness={0.15} metalness={0.9} />
      </RoundedBox>

      {/* Left Pectoral Armor Plate */}
      <RoundedBox args={[0.38, 0.35, 0.12]} radius={0.04} smoothness={3} position={[-0.2, 0.52, 0.22]} rotation={[0.08, -0.1, 0.05]} castShadow>
        <meshStandardMaterial color="#1A1920" roughness={0.12} metalness={0.95} />
      </RoundedBox>
      {/* Right Pectoral Armor Plate */}
      <RoundedBox args={[0.38, 0.35, 0.12]} radius={0.04} smoothness={3} position={[0.2, 0.52, 0.22]} rotation={[0.08, 0.1, -0.05]} castShadow>
        <meshStandardMaterial color="#1A1920" roughness={0.12} metalness={0.95} />
      </RoundedBox>

      {/* CENTRAL ULTRON ENERGY POWER CORE (Glowing Crimson Arc Core) */}
      <group position={[0, 0.48, 0.24]}>
        {/* Core Outer Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.11, 0.02, 16, 32]} />
          <meshStandardMaterial color="#0A090C" roughness={0.2} metalness={0.9} />
        </mesh>
        {/* Glowing Energy Lens */}
        <mesh>
          <cylinderGeometry args={[0.09, 0.09, 0.03, 24]} />
          <meshStandardMaterial
            color="#EF4444"
            emissive="#EF4444"
            emissiveIntensity={coreIntensity}
            roughness={0.1}
          />
        </mesh>
        {/* Point light emitted from chest reactor */}
        <pointLight color="#EF4444" intensity={coreIntensity * 0.8} distance={3} />
      </group>

      {/* Collarbone / Neck Struts */}
      <mesh position={[0, 0.76, 0.06]}>
        <boxGeometry args={[0.5, 0.06, 0.18]} />
        <meshStandardMaterial color="#0E0D12" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* =========================================================================
          3. HEAD / ULTRON HELMET & OPTICAL SENSORS (Tracks Mouse Cursor)
         ========================================================================= */}
      <group ref={headRef} position={[0, 0.98, 0.05]}>
        {/* Cranium / Helmet Dome */}
        <RoundedBox args={[0.42, 0.46, 0.44]} radius={0.12} smoothness={4} position={[0, 0.12, 0]} castShadow>
          <meshStandardMaterial color="#17161D" roughness={0.15} metalness={0.92} />
        </RoundedBox>

        {/* Angular Mecha Jawline / Cheek Guards */}
        <RoundedBox args={[0.38, 0.22, 0.32]} radius={0.06} smoothness={3} position={[0, -0.08, 0.1]} castShadow>
          <meshStandardMaterial color="#0F0E14" roughness={0.2} metalness={0.95} />
        </RoundedBox>

        {/* Chin Taper */}
        <mesh position={[0, -0.22, 0.18]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.16, 0.12, 0.14]} />
          <meshStandardMaterial color="#131217" roughness={0.2} metalness={0.9} />
        </mesh>

        {/* GLOWING CRIMSON OCULAR EYE SLITS (Iconic Ultron Red Glow) */}
        {/* Horizontal Eye Visor Trench */}
        <mesh position={[0, 0.08, 0.22]}>
          <boxGeometry args={[0.32, 0.035, 0.04]} />
          <meshStandardMaterial
            color="#EF4444"
            emissive="#EF4444"
            emissiveIntensity={hovered ? 6.0 : 4.0}
          />
        </mesh>
        {/* Left Eye Core Accent */}
        <mesh position={[-0.09, 0.08, 0.23]}>
          <boxGeometry args={[0.07, 0.05, 0.02]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={3} />
        </mesh>
        {/* Right Eye Core Accent */}
        <mesh position={[0.09, 0.08, 0.23]}>
          <boxGeometry args={[0.07, 0.05, 0.02]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={3} />
        </mesh>

        {/* Ocular Red Light Beam */}
        <pointLight position={[0, 0.08, 0.4]} color="#EF4444" intensity={2.2} distance={2.5} />

        {/* Side Ear Antenna Fins / Vents */}
        <mesh position={[-0.24, 0.1, 0]} rotation={[0, 0, 0.2]}>
          <boxGeometry args={[0.04, 0.28, 0.18]} />
          <meshStandardMaterial color="#DC2626" roughness={0.3} />
        </mesh>
        <mesh position={[0.24, 0.1, 0]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.04, 0.28, 0.18]} />
          <meshStandardMaterial color="#DC2626" roughness={0.3} />
        </mesh>
      </group>

      {/* =========================================================================
          4. ABDOMEN & SEGMENTED CYBER-SPINE
         ========================================================================= */}
      {/* Abdominal Core Armor */}
      <RoundedBox args={[0.54, 0.38, 0.36]} radius={0.06} smoothness={3} position={[0, -0.05, 0]} castShadow>
        <meshStandardMaterial color="#100F15" roughness={0.25} metalness={0.85} />
      </RoundedBox>

      {/* Abdominal Segment Plates */}
      <mesh position={[0, -0.04, 0.19]}>
        <boxGeometry args={[0.26, 0.08, 0.04]} />
        <meshStandardMaterial color="#EF4444" roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.15, 0.18]}>
        <boxGeometry args={[0.22, 0.06, 0.04]} />
        <meshStandardMaterial color="#DC2626" roughness={0.3} />
      </mesh>

      {/* Glowing Rear Cyber-Spine (Visible from rear & profile) */}
      <group position={[0, 0.25, -0.22]}>
        {[-0.3, -0.15, 0, 0.15, 0.3].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <boxGeometry args={[0.12, 0.08, 0.06]} />
            <meshStandardMaterial
              color="#EF4444"
              emissive="#EF4444"
              emissiveIntensity={2.5}
            />
          </mesh>
        ))}
      </group>

      {/* =========================================================================
          5. SHOULDERS & ARMS (Commanding Posture)
         ========================================================================= */}
      {/* LEFT ARM */}
      <group ref={leftArmRef} position={[-0.56, 0.6, 0]}>
        {/* Tiered Pauldron / Shoulder Armor */}
        <RoundedBox args={[0.32, 0.26, 0.38]} radius={0.06} smoothness={3} position={[-0.05, 0, 0]} castShadow>
          <meshStandardMaterial color="#17151D" roughness={0.18} metalness={0.92} />
        </RoundedBox>
        {/* Shoulder Crimson Accent Strip */}
        <mesh position={[-0.12, 0.08, 0]}>
          <boxGeometry args={[0.02, 0.16, 0.28]} />
          <meshStandardMaterial color="#EF4444" roughness={0.3} />
        </mesh>
        {/* Upper Arm */}
        <mesh position={[-0.05, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.09, 0.35, 16]} />
          <meshStandardMaterial color="#0D0C11" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Forearm & Hand */}
        <RoundedBox args={[0.18, 0.42, 0.2]} radius={0.04} smoothness={3} position={[-0.06, -0.62, 0.08]} rotation={[0.2, 0, 0]} castShadow>
          <meshStandardMaterial color="#14131A" roughness={0.18} metalness={0.9} />
        </RoundedBox>
        {/* Hand / Claws with Red Joint Knuckles */}
        <mesh position={[-0.06, -0.88, 0.12]}>
          <boxGeometry args={[0.14, 0.12, 0.16]} />
          <meshStandardMaterial color="#0A090D" roughness={0.4} />
        </mesh>
      </group>

      {/* RIGHT ARM */}
      <group ref={rightArmRef} position={[0.56, 0.6, 0]}>
        {/* Tiered Pauldron */}
        <RoundedBox args={[0.32, 0.26, 0.38]} radius={0.06} smoothness={3} position={[0.05, 0, 0]} castShadow>
          <meshStandardMaterial color="#17151D" roughness={0.18} metalness={0.92} />
        </RoundedBox>
        {/* Shoulder Crimson Accent Strip */}
        <mesh position={[0.12, 0.08, 0]}>
          <boxGeometry args={[0.02, 0.16, 0.28]} />
          <meshStandardMaterial color="#EF4444" roughness={0.3} />
        </mesh>
        {/* Upper Arm */}
        <mesh position={[0.05, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.09, 0.35, 16]} />
          <meshStandardMaterial color="#0D0C11" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Forearm & Hand */}
        <RoundedBox args={[0.18, 0.42, 0.2]} radius={0.04} smoothness={3} position={[0.06, -0.62, 0.08]} rotation={[0.2, 0, 0]} castShadow>
          <meshStandardMaterial color="#14131A" roughness={0.18} metalness={0.9} />
        </RoundedBox>
        {/* Hand / Claws with Red Joint Knuckles */}
        <mesh position={[0.06, -0.88, 0.12]}>
          <boxGeometry args={[0.14, 0.12, 0.16]} />
          <meshStandardMaterial color="#0A090D" roughness={0.4} />
        </mesh>
      </group>

      {/* =========================================================================
          6. WAIST & ANTI-GRAVITY LOWER THRUSTER
         ========================================================================= */}
      {/* Armored Pelvis */}
      <RoundedBox args={[0.62, 0.24, 0.38]} radius={0.05} smoothness={3} position={[0, -0.32, 0]} castShadow>
        <meshStandardMaterial color="#131218" roughness={0.2} metalness={0.9} />
      </RoundedBox>

      {/* Repulsor Thruster Bell (Bottom) */}
      <mesh position={[0, -0.52, 0]}>
        <cylinderGeometry args={[0.26, 0.12, 0.28, 24]} />
        <meshStandardMaterial color="#0E0D12" roughness={0.2} metalness={0.95} />
      </mesh>
      {/* Thruster Glowing Nozzle */}
      <mesh position={[0, -0.64, 0]}>
        <circleGeometry args={[0.14, 24]} />
        <meshBasicMaterial color="#EF4444" />
      </mesh>

      {/* =========================================================================
          7. FLOATING RED & OBSIDIAN DATA PARTICLES
         ========================================================================= */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.034}
          color="#EF4444"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
