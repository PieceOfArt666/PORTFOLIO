import { Suspense, useRef } from 'react';
import { useGLTF, Center, Float } from '@react-three/drei';
import { UserRobot } from './UserRobot';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface CustomModelProps {
  url: string;
}

function CustomModel({ url }: CustomModelProps) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);

  // Gentle idle rotation for custom unrigged model
  useFrame((_, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={modelRef} position={[1.15, -0.1, 0]}>
        <Center top>
          <primitive object={scene.clone()} castShadow receiveShadow />
        </Center>
      </group>
    </Float>
  );
}

interface ModelSlotProps {
  customModelUrl?: string | null;
  scrollProgress?: number;
}

export function ModelSlot({ customModelUrl, scrollProgress = 0 }: ModelSlotProps) {
  if (!customModelUrl) {
    return (
      <Suspense fallback={null}>
        <UserRobot scrollProgress={scrollProgress} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<UserRobot scrollProgress={scrollProgress} />}>
      <CustomModel url={customModelUrl} />
    </Suspense>
  );
}
