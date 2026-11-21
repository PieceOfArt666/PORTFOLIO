import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Droplets, Sparkles, RotateCcw, VolumeX, 
  Heart, BookOpen, CheckCircle2, ChevronRight
} from 'lucide-react';
import { chaiAudio } from './chaiAudio';

interface SpiceItem {
  id: string;
  name: string;
  malayalamName: string;
  icon: string;
  color: string;
  ayurveda: string;
}

const AVAILABLE_SPICES: SpiceItem[] = [
  { id: 'cardamom', name: 'Cardamom', malayalamName: 'Elaichi', icon: '🌿', color: '#34D399', ayurveda: 'Aids digestion & cools the mind' },
  { id: 'ginger', name: 'Fresh Ginger', malayalamName: 'Inji', icon: '🫚', color: '#FBBF24', ayurveda: 'Ignites agni (digestive fire) & boosts immunity' },
  { id: 'cinnamon', name: 'Cinnamon Bark', malayalamName: 'Karukapatta', icon: '🪵', color: '#D97706', ayurveda: 'Improves circulation & warms the heart' },
  { id: 'cloves', name: 'Cloves', malayalamName: 'Grampoo', icon: '🌰', color: '#92400E', ayurveda: 'Soothes throat & eases monsoon chills' },
  { id: 'tea', name: 'Assam Tea Leaves', malayalamName: 'Chaya Podi', icon: '🍃', color: '#451A03', ayurveda: 'Rich brisk antioxidants & alertness' },
];

const COZY_MEMORIES = [
  {
    title: "The Alappuzha Verandah",
    subtitle: "From The Summer Reverie archives",
    story: "When the southwest monsoon pounded on the terracotta tiles, grandfather would sit on the wooden planter's chair. The canal outside swelled with brown rainwater, but in this corner, the aroma of crushed cardamom held the world still.",
    quote: "\"A good cup of tea doesn't rush you; it asks you to listen to the rain.\""
  },
  {
    title: "Ginger Against the Mist",
    subtitle: "Munnar hill station memory",
    story: "Waking up before dawn when the fog blanketed the tea plantations. Grandmother bruised two fat roots of ginger on the granite grinding stone—hot enough to banish the mountain chill before the morning whistle.",
    quote: "\"Warm your hands on the glass first. The tea warms the rest.\""
  },
  {
    title: "The Meter Chai Acrobat",
    subtitle: "Kerala street vendor craft",
    story: "Standing under the tin roof of the railway tea stall, watching the tea-master pull the tea between two aluminum jugs in a three-foot golden stream. The frothy head was like warm velvet on a stormy evening.",
    quote: "\"The foam is where the secrets of the spice live.\""
  }
];

interface ImpactParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
}

// Authentic Illustrated Kerala 'Chaya Glass' (The iconic fluted tea stall glass)
interface KeralaChayaGlassProps {
  fillPercent?: number; // 0 to 100
  teaColor?: string;
  size?: 'md' | 'lg';
  className?: string;
}

function KeralaChayaGlass({
  fillPercent = 100,
  teaColor = '#B46A36',
  size = 'md',
  className = '',
}: KeralaChayaGlassProps) {
  const width = size === 'lg' ? 140 : 105;
  const height = size === 'lg' ? 180 : 135;

  const innerTop = 22;
  const innerBottom = 114;
  const totalInnerH = innerBottom - innerTop;
  const clampedFill = Math.max(0, Math.min(100, fillPercent));
  const liquidH = (clampedFill / 100) * totalInnerH;
  const liquidY = innerBottom - liquidH;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 120 150"
        width={width}
        height={height}
        className="filter drop-shadow-[0_8px_16px_rgba(25,15,5,0.35)] select-none"
      >
        <defs>
          {/* Glass Wall Reflection Gradient */}
          <linearGradient id="chayaGlassWall" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="15%" stopColor="#E0F2FE" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.06" />
            <stop offset="85%" stopColor="#BAE6FD" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.45" />
          </linearGradient>

          {/* Rich Amber Spiced Tea Gradient */}
          <linearGradient id="chayaLiquidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="45%" stopColor={teaColor} />
            <stop offset="100%" stopColor="#5B2207" />
          </linearGradient>

          {/* Golden Aerated Crema Froth */}
          <linearGradient id="chayaFrothGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Tapered Kerala Glass Interior Clip Path */}
          <clipPath id="chayaInnerClip">
            <path d="M 27 22 L 36 114 C 37 119, 44 122, 52 122 L 68 122 C 76 122, 83 119, 84 114 L 93 22 Z" />
          </clipPath>
        </defs>

        {/* 1. Wooden Coaster Saucer */}
        <ellipse cx="60" cy="142" rx="46" ry="6.5" fill="#1E232B" />
        <ellipse cx="60" cy="140" rx="44" ry="5.5" fill="#78350F" />
        <ellipse cx="60" cy="139" rx="41" ry="4.2" fill="#B45309" stroke="#1E232B" strokeWidth="1" />

        {/* 2. Heavy Solid Glass Bottom Base */}
        <path
          d="M 32 114 L 36 133 C 37 137, 43 140, 51 140 L 69 140 C 77 140, 83 137, 84 133 L 88 114 Z"
          fill="rgba(224, 242, 254, 0.4)"
          stroke="#1E232B"
          strokeWidth="2.5"
        />

        {/* 3. Liquid Pool (Clipped to interior) */}
        <g clipPath="url(#chayaInnerClip)">
          {clampedFill > 0 && (
            <>
              {/* Tea Liquid Body */}
              <rect
                x="20"
                y={liquidY}
                width="80"
                height={liquidH + 15}
                fill="url(#chayaLiquidGrad)"
                className="transition-all duration-300"
              />

              {/* Surface Tea Liquid Ring */}
              <ellipse
                cx="60"
                cy={liquidY}
                rx={17 + (liquidH / totalInnerH) * 14}
                ry="4"
                fill="#F59E0B"
                opacity="0.8"
              />

              {/* Velvety Aerated Foam Crema */}
              {clampedFill > 12 && (
                <g className="transition-all duration-300">
                  <ellipse
                    cx="60"
                    cy={liquidY}
                    rx={18 + (liquidH / totalInnerH) * 14}
                    ry="5.5"
                    fill="url(#chayaFrothGrad)"
                    stroke="#D97706"
                    strokeWidth="0.8"
                  />
                  {/* Micro Froth Crema Bubbles */}
                  <circle cx="51" cy={liquidY - 1} r="1.6" fill="#FFFBEB" opacity="0.9" />
                  <circle cx="58" cy={liquidY + 1} r="2.3" fill="#FEF3C7" opacity="0.95" />
                  <circle cx="66" cy={liquidY - 0.5} r="1.8" fill="#FFFBEB" opacity="0.9" />
                  <circle cx="63" cy={liquidY + 2} r="1.2" fill="#FEF08A" opacity="0.85" />
                  <circle cx="45" cy={liquidY} r="1.1" fill="#FEF3C7" opacity="0.75" />
                  <circle cx="73" cy={liquidY + 0.5} r="1.3" fill="#FEF08A" opacity="0.8" />
                </g>
              )}
            </>
          )}

          {/* Residual Crema Foam Rings along glass facets after sips */}
          {clampedFill < 85 && clampedFill > 0 && (
            <ellipse cx="60" cy="38" rx="31" ry="3.2" fill="none" stroke="#FDE68A" strokeWidth="1.2" strokeDasharray="3 4" opacity="0.75" />
          )}
          {clampedFill < 55 && clampedFill > 0 && (
            <ellipse cx="60" cy="62" rx="27" ry="2.8" fill="none" stroke="#FDE68A" strokeWidth="1" strokeDasharray="4 5" opacity="0.65" />
          )}
          {clampedFill < 30 && clampedFill > 0 && (
            <ellipse cx="60" cy="88" rx="23" ry="2.4" fill="none" stroke="#FDE68A" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.55" />
          )}
        </g>

        {/* 4. Glass Outer Shell & Silhouette */}
        <path
          d="M 25 18 L 34 115 C 35 121, 42 125, 50 125 L 70 125 C 78 125, 85 121, 86 115 L 95 18 Z"
          fill="url(#chayaGlassWall)"
          stroke="#1E232B"
          strokeWidth="3"
        />

        {/* Vertical Fluted Ribs of Traditional Kerala Tea Stall Glass */}
        <line x1="41" y1="23" x2="46" y2="114" stroke="rgba(255,255,255,0.45)" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="53" y1="23" x2="55" y2="116" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="67" y1="23" x2="65" y2="116" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="79" y1="23" x2="74" y2="114" stroke="rgba(255,255,255,0.5)" strokeWidth="2.2" strokeLinecap="round" />

        {/* Top Rim Glass Lip */}
        <ellipse cx="60" cy="18" rx="35" ry="5.5" fill="none" stroke="#1E232B" strokeWidth="2.8" />
        <ellipse cx="60" cy="18" rx="33" ry="4" fill="rgba(255,255,255,0.35)" />
        <ellipse cx="60" cy="17" rx="30" ry="2.6" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

export function MonsoonChaiGame() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Sound & Rain state
  const [rainActive, setRainActive] = useState(false);

  // Step 1: Spice selection & grinding
  const [mortarSpices, setMortarSpices] = useState<string[]>(['tea']);
  const [grindProgress, setGrindProgress] = useState(0);
  const [isStriking, setIsStriking] = useState(false);
  const [particles, setParticles] = useState<ImpactParticle[]>([]);

  // Step 2: Boil & Ingredients
  const [hasAddedSpices, setHasAddedSpices] = useState(false);
  const [milkAdded, setMilkAdded] = useState(false);
  const [isPouringMilk, setIsPouringMilk] = useState(false);
  const [sweetener, setSweetener] = useState<'none' | 'sharkara' | 'sugar'>('none');
  const [flameLevel, setFlameLevel] = useState<number>(60);
  const [brewColorTime, setBrewColorTime] = useState(0);
  const [bubbleRipples, setBubbleRipples] = useState<number[]>([1, 2, 3]);

  // Step 3: Meter Chai Pouring
  const [isPouring, setIsPouring] = useState(false);
  const [pourProgress, setPourProgress] = useState(0);
  const [frothScore, setFrothScore] = useState(0);

  // Step 4: Savor & Story
  const [sipsRemaining, setSipsRemaining] = useState(4);
  const [memoryIdx, setMemoryIdx] = useState(0);

  // Canvas ref for raindrop glass simulation
  const rainCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Advanced Procedural Rain on Glass Simulation
  useEffect(() => {
    const canvas = rainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth || 600);
    let height = (canvas.height = canvas.offsetHeight || 420);

    interface RainDrop {
      x: number;
      y: number;
      r: number;
      vy: number;
      trail: Array<{ x: number; y: number; r: number; alpha: number }>;
    }

    const activeDrops: RainDrop[] = [];
    for (let i = 0; i < 35; i++) {
      activeDrops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1.5 + Math.random() * 3.5,
        vy: 1.2 + Math.random() * 2.8,
        trail: [],
      });
    }

    const microCondensation: Array<{ x: number; y: number; r: number; alpha: number }> = [];
    for (let i = 0; i < 90; i++) {
      microCondensation.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.8 + Math.random() * 1.5,
        alpha: 0.15 + Math.random() * 0.3,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (const m of microCondensation) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(224, 242, 254, ${m.alpha})`;
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const drop of activeDrops) {
        for (let t = drop.trail.length - 1; t >= 0; t--) {
          const pt = drop.trail[t];
          ctx.beginPath();
          ctx.fillStyle = `rgba(186, 230, 253, ${pt.alpha})`;
          ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
          ctx.fill();
          pt.alpha -= 0.015;
          if (pt.alpha <= 0) {
            drop.trail.splice(t, 1);
          }
        }

        const grad = ctx.createRadialGradient(
          drop.x - drop.r * 0.3, drop.y - drop.r * 0.3, drop.r * 0.1,
          drop.x, drop.y, drop.r
        );
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        grad.addColorStop(0.5, 'rgba(186, 230, 253, 0.6)');
        grad.addColorStop(1, 'rgba(125, 211, 252, 0.25)');

        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(drop.x, drop.y, drop.r, 0, Math.PI * 2);
        ctx.fill();

        drop.y += drop.vy;
        drop.x += (Math.random() - 0.5) * 0.4;

        if (Math.random() > 0.8) {
          drop.trail.push({ x: drop.x, y: drop.y - drop.r, r: drop.r * 0.5, alpha: 0.4 });
        }

        if (drop.y > height + 10) {
          drop.y = -10;
          drop.x = Math.random() * width;
          drop.r = 1.5 + Math.random() * 3.5;
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 600;
      height = canvas.height = canvas.offsetHeight || 420;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Simmer & Boil Loop in Step 2
  useEffect(() => {
    if (step !== 2 || !hasAddedSpices) return;

    const interval = setInterval(() => {
      if (flameLevel > 15) {
        chaiAudio.playBubble();
        setBrewColorTime(prev => Math.min(100, prev + (flameLevel > 70 ? 3 : 1.5)));
        setBubbleRipples([Math.random(), Math.random(), Math.random()]);
      }
    }, 420);

    return () => clearInterval(interval);
  }, [step, hasAddedSpices, flameLevel]);

  // Pouring loop in Step 3
  useEffect(() => {
    if (!isPouring || step !== 3) return;

    chaiAudio.playLiquidPour();
    const interval = setInterval(() => {
      setPourProgress(prev => {
        if (prev >= 100) {
          setIsPouring(false);
          chaiAudio.playCupClink();
          return 100;
        }
        return prev + 3;
      });

      setFrothScore(prev => Math.min(100, prev + 2.8));
    }, 100);

    return () => clearInterval(interval);
  }, [isPouring, step]);

  // Ambient rain sound toggle
  const handleToggleRain = () => {
    if (rainActive) {
      chaiAudio.stopRain();
      setRainActive(false);
    } else {
      chaiAudio.startRain(0.15);
      setRainActive(true);
    }
  };

  // Add spice to mortar
  const handleAddSpice = (spiceId: string) => {
    if (mortarSpices.length >= 6) return;
    chaiAudio.playSpiceCrunch();
    setMortarSpices(prev => [...prev, spiceId]);
  };

  // Kinetic pestle strike with particle spray
  const handlePestleStrike = () => {
    chaiAudio.playPestleImpact();
    chaiAudio.playSpiceCrunch();
    chaiAudio.playGrind();
    setIsStriking(true);
    setTimeout(() => setIsStriking(false), 240);

    const newParticles: ImpactParticle[] = [];
    const colors = ['#FBBF24', '#34D399', '#D97706', '#92400E', '#FEF08A'];
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 80,
        y: (Math.random() - 0.5) * 60 - 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 5,
      });
    }
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 450);

    setGrindProgress(prev => Math.min(100, prev + 25));
  };

  // Reset to brew a new cup
  const handleRestart = () => {
    chaiAudio.playCupClink();
    setStep(1);
    setMortarSpices(['tea']);
    setGrindProgress(0);
    setHasAddedSpices(false);
    setMilkAdded(false);
    setIsPouringMilk(false);
    setSweetener('none');
    setFlameLevel(60);
    setBrewColorTime(0);
    setPourProgress(0);
    setFrothScore(0);
    setSipsRemaining(4);
    setMemoryIdx((prev) => (prev + 1) % COZY_MEMORIES.length);
  };

  // Savor a sip
  const handleSip = () => {
    if (sipsRemaining <= 0) return;
    chaiAudio.playCupClink();
    setSipsRemaining(prev => prev - 1);
    if (sipsRemaining === 1) {
      chaiAudio.playChimeChord();
    }
  };

  // Color calculation for tea liquor
  const getTeaLiquorColor = () => {
    if (!hasAddedSpices) return '#93C5FD';
    if (milkAdded) {
      return brewColorTime > 60 ? '#B46A36' : '#CFA07E';
    }
    if (brewColorTime < 30) return '#C27835';
    if (brewColorTime < 70) return '#7C2D12';
    return '#451A03';
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border-4 border-[#1E232B] shadow-[8px_12px_0px_#1E232B] bg-[#FFFBEB] select-none">
      {/* SVG Shaders & Filters for Atmospheric Heat Haze */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="heat-shimmer" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04 0.08" numOctaves="2" seed="5" result="noise">
              <animate attributeName="baseFrequency" dur="3s" values="0.04 0.08; 0.05 0.12; 0.04 0.08" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* 1. Cozy Header with Ambient Rain Toggle, Audio Wave & Reset */}
      <div className="bg-[#1C1917] text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b-4 border-[#1E232B] relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#B45309] border-2 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] flex items-center justify-center text-xl shadow-inner">
            ☕
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[11px] text-[#FDE68A] tracking-wider">MONSOON CHAI</span>
              <span className="text-[10px] text-amber-300/70 font-mono font-bold">• MONSOON BREW</span>
            </div>
            <p className="text-[11px] text-stone-300 font-medium">Tactile Kerala Verandah Brewing Sim • Game 1</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Ambient Rain Sound Button with Pulsing Wave Indicator */}
          <button
            onClick={handleToggleRain}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-[#1E232B] text-xs font-mono font-bold transition-all cursor-pointer ${
              rainActive
                ? 'bg-[#38BDF8] text-[#1E232B] shadow-[2px_2px_0px_#1E232B]'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
            }`}
            title="Toggle Ambient Kerala Rainfall Audio"
          >
            {rainActive ? (
              <span className="flex gap-0.5 items-end h-3">
                <span className="w-1 bg-[#1E232B] animate-pulse h-2" />
                <span className="w-1 bg-[#1E232B] animate-pulse h-3 delay-75" />
                <span className="w-1 bg-[#1E232B] animate-pulse h-1.5 delay-150" />
              </span>
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span className="font-pixel text-[8px]">{rainActive ? 'RAIN SOUND: ON' : 'RAIN SOUND: MUTED'}</span>
          </button>

          {/* Reset Cup Button */}
          <button
            onClick={handleRestart}
            className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 border-2 border-[#1E232B] cursor-pointer hover:rotate-45 transition-transform"
            title="Start Fresh Cup"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Step Navigator Breadcrumbs */}
      <div className="bg-[#FEF3C7] px-4 sm:px-6 py-2.5 border-b-2 border-amber-300/80 flex items-center justify-between text-xs font-mono relative z-20">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-0.5">
          {[
            { num: 1, label: '1. BRUISE SPICES' },
            { num: 2, label: '2. SIMMER & BREW' },
            { num: 3, label: '3. METER POUR' },
            { num: 4, label: '4. SAVOR & MEMORY' },
          ].map((s) => (
            <div 
              key={s.num}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-pixel transition-all ${
                step === s.num
                  ? 'bg-[#D97706] text-white border-2 border-[#1E232B] shadow-[1px_2px_0px_#1E232B]'
                  : step > s.num
                  ? 'text-emerald-700 font-bold'
                  : 'text-stone-400 opacity-60'
              }`}
            >
              {step > s.num ? '✓' : ''}
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-stone-600 font-pixel text-[8px]">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
          <span>AUTHENTIC KERALA CHAYA</span>
        </div>
      </div>

      {/* 3. Main Interactive Canvas Stage */}
      <div className="relative min-h-[490px] p-4 sm:p-8 flex flex-col justify-between overflow-hidden">
        {/* Procedural Raindrop on Glass Simulation Canvas */}
        <canvas
          ref={rainCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-45 z-0"
        />

        {/* Ambient Volumetric Warm Glow */}
        <div className="absolute -top-10 -left-10 w-96 h-96 bg-gradient-to-br from-amber-400/20 via-orange-300/10 to-transparent rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-gradient-to-tl from-emerald-500/15 via-transparent to-transparent rounded-full blur-2xl pointer-events-none z-0" />

        {/* STAGE 1: BRASS MORTAR & PESTLE GRINDING WITH PARTICLES */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="relative z-10 flex flex-col items-center justify-between flex-1 gap-6"
            >
              <div className="text-center max-w-lg">
                <span className="font-pixel text-[9px] px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 shadow-xs inline-flex items-center gap-1">
                  <span>STAGE 1: THE TRADITIONAL URULI MORTAR</span>
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-stone-800 mt-2">
                  Select & Bruise Your Spices
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Tap spices on the wooden tray to drop them in. Then tap the brass pestle to strike & release essential oils!
                </p>
              </div>

              {/* The Realistic 3D Brass Mortar & Kinetic Pestle Visual */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full my-auto">
                {/* Brass Mortar Bowl Container */}
                <div className="relative">
                  {/* Particle Spray Container on Impact */}
                  {particles.map(p => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                      animate={{ opacity: 0, scale: 1.5, x: p.x, y: p.y }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-30"
                      style={{ backgroundColor: p.color, width: p.size, height: p.size }}
                    />
                  ))}

                  {/* Brass Mortar Vessel */}
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-[#FBBF24] via-[#D97706] to-[#78350F] p-4 border-4 border-[#1E232B] shadow-[8px_10px_0px_#1E232B] flex items-center justify-center">
                    <div className="absolute inset-1 rounded-full border-2 border-yellow-200/50 pointer-events-none" />

                    <div className="relative w-full h-full rounded-full bg-gradient-to-b from-[#451A03] via-[#292524] to-[#1C1917] border-3 border-amber-900 shadow-inner flex flex-wrap items-center justify-center p-5 overflow-hidden">
                      {mortarSpices.length === 0 ? (
                        <span className="font-pixel text-[8px] text-amber-300/40 text-center">
                          MORTAR EMPTY<br />SELECT SPICES
                        </span>
                      ) : (
                        mortarSpices.map((sId, idx) => {
                          const spice = AVAILABLE_SPICES.find(item => item.id === sId);
                          return (
                            <motion.span
                              key={idx}
                              initial={{ scale: 0, y: -25 }}
                              animate={{ 
                                scale: grindProgress > 50 ? 0.75 : 1, 
                                y: isStriking ? 5 : 0 
                              }}
                              className="text-2xl sm:text-3xl filter drop-shadow select-none"
                              title={`${spice?.name} (${spice?.malayalamName})`}
                            >
                              {spice?.icon}
                            </motion.span>
                          );
                        })
                      )}

                      {grindProgress > 20 && (
                        <div 
                          className="absolute inset-0 bg-gradient-to-t from-amber-600/30 to-amber-900/20 mix-blend-color-dodge pointer-events-none animate-pulse"
                          style={{ opacity: grindProgress / 100 }}
                        />
                      )}
                    </div>
                  </div>

                  {/* 3D Kinetic Pestle */}
                  <motion.div
                    animate={
                      isStriking
                        ? { y: [0, 30, -5, 0], rotate: [25, 10, 28, 25] }
                        : { y: [0, -6, 0], rotate: [25, 23, 25] }
                    }
                    transition={
                      isStriking
                        ? { duration: 0.24, ease: "easeInOut" }
                        : { repeat: Infinity, duration: 2.2, ease: "easeInOut" }
                    }
                    onClick={handlePestleStrike}
                    className="absolute -top-12 -right-4 w-10 h-32 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-700 rounded-full border-3 border-[#1E232B] shadow-xl cursor-pointer group"
                    title="Tap Pestle to Pound Spices"
                  >
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-6 rounded-full bg-yellow-200/60" />
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-pixel text-[7px] text-[#1E232B] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      POUND
                    </span>
                  </motion.div>
                </div>

                {/* Progress & Ayurvedic Insight Box */}
                <div className="flex flex-col items-center sm:items-start gap-3 w-full max-w-xs">
                  <div className="bg-white/90 backdrop-blur p-4 rounded-2xl border-3 border-[#1E232B] shadow-[3px_4px_0px_#1E232B] w-full">
                    <div className="flex items-center justify-between text-xs font-mono font-bold mb-1.5 text-stone-700">
                      <span>ESSENTIAL OIL EXTRACTION:</span>
                      <span className="font-pixel text-amber-700">{grindProgress}%</span>
                    </div>
                    <div className="w-full h-3.5 bg-stone-200 rounded-full overflow-hidden border-2 border-[#1E232B] p-0.5">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-emerald-600 rounded-full transition-all duration-200"
                        style={{ width: `${grindProgress}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-stone-600 mt-2 font-medium">
                      {grindProgress >= 100 
                        ? '✨ Completely pulverized! Ready for boiling.'
                        : 'Tap the pestle repeatedly to crush spices.'}
                    </p>
                  </div>

                  <button
                    onClick={handlePestleStrike}
                    className="w-full py-3.5 px-6 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-pixel text-xs border-3 border-[#1E232B] shadow-[4px_4px_0px_#1E232B] active:translate-y-1 active:shadow-[1px_1px_0px_#1E232B] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>🔨 STRIKE PESTLE</span>
                  </button>
                </div>
              </div>

              {/* Wooden Spice Tray Selector with Ayurvedic Tooltips */}
              <div className="w-full bg-[#E7E5E4] p-3 sm:p-4 rounded-2xl border-3 border-[#1E232B] shadow-[4px_4px_0px_#1E232B]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-pixel text-[8px] text-stone-700">WOODEN TRAY (TAP TO ADD TO MORTAR):</span>
                  <span className="text-xs font-mono font-bold text-stone-600">{mortarSpices.length}/6 Spices</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {AVAILABLE_SPICES.map((spice) => {
                    const count = mortarSpices.filter(s => s === spice.id).length;
                    return (
                      <button
                        key={spice.id}
                        onClick={() => handleAddSpice(spice.id)}
                        className="flex flex-col items-center p-2.5 rounded-xl bg-white hover:bg-amber-50 border-2 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] active:translate-y-0.5 transition-all text-center group cursor-pointer"
                        title={spice.ayurveda}
                      >
                        <span className="text-2xl group-hover:scale-115 transition-transform">{spice.icon}</span>
                        <span className="font-bold text-xs text-stone-800 mt-1">{spice.name}</span>
                        <span className="text-[10px] text-amber-700 font-mono font-bold">{spice.malayalamName}</span>
                        {count > 0 && (
                          <span className="mt-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-pixel text-[7px]">
                            x{count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Next Step Button */}
              <div className="flex justify-end w-full">
                <button
                  disabled={grindProgress < 60}
                  onClick={() => {
                    chaiAudio.playCupClink();
                    setStep(2);
                  }}
                  className={`py-3 px-6 rounded-2xl font-pixel text-xs border-3 border-[#1E232B] flex items-center gap-2 transition-all cursor-pointer ${
                    grindProgress >= 60
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[4px_4px_0px_#1E232B] active:translate-y-1'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed opacity-60 border-stone-400'
                  }`}
                >
                  <span>TRANSFER TO SAUCEPAN</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STAGE 2: HEAT SHADER & BOILING LIQUID SIMULATION */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="relative z-10 flex flex-col items-center justify-between flex-1 gap-6"
            >
              <div className="text-center max-w-lg">
                <span className="font-pixel text-[9px] px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 shadow-xs">
                  STAGE 2: THE BRASS KETTLE
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-stone-800 mt-2">
                  Simmer, Milk & Heat Waves
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Add spices, adjust flame heat to rolling boil, and pour creamy milk to create authentic amber masala tea.
                </p>
              </div>

              {/* Boiling Saucepan with Heat Shimmer & Bubble Ripples */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full my-auto">
                <div className="relative flex flex-col items-center">
                  {/* Heat Haze Distortion Container */}
                  <div 
                    className="relative"
                    style={{ filter: flameLevel > 40 ? 'url(#heat-shimmer)' : 'none' }}
                  >
                    {/* Steam Particle Columns */}
                    {hasAddedSpices && flameLevel > 20 && (
                      <div className="absolute -top-16 inset-x-0 flex justify-center gap-4 pointer-events-none z-20">
                        <motion.div 
                          animate={{ y: [-5, -35], opacity: [0.8, 0], scale: [0.8, 1.4] }}
                          transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut" }}
                          className="text-3xl text-amber-700/60"
                        >
                          ♨
                        </motion.div>
                        <motion.div 
                          animate={{ y: [-5, -45], opacity: [0.9, 0], scale: [0.9, 1.6] }}
                          transition={{ repeat: Infinity, duration: 1.5, delay: 0.3, ease: "easeOut" }}
                          className="text-4xl text-amber-800/70"
                        >
                          ♨
                        </motion.div>
                      </div>
                    )}

                    {/* Saucepan Top View Vessel */}
                    <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-gradient-to-br from-[#78350F] via-[#451A03] to-[#1C1917] p-3.5 border-4 border-[#1E232B] shadow-[8px_10px_0px_#1E232B] flex items-center justify-center">
                      <div className="absolute -left-14 top-1/2 -translate-y-1/2 w-16 h-7 bg-[#B45309] border-3 border-[#1E232B] rounded-l-2xl shadow-md" />

                      <div 
                        className="relative w-full h-full rounded-full transition-colors duration-700 border-3 border-amber-900 shadow-inner flex items-center justify-center overflow-hidden"
                        style={{ backgroundColor: getTeaLiquorColor() }}
                      >
                        {isPouringMilk && (
                          <motion.div
                            initial={{ scale: 0, rotate: 0, opacity: 0.9 }}
                            animate={{ scale: [0, 1.3, 1], rotate: 360, opacity: [1, 0.8, 0.4] }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="absolute inset-0 bg-radial from-white via-amber-100 to-transparent rounded-full pointer-events-none"
                          />
                        )}

                        {hasAddedSpices && flameLevel > 20 && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            {bubbleRipples.map((seed, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ scale: 0.2, opacity: 0.8 }}
                                animate={{ scale: 1.8, opacity: 0 }}
                                transition={{ repeat: Infinity, duration: 1.2, delay: seed * 0.4 }}
                                className="absolute w-12 h-12 rounded-full border-2 border-white/40"
                              />
                            ))}
                            <span className="text-sm animate-ping opacity-75">🫧</span>
                            <span className="text-lg animate-bounce opacity-60 ml-8">🫧</span>
                            <span className="text-base animate-pulse opacity-80 -mt-10 mr-8">🫧</span>
                          </div>
                        )}

                        {!hasAddedSpices ? (
                          <span className="font-pixel text-[8px] text-white/90 text-center px-4 drop-shadow">
                            WATER IS WARM<br />ADD GROUND SPICES ➔
                          </span>
                        ) : (
                          <span className="font-pixel text-[8px] text-white/80 text-center drop-shadow">
                            {milkAdded ? 'MASALA CHAI STEEPING' : 'BLACK TEA EXTRACTING'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Gas Stove Burner */}
                  <div className="flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-stone-900 border-2 border-[#1E232B] shadow-md">
                    <Flame className={`w-5 h-5 ${flameLevel > 20 ? 'text-amber-400 animate-pulse' : 'text-stone-500'}`} />
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span 
                          key={i}
                          className={`w-2 h-3 rounded-full transition-all ${
                            (flameLevel / 20) >= i ? 'bg-amber-400 shadow-[0_0_8px_#F59E0B]' : 'bg-stone-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-pixel text-[8px] text-stone-300 ml-1">
                      {flameLevel > 70 ? 'ROLLING BOIL' : flameLevel > 20 ? 'GENTLE SIMMER' : 'OFF'}
                    </span>
                  </div>
                </div>

                {/* Brewing Recipe Controls Box */}
                <div className="flex flex-col gap-3 w-full max-w-xs">
                  {/* Add Spices Button */}
                  <button
                    disabled={hasAddedSpices}
                    onClick={() => {
                      chaiAudio.playSpiceCrunch();
                      chaiAudio.playBubble();
                      setHasAddedSpices(true);
                    }}
                    className={`p-3 rounded-2xl font-pixel text-xs border-3 border-[#1E232B] flex items-center justify-between transition-all ${
                      !hasAddedSpices
                        ? 'bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-[3px_4px_0px_#1E232B] cursor-pointer'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-500 cursor-default'
                    }`}
                  >
                    <span>{hasAddedSpices ? '✓ SPICES ADDED' : '+ ADD GROUND SPICES'}</span>
                    <Sparkles className="w-4 h-4" />
                  </button>

                  {/* Add Milk Button */}
                  <button
                    disabled={!hasAddedSpices || milkAdded}
                    onClick={() => {
                      chaiAudio.playLiquidPour();
                      setIsPouringMilk(true);
                      setTimeout(() => setIsPouringMilk(false), 1200);
                      setMilkAdded(true);
                    }}
                    className={`p-3 rounded-2xl font-pixel text-xs border-3 border-[#1E232B] flex items-center justify-between transition-all ${
                      !milkAdded && hasAddedSpices
                        ? 'bg-white hover:bg-amber-50 text-[#1E232B] shadow-[3px_4px_0px_#1E232B] cursor-pointer'
                        : milkAdded
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-500 cursor-default'
                        : 'bg-stone-200 text-stone-400 border-stone-300 cursor-not-allowed'
                    }`}
                  >
                    <span>{milkAdded ? '✓ FRESH MILK ADDED' : '+ POUR FRESH MILK 🥛'}</span>
                    <Droplets className="w-4 h-4" />
                  </button>

                  {/* Kerala Sweeteners: Jaggery (Sharkara) & Cane Sugar */}
                  <div className="bg-white/90 p-3 rounded-2xl border-3 border-[#1E232B] shadow-[2px_3px_0px_#1E232B]">
                    <span className="font-pixel text-[8px] text-stone-600 block mb-1.5">CHOOSE SWEETENER:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          chaiAudio.playCupClink();
                          setSweetener('sharkara');
                        }}
                        className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold border-2 transition-all cursor-pointer ${
                          sweetener === 'sharkara'
                            ? 'bg-[#B45309] text-white border-[#1E232B]'
                            : 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-700'
                        }`}
                      >
                        🍯 Jaggery (Sharkara)
                      </button>
                      <button
                        onClick={() => {
                          chaiAudio.playCupClink();
                          setSweetener('sugar');
                        }}
                        className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold border-2 transition-all cursor-pointer ${
                          sweetener === 'sugar'
                            ? 'bg-amber-600 text-white border-[#1E232B]'
                            : 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-700'
                        }`}
                      >
                        🍬 Cane Sugar
                      </button>
                    </div>
                  </div>

                  {/* Flame Intensity Slider */}
                  <div className="bg-white/90 p-3 rounded-2xl border-3 border-[#1E232B] shadow-[2px_3px_0px_#1E232B]">
                    <div className="flex justify-between items-center text-xs font-mono font-bold text-stone-700 mb-1">
                      <span>STOVE BURNER:</span>
                      <span className="text-amber-700">{flameLevel}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={flameLevel}
                      onChange={(e) => setFlameLevel(Number(e.target.value))}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Step Navigation */}
              <div className="flex justify-between w-full">
                <button
                  onClick={() => setStep(1)}
                  className="py-2.5 px-4 rounded-xl font-pixel text-xs bg-white hover:bg-stone-100 text-stone-700 border-2 border-[#1E232B] cursor-pointer"
                >
                  ← BACK
                </button>

                <button
                  disabled={!hasAddedSpices || !milkAdded || brewColorTime < 40}
                  onClick={() => {
                    chaiAudio.playCupClink();
                    setStep(3);
                  }}
                  className={`py-3 px-6 rounded-2xl font-pixel text-xs border-3 border-[#1E232B] flex items-center gap-2 transition-all cursor-pointer ${
                    hasAddedSpices && milkAdded && brewColorTime >= 40
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[4px_4px_0px_#1E232B] active:translate-y-1'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed opacity-60 border-stone-400'
                  }`}
                >
                  <span>POUR THE CHAI</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STAGE 3: THE HIGH-POUR METER CHAI WITH AUTHENTIC KERALA CHAYA GLASS */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="relative z-10 flex flex-col items-center justify-between flex-1 gap-6"
            >
              <div className="text-center max-w-lg">
                <span className="font-pixel text-[9px] px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 shadow-xs">
                  STAGE 3: THE TRADITIONAL PULL
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-stone-800 mt-2">
                  The Kerala Meter Chai Pour
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Hold down the pour button to pull the tea from height into the traditional Kerala tea glass. Aerating the milk creates that signature velvety crema foam!
                </p>
              </div>

              {/* High-Pour Physical Canvas Frame */}
              <div className="flex flex-col items-center justify-center gap-6 w-full max-w-md my-auto">
                <div className="relative w-72 h-72 bg-gradient-to-b from-amber-50 to-amber-100/90 rounded-3xl border-4 border-[#1E232B] shadow-[6px_8px_0px_#1E232B] flex flex-col items-center justify-between p-4 overflow-hidden">
                  {/* Top Brass Kettle Vessel */}
                  <motion.div 
                    animate={isPouring ? { rotate: [-10, -18, -14], y: [0, 4, 0] } : { rotate: 0 }}
                    className="w-22 h-12 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-800 rounded-b-2xl border-3 border-[#1E232B] flex items-center justify-center text-white font-pixel text-[8px] shadow-md z-20"
                  >
                    BRASS JUG
                  </motion.div>

                  {/* Flowing Liquid Stream with Droplet Mist */}
                  {isPouring && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      className="w-4 h-32 bg-gradient-to-b from-[#B45309] via-[#D97706] to-[#F59E0B] rounded-full shadow-lg relative z-10"
                    >
                      <span className="absolute -left-2 top-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      <span className="absolute -right-2 top-3/4 w-1.5 h-1.5 rounded-full bg-yellow-200 animate-ping delay-100" />
                    </motion.div>
                  )}

                  {/* Authentic Illustrated Kerala Chaya Glass */}
                  <div className="relative z-10 -mb-2">
                    <KeralaChayaGlass 
                      fillPercent={pourProgress} 
                      teaColor={getTeaLiquorColor()}
                      size="md"
                    />
                  </div>
                </div>

                {/* Pour Action Button & Gauges */}
                <div className="w-full flex flex-col items-center gap-3">
                  <div className="w-full bg-white p-3 rounded-2xl border-3 border-[#1E232B] shadow-[2px_3px_0px_#1E232B]">
                    <div className="flex justify-between items-center text-xs font-mono font-bold text-stone-700 mb-1">
                      <span>CHAYA GLASS FILL LEVEL:</span>
                      <span className="font-pixel text-amber-700">{Math.round(pourProgress)}%</span>
                    </div>
                    <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden border-2 border-[#1E232B]">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 to-[#D97706] transition-all"
                        style={{ width: `${pourProgress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono font-bold text-stone-500 mt-2">
                      <span>AERATED CREMA:</span>
                      <span className="font-pixel text-amber-700">{Math.round(frothScore)}% (GOLDEN FROTH)</span>
                    </div>
                  </div>

                  <button
                    onMouseDown={() => setIsPouring(true)}
                    onMouseUp={() => setIsPouring(false)}
                    onTouchStart={() => setIsPouring(true)}
                    onTouchEnd={() => setIsPouring(false)}
                    disabled={pourProgress >= 100}
                    className={`w-full py-4 px-6 rounded-2xl font-pixel text-xs border-3 border-[#1E232B] flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      pourProgress < 100
                        ? 'bg-[#D97706] hover:bg-[#B45309] text-white shadow-[4px_5px_0px_#1E232B] active:translate-y-1'
                        : 'bg-emerald-500 text-white shadow-[2px_2px_0px_#1E232B] cursor-default'
                    }`}
                  >
                    <span>{pourProgress < 100 ? 'HOLD TO PULL CHAI ☕' : '✓ GLASS IS FULL!'}</span>
                  </button>
                </div>
              </div>

              {/* Complete Step Navigation */}
              <div className="flex justify-end w-full">
                <button
                  disabled={pourProgress < 90}
                  onClick={() => {
                    chaiAudio.playChimeChord();
                    setStep(4);
                  }}
                  className={`py-3 px-6 rounded-2xl font-pixel text-xs border-3 border-[#1E232B] flex items-center gap-2 transition-all cursor-pointer ${
                    pourProgress >= 90
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[4px_4px_0px_#1E232B] active:translate-y-1'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed opacity-60 border-stone-400'
                  }`}
                >
                  <span>SAVOR ON WINDOWSILL</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STAGE 4: SAVOR ON WINDOWSILL WITH FLICKERING NILAVILAKKU & JOURNAL */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="relative z-10 flex flex-col items-center justify-between flex-1 gap-6"
            >
              <div className="text-center max-w-lg">
                <span className="font-pixel text-[9px] px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 shadow-xs flex items-center justify-center gap-1 mx-auto w-fit">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>BREW COMPLETE • MASTER CHAI-WALLAH</span>
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-stone-800 mt-2">
                  Warmth in the Monsoon
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Your handcrafted chai rests on the rainy verandah windowsill beside the flickering brass Nilavilakku lamp. Take a warm sip.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl items-center my-auto">
                {/* Steaming Kerala Chaya Glass & Flickering Nilavilakku */}
                <div className="bg-gradient-to-b from-amber-100/95 to-amber-200/95 backdrop-blur p-6 rounded-3xl border-3 border-[#1E232B] shadow-[6px_6px_0px_#1E232B] flex flex-col items-center justify-center text-center relative overflow-hidden">
                  {/* Rising Steam Animation */}
                  {sipsRemaining > 0 && (
                    <div className="flex gap-3 -mb-3 pointer-events-none">
                      <motion.div 
                        animate={{ y: [-5, -30], opacity: [0.8, 0], scale: [0.9, 1.4] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut" }}
                        className="text-3xl text-amber-700"
                      >
                        ♨
                      </motion.div>
                      <motion.div 
                        animate={{ y: [-5, -35], opacity: [0.9, 0], scale: [1, 1.6] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.3, ease: "easeOut" }}
                        className="text-4xl text-amber-800"
                      >
                        ♨
                      </motion.div>
                    </div>
                  )}

                  {/* Illustrated Kerala Chaya Glass (Liquid level reflects sips remaining) */}
                  <div className="flex items-end justify-center gap-6 my-2">
                    <KeralaChayaGlass
                      fillPercent={(sipsRemaining / 4) * 100}
                      teaColor={getTeaLiquorColor()}
                      size="lg"
                    />

                    {/* Kerala Nilavilakku Brass Lamp */}
                    <div className="flex flex-col items-center pb-3">
                      <motion.span 
                        animate={{ scale: [1, 1.15, 0.95, 1], opacity: [0.9, 1, 0.85, 0.9] }}
                        transition={{ repeat: Infinity, duration: 1.4 }}
                        className="text-3xl select-none filter drop-shadow"
                      >
                        🪔
                      </motion.span>
                      <span className="font-pixel text-[7px] text-amber-900 mt-1 font-bold">NILAVILAKKU</span>
                      <span className="text-[9px] text-stone-500 font-mono">Brass Oil Lamp</span>
                    </div>
                  </div>

                  {/* Heart Warmth Level Meter */}
                  <div className="flex items-center gap-1.5 mt-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Heart 
                        key={i} 
                        className={`w-4 h-4 ${i <= (4 - sipsRemaining + 1) ? 'text-red-500 fill-red-500 animate-pulse' : 'text-stone-300'}`} 
                      />
                    ))}
                  </div>

                  <p className="font-pixel text-[9px] text-stone-700 mt-2">
                    {sipsRemaining > 0 ? `${sipsRemaining} SIPS REMAINING IN GLASS` : 'GLASS EMPTIED • HEART WARMED ✨'}
                  </p>

                  <button
                    onClick={handleSip}
                    disabled={sipsRemaining <= 0}
                    className={`mt-4 py-2.5 px-6 rounded-xl font-pixel text-xs border-2 border-[#1E232B] shadow-[2px_3px_0px_#1E232B] active:translate-y-0.5 transition-all cursor-pointer ${
                      sipsRemaining > 0
                        ? 'bg-[#D97706] hover:bg-[#B45309] text-white'
                        : 'bg-stone-200 text-stone-400 cursor-default shadow-none border-stone-300'
                    }`}
                  >
                    {sipsRemaining > 0 ? 'TAKE A WARM SIP ☕' : 'EMPTY GLASS ✨'}
                  </button>
                </div>

                {/* Illustrated Memory Diary Note */}
                <div className="bg-[#FFF8E7] p-6 rounded-3xl border-3 border-[#1E232B] shadow-[6px_6px_0px_#1E232B] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-amber-800">
                      <BookOpen className="w-4 h-4" />
                      <span className="font-pixel text-[8px] uppercase tracking-wider">{COZY_MEMORIES[memoryIdx].subtitle}</span>
                    </div>

                    <h4 className="font-display font-black text-xl text-stone-800 mb-2">
                      {COZY_MEMORIES[memoryIdx].title}
                    </h4>

                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                      "{COZY_MEMORIES[memoryIdx].story}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-amber-300/80">
                    <p className="font-mono text-[11px] font-bold text-amber-900">
                      {COZY_MEMORIES[memoryIdx].quote}
                    </p>
                  </div>
                </div>
              </div>

              {/* Brew Another Cup Action */}
              <div className="flex justify-center w-full mt-2">
                <button
                  onClick={handleRestart}
                  className="py-3 px-8 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-pixel text-xs border-3 border-[#1E232B] shadow-[4px_5px_0px_#1E232B] active:translate-y-1 active:shadow-[1px_1px_0px_#1E232B] transition-all cursor-pointer flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>BREW ANOTHER CUP</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Footer Note */}
      <div className="bg-[#1C1917] px-4 py-2.5 text-center border-t-2 border-[#1E232B]">
        <p className="font-mono text-[11px] text-amber-200/80 font-bold">
          Tip: Leave rain audio running in the background while exploring Abhijith's game projects! 🌧️
        </p>
      </div>
    </div>
  );
}
