import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import { PROJECTS } from '../../data/portfolioData';
import { soundEffects } from '../../utils/soundEffects';

interface OverworldMapProps {
  activeProjectId: string;
  onSelectProject: (id: string) => void;
}

// Mathematically calibrated platform centers for the 1024x768 Nintendo Overworld Map
const STAGES = [
  {
    id: 'start',
    name: 'START // PLAYER 1 SPAWN',
    type: 'START POINT',
    desc: 'Level 1-1 Entrance - Player 1 Ready at Starter Cottage',
    x: 26.66,
    y: 62.84,
    color: '#E60012',
    icon: '🚩',
    label: '1P START',
  },
  {
    id: 'echobound',
    name: 'STAGE 1: ECHOBOUND',
    type: 'BROWSER GAME DEMO',
    desc: 'Kinematic 2D/3D release with fluid movement, coyote buffering & interactive video',
    x: 34.99,
    y: 50.34,
    color: '#E60012',
    icon: '1',
    badge: 'PLAYABLE DEMO',
    label: 'STAGE 1',
  },
  {
    id: 'summer-reverie',
    name: 'STAGE 2: THE SUMMER REVERIE',
    type: 'NARRATIVE ADVENTURE',
    desc: 'Explore fading childhood memories in rural Kerala, recovering lost dream fragments',
    x: 50.61,
    y: 57.09,
    color: '#059669',
    icon: '2',
    badge: 'BYOG 2026 JAM ENTRY',
    label: 'STAGE 2',
  },
  {
    id: 'hgc',
    name: 'STAGE 3: HALLOWEEN GRAVEYARD CHALLENGE',
    type: '3D SURVIVAL STEALTH',
    desc: 'Survive a cursed cemetery, recover 5 elemental relics, and ignite Ancient Portal Ten',
    x: 63.38,
    y: 48.70,
    color: '#EA580C',
    icon: '3',
    badge: 'HALLOWEEN 3D RELEASE',
    label: 'STAGE 3',
  },
];

export function InteractiveOverworldMap({ activeProjectId, onSelectProject }: OverworldMapProps) {
  const [selectedStageId, setSelectedStageId] = useState<string>(activeProjectId);
  const [chestCollected, setChestCollected] = useState(false);
  const [showCoinPop, setShowCoinPop] = useState(false);

  // Synchronize when activeProjectId changes from the milestone pills or elsewhere
  useEffect(() => {
    setSelectedStageId(activeProjectId);
  }, [activeProjectId]);

  const selectedStage = STAGES.find(s => s.id === selectedStageId) || STAGES[1];

  const handleStageClick = (stage: typeof STAGES[0], shouldScroll = false) => {
    soundEffects.playJump();
    setSelectedStageId(stage.id);
    if (stage.id !== 'start') {
      onSelectProject(stage.id);
    }
    if (shouldScroll) {
      if (stage.id === 'start') {
        const heroEl = document.getElementById('hero');
        if (heroEl) heroEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        const showcaseEl = document.getElementById('stage-showcase');
        if (showcaseEl) showcaseEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleChestClick = () => {
    soundEffects.playCoin();
    setChestCollected(true);
    setShowCoinPop(true);
    setTimeout(() => setShowCoinPop(false), 1200);
    handleStageClick(STAGES[1], true);
  };

  const activeProject = PROJECTS.find(p => p.id === (selectedStage.id === 'start' ? 'echobound' : selectedStage.id));

  return (
    <div className="w-full mb-14">
      {/* Map Header Instructions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border-3 border-[#1E232B] shadow-[3px_3px_0px_#1E232B]">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--theme-primary)] animate-ping" />
          <span className="font-pixel text-[9px] text-[#1E232B]">OVERWORLD LEVEL MAP</span>
          <span className="text-slate-300">•</span>
          <span className="font-pixel text-[9px] text-[var(--theme-primary)]">TAP ANY PLATFORM TO WARP</span>
        </div>

        <div className="font-pixel text-[8px] text-slate-500 hidden sm:inline">
          CLICK [START] [1] [2] OR [3]
        </div>
      </div>

      {/* Floating Island Overworld Map - Floating in Open Sky (No Boxed Container) */}
      <motion.div 
        initial={{ opacity: 0, y: 35, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className="relative group max-w-4xl mx-auto"
      >
        {/* Decorative Floating Pixel Satellites / Mini-Islets */}
        <div className="absolute -top-6 -left-6 w-12 h-12 animate-pixel-island pointer-events-none hidden sm:block z-30">
          <div className="w-9 h-6 bg-[var(--theme-shelf-bg)] border-3 border-[#1E232B] rounded-t-md shadow-xs transition-colors" />
          <div className="w-7 h-4 bg-[#B85E38] border-x-3 border-b-3 border-[#1E232B] rounded-b-md ml-1" />
        </div>
        <div className="absolute top-1/3 -left-8 w-10 h-10 animate-pixel-island pointer-events-none hidden sm:block z-30" style={{ animationDelay: '1.5s' }}>
          <div className="w-8 h-5 bg-[var(--theme-shelf-bg)] border-3 border-[#1E232B] rounded-t-md shadow-xs transition-colors" />
          <div className="w-6 h-3 bg-[#B85E38] border-x-3 border-b-3 border-[#1E232B] rounded-b-md ml-1" />
        </div>
        <div className="absolute top-1/4 -right-6 w-10 h-10 animate-pixel-island pointer-events-none hidden sm:block z-30" style={{ animationDelay: '2.5s' }}>
          <div className="w-8 h-5 bg-[var(--theme-shelf-bg)] border-3 border-[#1E232B] rounded-t-md shadow-xs transition-colors" />
          <div className="w-6 h-3 bg-[#B85E38] border-x-3 border-b-3 border-[#1E232B] rounded-b-md ml-1" />
        </div>
        <div className="absolute -bottom-6 right-1/4 w-12 h-12 animate-pixel-island pointer-events-none hidden sm:block z-30" style={{ animationDelay: '3.2s' }}>
          <div className="w-9 h-6 bg-[var(--theme-shelf-bg)] border-3 border-[#1E232B] rounded-t-md shadow-xs transition-colors" />
          <div className="w-7 h-4 bg-[#B85E38] border-x-3 border-b-3 border-[#1E232B] rounded-b-md ml-1" />
        </div>

        {/* The Overworld Island Graphic Floating Seamlessly (Native 1024x768 = 4/3 Aspect Ratio) */}
        <div className="relative w-full aspect-[4/3] max-h-[660px] overflow-hidden rounded-[32px] border-4 border-[#1E232B] shadow-[6px_8px_0px_#1E232B] bg-[#C6E6FD]">
          <img
            src="/images/nintendo-world-map.jpg"
            alt="2D Nintendo Overworld Map Island"
            className="w-full h-full object-fill block select-none pointer-events-none"
            loading="eager"
            decoding="async"
          />

          {/* Secret Golden Treasure Chest Click Zone */}
          <button
            onClick={handleChestClick}
            style={{ left: '27.64%', top: '32.68%' }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group/chest focus:outline-none w-11 h-11 flex items-center justify-center"
            title="Secret Treasure Grove! Click to collect coins & view Stage 1"
          >
            {/* Chest Target Halo */}
            <div className={`w-8 h-8 rounded-full border-2 border-amber-400 bg-amber-300/30 shadow-[0_0_10px_rgba(251,191,36,0.8)] flex items-center justify-center text-xs transition-transform group-hover/chest:scale-130 group-hover/chest:rotate-12 group-hover/chest:shadow-[0_0_18px_rgba(251,191,36,1)] ${
              chestCollected ? 'opacity-80' : 'animate-pulse'
            }`}>
              ⭐
            </div>

            {/* Coin Pop Floating Particle */}
            <AnimatePresence>
              {showCoinPop && (
                <motion.span
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -30 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute -top-6 left-1/2 -translate-x-1/2 font-pixel text-[10px] font-black text-[#F59E0B] pointer-events-none whitespace-nowrap drop-shadow"
                >
                  🪙+100 COINS!
                </motion.span>
              )}
            </AnimatePresence>

            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-pixel text-[7px] text-amber-900 bg-amber-200 border border-[#1E232B] px-1.5 py-0.5 rounded-full opacity-0 group-hover/chest:opacity-100 group-hover/chest:-translate-y-1 transition-all whitespace-nowrap pointer-events-none shadow-xs">
              ★ CHEST GROVE
            </span>
          </button>

          {/* Perfectly Calibrated Interactive Hotspots on Each Platform Disc */}
          {STAGES.map((stage) => {
            const isSelected = selectedStage.id === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => {
                  const isAlreadySelected = isSelected;
                  handleStageClick(stage, isAlreadySelected);
                }}
                style={{ left: `${stage.x}%`, top: `${stage.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group/node focus:outline-none w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center"
                title={`${stage.name} - Tap to select & warp to stage`}
              >
                {/* Luminous Platform Target Ring (Never hides pre-baked numbers or art) */}
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                  isSelected
                    ? 'border-3 border-[var(--theme-primary)] shadow-[0_0_16px_var(--theme-primary)] bg-[var(--theme-primary)]/20 scale-110'
                    : 'border-2 border-white/70 group-hover/node:border-[var(--theme-primary)] group-hover/node:bg-[var(--theme-primary)]/25 group-hover/node:scale-120 group-hover/node:shadow-[0_0_16px_rgba(255,255,255,1)]'
                }`}>
                  {/* Pulsing Target Aura Ring when Selected */}
                  {isSelected && (
                    <span className="absolute -inset-1.5 sm:-inset-2 rounded-full border-2 sm:border-3 border-[var(--theme-primary)] animate-ping pointer-events-none opacity-80" />
                  )}
                </div>

                {/* Animated 2D Player 1 Pointer Pin Bouncing Standing on Platform */}
                {isSelected ? (
                  <motion.div
                    layoutId="playerPin"
                    className="absolute -top-10 sm:-top-11 left-1/2 -translate-x-1/2 bg-[var(--theme-primary)] text-white font-pixel text-[8px] sm:text-[9px] px-2.5 py-1 rounded-full border-2 border-[#1E232B] shadow-[2px_3px_0px_#1E232B] flex items-center gap-1.5 whitespace-nowrap pointer-events-none animate-bounce z-40"
                  >
                    <span className="text-[#FCD34D]">★</span>
                    <span>P1</span>
                    <span className="text-[10px]">▼</span>
                  </motion.div>
                ) : (
                  /* Peek Flag Indicator on Hover */
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1E232B] text-white font-pixel text-[7px] px-2 py-0.5 rounded-full border border-white/50 opacity-0 group-hover/node:opacity-100 group-hover/node:-translate-y-1 transition-all whitespace-nowrap pointer-events-none z-30 shadow-xs">
                    SELECT ▼
                  </div>
                )}

                {/* Hover Level Name Tooltip Banner */}
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full bg-[#1E232B] text-white font-pixel text-[8px] whitespace-nowrap opacity-0 group-hover/node:opacity-100 group-hover/node:translate-y-1 transition-all pointer-events-none shadow-md z-40 border border-white/30 flex items-center gap-1">
                  <span>{stage.label}:</span>
                  <span className="text-[var(--theme-accent)]">{stage.name.split(':')[1] || stage.name}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* In-Game Dialogue Speech Balloon Bar (Organic Curved Balloon with Pointer Tail, NOT a Rectangle Box) */}
        <div className="mt-4 speech-bubble-tail p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[var(--theme-primary-light)] border-3 border-[#1E232B] shadow-[2px_2px_0px_#1E232B] flex items-center justify-center font-pixel text-base text-[var(--theme-primary)] flex-shrink-0 transition-colors">
              {selectedStage.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[10px] text-[var(--theme-primary)] font-black">
                  {selectedStage.name}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  // {selectedStage.type}
                </span>
              </div>
              <p className="text-xs text-slate-700 font-semibold mt-0.5 line-clamp-1">
                {selectedStage.desc}
              </p>
            </div>
          </div>

          {/* Quick Action Navigation Buttons for Selected Stage */}
          <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
            {selectedStage.id === 'echobound' && activeProject ? (
              <>
                <a
                  href={activeProject.crayonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundEffects.playPowerup()}
                  className="btn-2d-red text-xs py-2 px-4 rounded-full flex-1 sm:flex-initial text-center inline-flex items-center justify-center gap-1.5"
                >
                  <span className="key-2d key-2d-red w-4 h-4 text-[7px]">A</span>
                  <span className="font-pixel text-[9px]">PLAY ON CRAYON ↗</span>
                  <Sparkles className="w-3 h-3" />
                </a>
                <a
                  href="#stage-showcase"
                  onClick={() => soundEffects.playSelect()}
                  className="btn-2d-white text-xs py-2 px-3.5 rounded-full flex-1 sm:flex-initial text-center"
                >
                  <span className="font-pixel text-[8px]">VIEW DIORAMA ↓</span>
                </a>
              </>
            ) : selectedStage.id === 'summer-reverie' && activeProject ? (
              <>
                {activeProject.indieConnectUrl && (
                  <a
                    href={activeProject.indieConnectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEffects.playPowerup()}
                    className="btn-2d-red text-xs py-2 px-4 rounded-full flex-1 sm:flex-initial text-center inline-flex items-center justify-center gap-1.5"
                  >
                    <span className="key-2d key-2d-red w-4 h-4 text-[7px]">A</span>
                    <span className="font-pixel text-[9px]">INDIE CONNECT ↗</span>
                    <Sparkles className="w-3 h-3" />
                  </a>
                )}
                {activeProject.downloadUrl && (
                  <a
                    href={activeProject.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEffects.playSelect()}
                    className="btn-2d-white text-xs py-2 px-3.5 rounded-full flex-1 sm:flex-initial text-center inline-flex items-center justify-center gap-1"
                  >
                    <span className="font-pixel text-[8px]">GET .ZIP ↓</span>
                  </a>
                )}
                <a
                  href="#stage-showcase"
                  onClick={() => soundEffects.playSelect()}
                  className="btn-2d-white text-xs py-2 px-3.5 rounded-full flex-1 sm:flex-initial text-center"
                >
                  <span className="font-pixel text-[8px]">VIEW DIORAMA ↓</span>
                </a>
              </>
            ) : selectedStage.id === 'hgc' && activeProject ? (
              <>
                {activeProject.itchUrl && (
                  <a
                    href={activeProject.itchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEffects.playPowerup()}
                    className="btn-2d-red text-xs py-2 px-4 rounded-full flex-1 sm:flex-initial text-center inline-flex items-center justify-center gap-1.5"
                  >
                    <span className="key-2d key-2d-red w-4 h-4 text-[7px]">A</span>
                    <span className="font-pixel text-[9px]">PLAY ON ITCH.IO ↗</span>
                    <Sparkles className="w-3 h-3" />
                  </a>
                )}
                <a
                  href="#stage-showcase"
                  onClick={() => soundEffects.playSelect()}
                  className="btn-2d-white text-xs py-2 px-3.5 rounded-full flex-1 sm:flex-initial text-center"
                >
                  <span className="font-pixel text-[8px]">VIEW DIORAMA ↓</span>
                </a>
              </>
            ) : selectedStage.id === 'start' ? (
              <a
                href="#hero"
                onClick={() => soundEffects.playJump()}
                className="btn-2d-white text-xs py-2 px-4 rounded-full flex-1 sm:flex-initial text-center"
              >
                <span className="key-2d w-4 h-4 text-[7px]">B</span>
                <span className="font-pixel text-[8px]">WARP TO START ↑</span>
              </a>
            ) : activeProject ? (
              <a
                href="#stage-showcase"
                onClick={() => soundEffects.playSelect()}
                className="btn-2d-red text-xs py-2 px-5 rounded-full flex-1 sm:flex-initial text-center flex items-center justify-center gap-1.5"
              >
                <span className="key-2d key-2d-red w-4 h-4 text-[7px]">A</span>
                <span className="font-pixel text-[9px]">INSPECT STAGE ↓</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            ) : null}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
