import { useRef, useEffect, useState, useMemo } from 'react';
import { useGLTF, ContactShadows } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function PodiumCar() {
  const { scene } = useGLTF('/models/car.glb');
  const anchorRef = useRef<THREE.Group>(null);
  const carTurnRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Exact camera-space vector perfectly aligning the car wheels onto the dark circular podium top
  const cameraOffset = useMemo(() => new THREE.Vector3(1.14, -0.92, -5.88), []);

  // Enhance car materials for high-end automotive showroom glints
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = Math.min(mat.roughness ?? 0.22, 0.35);
          mat.metalness = Math.max(mat.metalness ?? 0.75, 0.88);
          mat.envMapIntensity = 2.2;
          mat.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  // Lock the car to the 2D podium location regardless of scroll camera movement
  useFrame((state, delta) => {
    if (anchorRef.current) {
      const camera = state.camera;
      camera.updateMatrixWorld();

      // Transform the fixed camera-space offset into current world coordinates
      const worldPos = cameraOffset.clone().applyMatrix4(camera.matrixWorld);
      anchorRef.current.position.copy(worldPos);

      // Lock orientation relative to camera so the showroom dais perspective is constant
      anchorRef.current.quaternion.copy(camera.quaternion);
    }

    // Continuous 360° showroom turntable rotation
    if (carTurnRef.current) {
      const speed = hovered ? 0.85 : 0.42;
      carTurnRef.current.rotation.y += delta * speed;
    }
  });

  return (
    <group
      ref={anchorRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Overhead Showroom Key Spotlight onto Car Roof & Hood */}
      <spotLight
        position={[0, 2.6, 0]}
        intensity={3.6}
        angle={0.8}
        penumbra={0.7}
        color="#FFFFFF"
      />

      {/* Crimson Showroom Rim Lights catching aerodynamic body lines */}
      <pointLight position={[-1.8, 0.6, 0.5]} color="#EF4444" intensity={2.8} distance={3.5} />
      <pointLight position={[1.8, 0.6, -0.5]} color="#EF4444" intensity={2.8} distance={3.5} />
      <pointLight position={[0, 0.8, -1.8]} color="#DC2626" intensity={2.0} distance={3.0} />

      {/* Rotating Car Turntable */}
      <group ref={carTurnRef}>
        <primitive object={scene} scale={1.65} position={[0, 0, 0]} />
      </group>

      {/* Realistic Ambient Contact Shadow Grounding the Tires directly on the Podium Surface (NO floating circles) */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.85}
        scale={3.4}
        blur={1.6}
        far={1.4}
        color="#060103"
      />
    </group>
  );
}

useGLTF.preload('/models/car.glb');
