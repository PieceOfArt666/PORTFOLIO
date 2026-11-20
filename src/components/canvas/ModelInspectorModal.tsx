import { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import {
  X,
  RotateCcw,
  Play,
  Pause,
  Layers,
  Maximize2,
  Sun,
  Flame,
  Car,
  Bot,
} from 'lucide-react';

interface ModelInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function InspectedRobot({
  wireframe,
  studioLighting,
}: {
  wireframe: boolean;
  studioLighting: boolean;
}) {
  const { scene } = useGLTF('/models/robo.glb');
  const clone = useRef<THREE.Group>(null);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.wireframe = wireframe;
          if (wireframe) {
            mat.color = new THREE.Color('#EF4444');
            mat.emissive = new THREE.Color('#7F1D1D');
            mat.emissiveIntensity = 0.6;
          } else {
            mat.color = new THREE.Color('#FFFFFF');
            mat.emissive = new THREE.Color('#000000');
            mat.emissiveIntensity = 0;
            mat.roughness = Math.min(mat.roughness ?? 0.32, 0.45);
            mat.metalness = Math.max(mat.metalness ?? 0.7, 0.85);
            mat.envMapIntensity = studioLighting ? 1.2 : 2.0;
          }
          mat.needsUpdate = true;
        }
      }
    });
  }, [scene, wireframe, studioLighting]);

  return (
    <group ref={clone} position={[0, -0.2, 0]}>
      <Center top>
        <primitive object={scene} scale={2.4} />
      </Center>
    </group>
  );
}

function InspectedCar({
  wireframe,
  studioLighting,
}: {
  wireframe: boolean;
  studioLighting: boolean;
}) {
  const { scene } = useGLTF('/models/car.glb');
  const clone = useRef<THREE.Group>(null);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.wireframe = wireframe;
          if (wireframe) {
            mat.color = new THREE.Color('#EF4444');
            mat.emissive = new THREE.Color('#7F1D1D');
            mat.emissiveIntensity = 0.6;
          } else {
            mat.color = new THREE.Color('#FFFFFF');
            mat.emissive = new THREE.Color('#000000');
            mat.emissiveIntensity = 0;
            mat.roughness = Math.min(mat.roughness ?? 0.22, 0.35);
            mat.metalness = Math.max(mat.metalness ?? 0.78, 0.9);
            mat.envMapIntensity = studioLighting ? 1.4 : 2.2;
          }
          mat.needsUpdate = true;
        }
      }
    });
  }, [scene, wireframe, studioLighting]);

  return (
    <group ref={clone} position={[0, 0, 0]}>
      <Center top>
        <primitive object={scene} scale={2.5} />
      </Center>
    </group>
  );
}

export function ModelInspectorModal({ isOpen, onClose }: ModelInspectorModalProps) {
  const [selectedAsset, setSelectedAsset] = useState<'car' | 'robot'>('car');
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [studioLighting, setStudioLighting] = useState(false);
  const [activePreset, setActivePreset] = useState<'default' | 'focus1' | 'focus2' | 'profile'>('default');

  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Camera presets
  const applyPreset = (preset: 'default' | 'focus1' | 'focus2' | 'profile') => {
    setActivePreset(preset);
    if (!controlsRef.current) return;

    const controls = controlsRef.current;
    if (selectedAsset === 'robot') {
      if (preset === 'default') {
        controls.object.position.set(0, 1.4, 3.8);
        controls.target.set(0, 1.2, 0);
      } else if (preset === 'focus1') {
        // Head focus
        controls.object.position.set(0.1, 2.3, 1.6);
        controls.target.set(0, 2.2, 0);
      } else if (preset === 'focus2') {
        // Full Body
        controls.object.position.set(0, 1.3, 5.2);
        controls.target.set(0, 1.1, 0);
      } else if (preset === 'profile') {
        // Profile
        controls.object.position.set(3.6, 1.4, 0.5);
        controls.target.set(0, 1.2, 0);
      }
    } else {
      // Car presets
      if (preset === 'default') {
        // 3/4 Showroom view
        controls.object.position.set(2.4, 1.2, 2.8);
        controls.target.set(0, 0.4, 0);
      } else if (preset === 'focus1') {
        // Front Cockpit / Hood Close-Up
        controls.object.position.set(0, 0.7, 2.4);
        controls.target.set(0, 0.35, 0);
      } else if (preset === 'focus2') {
        // Top-Down Aero View
        controls.object.position.set(0, 4.2, 0.1);
        controls.target.set(0, 0, 0);
      } else if (preset === 'profile') {
        // Side Aerodynamic Profile
        controls.object.position.set(3.8, 0.6, 0);
        controls.target.set(0, 0.35, 0);
      }
    }
    controls.update();
  };

  const handleSwitchAsset = (asset: 'car' | 'robot') => {
    setSelectedAsset(asset);
    setActivePreset('default');
    if (controlsRef.current) {
      if (asset === 'car') {
        controlsRef.current.object.position.set(2.4, 1.2, 2.8);
        controlsRef.current.target.set(0, 0.4, 0);
      } else {
        controlsRef.current.object.position.set(0, 1.4, 3.8);
        controlsRef.current.target.set(0, 1.2, 0);
      }
      controlsRef.current.update();
    }
  };

  const handleResetCamera = () => {
    applyPreset('default');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#08080A]/95 backdrop-blur-2xl animate-fadeIn select-none">
      {/* Top Navigation & Info Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-white/10 dark-glass z-20 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            <Maximize2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-semibold">
                // 3D ASSET INSPECTOR
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-950/40 text-red-300 border border-red-500/30">
                PBR Real-Time
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-display font-bold text-white tracking-wide">
              {selectedAsset === 'car' ? (
                <>Cyber Concept Car <span className="text-xs font-mono text-gray-400 font-normal">[car.glb]</span></>
              ) : (
                <>Cybernetic Warrior <span className="text-xs font-mono text-gray-400 font-normal">[robo.glb]</span></>
              )}
            </h2>
          </div>
        </div>

        {/* Model Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/60 border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => handleSwitchAsset('car')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
              selectedAsset === 'car'
                ? 'bg-red-600 text-white font-semibold shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Showroom Car</span>
          </button>
          <button
            onClick={() => handleSwitchAsset('robot')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
              selectedAsset === 'robot'
                ? 'bg-red-600 text-white font-semibold shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Cyber Warrior</span>
          </button>
        </div>

        {/* Top Right Controls & Close */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive 360° Orbit</span>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/5 hover:bg-red-600/20 text-gray-400 hover:text-white border border-white/10 hover:border-red-500/40 transition-all shadow-sm"
            title="Close Inspector (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main 3D Canvas Area */}
      <div className="relative flex-1 w-full h-full cursor-grab active:cursor-grabbing">
        <Canvas
          shadows
          camera={{ position: [2.4, 1.2, 2.8], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
        >
          {/* Lighting Rig */}
          {studioLighting ? (
            <>
              {/* Studio Key Lighting */}
              <ambientLight color="#FFFFFF" intensity={1.2} />
              <directionalLight position={[4, 6, 4]} intensity={2.8} castShadow />
              <directionalLight position={[-4, 3, -3]} intensity={1.5} color="#D1D5DB" />
              <pointLight position={[0, -2, 2]} intensity={0.8} color="#FFFFFF" />
            </>
          ) : (
            <>
              {/* Cyber Forge Cinematic Lighting */}
              <ambientLight color="#18171F" intensity={1.2} />
              <directionalLight
                position={[-3, 5, 3]}
                intensity={2.8}
                color="#FFFFFF"
                castShadow
              />
              <directionalLight
                position={[3.5, 3, -2]}
                intensity={4.2}
                color="#EF4444"
              />
              <directionalLight
                position={[-3.5, 1.5, -2]}
                intensity={2.5}
                color="#DC2626"
              />
              <pointLight position={[0, 2.3, 1.8]} intensity={2.2} color="#FFFFFF" distance={3.5} />
              <pointLight position={[0, 1.4, 1.0]} intensity={2.5} color="#EF4444" distance={3.0} />
            </>
          )}

          {/* 3D Model with Suspense */}
          <Suspense fallback={null}>
            {selectedAsset === 'car' ? (
              <InspectedCar wireframe={wireframe} studioLighting={studioLighting} />
            ) : (
              <InspectedRobot wireframe={wireframe} studioLighting={studioLighting} />
            )}
          </Suspense>

          {/* Ground Contact Shadow */}
          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.7}
            scale={5.0}
            blur={2.0}
            far={3.0}
            color={studioLighting ? '#000000' : '#2A0409'}
          />

          {/* Full Free OrbitControls */}
          <OrbitControls
            ref={controlsRef}
            makeDefault
            enableDamping
            dampingFactor={0.06}
            minDistance={1.0}
            maxDistance={8.0}
            autoRotate={autoRotate}
            autoRotateSpeed={1.8}
            target={selectedAsset === 'car' ? [0, 0.4, 0] : [0, 1.2, 0]}
          />
        </Canvas>

        {/* Viewport Control Instructions */}
        <div className="absolute top-4 left-6 pointer-events-none hidden sm:flex flex-col gap-1 text-[11px] font-mono text-gray-400 bg-black/40 backdrop-blur-md px-3 py-2 rounded-xl border border-white/5">
          <span>🖱️ Left-Click + Drag: Orbit 360°</span>
          <span>🔍 Scroll Wheel: Zoom In / Out</span>
          <span>📐 Right-Click + Drag: Pan Camera</span>
        </div>

        {/* Technical Specs Floating Pill */}
        <div className="absolute top-4 right-6 pointer-events-none hidden md:flex flex-col gap-1 text-[10px] font-mono text-gray-400 bg-black/50 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10 text-right">
          <span className="text-red-400 font-semibold">// ASSET METADATA</span>
          <span>Model: {selectedAsset === 'car' ? 'Cyber Concept Hypercar' : 'Ultron Mechanical Warrior'}</span>
          <span>File: {selectedAsset === 'car' ? 'car.glb (34 MB)' : 'robo.glb (41 MB)'}</span>
          <span>Format: glTF 2.0 Binary PBR</span>
          <span>Shaders: Specular Metallic + Normal Maps</span>
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <footer className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 dark-glass border-t border-white/10 z-20">
        {/* Preset Angle Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/50 border border-white/10">
          <span className="text-[10px] font-mono uppercase text-gray-500 px-2.5 hidden sm:inline">
            Camera Angles
          </span>
          <button
            onClick={() => applyPreset('default')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
              activePreset === 'default'
                ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)] font-semibold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {selectedAsset === 'car' ? '3/4 View' : 'Default'}
          </button>
          <button
            onClick={() => applyPreset('focus1')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
              activePreset === 'focus1'
                ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)] font-semibold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {selectedAsset === 'car' ? 'Front Hood' : 'Head Focus'}
          </button>
          <button
            onClick={() => applyPreset('focus2')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
              activePreset === 'focus2'
                ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)] font-semibold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {selectedAsset === 'car' ? 'Top Aero' : 'Full Body'}
          </button>
          <button
            onClick={() => applyPreset('profile')}
            className={`px-3 py-1.5 rounded-full text-xs font-mono transition-all ${
              activePreset === 'profile'
                ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)] font-semibold'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Side Profile
          </button>
        </div>

        {/* Feature Toggles */}
        <div className="flex items-center gap-2.5">
          {/* Turntable Auto-Rotate */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono transition-all border ${
              autoRotate
                ? 'bg-red-950/40 text-red-400 border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
            }`}
            title="Toggle 360° Turntable Rotation"
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>Turntable</span>
          </button>

          {/* Wireframe Mode Toggle */}
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono transition-all border ${
              wireframe
                ? 'bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] font-semibold'
                : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:border-red-500/30'
            }`}
            title="Toggle Cyber Wireframe View"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Wireframe</span>
          </button>

          {/* Lighting Mode Toggle */}
          <button
            onClick={() => setStudioLighting(!studioLighting)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-mono transition-all border ${
              studioLighting
                ? 'bg-white/20 text-white border-white/40'
                : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
            }`}
            title="Switch between Cyber Forge & Studio Lighting"
          >
            {studioLighting ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Flame className="w-3.5 h-3.5 text-red-500" />}
            <span className="hidden sm:inline">{studioLighting ? 'Studio' : 'Forge'}</span>
          </button>

          {/* Reset Camera */}
          <button
            onClick={handleResetCamera}
            className="p-2 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
            title="Reset Camera View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}

useGLTF.preload('/models/car.glb');
useGLTF.preload('/models/robo.glb');
