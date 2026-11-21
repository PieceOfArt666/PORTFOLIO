import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, RotateCcw, Scissors, Droplets, 
  Sun, Moon, Sunset, Music
} from 'lucide-react';
import { terrariumAudio } from './terrariumAudio';

type TreeStyle = 'juniper' | 'sakura' | 'maple';
type TimeOfDay = 'day' | 'dusk' | 'night';
type ActiveTool = 'prune' | 'water' | 'stone' | 'critter';

interface LeafCluster {
  id: number;
  x: number;
  y: number;
  size: number;
  pruned: boolean;
  leafCount: number;
}

interface PlacedStone {
  id: number;
  x: number;
  y: number;
  scale: number;
  color: string;
}

const TREE_PRESETS: Record<TreeStyle, { name: string; icon: string; trunkColor: string; leafColor: string; bloomColor: string; desc: string }> = {
  juniper: {
    name: 'Zen Juniper',
    icon: '🌲',
    trunkColor: '#78350F',
    leafColor: '#059669',
    bloomColor: '#34D399',
    desc: 'Classic evergreen with resilient winding branches and serene balance.'
  },
  sakura: {
    name: 'Sakura Blossom',
    icon: '🌸',
    trunkColor: '#581C87',
    leafColor: '#F472B6',
    bloomColor: '#FDF2F8',
    desc: 'Delicate pink cherry petals with a soft spring breeze.'
  },
  maple: {
    name: 'Autumn Maple',
    icon: '🍁',
    trunkColor: '#831843',
    leafColor: '#EA580C',
    bloomColor: '#FBBF24',
    desc: 'Radiant crimson and amber leaves reflecting golden October sunsets.'
  }
};

export function DeskTerrariumGame() {
  const [treeStyle, setTreeStyle] = useState<TreeStyle>('juniper');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [activeTool, setActiveTool] = useState<ActiveTool>('prune');
  const [isLofiPlaying, setIsLofiPlaying] = useState(false);

  // Growth & Vitality metrics
  const [hydration, setHydration] = useState(65);
  const [zenHarmony, setZenHarmony] = useState(40);
  const [critterVisitor, setCritterVisitor] = useState<'none' | 'snail' | 'ladybug' | 'fireflies'>('none');

  // Interactive Foliage Pads for Pruning
  const [foliage, setFoliage] = useState<LeafCluster[]>([
    { id: 1, x: 75, y: 110, size: 48, pruned: false, leafCount: 8 },
    { id: 2, x: 125, y: 70, size: 58, pruned: false, leafCount: 11 },
    { id: 3, x: 185, y: 85, size: 52, pruned: false, leafCount: 9 },
    { id: 4, x: 55, y: 155, size: 44, pruned: false, leafCount: 7 },
    { id: 5, x: 200, y: 140, size: 46, pruned: false, leafCount: 7 },
    { id: 6, x: 130, y: 130, size: 42, pruned: true, leafCount: 5 },
  ]);

  // River Stones placed in terrarium base
  const [stones, setStones] = useState<PlacedStone[]>([
    { id: 1, x: 90, y: 250, scale: 1, color: '#4B5563' },
    { id: 2, x: 165, y: 252, scale: 0.85, color: '#6B7280' },
  ]);

  // Falling pruned leaf particles
  const [fallingLeaves, setFallingLeaves] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  // Mist droplet particles
  const [mistParticles, setMistParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // Fireflies canvas loop for night mode
  const fireflyCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Night firefly particle simulation
  useEffect(() => {
    const canvas = fireflyCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.offsetWidth || 500);
    const height = (canvas.height = canvas.offsetHeight || 400);

    const flies = Array.from({ length: 24 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      alpha: Math.random(),
      fadeSpeed: 0.02 + Math.random() * 0.03,
      glowRadius: 3 + Math.random() * 4,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (timeOfDay === 'night') {
        for (const f of flies) {
          f.x += f.vx;
          f.y += f.vy;
          f.alpha += f.fadeSpeed;
          if (f.alpha > 1 || f.alpha < 0) f.fadeSpeed = -f.fadeSpeed;

          if (f.x < 10) f.x = width - 10;
          if (f.x > width - 10) f.x = 10;
          if (f.y < 10) f.y = height - 10;
          if (f.y > height - 10) f.y = 10;

          // Glowing firefly
          const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.glowRadius);
          grad.addColorStop(0, `rgba(253, 224, 71, ${Math.max(0, f.alpha)})`);
          grad.addColorStop(0.4, `rgba(250, 204, 21, ${Math.max(0, f.alpha * 0.6)})`);
          grad.addColorStop(1, 'rgba(250, 204, 21, 0)');

          ctx.beginPath();
          ctx.fillStyle = grad;
          ctx.arc(f.x, f.y, f.glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [timeOfDay]);

  // Handle Prune Snip on a branch
  const handlePruneCluster = (clusterId: number) => {
    terrariumAudio.playSnip();

    setFoliage(prev =>
      prev.map(c => {
        if (c.id === clusterId) {
          // Spawn falling leaf particles
          const newLeaves = Array.from({ length: 3 }).map((_, i) => ({
            id: Date.now() + i,
            x: c.x + (Math.random() - 0.5) * 20,
            y: c.y,
            color: TREE_PRESETS[treeStyle].leafColor,
          }));
          setFallingLeaves(fl => [...fl, ...newLeaves]);
          setTimeout(() => {
            setFallingLeaves(fl => fl.filter(item => !newLeaves.some(nl => nl.id === item.id)));
          }, 800);

          return { ...c, pruned: true, leafCount: Math.max(3, c.leafCount - 3) };
        }
        return c;
      })
    );

    setZenHarmony(prev => Math.min(100, prev + 15));
  };

  // Handle Water Spritzer
  const handleWater = () => {
    terrariumAudio.playMist();
    setHydration(prev => Math.min(100, prev + 18));
    setZenHarmony(prev => Math.min(100, prev + 6));

    // Spawn water mist drops
    const drops = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      x: 100 + Math.random() * 80,
      y: 60 + Math.random() * 80,
    }));
    setMistParticles(drops);
    setTimeout(() => setMistParticles([]), 700);

    // Leaves perk back up slightly if pruned
    if (Math.random() > 0.6) {
      setFoliage(prev => {
        const unprunedIdx = prev.findIndex(c => c.pruned);
        if (unprunedIdx !== -1) {
          const updated = [...prev];
          updated[unprunedIdx] = { ...updated[unprunedIdx], pruned: false };
          return updated;
        }
        return prev;
      });
    }
  };

  // Handle Stone Placement
  const handlePlaceStone = () => {
    if (stones.length >= 6) return;
    terrariumAudio.playStoneTock();
    const colors = ['#374151', '#4B5563', '#6B7280', '#9CA3AF'];
    const newStone: PlacedStone = {
      id: Date.now(),
      x: 70 + Math.random() * 120,
      y: 245 + (Math.random() - 0.5) * 12,
      scale: 0.75 + Math.random() * 0.4,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setStones(prev => [...prev, newStone]);
    setZenHarmony(prev => Math.min(100, prev + 10));
  };

  // Handle Calling Visitor Critter
  const handleSummonVisitor = () => {
    terrariumAudio.playWindChime();
    const critterList: Array<'snail' | 'ladybug' | 'fireflies'> = ['snail', 'ladybug', 'fireflies'];
    const next = critterList[Math.floor(Math.random() * critterList.length)];
    setCritterVisitor(next);
    setZenHarmony(prev => Math.min(100, prev + 12));
  };

  // Toggle Lo-Fi Ambient Radio
  const handleToggleLofi = () => {
    const isNowPlaying = terrariumAudio.toggleAmbientMusic(isLofiPlaying ? 'none' : 'lofi');
    setIsLofiPlaying(isNowPlaying);
  };

  // Reset Garden
  const handleResetGarden = () => {
    terrariumAudio.playWindChime();
    setHydration(65);
    setZenHarmony(40);
    setCritterVisitor('none');
    setFoliage([
      { id: 1, x: 75, y: 110, size: 48, pruned: false, leafCount: 8 },
      { id: 2, x: 125, y: 70, size: 58, pruned: false, leafCount: 11 },
      { id: 3, x: 185, y: 85, size: 52, pruned: false, leafCount: 9 },
      { id: 4, x: 55, y: 155, size: 44, pruned: false, leafCount: 7 },
      { id: 5, x: 200, y: 140, size: 46, pruned: false, leafCount: 7 },
      { id: 6, x: 130, y: 130, size: 42, pruned: true, leafCount: 5 },
    ]);
    setStones([
      { id: 1, x: 90, y: 250, scale: 1, color: '#4B5563' },
      { id: 2, x: 165, y: 252, scale: 0.85, color: '#6B7280' },
    ]);
  };

  // Background gradient based on Time of Day
  const getAtmosphereBg = () => {
    switch (timeOfDay) {
      case 'dusk':
        return 'from-[#7C2D12] via-[#9A3412] to-[#451A03]';
      case 'night':
        return 'from-[#0F172A] via-[#1E1B4B] to-[#020617]';
      default:
        return 'from-[#ECFCCB] via-[#FEF9C3] to-[#FEF08A]';
    }
  };

  const currentPreset = TREE_PRESETS[treeStyle];

  return (
    <div className={`relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border-4 border-[#1E232B] shadow-[8px_12px_0px_#1E232B] select-none transition-all duration-700 bg-gradient-to-b ${getAtmosphereBg()}`}>
      {/* 1. Header with Lo-Fi Music Box Radio, Time of Day & Reset */}
      <div className="bg-[#18181B] text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b-4 border-[#1E232B] relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 border-2 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] flex items-center justify-center text-xl shadow-inner">
            🪴
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[11px] text-emerald-300 tracking-wider">DESK TERRARIUM</span>
              <span className="text-[10px] text-stone-400 font-mono font-bold">• 盆栽 禅</span>
            </div>
            <p className="text-[11px] text-stone-300 font-medium">Zen Garden Bonsai Pruning & Lo-Fi Music Box • Game 2</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Synthesized Lo-Fi Music Box Toggle */}
          <button
            onClick={handleToggleLofi}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-[#1E232B] text-xs font-mono font-bold transition-all cursor-pointer ${
              isLofiPlaying
                ? 'bg-[#34D399] text-[#1E232B] shadow-[2px_2px_0px_#1E232B]'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
            }`}
            title="Toggle Ambient Lo-Fi Music Box & Chimes"
          >
            <Music className={`w-3.5 h-3.5 ${isLofiPlaying ? 'animate-bounce text-[#1E232B]' : ''}`} />
            <span className="font-pixel text-[8px]">{isLofiPlaying ? 'LO-FI RADIO: PLAYING' : 'LO-FI RADIO: OFF'}</span>
          </button>

          {/* Time of Day Switcher (Morning, Dusk, Night) */}
          <div className="flex items-center bg-stone-900 border-2 border-[#1E232B] rounded-full p-0.5">
            <button
              onClick={() => setTimeOfDay('day')}
              className={`p-1.5 rounded-full transition-all ${timeOfDay === 'day' ? 'bg-amber-400 text-stone-900' : 'text-stone-400 hover:text-white'}`}
              title="Morning Sunlight"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTimeOfDay('dusk')}
              className={`p-1.5 rounded-full transition-all ${timeOfDay === 'dusk' ? 'bg-orange-500 text-white' : 'text-stone-400 hover:text-white'}`}
              title="Golden Dusk"
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTimeOfDay('night')}
              className={`p-1.5 rounded-full transition-all ${timeOfDay === 'night' ? 'bg-indigo-600 text-white' : 'text-stone-400 hover:text-white'}`}
              title="Moonlit Midnight (Fireflies)"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reset Garden */}
          <button
            onClick={handleResetGarden}
            className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 border-2 border-[#1E232B] cursor-pointer hover:rotate-45 transition-transform"
            title="Reset Bonsai & Garden"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Tree Species Bar & Zen Metrics */}
      <div className="bg-white/80 backdrop-blur px-4 sm:px-6 py-2.5 border-b-2 border-stone-200/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono relative z-20">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[8px] text-stone-600">SPECIES:</span>
          {(['juniper', 'sakura', 'maple'] as TreeStyle[]).map((style) => (
            <button
              key={style}
              onClick={() => {
                terrariumAudio.playWindChime();
                setTreeStyle(style);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-pixel border-2 transition-all cursor-pointer ${
                treeStyle === style
                  ? 'bg-emerald-600 text-white border-[#1E232B] shadow-[1px_2px_0px_#1E232B]'
                  : 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-700'
              }`}
            >
              <span>{TREE_PRESETS[style].icon}</span>
              <span>{TREE_PRESETS[style].name}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-stone-600 font-bold">HYDRATION:</span>
            <span className="font-pixel text-blue-600">{hydration}%</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-stone-600 font-bold">ZEN HARMONY:</span>
            <span className="font-pixel text-emerald-600">{zenHarmony}%</span>
          </div>
        </div>
      </div>

      {/* 3. Main Terrarium Glass Cloche Display */}
      <div className="relative min-h-[460px] p-4 sm:p-6 flex flex-col items-center justify-center overflow-hidden">
        {/* Fireflies Canvas (Active during Night Mode) */}
        <canvas
          ref={fireflyCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Ambient Sunlight Motes */}
        {timeOfDay === 'day' && (
          <div className="absolute top-0 right-1/4 w-72 h-96 bg-gradient-to-b from-yellow-200/25 to-transparent -rotate-12 blur-2xl pointer-events-none" />
        )}

        {/* Falling Pruned Leaf Particles */}
        {fallingLeaves.map(fl => (
          <motion.div
            key={fl.id}
            initial={{ opacity: 1, y: fl.y, x: fl.x, rotate: 0 }}
            animate={{ opacity: 0, y: fl.y + 120, x: fl.x + (Math.random() - 0.5) * 40, rotate: 180 }}
            transition={{ duration: 0.8, ease: "easeIn" }}
            className="absolute w-3.5 h-2 rounded-full pointer-events-none z-30"
            style={{ backgroundColor: fl.color }}
          />
        ))}

        {/* Water Mist Drops Animation */}
        {mistParticles.map(mp => (
          <motion.div
            key={mp.id}
            initial={{ opacity: 0.8, scale: 0.5, y: mp.y }}
            animate={{ opacity: 0, scale: 1.4, y: mp.y + 40 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute w-2 h-2 rounded-full bg-blue-300/80 pointer-events-none z-30 blur-[0.5px]"
            style={{ left: `${mp.x}px` }}
          />
        ))}

        {/* The Glass Terrarium Vessel */}
        <div className="relative w-80 h-[380px] sm:w-96 sm:h-[400px] flex flex-col items-center justify-end">
          {/* Glass Cloche Dome Curve */}
          <div className="absolute inset-0 rounded-t-[140px] rounded-b-3xl border-4 border-[#1E232B] bg-gradient-to-b from-white/30 via-white/10 to-emerald-900/10 shadow-[8px_12px_0px_#1E232B] backdrop-blur-[1px] pointer-events-none z-20">
            {/* Glass Curvature Highlights */}
            <div className="absolute top-6 left-8 w-12 h-44 rounded-full bg-gradient-to-b from-white/60 to-transparent -rotate-12 blur-[1px] pointer-events-none" />
            <div className="absolute top-10 right-8 w-4 h-24 rounded-full bg-white/30 rotate-6 pointer-events-none" />
          </div>

          {/* Terrarium Interior: Tree, Foliage & River Stones */}
          <div className="relative w-full h-full flex flex-col items-center justify-end pb-8 z-10">
            {/* Bonsai Tree SVG Graphics */}
            <svg viewBox="0 0 260 280" className="w-68 h-74 sm:w-76 sm:h-84 select-none filter drop-shadow-md">
              <defs>
                {/* Wood Bark Gradient */}
                <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A16207" />
                  <stop offset="40%" stopColor={currentPreset.trunkColor} />
                  <stop offset="100%" stopColor="#292524" />
                </linearGradient>

                {/* Moss Hill Gradient */}
                <linearGradient id="mossGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="50%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#064E3B" />
                </linearGradient>
              </defs>

              {/* 1. Potting Soil & Mossy Mound Base */}
              <ellipse cx="130" cy="256" rx="95" ry="18" fill="#1C1917" />
              <ellipse cx="130" cy="252" rx="92" ry="16" fill="url(#mossGrad)" />
              {/* Moss texture tufts */}
              <circle cx="95" cy="250" r="14" fill="#34D399" opacity="0.7" />
              <circle cx="160" cy="248" r="16" fill="#10B981" opacity="0.8" />
              <circle cx="130" cy="253" r="12" fill="#059669" />

              {/* 2. Placed River Stones */}
              {stones.map(st => (
                <ellipse
                  key={st.id}
                  cx={st.x}
                  cy={st.y}
                  rx={14 * st.scale}
                  ry={8 * st.scale}
                  fill={st.color}
                  stroke="#1E232B"
                  strokeWidth="1.5"
                  className="transition-all"
                />
              ))}

              {/* 3. Winding Bonsai Trunk & Natural Branches */}
              <path
                d="M 124 252 C 122 220, 110 190, 126 150 C 132 135, 148 120, 134 90 C 130 82, 124 75, 126 65"
                fill="none"
                stroke="url(#trunkGrad)"
                strokeWidth="18"
                strokeLinecap="round"
              />
              <path
                d="M 126 150 C 105 145, 80 135, 75 115"
                fill="none"
                stroke="url(#trunkGrad)"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M 134 120 C 160 115, 180 105, 185 90"
                fill="none"
                stroke="url(#trunkGrad)"
                strokeWidth="9"
                strokeLinecap="round"
              />
              <path
                d="M 115 175 C 90 170, 65 165, 55 160"
                fill="none"
                stroke="url(#trunkGrad)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M 132 165 C 165 160, 190 155, 200 145"
                fill="none"
                stroke="url(#trunkGrad)"
                strokeWidth="8"
                strokeLinecap="round"
              />

              {/* Bark wood grain accent lines */}
              <path
                d="M 124 240 C 122 210, 114 185, 128 150"
                fill="none"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* 4. Interactive Foliage Clusters (Click to Prune) */}
              {foliage.map((cluster) => {
                const color = currentPreset.leafColor;
                const bloom = currentPreset.bloomColor;
                return (
                  <g
                    key={cluster.id}
                    onClick={() => handlePruneCluster(cluster.id)}
                    className="cursor-pointer group/leaf"
                  >
                    {/* Foliage Cloud Cushion */}
                    <ellipse
                      cx={cluster.x}
                      cy={cluster.y}
                      rx={cluster.size * (cluster.pruned ? 0.72 : 0.95)}
                      ry={cluster.size * (cluster.pruned ? 0.45 : 0.65)}
                      fill={color}
                      stroke="#1E232B"
                      strokeWidth="2.5"
                      className="transition-all duration-300 group-hover/leaf:scale-105"
                    />

                    {/* Blossom / Highlight Petals */}
                    <circle
                      cx={cluster.x - cluster.size * 0.25}
                      cy={cluster.y - cluster.size * 0.15}
                      r={cluster.size * 0.22}
                      fill={bloom}
                      opacity="0.85"
                    />
                    <circle
                      cx={cluster.x + cluster.size * 0.2}
                      cy={cluster.y + cluster.size * 0.1}
                      r={cluster.size * 0.18}
                      fill={bloom}
                      opacity="0.75"
                    />

                    {/* Prune Icon Hint on Hover */}
                    <text
                      x={cluster.x}
                      y={cluster.y + 3}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      className="opacity-0 group-hover/leaf:opacity-100 transition-opacity pointer-events-none drop-shadow"
                    >
                      {activeTool === 'prune' ? '✂ SNIP' : '✦'}
                    </text>
                  </g>
                );
              })}

              {/* 5. Garden Visitor Critter */}
              {critterVisitor === 'snail' && (
                <g className="animate-bounce">
                  <text x="180" y="248" fontSize="22" className="select-none">
                    🐌
                  </text>
                </g>
              )}
              {critterVisitor === 'ladybug' && (
                <g>
                  <text x="135" y="65" fontSize="18" className="select-none animate-pulse">
                    🐞
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Wooden Terrarium Pedestal Base */}
          <div className="w-84 sm:w-98 h-10 bg-gradient-to-r from-[#78350F] via-[#B45309] to-[#78350F] rounded-2xl border-4 border-[#1E232B] shadow-[4px_6px_0px_#1E232B] flex items-center justify-between px-6 z-20">
            <span className="font-pixel text-[8px] text-yellow-200/90 tracking-widest">
              BONSAI NO. 02
            </span>
            <div className="flex items-center gap-1 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-pixel text-[8px] text-white">THRIVING</span>
            </div>
          </div>
        </div>

        {/* 4. Garden Interactive Action Toolbar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 z-20">
          <button
            onClick={() => {
              setActiveTool('prune');
              // Auto prune random unpruned cluster if clicked directly
              const target = foliage.find(c => !c.pruned);
              if (target) handlePruneCluster(target.id);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-pixel text-xs border-3 border-[#1E232B] shadow-[3px_4px_0px_#1E232B] active:translate-y-0.5 transition-all cursor-pointer ${
              activeTool === 'prune'
                ? 'bg-amber-400 text-stone-900 scale-105'
                : 'bg-white hover:bg-stone-100 text-stone-800'
            }`}
          >
            <Scissors className="w-4 h-4 text-stone-900" />
            <span>PRUNE BRANCHES ✂</span>
          </button>

          <button
            onClick={() => {
              setActiveTool('water');
              handleWater();
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-pixel text-xs border-3 border-[#1E232B] shadow-[3px_4px_0px_#1E232B] active:translate-y-0.5 transition-all cursor-pointer ${
              activeTool === 'water'
                ? 'bg-blue-400 text-stone-900 scale-105'
                : 'bg-white hover:bg-stone-100 text-stone-800'
            }`}
          >
            <Droplets className="w-4 h-4 text-blue-600" />
            <span>MIST WATER 💧</span>
          </button>

          <button
            onClick={() => {
              setActiveTool('stone');
              handlePlaceStone();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-pixel text-xs bg-white hover:bg-stone-100 text-stone-800 border-3 border-[#1E232B] shadow-[3px_4px_0px_#1E232B] active:translate-y-0.5 transition-all cursor-pointer"
          >
            <span>🪨 ADD ZEN STONE</span>
          </button>

          <button
            onClick={handleSummonVisitor}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-pixel text-xs bg-white hover:bg-stone-100 text-stone-800 border-3 border-[#1E232B] shadow-[3px_4px_0px_#1E232B] active:translate-y-0.5 transition-all cursor-pointer"
          >
            <span>🔔 CALL VISITOR</span>
          </button>
        </div>
      </div>

      {/* 5. Footer Zen Quote */}
      <div className="bg-[#18181B] px-4 py-2.5 text-center border-t-2 border-[#1E232B] relative z-20">
        <p className="font-mono text-[11px] text-emerald-300/90 font-bold">
          "The bonsai is not shaped to look like a tree; the tree is shaped to look like the universe." 🌿
        </p>
      </div>
    </div>
  );
}
