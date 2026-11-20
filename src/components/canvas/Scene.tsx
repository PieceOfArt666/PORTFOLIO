import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { CameraRig } from './CameraRig';
import { ModelSlot } from './ModelSlot';
import { PodiumCar } from './PodiumCar';

interface SceneProps {
  scrollProgress: number;
  customModelUrl?: string | null;
}

export function Scene({ scrollProgress, customModelUrl }: SceneProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1]">
      <Canvas
        shadows
        camera={{ position: [1.25, 1.22, 1.7], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        className="pointer-events-auto"
      >
        {/* Deep atmospheric ambient lighting */}
        <ambientLight color="#18171F" intensity={1.4} />
        <hemisphereLight args={['#2A2430', '#0E0D12', 0.9]} />
        
        {/* Key Studio Light directly illuminating the face, helmet & armor */}
        <directionalLight
          position={[-3, 4, 3]}
          intensity={2.6}
          color="#FFFFFF"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />

        {/* Dramatic Crimson Red Rim Light for Full Body & Helmet Edges */}
        <directionalLight
          position={[3.5, 2.5, -1.5]}
          intensity={3.8}
          color="#EF4444"
        />

        {/* Subtle Opposite Red Fill */}
        <directionalLight
          position={[-3.5, 1.5, -1.5]}
          intensity={2.2}
          color="#DC2626"
        />

        {/* Front Soft White Key on Facial Visor */}
        <pointLight position={[1.2, 1.45, 1.6]} intensity={1.8} color="#FFFFFF" distance={3.0} />

        {/* Dynamic camera path transitioning from close-up head to full body */}
        <CameraRig scrollProgress={scrollProgress} />

        {/* User 3D Robot Model */}
        <Suspense fallback={null}>
          <ModelSlot customModelUrl={customModelUrl} scrollProgress={scrollProgress} />
        </Suspense>

        {/* 3D Concept Car anchored permanently on the Background Podium */}
        <Suspense fallback={null}>
          <PodiumCar />
        </Suspense>

        {/* Subtle, natural contact shadow for the Full Body shot (no artificial circular disks) */}
        <ContactShadows
          position={[1.2, -1.15, 0]}
          opacity={0.45}
          scale={3.6}
          blur={2.8}
          far={2.5}
          color="#060204"
        />
      </Canvas>
    </div>
  );
}
