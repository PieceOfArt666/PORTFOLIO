import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Droplets, Sparkles, RotateCcw, Volume2, VolumeX, 
  Heart, BookOpen, CheckCircle2, ChevronRight
} from 'lucide-react';
import { chaiAudio } from './chaiAudio';

interface SpiceItem {
  id: string;
  name: string;
  malayalamName: string;
  icon: string;
  color: string;
  description: string;
  flavor: string;
}

const AVAILABLE_SPICES: SpiceItem[] = [
  { id: 'cardamom', name: 'Cardamom', malayalamName: 'Elaichi', icon: '🌿', color: '#10B981', description: 'Sweet, floral & highly aromatic', flavor: '+Floral Fragrance' },
  { id: 'ginger', name: 'Fresh Ginger', malayalamName: 'Inji', icon: '🫚', color: '#F59E0B', description: 'Fiery, warming monsoon kick', flavor: '+Spicy Warmth' },
  { id: 'cinnamon', name: 'Cinnamon Bark', malayalamName: 'Karukapatta', icon: '🪵', color: '#B45309', description: 'Rich woody sweetness', flavor: '+Deep Sweetness' },
  { id: 'cloves', name: 'Cloves', malayalamName: 'Grampoo', icon: '🌰', color: '#78350F', description: 'Pungent, comforting bite', flavor: '+Aromatic Punch' },
  { id: 'tea', name: 'Assam Tea Leaves', malayalamName: 'Chaya Podi', icon: '🍃', color: '#451A03', description: 'Strong, brisk malty base', flavor: '+Bold Body' },
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
    quote: "\"Warm your hands on the clay first. The tea warms the rest.\""
  },
  {
    title: "The Meter Chai Acrobat",
    subtitle: "Kerala street vendor craft",
    story: "Standing under the tin roof of the railway tea stall, watching the tea-master pull the tea between two aluminum jugs in a three-foot golden stream. The frothy head was like warm velvet on a stormy evening.",
    quote: "\"The foam is where the secrets of the spice live.\""
  }
];

export function MonsoonChaiGame() {
  // Step 1: Mortar grind, Step 2: Boil & Milk, Step 3: Meter Pour, Step 4: Savor & Story
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Sound & Rain state
  const [rainActive, setRainActive] = useState(false);

  // Step 1: Spice selection & grinding
  const [mortarSpices, setMortarSpices] = useState<string[]>(['tea']);
  const [grindProgress, setGrindProgress] = useState(0);
  const [grindShake, setGrindShake] = useState(false);

  // Step 2: Boil & Ingredients
  const [hasAddedSpices, setHasAddedSpices] = useState(false);
  const [milkAdded, setMilkAdded] = useState(false);
  const [sweetener, setSweetener] = useState<'none' | 'jaggery' | 'sugar'>('none');
  const [flameLevel, setFlameLevel] = useState<number>(50); // 0 to 100
  const [brewColorTime, setBrewColorTime] = useState(0); // steeping progress

  // Step 3: Pouring
  const [isPouring, setIsPouring] = useState(false);
  const [pourProgress, setPourProgress] = useState(0);
  const [frothScore, setFrothScore] = useState(0);

  // Step 4: Savor
  const [sipsRemaining, setSipsRemaining] = useState(4);
  const [memoryIdx, setMemoryIdx] = useState(0);

  // Canvas ref for raindrop glass effect
  const rainCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle rain simulation on canvas
  useEffect(() => {
    const canvas = rainCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth || 500);
    let height = (canvas.height = canvas.offsetHeight || 380);

    const drops: Array<{ x: number; y: number; length: number; speed: number; opacity: number }> = [];
    for (let i = 0; i < 45; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 12 + Math.random() * 18,
        speed: 2 + Math.random() * 4,
        opacity: 0.2 + Math.random() * 0.35,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Soft rain streaks
      ctx.strokeStyle = '#93C5FD';
      ctx.lineWidth = 1.5;

      for (const d of drops) {
        ctx.beginPath();
        ctx.globalAlpha = d.opacity;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 2, d.y + d.length);
        ctx.stroke();

        d.y += d.speed;
        d.x -= 0.5;
        if (d.y > height) {
          d.y = -20;
          d.x = Math.random() * width;
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 500;
      height = canvas.height = canvas.offsetHeight || 380;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Boil timer loop
  useEffect(() => {
    if (step !== 2 || !hasAddedSpices) return;

    const interval = setInterval(() => {
      if (flameLevel > 20) {
        chaiAudio.playBubble();
        setBrewColorTime(prev => Math.min(100, prev + (flameLevel > 70 ? 2.5 : 1.2)));
      }
    }, 450);

    return () => clearInterval(interval);
  }, [step, hasAddedSpices, flameLevel]);

  // Handle pouring loop
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
        return prev + 2.5;
      });

      setFrothScore(prev => Math.min(100, prev + 2.2));
    }, 100);

    return () => clearInterval(interval);
  }, [isPouring, step]);

  // Toggle ambient rain
  const handleToggleRain = () => {
    if (rainActive) {
      chaiAudio.stopRain();
      setRainActive(false);
    } else {
      chaiAudio.startRain(0.12);
      setRainActive(true);
    }
  };

  // Add spice to mortar
  const handleAddSpice = (spiceId: string) => {
    if (mortarSpices.length >= 5) return;
    chaiAudio.playSpiceCrunch();
    setMortarSpices(prev => [...prev, spiceId]);
  };

  // Grind mortar
  const handleGrind = () => {
    chaiAudio.playGrind();
    chaiAudio.playSpiceCrunch();
    setGrindShake(true);
    setTimeout(() => setGrindShake(false), 200);
    setGrindProgress(prev => Math.min(100, prev + 22));
  };

  // Reset to start a new cup
  const handleRestart = () => {
    chaiAudio.playCupClink();
    setStep(1);
    setMortarSpices(['tea']);
    setGrindProgress(0);
    setHasAddedSpices(false);
    setMilkAdded(false);
    setSweetener('none');
    setFlameLevel(50);
    setBrewColorTime(0);
    setPourProgress(0);
    setFrothScore(0);
    setSipsRemaining(4);
    setMemoryIdx((prev) => (prev + 1) % COZY_MEMORIES.length);
  };

  // Sip chai
  const handleSip = () => {
    if (sipsRemaining <= 0) return;
    chaiAudio.playCupClink();
    setSipsRemaining(prev => prev - 1);
    if (sipsRemaining === 1) {
      chaiAudio.playChimeChord();
    }
  };

  // Helper color calculation for boiling tea
  const getTeaLiquorColor = () => {
    if (!hasAddedSpices) return '#93C5FD'; // pure water
    if (milkAdded) {
      // Golden creamy masala hue
      return brewColorTime > 60 ? '#C48858' : '#D6AB86';
    }
    // Deep amber herbal decoction
    if (brewColorTime < 30) return '#C27835';
    if (brewColorTime < 70) return '#8A3B14';
    return '#4E1F09';
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden border-4 border-[#1E232B] shadow-[8px_10px_0px_#1E232B] bg-[#FFFBEB] select-none">
      {/* 1. Cozy Game Header with Ambient Audio Toggle & Step Pills */}
      <div className="bg-[#292524] text-white px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b-4 border-[#1E232B]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#D97706] border-2 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] flex items-center justify-center text-lg">
            ☕
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[10px] text-[#FDE68A] tracking-wider">MONSOON CHAI</span>
              <span className="text-[10px] text-amber-200/60 font-mono font-bold">• മഴക്കാല ചായ</span>
            </div>
            <p className="text-[11px] text-stone-300 font-medium">A Tactile Brewing Simulation • Kerala Monsoon Verandah</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Ambient Rain Sound Button */}
          <button
            onClick={handleToggleRain}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-[#1E232B] text-xs font-mono font-bold transition-all cursor-pointer ${
              rainActive
                ? 'bg-[#38BDF8] text-[#1E232B] shadow-[2px_2px_0px_#1E232B]'
                : 'bg-stone-700 hover:bg-stone-600 text-stone-200'
            }`}
            title="Toggle Ambient Rainfall Soundscape"
          >
            {rainActive ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="font-pixel text-[8px]">{rainActive ? 'RAIN: ON' : 'RAIN: MUTED'}</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={handleRestart}
            className="p-1.5 rounded-full bg-stone-700 hover:bg-stone-600 text-stone-200 border-2 border-[#1E232B] cursor-pointer"
            title="Brew Fresh Cup"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Step Navigator Breadcrumbs */}
      <div className="bg-[#FEF3C7] px-4 sm:px-6 py-2.5 border-b-2 border-amber-200/80 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-1">
          {[
            { num: 1, label: '1. BRUISE SPICES' },
            { num: 2, label: '2. SIMMER & BREW' },
            { num: 3, label: '3. METER POUR' },
            { num: 4, label: '4. SAVOR & MEMORY' },
          ].map((s) => (
            <div 
              key={s.num}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-pixel transition-all ${
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

        <div className="hidden md:flex items-center gap-1.5 text-stone-500 font-pixel text-[8px]">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>ZERO STRESS • TACTILE PLAY</span>
        </div>
      </div>

      {/* 3. Main Interactive Cooking Canvas Container */}
      <div className="relative min-h-[460px] p-4 sm:p-8 flex flex-col justify-between overflow-hidden">
        {/* Soft Kerala Monsoon Rain Backdrop Canvas */}
        <canvas
          ref={rainCanvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0"
        />

        {/* Ambient Steam Particles in background */}
        <div className="absolute top-8 right-12 pointer-events-none opacity-25">
          <div className="w-16 h-28 bg-gradient-to-t from-amber-400/20 to-transparent blur-xl animate-pulse" />
        </div>

        {/* STAGE 1: SPICE SELECTION & MORTAR GRINDING */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative z-10 flex flex-col items-center justify-between flex-1 gap-6"
            >
              <div className="text-center max-w-lg">
                <span className="font-pixel text-[9px] px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 shadow-xs">
                  STAGE 1: THE MORTAR & PESTLE
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-stone-800 mt-2">
                  Select & Bruise Your Spices
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Click fresh spices on the tray to drop them into the brass mortar, then tap the pestle to crush them into fragrant aromatics.
                </p>
              </div>

              {/* The Central Mortar & Pestle Visual */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full">
                {/* Brass Mortar */}
                <div 
                  className={`relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-br from-[#F59E0B] via-[#D97706] to-[#78350F] p-3.5 border-4 border-[#1E232B] shadow-[6px_8px_0px_#1E232B] flex items-center justify-center transition-transform ${
                    grindShake ? 'scale-105 -rotate-2' : ''
                  }`}
                >
                  {/* Inner mortar hollow bowl */}
                  <div className="relative w-full h-full rounded-full bg-gradient-to-b from-[#451A03] to-[#1C1917] border-3 border-amber-900/60 shadow-inner flex flex-wrap items-center justify-center p-4 overflow-hidden">
                    {mortarSpices.length === 0 ? (
                      <span className="font-pixel text-[8px] text-amber-300/40 text-center">
                        MORTAR IS EMPTY<br />TAP SPICES BELOW
                      </span>
                    ) : (
                      mortarSpices.map((sId, idx) => {
                        const spice = AVAILABLE_SPICES.find(item => item.id === sId);
                        return (
                          <motion.span
                            key={idx}
                            initial={{ scale: 0, y: -20 }}
                            animate={{ scale: grindProgress > 60 ? 0.75 : 1, y: 0 }}
                            className="text-2xl sm:text-3xl filter drop-shadow select-none cursor-pointer"
                            title={`${spice?.name} (${spice?.malayalamName})`}
                          >
                            {spice?.icon}
                          </motion.span>
                        );
                      })
                    )}

                    {/* Aromatic dust particle glow when ground */}
                    {grindProgress > 20 && (
                      <div 
                        className="absolute inset-0 bg-amber-500/20 mix-blend-screen pointer-events-none animate-pulse" 
                        style={{ opacity: grindProgress / 100 }}
                      />
                    )}
                  </div>

                  {/* Brass pestle handle resting in mortar */}
                  <div className="absolute -top-6 -right-3 w-8 h-24 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-700 rounded-full border-3 border-[#1E232B] rotate-25 shadow-md pointer-events-none" />
                </div>

                {/* Grinding Controls & Progress */}
                <div className="flex flex-col items-center sm:items-start gap-3">
                  <div className="bg-white/80 backdrop-blur p-4 rounded-2xl border-3 border-[#1E232B] shadow-[3px_4px_0px_#1E232B] w-64">
                    <div className="flex items-center justify-between text-xs font-mono font-bold mb-1.5 text-stone-700">
                      <span>CRUSH & GRIND:</span>
                      <span className="font-pixel text-amber-700">{grindProgress}%</span>
                    </div>
                    <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden border-2 border-[#1E232B]">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 transition-all duration-200"
                        style={{ width: `${grindProgress}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-2 font-medium">
                      {grindProgress >= 100 
                        ? '✨ Perfectly bruised! Aromatics released.'
                        : 'Tap pestle to release essential oils.'}
                    </p>
                  </div>

                  <button
                    onClick={handleGrind}
                    className="w-full py-3 px-6 rounded-2xl bg-[#D97706] hover:bg-[#B45309] text-white font-pixel text-xs border-3 border-[#1E232B] shadow-[4px_4px_0px_#1E232B] active:translate-y-1 active:shadow-[1px_1px_0px_#1E232B] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>🔨 POUND PESTLE</span>
                  </button>
                </div>
              </div>

              {/* Wooden Spice Tray Selector */}
              <div className="w-full bg-[#E7E5E4] p-3 sm:p-4 rounded-2xl border-3 border-[#1E232B] shadow-[4px_4px_0px_#1E232B]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-pixel text-[8px] text-stone-600">WOODEN SPICE TRAY (TAP TO ADD):</span>
                  <span className="text-xs font-mono font-bold text-stone-500">{mortarSpices.length}/5 Added</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {AVAILABLE_SPICES.map((spice) => {
                    const count = mortarSpices.filter(s => s === spice.id).length;
                    return (
                      <button
                        key={spice.id}
                        onClick={() => handleAddSpice(spice.id)}
                        className="flex flex-col items-center p-2.5 rounded-xl bg-white hover:bg-amber-50 border-2 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] active:translate-y-0.5 transition-all text-left group cursor-pointer"
                      >
                        <span className="text-2xl group-hover:scale-110 transition-transform">{spice.icon}</span>
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

          {/* STAGE 2: SIMMER & BREW ON BRASS STOVE */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative z-10 flex flex-col items-center justify-between flex-1 gap-6"
            >
              <div className="text-center max-w-lg">
                <span className="font-pixel text-[9px] px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 shadow-xs">
                  STAGE 2: THE BRASS KETTLE
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-stone-800 mt-2">
                  Simmer, Milk & Steep
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  Add the ground aromatics, adjust flame heat to rolling boil, pour rich milk, and watch the brew darken to golden perfection.
                </p>
              </div>

              {/* Boiling Saucepan Simulation */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full">
                <div className="relative flex flex-col items-center">
                  {/* Animated Rising Steam Clouds */}
                  {hasAddedSpices && (
                    <div className="absolute -top-14 flex gap-3 pointer-events-none">
                      <motion.div 
                        animate={{ y: [-5, -25], opacity: [0.6, 0] }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: "easeOut" }}
                        className="text-2xl"
                      >
                        ♨
                      </motion.div>
                      <motion.div 
                        animate={{ y: [-5, -30], opacity: [0.7, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.4, ease: "easeOut" }}
                        className="text-3xl"
                      >
                        ♨
                      </motion.div>
                    </div>
                  )}

                  {/* Saucepan Top View */}
                  <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-stone-700 p-3 border-4 border-[#1E232B] shadow-[6px_8px_0px_#1E232B] flex items-center justify-center">
                    {/* Kettle handle */}
                    <div className="absolute -left-12 top-1/2 -translate-y-1/2 w-14 h-6 bg-[#78350F] border-3 border-[#1E232B] rounded-l-xl" />

                    {/* Simmering Tea Liquid Pool */}
                    <div 
                      className="relative w-full h-full rounded-full transition-colors duration-700 border-3 border-amber-900/60 shadow-inner flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: getTeaLiquorColor() }}
                    >
                      {/* Floating Bubbles */}
                      {hasAddedSpices && flameLevel > 20 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs animate-ping opacity-60">🫧</span>
                          <span className="text-base animate-pulse opacity-50 ml-6">🫧</span>
                          <span className="text-sm animate-bounce opacity-70 -mt-8">🫧</span>
                        </div>
                      )}

                      {!hasAddedSpices ? (
                        <span className="font-pixel text-[8px] text-white/80 text-center px-4">
                          WATER IS WARM<br />ADD GROUND SPICES ➔
                        </span>
                      ) : (
                        <span className="font-pixel text-[8px] text-white/70 text-center drop-shadow">
                          {milkAdded ? 'MASALA CHAI STEEPING' : 'BLACK TEA EXTRACTING'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Burner Flame beneath saucepan */}
                  <div className="flex items-center gap-1.5 mt-3">
                    <Flame className={`w-5 h-5 ${flameLevel > 20 ? 'text-amber-500 animate-pulse' : 'text-stone-400'}`} />
                    <span className="font-pixel text-[9px] text-stone-700">
                      FLAME: {flameLevel > 70 ? 'ROLLING BOIL' : flameLevel > 20 ? 'GENTLE SIMMER' : 'OFF'}
                    </span>
                  </div>
                </div>

                {/* Cooking Controls Box */}
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
                      setMilkAdded(true);
                    }}
                    className={`p-3 rounded-2xl font-pixel text-xs border-3 border-[#1E232B] flex items-center justify-between transition-all ${
                      !milkAdded && hasAddedSpices
                        ? 'bg-white hover:bg-stone-100 text-[#1E232B] shadow-[3px_4px_0px_#1E232B] cursor-pointer'
                        : milkAdded
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-500 cursor-default'
                        : 'bg-stone-200 text-stone-400 border-stone-300 cursor-not-allowed'
                    }`}
                  >
                    <span>{milkAdded ? '✓ FRESH MILK ADDED' : '+ POUR FRESH MILK 🥛'}</span>
                    <Droplets className="w-4 h-4" />
                  </button>

                  {/* Sweetener Options */}
                  <div className="bg-white/90 p-3 rounded-2xl border-3 border-[#1E232B] shadow-[2px_3px_0px_#1E232B]">
                    <span className="font-pixel text-[8px] text-stone-600 block mb-1.5">CHOOSE SWEETENER:</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          chaiAudio.playCupClink();
                          setSweetener('jaggery');
                        }}
                        className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold border-2 transition-all cursor-pointer ${
                          sweetener === 'jaggery'
                            ? 'bg-[#B45309] text-white border-[#1E232B]'
                            : 'bg-stone-100 hover:bg-stone-200 border-stone-300 text-stone-700'
                        }`}
                      >
                        🍯 Jaggery (Vellam)
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
                      <span>STOVE FLAME:</span>
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

              {/* Next Step Button */}
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

          {/* STAGE 3: THE HIGH-POUR METER CHAI */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
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
                  Hold down the pour button to pull the tea from height into the clay kulhad. A steady pour aerates the milk and builds rich golden froth!
                </p>
              </div>

              {/* Pouring Interaction Canvas / Graphic */}
              <div className="flex flex-col items-center justify-center gap-6 w-full max-w-md">
                <div className="relative w-64 h-64 bg-amber-50 rounded-3xl border-4 border-[#1E232B] shadow-[6px_8px_0px_#1E232B] flex flex-col items-center justify-between p-4 overflow-hidden">
                  {/* Top kettle pouring stream */}
                  <div className="w-16 h-10 bg-amber-700 rounded-b-xl border-3 border-[#1E232B] flex items-center justify-center text-white font-pixel text-[8px]">
                    KETTLE
                  </div>

                  {/* Flowing liquid stream */}
                  {isPouring && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      className="w-3.5 h-36 bg-gradient-to-b from-[#B45309] to-[#D97706] rounded-full shadow-md"
                    />
                  )}

                  {/* Clay Kulhad Cup at Bottom */}
                  <div className="relative w-28 h-24 bg-[#B45309] rounded-b-3xl border-4 border-[#1E232B] shadow-inner flex flex-col justify-end p-2 overflow-hidden">
                    {/* Fill level inside cup */}
                    <div 
                      className="w-full bg-[#C48858] rounded-b-2xl transition-all duration-300 relative flex items-center justify-center"
                      style={{ height: `${Math.min(100, pourProgress)}%` }}
                    >
                      {/* Frothy crema head */}
                      {pourProgress > 20 && (
                        <div className="absolute top-0 inset-x-0 h-4 bg-[#FDE68A] rounded-full opacity-90 flex items-center justify-center">
                          <span className="text-[8px] animate-pulse">🫧</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pour Button & Froth Gauge */}
                <div className="w-full flex flex-col items-center gap-3">
                  <div className="w-full bg-white p-3 rounded-2xl border-3 border-[#1E232B] shadow-[2px_3px_0px_#1E232B]">
                    <div className="flex justify-between items-center text-xs font-mono font-bold text-stone-700 mb-1">
                      <span>CUP FILL LEVEL:</span>
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
                    <span>{pourProgress < 100 ? 'HOLD TO PULL CHAI ☕' : '✓ CUP IS FULL!'}</span>
                  </button>
                </div>
              </div>

              {/* Complete Step Button */}
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

          {/* STAGE 4: SAVOR & UNLOCK MONSOON MEMORY */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
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
                  Your handcrafted chai rests on the rainy verandah windowsill. Take a sip and read from the journal.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl items-center">
                {/* Steaming Clay Kulhad on Windowsill */}
                <div className="bg-gradient-to-b from-amber-100/90 to-amber-200/90 backdrop-blur p-6 rounded-3xl border-3 border-[#1E232B] shadow-[6px_6px_0px_#1E232B] flex flex-col items-center justify-center text-center">
                  {/* Steam Animation */}
                  {sipsRemaining > 0 && (
                    <div className="flex gap-2 -mb-2 pointer-events-none">
                      <motion.div 
                        animate={{ y: [-5, -25], opacity: [0.8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.6, ease: "easeOut" }}
                        className="text-2xl text-amber-700"
                      >
                        ♨
                      </motion.div>
                      <motion.div 
                        animate={{ y: [-5, -30], opacity: [0.9, 0] }}
                        transition={{ repeat: Infinity, duration: 1.4, delay: 0.3, ease: "easeOut" }}
                        className="text-3xl text-amber-800"
                      >
                        ♨
                      </motion.div>
                    </div>
                  )}

                  {/* Cup Icon */}
                  <div className="text-6xl sm:text-7xl filter drop-shadow-md select-none my-2">
                    🍵
                  </div>

                  <div className="flex items-center gap-1.5 mt-2">
                    {[1, 2, 3, 4].map((i) => (
                      <Heart 
                        key={i} 
                        className={`w-4 h-4 ${i <= sipsRemaining ? 'text-red-500 fill-red-500 animate-pulse' : 'text-stone-300'}`} 
                      />
                    ))}
                  </div>

                  <p className="font-pixel text-[9px] text-stone-700 mt-2">
                    {sipsRemaining > 0 ? `${sipsRemaining} SIPS REMAINING` : 'CUP FINISHED • HEART WARMED'}
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
                    {sipsRemaining > 0 ? 'TAKE A SIP ☕' : 'EMPTY CUP ✨'}
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
      <div className="bg-[#292524] px-4 py-2 text-center border-t-2 border-[#1E232B]">
        <p className="font-mono text-[11px] text-amber-200/80 font-bold">
          Tip: Leave rain audio running in the background while exploring Abhijith's game projects! 🌧️
        </p>
      </div>
    </div>
  );
}
